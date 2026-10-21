/**
 * Embed entry: mount one SDKWork IM surface into a host-owned container.
 *
 * The standalone application owns this build so the host never compiles IM
 * sources. The host passes deployment, session, locale, and appearance facts
 * through {@link ImPcEmbedMountOptions}; the entry configures the IM runtime
 * once and renders the requested surface inside a shadow root so the IM
 * stylesheet cannot leak into the host document.
 */
import { Component, createElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  configureImPcEmbedRuntime,
  type ImPcEmbedRuntime,
  type ImPcEmbedSession,
} from '../../packages/sdkwork-im-pc-embed/src/runtime';
import { ImPcSurfaceProviders } from '../../packages/sdkwork-im-pc-embed/src/surfaces/ImPcSurfaceProviders';
import { ImConversationListSurface } from '../../packages/sdkwork-im-pc-embed/src/surfaces/ImConversationListSurface';
import { ImChatSurface } from '../../packages/sdkwork-im-pc-embed/src/surfaces/ImChatSurface';
import { ImContactsSurface } from '../../packages/sdkwork-im-pc-embed/src/surfaces/ImContactsSurface';
import { imPcSurfaceI18n } from '../../packages/sdkwork-im-pc-chat/src/embed-chrome';
import { chatService } from '../../packages/sdkwork-im-pc-chat/src/embed-services';
import css from '../index.css?inline';

/** The IM surface a host mounts. */
export type ImPcSurfaceKind = 'conversation-list' | 'conversation' | 'contacts';

/**
 * Host contract version. The bundle is deployed and upgraded independently from
 * its hosts, so both sides state the contract they implement; a host that knows
 * this version can mount, while a mismatch is reported instead of failing
 * inside a surface.
 */
export const version = 1;

/** Host-provided facts and callbacks for one mounted surface. */
export interface ImPcEmbedMountOptions {
  /** Surface to render. */
  kind: ImPcSurfaceKind;
  /** SDKWork API gateway origin serving `/im/v3/api`. */
  apiBaseUrl: string;
  /** Realtime origin; derived from {@link apiBaseUrl} when omitted. */
  websocketBaseUrl?: string;
  /** Host-authenticated dual-token session. */
  session: ImPcEmbedSession | null;
  /** Conversation the conversation surface renders. */
  conversationId?: string;
  /** Conversation the list marks as selected. */
  selectedConversationId?: string;
  /** Host color scheme; the IM UI ships a dark palette. */
  colorScheme?: 'light' | 'dark';
  /** Host language; the IM surfaces default to Simplified Chinese. */
  locale?: 'zh-CN' | 'en-US';
  /** Reports the inbox unread total whenever it changes. */
  onUnreadChange?: (totalUnread: number) => void;
  /** Called when the user selects a conversation in the list. */
  onConversationSelect?: (conversationId: string) => void;
  /** Called when the user asks to open a conversation from the contacts surface. */
  onConversationOpen?: (conversationId: string) => void;
  /** Reports a mount-time failure to the host. */
  onError?: (error: unknown) => void;
}

/** Handle a host keeps for the mounted surface. */
export interface ImPcEmbedSurfaceHandle {
  /** Re-render with new options (session, selection, color scheme). */
  update(options: ImPcEmbedMountOptions): void;
  /** Unmount the surface and release the runtime when it was the last one. */
  unmount(): void;
}

interface MountedSurface {
  readonly root: Root;
  readonly host: HTMLDivElement;
  readonly shadow: ShadowRoot;
  options: ImPcEmbedMountOptions;
}

let runtime: ImPcEmbedRuntime | null = null;
let runtimeKey = '';
/**
 * A mode switch unmounts every IM surface and mounts another within a couple of
 * frames. Keep the SDK client and its realtime socket briefly so the next
 * surface reuses them instead of re-authenticating a fresh connection.
 */
const RUNTIME_IDLE_DISPOSE_MS = 2_000;
let runtimeIdleTimer: ReturnType<typeof setTimeout> | undefined;
/** Error already reported for the current runtime key, so one failure one notice. */
let reportedRuntimeError: string | null = null;

function cancelRuntimeIdleDispose(): void {
  if (runtimeIdleTimer) {
    clearTimeout(runtimeIdleTimer);
    runtimeIdleTimer = undefined;
  }
}

function scheduleRuntimeIdleDispose(): void {
  cancelRuntimeIdleDispose();
  runtimeIdleTimer = setTimeout(() => {
    runtimeIdleTimer = undefined;
    runtime?.dispose();
    runtime = null;
    runtimeKey = '';
  }, RUNTIME_IDLE_DISPOSE_MS);
}
let mountedSurfaces = 0;

/**
 * Build the surface element tree for one option set.
 * @param options current mount options.
 * @returns the surface tree.
 */
function surfaceElement(options: ImPcEmbedMountOptions): ReactNode {
  if (options.kind === 'conversation-list') {
    return createElement(ImConversationListSurface, {
      selectedConversationId: options.selectedConversationId,
      onConversationSelect: (conversationId: string) => {
        options.onConversationSelect?.(conversationId);
      },
    });
  }
  if (options.kind === 'conversation') {
    return createElement(ImChatSurface, {
      conversationId: options.conversationId ?? '',
    });
  }
  return createElement(ImContactsSurface, {
    onConversationOpen: (conversationId: string) => {
      options.onConversationOpen?.(conversationId);
    },
  });
}

/**
 * Install or replace the shared IM runtime for the current host facts.
 *
 * Never throws: a runtime that cannot use a host fact records the failure on
 * its handle, the surface still mounts, and the host receives one notice for
 * the broken fact instead of the interface disappearing.
 * @param options current mount options.
 * @returns the installed runtime, or null while it cannot be created.
 */
function ensureRuntime(options: ImPcEmbedMountOptions): ImPcEmbedRuntime | null {
  const nextKey = [options.apiBaseUrl, options.session?.accessToken ?? '', options.session?.authToken ?? ''].join('\u0000');
  if (runtime !== null && nextKey === runtimeKey) {
    return runtime;
  }
  runtime?.dispose();
  runtime = null;
  runtimeKey = '';
  reportedRuntimeError = null;
  const next = configureImPcEmbedRuntime({
    apiBaseUrl: options.apiBaseUrl,
    ...(options.websocketBaseUrl ? { websocketBaseUrl: options.websocketBaseUrl } : {}),
    session: options.session,
  });
  runtime = next;
  runtimeKey = nextKey;
  if (next.error !== null) {
    reportedRuntimeError = next.error.code;
    console.error('[sdkwork-im-pc] embed runtime initialized with a degraded connection', next.error);
    options.onError?.(next.error);
  }
  return next;
}

/** Minimal dark product shell the surface falls back to when the IM UI throws. */
function EmbedSkeleton(): ReactNode {
  const rows = Array.from({ length: 6 }, (_, index) => createElement('div', {
    key: index,
    style: { height: '44px', borderRadius: '8px', background: '#222' },
  }));
  return createElement('div', {
    style: { display: 'flex', height: '100%', minHeight: '0', background: '#181818' },
  },
    createElement('div', {
      style: { width: '280px', flex: 'none', borderRight: '1px solid #2a2a2a', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' },
    }, ...rows),
    createElement('div', {
      style: { flex: '1', display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px' },
    },
      createElement('div', { style: { height: '16px', width: '35%', borderRadius: '6px', background: '#222' } }),
      createElement('div', { style: { flex: '1', borderRadius: '10px', background: '#1c1c1c' } })));
}

interface SurfaceBoundaryState {
  readonly failed: boolean;
}

/** Contain one crashed IM surface so its shell remains visible to the user. */
class SurfaceBoundary extends Component<{ readonly children: ReactNode; readonly onError?: (error: unknown) => void }, SurfaceBoundaryState> {
  state: SurfaceBoundaryState = { failed: false };

  static getDerivedStateFromError(): SurfaceBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown): void {
    console.error('[sdkwork-im-pc] embed surface crashed', error);
    this.props.onError?.(error);
  }

  render(): ReactNode {
    return this.state.failed ? createElement(EmbedSkeleton, null) : this.props.children;
  }
}

/**
 * Render one surface into a host container.
 * @param container host element the surface fills.
 * @param options deployment, session, appearance, and callbacks.
 * @returns the handle controlling the mounted surface.
 */
export function mountSurface(container: HTMLElement, options: ImPcEmbedMountOptions): ImPcEmbedSurfaceHandle {
  cancelRuntimeIdleDispose();
  ensureRuntime(options);
  void imPcSurfaceI18n.changeLanguage(options.locale ?? 'zh-CN');

  const host = document.createElement('div');
  host.className = 'im-embed';
  host.style.height = '100%';
  host.style.minHeight = '0';
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = css;
  shadow.appendChild(style);
  const mountPoint = document.createElement('div');
  // The IM Tailwind sheet keys dark utilities on a `.dark` ancestor; the class
  // must sit inside the shadow tree because document selectors do not cross the
  // shadow boundary.
  mountPoint.className = options.colorScheme === 'light' ? 'im-embed-root' : 'im-embed-root dark';
  mountPoint.style.height = '100%';
  mountPoint.style.minHeight = '0';
  shadow.appendChild(mountPoint);
  container.appendChild(host);

  const surface: MountedSurface = {
    root: createRoot(mountPoint),
    host,
    shadow,
    options,
  };
  mountedSurfaces += 1;

  const reportUnread = (): void => {
    void chatService.getChats()
      .then((chats) => {
        options.onUnreadChange?.(chats.reduce((total, chat) => total + chat.unreadCount, 0));
      })
      .catch(() => undefined);
  };
  const offUnread = chatService.subscribeChats((chats) => {
    options.onUnreadChange?.(chats.reduce((total, chat) => total + chat.unreadCount, 0));
  });
  reportUnread();

  const render = (next: ImPcEmbedMountOptions): void => {
    ensureRuntime(next);
    surface.options = next;
    surface.root.render(createElement(SurfaceBoundary, {
      onError: (error: unknown) => { next.onError?.(error); },
      children: createElement(ImPcSurfaceProviders, null, surfaceElement(next)),
    }));
  };
  render(options);

  return {
    update(next: ImPcEmbedMountOptions): void {
      render(next);
    },
    unmount(): void {
      offUnread();
      surface.root.unmount();
      host.remove();
      mountedSurfaces -= 1;
      if (mountedSurfaces === 0) {
        scheduleRuntimeIdleDispose();
      }
    },
  };
}

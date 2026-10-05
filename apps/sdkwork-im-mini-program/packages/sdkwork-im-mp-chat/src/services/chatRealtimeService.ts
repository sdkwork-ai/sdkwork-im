/**
 * Live realtime connection for the IM mini program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and the CCP
 * realtime contract. The wx socket factory is injected by the root bootstrap
 * into the IM client, so this service only opens `client.connect()` and
 * multiplexes decoded messages — it never touches `wx.*` and never constructs
 * a client.
 *
 * Shape mirrors the mobile reference (`sdkwork_im_flutter_mobile_chat`'s
 * `chat_realtime_service.dart`) and the H5 lease manager: one shared
 * connection, reference-counted per-conversation leases, exponential backoff
 * with jitter, and a reconnect loop that stops on auth failure (a stale
 * session must not spin forever; a session change restarts it via
 * `recover()`).
 */

import type {
  ImConnectOptions,
  ImDecodedMessage,
  ImLiveConnection,
  ImLiveConnectionState,
  ImMessageContext,
} from "@sdkwork/im-mp-core/sdk";

import type { ImMpChatClientResolver } from "../types/chatTypes";

export type ImMpChatRealtimeMessageHandler = (
  message: ImDecodedMessage,
  context: ImMessageContext,
) => void;

/** Notified with the typing peer's user id (`conversation.typing` payload). */
export type ImMpChatTypingHandler = (peerUserId: string) => void;

export type ImMpChatRefreshHandler = () => void;

export type ImMpChatRealtimeSubscription = () => void;

/** The wire event type tag for typing pushes (`im-domain-core` typing.rs). */
const IM_MP_TYPING_EVENT_TYPE = "conversation.typing";

export interface ImMpChatRealtimeService {
  /**
   * Acquires one lease on a conversation and starts delivering its live
   * messages. The returned function releases the lease; when the last lease
   * for a conversation goes away it is unsubscribed on the wire.
   */
  subscribeConversation(
    conversationId: string,
    handler: ImMpChatRealtimeMessageHandler,
  ): ImMpChatRealtimeSubscription;
  /**
   * Subscribes peer typing pushes for one conversation scope. Ephemeral by
   * contract: never replayed, only delivered while the connection is open.
   */
  subscribeConversationTyping(
    conversationId: string,
    handler: ImMpChatTypingHandler,
  ): ImMpChatRealtimeSubscription;
  /** Notified after the connection opens and on every delivered message. */
  subscribeRefresh(handler: ImMpChatRefreshHandler): ImMpChatRealtimeSubscription;
  isLiveConnected(): boolean;
  /** Reconnects after an app foreground; no-op while connected or disposed. */
  recover(): void;
  /** Full teardown (logout, reset). */
  dispose(): void;
}

const INITIAL_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

/** Same fatal-auth vocabulary the PC/H5 reconnect managers stop on. */
const AUTH_FAILURE_PATTERN =
  /(?:^|_)(?:auth|session|token).*(?:failed|expired|invalid|required)|websocket_auth/iu;

export function createImMpChatRealtimeService(
  resolveClient: ImMpChatClientResolver,
): ImMpChatRealtimeService {
  let connection: ImLiveConnection | null = null;
  let connecting: Promise<void> | null = null;
  let disposed = false;
  /** Set when the gateway reports a credential problem; `recover()` clears it. */
  let authFailed = false;
  let reconnectAttempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  const connectionUnsubs: Array<() => void> = [];
  const conversationLeases = new Map<string, Set<ImMpChatRealtimeMessageHandler>>();
  const conversationUnsubs = new Map<string, () => void>();
  const typingLeases = new Map<string, Set<ImMpChatTypingHandler>>();
  const typingScopeUnsubs = new Map<string, () => void>();
  const refreshHandlers = new Set<ImMpChatRefreshHandler>();

  const notifyRefresh = (): void => {
    for (const handler of refreshHandlers) {
      try {
        handler();
      } catch {
        // A handler failure must not break the fan-out to other pages.
      }
    }
  };

  const scheduleReconnect = (): void => {
    if (disposed || authFailed || reconnectTimer) {
      return;
    }
    const ceiling = Math.min(MAX_BACKOFF_MS, INITIAL_BACKOFF_MS * 2 ** reconnectAttempts);
    // Full jitter: spread reconnect storms across the window.
    const delay = Math.round(Math.random() * ceiling);
    reconnectAttempts += 1;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      void ensureConnection();
    }, delay);
  };

  const attachConversation = (conversationId: string): void => {
    if (!connection || conversationUnsubs.has(conversationId)) {
      return;
    }
    const unsubscribe = connection.messages.onConversation(
      conversationId,
      (message, context) => {
        const handlers = conversationLeases.get(conversationId);
        if (handlers) {
          for (const handler of handlers) {
            try {
              handler(message, context);
            } catch {
              // One page's render failure must not hide messages from others.
            }
          }
        }
        // Delivered messages move unread counts and inbox ordering even when
        // the thread itself is not open.
        notifyRefresh();
      },
    );
    conversationUnsubs.set(conversationId, unsubscribe);
  };

  /** Typing pushes ride the conversation scope, filtered by event type. */
  const attachTypingScope = (conversationId: string): void => {
    if (!connection || typingScopeUnsubs.has(conversationId)) {
      return;
    }
    const unsubscribe = connection.events.onScope(
      "conversation",
      conversationId,
      (event, context) => {
        if ((context.eventType ?? "").trim() !== IM_MP_TYPING_EVENT_TYPE) {
          return;
        }
        const eventPayload = (event ?? {}) as { userId?: unknown };
        const contextPayload = (context.payload ?? {}) as { userId?: unknown };
        const peerUserId =
          typeof eventPayload.userId === "string" && eventPayload.userId.trim()
            ? eventPayload.userId.trim()
            : typeof contextPayload.userId === "string" && contextPayload.userId.trim()
              ? contextPayload.userId.trim()
              : "";
        const handlers = typingLeases.get(conversationId);
        if (!handlers) {
          return;
        }
        for (const handler of handlers) {
          try {
            handler(peerUserId);
          } catch {
            // A handler failure must not block the others.
          }
        }
      },
    );
    typingScopeUnsubs.set(conversationId, unsubscribe);
  };

  /** Declares the typing scopes (and their event-type filter) on the wire. */
  const syncTypingScopes = (): void => {
    if (!connection) {
      return;
    }
    connection.subscriptions.syncScopes(
      [...typingLeases.keys()].map((conversationId) => ({
        scopeType: "conversation",
        scopeId: conversationId,
        eventTypes: [IM_MP_TYPING_EVENT_TYPE],
      })),
    );
  };

  const detachConnection = (): void => {
    for (const unsubscribe of connectionUnsubs.splice(0)) {
      try {
        unsubscribe();
      } catch {
        // Teardown best effort.
      }
    }
    for (const unsubscribe of conversationUnsubs.values()) {
      try {
        unsubscribe();
      } catch {
        // Teardown best effort.
      }
    }
    conversationUnsubs.clear();
    for (const unsubscribe of typingScopeUnsubs.values()) {
      try {
        unsubscribe();
      } catch {
        // Teardown best effort.
      }
    }
    typingScopeUnsubs.clear();
    if (connection) {
      connection.disconnect();
      connection = null;
    }
  };

  const handleStateChange = (state: ImLiveConnectionState): void => {
    if (disposed) {
      return;
    }
    if (state.status === "open") {
      reconnectAttempts = 0;
      // Data may have changed while the socket was down.
      notifyRefresh();
      return;
    }
    if (state.status === "closed" || state.status === "error") {
      detachConnection();
      scheduleReconnect();
    }
  };

  const handleConnectionError = (error: unknown): void => {
    if (disposed) {
      return;
    }
    const code = typeof error === "object" && error !== null
      ? (error as { code?: unknown }).code
      : undefined;
    if (typeof code === "string" && AUTH_FAILURE_PATTERN.test(code)) {
      // A stale session must not spin the reconnect loop; `recover()` after a
      // session change restarts it.
      authFailed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      detachConnection();
    }
  };

  async function ensureConnection(): Promise<void> {
    if (disposed || authFailed || connection || connecting) {
      return;
    }
    connecting = (async () => {
      try {
        const options: ImConnectOptions = {
          subscriptions: {
            conversations: [...conversationLeases.keys()],
          },
        };
        const opened = await resolveClient().connect(options);
        if (disposed) {
          opened.disconnect();
          return;
        }
        connection = opened;
        connectionUnsubs.push(
          opened.lifecycle.onStateChange(handleStateChange),
          opened.lifecycle.onError(handleConnectionError),
        );
        for (const conversationId of conversationLeases.keys()) {
          attachConversation(conversationId);
        }
        for (const conversationId of typingLeases.keys()) {
          attachTypingScope(conversationId);
        }
        syncTypingScopes();
      } catch {
        // Transport failures flow through the reconnect backoff.
        scheduleReconnect();
      } finally {
        connecting = null;
      }
    })();
    await connecting;
  }

  return {
    subscribeConversation(conversationId, handler) {
      let leases = conversationLeases.get(conversationId);
      if (!leases) {
        leases = new Set();
        conversationLeases.set(conversationId, leases);
      }
      leases.add(handler);
      if (connection) {
        attachConversation(conversationId);
        connection.subscriptions.syncConversations([...conversationLeases.keys()]);
      } else {
        void ensureConnection();
      }
      return () => {
        const current = conversationLeases.get(conversationId);
        if (!current) {
          return;
        }
        current.delete(handler);
        if (current.size > 0) {
          return;
        }
        conversationLeases.delete(conversationId);
        const unsubscribe = conversationUnsubs.get(conversationId);
        if (unsubscribe) {
          unsubscribe();
          conversationUnsubs.delete(conversationId);
        }
        connection?.subscriptions.syncConversations([...conversationLeases.keys()]);
      };
    },

    subscribeConversationTyping(conversationId, handler) {
      const normalized = conversationId.trim();
      let leases = typingLeases.get(normalized);
      if (!leases) {
        leases = new Set();
        typingLeases.set(normalized, leases);
      }
      leases.add(handler);
      if (connection) {
        attachTypingScope(normalized);
        syncTypingScopes();
      } else {
        void ensureConnection();
      }
      return () => {
        const current = typingLeases.get(normalized);
        if (!current) {
          return;
        }
        current.delete(handler);
        if (current.size > 0) {
          return;
        }
        typingLeases.delete(normalized);
        const unsubscribe = typingScopeUnsubs.get(normalized);
        if (unsubscribe) {
          unsubscribe();
          typingScopeUnsubs.delete(normalized);
        }
        syncTypingScopes();
      };
    },

    subscribeRefresh(handler) {
      refreshHandlers.add(handler);
      if (!connection) {
        void ensureConnection();
      }
      return () => {
        refreshHandlers.delete(handler);
      };
    },

    isLiveConnected(): boolean {
      return connection !== null;
    },

    recover(): void {
      if (disposed) {
        return;
      }
      authFailed = false;
      if (!connection) {
        void ensureConnection();
      }
    },

    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      detachConnection();
      conversationLeases.clear();
      typingLeases.clear();
      typingScopeUnsubs.clear();
      refreshHandlers.clear();
    },
  };
}

import { expect, test, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';

import { buildPlaywrightSessionFixture } from './fixtures/auth';
import {
  PLAYWRIGHT_CONVERSATION_ID,
  PLAYWRIGHT_INITIAL_MESSAGE,
  PLAYWRIGHT_PEER_DISPLAY_NAME,
  installPlaywrightImApiMocks,
} from './fixtures/im-api';

/**
 * The embed bundle is exercised exactly as an external host loads it: a blank
 * same-origin page fulfills the harness document, the built IIFE is injected,
 * and the surface mounts with a host session against the mocked IM API. This
 * runs in the standard Playwright gate without a dev server or extra assets.
 */
const HARNESS_URL = 'http://embed.harness.test/__embed__';
const BUNDLE_PATH = fileURLToPath(new URL('../dist-embed/im-pc-embed.js', import.meta.url));

type EmbedHarnessWindow = Window & {
  __EMBED_ERROR__?: string;
  __EMBED_ONERROR__?: string;
  __EMBED_UNREAD__?: number;
};

interface EmbedMountRequest {
  kind: 'conversation-list' | 'conversation' | 'contacts';
  conversationId?: string;
  /** Gateway the surface calls; defaults to this page's origin. */
  apiBaseUrl?: string;
  /** Leave the IM API unmocked so the surface has to render through network failure. */
  skipApiMocks?: boolean;
}

const HARNESS_HTML = '<!doctype html><html><body><div id="host" style="height:100vh"></div></body></html>';

type RealtimeChannel = {
  /** Frames the client sent, in order. */
  readonly sent: string[];
  /** Push one server frame into the open socket. */
  push(frame: unknown): void;
};

/** Accept the realtime socket, run the CCP handshake, and expose the channel. */
async function interceptRealtime(page: Page): Promise<RealtimeChannel> {
  const sent: string[] = [];
  let socket: { send(value: string): void } | undefined;
  const envelope = (schema: string, kind: string, payload: Record<string, unknown>): string => JSON.stringify({
    protocol: { family: 'ccp', major: 1, minor: 0 },
    binding: 'Ws1',
    kind,
    schema,
    scope: null,
    route: null,
    flags: [],
    payload: JSON.stringify(payload),
  });
  await page.routeWebSocket(/\/im\/v3\/api\/realtime\/ws/, (ws) => {
    socket = ws;
    ws.onMessage((message) => {
      const raw = typeof message === 'string' ? message : Buffer.from(message).toString('utf8');
      sent.push(raw);
      const parsed = JSON.parse(raw) as { type?: string; schema?: string; payload?: string };
      if (parsed.type === 'auth.init') {
        ws.send(JSON.stringify({ type: 'auth.ok', traceId: 'trace.realtime' }));
        return;
      }
      if (parsed.schema === 'cc.control.hello.v1') {
        ws.send(envelope('cc.control.hello_ack.v1', 'control', { type: 'hello_ack' }));
        return;
      }
      if (parsed.schema === 'cc.control.auth_bind.v1') {
        ws.send(envelope('cc.control.auth_ok.v1', 'control', { type: 'auth_ok' }));
      }
    });
  });
  return {
    sent,
    push: (frame) => {
      socket?.send(envelope('cc.realtime.event.v1', 'event', frame as Record<string, unknown>));
    },
  };
}

/** Serve the harness document, mock the IM API, and mount one embed surface. */
async function openSurface(page: Page, request: EmbedMountRequest): Promise<void> {
  const session = buildPlaywrightSessionFixture();
  await page.route(HARNESS_URL, async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/html', body: HARNESS_HTML });
  });
  if (request.skipApiMocks !== true) {
    await installPlaywrightImApiMocks(page);
  }
  await page.goto(HARNESS_URL);
  await page.addScriptTag({ path: BUNDLE_PATH });
  await page.evaluate((payload: { mount: EmbedMountRequest; session: unknown }) => {
    const host = document.getElementById('host');
    if (!host) throw new Error('embed harness host element is missing');
    const api = (window as unknown as {
      SdkworkImEmbed?: {
        mountSurface(container: HTMLElement, options: Record<string, unknown>): unknown;
      };
    }).SdkworkImEmbed;
    if (!api) throw new Error('embed bundle did not publish SdkworkImEmbed.mountSurface');
    api.mountSurface(host, {
      kind: payload.mount.kind,
      apiBaseUrl: payload.mount.apiBaseUrl ?? window.location.origin,
      session: payload.session,
      locale: 'en-US',
      colorScheme: 'dark',
      ...(payload.mount.conversationId ? { conversationId: payload.mount.conversationId } : {}),
      onUnreadChange: (totalUnread: number) => {
        (window as EmbedHarnessWindow).__EMBED_UNREAD__ = totalUnread;
      },
      onError: (error: unknown) => {
        const code = typeof error === 'object' && error !== null && 'code' in error
          ? String((error as { code?: unknown }).code)
          : String(error);
        (window as EmbedHarnessWindow).__EMBED_ONERROR__ = code;
      },
    });
  }, { mount: request, session });
}

/** Read the mounted surface's shadow content length. */
async function shadowLength(page: Page): Promise<number> {
  return page.locator('#host > div').evaluate(host => host.shadowRoot?.innerHTML.length ?? 0);
}

test.describe('embedded IM surfaces', () => {
  test('the conversation list surface hydrates the mocked inbox in a shadow root', async ({ page }) => {
    await openSurface(page, { kind: 'conversation-list' });

    await expect(page.getByRole('button', { name: new RegExp(PLAYWRIGHT_PEER_DISPLAY_NAME, 'u') })).toBeVisible({
      timeout: 20_000,
    });
    // The surface mounts inside a shadow root, so host styles cannot leak in.
    await expect(page.locator('#host > div')).toHaveCount(1);
    expect(await page.locator('#host > div').evaluate(host => host.shadowRoot !== null)).toBe(true);
  });

  test('keeps the product shell visible when the IM gateway is unreachable', async ({ page }) => {
    await openSurface(page, {
      kind: 'conversation-list',
      apiBaseUrl: 'http://127.0.0.1:9',
      skipApiMocks: true,
    });

    // The IM UI is still mounted: the conversation-list region renders through
    // the failed requests instead of the host substituting a text placeholder.
    await expect(page.getByTestId('chat-conversation-list')).toBeVisible({ timeout: 20_000 });
    expect(await shadowLength(page)).toBeGreaterThan(1_000);
  });

  test('mounts the shell and reports an unusable gateway to the host', async ({ page }) => {
    await openSurface(page, { kind: 'conversation-list', apiBaseUrl: 'not-a-url' });

    await expect.poll(
      () => page.evaluate(() => (window as EmbedHarnessWindow).__EMBED_ONERROR__ ?? null),
      { timeout: 20_000 },
    ).toBe('im-embed-invalid-api-base-url');
    expect(await shadowLength(page)).toBeGreaterThan(1_000);
  });

  test('the conversation surface renders the timeline and sends an outbound message', async ({ page }) => {
    await openSurface(page, { kind: 'conversation', conversationId: PLAYWRIGHT_CONVERSATION_ID });

    await expect(page.getByText(PLAYWRIGHT_INITIAL_MESSAGE, { exact: true })).toBeVisible({
      timeout: 20_000,
    });

    const outbound = 'E2E embed outbound message';
    const posted = page.waitForRequest(request => (
      request.method() === 'POST'
      && request.url().includes(`/chat/conversations/${PLAYWRIGHT_CONVERSATION_ID}/messages`)
    ), { timeout: 20_000 });
    const composer = page.locator('.ProseMirror').last();
    await expect(composer).toBeVisible({ timeout: 10_000 });
    await composer.click();
    await composer.fill(outbound);
    await composer.press('Enter');
    await posted;
    await expect(page.getByText(outbound, { exact: true }).last()).toBeVisible({ timeout: 15_000 });
  });

  test('the conversation surface appends an inbound realtime message', async ({ page }) => {
    const channel = await interceptRealtime(page);
    await openSurface(page, { kind: 'conversation', conversationId: PLAYWRIGHT_CONVERSATION_ID });
    await expect(page.getByText(PLAYWRIGHT_INITIAL_MESSAGE, { exact: true })).toBeVisible({ timeout: 20_000 });
    await expect.poll(
      () => channel.sent.some(raw => raw.includes('subscriptions.sync')),
      { timeout: 20_000 },
    ).toBe(true);

    channel.push({
      type: 'event',
      eventType: 'message.posted',
      eventId: 'event.realtime.1',
      scopeType: 'conversation',
      scopeId: PLAYWRIGHT_CONVERSATION_ID,
      realtimeSeq: 5,
      occurredAt: '2026-01-01T00:00:05.000Z',
      payload: {
        messageId: 'message.realtime.1',
        conversationId: PLAYWRIGHT_CONVERSATION_ID,
        messageSeq: 5,
        type: 'text',
        text: 'Realtime hello from the socket',
        summary: 'Realtime hello from the socket',
        sender: { userId: 'user.playwright.200', displayName: 'Realtime Peer' },
        occurredAt: '2026-01-01T00:00:05.000Z',
      },
    });
    await expect(page.getByText('Realtime hello from the socket', { exact: true })).toBeVisible({ timeout: 20_000 });
  });

  test('the contacts surface renders the mocked directory', async ({ page }) => {
    await openSurface(page, { kind: 'contacts' });

    await expect(page.getByText('All friends')).toBeVisible({ timeout: 20_000 });
    expect(await page.evaluate(() => (window as EmbedHarnessWindow).__EMBED_ERROR__ ?? null)).toBeNull();
  });
});

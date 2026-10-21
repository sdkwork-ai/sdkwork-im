# @sdkwork/im-pc-embed

Embeddable SDKWork IM PC surfaces for a host application that owns the
deployment environment and the authenticated session.

## Summary

The package installs two host-provided facts into the IM PC runtime — the
SDKWork API gateway origin and the authenticated dual-token session — and
renders IM product UI without the standalone application's launch
configuration, session persistence, or auth gate.

For a host inside this repository:

```tsx
import {
  configureImPcEmbedRuntime,
  ImChatSurface,
  ImConversationListSurface,
  ImPcSurfaceProviders,
} from '@sdkwork/im-pc-embed';

const runtime = configureImPcEmbedRuntime({
  apiBaseUrl: 'https://api.example.com',
  session: { authToken, accessToken, user, context },
});

// later, when the host unmounts or signs out:
runtime.dispose();
```

## Embed bundle (external hosts)

A host outside this repository does not compile IM sources. The application
builds `dist-embed/im-pc-embed.js` (`pnpm --dir apps/sdkwork-im-pc run
build:embed`), a self-contained IIFE that publishes `SdkworkImEmbed` on the
host page:

```ts
const script = document.createElement('script');
script.src = 'https://im.example.com/embed/im-pc-embed.js';
await new Promise((resolve, reject) => {
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

const handle = window.SdkworkImEmbed.mountSurface(container, {
  kind: 'conversation-list', // 'conversation-list' | 'conversation' | 'contacts'
  apiBaseUrl: 'https://api.example.com',
  session: { authToken, accessToken, user, context },
  locale: 'zh-CN',
  colorScheme: 'dark',
  onConversationSelect: (conversationId) => {},
  onUnreadChange: (totalUnread) => {},
});
handle.update({ /* same options, new selection */ });
handle.unmount();
```

The bundle mounts each surface inside a shadow root with its own stylesheet, so
the IM Tailwind sheet cannot leak into the host document. React and every other
dependency are bundled; the host page needs no module table entry.

The bundle is covered by a Chromium end-to-end spec (`e2e/embed-surfaces.spec.ts`)
that injects the built file into a route-fulfilled harness page and mounts the
conversation list, a conversation (rendering the timeline and posting an
outbound message plus an inbound realtime message over the mocked CCP WebSocket),
and the contacts directory against the mocked IM API.

## Surfaces

| Export | Renders | Host owns |
| --- | --- | --- |
| `ImConversationListSurface` | The product's conversation list (`ChatList`) | Selected conversation, search term |
| `ImChatSurface` | One conversation (`ChatWindow`, messages, composer) | Which conversation is open |
| `ImContactsSurface` | The contacts directory (`ContactsView`) | Call, add-friend, and open-conversation follow-ups |
| `ImPcSurfaceProviders` | Translation context and toast host | Mount once around a surface tree |
| `ImPcChatHost` (`@sdkwork/im-pc-embed/full`) | The complete IM PC application shell | Nothing; used for whole-application embeds |

Surfaces read their data from the IM runtime's own services, so the host never
re-implements message loading, sending, realtime updates, directory loading, or
translation. The host passes only JSON props and callbacks.

## Runtime initialization

`configureImPcEmbedRuntime` validates the host facts and initializes the IM SDK
client once, before any surface renders:

- `apiBaseUrl` must be an absolute http(s) URL, or an application origin such
  as `dsh-app://app` whose shell proxies the HTTP call to the gateway (the
  desktop host keeps the renderer same-origin and avoids CORS); otherwise it
  throws `ImPcEmbedInitError` with `im-embed-invalid-api-base-url`.
- An explicit `websocketBaseUrl` must be a `ws(s)` URL because the proxy cannot
  carry a WebSocket upgrade; otherwise the code is
  `im-embed-invalid-websocket-base-url`.
- A non-null session must carry both `accessToken` and `authToken`; otherwise
  the code is `im-embed-invalid-session`.
- A configuration the SDK itself rejects (for example a gateway the transport
  cannot normalize) rolls the overrides back and throws
  `im-embed-sdk-init-failed`.

Client construction is offline: no WebSocket opens during initialization. The
realtime connection opens when a mounted surface subscribes, survives a short
mode switch (the manager keeps an idle grace), and is closed by
`runtime.dispose()`, which also resets the SDK client. The bundle likewise keeps
the runtime for a short idle window after the last surface unmounts, so a quick
mode switch reuses both the client and the socket instead of re-authenticating.

## Runtime constraints

- The bundle bakes React's production define (`process.env.NODE_ENV`) into
  itself: Vite's HTML pipeline normally supplies it, and a library build that
  skipped it would ship React's development branch and throw `process is not
  defined` in the browser.
- One embedded IM runtime per browser window: the IM services and the realtime
  connection manager are process-global module state, exactly as in the
  standalone IM PC application. Reconfiguring replaces the previous session.
- The host must unmount every surface before installing another session;
  `configureImPcEmbedRuntime` installs over whatever is currently active.
- The bundle follows the host's `locale` option by switching the IM surface
  translation instance; `colorScheme` toggles the `.dark` scope inside the
  shadow root.

## Known Limitations and Deferred Work

- Portals that render into the host `document.body` (some IM modals) escape the
  shadow root and therefore render unstyled. Surfaces that open such modals
  should stay inside the IM surface tree until the portal target is injected.
- `ImChatSurface` renders only the conversation window; group management, call
  overlays, and the right-hand member panel remain part of the full application
  shell until the host needs them.
- The conversation list and the conversation pane each subscribe to the same
  inbox service. That is intentional (the service is the single source), but a
  host that mounts both should treat the extra subscription as the cost of not
  sharing a React context across its navigation slots.
- The bundle is not code-split: one script carries the chat surface and its
  dependencies (≈3.3 MB raw, ≈850 KB gzip). A later split can move the capability
  modules out once the surfaces stop importing the application shell.

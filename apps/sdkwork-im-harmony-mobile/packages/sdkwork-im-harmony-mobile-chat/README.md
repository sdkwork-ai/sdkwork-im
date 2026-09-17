# sdkwork-im-harmony-mobile-chat

SDKWork IM HarmonyOS mobile chat capability: inbox, conversation thread, and
group-creation screens, plus their services, stores, route contributions,
models, and locale fragments.

Authority: `../../../../sdkwork-specs/HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md`
(sections 4, 5, 6, 8, 11) and
`../../../../sdkwork-specs/APP_HARMONY_NATIVE_UI_SPEC.md`.

## Route identity

Route ids are shared verbatim with the PC, H5, and mini program chat surfaces, so
one screen keeps one id across every client architecture
(`APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 7):

| Route id | Physical Harmony page path | Presentation |
| --- | --- | --- |
| `app.communication.chat.inbox` | `pages/chat/ChatInbox` | `tab` |
| `app.communication.chat.conversation` | `pages/chat/ChatConversation` | `page` |
| `app.communication.chat.create-group` | `pages/chat/CreateGroup` | `page` |

Only the physical page path differs per platform, which section 7 explicitly
permits. `toImHarmonyRouteRegistrations` projects these contributions onto the
shell's `ImHarmonyRouteRegistration`; the shell re-derives `domain`,
`capability`, and `screen` from the id segments and rejects a duplicate id or
page path at bootstrap.

## Locale keys

The inbox, conversation, and create-group fragments carry the **same key set** as
`packages/sdkwork-im-mp-chat`, `apps/sdkwork-im-h5`, and the PC chat surface.

Three keys are Harmony-only and additive: `chat.state.offline`,
`chat.state.permission_denied`, and `chat.state.unknown_error`. Section 11
requires the offline/unavailable, permission-denied, and unknown-error states to
be covered, and no PC/H5/mini program chat key names them — those clients have no
device-level network status to report. Rendering `chat.*.load_failed` for a
device with no network would blame the server for a client-side condition.

## SDK injection

Section 6 requires feature services to receive an injected generated SDK client.
`services/ChatSdkRegistry.ets` is the seam:

- the root bootstrap calls `registerImHarmonyChatSdkPort(port)` once;
- services resolve lazily through `resolveImHarmonyChatClient`;
- resolution before registration fails with
  `ImHarmonyChatSdkUnavailableError`, a named, user-safe error that the screens
  render as their error state.

Lazy resolution is deliberate. Throwing at import time would take down the shell
and the session screen along with the chat surface, and the app would not boot at
all on a build where the ArkTS SDK target has not landed yet.

## Dependency direction

Section 5 places `shell` above the capability packages, so this package consumes
the shell's public exports (`ImHarmonyRouteRegistration`) — the same direction
`packages/sdkwork-im-mp-chat` uses for `ImMpRouteContribution`. It must not
import `host`, and it must not construct an SDK client or read runtime env: the
pages render view models, and services reach the SDK only through the port.

`core` must never import this package; section 5 forbids a core-to-capability
edge, so `composition/ModuleRegistry.ets` in core carries static descriptors
rather than importing the chat routes.

## Verification

```bash
node ../sdkwork-specs/tools/check-frontend-composition.mjs --root ..
node ../sdkwork-specs/tools/check-component-port-bindings.mjs --root ..
node --test apps/sdkwork-im-harmony-mobile/tests/harmony-surface-contract.test.mjs
```

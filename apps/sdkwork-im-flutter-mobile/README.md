# SDKWork IM Flutter Mobile

Flutter mobile application root for SDKWork IM.

This root is one of five IM client roots. The PC root is the reference surface;
this root aligns to it through shared contracts and shared route ids, not through
shared code.

## Capability packages

Business logic lives in the `packages/sdkwork_im_flutter_mobile_*` family, never
in `lib/`:

| Package | Layer role | Owns |
| --- | --- | --- |
| `sdkwork_im_flutter_mobile_core` | `frontend-core` | SDK client construction, session lifecycle, route registry, response-envelope and client-id helpers |
| `sdkwork_im_flutter_mobile_commons` | `frontend-commons` | domain-neutral tokens, screen states, formatting, locale plumbing |
| `sdkwork_im_flutter_mobile_shell` | `frontend-shell` | app shell, navigation bar, auth gate, session screens, route placement |
| `sdkwork_im_flutter_mobile_chat` | `frontend-feature` | inbox, conversation, message history, realtime, offline send queue |
| `sdkwork_im_flutter_mobile_contacts` | `frontend-feature` | address book, new friends, add friend, organization directory |

`lib/` holds only the composition root (`bootstrap/`, `app.dart`,
`app_auth_gate.dart`) and the capability wiring (`contacts/`). Dependency
direction is `core`/`commons` → `shell` → feature packages → root.

## Routes

`lib/bootstrap/routes.dart` publishes the same route ids as the H5 catalog, so one
screen keeps one id across every client architecture:

| Route id | Screen | Path |
| --- | --- | --- |
| `app.communication.chat.inbox` | Inbox | `#/chat/inbox` |
| `app.communication.contacts.index` | Address book | `#/contacts` |
| `app.communication.contacts.friend-requests` | New friends | `#/contacts/friend-requests` |
| `app.communication.contacts.add-friend` | Add friend | `#/contacts/add-friend` |
| `app.communication.contacts.organization` | Organization directory | `#/contacts/org` |

Inbox and Contacts are the two navigation-bar tabs; the remaining contacts screens
are pushed from the address book.

## Features

- Appbase IAM deep-link auth (`sdkworkim://auth/callback`) or development credentials
- Inbox via `im_sdk_generated` `chat.inboxList(20, null)`
- Conversation timeline and text send via REST (`conversationsMessagesList`, `conversationsMessagesCreate`)
- WebSocket CCP live updates via `im_sdk_composed` `connect()`:
  - Inbox refresh via user-scope `events.onScope`
  - Conversation timeline via `messages.onConversation`
  - Shared live hub for inbox + conversation subscriptions (no reconnect on navigation)
  - Hub disposed on sign-out and session reset via `resetSdkClients()`
- Contacts via `social.*`: paged address book with A–Z grouping and local window
  search, friend requests (incoming/outgoing tabs with a pending counter), add
  friend with submit-conflict classification, block/unblock, remove friend, and
  direct-conversation start
- Client message ids and direct-conversation ids come from the shared
  `sdkwork_common_flutter` helpers, so ids never collide across retries

## Development

```powershell
cd apps/sdkwork-im-flutter-mobile
flutter pub get
pnpm dev                 # Android/default device, standalone.development
pnpm dev:cloud           # Android/default device, cloud.development
pnpm dev:flutter-ios             # iOS device, standalone.development
pnpm dev:flutter-ios:cloud       # iOS device, cloud.development
```

The shared lifecycle resolves the enclosing IM topology and materializes a private, uniquely named
OS/CI temporary JSON file for `--dart-define-from-file`. The file is created with restrictive
permissions and removed after Flutter exits. Set `SDKWORK_FLUTTER_DEVICE_ID` when Flutter cannot
select the intended device automatically.

Architecture-local examples remain under:

- `config/app/runtime-env.development.example.json`
- `config/host/flutter.development.example.json`

## Verification

```powershell
flutter analyze
flutter test
pnpm run test:sdkwork-im-flutter-mobile-architecture-standard
```

## Application identity

- App ID: `sdkwork-im-flutter-mobile`
- Manifest: `sdkwork.app.config.json`

See [AGENTS.md](./AGENTS.md) for SDKWork agent entrypoint and spec index.

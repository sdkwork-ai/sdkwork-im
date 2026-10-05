# sdkwork-im-sdk (Swift)

Professional Swift SDK for SDKWork API.

## Installation

Add to `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/sdkwork/ImSdkGenerated", from: "0.1.0")
]
```

## Quick Start

```swift
import ImSDK
import SDKworkCommon

let config = SdkConfig(baseUrl: "http://127.0.0.1:18089")
let client = SdkworkImClient(config: config)
client.setApiKey("your-api-key")

// Use the SDK
let result = try await client.presence.meRetrieve()
print(result)
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```swift
let config = SdkConfig(baseUrl: "http://127.0.0.1:18089")
let client = SdkworkImClient(config: config)
client.setApiKey("your-api-key")
// Sends: X-API-Key: <apiKey>
```

### Mode B: Dual Token

```swift
let config = SdkConfig(baseUrl: "http://127.0.0.1:18089")
let client = SdkworkImClient(config: config)
client.setAuthToken("your-auth-token")
client.setAccessToken("your-access-token")
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```swift
let config = SdkConfig(baseUrl: "http://127.0.0.1:18089")
let client = SdkworkImClient(config: config)

// Set custom headers
client.setHeader("X-Custom-Header", value: "value")
```

## API Modules

- `client.presence` - presence API
- `client.realtime` - realtime API
- `client.calls` - calls API
- `client.social` - social API
- `client.chat` - chat API
- `client.spaces` - spaces API

## Usage Examples

### presence

```swift
// Retrieve current principal presence
let result = try await client.presence.meRetrieve()
print(result)
```

### realtime

```swift
// List pending realtime events
let params: [String: Any] = [
    "page_size": 1,
    "cursor": "cursor"
]
let result = try await client.realtime.eventsList(params: params)
print(result)
```

### calls

```swift
// Create an IM call signaling session
let body = CreateRtcSessionRequest(
    rtcSessionId: "1",
    conversationId: "1",
    rtcMode: "rtcmode"
)
let result = try await client.calls.sessionsCreate(body: body)
print(result)
```

### social

```swift
// Retrieve pending incoming friend request count
let result = try await client.social.friendRequestsPendingCountRetrieve()
print(result)
```

### chat

```swift
// Ensure the current user received the system-agent Welcome message
let result = try await client.chat.meWelcomeEnsure()
print(result)
```

### spaces

```swift
// List spaces
let params: [String: Any] = [
    "page_size": 1,
    "cursor": "cursor"
]
let result = try await client.spaces.list(params: params)
print(result)
```

## Error Handling

```swift
do {
    try await client.presence.meRetrieve()
} catch {
    print("Error: \(error)")
}
```

## Publishing

This SDK includes cross-platform publish scripts in `bin/`:
- `bin/publish-core.mjs`
- `bin/publish.sh`
- `bin/publish.ps1`

### Check

```bash
./bin/publish.sh --action check
```

### Publish

```bash
./bin/publish.sh --action publish --channel release
```

```powershell
.\bin\publish.ps1 --action publish --channel test --dry-run
```

> Set `SWIFT_RELEASE_TAG` (or `SDKWORK_RELEASE_TAG`) for tag-based release.

## License

MIT

## Regeneration Contract

- HTTP/OpenAPI generator-owned files are tracked in `.sdkwork/sdkwork-generator-manifest.json`.
- HTTP/OpenAPI generation also writes `.sdkwork/sdkwork-generator-changes.json` so automation can inspect created, updated, deleted, unchanged, scaffolded, and backed-up files plus the classified impact areas, verification plan, and execution decision for the latest generation.
- HTTP/OpenAPI apply mode also writes `.sdkwork/sdkwork-generator-report.json` with the full execution report, including `schemaVersion`, `generator`, stable artifact paths, and the execution handoff commands that match CLI `--json` output.
- CLI JSON output also includes an execution handoff with concrete next commands, including reviewed apply commands for dry-run flows.
- Put HTTP/OpenAPI hand-written wrappers, adapters, and orchestration in `custom/`.
- Files scaffolded under `custom/` are created once and preserved across HTTP/OpenAPI regenerations.
- If an HTTP/OpenAPI generated-owned file was modified locally, its previous content is copied to `.sdkwork/manual-backups/` before overwrite or removal.
- RPC SDK source workspaces use convention-first evidence by default: RPC SDK family naming, language workspace naming, `rpc/*.manifest.json`, proto source references, generated client source, and native package manifests.
- Use `sdkgen inspect --protocol rpc` to verify RPC convention evidence. Request persisted generator evidence only with `--emit-control-plane` for release, CI, audit, or migration workflows; evidence paths are derived by generator convention.

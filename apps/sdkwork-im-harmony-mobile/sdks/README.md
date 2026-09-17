# sdks/

This directory follows `SDK_WORKSPACE_GENERATION_SPEC.md`.

Harmony roots consume the application-owned generated SDKs from the
repository-level `sdks/` workspace. They must not contain hand-edited generated
output and must not vendor a private transport copy.

Current coverage of `sdks/sdkwork-im-app-sdk`:

| Target | Workspace | State |
| --- | --- | --- |
| typescript | `sdkwork-im-app-sdk-typescript` | materialized |
| flutter | `sdkwork-im-app-sdk-flutter` | materialized |
| kotlin | `sdkwork-im-app-sdk-kotlin` | materialized |
| swift | `sdkwork-im-app-sdk-swift` | materialized |
| csharp | `sdkwork-im-app-sdk-csharp` | materialized |
| go | `sdkwork-im-app-sdk-go` | materialized |
| java | `sdkwork-im-app-sdk-java` | materialized |
| python | `sdkwork-im-app-sdk-python` | materialized |
| rust | `sdkwork-im-app-sdk-rust` | materialized |
| arkts | _none_ | not produced by the SDK generation chain yet |

`HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6 requires Harmony packages to
consume `/app/v3/api` through generated ArkTS/TypeScript app SDK clients **adapted
for the Harmony runtime**. Because no ArkTS target is emitted yet,
`packages/sdkwork-im-harmony-mobile-core` declares the SDK **port** contract and
the base-URL/credential boundary in
`src/main/ets/sdk/ImAppSdkClient.ets`, and the root bootstrap injects the port.
That is a declared seam, not a fabricated client: no raw request API, manual auth
header, copied React/Flutter/Kotlin/Swift wrapper, or local DTO fork exists in
this root.

Missing Harmony SDK methods are fixed in the OpenAPI/generator inputs and
regenerated, per section 6. Closing this gap is the one prerequisite that blocks
a real `hvigor assembleHap`.

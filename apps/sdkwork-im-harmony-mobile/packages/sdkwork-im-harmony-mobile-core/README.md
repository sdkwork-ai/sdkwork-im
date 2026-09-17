# sdkwork-im-harmony-mobile-core

SDKWork IM HarmonyOS mobile core: runtime SDK ports and factories, the global
token-manager equivalent, session store, route/module registry, and host adapter
contracts.

Authority: `../../../../sdkwork-specs/HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md`
and `../../../../sdkwork-specs/APP_COMPOSITION_SPEC.md`.

## Why the SDK surface is a port

`sdks/sdkwork-im-app-sdk` emits TypeScript, Flutter, Kotlin, Swift, C#, Go, Java,
Python, and Rust targets. It does **not** emit an ArkTS target yet, and section 6
forbids filling that gap with raw request APIs, manual authentication headers,
copied React/Flutter/Kotlin/Swift wrappers, or local DTO forks. So this package
declares the port (`ImAppSdkClient`, `ImIamAppSdkClient`), the base-URL and
credential boundary, and the session store; the root bootstrap injects the
implementation once an ArkTS target lands.

## Dependency direction

`core` depends on nothing in the family. Section 5 puts it at the top of the
allowed flow, so it must not import `shell`, `host`, or a capability package —
including to count routes. `composition/ModuleRegistry.ets` therefore carries
static descriptors only.

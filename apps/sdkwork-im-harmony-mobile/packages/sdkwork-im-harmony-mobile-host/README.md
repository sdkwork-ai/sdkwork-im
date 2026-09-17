# sdkwork-im-harmony-mobile-host

SDKWork IM HarmonyOS mobile host: typed HarmonyOS platform adapters behind
core-owned contracts.

Authority: `../../../../sdkwork-specs/HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md`
section 7.

## Boundary

Section 7 puts every HarmonyOS system/device call behind a typed adapter with
stable user-safe errors (`unsupported`, `permission-denied`, `unavailable`,
`cancelled`, `invalid-state`). Feature packages depend on the interfaces in
`sdkwork-im-harmony-mobile-core/src/main/ets/host/HostAdapterContracts.ets`, never
on this package's implementations.

This package implements the contracts; it must not own login, token refresh,
permission evaluation, business authorization, or raw business API transport.

## Current capability truth

`createHostAdapters().capabilities` lists what the platform-backed
implementations can really do today, not the full contract surface. Where a
capability is unavailable without the HarmonyOS SDK toolchain the adapter returns
`unsupported` rather than a fabricated success — a silent fake success is how a
"secure" storage write ends up not happening.

Push token registration is deliberately absent as a workflow: section 7 makes it
an app-api workflow, so the adapter only reports the platform token fact and the
permission state.

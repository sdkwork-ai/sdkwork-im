# @sdkwork/im-mp-core

IM mini program core: runtime config, SDK client construction, session store, route registry, and
host adapter contracts.

## Role

| Aspect | Value |
| --- | --- |
| Package role | `core` |
| Layer role | `frontend-core` |
| Surface | `app` |
| Root | `apps/sdkwork-im-mini-program` |

## Public Surface

| Subpath | Owns |
| --- | --- |
| `.` | Dependency composition entry and host adapter contracts |
| `./sdk` | `@sdkwork/im-sdk` and `@sdkwork/im-app-sdk` client construction |
| `./session` | Session/context store and token resolution |
| `./composition` | Dependency manifest, SDK inventory, module registry, host capability registry |
| `./modules` | Reserved for module-level exports |
| `./host` | Host adapter contracts implemented by `@sdkwork/im-mp-host` |

## Boundaries

- Owns SDK factory construction, the global token/session store, the route registry, and host
  adapter contracts.
- Must not own pages, components, or business workflows.
- Must not depend on capability packages (`APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 5).
- Must not read `wx.*` platform globals; platform storage arrives through the injected
  `ImMpSessionStorage` adapter registered by the root bootstrap.

## Known Integration Prerequisite

The generated IM SDK drives realtime over a runtime-provided WebSocket factory. The WeChat mini
program runtime has no compatible global `WebSocket`, so a `wx.connectSocket`-backed factory must
be supplied by the host layer before realtime is enabled. HTTP conversation and message reads work
without it. `isImSdkClientInitialized()` and the root build manifest report which mode is active,
so nothing silently assumes realtime works.

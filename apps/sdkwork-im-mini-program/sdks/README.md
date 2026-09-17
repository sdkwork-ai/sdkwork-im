# SDKWork IM Mini Program SDKs

This directory is intentionally free of generated SDK workspaces.

Per `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` sections 7 and 11, mini program packages consume
generated TypeScript app SDK clients owned by the repository SDK workspace:

- `../../../sdks/sdkwork-im-sdk/` (`@sdkwork/im-sdk`) - IM runtime API and realtime client
- `../../../sdks/sdkwork-im-app-sdk/` (`@sdkwork/im-app-sdk`) - IM `/app/v3/api` app SDK

Generated transport output is never copied, vendored, or hand-edited under this application root.
Do not add SDK workspaces here.

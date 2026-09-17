# SDKWork IM Mini Program Scripts

Build and projection tooling for `apps/sdkwork-im-mini-program` belongs here.

- `build-runtime.mjs`: bundles `src/bootstrap/runtimeBundle.ts` into the WeChat-compatible
  CommonJS runtime module `src/runtime/im-app.js`, projects the selected non-secret runtime env
  JSON into `src/runtime/runtime-env.js`, records `src/runtime/build-manifest.json`, and regenerates
  the `pages` / `subPackages` / `preloadRule` keys of `src/app.json` from the route contributions.

`src/app.json` is a projection target, not a source: its three derived keys are rewritten on every
build so page placement has one source of truth (the route contributions). Its static keys
(`window`, `style`, `lazyCodeLoading`) are preserved — the script refuses to run when `src/app.json`
is absent rather than inventing them. The script also refuses to write a manifest whose `tabBar`
declaration disagrees with the projection: WeChat rejects a tab bar with fewer than two items.

The script loads the bundle it just wrote (through `new Function`, because the repository root
declares `"type": "module"`) and derives the manifest from that loaded code, so an `app.json` can
never describe a route set the shipped bundle does not contain.

The script selects exactly one profile explicitly. It validates that the chosen
`config/mini-program/runtime-env.<profile-id>.json` declares matching `SDKWORK_ENVIRONMENT`,
`SDKWORK_DEPLOYMENT_PROFILE`, `SDKWORK_PROFILE_ID`, and `SDKWORK_RUNTIME_TARGET=mini-program`
before emitting, and fails fast when the profile file is absent.

Scripts must not embed access tokens, platform secrets, private upload keys, or database URLs.

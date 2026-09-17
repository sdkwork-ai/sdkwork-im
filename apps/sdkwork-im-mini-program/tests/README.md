# SDKWork IM Mini Program Tests

Application-level architecture, config, route projection, and package boundary verification for
`apps/sdkwork-im-mini-program` belongs here.

- `mini-program-surface-contract.test.mjs`: static architecture contract for the root layout,
  package family, composition-root exports, the `wx.*` boundary, and the design-token restatement
  in `src/app.wxss`.
- `mini-program-runtime-config.test.mjs`: proves every materialized runtime env declares matching
  `SDKWORK_ENVIRONMENT`, `SDKWORK_DEPLOYMENT_PROFILE`, `SDKWORK_PROFILE_ID`, and
  `SDKWORK_RUNTIME_TARGET=mini-program`, that no profile carries a secret-bearing key, and that the
  committed build artifacts match one declared profile.
- `mini-program-route-projection.test.mjs`: proves route contributions project deterministically
  into the WeChat `pages` list, subpackage descriptor, and preload rule; that every projected page
  has all four platform files; and that shared screens reuse the H5 route id and title key.
- `mini-program-env-alignment.test.mjs`: proves this surface and the H5 client resolve the same
  application API, IAM, gateway, and realtime origins for every profile, with the documented
  `cloud.development` dev-local binding asserted by rule.
- `lib/load-runtime-bundle.mjs`: loads the built CommonJS bundle (`src/runtime/im-app.js`) from Node
  so the tests assert against the code that ships. Not a test file.

Run with `pnpm test` or `pnpm test:config` / `pnpm test:routes`.

The bundle is committed, so the suite runs on a fresh clone without a prior build. After
`pnpm clean`, run `pnpm build:mini-program` before `pnpm test`.

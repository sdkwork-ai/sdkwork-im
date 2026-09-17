# Component Deployment

This application surface shares the enclosing application deployment unit.
Deployment profiles are owned by `../../../etc/sdkwork.deployment.config.json`;
runtime process topology is owned by `../../../specs/topology.spec.json`.
Surface-local build and static verification entry points stay in this
application root.

## Materialization state

`HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 9 requires the root to
materialize exactly one non-secret
`config/app/runtime-env.<deploymentProfile>.<environment>.json` document and to
declare matching `environment`, `deploymentProfile`, `profileId`, and
`runtimeTarget=harmony-native`.

`../../../etc/client-env.materialization.json` registers the four surfaces that
`pnpm workflow:materialize-client-env` can render today: PC (`vite`), H5
(`vite`), Flutter (`flutter`), and mini program (`mini-program`). That tool has
no Harmony surface format, so this root is **not** registered there and the
runtime documents under `config/app/` are authored and checked in.

Consequences, stated so nothing is silently assumed:

- The Harmony runtime documents are validated by
  `tests/harmony-runtime-config.test.mjs` (identity keys, profile matrix,
  runtime target, secret absence, and cross-client value equality with the mini
  program's materialized documents) instead of by `check:client-env`.
- `sdkwork.deployment.config.json` therefore declares
  `materialization.deferred` with the reason rather than a `command` that would
  throw `unsupported materialization format` the first time it ran.
- Values still come from the single deployment authority: each document is
  derived from `../../../etc/topology/<profile-id>.env` through the same
  resolution the mini program's materialized documents use, and the test
  asserts that equality rather than trusting the copy.

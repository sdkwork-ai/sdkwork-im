# scripts/

HarmonyOS build/release helper scripts belong here once the DevEco toolchain is
available. Nothing in this directory is required for that: every check that can
run without the HarmonyOS SDK runs from the repository root or from this root's
`package.json`.

## `generate-harmony-runtime-config.mjs`

Projects the ten tracked `config/app/runtime-env.<profile-id>.json` documents into
`entry/src/main/ets/generated/RuntimeConfig.ets`.

It exists because `ENVIRONMENT_SPEC.md` section 5.1.3 requires a native HarmonyOS
root to package a selected non-secret runtime resource, and a HAP cannot read that
tracked JSON at runtime. Generating rather than hand-copying matters: the runtime
documents are the single source of truth for the app's endpoints, and a hand-copied
ArkTS table drifts silently into pointing a production build at the wrong origin.

```text
node scripts/generate-harmony-runtime-config.mjs           # write
node scripts/generate-harmony-runtime-config.mjs --check    # verify only
```

`tests/harmony-runtime-config.test.mjs` runs the `--check` mode, so drift fails the
gate rather than shipping.

From the repository root:

```text
node ../sdkwork-specs/tools/check-apps-directory-index.mjs --root .
node ../sdkwork-specs/tools/check-frontend-composition.mjs --root .
node ../sdkwork-specs/tools/check-component-port-bindings.mjs --root .
node --test apps/sdkwork-im-harmony-mobile/tests/harmony-surface-contract.test.mjs
node --test apps/sdkwork-im-harmony-mobile/tests/harmony-runtime-config.test.mjs
```

There is deliberately no `check:harmony-native` script and no
`dev:harmony-native:*` / `build:harmony-native:*` alias on this root: no HarmonyOS
build command can run until the DevEco Studio / HarmonyOS SDK toolchain and a
signing profile are installed, and a script that cannot execute would be a false
signal. `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 10 lists those aliases
as opt-in for roots whose package manager or repository tooling orchestrates
Harmony; this root is not one of them yet.

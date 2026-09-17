# SDKWork IM HarmonyOS Mobile

Native HarmonyOS (ArkTS/ArkUI) client application root for SDKWork IM.

Authority: `../../../sdkwork-specs/HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` and
`../../../sdkwork-specs/APP_HARMONY_NATIVE_UI_SPEC.md`, under
`../../../sdkwork-specs/APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md`.

## Package Family

| Package | Role | Layer role |
| --- | --- | --- |
| `packages/sdkwork-im-harmony-mobile-core` | runtime config, SDK ports and factories, token-manager equivalent, session store, route registry, host adapter contracts | frontend-core |
| `packages/sdkwork-im-harmony-mobile-commons` | domain-neutral ArkUI primitives, theme tokens, i18n helpers | frontend-commons |
| `packages/sdkwork-im-harmony-mobile-shell` | app shell, navigation/page stack assembly, AuthGate integration, session screen | frontend-shell |
| `packages/sdkwork-im-harmony-mobile-host` | typed HarmonyOS platform adapters behind core-owned contracts | frontend-host |
| `packages/sdkwork-im-harmony-mobile-chat` | inbox, conversation, and group-creation capability | frontend-feature |

Dependency direction follows section 5 of the architecture standard:
`core`/`commons` → `shell` → `chat` → root `entry`; `host` implements the
contracts `core` declares. Cycles are forbidden and the direction is gated by
`check-frontend-composition.mjs`.

## Capability Parity

The capability surface matches the other IM client roots for the shared screens:

| Route id | Capability | Harmony page path |
| --- | --- | --- |
| `app.communication.chat.inbox` | chat | `pages/chat/ChatInbox` (tab) |
| `app.communication.chat.conversation` | chat | `pages/chat/ChatConversation` |
| `app.communication.chat.create-group` | chat | `pages/chat/CreateGroup` |
| `app.communication.session.login` | session | `pages/session/Login` |

Route ids are identical to the H5 catalog and the mini program contributions so
one screen keeps one id across every client architecture; only the physical page
path differs, which section 7 explicitly permits.

## Configuration

Non-secret runtime config materializes as
`config/app/runtime-env.<deploymentProfile>.<environment>.json` and declares
matching `environment`, `deploymentProfile`, `profileId`, and
`runtimeTarget=harmony-native`. Host/platform metadata belongs to `config/host/`
and must stay secret-free.

`../../../etc/client-env.materialization.json` has no Harmony surface format, so
these documents are authored and checked in rather than generated. The reason and
the consequences are recorded in `etc/README.md`, and
`tests/harmony-runtime-config.test.mjs` asserts the identity keys, the profile
matrix, secret absence, and value equality with the mini program's materialized
documents.

The ten documents are projected into `entry/src/main/ets/generated/RuntimeConfig.ets`
by `scripts/generate-harmony-runtime-config.mjs`, because a HAP cannot read the
tracked JSON at runtime. That module is generated; edit the JSON and re-run the
script rather than editing ArkTS. The test suite runs the generator in `--check`
mode, so a stale projection fails the gate.

## Known Shared-Tooling Gap

`check-app-manifest-standard.mjs` rejects this root's `app.appType`:

```text
- apps/sdkwork-im-harmony-mobile/sdkwork.app.config.json: app.appType must use a PlusProjectType value
```

This root declares `app.appType = "APP_HARMONY"`, matching every other HarmonyOS
root in the workspace (`sdkwork-agents`, `sdkwork-appstore`,
`sdkwork-knowledgebase` all declare the same value and fail the same way). The
value is the right one: `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC` and
`APP_MANIFEST_SPEC.md` §6.1 both name `APP_HARMONY` as the HarmonyOS platform, and
the other IM roots follow the same authoring-framework convention
(`APP_REACT` for PC, `APP_FLUTTER` for Flutter, `APP_UNIAPP` for the mini program).

What is missing is the enum membership, in three places at once:

| Layer | Harmony support today |
| --- | --- |
| `APP_MANIFEST_SPEC.md` §4 `PlusProjectType` (`app.appType`) | absent |
| `APP_MANIFEST_SPEC.md` §6.1 publish platform / tool `PLATFORM_VALUES` | present (`APP_HARMONY`) |
| `check-app-manifest-standard.mjs` `APP_TYPES` | absent → rejects the value |
| backend `sdkwork-iam` `normalize_application_type` | absent (`api`/`h5`/`pc`/`flutter` only → `"other"`) |

Closing it means touching the standards authority and the backend enum, so it is
left visible here rather than worked around: declaring a different `appType` would
silently misdescribe a native HarmonyOS root just to turn one line green. This is
the **only** outstanding issue for this root; every other check passes.

## Blocking Prerequisites

The following are **not yet satisfied** and are required before this root can
produce a signed HAP:

1. **HarmonyOS toolchain.** `ohpm`, `hvigor`, and the HarmonyOS SDK are not
   installed in the current development environment. `hvigor assembleHap` and
   `ohpm install` cannot run yet. This is why the root declares no `dev:*` or
   `build:*` alias that cannot execute.
2. **ArkTS SDK adaptation.** No ArkTS target is produced by the SDK generation
   chain yet. See `sdks/README.md`; `core` declares the port and the adapter
   seam instead of vendoring a transport copy.
3. **Bundle signing profile.** `config/host/harmony.*.example.json` are
   secret-free templates; a real signing profile reference must be supplied by
   DevEco Studio or CI secure storage.

## Verification

Static verification runs today, without the HarmonyOS toolchain (from this
directory):

```text
pnpm run _sdkwork:verify
```

which expands to:

```text
node scripts/generate-harmony-runtime-config.mjs --check
node ../../sdkwork-specs/tools/check-source-config-standard.mjs --root .
node ../../sdkwork-specs/tools/check-frontend-composition.mjs --root ../..
node --test tests/harmony-surface-contract.test.mjs
node --test tests/harmony-runtime-config.test.mjs
```

Repository-wide gates that also cover this root (from the repository root):

```text
node ../sdkwork-specs/tools/check-apps-directory-index.mjs --root .
node ../sdkwork-specs/tools/check-component-port-bindings.mjs --root .
node ../sdkwork-specs/tools/check-app-manifest-standard.mjs --workspace .
```

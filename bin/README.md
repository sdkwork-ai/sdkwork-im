# bin/ — standardized entrypoints (`sdkwork-specs/MODULE_BIN_SPEC.md`)

`sdkwork-im` ships the standard nine `bin/` entrypoints. Shared behavior lives
in `sdkwork-specs/bin/lib/sdkwork-common.sh`; this directory only carries
identity (`bin/lib/module.sh`) and thin dispatches.

| Script | Purpose |
| --- | --- |
| `docker-image.sh` | build / push / save / load / update / inspect `registry.sdkwork.com/apps/sdkwork-im-standalone-gateway:<version>` (build via `pnpm build:container --tag <ref>`) |
| `docker-deploy.sh` | install / upgrade / rollback / status / logs / down / start / stop / restart the Docker bundle on `wsl` or `ssh://[user@]host` |
| `docker-bundle-deploy.sh` | the bundle's own stack executor (`apply` / `--ps` / `--down` / `--start\|--stop\|--restart` / `--check-config`); private implementation of `docker-deploy.sh`, shipped in the bundle root as `deploy.sh` |
| `docker-bundle-release.sh` | the bundle's versioned release channel (health gate, auto-rollback, append-only ledger, per-environment lock); shipped as `release.sh` |
| `apps-build.sh` | build `server` (cargo) / `h5` (`sdkwork-app build`) / `desktop` (production builder) |
| `apps-package.sh` | package `server`/`h5` release archives via `build-sdkwork-im-install-package.mjs` |
| `apps-deploy.sh` | deploy the `server` `.deb` onto a Ubuntu target + systemd `sdkwork-im` |
| `apps-pkg-installer.sh` | package native installers per platform (below) |
| `config.sh` / `doctor.sh` / `backup.sh` | operations lifecycle (`OPERATIONS_SPEC.md` §3–§5) |

Declared app types: `server,h5,desktop,flutter`. Default image tag comes from
`sdkwork.app.config.json` → `release.currentVersion`.

## Native installers (`apps-pkg-installer.sh`)

```text
bin/apps-pkg-installer.sh <app-type> <platform> <environment>[:<profile>]
                          [--arch x64|arm64] [--format <fmt>] [--out <dir>] [--dry-run]
```

| App type | Platform | Format(s) | Delegates to |
| --- | --- | --- | --- |
| `server` | `linux` | `deb` | `build-sdkwork-im-native-installer.mjs --all` → `*.deb` |
| `server` | `windows` | `msi` (WiX + WinSW) | same, on a Windows host/CI |
| `server` | `macos` | `pkg` | same, on a macOS host/CI |
| `desktop` | `windows` | `nsis` (default) / `msi` | Tauri bundle root + `collect-sdkwork-im-desktop-bundles.mjs` |
| `desktop` | `macos` | `dmg` | same |
| `desktop` | `linux` | `deb` (default) / `appimage` / `rpm` | same |
| `flutter` | `android` | `apk` (default) / `aab` | `flutter build apk\|appbundle --release` in `apps/sdkwork-im-flutter-mobile` |
| `flutter` | `ios` | — | macOS + Xcode host only (fails with guidance) |

Every artifact lands in `--out` (default `target/bin-installers/`) with a
sidecar `.sha256`; `--dry-run` prints the plan and executes nothing.

## Copy-paste ready

```sh
# Linux server installer (needs staged production files first)
bash bin/package.sh --stage --all
bin/apps-pkg-installer.sh server linux production

# Android APK (default format)
bin/apps-pkg-installer.sh flutter android test
bin/apps-pkg-installer.sh flutter android test --format aab --arch arm64

# Desktop NSIS setup (Windows host)
bin/apps-pkg-installer.sh desktop windows production --arch x64

# Plan only
bin/apps-pkg-installer.sh server linux production --dry-run
```

Cross-OS rule: a native installer builds only on its own host OS — the
entrypoint fails fast with that guidance instead of substituting an artifact.

## Windows (PowerShell, no WSL prerequisite)

Windows does not run `.sh`; the same contract ships as
`bin/apps-pkg-installer.ps1` for native Windows operators (PowerShell 5.1+,
`node` on PATH, `flutter` only for Android builds):

```powershell
# Server .msi (WiX CLI; staged production files required first)
pwsh bin/apps-pkg-installer.ps1 server windows production

# Desktop NSIS setup / MSI
pwsh bin/apps-pkg-installer.ps1 desktop windows production
pwsh bin/apps-pkg-installer.ps1 desktop windows production -Format msi -Arch arm64

# Android APK / AAB (flutter SDK required)
pwsh bin/apps-pkg-installer.ps1 flutter android test
pwsh bin/apps-pkg-installer.ps1 flutter android test -Format aab -Arch arm64

# Plan only
pwsh bin/apps-pkg-installer.ps1 server windows production -DryRun
```

Flags map 1:1 to the sh entrypoint (`-Arch` ↔ `--arch`, `-Format` ↔
`--format`, `-Out` ↔ `--out`, `-DryRun` ↔ `--dry-run`). Linux/macOS targets
fail fast with the cross-OS guidance — run those on the matching host (WSL
sh entrypoint, or CI).

## Operations lifecycle

```bash
bin/config.sh  <list|show|get|set|diff|validate|edit> --environment <env>
bin/doctor.sh  --environment <env> [--instance N] [--json] [--export <dir>]
bin/backup.sh  <create|list|verify|restore> --environment <env>
bin/docker-deploy.sh logs --environment <env> [--tail N] [--follow] [--export <dir>]
```

Management port matrix: dev 3970 / test 3971 / staging 3972 / demo 3974 /
prod 3973 (container port 18079, probe `/healthz`). The bundle ships
`release.sh` (OPERATIONS_SPEC.md §1.2): versioned deploy/rollback with a
health gate, append-only ledger, and per-environment lock. Runbooks:
`docs/runbooks/` (deploy / troubleshooting / backup-restore / log-reference,
both languages). Conformance audit:
`node ../sdkwork-specs/tools/check-operations-conformance.mjs --root .`

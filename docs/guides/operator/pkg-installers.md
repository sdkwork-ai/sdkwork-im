# Native Installer Packaging Guide (`bin/apps-pkg-installer`)

> 原生安装包打包操作指南 — sdkwork-im
> Authority: `sdkwork-specs/MODULE_BIN_SPEC.md` §4.9 · `PACKAGING_SPEC.md` §5
> Windows 不支持 `.sh`：Windows 操作者使用 `bin/apps-pkg-installer.ps1`（与本文件 sh 命令一一对应）。

## 1. What this entrypoint packages

sdkwork-im declares four app surfaces: `server`, `h5`, `desktop`, `flutter`.

| App type | Platform | Format(s) | Built on | Delegates to |
| --- | --- | --- | --- | --- |
| `server` | `linux` | `.deb` | Linux host / WSL | `build-sdkwork-im-native-installer.mjs --all` |
| `server` | `windows` | `.msi` (WiX + WinSW) | Windows host/CI | same |
| `server` | `macos` | `.pkg` | macOS host/CI | same |
| `desktop` | `windows` | `.exe` NSIS (default) / `.msi` (`--format msi`) | Windows host/CI | Tauri bundle + `collect-sdkwork-im-desktop-bundles.mjs` |
| `desktop` | `macos` | `.dmg` | macOS host/CI | same |
| `desktop` | `linux` | `.deb` (default) / `.AppImage` / `.rpm` | Linux host/WSL | same |
| `flutter` | `android` | `.apk` (default) / `.aab` | any host with Flutter | `flutter build apk\|appbundle --release` |
| `flutter` | `ios` | `.ipa` | macOS + Xcode only | fails fast with guidance |

Artifacts land in `--out` (default `target/bin-installers/`) with a sidecar
`.sha256`. 产物自动带 SHA256 校验文件。

**Cross-OS rule 跨宿主规则**: a native installer builds only on its own host
OS. Requesting `windows` on WSL (or `linux` on a Windows PowerShell host)
fails with `ERROR(67)` and points at the right host — it never substitutes
another platform's artifact.

## 2. Command execution per OS platform

### 2.1 Linux / macOS / WSL Ubuntu (POSIX sh)

```sh
# Server .deb — staged production files are the builder's input
bash bin/package.sh --stage --all
bin/apps-pkg-installer.sh server linux production

# Desktop bundles (Linux host: deb/appimage/rpm)
bin/apps-pkg-installer.sh desktop linux production
bin/apps-pkg-installer.sh desktop linux production --format appimage

# Android APK / AAB
bin/apps-pkg-installer.sh flutter android test
bin/apps-pkg-installer.sh flutter android test --format aab --arch arm64

# Plan only
bin/apps-pkg-installer.sh server linux production --dry-run
```

### 2.2 Windows — Git Bash (bridged)

From Git Bash the sh entrypoint works unchanged: every repository command is
bridged into WSL Ubuntu automatically. WSL Ubuntu must be installed.

```bash
cd /e/sdkwork-space/sdkwork-im
bin/apps-pkg-installer.sh server linux production   # host = linux (inside WSL)
bin/apps-pkg-installer.sh flutter android test
```

### 2.3 Windows — PowerShell (native)

`bin/apps-pkg-installer.ps1` mirrors the sh contract 1:1 (host platform =
`windows`). Requires PowerShell 5.1+ and `node` on PATH; `flutter` only for
Android builds.

```powershell
# Server .msi (WiX CLI; staged release files required first)
pwsh bin/apps-pkg-installer.ps1 server windows production

# Desktop NSIS setup / MSI
pwsh bin/apps-pkg-installer.ps1 desktop windows production
pwsh bin/apps-pkg-installer.ps1 desktop windows production -Format msi -Arch arm64

# Android APK / AAB
pwsh bin/apps-pkg-installer.ps1 flutter android test
pwsh bin/apps-pkg-installer.ps1 flutter android test -Format aab -Arch arm64

# Plan only
pwsh bin/apps-pkg-installer.ps1 desktop windows production -DryRun
```

Flag mapping: `-Arch` ↔ `--arch`, `-Format` ↔ `--format`, `-Out` ↔ `--out`,
`-DryRun` ↔ `--dry-run`.

## 3. Prerequisites 前置条件

- **server installers**: staged production files first —
  `bash bin/package.sh --stage --all` (WSL/Linux). Missing staging fails with
  `ERROR(67)` and the exact command.
- **desktop installers**: run the desktop release build first
  (`pnpm build:desktop`); the Tauri bundle root is
  `apps/sdkwork-im-pc/packages/sdkwork-im-pc-desktop/src-tauri/target/release/bundle/`.
- **flutter android**: Flutter SDK on PATH for the executing host.

## 4. Fail-fast matrix

| Situation | Error | Guidance given |
| --- | --- | --- |
| Unknown platform / format / arch | `66` / `64` | allowed value list |
| Wrong host OS for the target platform | `67` | "run on a <platform> host or CI runner" |
| Missing staged files (server) | `67` | `bash bin/package.sh --stage --all` |
| No artifact produced | `67` | check the repo packager output |
| Artifact without `.sha256` | `67` | packaging must emit the sidecar |

## 5. Deploy the server .deb (Ubuntu target)

```sh
bin/apps-deploy.sh server install production --host ssh://root@<host>
bin/apps-deploy.sh server status   production --host ssh://root@<host>
```

Desktop/mobile bundles are store- or MDM-channel owned; `apps-deploy.sh`
does not install them onto hosts.

## 6. Evidence

Every run appends command, flags, and exit status to
`target/bin-evidence/evidence.log`.

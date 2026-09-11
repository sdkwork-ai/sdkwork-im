#!/usr/bin/env bash
# module.sh — sdkwork-im bin/ wiring (MODULE_BIN_SPEC.md §3).
# Only module identity, constants, and repo-command delegation live here.
# Every shared primitive (remote execution, packaging, checksums) comes from
# sdkwork-specs/bin/lib/sdkwork-common.sh.

SDKWORK_MODULE_ID="sdkwork-im"
SDKWORK_IMAGE_NAME="sdkwork-im-standalone-gateway"
SDKWORK_APP_TYPES="server,h5,desktop,flutter"

# Operations wiring (OPERATIONS_SPEC.md): the compose service carrying the
# gateway process and its probe path (deployments/docker/docker-compose.yml).
SDKWORK_PRIMARY_SERVICE="im-gateway"
SDKWORK_HEALTH_PATH="/healthz"
SDKWORK_CONFIG_ENV_SUBDIR="env"

# Install/upgrade resolve the newest packaged install bundle via the shared
# default (newest under dist/docker-install) — this hook is OPTIONAL
# (MODULE_BIN_SPEC.md §3) and the default is already correct, so there is no
# override. There is deliberately no source-tree bundle: the executors are
# authored flat under bin/ (docker-bundle-deploy.sh / -release.sh) and the
# compose/env inputs live in deployments/docker/bundle/, so an un-packaged
# install fails fast with packaging guidance instead of pushing a directory that
# cannot run on the target.

# Source-tree env dir; used for --dry-run rendering and by config.sh.
sdkwork_module_local_env_dir() {
  printf '%s/deployments/docker/env' "${SDKWORK_MODULE_ROOT}"
}

# Host management port publishing the gateway container port 18079 per
# environment (IM plane 397x series; cloudrouter uses 395x, gateway 391x).
sdkwork_module_health_port() {
  case "${1:-}" in
    development) printf '3970' ;;
    test)        printf '3971' ;;
    staging)     printf '3972' ;;
    demo)        printf '3974' ;;
    production)  printf '3973' ;;
    *)           printf '' ;;
  esac
}

# Delegates to a lightweight required-keys validation of the env file.
sdkwork_module_config_validate() {
  local env_file="$1" key rc=0
  [[ -f "${env_file}" ]] || { sdkwork_die "${SDKWORK_BIN_E_STATE}" "env file missing: ${env_file}"; return 1; }
  while IFS= read -r key; do
    [[ -n "${key}" ]] || continue
    local value
    value="$(sed -n "s/^${key}=//p" "${env_file}" | tail -1 | tr -d '\r')"
    if [[ -z "${value}" || "${value}" == "<CHANGE_ME>" ]]; then
      sdkwork_log "FAIL  config  mandatory key '${key}' is empty or a placeholder in $(basename "${env_file}")"
      rc=1
    fi
  done <<EOF
SDKWORK_DATABASE_HOST
SDKWORK_DATABASE_PORT
SDKWORK_DATABASE_NAME
SDKWORK_DATABASE_USERNAME
SDKWORK_DATABASE_PASSWORD
EOF
  if (( rc == 0 )); then
    sdkwork_log "PASS  config  mandatory deployment keys present in $(basename "${env_file}")"
  fi
  return "${rc}"
}

# ----------------------------------------------------------------------------
# Container image (docker-image.sh build)
# ----------------------------------------------------------------------------
sdkwork_image_build() {
  local ref="$1" tag="$2"
  # The IM container build takes the FULL image reference as --tag (its own
  # default 'sdkwork-im-standalone-gateway:local' carries no registry); it
  # assembles the build context (gateway binary + renderer dists + database
  # modules) and records the digest in dist/container-image.json
  # (RELEASE_SPEC.md §4.1 evidence).
  sdkwork_local_run pnpm build:container --tag "${ref}"
}

# ----------------------------------------------------------------------------
# Application build (apps-build.sh)
# ----------------------------------------------------------------------------
sdkwork_build_app() {
  local app_type="$1" environment="$2" profile="$3"
  case "${app_type}" in
    server)
      sdkwork_local_run cargo build --release ;;
    h5)
      sdkwork_local_run pnpm exec sdkwork-app build ;;
    desktop)
      sdkwork_local_run node scripts/release/build-sdkwork-im-production.mjs --target desktop ;;
    *)
      sdkwork_die "${SDKWORK_BIN_E_ENV}" \
        "unsupported app type '${app_type}' (flutter builds run inside apps/sdkwork-im-flutter-mobile with the Flutter toolchain; use bin/apps-pkg-installer.sh flutter android for installers)" ;;
  esac
}

# ----------------------------------------------------------------------------
# Application packaging (apps-package.sh)
# ----------------------------------------------------------------------------
sdkwork_package_app() {
  local app_type="$1" environment="$2" profile="$3" out="$4"
  case "${app_type}" in
    server|h5)
      # Canonical release-archive channel: builds every declared package id
      # (web/h5 zips, server tar.gz/zip) from the staged release files.
      sdkwork_local_run node scripts/release/build-sdkwork-im-install-package.mjs --all --output-dir "${out}" ;;
    *)
      sdkwork_die "${SDKWORK_BIN_E_ENV}" \
        "app type '${app_type}' packages only through the native installer channel: bin/apps-pkg-installer.sh ${app_type} <platform> ${environment}:${profile}" ;;
  esac
}

# ----------------------------------------------------------------------------
# Native installer packaging (apps-pkg-installer.sh, MODULE_BIN_SPEC.md §4.9)
# ----------------------------------------------------------------------------
sdkwork_im_host_platform() {
  case "$(uname -s)" in
    Linux)  printf 'linux' ;;
    Darwin) printf 'macos' ;;
    *)      printf 'windows' ;;
  esac
}

sdkwork_installer_app() {
  local app_type="$1" platform="$2" environment="$3" profile="$4" out="$5" arch="$6" format="$7"
  local host_platform
  host_platform="$(sdkwork_im_host_platform)"

  case "${app_type}:${platform}" in
    server:linux|server:windows|server:macos)
      # Native server installers build only on their own host OS
      # (scripts/release/build-sdkwork-im-native-installer.mjs maps the plan
      # onto the current platform); cross-OS builds run on that host/CI.
      if [[ "${platform}" != "${host_platform}" ]]; then
        sdkwork_die "${SDKWORK_BIN_E_STATE}" \
          "the native server installer for '${platform}' is built on its own host OS (current host: ${host_platform}); run this entrypoint on a ${platform} host or CI runner"
      fi
      # Staged production files are the builder's input (bin/package.sh --stage).
      if [[ "${SDKWORK_BIN_DRY_RUN}" != "1" && ! -d "${SDKWORK_MODULE_ROOT}/dist/release-staging" ]]; then
        sdkwork_die "${SDKWORK_BIN_E_STATE}" \
          "no staged release files: ${SDKWORK_MODULE_ROOT}/dist/release-staging (run: bash bin/package.sh --stage --all)"
      fi
      sdkwork_local_run node scripts/release/build-sdkwork-im-native-installer.mjs --all
      case "${platform}" in
        linux)   sdkwork_collect_artifact "${SDKWORK_MODULE_ROOT}/dist/release-packages" "${out}" "*${arch}*.deb" '*.deb' ;;
        windows) sdkwork_collect_artifact "${SDKWORK_MODULE_ROOT}/dist/release-packages" "${out}" "*${arch}*.msi" '*.msi' ;;
        macos)   sdkwork_collect_artifact "${SDKWORK_MODULE_ROOT}/dist/release-packages" "${out}" "*${arch}*.pkg" '*.pkg' ;;
      esac ;;
    desktop:linux|desktop:windows|desktop:macos)
      # Tauri desktop bundles build only on their own host OS.
      if [[ "${platform}" != "${host_platform}" ]]; then
        sdkwork_die "${SDKWORK_BIN_E_STATE}" \
          "the desktop installer for '${platform}' is built on its own host OS (current host: ${host_platform}); run this entrypoint on a ${platform} host or CI runner"
      fi
      local bundle_root="${SDKWORK_MODULE_ROOT}/apps/sdkwork-im-pc/packages/sdkwork-im-pc-desktop/src-tauri/target/release/bundle"
      # Canonical validation pass (platform/arch filters, manifest evidence).
      sdkwork_local_run node scripts/release/collect-sdkwork-im-desktop-bundles.mjs \
        --platform "${platform}" --arch "${arch}" --check --json
      case "${platform}:${format}" in
        windows:|windows:nsis) sdkwork_collect_artifact "${bundle_root}/nsis" "${out}" '*.exe' ;;
        windows:msi)           sdkwork_collect_artifact "${bundle_root}/msi" "${out}" '*.msi' ;;
        macos:|macos:dmg)      sdkwork_collect_artifact "${bundle_root}/dmg" "${out}" '*.dmg' ;;
        linux:|linux:deb)      sdkwork_collect_artifact "${bundle_root}/deb" "${out}" '*.deb' ;;
        linux:appimage)        sdkwork_collect_artifact "${bundle_root}/appimage" "${out}" '*.AppImage' ;;
        linux:rpm)             sdkwork_collect_artifact "${bundle_root}/rpm" "${out}" '*.rpm' ;;
        *) sdkwork_die "${SDKWORK_BIN_E_USAGE}" \
             "unsupported desktop installer format '${format}' for ${platform} (windows: nsis|msi; macos: dmg; linux: deb|appimage|rpm)" ;;
      esac ;;
    flutter:android)
      local app_dir="apps/sdkwork-im-flutter-mobile"
      case "${format}" in
        ""|apk)
          sdkwork_local_run bash -c "cd ${app_dir} && flutter build apk --release"
          sdkwork_collect_artifact "${SDKWORK_MODULE_ROOT}/${app_dir}/build/app/outputs/flutter-apk" "${out}" '*release*.apk' '*.apk' ;;
        aab)
          sdkwork_local_run bash -c "cd ${app_dir} && flutter build appbundle --release"
          sdkwork_collect_artifact "${SDKWORK_MODULE_ROOT}/${app_dir}/build/app/outputs/bundle/release" "${out}" '*release*.aab' '*.aab' ;;
        *) sdkwork_die "${SDKWORK_BIN_E_USAGE}" \
             "unsupported Android installer format '${format}' (use apk|aab)" ;;
      esac ;;
    flutter:ios)
      sdkwork_die "${SDKWORK_BIN_E_STATE}" \
        "the iOS .ipa is built on a macOS host with Xcode (current host: ${host_platform}); run 'flutter build ipa' on macOS/CI, or use bin/apps-pkg-installer.sh flutter android here" ;;
    *)
      sdkwork_die "${SDKWORK_BIN_E_ENV}" \
        "unsupported app-type/platform pair '${app_type}:${platform}' (declared: ${SDKWORK_APP_TYPES}; platforms: windows|linux|macos|android|ios)" ;;
  esac
}

# ----------------------------------------------------------------------------
# Application deployment (apps-deploy.sh)
# ----------------------------------------------------------------------------
sdkwork_deploy_app() {
  local app_type="$1" action="$2" environment="$3" profile="$4" host="$5"
  case "${app_type}" in
    server)
      local staging="/opt/deploy/${SDKWORK_MODULE_ID}/packages"
      local deb base
      deb="$(sdkwork_require_artifact "${SDKWORK_MODULE_ROOT}/dist/release-packages" '*.deb' \
             "run: bin/apps-pkg-installer.sh server linux ${environment}")"
      base="$(basename "${deb}")"
      case "${action}" in
        status)
          sdkwork_service_status "${host}" "sdkwork-im" ;;
        install|upgrade)
          # Requires a remote account with root privileges (apt + systemd);
          # the .deb registers the sdkwork-im systemd unit.
          sdkwork_push_dir "${host}" "$(dirname "${deb}")" "${staging}"
          local apt_args=(env DEBIAN_FRONTEND=noninteractive apt-get install -y --reinstall)
          if [[ "${action}" == "upgrade" ]]; then apt_args+=(--allow-downgrades); fi
          apt_args+=("${staging}/${base}")
          sdkwork_remote "${host}" "${apt_args[@]}"
          sdkwork_service_enable_now "${host}" "sdkwork-im" ;;
        rollback)
          sdkwork_die "${SDKWORK_BIN_E_STATE}" \
            "the .deb channel keeps no install history; package the previous version (bin/apps-pkg-installer.sh server linux ${environment}) and re-run 'bin/apps-deploy.sh server install ${environment}'" ;;
      esac ;;
    *)
      sdkwork_die "${SDKWORK_BIN_E_ENV}" \
        "app type '${app_type}' delivery is store/channel-owned (desktop bundles, mobile store or MDM); only 'server' installs onto a host" ;;
  esac
}

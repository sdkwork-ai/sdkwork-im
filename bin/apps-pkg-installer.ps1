<#
.SYNOPSIS
  apps-pkg-installer.ps1 — native OS installer packaging on Windows
  (MODULE_BIN_SPEC.md §4.9, Windows companion of bin/apps-pkg-installer.sh).

.DESCRIPTION
  Windows-native twin of bin/apps-pkg-installer.sh for sdkwork-im. Same CLI
  contract, same repository delegation targets, same fail-fast guidance and
  sha256 sidecar rule. Runs with Windows PowerShell 5.1+ (node/flutter on
  PATH; no bash in the wrapper).

  The Windows host builds the windows-family installers:
    server  -> .msi (WiX CLI; needs staged release files)
    desktop -> Tauri bundles (.exe NSIS / .msi)
    flutter -> Android .apk / .aab (flutter SDK required)
  Linux/macOS installers must run on their own host OS — the script fails
  fast with the same cross-OS guidance as the sh entrypoint.

  CLI (mirrors bin/apps-pkg-installer.sh):
    bin/apps-pkg-installer.ps1 <app-type> <platform> <environment>[:<profile>]
        [-Arch x64|arm64] [-Format <fmt>] [-Out <dir>] [-DryRun]

.EXAMPLE
  bin/apps-pkg-installer.ps1 desktop windows production
  bin/apps-pkg-installer.ps1 flutter android test -Format aab -Arch arm64
  bin/apps-pkg-installer.ps1 server windows production -DryRun
#>
param(
  [Parameter(Position = 0)][string]$AppType = '',
  [Parameter(Position = 1)][string]$Platform = '',
  [Parameter(Position = 2)][string]$Environment = 'development',
  [string]$Arch = 'x64',
  [string]$Format = '',
  [string]$Out = '',
  [switch]$DryRun,
  [switch]$Help
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2.0

$ModuleRoot = Split-Path -Parent $PSScriptRoot
$ModuleId = 'sdkwork-im'
$AppTypes = @('server', 'h5', 'desktop', 'flutter')
$Platforms = @('windows', 'linux', 'macos', 'android', 'ios')
$Archs = @('x64', 'arm64')
$HostPlatform = 'windows'  # native Windows execution (the sh twin derives this from uname)
$TauriBundleRoot = Join-Path $ModuleRoot 'apps\sdkwork-im-pc\packages\sdkwork-im-pc-desktop\src-tauri\target\release\bundle'

function Write-Plan([string]$Message) { Write-Host "[sdkwork-bin] $Message" }
function Write-Fail([string]$Code, [string]$Message) {
  Write-Host "[sdkwork-bin] ERROR($Code): $Message"
  exit [int]$Code
}

function Convert-Environment([string]$Raw) {
  switch ($Raw) {
    'dev'        { return 'development' }
    'prod'       { return 'production' }
    'development' { return 'development' }
    'test'       { return 'test' }
    'staging'    { return 'staging' }
    'demo'       { return 'demo' }
    'production' { return 'production' }
    default {
      Write-Fail 66 "unknown environment '$Raw' (use development|test|staging|demo|production)"
    }
  }
}

function Get-NewestArtifact([string]$Dir, [string[]]$Patterns) {
  $best = $null
  foreach ($pattern in $Patterns) {
    $candidate = Get-ChildItem -Path $Dir -Filter $pattern -File -ErrorAction SilentlyContinue |
      Sort-Object LastWriteTimeUtc | Select-Object -Last 1
    if ($null -ne $candidate -and ($null -eq $best -or $candidate.LastWriteTimeUtc -ge $best.LastWriteTimeUtc)) {
      $best = $candidate
    }
  }
  return $best
}

function Write-Sha256Sidecar([string]$File) {
  if ($DryRun) { return }
  $hash = (Get-FileHash -Path $File -Algorithm SHA256).Hash.ToLowerInvariant()
  $name = Split-Path -Leaf $File
  Set-Content -Path "$File.sha256" -Value "$hash  $name" -Encoding Ascii
}

function Copy-InstallerArtifact([string]$SourceDir, [string]$OutDir, [string[]]$Patterns) {
  if ($DryRun) {
    Write-Plan "dry-run: would collect [$($Patterns -join ' ')] from $SourceDir into $OutDir"
    return
  }
  $found = Get-NewestArtifact $SourceDir $Patterns
  if ($null -eq $found) {
    Write-Fail 67 "no packaged artifact matching any of [$($Patterns -join ' ')] in $SourceDir (did the repo packager run?)"
  }
  if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir -Force | Out-Null }
  $target = Join-Path $OutDir $found.Name
  Copy-Item -Path $found.FullName -Destination $target -Force
  Write-Sha256Sidecar $target
  Write-Plan "collected $target"
}

function Assert-OutArtifacts([string]$OutDir) {
  if ($DryRun) { return }
  $patterns = @('*.tar.gz', '*.deb', '*.rpm', '*.zip', '*.apk', '*.aab', '*.msi', '*.exe', '*.pkg', '*.dmg', '*.AppImage', '*.ipa')
  $count = 0
  foreach ($pattern in $patterns) {
    $files = Get-ChildItem -Path $OutDir -Filter $pattern -File -ErrorAction SilentlyContinue
    foreach ($file in $files) {
      $count++
      if (-not (Test-Path "$($file.FullName).sha256")) {
        Write-Fail 67 "artifact without checksum: $($file.FullName) (packaging must emit a sidecar .sha256)"
      }
    }
  }
  if ($count -eq 0) {
    Write-Fail 67 "packaging produced no artifact in $OutDir (MODULE_BIN_SPEC.md §4.9)"
  }
  Write-Plan "artifacts in ${OutDir}: $count"
}

function Assert-PlatformHost([string]$Requested) {
  if ($Requested -ne $HostPlatform) {
    Write-Fail 67 "the native installer for '$Requested' is built on its own host OS (current host: $HostPlatform); run this entrypoint on a $Requested host or CI runner"
  }
}

# ---------------------------------------------------------------------------
# Entry flow: parse -> validate -> gate -> delegate -> evidence
# ---------------------------------------------------------------------------
if ($Help) {
  Get-Content (Join-Path $PSScriptRoot 'apps-pkg-installer.ps1') -TotalCount 30
  exit 0
}
if ([string]::IsNullOrEmpty($AppType) -or [string]::IsNullOrEmpty($Platform)) {
  Write-Host 'usage: bin/apps-pkg-installer.ps1 <app-type> <platform> <environment>[:<profile>] [-Arch x64|arm64] [-Format <fmt>] [-Out <dir>] [-DryRun]'
  Write-Host "app types: $($AppTypes -join ',') | platforms: $($Platforms -join ',')"
  exit 64
}
if ($AppTypes -notcontains $AppType) {
  Write-Fail 66 "app type '$AppType' not declared by $ModuleId (declared: $($AppTypes -join ','))"
}
if ($Platforms -notcontains $Platform) {
  Write-Fail 66 "unknown installer platform '$Platform' (use $($Platforms -join '|'))"
}
if ($Archs -notcontains $Arch) {
  Write-Fail 64 "unknown architecture '$Arch' (use x64|arm64)"
}
$envParts = $Environment -split ':'
$Environment = Convert-Environment $envParts[0]
if ($Out -eq '') { $Out = Join-Path $ModuleRoot 'target\bin-installers' }
if (-not $DryRun -and -not (Test-Path $Out)) { New-Item -ItemType Directory -Path $Out -Force | Out-Null }
Write-Plan "apps-pkg-installer $AppType $Platform $Environment arch=$Arch format=$(if ($Format) { $Format } else { '<module-default>' }) -> $Out"

$ReleasePackagesDir = Join-Path $ModuleRoot 'dist\release-packages'

switch ("$AppType`:$Platform") {
  'server:windows' {
    # Native server installers build from staged production files
    # (bash bin/package.sh --stage --all, or bin/package.ps1 -Stage).
    $staging = Join-Path $ModuleRoot 'dist\release-staging'
    if (-not $DryRun -and -not (Test-Path $staging)) {
      Write-Fail 67 "no staged release files: $staging (run: bash bin/package.sh --stage --all on WSL, or pwsh bin/package.ps1 -Stage)"
    }
    Write-Plan 'node scripts/release/build-sdkwork-im-native-installer.mjs --all'
    if (-not $DryRun) { node (Join-Path $ModuleRoot 'scripts\release\build-sdkwork-im-native-installer.mjs') --all }
    Copy-InstallerArtifact $ReleasePackagesDir $Out @("*$Arch*.msi", '*.msi')
  }
  'server:linux' {
    Assert-PlatformHost 'linux'
  }
  'server:macos' {
    Assert-PlatformHost 'macos'
  }
  'desktop:windows' {
    # Tauri desktop bundles build only on their own host OS.
    Assert-PlatformHost 'windows'
    # Canonical validation pass (platform/arch filters, manifest evidence).
    Write-Plan "node scripts/release/collect-sdkwork-im-desktop-bundles.mjs --platform windows --arch $Arch --check --json"
    if (-not $DryRun) { node (Join-Path $ModuleRoot 'scripts\release\collect-sdkwork-im-desktop-bundles.mjs') --platform windows --arch $Arch --check --json }
    switch ($Format) {
      ''        { Copy-InstallerArtifact (Join-Path $TauriBundleRoot 'nsis') $Out @('*.exe') }
      'nsis'    { Copy-InstallerArtifact (Join-Path $TauriBundleRoot 'nsis') $Out @('*.exe') }
      'msi'     { Copy-InstallerArtifact (Join-Path $TauriBundleRoot 'msi') $Out @('*.msi') }
      default   { Write-Fail 64 "unsupported desktop installer format '$Format' for windows (nsis|msi)" }
    }
  }
  'desktop:linux' {
    Assert-PlatformHost 'linux'
  }
  'desktop:macos' {
    Assert-PlatformHost 'macos'
  }
  'flutter:android' {
    $appDir = Join-Path $ModuleRoot 'apps\sdkwork-im-flutter-mobile'
    switch ($Format) {
      '' {
        Write-Plan 'flutter build apk --release (apps/sdkwork-im-flutter-mobile)'
        if (-not $DryRun) { Push-Location $appDir; try { flutter build apk --release } finally { Pop-Location } }
        Copy-InstallerArtifact (Join-Path $appDir 'build\app\outputs\flutter-apk') $Out @('*release*.apk', '*.apk')
      }
      'apk' {
        Write-Plan 'flutter build apk --release (apps/sdkwork-im-flutter-mobile)'
        if (-not $DryRun) { Push-Location $appDir; try { flutter build apk --release } finally { Pop-Location } }
        Copy-InstallerArtifact (Join-Path $appDir 'build\app\outputs\flutter-apk') $Out @('*release*.apk', '*.apk')
      }
      'aab' {
        Write-Plan 'flutter build appbundle --release (apps/sdkwork-im-flutter-mobile)'
        if (-not $DryRun) { Push-Location $appDir; try { flutter build appbundle --release } finally { Pop-Location } }
        Copy-InstallerArtifact (Join-Path $appDir 'build\app\outputs\bundle\release') $Out @('*release*.aab', '*.aab')
      }
      default { Write-Fail 64 "unsupported Android installer format '$Format' (use apk|aab)" }
    }
  }
  'flutter:ios' {
    Write-Fail 67 "the iOS .ipa is built on a macOS host with Xcode (current host: $HostPlatform); run 'flutter build ipa' on macOS/CI, or use bin/apps-pkg-installer.ps1 flutter android here"
  }
  default {
    Write-Fail 66 "unsupported app-type/platform pair '${AppType}:${Platform}' (declared: $($AppTypes -join ','); platforms: $($Platforms -join '|'))"
  }
}

Assert-OutArtifacts $Out

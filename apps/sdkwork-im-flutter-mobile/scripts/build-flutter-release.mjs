#!/usr/bin/env node

/**
 * Release build for the Flutter app.
 *
 * `APP_RUNTIME_ENV_SPEC.md` §3.1: generate the selected profile's typed
 * `EnvConfig` before compilation, then build. The selected profile is supplied
 * by the lifecycle facade (`SDKWORK_IM_PROFILE_ID` / `SDKWORK_PROFILE_ID`).
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { generateFlutterEnvConfig } from './flutter-dev.mjs';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function resolveProfileId() {
  const value = String(
    process.env.SDKWORK_IM_PROFILE_ID ?? process.env.SDKWORK_PROFILE_ID ?? '',
  ).trim();
  if (!/^(?:standalone|cloud)\.(?:development|test|staging|demo|production)$/u.test(value)) {
    throw new Error(
      'SDKWORK_IM_PROFILE_ID must be a canonical <deployment-profile>.<environment> profile for a release build',
    );
  }
  return value;
}

function main() {
  const profileId = resolveProfileId();
  generateFlutterEnvConfig(profileId);
  const result = spawnSync(
    process.platform === 'win32' ? 'flutter.bat' : 'flutter',
    ['build', 'appbundle'],
    { cwd: appRoot, env: process.env, stdio: 'inherit', windowsHide: true },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`flutter build appbundle exited with code ${result.status ?? 1}`);
}

try {
  main();
} catch (error) {
  console.error(`[sdkwork-im-flutter-build] ${error.message}`);
  process.exit(1);
}

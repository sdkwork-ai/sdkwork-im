#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  removeImRuntimeStateFile,
  resolveImTemporaryFilePath,
  writeImPrivateJsonFile,
} from '../../../scripts/lib/im-temporary-state.mjs';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(appRoot, '..', '..');
const ENV_CONFIG_GENERATOR = path.resolve(
  repositoryRoot,
  '..',
  'sdkwork-specs',
  'tools',
  'generate-app-env-config.mjs',
);
const SUPPORTED_TARGETS = new Set(['android', 'ios']);
const PROFILE_ID = /^(?:standalone|cloud)\.(?:development|test|staging|demo|production)$/u;
const DEVICE_ID = /^[A-Za-z0-9._:-]+$/u;

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function requiredEnv(env, key) {
  const value = String(env[key] ?? '').trim();
  if (!value) throw new Error(`${key} is required from the selected topology profile`);
  return value;
}

function readCommittedAccessToken(root, profileId) {
  const profilePath = path.join(root, 'env', `sdkwork.${profileId}.json`);
  let values;
  try {
    values = JSON.parse(readFileSync(profilePath, 'utf8'));
  } catch (error) {
    throw new Error(
      `SDKWORK_ACCESS_TOKEN profile file is unreadable: ${profilePath} (run node ../../../sdkwork-specs/tools/materialize-client-env.mjs --root ../../..)`,
    );
  }
  const token = String(values?.SDKWORK_ACCESS_TOKEN ?? '').trim();
  if (!token) {
    throw new Error(
      `SDKWORK_ACCESS_TOKEN is missing in ${profilePath}; run node ../../../sdkwork-specs/tools/materialize-client-env.mjs --root ../../..`,
    );
  }
  return token;
}

export function createFlutterDefineConfig(env = process.env) {
  const applicationHttpUrl = requiredEnv(env, 'SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL');
  const deploymentProfile = requiredEnv(env, 'SDKWORK_IM_DEPLOYMENT_PROFILE');
  const environment = requiredEnv(env, 'SDKWORK_IM_ENVIRONMENT');
  const profileId = requiredEnv(env, 'SDKWORK_IM_PROFILE_ID');
  if (profileId !== `${deploymentProfile}.${environment}`) {
    throw new Error('SDKWORK_IM_PROFILE_ID must match deployment profile and environment');
  }
  return {
    SDKWORK_APP_ID: 'sdkwork-im-flutter-mobile',
    SDKWORK_DEPLOYMENT_PROFILE: deploymentProfile,
    SDKWORK_ENVIRONMENT: environment,
    SDKWORK_PROFILE_ID: profileId,
    SDKWORK_RUNTIME_TARGET: 'flutter-android',
    SDKWORK_IM_DEPLOYMENT_PROFILE: deploymentProfile,
    SDKWORK_IM_ENVIRONMENT: environment,
    SDKWORK_IM_PROFILE_ID: profileId,
    SDKWORK_IM_RUNTIME_TARGET: 'flutter-android',
    SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL: applicationHttpUrl,
    SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL: requiredEnv(
      env,
      'SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL',
    ),
    SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL: requiredEnv(
      env,
      'SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL',
    ),
    SDKWORK_IAM_APP_API_BASE_URL: String(env.SDKWORK_IAM_APP_API_BASE_URL ?? applicationHttpUrl).trim(),
  };
}

export function createFlutterDevPlan({
  accessToken = '',
  args = [],
  env = process.env,
  repoRoot = repositoryRoot,
  root = appRoot,
  runtimeStateOptions = {},
} = {}) {
  const target = option(args, '--target');
  if (!SUPPORTED_TARGETS.has(target)) throw new Error('--target must be android or ios');
  const profileId = requiredEnv(env, 'SDKWORK_IM_PROFILE_ID');
  if (!PROFILE_ID.test(profileId)) throw new Error('SDKWORK_IM_PROFILE_ID must be a canonical profile id');
  const resolvedAccessToken = String(accessToken || env.SDKWORK_ACCESS_TOKEN || '').trim()
    || readCommittedAccessToken(root, profileId);
  const flutterArgs = ['run'];
  const deviceId = String(env.SDKWORK_FLUTTER_DEVICE_ID ?? '').trim();
  if (deviceId && !DEVICE_ID.test(deviceId)) {
    throw new Error('SDKWORK_FLUTTER_DEVICE_ID contains unsupported characters');
  }
  if (deviceId) flutterArgs.push('--device-id', deviceId);
  const runtimeTarget = target === 'ios' ? 'flutter-ios' : 'flutter-android';
  const config = createFlutterDefineConfig(env);
  config.SDKWORK_ACCESS_TOKEN = resolvedAccessToken;
  config.SDKWORK_RUNTIME_TARGET = runtimeTarget;
  config.SDKWORK_IM_RUNTIME_TARGET = runtimeTarget;
  const configPath = resolveImTemporaryFilePath({
    ...runtimeStateOptions,
    extension: '.json',
    fileName: `${profileId}.${target}.dart-define`,
    purpose: 'flutter-dev',
    repoRoot,
  });
  flutterArgs.push('--dart-define-from-file', configPath);
  return {
    command: process.platform === 'win32' ? 'flutter.bat' : 'flutter',
    config,
    configPath,
    flutterArgs,
    profileId,
    repoRoot,
    root,
    runtimeStateOptions,
    target,
  };
}

export function runFlutterDevelopment(plan, { spawn = spawnSync } = {}) {
  const stateOptions = { repoRoot: plan.repoRoot, ...plan.runtimeStateOptions };
  try {
    writeImPrivateJsonFile(plan.configPath, plan.config, stateOptions);
    const result = spawn(plan.command, plan.flutterArgs, {
      cwd: plan.root,
      env: process.env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      windowsHide: true,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`flutter run exited with code ${result.status ?? 1}`);
  } finally {
    removeImRuntimeStateFile(plan.configPath, stateOptions);
  }
}

export function generateFlutterEnvConfig(profileId, { spawn = spawnSync } = {}) {
  const result = spawn(process.execPath, [
    ENV_CONFIG_GENERATOR,
    '--root', appRoot,
    '--profile', profileId,
    '--format', 'dart',
    '--output', 'lib/generated/env_config.dart',
    '--app-id', 'sdkwork-im-flutter-mobile',
  ], {
    cwd: appRoot,
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`EnvConfig generation failed with code ${result.status ?? 1}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const plan = createFlutterDevPlan({ args: process.argv.slice(2) });
    generateFlutterEnvConfig(plan.profileId);
    try {
      runFlutterDevelopment(plan);
    } finally {
      // Keep the committed generated default stable after a dev session.
      generateFlutterEnvConfig('standalone.development');
    }
  } catch (error) {
    console.error(`[sdkwork-im-flutter-dev] ${error.message}`);
    process.exitCode = 1;
  }
}

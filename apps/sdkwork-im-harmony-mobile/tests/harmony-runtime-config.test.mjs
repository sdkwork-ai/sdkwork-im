/**
 * Runtime-configuration contract for the IM HarmonyOS mobile root.
 *
 * Authority: `ENVIRONMENT_SPEC.md` sections 5.1.0.1, 5.1.2, 5.1.3, and 5.1.4.1.
 *
 * Why this test exists
 * --------------------
 * `sdkwork-specs/tools/materialize-client-env.mjs` implements only the `vite`,
 * `flutter`, `mini-program`, and `none` surface formats; there is no Harmony
 * format, so `etc/sdkwork.deployment.config.json` declares the ten documents as
 * authored-and-checked-in rather than generated. That declaration is only honest if
 * something validates the documents, which is this suite. It also pins the values to
 * the mini program's materialized documents, so "authored" cannot quietly drift into
 * "invented".
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, '..');
const APPS_ROOT = path.resolve(APP_ROOT, '..');
const RUNTIME_DIR = path.join(APP_ROOT, 'config', 'app');
const MINI_PROGRAM_DIR = path.join(APPS_ROOT, 'sdkwork-im-mini-program', 'config', 'mini-program');
const GENERATED_ENTRY = path.join(APP_ROOT, 'entry', 'src', 'main', 'ets', 'generated', 'RuntimeConfig.ets');
const DEPLOYMENT_CONFIG = path.join(APP_ROOT, 'etc', 'sdkwork.deployment.config.json');

const EXPECTED_PROFILE_IDS = [
  'cloud.demo',
  'cloud.development',
  'cloud.production',
  'cloud.staging',
  'cloud.test',
  'standalone.demo',
  'standalone.development',
  'standalone.production',
  'standalone.staging',
  'standalone.test',
];

const DEFAULT_PROFILE_ID = 'standalone.development';

const RUNTIME_TARGET = 'harmony-native';

/**
 * Endpoint catalogue: `[label, document group, document key, mini program key]`.
 *
 * `appbase.loginUrl` maps to the mini program's public application URL, not to its
 * app-api base URL: the mini program document has no separate login key, and the
 * login page is served from the application ingress.
 */
const ENDPOINT_PAIRS = [
  ['im.apiBaseUrl', 'im', 'apiBaseUrl', 'SDKWORK_IM_API_BASE_URL'],
  ['im.platformApiGatewayHttpUrl', 'im', 'platformApiGatewayHttpUrl', 'SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL'],
  ['im.applicationPublicHttpUrl', 'im', 'applicationPublicHttpUrl', 'SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL'],
  ['im.applicationPublicWebsocketUrl', 'im', 'applicationPublicWebsocketUrl', 'SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL'],
  ['appbase.appApiBaseUrl', 'appbase', 'appApiBaseUrl', 'SDKWORK_IAM_APP_API_BASE_URL'],
  ['appbase.loginUrl', 'appbase', 'loginUrl', 'SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL'],
];

const HTTP_FIELDS = new Set([
  'im.apiBaseUrl',
  'im.platformApiGatewayHttpUrl',
  'im.applicationPublicHttpUrl',
  'appbase.appApiBaseUrl',
  'appbase.loginUrl',
]);

const CANONICAL_API_PREFIXES = ['/app/v3/api', '/backend/v3/api'];

function runtimeDocumentPath(profileId) {
  return path.join(RUNTIME_DIR, `runtime-env.${profileId}.json`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readRuntimeDocument(profileId) {
  return readJson(runtimeDocumentPath(profileId));
}

describe('harmony runtime config', () => {
  it('tracks exactly the ten registered profiles', () => {
    const profiles = fs
      .readdirSync(RUNTIME_DIR)
      .filter((name) => /^runtime-env\..+\.json$/u.test(name))
      .map((name) => name.slice('runtime-env.'.length, -'.json'.length))
      .sort((a, b) => a.localeCompare(b));
    assert.deepEqual(profiles, EXPECTED_PROFILE_IDS);
  });

  it('declares identity keys that agree with the filename and each other', () => {
    for (const profileId of EXPECTED_PROFILE_IDS) {
      const document = readRuntimeDocument(profileId);
      assert.equal(document.profileId, profileId, `${profileId}: profileId`);
      assert.equal(
        document.profileId,
        `${document.deploymentProfile}.${document.environment}`,
        `${profileId}: profileId must be <deploymentProfile>.<environment>`,
      );
      assert.equal(document.runtimeTarget, RUNTIME_TARGET, `${profileId}: runtimeTarget`);
      assert.ok(String(document.environment).length > 0, `${profileId}: environment is required`);
      assert.ok(String(document.deploymentProfile).length > 0, `${profileId}: deploymentProfile is required`);
    }
  });

  it('declares both endpoint groups with every required key', () => {
    for (const profileId of EXPECTED_PROFILE_IDS) {
      const document = readRuntimeDocument(profileId);
      assert.equal(typeof document.im, 'object', `${profileId}: im group`);
      assert.equal(typeof document.appbase, 'object', `${profileId}: appbase group`);
      for (const [label, group, key] of ENDPOINT_PAIRS) {
        const value = document[group][key];
        assert.equal(typeof value, 'string', `${profileId}: ${label} must be a string`);
        assert.ok(value.trim().length > 0, `${profileId}: ${label} must be non-empty`);
      }
    }
  });

  it('materializes absolute origins with the expected scheme', () => {
    for (const profileId of EXPECTED_PROFILE_IDS) {
      const document = readRuntimeDocument(profileId);
      for (const [label, group, key] of ENDPOINT_PAIRS) {
        for (const origin of document[group][key].split(';')) {
          const match = /^([a-z][a-z0-9+.-]*):\/\/([^/\s]+)$/u.exec(origin);
          assert.ok(match, `${profileId}: ${label} origin must be absolute, found ${origin}`);
          const expected = HTTP_FIELDS.has(label) ? ['http', 'https'] : ['ws', 'wss'];
          assert.ok(
            expected.includes(match[1]),
            `${profileId}: ${label} must use ${expected.join('/')}, found ${match[1]}`,
          );
        }
      }
    }
  });

  it('keeps base URLs free of the canonical api prefix', () => {
    // ENVIRONMENT_SPEC.md section 5.1.4.1 assigns prefix normalization to the
    // generated SDK transport layer. A document that already carries the prefix
    // produces /app/v3/api/app/v3/api at request time.
    for (const profileId of EXPECTED_PROFILE_IDS) {
      const document = readRuntimeDocument(profileId);
      for (const [label, group, key] of ENDPOINT_PAIRS) {
        for (const prefix of CANONICAL_API_PREFIXES) {
          assert.ok(
            !document[group][key].includes(prefix),
            `${profileId}: ${label} must be a bare origin, not a path carrying ${prefix}`,
          );
        }
      }
    }
  });

  it('matches the mini program materialized documents value for value', () => {
    for (const profileId of EXPECTED_PROFILE_IDS) {
      const harmony = readRuntimeDocument(profileId);
      const miniProgram = readJson(
        path.join(MINI_PROGRAM_DIR, `runtime-env.${profileId}.json`),
      );
      assert.equal(
        `${miniProgram.SDKWORK_PROFILE_ID}`,
        profileId,
        `${profileId}: mini program profile id must agree`,
      );
      for (const [label, group, key, miniProgramKey] of ENDPOINT_PAIRS) {
        assert.equal(
          harmony[group][key],
          `${miniProgram[miniProgramKey]}`,
          `${profileId}: ${label} must equal the mini program value`,
        );
      }
    }
  });

  it('records the deferred materialization instead of a fabricated command', () => {
    const config = readJson(DEPLOYMENT_CONFIG);
    assert.equal(config.materialization.checkedIn, true, 'checkedIn');
    assert.equal(config.materialization.deferred, true, 'deferred');
    assert.ok(
      String(config.materialization.deferredReason ?? '').length > 0,
      'a deferred materialization must state its reason',
    );
    assert.equal(config.materialization.runtimeTarget, RUNTIME_TARGET, 'runtimeTarget');
    assert.equal(
      config.materialization.command,
      undefined,
      'a deferred materialization must not declare a command',
    );
    assert.deepEqual(
      [...config.materialization.profiles].sort((a, b) => a.localeCompare(b)),
      EXPECTED_PROFILE_IDS,
      'declared profiles must match the tracked documents',
    );
    for (const profileId of EXPECTED_PROFILE_IDS) {
      assert.ok(
        config.profiles[profileId]?.source,
        `profile ${profileId} must declare its source document`,
      );
    }
  });

  it('projects every profile into the generated ArkTS module', () => {
    const generated = fs.readFileSync(GENERATED_ENTRY, 'utf8');
    assert.ok(
      generated.includes('GENERATED FILE - DO NOT EDIT'),
      'the generated module must be marked as generated',
    );
    for (const profileId of EXPECTED_PROFILE_IDS) {
      assert.ok(
        generated.includes(`profileId: "${profileId}"`),
        `generated RuntimeConfig.ets is missing profile ${profileId}`,
      );
    }
    assert.ok(
      generated.includes(`IM_HARMONY_DEFAULT_PROFILE_ID: string = "${DEFAULT_PROFILE_ID}"`),
      'the generated module must pin the default profile id',
    );
    assert.ok(
      generated.includes("from '../bootstrap/EnvironmentContract'"),
      'the generated module must import the document contract, not redeclare it',
    );
  });

  it('is up to date with its generator', () => {
    const output = execFileSync(
      process.execPath,
      [path.join(APP_ROOT, 'scripts', 'generate-harmony-runtime-config.mjs'), '--check'],
      { cwd: APP_ROOT, encoding: 'utf8' },
    );
    assert.match(output, /up to date/u);
  });
});

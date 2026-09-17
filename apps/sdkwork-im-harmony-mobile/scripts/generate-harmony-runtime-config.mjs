#!/usr/bin/env node
/**
 * Generates the ArkTS runtime-config module for the IM HarmonyOS root.
 *
 * Why this exists
 * ---------------
 * `ENVIRONMENT_SPEC.md` section 5.1.3 records that a native HarmonyOS root
 * tracks `config/app/runtime-env.<profile-id>.json` and that "hvigor projects one
 * selected non-secret resource". A HAP cannot read an arbitrary JSON file off the
 * build host at runtime, and ArkTS cannot `import` a loose JSON asset the way the
 * mini program loader can, so the projection has to be an ArkTS module. This
 * script is that projection.
 *
 * Generating instead of hand-authoring matters because the ten runtime documents
 * are the single source of truth for the app's endpoints: a hand-copied ArkTS
 * table drifts silently, and the drift only shows up as a production app pointing
 * at the wrong origin. `tests/harmony-runtime-config.test.mjs` runs this script in
 * `--check` mode, so drift fails the gate.
 *
 * Usage
 * -----
 *   node scripts/generate-harmony-runtime-config.mjs           # write
 *   node scripts/generate-harmony-runtime-config.mjs --check   # verify only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, '..');
const SOURCE_DIR = path.join(APP_ROOT, 'config', 'app');
const OUTPUT_PATH = path.join(APP_ROOT, 'entry', 'src', 'main', 'ets', 'generated', 'RuntimeConfig.ets');

const DEFAULT_PROFILE_ID = 'standalone.development';

const RUNTIME_TARGET = 'harmony-native';

const REQUIRED_IDENTITY_KEYS = ['environment', 'deploymentProfile', 'profileId', 'runtimeTarget'];

const REQUIRED_ENDPOINT_PATHS = [
  ['im', 'apiBaseUrl'],
  ['im', 'platformApiGatewayHttpUrl'],
  ['im', 'applicationPublicHttpUrl'],
  ['im', 'applicationPublicWebsocketUrl'],
  ['appbase', 'appApiBaseUrl'],
  ['appbase', 'loginUrl'],
];

function fail(message) {
  process.stderr.write(`generate-harmony-runtime-config: ${message}\n`);
  process.exit(1);
}

function readSourceDocuments() {
  if (!fs.existsSync(SOURCE_DIR)) {
    fail(`runtime env source directory is missing: ${SOURCE_DIR}`);
  }
  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => /^runtime-env\..+\.json$/u.test(name))
    .sort((a, b) => a.localeCompare(b));
  if (files.length === 0) {
    fail(`no runtime-env.<profile-id>.json documents found under ${SOURCE_DIR}`);
  }

  const documents = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
    let document;
    try {
      document = JSON.parse(raw);
    } catch (error) {
      fail(`${file} is not valid JSON: ${error.message}`);
    }

    for (const key of REQUIRED_IDENTITY_KEYS) {
      if (typeof document[key] !== 'string' || document[key].length === 0) {
        fail(`${file}: identity key ${key} is required`);
      }
    }
    if (document.runtimeTarget !== RUNTIME_TARGET) {
      fail(`${file}: runtimeTarget must be ${RUNTIME_TARGET}, found ${document.runtimeTarget}`);
    }
    const expectedProfileId = `${document.deploymentProfile}.${document.environment}`;
    if (document.profileId !== expectedProfileId) {
      fail(`${file}: profileId ${document.profileId} does not match ${expectedProfileId}`);
    }
    if (path.basename(file) !== `runtime-env.${document.profileId}.json`) {
      fail(`${file}: filename must be runtime-env.${document.profileId}.json`);
    }
    for (const [group, key] of REQUIRED_ENDPOINT_PATHS) {
      const value = document[group]?.[key];
      if (typeof value !== 'string' || value.trim().length === 0) {
        fail(`${file}: ${group}.${key} is required`);
      }
    }

    documents.push(document);
  }

  const seen = new Set();
  for (const document of documents) {
    if (seen.has(document.profileId)) {
      fail(`duplicate profileId ${document.profileId}`);
    }
    seen.add(document.profileId);
  }
  if (!seen.has(DEFAULT_PROFILE_ID)) {
    fail(`default profile ${DEFAULT_PROFILE_ID} has no runtime-env document`);
  }

  return documents.sort((a, b) => a.profileId.localeCompare(b.profileId));
}

function renderEndpointObject(indent, name, value) {
  const lines = [`${indent}${name}: {`];
  for (const key of Object.keys(value)) {
    lines.push(`${indent}  ${key}: ${JSON.stringify(value[key])},`);
  }
  lines.push(`${indent}},`);
  return lines;
}

function render(documents) {
  const lines = [];
  lines.push('/**');
  lines.push(' * GENERATED FILE - DO NOT EDIT.');
  lines.push(' *');
  lines.push(' * Source: config/app/runtime-env.<profile-id>.json');
  lines.push(' * Generator: scripts/generate-harmony-runtime-config.mjs');
  lines.push(' *');
  lines.push(' * `ENVIRONMENT_SPEC.md` section 5.1.3 requires a native HarmonyOS root to package exactly');
  lines.push(' * one selected non-secret runtime resource. A HAP cannot read the tracked JSON at runtime,');
  lines.push(' * so the ten documents are projected into this module and the selection happens here.');
  lines.push(' * Regenerate with: node scripts/generate-harmony-runtime-config.mjs');
  lines.push(' */');
  lines.push("import { type ImHarmonyRuntimeEnvDocument } from '../bootstrap/EnvironmentContract';");
  lines.push('');
  lines.push(`export const IM_HARMONY_DEFAULT_PROFILE_ID: string = ${JSON.stringify(DEFAULT_PROFILE_ID)};`);
  lines.push('');
  lines.push('/** Every tracked runtime document, ordered by profile id. */');
  lines.push('export const IM_HARMONY_RUNTIME_ENV_DOCUMENTS: ImHarmonyRuntimeEnvDocument[] = [');
  for (const document of documents) {
    lines.push('  {');
    lines.push(`    environment: ${JSON.stringify(document.environment)},`);
    lines.push(`    deploymentProfile: ${JSON.stringify(document.deploymentProfile)},`);
    lines.push(`    profileId: ${JSON.stringify(document.profileId)},`);
    lines.push(`    runtimeTarget: ${JSON.stringify(document.runtimeTarget)},`);
    lines.push(...renderEndpointObject('    ', 'im', document.im));
    lines.push(...renderEndpointObject('    ', 'appbase', document.appbase));
    lines.push('  },');
  }
  lines.push('];');
  lines.push('');
  return `${lines.join('\n')}`;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const documents = readSourceDocuments();
  const content = render(documents);
  const existing = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, 'utf8') : null;

  if (existing === content) {
    process.stdout.write(
      `harmony runtime config up to date: ${documents.length} profile(s) -> ${path.relative(APP_ROOT, OUTPUT_PATH)}\n`,
    );
    return;
  }

  if (checkOnly) {
    fail(
      `${path.relative(APP_ROOT, OUTPUT_PATH)} is stale or missing; `
      + 'run `node scripts/generate-harmony-runtime-config.mjs`',
    );
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
  process.stdout.write(
    `harmony runtime config written: ${documents.length} profile(s) -> ${path.relative(APP_ROOT, OUTPUT_PATH)}\n`,
  );
}

main();

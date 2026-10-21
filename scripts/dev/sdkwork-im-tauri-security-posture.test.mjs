#!/usr/bin/env node
/**
 * Tauri desktop security posture guard.
 *
 * The shell `open` allowlist previously accepted `file://`, Windows drive
 * paths (`C:\...`), and UNC shares (`\\server\share`). A renderer compromise
 * could therefore open arbitrary local paths or leak credentials through an
 * SMB connection. Only mailto/tel/https remain allowed.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const tauriRoot = path.join(
  repoRoot,
  'apps',
  'sdkwork-im-pc',
  'packages',
  'sdkwork-im-pc-desktop',
  'src-tauri',
);

function readJson(absolutePath) {
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

const config = readJson(path.join(tauriRoot, 'tauri.conf.json'));
assert.equal(
  config.build?.frontendDist,
  '../../../dist/standalone/prod',
  'desktop must embed the standalone production renderer build output, not a bare dist/ directory',
);
const desktopBuildScript = fs.readFileSync(
  path.join(repoRoot, 'scripts', 'dev', 'run-sdkwork-im-pc-tauri-renderer-build.mjs'),
  'utf8',
);
assert.ok(
  desktopBuildScript.includes('standalone.production'),
  'desktop renderer build must pin the standalone.production Vite mode',
);
const openPattern = config.plugins?.shell?.open;
assert.equal(typeof openPattern, 'string', 'plugins.shell.open allowlist must be declared');
assert.match(openPattern, /mailto:/u, 'mailto links stay allowed');
assert.match(openPattern, /tel:/u, 'tel links stay allowed');
assert.match(openPattern, /https\?:\/\//u, 'http(s) links stay allowed');

const decodedPattern = openPattern.replaceAll('\\\\', '\\');
for (const forbidden of ['file:', 'A-Za-z]:', '\\\\\\\\']) {
  assert.ok(
    !decodedPattern.includes(forbidden),
    `shell.open must not allow local file access pattern ${JSON.stringify(forbidden)}`,
  );
}

const security = config.app?.security ?? {};
assert.equal(
  security.freezePrototype,
  true,
  'app.security.freezePrototype must stay enabled to block prototype pollution from injected content',
);
const csp = security.csp;
assert.equal(typeof csp, 'string', 'app.security.csp must be a non-empty CSP string');
for (const directive of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "frame-src 'none'"]) {
  assert.ok(csp.includes(directive), `CSP must declare ${directive}`);
}
assert.ok(
  !csp.includes("script-src 'self' 'unsafe-eval'"),
  'CSP must not enable unsafe-eval for renderer scripts',
);

const capability = readJson(path.join(tauriRoot, 'capabilities', 'default.json'));
assert.ok(Array.isArray(capability.permissions), 'desktop capability permissions must be an array');
for (const forbiddenPermission of ['shell:allow-execute', 'shell:allow-kill', 'shell:allow-spawn']) {
  assert.ok(
    !capability.permissions.includes(forbiddenPermission),
    `desktop capability must not grant ${forbiddenPermission}`,
  );
}
assert.ok(
  capability.permissions.includes('shell:allow-open'),
  'shell:allow-open remains the single shell capability (now URL-scoped)',
);

process.stdout.write('tauri security posture passed\n');

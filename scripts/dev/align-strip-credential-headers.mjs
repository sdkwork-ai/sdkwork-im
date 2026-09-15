#!/usr/bin/env node
/**
 * Align every generated SDK client's stripCredentialHeaders list with the
 * Web Framework server guard (sdkwork-web-core::constants::FORBIDDEN_CLIENT_IDENTITY_HEADERS,
 * API_SPEC §10.2 / SECURITY_SPEC §5.1 / spec B9).
 *
 * Replaces the legacy 9-entry identity block with the canonical superset.
 * Files whose block does not match are reported as UNMATCHED for manual review.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OLD_BLOCK = `      'X-Tenant-Id',
      'X-Organization-Id',
      'X-Platform',
      'X-User-Id',
      'X-Sdkwork-Tenant-Id',
      'X-Sdkwork-Organization-Id',
      'X-Sdkwork-User-Id',
    ].forEach((key) => {`;

const NEW_BLOCK = `      'X-Tenant-Id',
      'X-App-Id',
      'X-Organization-Id',
      'X-Platform',
      'X-User-Id',
      'X-Sdkwork-Tenant-Id',
      'X-Sdkwork-App-Id',
      'X-Sdkwork-User-Id',
      'X-Sdkwork-Organization-Id',
      'X-Sdkwork-Actor-Id',
      'X-Sdkwork-Actor-Kind',
      'X-Sdkwork-Session-Id',
      'X-Sdkwork-Environment',
      'X-Sdkwork-Deployment-Profile',
      'X-Sdkwork-Deployment-Mode',
      'X-Sdkwork-Runtime-Target',
      'X-Sdkwork-Auth-Level',
      'X-Sdkwork-Data-Scope',
      'X-Sdkwork-Permission-Scope',
      'X-Sdkwork-Device-Id',
      'X-Sdkwork-Context-Signature',
      'X-Sdkwork-Operation-Id',
      'X-Sdkwork-Subject-Tenant-Id',
      'X-Sdkwork-Subject-Organization-Id',
      'X-Sdkwork-Subject-User-Id',
      'X-Sdkwork-Subject-Timestamp',
      'X-Sdkwork-Subject-Signature',
    ].forEach((key) => {`;

// The checkout root, in the two shapes the two consumers need: a native path for
// `node:fs`, and forward slashes for the `bash` child process (Git Bash accepts a
// drive-rooted path with forward slashes, and grep echoes arguments back in the
// form it was given).
const WORKSPACE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const BASH_WORKSPACE_ROOT = WORKSPACE_ROOT.split(path.sep).join('/');

const list = execSync(
  `grep -rln "stripCredentialHeaders" "${BASH_WORKSPACE_ROOT}" --include=client.ts 2>/dev/null | grep -vE "node_modules|/target/|\\\\.git|dist/|manual-backups|\\\\.sdkwork/tmp|\\\\.strict-generated" | sort`,
  { shell: 'bash' },
).toString().trim().split('\n').filter(Boolean);

let patched = 0, already = 0, unmatched = [];
for (const file of list) {
  const src = readFileSync(file, 'utf8');
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const oldBlock = OLD_BLOCK.split('\n').join(eol);
  const newBlock = NEW_BLOCK.split('\n').join(eol);
  if (src.includes(newBlock)) {
    already += 1;
    continue;
  }
  if (src.includes(oldBlock)) {
    writeFileSync(file, src.replace(oldBlock, newBlock));
    patched += 1;
    continue;
  }
  unmatched.push(file);
}

console.log(`total=${list.length} patched=${patched} already-aligned=${already} unmatched=${unmatched.length}`);
for (const f of unmatched) console.log('UNMATCHED: ' + f);

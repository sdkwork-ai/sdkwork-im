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

const files = execSync(
  'git -C /e/sdkwork-space ls-files --error-unmatch 2>/dev/null; true; echo skip',
  { shell: 'bash' },
).toString();
const list = execSync(
  `grep -rln "stripCredentialHeaders" /e/sdkwork-space --include=client.ts 2>/dev/null | grep -vE "node_modules|/target/|\\\\.git|dist/|manual-backups|\\\\.sdkwork/tmp|\\\\.strict-generated" | sort`,
  { shell: 'bash' },
).toString().trim().split('\n').filter(Boolean)
  // Convert git-bash absolute paths (/e/foo) to Windows paths (E:/foo).
  .map((p) => (p.startsWith('/e/') ? `E:/${p.slice(3)}` : p));

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

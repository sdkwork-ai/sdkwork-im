#!/usr/bin/env node

/**
 * Install repository-local Git hooks for SDKWork env checks.
 *
 * The tracked hook lives in `.githooks/`; this script points the local clone at
 * it without rewriting hook files during install.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const hooksDir = path.join(root, '.githooks');
if (!existsSync(path.join(root, '.git')) || !existsSync(hooksDir)) {
  process.exit(0);
}

try {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: root, stdio: 'ignore' });
  console.log('git hooks installed: core.hooksPath=.githooks');
} catch (error) {
  console.warn(`git hook installation skipped: ${error instanceof Error ? error.message : String(error)}`);
}

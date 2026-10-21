#!/usr/bin/env node
/**
 * Regression guard: the IM-wide organization scope sentinel `0` must be
 * accepted by the group Knowledgebase tables.
 *
 * Tenant sessions use `organization_id = '0'` (see
 * `services/sdkwork-comms-conversation-service/src/runtime/knowledgebase.rs`
 * and the `DEFAULT '0'` on every organization column). Both Knowledgebase
 * CHECK constraints previously accepted only positive ids, so Owner
 * initialization and launch-ticket issuance failed for every tenant-scoped
 * session. This test pins the baseline contract and the forward migration that
 * widens existing databases.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

const constraints = [
  'chk_im_conversation_knowledge_space_link_organization_id',
  'chk_im_group_knowledge_launch_tickets_organization_id',
];

const baseline = read('database/ddl/baseline/postgres/0001_im_baseline.sql');
const migrationPath = 'database/migrations/postgres/0009_im_knowledgebase_org_zero_sentinel.up.sql';
const migration = read(migrationPath);

for (const constraint of constraints) {
  const baselinePattern = new RegExp(
    `CONSTRAINT\\s+${constraint}\\s+CHECK\\s*\\(\\s*organization_id = '0'`,
    'u',
  );
  assert.match(
    baseline,
    baselinePattern,
    `${constraint} in the baseline must accept the '0' organization sentinel`,
  );

  assert.ok(
    migration.includes(constraint),
    `${migrationPath} must address ${constraint}`,
  );
  const migrationPattern = new RegExp(
    `DROP CONSTRAINT IF EXISTS ${constraint}[\\s\\S]*?CONSTRAINT\\s+${constraint}\\s+CHECK\\s*\\(\\s*organization_id = '0'`,
    'u',
  );
  assert.match(
    migration,
    migrationPattern,
    `${migrationPath} must drop and recreate ${constraint} with the '0' sentinel`,
  );
}

const runtimeValidator = read(
  'services/sdkwork-comms-conversation-service/src/runtime/knowledgebase.rs',
);
assert.match(
  runtimeValidator,
  /organization_id == "0"[\s\S]{0,120}return Ok\(\(\)\)/u,
  'runtime must keep treating "0" as a valid tenant-scope organization id',
);

process.stdout.write('knowledgebase organization sentinel standard passed\n');

#!/usr/bin/env node
/**
 * Friend-request pair invariant guard.
 *
 * The old UNIQUE (tenant, organization, requester, target, status) constraint
 * rejected a second request after a decline/cancel/expiry and surfaced as HTTP
 * 503. The invariant is now "one pending request per unordered pair" enforced
 * by a partial unique index, while historical declined/accepted rows may
 * coexist.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, ...relativePath.split('/')), 'utf8');
}

const baseline = read('database/ddl/baseline/postgres/0001_im_baseline.sql');
assert.ok(
  !baseline.includes('uk_im_friend_requests_pair'),
  'baseline must not reintroduce the (requester, target, status) unique constraint',
);
assert.match(
  baseline,
  /CREATE UNIQUE INDEX IF NOT EXISTS uk_im_friend_requests_pending_pair[\s\S]{0,400}WHERE status = 'pending'/u,
  'baseline must enforce one pending request per pair with a partial unique index',
);
assert.match(
  baseline,
  /LEAST\(requester_user_id, target_user_id\)[\s\S]{0,120}GREATEST\(requester_user_id, target_user_id\)/u,
  'the pending unique index must use the canonical unordered pair',
);

const migration = read(
  'database/migrations/postgres/0011_im_friend_requests_pending_pair.up.sql',
);
assert.match(
  migration,
  /DROP CONSTRAINT IF EXISTS uk_im_friend_requests_pair/u,
  'migration must drop the legacy pair constraint',
);
assert.match(
  migration,
  /RAISE EXCEPTION[\s\S]{0,200}duplicate pending pair/u,
  'migration must fail loudly when duplicate pending pairs already exist',
);
assert.match(
  migration,
  /CREATE UNIQUE INDEX IF NOT EXISTS uk_im_friend_requests_pending_pair[\s\S]{0,400}WHERE status = 'pending'/u,
  'migration must create the partial unique index',
);

const store = read('adapters/social-postgres/src/friend_request_store.rs');
assert.ok(
  store.includes('ON CONFLICT (tenant_id, organization_id, request_id) DO NOTHING'),
  'request-id inserts must stay idempotent',
);

process.stdout.write('friend request pair invariant passed\n');

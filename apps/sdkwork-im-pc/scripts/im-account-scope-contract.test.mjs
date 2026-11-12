#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const accountScope = await import(
  pathToFileURL(
    path.resolve(appRoot, 'packages/sdkwork-im-pc-chat/src/services/imAccountScope.ts'),
  ).href
);

const callServiceSource = await readFile(
  path.resolve(appRoot, 'packages/sdkwork-im-pc-chat/src/services/CallService.ts'),
  'utf8',
);
const contactServiceSource = await readFile(
  path.resolve(appRoot, 'packages/sdkwork-im-pc-chat/src/services/ContactService.ts'),
  'utf8',
);

const {
  clearImScopedStorageForScope,
  hasImAccountScopeSwitched,
  imAccountScopeKey,
  isImSessionAuthenticated,
  normalizeImAccountScope,
  readImScopedStorageValue,
  removeImScopedStorageValue,
  resolveImSessionAccountScope,
  resolveImSessionAccountScopeKey,
  resolveImScopedStorageKey,
  writeImScopedStorageValue,
} = accountScope;

const ACTIVE_CALL_KEY = 'sdkwork-im-pc:active-call:v1';

function createMemoryStorage() {
  const records = new Map();
  return {
    getItem(key) {
      return records.has(key) ? records.get(key) : null;
    },
    setItem(key, value) {
      records.set(key, String(value));
    },
    removeItem(key) {
      records.delete(key);
    },
    keys() {
      return Array.from(records.keys());
    },
  };
}

const scopeA = { tenantId: 'tenant-a', userId: 'user-a' };
const scopeB = { tenantId: 'tenant-a', userId: 'user-b' };

test('account scope requires tenant+user and prefers the session context', () => {
  assert.equal(normalizeImAccountScope(null), null);
  assert.equal(normalizeImAccountScope({}), null);
  assert.equal(normalizeImAccountScope({ tenantId: 't' }), null);

  assert.deepEqual(
    normalizeImAccountScope({
      context: { tenantId: 't1', organizationId: '0', userId: 5 },
    }),
    { tenantId: 't1', userId: '5' },
    'the "0" organization sentinel is dropped',
  );
  assert.deepEqual(
    normalizeImAccountScope({ context: { tenantId: 't1' }, user: { id: 'u1' } }),
    { tenantId: 't1', userId: 'u1' },
  );
  assert.deepEqual(
    resolveImSessionAccountScope({ context: { tenantId: 't1', organizationId: 'org-1', userId: 'u1' } }),
    { tenantId: 't1', organizationId: 'org-1', userId: 'u1' },
  );
});

test('account scope identity key includes organization while the storage key stays tenant+user', () => {
  assert.equal(imAccountScopeKey(scopeA), 'tenant-a::user-a');
  assert.equal(
    imAccountScopeKey({ tenantId: 'tenant-a', organizationId: 'org-1', userId: 'user-a' }),
    'tenant-a:org-1:user-a',
  );
  assert.equal(
    resolveImScopedStorageKey(ACTIVE_CALL_KEY, scopeA),
    `${ACTIVE_CALL_KEY}:tenant-a:user-a`,
  );
  assert.equal(resolveImScopedStorageKey(ACTIVE_CALL_KEY, null), null);

  // Same user id in another tenant must not share a key or an identity.
  assert.notEqual(
    resolveImScopedStorageKey(ACTIVE_CALL_KEY, { tenantId: 'tenant-b', userId: 'user-a' }),
    resolveImScopedStorageKey(ACTIVE_CALL_KEY, scopeA),
  );
  assert.equal(
    hasImAccountScopeSwitched(
      imAccountScopeKey({ tenantId: 'tenant-a', userId: '1' }),
      imAccountScopeKey({ tenantId: 'tenant-b', userId: '1' }),
    ),
    true,
    'same userId in a different tenant is an account switch',
  );
});

test('active call storage refuses writes without a scope and never reads the legacy unscoped key', () => {
  const storage = createMemoryStorage();
  storage.setItem(ACTIVE_CALL_KEY, JSON.stringify({ rtcSessionId: 'legacy-call' }));

  assert.equal(writeImScopedStorageValue(storage, ACTIVE_CALL_KEY, null, '{"x":1}'), false);
  assert.equal(readImScopedStorageValue(storage, ACTIVE_CALL_KEY, null), null);
  assert.deepEqual(storage.keys(), [], 'legacy unscoped record is removed, never returned');

  assert.equal(
    writeImScopedStorageValue(storage, ACTIVE_CALL_KEY, scopeA, JSON.stringify({ rtcSessionId: 'call-a' })),
    true,
  );
  assert.deepEqual(storage.keys(), [`${ACTIVE_CALL_KEY}:tenant-a:user-a`]);
  assert.equal(
    JSON.parse(readImScopedStorageValue(storage, ACTIVE_CALL_KEY, scopeA)).rtcSessionId,
    'call-a',
  );

  // Another account cannot see account A's call.
  assert.equal(readImScopedStorageValue(storage, ACTIVE_CALL_KEY, scopeB), null);
});

test('clearing the active call only removes the target account record', () => {
  const storage = createMemoryStorage();
  writeImScopedStorageValue(storage, ACTIVE_CALL_KEY, scopeA, '{"rtcSessionId":"call-a"}');
  writeImScopedStorageValue(storage, ACTIVE_CALL_KEY, scopeB, '{"rtcSessionId":"call-b"}');
  storage.setItem(ACTIVE_CALL_KEY, '{"rtcSessionId":"legacy"}');

  removeImScopedStorageValue(storage, ACTIVE_CALL_KEY, null);
  assert.deepEqual(
    storage.keys().sort(),
    [
      `${ACTIVE_CALL_KEY}:tenant-a:user-a`,
      `${ACTIVE_CALL_KEY}:tenant-a:user-b`,
    ].sort(),
    'only the legacy record is dropped without a scope',
  );

  clearImScopedStorageForScope(storage, [ACTIVE_CALL_KEY], scopeA);
  assert.deepEqual(storage.keys(), [`${ACTIVE_CALL_KEY}:tenant-a:user-b`]);
});

test('a token refresh without identity claims keeps the previous scope (not a switch)', () => {
  const authenticatedWithClaims = {
    accessToken: 'token',
    authToken: 'auth',
    context: { tenantId: 'tenant-a', userId: 'user-a' },
  };
  const refreshedTokensOnly = { accessToken: 'token-2', authToken: 'auth-2' };

  const previousKey = resolveImSessionAccountScopeKey(authenticatedWithClaims);
  assert.equal(previousKey, 'tenant-a::user-a');

  assert.equal(isImSessionAuthenticated(refreshedTokensOnly), true);
  assert.equal(
    resolveImSessionAccountScopeKey(refreshedTokensOnly, previousKey),
    previousKey,
    'a token-only refresh must not look like an account switch',
  );
  assert.equal(
    hasImAccountScopeSwitched(previousKey, resolveImSessionAccountScopeKey(refreshedTokensOnly, previousKey)),
    false,
  );

  assert.equal(resolveImSessionAccountScopeKey(null, previousKey), '');
  assert.equal(hasImAccountScopeSwitched(previousKey, ''), true, 'sign-out is a switch');
});

test('CallService scopes the persisted active call and clears it on session change', () => {
  assert.match(callServiceSource, /readImScopedStorageValue\(/);
  assert.match(callServiceSource, /writeImScopedStorageValue\(/);
  assert.match(callServiceSource, /resolveActiveCallStorageScope\(\)/);
  assert.match(
    callServiceSource,
    /async recoverActiveCall\(\): Promise<RecoverActiveCallResult> \{\s*\/\/[\s\S]*?const scope = this\.resolveActiveCallStorageScope\(\);\s*if \(!scope\) \{/,
    'recovery must fail closed when the account scope is unknown',
  );
  assert.match(callServiceSource, /SDKWORK_IM_SESSION_CHANGED_EVENT, this\.handleAuthSessionChanged/);
  assert.match(callServiceSource, /clearImScopedStorageForScope\(\s*resolveActiveCallStorage\(\),\s*\[ACTIVE_CALL_STORAGE_KEY\],\s*previousScope,?\s*\)/);
  assert.match(callServiceSource, /resetCallStateForAccountSwitch\(\)/);
  assert.match(
    callServiceSource,
    /removeImScopedStorageValue\(resolveActiveCallStorage\(\), ACTIVE_CALL_STORAGE_KEY, null\)/,
    'the legacy unscoped record must be dropped at startup',
  );
});

test('ContactService detects account switches by tenant+organization+user', () => {
  assert.match(contactServiceSource, /lastKnownSessionScopeKey/);
  assert.match(
    contactServiceSource,
    /resolveImSessionAccountScopeKey\(\s*nextSession,\s*this\.lastKnownSessionScopeKey,?\s*\)/,
  );
  assert.match(
    contactServiceSource,
    /hasImAccountScopeSwitched\(this\.lastKnownSessionScopeKey, nextScopeKey\)/,
  );
  assert.equal(
    /lastKnownSessionUserId/.test(contactServiceSource),
    false,
    'the previous userId-only switch detection must be gone',
  );
});

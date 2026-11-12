/**
 * Account scoping helpers for IM PC client storage.
 *
 * Several IM caches (active call, message/conversation snapshots) used to be
 * persisted under a single global key, so a second account on the same
 * browser/Electron profile could read the first account's data (and trigger
 * server-side 401/403 when it was replayed under the new token).
 *
 * Every account-owned key must be `<base>:<tenantId>:<userId>`; helpers here are
 * pure so they can be unit-tested without the SDK runtime.
 */

export interface ImAccountScopeInput {
  accessToken?: unknown;
  authToken?: unknown;
  context?: {
    organizationId?: unknown;
    tenantId?: unknown;
    userId?: unknown;
  } | null;
  user?: {
    id?: unknown;
    userId?: unknown;
  } | null;
  organizationId?: unknown;
  tenantId?: unknown;
  userId?: unknown;
}

export interface ImAccountScope {
  organizationId?: string;
  tenantId: string;
  userId: string;
}

export interface ImAccountScopeStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export const IM_ACCOUNT_SCOPE_SEGMENT_SEPARATOR = ':';

function normalizePart(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return '';
}

export function normalizeImAccountScope(
  input: ImAccountScopeInput | null | undefined,
): ImAccountScope | null {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const tenantId = normalizePart(input.context?.tenantId) || normalizePart(input.tenantId);
  const userId = normalizePart(input.context?.userId)
    || normalizePart(input.userId)
    || normalizePart(input.user?.userId)
    || normalizePart(input.user?.id);
  if (!tenantId || !userId) {
    return null;
  }

  const organizationId = normalizePart(input.context?.organizationId)
    || normalizePart(input.organizationId);

  return {
    tenantId,
    userId,
    // `0` is the platform's "no organization" sentinel.
    ...(organizationId && organizationId !== '0' ? { organizationId } : {}),
  };
}

/**
 * Identity key used for cache-invalidation decisions
 * (`tenantId:organizationId:userId`).
 */
export function imAccountScopeKey(scope: ImAccountScope | null | undefined): string {
  if (!scope) {
    return '';
  }

  return [
    encodeURIComponent(scope.tenantId),
    encodeURIComponent(scope.organizationId ?? ''),
    encodeURIComponent(scope.userId),
  ].join(IM_ACCOUNT_SCOPE_SEGMENT_SEPARATOR);
}

/**
 * Storage-key suffix: `:<tenantId>:<userId>`. The organization is part of the
 * identity key but not of the storage key, so moving between organizations of
 * the same tenant keeps a stable per-user key.
 */
export function imAccountScopedStorageKeySuffix(scope: ImAccountScope): string {
  return `${IM_ACCOUNT_SCOPE_SEGMENT_SEPARATOR}${encodeURIComponent(scope.tenantId)}`
    + `${IM_ACCOUNT_SCOPE_SEGMENT_SEPARATOR}${encodeURIComponent(scope.userId)}`;
}

export function resolveImScopedStorageKey(
  baseKey: string,
  scope: ImAccountScope | null | undefined,
): string | null {
  const normalizedBaseKey = normalizePart(baseKey);
  if (!normalizedBaseKey || !scope) {
    return null;
  }
  return `${normalizedBaseKey}${imAccountScopedStorageKeySuffix(scope)}`;
}

/**
 * Reads an account-owned value. Values persisted under the legacy unscoped key
 * have no owner and are never returned; they are removed instead.
 */
export function readImScopedStorageValue(
  storage: ImAccountScopeStorage | null | undefined,
  baseKey: string,
  scope: ImAccountScope | null | undefined,
): string | null {
  if (!storage) {
    return null;
  }

  try {
    storage.removeItem(baseKey);
  } catch {
    // Cleanup is best effort.
  }

  const storageKey = resolveImScopedStorageKey(baseKey, scope);
  if (!storageKey) {
    return null;
  }

  try {
    return storage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function writeImScopedStorageValue(
  storage: ImAccountScopeStorage | null | undefined,
  baseKey: string,
  scope: ImAccountScope | null | undefined,
  value: string,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(baseKey);
  } catch {
    // Cleanup is best effort.
  }

  const storageKey = resolveImScopedStorageKey(baseKey, scope);
  if (!storageKey) {
    // Signed out / unknown account: refuse to write into a shared key.
    return false;
  }

  try {
    storage.setItem(storageKey, value);
    return true;
  } catch {
    return false;
  }
}

export function removeImScopedStorageValue(
  storage: ImAccountScopeStorage | null | undefined,
  baseKey: string,
  scope: ImAccountScope | null | undefined,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(baseKey);
    const storageKey = resolveImScopedStorageKey(baseKey, scope);
    if (storageKey) {
      storage.removeItem(storageKey);
    }
  } catch {
    // Cleanup is best effort.
  }
}

export function clearImScopedStorageForScope(
  storage: ImAccountScopeStorage | null | undefined,
  baseKeys: readonly string[],
  scope: ImAccountScope | null | undefined,
): void {
  for (const baseKey of baseKeys) {
    removeImScopedStorageValue(storage, baseKey, scope);
  }
}

/**
 * Resolves the account scope from an IM session snapshot (`context` first, then
 * the `user` claims). Returns `null` when the session is not signed in or does
 * not carry a tenant/user identity, which callers must treat as "no
 * persistence" (fail closed).
 */
export function resolveImSessionAccountScope(
  session: ImAccountScopeInput | null | undefined,
): ImAccountScope | null {
  return normalizeImAccountScope(session ?? null);
}

export function isImSessionAuthenticated(
  session: ImAccountScopeInput | null | undefined,
): boolean {
  return Boolean(normalizePart(session?.accessToken) || normalizePart(session?.authToken));
}

/**
 * Account-switch detection input. Returns `''` when the session is signed out,
 * and the previous key when the session is still authenticated but temporarily
 * lacks identity claims (e.g. a token refresh that only carries tokens), so a
 * refresh is never mistaken for an account switch.
 */
export function resolveImSessionAccountScopeKey(
  session: ImAccountScopeInput | null | undefined,
  previousScopeKey: string | null | undefined = '',
): string {
  if (!isImSessionAuthenticated(session)) {
    return '';
  }

  return imAccountScopeKey(resolveImSessionAccountScope(session))
    || (previousScopeKey ?? '');
}

/**
 * True when the account scope changed (including sign-in and sign-out), which
 * invalidates every user-scoped cache.
 */
export function hasImAccountScopeSwitched(
  previousScopeKey: string | null | undefined,
  nextScopeKey: string | null | undefined,
): boolean {
  const previous = previousScopeKey ?? '';
  const next = nextScopeKey ?? '';
  if (!previous || !next) {
    return true;
  }
  return previous !== next;
}

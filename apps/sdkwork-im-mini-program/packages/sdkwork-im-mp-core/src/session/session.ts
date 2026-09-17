/**
 * Session and context store for the IM mini program surface.
 *
 * Authority: `APP_SDK_INTEGRATION_SPEC.md` and
 * `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Logout, refresh failure,
 * tenant switch, and account switch must clear this store together with the
 * token manager, platform storage, sensitive state, and session bridges.
 *
 * The persisted shape mirrors the IAM dual-token session the PC and H5 clients
 * persist: `accessToken` AND `authToken` are both required. A single token is
 * not an authenticated session — the IM gateway rejects the CCP upgrade
 * without both — so `isImMpSessionComplete` is the only correct predicate for
 * "signed in".
 *
 * Persistence is injected. `mp-core` never reads `wx.*` globals; the concrete
 * platform storage adapter is provided by `@sdkwork/im-mp-host` and registered
 * from the root bootstrap. Without an injected adapter the store stays
 * in-memory, which keeps unit tests and non-WeChat hosts honest.
 */

/** Dual-token session shape, aligned with the PC/H5 IAM session contract. */
export interface ImMpSession {
  readonly accessToken: string;
  readonly authToken: string;
  readonly refreshToken?: string;
  readonly expiresAt?: string;
  readonly sessionId?: string;
  readonly tenantId?: string;
  readonly organizationId?: string;
  /** Opaque current-user projection; never used for authorization. */
  readonly user?: Record<string, unknown>;
}

/** Minimal storage contract the session store needs from the host layer. */
export interface ImMpSessionStorage {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

const IM_MP_SESSION_KEY = "sdkwork-im-mp:session:v1";

let currentSession: ImMpSession | null = null;
let injectedStorage: ImMpSessionStorage | null = null;

/**
 * Registers the platform storage adapter used to persist the session.
 *
 * Called once from the root bootstrap after host adapters are registered.
 */
export function configureImMpSessionStorage(storage: ImMpSessionStorage | null): void {
  injectedStorage = storage;
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Normalizes an arbitrary wire payload into a complete dual-token session.
 *
 * Returns `null` when either token is missing: the IAM session-create response
 * envelope is not stable across endpoints (`{data: {...}}` vs bare object vs
 * `{session: {...}}`), so the caller unwraps and this function validates.
 */
export function normalizeImMpSession(value: unknown): ImMpSession | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const accessToken = normalizeOptionalString(record.accessToken);
  const authToken = normalizeOptionalString(record.authToken);
  if (!accessToken || !authToken) {
    return null;
  }
  const refreshToken = normalizeOptionalString(record.refreshToken);
  const expiresAt = normalizeOptionalString(record.expiresAt);
  const sessionId = normalizeOptionalString(record.sessionId);
  const tenantId = normalizeOptionalString(record.tenantId);
  const organizationId = normalizeOptionalString(record.organizationId);
  const user = record.user && typeof record.user === "object" && !Array.isArray(record.user)
    ? (record.user as Record<string, unknown>)
    : undefined;
  return {
    accessToken,
    authToken,
    ...(refreshToken ? { refreshToken } : {}),
    ...(expiresAt ? { expiresAt } : {}),
    ...(sessionId ? { sessionId } : {}),
    ...(tenantId ? { tenantId } : {}),
    ...(organizationId ? { organizationId } : {}),
    ...(user ? { user } : {}),
  };
}

/** True only when both tokens are present. The single "signed in" predicate. */
export function isImMpSessionComplete(
  session: ImMpSession | null | undefined,
): session is ImMpSession {
  return Boolean(
    normalizeOptionalString(session?.accessToken) && normalizeOptionalString(session?.authToken),
  );
}

/**
 * Reads the persisted session.
 *
 * Returns the in-memory session when already resolved; otherwise rehydrates
 * from the injected platform storage. Invalid persisted payloads are dropped
 * rather than surfaced as a half-session.
 */
export function readImMpSession(): ImMpSession | null {
  if (currentSession) {
    return currentSession;
  }
  if (!injectedStorage) {
    return null;
  }
  let raw: string | null = null;
  try {
    raw = injectedStorage.read(IM_MP_SESSION_KEY);
  } catch {
    return null;
  }
  if (!raw) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
  const session = normalizeImMpSession(parsed);
  if (session) {
    currentSession = session;
  }
  return session;
}

export function writeImMpSession(session: ImMpSession | null): void {
  currentSession = session;
  if (!injectedStorage) {
    return;
  }
  try {
    if (!session) {
      injectedStorage.remove(IM_MP_SESSION_KEY);
      return;
    }
    injectedStorage.write(IM_MP_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage failures must not break an authenticated session transition; the
    // in-memory session above is already authoritative for this process.
  }
}

/**
 * Commits a wire session payload, normalizing and rejecting incomplete ones.
 *
 * Throws instead of silently persisting a partial session: a half-session that
 * later fails at the gateway is far harder to diagnose than a failed login.
 */
export function commitImMpSession(value: unknown): ImMpSession {
  const session = normalizeImMpSession(value);
  if (!session) {
    throw new Error("A complete IAM dual-token session is required.");
  }
  writeImMpSession(session);
  return session;
}

/**
 * Clears the session, platform storage, and any cached credentials.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Callers must
 * also reset the IM SDK client through the root bootstrap
 * (`resetImMpSdkClients`).
 */
export function clearImMpSession(): void {
  writeImMpSession(null);
}

export function resolveImMpAccessToken(session: ImMpSession | null | undefined): string | undefined {
  return normalizeOptionalString(session?.accessToken);
}

export function resolveImMpAuthToken(session: ImMpSession | null | undefined): string | undefined {
  return normalizeOptionalString(session?.authToken);
}

/** Exposed for tests that need the persistence key without duplicating it. */
export const IM_MP_SESSION_STORAGE_KEY = IM_MP_SESSION_KEY;

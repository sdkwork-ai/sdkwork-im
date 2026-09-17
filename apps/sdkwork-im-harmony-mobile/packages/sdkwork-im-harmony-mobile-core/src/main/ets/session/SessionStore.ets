/**
 * Session and context store.
 *
 * Authority: `APP_SDK_INTEGRATION_SPEC.md`. Logout, refresh failure, tenant
 * switch, and account switch must clear this store together with the global
 * token-manager equivalent, secure platform storage, and realtime/session
 * bridges (`HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6).
 */

export interface ImHarmonySession {
  readonly accessToken?: string;
  readonly authToken?: string;
  readonly tenantId?: string;
  readonly userId?: string;
}

let currentSession: ImHarmonySession | null = null;

export function readImHarmonySession(): ImHarmonySession | null {
  return currentSession;
}

export function writeImHarmonySession(session: ImHarmonySession | null): void {
  currentSession = session;
}

/**
 * Commits a session read from the IAM exchange.
 *
 * Returns the stored value so a caller can assert what it actually got rather
 * than what it hoped to send.
 */
export function commitImHarmonySession(session: ImHarmonySession): ImHarmonySession {
  currentSession = session;
  return session;
}

export function clearImHarmonySession(): void {
  currentSession = null;
}

export function resolveImHarmonyAccessToken(session: ImHarmonySession | null): string | undefined {
  const value: string | undefined = session?.accessToken;
  const normalized: string = value === undefined ? '' : value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function resolveImHarmonyAuthToken(session: ImHarmonySession | null): string | undefined {
  const value: string | undefined = session?.authToken;
  const normalized: string = value === undefined ? '' : value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * A session is complete only when both tokens are present.
 *
 * The dual-token contract is what makes a cold launch able to refresh: a
 * session with only an access token cannot survive its first expiry.
 */
export function isImHarmonySessionComplete(session: ImHarmonySession | null): boolean {
  return resolveImHarmonyAccessToken(session) !== undefined
    && resolveImHarmonyAuthToken(session) !== undefined;
}

/**
 * Session lifecycle for the IM mini program bootstrap.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and
 * `APP_SDK_INTEGRATION_SPEC.md`. This module is the only place that couples the
 * session store, the shared token manager, and the SDK clients. Any transition
 * that changes who is signed in must go through it, otherwise one of the three
 * keeps the previous user's credentials.
 */

import {
  clearImMpSession,
  isImMpSessionComplete,
  readImMpSession,
  type ImMpSession,
} from "@sdkwork/im-mp-core/session";
import { validateImMpCurrentSession } from "@sdkwork/im-mp-core/sdk";

import { applyImMpSession, clearImMpSdkCredentials, getImMpSdkClients } from "./sdkClients";

export type ImMpSessionRestoreReason =
  | "restored"
  | "no-session"
  | "rejected"
  | "transient"
  | "token-hydrated";

export interface ImMpSessionRestoreResult {
  readonly authenticated: boolean;
  readonly reason: ImMpSessionRestoreReason;
  readonly session: ImMpSession | null;
}

/**
 * Rehydrates the persisted session after a cold launch.
 *
 * Order is load-bearing: the persisted session is applied to the token manager
 * and both clients BEFORE validation, because `auth.sessions.current.retrieve`
 * needs the credentials to answer at all.
 *
 * Only a definitive server rejection clears the session. A transient failure
 * (offline, devtools without a gateway, gateway 5xx) keeps it, because logging
 * a user out whenever a request times out is worse than one failed refresh.
 */
export async function restoreImMpSession(): Promise<ImMpSessionRestoreResult> {
  const session = readImMpSession();
  if (!isImMpSessionComplete(session)) {
    clearImMpSession();
    return { authenticated: false, reason: "no-session", session: null };
  }
  applyImMpSession(session);
  const validation = await validateImMpCurrentSession();
  if (!validation.valid) {
    if (validation.reason === "rejected") {
      clearImMpSession();
      clearImMpSdkCredentials();
      return { authenticated: false, reason: "rejected", session: null };
    }
    return { authenticated: false, reason: "no-session", session: null };
  }
  // Hydrated from storage; `validated` keeps its own reason so callers can tell
  // "restored and re-validated" apart from "restored on an offline launch".
  return {
    authenticated: true,
    reason: validation.reason === "transient" ? "transient" : "restored",
    session,
  };
}

/**
 * Commits a session produced by the login exchange.
 *
 * The exchange already wrote the session store; this applies the credentials to
 * the clients so the very next call in the same tick is authenticated.
 */
export function commitImMpSessionForRuntime(session: ImMpSession): void {
  applyImMpSession(session);
}

/**
 * Clears every credential-bearing surface.
 *
 * A no-op on the SDK side when bootstrap has not run yet, so `app.js` can call
 * it defensively on an unauthenticated launch.
 */
export function clearImMpSessionForRuntime(): void {
  clearImMpSession();
  clearImMpSdkCredentials();
}

/** True when the store holds a complete dual-token session. */
export function isImMpAuthenticated(): boolean {
  return isImMpSessionComplete(readImMpSession());
}

export function readImMpCurrentSession(): ImMpSession | null {
  return readImMpSession();
}

/** Exposed for the login flow, which needs the same token-manager instance. */
export function getImMpTokenManager(): ReturnType<typeof getImMpSdkClients>["tokenManager"] {
  return getImMpSdkClients().tokenManager;
}

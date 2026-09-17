/**
 * IAM runtime wiring for the HarmonyOS root.
 *
 * Authority: `APP_SDK_INTEGRATION_SPEC.md`, `IAM_LOGIN_INTEGRATION_SPEC.md`, and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6.
 *
 * The global token-manager equivalent is shared by the appbase app SDK, every
 * authenticated app-api SDK client, and explicit backend-admin clients. Logout and
 * refresh failure must clear the token manager, the session store, secure platform
 * storage, and realtime bridges.
 *
 * This module delegates to the core package rather than keeping its own flag: a
 * second boolean here would be a second source of truth for "am I signed in", and
 * the two would drift the first time a caller updated only one.
 */
import {
  applyImHarmonySessionPayload,
  isImHarmonyIamAuthenticated,
  markImHarmonyIamAuthenticated,
  clearImHarmonySession,
  readImHarmonySession,
  type ImHarmonySession,
  type ImHarmonySessionExchangeResult,
} from '@sdkwork/sdkwork-im-harmony-mobile-core';
import { resetImHarmonyChatInbox } from '@sdkwork/sdkwork-im-harmony-mobile-chat';

import { getImHarmonySdkClients } from './SdkClients';

export interface ImHarmonyIamRuntime {
  isAuthenticated(): boolean;
  /** Signed-in account id, used to render message direction. */
  currentUserId(): string | undefined;
  applySessionPayload(value: unknown): ImHarmonySessionExchangeResult;
  clearOnLogout(): void;
}

/**
 * Reads whether a usable session is present.
 *
 * Consults the session store, not only the flag: a session can be restored from
 * secure storage before any exchange ran, and reporting "unauthenticated" then
 * would bounce a signed-in user to the session screen on every cold launch.
 */
function hasUsableSession(): boolean {
  const session: ImHarmonySession | null = readImHarmonySession();
  return session !== null || isImHarmonyIamAuthenticated();
}

export function createImHarmonyIamRuntime(): ImHarmonyIamRuntime {
  return {
    isAuthenticated(): boolean {
      return hasUsableSession();
    },

    /** Commits an exchanged session and refreshes both SDK clients in one tick. */
    applySessionPayload(value: unknown): ImHarmonySessionExchangeResult {
      return applyImHarmonySessionPayload(value, (session: ImHarmonySession) => {
        markImHarmonyIamAuthenticated(true);
        // Rebuilding the clients around the fresh credential is what makes the
        // post-login redirect unable to observe an authenticated session store next
        // to an unauthenticated SDK client.
        getImHarmonySdkClients().reinitializeWithAccessToken(session.accessToken);
      });
    },

    clearOnLogout(): void {
      clearImHarmonySession();
      markImHarmonyIamAuthenticated(false);
      getImHarmonySdkClients().reset();
      // The inbox cache holds the previous account's conversations; section 6
      // requires logout to clear sensitive client state, not only tokens.
      resetImHarmonyChatInbox();
    },
  };
}

let iamRuntime: ImHarmonyIamRuntime | null = null;

export function getImHarmonyIamRuntime(): ImHarmonyIamRuntime {
  if (iamRuntime === null) {
    iamRuntime = createImHarmonyIamRuntime();
  }
  return iamRuntime;
}

export function resetImHarmonyIamRuntime(): void {
  iamRuntime = null;
}

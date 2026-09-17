/**
 * Auth runtime for the IM mini program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. This composes
 * the three pieces the login screen needs and nothing else:
 *
 * 1. `wx.login()` for the one-time code (host layer, via `@sdkwork/im-mp-host`);
 * 2. the generated IAM exchange `POST /app/v3/api/oauth/mini_program_sessions`;
 * 3. the session/token propagation in `session.ts`.
 *
 * The runtime is created lazily and cached so a repeated login attempt (a user
 * double-tapping the button) reuses one login-code provider instead of building
 * a second one.
 */

import {
  createWeixinLoginCodeProviderFromGlobal,
  type ImMpLoginCodeProvider,
} from "@sdkwork/im-mp-host";
import {
  exchangeImMpWechatMiniProgramSession,
  logoutImMpSession,
} from "@sdkwork/im-mp-core/sdk";
import type { ImMpSession } from "@sdkwork/im-mp-core/session";

import {
  clearImMpSessionForRuntime,
  commitImMpSessionForRuntime,
  isImMpAuthenticated,
  restoreImMpSession,
  type ImMpSessionRestoreResult,
} from "./session";

export interface ImMpAuthRuntime {
  /** Runs the full WeChat sign-in and returns the committed session. */
  login(): Promise<ImMpSession>;
  /** Revokes the server session, then clears every local credential surface. */
  logout(): Promise<void>;
  /** Cold-launch restore + re-validation. */
  restore(): Promise<ImMpSessionRestoreResult>;
  isAuthenticated(): boolean;
}

let runtime: ImMpAuthRuntime | null = null;

export function createImMpAuthRuntime(
  loginCodeProvider: ImMpLoginCodeProvider = createWeixinLoginCodeProviderFromGlobal(),
): ImMpAuthRuntime {
  let loginInFlight: Promise<ImMpSession> | null = null;

  return {
    async login(): Promise<ImMpSession> {
      // Collapse concurrent attempts: `wx.login` codes are single-use, and two
      // codes racing into the exchange means one of them fails confusingly.
      if (loginInFlight) {
        return loginInFlight;
      }
      loginInFlight = (async () => {
        try {
          const jsCode = await loginCodeProvider.requestLoginCode();
          return await exchangeImMpWechatMiniProgramSession(
            { jsCode },
            commitImMpSessionForRuntime,
          );
        } finally {
          loginInFlight = null;
        }
      })();
      return loginInFlight;
    },

    async logout(): Promise<void> {
      await logoutImMpSession();
      clearImMpSessionForRuntime();
    },

    restore: restoreImMpSession,

    isAuthenticated: isImMpAuthenticated,
  };
}

export function getImMpAuthRuntime(): ImMpAuthRuntime {
  if (!runtime) {
    runtime = createImMpAuthRuntime();
  }
  return runtime;
}

export function resetImMpAuthRuntime(): void {
  runtime = null;
}

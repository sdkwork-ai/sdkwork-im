/**
 * Auth guard for the IM mini program shell.
 *
 * Route guards are shell/runtime responsibilities. Capability packages declare
 * auth mode and permission hints only; they never read session state or call
 * navigation APIs themselves.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. The guard does
 * not perform login: it decides allow/redirect from the session the root
 * bootstrap resolved, so the login flow stays in one place
 * (`src/bootstrap/iamRuntime`).
 */

import type { ImMpRouteAuth } from "../navigation/routeContribution";
import { IM_MP_LOGIN_PAGE_PATH } from "../navigation/shellRoutes";

export type ImMpAuthGateReason =
  | "authenticated"
  | "public-route"
  | "authentication-required";

export interface ImMpAuthGateDecision {
  readonly allowed: boolean;
  readonly reason: ImMpAuthGateReason;
  /** Present only when `allowed` is false. */
  readonly redirectPagePath?: string;
}

/**
 * Evaluates whether the current session may open a route.
 *
 * `isAuthenticated` must already reflect the resolved dual-token session
 * (access token AND auth token). A single token is not an authenticated
 * session: the IM gateway rejects the CCP upgrade without both.
 */
export function evaluateImMpAuthGate(
  auth: ImMpRouteAuth,
  isAuthenticated: boolean,
  loginPagePath: string = IM_MP_LOGIN_PAGE_PATH,
): ImMpAuthGateDecision {
  if (auth === "public") {
    return { allowed: true, reason: "public-route" };
  }
  if (isAuthenticated) {
    return { allowed: true, reason: "authenticated" };
  }
  return {
    allowed: false,
    reason: "authentication-required",
    redirectPagePath: loginPagePath,
  };
}

/**
 * Resolves the launch page path for the current session.
 *
 * Mirrors the guard: an unauthenticated launch opens the login page, an
 * authenticated launch opens the home page. `app.js` uses this instead of
 * hard-coding a path, so the two never drift.
 */
export function resolveImMpLaunchPagePath(
  isAuthenticated: boolean,
  homePagePath: string,
): string {
  return isAuthenticated ? homePagePath : IM_MP_LOGIN_PAGE_PATH;
}

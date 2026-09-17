/**
 * Shell-owned routes for the IM mini program surface.
 *
 * The session/login screen is not a capability screen: it carries no chat or
 * contacts business state, and it must exist before any capability package is
 * reachable. Keeping it in the shell is what lets the auth guard redirect to a
 * page path that always exists, independent of which capability packages a
 * build includes.
 *
 * Route id follows the same `<surface>.<domain>.<capability>.<screen>` shape as
 * capability contributions so the projectors and test suites stay uniform.
 */

import type { ImMpRouteContribution } from "./routeContribution";

/** Page path the auth guard redirects to. Never change without the guard. */
export const IM_MP_LOGIN_PAGE_PATH = "pages/login/index" as const;

/** Page path the auth guard redirects to once a session exists. */
export const IM_MP_HOME_PAGE_PATH = "pages/inbox/index" as const;

export const imMpShellRouteContributions: ImMpRouteContribution[] = [
  {
    id: "app.communication.session.login",
    surface: "app",
    moduleId: "session",
    domain: "communication",
    capability: "session",
    screen: "login",
    titleKey: "common.session.login_title",
    auth: "public",
    layoutGroup: "stack",
    miniProgram: { rootPackage: true, pagePath: IM_MP_LOGIN_PAGE_PATH },
  },
];

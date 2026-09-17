/**
 * Route contributions owned by the shell.
 *
 * The session/login screen belongs to the shell because it must exist before any
 * capability package is reachable. Its route id is root-owned: the H5 client
 * authenticates through the IAM H5 surface and declares no login route, so there
 * is no H5 id to share, and the mini program shell authors the same id
 * separately for its own platform.
 */
import { type ImHarmonyRouteRegistration } from '../navigation/RouteStack';

/** Physical Harmony page path for the session screen. */
export const IM_HARMONY_LOGIN_PAGE_PATH: string = 'pages/session/Login';

export const imHarmonyShellRouteContributions: ImHarmonyRouteRegistration[] = [
  {
    id: 'app.communication.session.login',
    pagePath: IM_HARMONY_LOGIN_PAGE_PATH,
    titleKey: 'common.session.login_title',
    auth: 'public',
    layoutGroup: 'stack',
    harmonyNative: 'page',
  },
];

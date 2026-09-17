/**
 * Route composition for the IM mini program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 5. The route set is
 * assembled from shell-owned routes plus every capability package's
 * contribution, validated once, then projected into the platform's
 * `pages`/`subPackages`/tab-bar shapes.
 *
 * `src/app.json` is generated from this projection by
 * `scripts/build-runtime.mjs`; the checked-in `app.json` is the projection for
 * the default build so the WeChat devtools can open the project without a build
 * step. `tests/mini-program-route-projection.test.mjs` asserts the two agree, so
 * a new route that was added to a package but not to `app.json` fails a gate
 * instead of silently 404-ing on device.
 */

import {
  imMpShellRouteContributions,
  projectImMpAppJson,
  projectImMpTabBar,
  validateImMpRouteContributions,
  type ImMpAppJsonProjection,
  type ImMpRouteContribution,
  type ImMpTabBarEntry,
} from "@sdkwork/im-mp-shell";
import { imMpChatRouteContributions } from "@sdkwork/im-mp-chat/routes";

/** Every route the default IM mini program build ships. */
export function listImMpRouteContributions(): ImMpRouteContribution[] {
  return [...imMpShellRouteContributions, ...imMpChatRouteContributions];
}

/**
 * Validates the composed route set.
 *
 * Returns every issue at once so a build reports all conflicts in one pass;
 * the caller decides whether a warning or a failure is appropriate (bootstrap
 * throws, the build script fails).
 */
export function validateImMpComposedRoutes(
  routes: ImMpRouteContribution[] = listImMpRouteContributions(),
): string[] {
  return validateImMpRouteContributions(routes);
}

export interface ImMpRouteComposition {
  readonly routes: ImMpRouteContribution[];
  readonly appJson: ImMpAppJsonProjection;
  readonly tabBar: ImMpTabBarEntry[];
}

export function composeImMpRoutes(
  resolveTitle?: (titleKey: string) => string,
): ImMpRouteComposition {
  const routes = listImMpRouteContributions();
  const issues = validateImMpComposedRoutes(routes);
  if (issues.length > 0) {
    throw new Error(`IM mini program route composition is invalid: ${issues.join("; ")}`);
  }
  return {
    routes,
    appJson: projectImMpAppJson(routes),
    tabBar: projectImMpTabBar(routes, resolveTitle ? { resolveTitle } : {}),
  };
}

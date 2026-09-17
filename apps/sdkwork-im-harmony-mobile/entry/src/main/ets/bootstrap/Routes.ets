/**
 * Route and page registry assembly.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 8 and
 * `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 7. Route ids follow
 * `<surface>.<domain>.<capability>.<screen>` and stay aligned with the PC, H5,
 * Flutter, and mini program roots; physical Harmony page paths may differ.
 *
 * The bootstrap is the only layer allowed to depend on both the shell and a
 * capability package, so the projection from chat contributions onto the shell's
 * registration shape is consumed here.
 */
import { listImHarmonyModules } from '@sdkwork/sdkwork-im-harmony-mobile-core';
import {
  imHarmonyShellRouteContributions,
  validateImHarmonyRoutes,
  type ImHarmonyRouteRegistration,
} from '@sdkwork/sdkwork-im-harmony-mobile-shell';
import {
  imHarmonyChatRouteContributions,
  toImHarmonyRouteRegistrations,
} from '@sdkwork/sdkwork-im-harmony-mobile-chat';

/**
 * Assembles and validates the route registry.
 *
 * Validation throws instead of returning issues: a duplicate route id or a screen
 * without a page path means a user cannot reach a shipped feature, and a warning
 * during bootstrap is a warning nobody reads.
 */
export function createImHarmonyRoutes(): ImHarmonyRouteRegistration[] {
  const routes: ImHarmonyRouteRegistration[] = imHarmonyShellRouteContributions.concat(
    toImHarmonyRouteRegistrations(imHarmonyChatRouteContributions),
  );
  const issues: string[] = validateImHarmonyRoutes(routes);
  if (issues.length > 0) {
    throw new Error('Harmony route registry is invalid: ' + issues.join('; '));
  }
  assertImHarmonyModuleCoverage(routes);
  return routes;
}

/**
 * Checks every route against the core module registry.
 *
 * Core cannot import a capability package to count its routes (section 5 forbids
 * the cycle), so it declares route-id prefixes instead. That makes this check the
 * thing that keeps the registry honest: without it, a capability could ship routes
 * under a prefix core has never heard of and nothing would notice.
 */
export function assertImHarmonyModuleCoverage(routes: ImHarmonyRouteRegistration[]): void {
  const modules = listImHarmonyModules();
  for (const route of routes) {
    const owned: boolean = modules.some((entry) => route.id.startsWith(entry.routeIdPrefix));
    if (!owned) {
      throw new Error(
        'Harmony route ' + route.id + ' is not owned by any registered module prefix',
      );
    }
  }
}

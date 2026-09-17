/**
 * Page/route stack assembly for the HarmonyOS shell.
 *
 * Route ids follow `<surface>.<domain>.<capability>.<screen>`. Physical Harmony
 * page paths may differ from other platforms while route ids stay aligned
 * (`APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 7).
 *
 * The registration shape below is deliberately owned by the shell and is not
 * imported from a capability package. `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md`
 * section 5 places `shell` above capability packages, so a capability must not
 * import this file; the bootstrap projects capability contributions onto this
 * shape instead.
 */

/** Auth mode a route declares; the shell owns the guard that enforces it. */
export type ImHarmonyRouteAuth = 'public' | 'required';

/** Presentation the Harmony navigator uses for a route. */
export type ImHarmonyRoutePresentation = 'page' | 'tab' | 'dialog' | 'sheet';

export interface ImHarmonyRouteRegistration {
  readonly id: string;
  readonly pagePath: string;
  readonly titleKey: string;
  readonly auth: ImHarmonyRouteAuth;
  readonly layoutGroup: 'main' | 'stack';
  readonly harmonyNative: ImHarmonyRoutePresentation;
  readonly permissionHint?: string;
}

/**
 * Validates a registration set and returns every issue.
 *
 * Returns the offending route ids instead of throwing so the root bootstrap can
 * report all conflicts at once. A non-empty result is a hard failure: a
 * duplicate route id silently shadows a screen, and a duplicate page path makes
 * role-based navigation ambiguous.
 */
export function validateImHarmonyRoutes(
  routes: ImHarmonyRouteRegistration[],
): string[] {
  const issues: string[] = [];
  const seenIds = new Set<string>();
  const seenPagePaths = new Set<string>();
  for (const route of routes) {
    const segments: string[] = route.id.split('.');
    if (segments.length !== 4 || segments.some((segment: string) => segment.trim().length === 0)) {
      issues.push(route.id + ': route id must follow <surface>.<domain>.<capability>.<screen>');
    }
    if (seenIds.has(route.id)) {
      issues.push(route.id + ': duplicate route id');
    }
    seenIds.add(route.id);
    if (route.titleKey.trim().length === 0) {
      issues.push(route.id + ': titleKey is required');
    }
    if (route.pagePath.trim().length === 0) {
      issues.push(route.id + ': pagePath is required');
    }
    if (seenPagePaths.has(route.pagePath)) {
      issues.push(route.id + ': duplicate pagePath ' + route.pagePath);
    }
    seenPagePaths.add(route.pagePath);
  }
  return issues;
}

/**
 * Builds the navigator's page registry.
 *
 * A registration without a page path is dropped rather than rendered as a blank
 * screen; `validateImHarmonyRoutes` is what turns that into a build failure, so
 * the filter here stays a defensive projection.
 */
export function createImHarmonyRouteStack(
  routes: ImHarmonyRouteRegistration[],
): ImHarmonyRouteRegistration[] {
  return routes.filter((route) => route.pagePath.trim().length > 0);
}

export function findImHarmonyRoute(
  routes: ImHarmonyRouteRegistration[],
  routeId: string,
): ImHarmonyRouteRegistration | undefined {
  return routes.find((route) => route.id === routeId);
}

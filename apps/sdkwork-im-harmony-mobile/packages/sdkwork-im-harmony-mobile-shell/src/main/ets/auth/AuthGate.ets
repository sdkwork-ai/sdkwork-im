/**
 * AuthGate integration.
 *
 * Route guards are shell/runtime responsibilities. Capability packages declare
 * auth mode and permission hints only, so the decision function lives here and
 * takes the already-resolved authentication fact as an input.
 */

export interface ImHarmonyAuthGateDecision {
  readonly allowed: boolean;
  readonly reason?: string;
}

/**
 * Decides whether a route may render.
 *
 * `public` routes are always allowed. A `required` route on an unauthenticated
 * session is denied with a stable reason string rather than a boolean, so the
 * navigator can redirect to the session screen instead of showing a bare error.
 */
export function evaluateImHarmonyAuthGate(
  auth: 'public' | 'required',
  isAuthenticated: boolean,
): ImHarmonyAuthGateDecision {
  if (auth === 'public' || isAuthenticated) {
    return { allowed: true };
  }
  return { allowed: false, reason: 'authentication-required' };
}

/**
 * Picks the first route a visitor may see.
 *
 * Used after logout and on a cold launch without a session: sending the user to
 * the session screen is the only correct destination, and falling back to the
 * first declared route would land them on a guarded screen that then has to
 * render an auth error.
 */
export function resolveImHarmonyEntryRouteId(
  routes: Array<{ id: string; auth: 'public' | 'required'; layoutGroup: 'main' | 'stack' }>,
  isAuthenticated: boolean,
): string | undefined {
  if (isAuthenticated) {
    const main: { id: string } | undefined = routes.find((route) => route.layoutGroup === 'main');
    return main?.id ?? routes[0]?.id;
  }
  const publicRoute: { id: string } | undefined = routes.find((route) => route.auth === 'public');
  return publicRoute?.id;
}

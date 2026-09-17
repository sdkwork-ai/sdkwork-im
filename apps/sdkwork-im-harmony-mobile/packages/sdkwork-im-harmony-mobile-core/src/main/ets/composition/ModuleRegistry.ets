/**
 * Module registry.
 *
 * The root bootstrap reads this registry to know which capability modules exist
 * and which route id prefix each one owns.
 *
 * Dependency direction (`HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 5) is
 * `core` to `shell` to capability, never the reverse. This module therefore
 * holds only static descriptors: it must NOT import a capability package to
 * count its routes, because that would create the ohpm cycle section 5 forbids.
 * The bootstrap, which is allowed to depend on both, resolves counts by calling
 * the capability package directly.
 */

export interface ImHarmonyModuleRegistration {
  readonly id: string;
  readonly routeIdPrefix: string;
}

export const imHarmonyModuleRegistrations: ImHarmonyModuleRegistration[] = [
  { id: 'session', routeIdPrefix: 'app.communication.session.' },
  { id: 'chat', routeIdPrefix: 'app.communication.chat.' },
];

export function listImHarmonyModules(): ImHarmonyModuleRegistration[] {
  return imHarmonyModuleRegistrations;
}

export function hasImHarmonyModule(moduleId: string): boolean {
  return imHarmonyModuleRegistrations.some((entry) => entry.id === moduleId);
}

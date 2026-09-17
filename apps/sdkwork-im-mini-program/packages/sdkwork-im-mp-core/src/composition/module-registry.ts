/**
 * Module registry for the IM mini program surface.
 *
 * Authority: `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 5 — `core`
 * packages MUST NOT depend on capability packages. This registry therefore
 * declares module identity and route prefixes as data only; the root
 * bootstrap imports capability route contributions and composes them.
 */
export interface ImMpModuleRegistration {
  readonly id: string;
  readonly routeIdPrefix: string;
}

export function listImMpModules(): readonly ImMpModuleRegistration[] {
  return [
    { id: "chat", routeIdPrefix: "app.communication.chat." },
  ];
}

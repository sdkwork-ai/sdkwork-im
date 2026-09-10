/**
 * Fail-closed signal for admin console capabilities whose backend surface was
 * pruned from the generated IM backend SDK contract (no server implementation
 * exists, so any call would 404 at runtime). UI consumers catch this error and
 * render an explicit unavailable state instead of a fabricated data screen.
 */
export class AdminCapabilityUnavailableError extends Error {
  constructor(capability: string) {
    super(`Admin ${capability} is unavailable: the capability has no implemented backend contract.`);
    this.name = 'AdminCapabilityUnavailableError';
  }
}

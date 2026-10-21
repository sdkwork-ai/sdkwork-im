import type { ProviderBindingItem } from './provider-binding-item';

export interface ProviderBindingSnapshot {
  /** Read status for the provider binding surface. */
  status: string;
  interfaceVersion: string;
  tenantId: string | null;
  effectiveBindings: ProviderBindingItem[];
  precedence: string[];
}

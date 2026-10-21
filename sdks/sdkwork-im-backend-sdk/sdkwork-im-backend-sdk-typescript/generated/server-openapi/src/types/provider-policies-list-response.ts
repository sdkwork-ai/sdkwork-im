import type { ProviderPolicyHistorySnapshot } from './provider-policy-history-snapshot';

export interface ProviderPoliciesListResponse {
  code: 0;
  data: unknown & ProviderPolicyHistorySnapshot;
  /** Server-owned request correlation id. */
  traceId: string;
}

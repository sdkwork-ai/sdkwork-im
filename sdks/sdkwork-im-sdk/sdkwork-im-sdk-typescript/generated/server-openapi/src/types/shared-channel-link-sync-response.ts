import type { MembershipState } from './membership-state';

export interface SharedChannelLinkSyncResponse {
  tenantId: string;
  conversationId: string;
  memberId: string;
  principalId: string;
  principalKind: string;
  role: string;
  state: MembershipState;
  joinedAt: string;
  invitedBy?: string | null;
  removedAt?: string | null;
  attributes?: Record<string, string>;
  proofVersion: string;
  requestKey: string;
  status: 'applied' | 'already_linked' | 'replayed';
}

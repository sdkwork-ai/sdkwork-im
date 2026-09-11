export interface SharedChannelLinkSyncRequest {
  conversationId: string;
  sharedChannelPolicyId: string;
  externalConnectionId: string;
  localActorId: string;
  localActorKind: string;
  externalMemberId: string;
  requestKey?: string | null;
}

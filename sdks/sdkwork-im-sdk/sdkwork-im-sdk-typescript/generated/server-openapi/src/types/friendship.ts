export interface Friendship {
  tenantId: string;
  friendshipId: string;
  initiatorUserId: string;
  userLowId: string;
  userHighId: string;
  status: 'active' | 'removed';
  establishedAt?: string | null;
  updatedAt: string;
}

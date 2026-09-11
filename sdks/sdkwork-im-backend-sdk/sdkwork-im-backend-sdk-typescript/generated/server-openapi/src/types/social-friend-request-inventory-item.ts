/** Friend request inventory entry mirroring the social service FriendRequestHttpView DTO. */
export interface SocialFriendRequestInventoryItem {
  tenantId: string;
  friendRequestId: string;
  requesterUserId: string;
  targetUserId: string;
  status: 'pending' | 'accepted' | 'declined' | 'canceled' | 'expired';
  requestMessage?: string | null;
  expiredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  /** Resolved from the IM user profile store when configured. */
  requesterDisplayName?: string;
  /** Resolved from the IM user profile store when configured. */
  requesterAvatarUrl?: string;
}

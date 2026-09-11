import type { SocialFriendRequestInventoryPageData } from './social-friend-request-inventory-page-data';

export interface SocialFriendRequestsListResponse {
  code: 0;
  data: unknown & SocialFriendRequestInventoryPageData;
  /** Server-owned request correlation id. */
  traceId: string;
}

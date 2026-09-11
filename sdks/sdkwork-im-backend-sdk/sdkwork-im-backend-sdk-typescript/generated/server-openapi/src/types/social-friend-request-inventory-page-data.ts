import type { PageInfo } from './page-info';
import type { SocialFriendRequestInventoryItem } from './social-friend-request-inventory-item';

export interface SocialFriendRequestInventoryPageData {
  items: SocialFriendRequestInventoryItem[];
  pageInfo: PageInfo;
}

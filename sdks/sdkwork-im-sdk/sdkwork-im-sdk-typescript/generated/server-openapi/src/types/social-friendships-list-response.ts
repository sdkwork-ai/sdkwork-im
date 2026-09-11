import type { Friendship } from './friendship';

export interface SocialFriendshipsListResponse {
  code: 0;
  data: unknown & { items: Friendship[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}

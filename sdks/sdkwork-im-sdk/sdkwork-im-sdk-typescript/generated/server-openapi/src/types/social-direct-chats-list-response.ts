import type { SocialDirectChatView } from './social-direct-chat-view';

export interface SocialDirectChatsListResponse {
  code: 0;
  data: unknown & { items: SocialDirectChatView[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}

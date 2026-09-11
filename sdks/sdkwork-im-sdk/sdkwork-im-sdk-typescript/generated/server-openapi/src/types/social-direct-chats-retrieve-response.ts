import type { SocialDirectChatView } from './social-direct-chat-view';

export interface SocialDirectChatsRetrieveResponse {
  code: 0;
  data: unknown & { item: SocialDirectChatView; };
  /** Server-owned request correlation id. */
  traceId: string;
}

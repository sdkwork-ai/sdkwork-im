import type { ConversationBindingView } from './conversation-binding-view';

export interface ConversationsBindingRetrieveResponse {
  code: 0;
  data: unknown & { item: ConversationBindingView; };
  /** Server-owned request correlation id. */
  traceId: string;
}

import type { PageInfo } from './page-info';
import type { TypingIndicatorListItem } from './typing-indicator-list-item';

export interface ConversationsTypingListResponse {
  code: 0;
  data: unknown & { items: TypingIndicatorListItem[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}

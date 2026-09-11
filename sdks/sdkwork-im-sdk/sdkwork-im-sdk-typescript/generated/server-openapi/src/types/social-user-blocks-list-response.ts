import type { SocialUserBlockSummary } from './social-user-block-summary';

export interface SocialUserBlocksListResponse {
  code: 0;
  data: unknown & { items: SocialUserBlockSummary[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}

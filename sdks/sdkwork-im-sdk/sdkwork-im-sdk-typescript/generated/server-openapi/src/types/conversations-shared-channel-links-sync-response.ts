import type { SharedChannelLinkSyncResponse } from './shared-channel-link-sync-response';

export interface ConversationsSharedChannelLinksSyncResponse {
  code: 0;
  data: unknown & { item: SharedChannelLinkSyncResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}

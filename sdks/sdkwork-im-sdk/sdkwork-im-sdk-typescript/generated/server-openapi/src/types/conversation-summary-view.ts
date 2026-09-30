export interface ConversationSummaryView {
  tenantId: string;
  conversationId: string;
  messageCount: number;
  lastMessageSeq: string;
  lastSummary?: string | null;
  lastMessageAt?: string | null;
}

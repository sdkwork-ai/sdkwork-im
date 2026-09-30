import type { MessagePinView } from './message-pin-view';
import type { MessageReactionCountView } from './message-reaction-count-view';

export interface MessageInteractionSummaryView {
  tenantId: string;
  conversationId: string;
  messageId: string;
  messageSeq: string;
  totalReactionCount: number;
  reactionCounts: MessageReactionCountView[];
  pin?: MessagePinView | null;
}

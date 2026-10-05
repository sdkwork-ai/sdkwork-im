import type { SignalTypingResult } from './signal-typing-result';

export interface ConversationsTypingSignalResponse {
  code: 0;
  data: unknown & { item: SignalTypingResult; };
  /** Server-owned request correlation id. */
  traceId: string;
}

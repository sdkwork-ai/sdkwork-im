/**
 * Typing indicator service for the IM mini program.
 *
 * Layering mirrors the typing surface used by PC and H5: composer drafts raise
 * a throttled signal through the generated conversations module, peer
 * `conversation.typing` scope events arrive through the shared realtime lease
 * (see `chatRealtimeService.ts`). Fire-and-forget semantics: a failed signal
 * is one lost data-point, never a chat error.
 */

import type { ImMpChatClientResolver } from "../types/chatTypes";

/** Same per-conversation throttle window the PC and H5 clients use. */
const IM_MP_TYPING_SIGNAL_THROTTLE_MS = 3_000;

export interface ImMpChatTypingService {
  /** Throttled per-conversation typing signal (fire-and-forget). */
  signalTyping(conversationId: string): void;
}

export function createImMpChatTypingService(
  resolveClient: ImMpChatClientResolver,
): ImMpChatTypingService {
  const signalSentAt = new Map<string, number>();

  return {
    signalTyping(conversationId) {
      const normalized = conversationId.trim();
      if (!normalized) {
        return;
      }
      const now = Date.now();
      if (now - (signalSentAt.get(normalized) ?? 0) < IM_MP_TYPING_SIGNAL_THROTTLE_MS) {
        return;
      }
      signalSentAt.set(normalized, now);
      void resolveClient()
        .conversations.signalTyping(normalized)
        .catch(() => undefined);
    },
  };
}

/**
 * Typing indicator service for the IM H5 chat.
 *
 * Layering mirrors the typing service surface used by PC: composer drafts
 * raise a throttled signal through the composed conversations module, peer
 * `conversation.typing` scope events arrive through the shared realtime
 * lease. Fire-and-forget semantics: a failed signal is one lost data-point,
 * never a chat error.
 */
import { subscribeScopeEvents } from "./chatRealtimeService";
import { getChatImSdkClient } from "./chatConversationService";

const TYPING_SIGNAL_THROTTLE_MS = 3_000;

export type PeerTypingHandler = (peerUserId: string) => void;

const signalSentAt = new Map<string, number>();
const peerHandlers = new Map<string, Set<PeerTypingHandler>>();

/** Invoked by the scope subscription; dispatches to per-conversation handlers. */
function dispatchPeerTyping(conversationId: string, peerUserId: string): void {
  const handlers = peerHandlers.get(conversationId);
  if (!handlers) {
    return;
  }
  for (const handler of handlers) {
    try {
      handler(peerUserId);
    } catch {
      // A handler failure must not block the others.
    }
  }
}

/** Throttled per-conversation typing signal (fire-and-forget). */
export function signalChatTyping(conversationId: string): void {
  const now = Date.now();
  const last = signalSentAt.get(conversationId) ?? 0;
  if (now - last < TYPING_SIGNAL_THROTTLE_MS) {
    return;
  }
  signalSentAt.set(conversationId, now);
  void getChatImSdkClient()
    .conversations.signalTyping(conversationId)
    .catch(() => undefined);
}

/** Subscribes peer typing notifications for one conversation. */
export function subscribeChatPeerTyping(
  conversationId: string,
  handler: PeerTypingHandler,
): () => void {
  let handlers = peerHandlers.get(conversationId);
  if (!handlers) {
    handlers = new Set();
    peerHandlers.set(conversationId, handlers);
    subscribeScopeEvents(
      "conversation",
      conversationId,
      (event, context) => {
        const payload = (event ?? {}) as { userId?: unknown };
        const peerUserId =
          typeof payload.userId === "string" && payload.userId.trim()
            ? payload.userId.trim()
            : ((context.payload as { userId?: unknown } | undefined)?.userId as string | undefined) ?? "";
        dispatchPeerTyping(conversationId, peerUserId);
      },
      ["conversation.typing"],
    );
  }
  handlers.add(handler);
  return () => {
    const current = peerHandlers.get(conversationId);
    if (!current) {
      return;
    }
    current.delete(handler);
    if (current.size === 0) {
      peerHandlers.delete(conversationId);
    }
  };
}

import fs from 'node:fs';

const p = 'apps/sdkwork-im-pc/packages/sdkwork-im-pc-chat/src/services/ChatService.ts';
let raw = fs.readFileSync(p, 'utf8');

// 1. interface additions after subscribeMessages declaration.
const ifOld = '  subscribeMessages(chatId: string, handler: MessageHandler): () => void;';
const ifNew = `  subscribeMessages(chatId: string, handler: MessageHandler): () => void;
  /** Throttled per-conversation typing signal (fire-and-forget, live only). */
  signalTyping(chatId: string): void;
  /**
   * Notifies when a peer starts typing in the conversation. The handler
   * receives the peer's user id; the subscription ends on session change.
   */
  onConversationTyping(
    chatId: string,
    handler: (peerUserId: string) => void,
  ): () => void;`;
if (!raw.includes(ifOld)) { console.error('iface missing'); process.exit(1); }
raw = raw.replace(ifOld, ifNew);

// 2. event-type const next to assignments const.
const etOld = "const CONVERSATION_ASSIGNMENT_REALTIME_EVENT_TYPES = [";
const etNew = `const CONVERSATION_TYPING_REALTIME_EVENT_TYPES = ['conversation.typing'] as const;
const TYPING_SIGNAL_THROTTLE_MS = 3_000;
const ${etOld}`;
if (!raw.includes(etOld)) { console.error('et const missing'); process.exit(1); }
raw = raw.replace(etOld, etNew);

// 3. scope subscription paired inside subscribeConversationWire.
const wireOld = `    const unsubscribeAssignments = subscribePcRealtimeScope(
      {
        scopeId: conversationId,
        scopeType: 'conversation',
        eventTypes: CONVERSATION_ASSIGNMENT_REALTIME_EVENT_TYPES,
      },
      (context) => {
        this.handleLiveScopeEvent(context, generation);
      },
    );
    this.conversationWireUnsubs.set(conversationId, () => {
      unsubscribeAssignments();
      unsubscribeMessages();
    });`;
const wireNew = `    const unsubscribeAssignments = subscribePcRealtimeScope(
      {
        scopeId: conversationId,
        scopeType: 'conversation',
        eventTypes: CONVERSATION_ASSIGNMENT_REALTIME_EVENT_TYPES,
      },
      (context) => {
        this.handleLiveScopeEvent(context, generation);
      },
    );
    const unsubscribeTyping = subscribePcRealtimeScope(
      {
        scopeId: conversationId,
        scopeType: 'conversation',
        eventTypes: CONVERSATION_TYPING_REALTIME_EVENT_TYPES,
      },
      (context) => {
        this.handleLiveTypingEvent(conversationId, context, generation);
      },
    );
    this.conversationWireUnsubs.set(conversationId, () => {
      unsubscribeAssignments();
      unsubscribeTyping();
      unsubscribeMessages();
    });`;
if (!raw.includes(wireOld)) { console.error('wire block missing'); process.exit(1); }
raw = raw.replace(wireOld, wireNew);

// 4. methods before queuePersistOfflineMessages.
const mAnchor = '  private queuePersistOfflineMessages(messages: OfflinePersistableMessage[]): void {';
const methods = `  private readonly typingSignalSentAt = new Map<string, number>();
  private readonly typingHandlers = new Map<string, Set<(peerUserId: string) => void>>();

  signalTyping(chatId: string): void {
    const now = Date.now();
    const last = this.typingSignalSentAt.get(chatId) ?? 0;
    if (now - last < TYPING_SIGNAL_THROTTLE_MS) {
      return;
    }
    this.typingSignalSentAt.set(chatId, now);
    const generation = this.authSessionGeneration;
    void this.client()
      .conversations.signalTyping(chatId)
      .catch(() => undefined)
      .finally(() => {
        this.assertAuthSessionGenerationCurrent(generation, 'signaling typing');
      });
  }

  onConversationTyping(
    chatId: string,
    handler: (peerUserId: string) => void,
  ): () => void {
    let handlers = this.typingHandlers.get(chatId);
    if (!handlers) {
      handlers = new Set();
      this.typingHandlers.set(chatId, handlers);
    }
    handlers.add(handler);
    return () => {
      const current = this.typingHandlers.get(chatId);
      if (!current) {
        return;
      }
      current.delete(handler);
      if (current.size === 0) {
        this.typingHandlers.delete(chatId);
      }
    };
  }

  private handleLiveTypingEvent(
    conversationId: string,
    context: ImRealtimeEventContext,
    generation: number,
  ): void {
    if (!this.isAuthSessionGenerationCurrent(generation)) {
      void context.ack().catch(() => undefined);
      return;
    }
    const payload = toRecord(context.payload);
    const peerUserId = pickString(payload.userId, payload.user_id) ?? '';
    const handlers = this.typingHandlers.get(conversationId);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(peerUserId);
        } catch {
          // A handler failure must not block the others.
        }
      }
    }
    void context.ack().catch(() => undefined);
  }

  ${mAnchor}`;
if (!raw.includes(mAnchor)) { console.error('method anchor missing'); process.exit(1); }
raw = raw.replace(mAnchor, methods);

fs.writeFileSync(p, raw);
console.log('ChatService typing wired');

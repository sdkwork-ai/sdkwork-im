/**
 * Conversation (message thread) read/write service.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and
 * `PAGINATION_SPEC.md`. The wire returns message history newest-first with a
 * cursor; the page renders oldest-first. Reversing here (rather than in the
 * template) keeps one ordering rule in one place.
 *
 * Send is text-only on purpose: the mini program has no media upload pipeline
 * wired yet, and inventing one that silently drops attachments would be worse
 * than a narrow, honest surface. Media support belongs to the same
 * `chat-media-upload` boundary the H5 client uses and is a follow-up, not a
 * stub.
 */

import {
  assertImMpCursorPage,
  resolveImMpPageSize,
  toImMpChatConversationSummary,
  toImMpChatMessageItem,
  type ImMpChatClientResolver,
  type ImMpChatConversationSummary,
  type ImMpChatMessageItem,
  type ImMpChatPage,
} from "../types/chatTypes";

export interface ImMpChatMessagePage extends ImMpChatPage<ImMpChatMessageItem> {
  /** int64-as-string per the wire contract; echoed back for read cursors. */
  readonly highWatermark: string;
}

export interface ImMpChatSendTextResult {
  readonly messageId: string;
  /** int64 per the wire contract. */
  readonly messageSeq: number;
  readonly deliveryStatus: "applied" | "replayed";
}

export interface ImMpChatCreateGroupInput {
  readonly groupName: string;
  /** Member user ids; the creator is added by the server. */
  readonly memberUserIds?: string[];
  /**
   * Requests one Knowledgebase provisioning attempt after the group is durably
   * created. Off by default: provisioning is an optional remote side effect,
   * and a failed attempt is reported back through
   * `knowledgebaseInitialization`, not as a create failure.
   */
  readonly initializeKnowledgebase?: boolean;
}

export interface ImMpChatCreateGroupResult {
  readonly conversationId: string;
  readonly eventId: string;
  readonly deliveryStatus?: "applied" | "replayed";
  readonly knowledgebaseInitialization?: "active" | "provisioning" | "failed";
}

export interface ImMpChatConversationService {
  loadSummary(conversationId: string): Promise<ImMpChatConversationSummary>;
  /**
   * Reads one page of message history.
   *
   * `options.cursor` walks backwards (older messages), which is what the
   * conversation page's "load earlier" does. Items are returned oldest-first so
   * the page can append without re-sorting.
   */
  listMessages(
    conversationId: string,
    options?: { cursor?: string; pageSize?: number },
  ): Promise<ImMpChatMessagePage>;
  /** Sends a text message. Rejects an empty body rather than posting whitespace. */
  sendText(conversationId: string, text: string): Promise<ImMpChatSendTextResult>;
  /** Creates a group conversation. Rejects a blank group name. */
  createGroup(input: ImMpChatCreateGroupInput): Promise<ImMpChatCreateGroupResult>;
}

export function createImMpChatConversationService(
  resolveClient: ImMpChatClientResolver,
): ImMpChatConversationService {
  return {
    async loadSummary(conversationId: string): Promise<ImMpChatConversationSummary> {
      requireImMpConversationId(conversationId);
      const summary = await resolveClient().conversations.getSummary(conversationId);
      return toImMpChatConversationSummary(summary);
    },

    async listMessages(conversationId, options = {}): Promise<ImMpChatMessagePage> {
      requireImMpConversationId(conversationId);
      const page = await resolveClient().conversations.listMessages(conversationId, {
        pageSize: resolveImMpPageSize(options.pageSize),
        ...(options.cursor ? { cursor: options.cursor } : {}),
      });
      assertImMpCursorPage(page.pageInfo, "IM message history");
      return {
        items: page.items.map(toImMpChatMessageItem).reverse(),
        hasMore: page.pageInfo.hasMore === true,
        ...(page.pageInfo.nextCursor ? { nextCursor: page.pageInfo.nextCursor } : {}),
        highWatermark: page.highWatermark,
      };
    },

    async sendText(conversationId, text): Promise<ImMpChatSendTextResult> {
      requireImMpConversationId(conversationId);
      const body = text.trim();
      if (!body) {
        throw new Error("A chat message must contain text.");
      }
      const result = await resolveClient().conversations.postText(conversationId, body);
      return {
        messageId: result.messageId,
        messageSeq: result.messageSeq,
        deliveryStatus: result.deliveryStatus,
      };
    },

    async createGroup(input): Promise<ImMpChatCreateGroupResult> {
      const groupName = input.groupName.trim();
      if (!groupName) {
        throw new Error("A group conversation requires a group name.");
      }
      const memberUserIds = (input.memberUserIds ?? [])
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      const created = await resolveClient().conversations.create({
        conversationType: IM_MP_GROUP_CONVERSATION_TYPE,
        groupName,
        ...(memberUserIds.length > 0 ? { memberUserIds } : {}),
        ...(input.initializeKnowledgebase === true ? { initializeKnowledgebase: true } : {}),
      });
      return {
        conversationId: created.conversationId,
        eventId: created.eventId,
        ...(created.deliveryStatus ? { deliveryStatus: created.deliveryStatus } : {}),
        ...(created.knowledgebaseInitialization
          ? { knowledgebaseInitialization: created.knowledgebaseInitialization }
          : {}),
      };
    },
  };
}

/**
 * Group conversation type.
 *
 * Same value the PC and H5 clients send (`sdkwork-im-h5-chat`'s
 * `ChatService`), so a group created from the mini program is identical on
 * every client.
 */
export const IM_MP_GROUP_CONVERSATION_TYPE = "group" as const;

function requireImMpConversationId(conversationId: string): void {
  if (!conversationId.trim()) {
    throw new Error("A conversation id is required.");
  }
}

/**
 * Merges an older page onto the already-rendered thread.
 *
 * Older items are prepended because the page renders oldest-first; incoming
 * items are already reversed by `listMessages`.
 */
export function prependImMpChatMessages(
  existing: ImMpChatMessageItem[],
  older: ImMpChatMessageItem[],
): ImMpChatMessageItem[] {
  const seen = new Set(existing.map((item) => item.messageId));
  const prefix = older.filter((item) => !seen.has(item.messageId));
  return prefix.length > 0 ? [...prefix, ...existing] : existing;
}

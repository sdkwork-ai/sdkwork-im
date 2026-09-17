/**
 * Chat capability view types and SDK binding ports for the IM mini program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Pages render
 * view types, never raw wire types: the wire carries fields no mini program
 * screen uses, and every `*Seq` field is an int64 that must never be used in
 * arithmetic (`API_SPEC.md` §13.6).
 *
 * The port interfaces below are the injection seam. Capability services receive
 * a `() => port` resolver; they never construct an SDK client and never fall
 * back to raw request APIs.
 */

import type {
  ConversationInboxEntry,
  ConversationInboxPage,
  ConversationMessageEntry,
  ConversationMessageListResponse,
  ConversationSummaryView,
  CreateConversationRequest,
  CreateConversationResult,
  PostMessageResult,
  QueryParams,
  SdkWorkListPageInfo,
} from "@sdkwork/im-mp-core/sdk";

/** Projected inbox row rendered by the inbox page. */
export interface ImMpChatInboxItem {
  readonly conversationId: string;
  readonly conversationType: string;
  readonly displayName: string;
  readonly avatarUrl?: string;
  readonly lastSummary?: string;
  readonly lastActivityAt: string;
  readonly unreadCount: number;
  /** int64 per the wire contract; for display and echo only. */
  readonly lastMessageSeq: number;
}

/** Projected message row rendered by the conversation page. */
export interface ImMpChatMessageItem {
  readonly messageId: string;
  readonly senderId: string;
  readonly senderDisplayName?: string;
  readonly text: string;
  readonly occurredAt: string;
  /** int64 per the wire contract. */
  readonly messageSeq: number;
}

/** Projected conversation summary used by the conversation page header. */
export interface ImMpChatConversationSummary {
  readonly conversationId: string;
  readonly messageCount: number;
  /** int64 per the wire contract. */
  readonly lastMessageSeq: number;
  readonly lastSummary?: string;
  readonly lastMessageAt?: string;
}

export interface ImMpChatPage<TItem> {
  readonly items: TItem[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
}

/** Inbox read port. Structurally satisfied by `ImSdkClient`. */
export interface ImMpChatInboxPort {
  conversations: {
    list(params?: QueryParams): Promise<ConversationInboxPage>;
  };
}

/** Conversation read/write port. Structurally satisfied by `ImSdkClient`. */
export interface ImMpChatConversationPort {
  conversations: {
    getSummary(conversationId: string): Promise<ConversationSummaryView>;
    listMessages(
      conversationId: string,
      params?: { cursor?: string; pageSize?: number },
    ): Promise<ConversationMessageListResponse>;
    postText(conversationId: string, text: string): Promise<PostMessageResult>;
    create(body: CreateConversationRequest): Promise<CreateConversationResult>;
  };
}

/** Combined port; the root bootstrap injects one `ImSdkClient` for both. */
export type ImMpChatSdkPort = ImMpChatInboxPort & ImMpChatConversationPort;

/** Resolver injected by the root bootstrap; throws before bootstrap runs. */
export type ImMpChatClientResolver = () => ImMpChatSdkPort;

/**
 * Legacy page size used by every IM client surface.
 *
 * Kept identical to the PC/H5 value so one conversation read returns the same
 * window on every client, clamped by the caller against the shared
 * `IM_MP_MAX_LIST_PAGE_SIZE` contract.
 */
export const IM_MP_CHAT_PAGE_SIZE = 50;

/** Shared maximum page size (`PAGINATION_SPEC.md`). */
export const IM_MP_MAX_LIST_PAGE_SIZE = 100;

/**
 * Asserts the cursor-pagination contract.
 *
 * `PAGINATION_SPEC.md`: an interactive list is cursor-paginated. An offset page
 * silently truncates at high offsets, and `hasMore` without a `nextCursor`
 * makes "load more" spin forever. Both are hard failures — a swallowed one is
 * only ever visible to users.
 */
export function assertImMpCursorPage(
  pageInfo: SdkWorkListPageInfo,
  resource: string,
): void {
  if (pageInfo.mode !== "cursor") {
    throw new Error(`${resource} must use cursor pagination.`);
  }
  if (pageInfo.hasMore && !pageInfo.nextCursor) {
    throw new Error(`${resource} returned hasMore without nextCursor.`);
  }
}

/** Clamps a page-size request against the shared maximum. */
export function resolveImMpPageSize(requested: number = IM_MP_CHAT_PAGE_SIZE): number {
  if (!Number.isFinite(requested) || requested <= 0) {
    return IM_MP_CHAT_PAGE_SIZE;
  }
  return Math.min(Math.trunc(requested), IM_MP_MAX_LIST_PAGE_SIZE);
}

function normalizeString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Projects a wire inbox entry into the row the inbox page renders.
 *
 * `displayName` falls back to the peer then to the conversation id so a row
 * never renders blank — a nameless conversation reads as a rendering bug.
 */
export function toImMpChatInboxItem(entry: ConversationInboxEntry): ImMpChatInboxItem {
  const displayName = normalizeString(entry.displayName)
    ?? normalizeString(entry.peer?.displayName)
    ?? entry.conversationId;
  const avatarUrl = normalizeString(entry.avatarUrl) ?? normalizeString(entry.peer?.avatarUrl);
  const lastSummary = normalizeString(entry.lastSummary);
  return {
    conversationId: entry.conversationId,
    conversationType: entry.conversationType,
    displayName,
    ...(avatarUrl ? { avatarUrl } : {}),
    ...(lastSummary ? { lastSummary } : {}),
    lastActivityAt: entry.lastActivityAt,
    unreadCount: typeof entry.unreadCount === "number" ? entry.unreadCount : 0,
    lastMessageSeq: entry.lastMessageSeq,
  };
}

/**
 * Projects a wire message entry into the row the conversation page renders.
 *
 * The visible text comes from `body.text`, then `body.summary`, then the
 * envelope `summary`: a media-only message still needs a readable line, and a
 * blank bubble looks broken.
 */
export function toImMpChatMessageItem(entry: ConversationMessageEntry): ImMpChatMessageItem {
  const text = normalizeString(entry.body?.text)
    ?? normalizeString(entry.body?.summary)
    ?? normalizeString(entry.summary)
    ?? "";
  const senderDisplayName = normalizeString(entry.sender?.displayName);
  return {
    messageId: entry.messageId,
    senderId: entry.sender?.id ?? "",
    ...(senderDisplayName ? { senderDisplayName } : {}),
    text,
    occurredAt: entry.occurredAt,
    messageSeq: entry.messageSeq,
  };
}

/** Projects the conversation summary read. */
export function toImMpChatConversationSummary(
  summary: ConversationSummaryView,
): ImMpChatConversationSummary {
  const lastSummary = normalizeString(summary.lastSummary);
  const lastMessageAt = normalizeString(summary.lastMessageAt);
  return {
    conversationId: summary.conversationId,
    messageCount: typeof summary.messageCount === "number" ? summary.messageCount : 0,
    lastMessageSeq: summary.lastMessageSeq,
    ...(lastSummary ? { lastSummary } : {}),
    ...(lastMessageAt ? { lastMessageAt } : {}),
  };
}

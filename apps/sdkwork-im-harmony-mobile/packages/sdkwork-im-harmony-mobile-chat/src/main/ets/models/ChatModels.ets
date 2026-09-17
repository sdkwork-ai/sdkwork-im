/**
 * Chat capability view models and SDK binding ports.
 *
 * Authority: `APP_HARMONY_NATIVE_UI_SPEC.md` and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 4. Pages render view models,
 * never raw wire types: the wire carries fields no phone screen uses, and every
 * `*Seq` field is an int64 that must never be used in arithmetic
 * (`API_SPEC.md` section 13.6).
 *
 * The port interfaces below are the injection seam. Capability services receive
 * a resolver; they never construct an SDK client and never fall back to raw
 * request APIs.
 */
import {
  type ImHarmonyPageInfo,
} from './Pagination';

/** Projected inbox row rendered by the inbox page. */
export interface ImHarmonyChatInboxItem {
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
export interface ImHarmonyChatMessageItem {
  readonly messageId: string;
  readonly senderId: string;
  readonly senderDisplayName?: string;
  readonly text: string;
  readonly occurredAt: string;
  /** int64 per the wire contract. */
  readonly messageSeq: number;
  /** True when the sender is the signed-in account. */
  readonly outgoing: boolean;
}

/** Projected conversation summary used by the conversation page header. */
export interface ImHarmonyChatConversationSummary {
  readonly conversationId: string;
  readonly messageCount: number;
  /** int64 per the wire contract. */
  readonly lastMessageSeq: number;
  readonly lastSummary?: string;
  readonly lastMessageAt?: string;
}

export interface ImHarmonyChatPage<TItem> {
  readonly items: TItem[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
}

/** Wire-shaped inbox entry, narrowed to the fields this client reads. */
export interface ImHarmonyInboxEntryPort {
  readonly conversationId: string;
  readonly conversationType: string;
  readonly displayName?: string;
  readonly avatarUrl?: string;
  readonly lastSummary?: string;
  readonly lastActivityAt: string;
  readonly unreadCount?: number;
  readonly lastMessageSeq: number;
  readonly peer?: {
    readonly id: string;
    readonly displayName?: string;
    readonly avatarUrl?: string;
  };
}

export interface ImHarmonyInboxPagePort {
  readonly items: ImHarmonyInboxEntryPort[];
  readonly pageInfo: ImHarmonyPageInfo;
}

export interface ImHarmonyMessageEntryPort {
  readonly messageId: string;
  readonly sender?: { readonly id: string; readonly displayName?: string };
  readonly body?: { readonly text?: string; readonly summary?: string };
  readonly summary?: string;
  readonly occurredAt: string;
  readonly messageSeq: number;
}

export interface ImHarmonyMessageListPort {
  readonly items: ImHarmonyMessageEntryPort[];
  readonly pageInfo: ImHarmonyPageInfo;
}

export interface ImHarmonyConversationSummaryPort {
  readonly conversationId: string;
  readonly messageCount?: number;
  readonly lastMessageSeq: number;
  readonly lastSummary?: string;
  readonly lastMessageAt?: string;
}

export interface ImHarmonyCreateConversationRequest {
  readonly memberIds: string[];
  readonly title?: string;
  readonly conversationType?: string;
}

export interface ImHarmonyCreateConversationResult {
  readonly conversationId: string;
}

export interface ImHarmonyPostMessageResult {
  readonly messageId: string;
  readonly messageSeq: number;
}

/** Inbox read parameters. */
export interface ImHarmonyInboxListParams {
  cursor?: string;
  pageSize?: number;
  q?: string;
}

/** Message read parameters. */
export interface ImHarmonyMessageListParams {
  cursor?: string;
  pageSize?: number;
}

/** Inbox read port. Structurally satisfied by the injected IM SDK client. */
export interface ImHarmonyChatInboxPort {
  listInbox(params: ImHarmonyInboxListParams): Promise<ImHarmonyInboxPagePort>;
}

/** Conversation read/write port. */
export interface ImHarmonyChatConversationPort {
  getSummary(conversationId: string): Promise<ImHarmonyConversationSummaryPort>;
  listMessages(
    conversationId: string,
    params: ImHarmonyMessageListParams,
  ): Promise<ImHarmonyMessageListPort>;
  postText(conversationId: string, text: string): Promise<ImHarmonyPostMessageResult>;
  createConversation(
    body: ImHarmonyCreateConversationRequest,
  ): Promise<ImHarmonyCreateConversationResult>;
}

/** Combined port; the root bootstrap injects one client for both halves. */
export type ImHarmonyChatSdkPort = ImHarmonyChatInboxPort & ImHarmonyChatConversationPort;

/** Resolver injected by the root bootstrap; throws before bootstrap runs. */
export type ImHarmonyChatClientResolver = () => ImHarmonyChatSdkPort;

/** Signed-in account id, injected so message direction can be rendered. */
export type ImHarmonyCurrentUserIdResolver = () => string | undefined;

/**
 * Legacy page size used by every IM client surface.
 *
 * Kept identical to the PC/H5/mini program value so one conversation read
 * returns the same window on every client, clamped against the shared maximum.
 */
export const IM_HARMONY_CHAT_PAGE_SIZE: number = 50;

/** Shared maximum page size (`PAGINATION_SPEC.md`). */
export const IM_HARMONY_MAX_LIST_PAGE_SIZE: number = 100;

/** Clamps a page-size request against the shared maximum. */
export function resolveImHarmonyPageSize(
  requested: number = IM_HARMONY_CHAT_PAGE_SIZE,
): number {
  if (!Number.isFinite(requested) || requested <= 0) {
    return IM_HARMONY_CHAT_PAGE_SIZE;
  }
  return Math.min(Math.trunc(requested), IM_HARMONY_MAX_LIST_PAGE_SIZE);
}

function normalizeString(value: string | undefined): string | undefined {
  const normalized: string = value === undefined ? '' : value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Projects a wire inbox entry into the row the inbox page renders.
 *
 * `displayName` falls back to the peer then to the conversation id so a row never
 * renders blank — a nameless conversation reads as a rendering bug.
 */
export function toImHarmonyChatInboxItem(
  entry: ImHarmonyInboxEntryPort,
): ImHarmonyChatInboxItem {
  const displayName: string = normalizeString(entry.displayName)
    ?? normalizeString(entry.peer?.displayName)
    ?? entry.conversationId;
  const avatarUrl: string | undefined = normalizeString(entry.avatarUrl)
    ?? normalizeString(entry.peer?.avatarUrl);
  const lastSummary: string | undefined = normalizeString(entry.lastSummary);
  const item: ImHarmonyChatInboxItem = {
    conversationId: entry.conversationId,
    conversationType: entry.conversationType,
    displayName,
    avatarUrl,
    lastSummary,
    lastActivityAt: entry.lastActivityAt,
    unreadCount: typeof entry.unreadCount === 'number' ? entry.unreadCount : 0,
    lastMessageSeq: entry.lastMessageSeq,
  };
  return item;
}

/**
 * Projects a wire message entry into the row the conversation page renders.
 *
 * The visible text comes from `body.text`, then `body.summary`, then the envelope
 * `summary`: a media-only message still needs a readable line, and a blank bubble
 * looks broken.
 */
export function toImHarmonyChatMessageItem(
  entry: ImHarmonyMessageEntryPort,
  currentUserId?: string,
): ImHarmonyChatMessageItem {
  const text: string = normalizeString(entry.body?.text)
    ?? normalizeString(entry.body?.summary)
    ?? normalizeString(entry.summary)
    ?? '';
  const senderId: string = entry.sender?.id ?? '';
  const senderDisplayName: string | undefined = normalizeString(entry.sender?.displayName);
  const item: ImHarmonyChatMessageItem = {
    messageId: entry.messageId,
    senderId,
    senderDisplayName,
    text,
    occurredAt: entry.occurredAt,
    messageSeq: entry.messageSeq,
    outgoing: currentUserId !== undefined
      && currentUserId.length > 0
      && senderId === currentUserId,
  };
  return item;
}

/** Projects the conversation summary read. */
export function toImHarmonyChatConversationSummary(
  summary: ImHarmonyConversationSummaryPort,
): ImHarmonyChatConversationSummary {
  const lastSummary: string | undefined = normalizeString(summary.lastSummary);
  const lastMessageAt: string | undefined = normalizeString(summary.lastMessageAt);
  const projected: ImHarmonyChatConversationSummary = {
    conversationId: summary.conversationId,
    messageCount: typeof summary.messageCount === 'number' ? summary.messageCount : 0,
    lastMessageSeq: summary.lastMessageSeq,
    lastSummary,
    lastMessageAt,
  };
  return projected;
}

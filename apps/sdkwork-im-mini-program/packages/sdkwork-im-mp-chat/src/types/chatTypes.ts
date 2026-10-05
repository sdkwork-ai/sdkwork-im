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
  AddConversationMemberRequest,
  ConversationInboxEntry,
  ConversationInboxPage,
  ConversationMessageEntry,
  ConversationMessageListResponse,
  ConversationProfileView,
  ConversationSummaryView,
  CreateConversationRequest,
  CreateConversationResult,
  EditMessageRequest,
  ImConnectOptions,
  ImLiveConnection,
  ImPostMessageRequest,
  ListMembersResponse,
  MessageMutationResult,
  PostMessageResult,
  QueryParams,
  RecallMessageRequest,
  SdkWorkListPageInfo,
  UpdateConversationPreferencesRequest,
  UpdateConversationProfileRequest,
  UpdateReadCursorRequest,
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
  /** int64 wire field; crosses the wire as a decimal string (API_SPEC 13.6). */
  readonly lastMessageSeq: string;
}

/** Projected message row rendered by the conversation page. */
export interface ImMpChatMessageItem {
  readonly messageId: string;
  readonly senderId: string;
  readonly senderDisplayName?: string;
  readonly text: string;
  readonly occurredAt: string;
  /** int64 wire field; crosses the wire as a decimal string (API_SPEC 13.6). */
  readonly messageSeq: string;
  /** Present on image messages: the stable Drive identity for rendering. */
  readonly media?: ImMpChatMessageMedia;
}

/** The Drive-backed image attachment of one message. */
export interface ImMpChatMessageMedia {
  readonly kind: string;
  readonly nodeId: string;
  readonly fileName?: string;
}

/** Projected group member row rendered by the group profile page. */
export interface ImMpChatGroupMember {
  readonly memberId: string;
  readonly userId: string;
  readonly role: string;
}

/** Projected conversation summary used by the conversation page header. */
export interface ImMpChatConversationSummary {
  readonly conversationId: string;
  readonly messageCount: number;
  /** int64 wire field; crosses the wire as a decimal string (API_SPEC 13.6). */
  readonly lastMessageSeq: string;
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
    /** Posts a structured message (media parts for image messages). */
    postMessage(
      conversationId: string,
      body: ImPostMessageRequest,
    ): Promise<PostMessageResult>;
    /** Advances the per-principal read cursor (int64-as-string). */
    updateReadCursor(
      conversationId: string,
      body: UpdateReadCursorRequest,
    ): Promise<unknown>;
    /** Updates conversation preferences (clears the marked-unread flag). */
    updatePreferences(
      conversationId: string,
      body: UpdateConversationPreferencesRequest,
    ): Promise<unknown>;
    /** Reads the group profile (display name, notice, avatar). */
    getProfile(conversationId: string): Promise<ConversationProfileView>;
    /** Renames the group through the conversation profile update. */
    updateProfile(
      conversationId: string,
      body: UpdateConversationProfileRequest,
    ): Promise<unknown>;
    /** Lists one cursor page of conversation members. */
    listMembers(
      conversationId: string,
      params?: { cursor?: string; pageSize?: number },
    ): Promise<ListMembersResponse>;
    /** Adds one member to the conversation. */
    addMember(conversationId: string, body: AddConversationMemberRequest): Promise<unknown>;
    /** Removes one member (owner/admin, enforced server-side). */
    removeMember(conversationId: string, body: { memberId: string }): Promise<unknown>;
    /** Leaves the conversation as the current principal. */
    leave(conversationId: string): Promise<unknown>;
    /**
     * Signals typing on behalf of the authenticated principal. Ephemeral: the
     * marker expires server-side; peers receive a `conversation.typing` push.
     */
    signalTyping(conversationId: string): Promise<unknown>;
    create(body: CreateConversationRequest): Promise<CreateConversationResult>;
  };
  messages: {
    /** Recalls one message (sender or group admin, enforced server-side). */
    recall(messageId: string, body?: RecallMessageRequest): Promise<MessageMutationResult>;
    /** Edits one message's text (sender-only, enforced server-side). */
    edit(messageId: string, body: EditMessageRequest): Promise<MessageMutationResult>;
  };
}

/** Combined port; the root bootstrap injects one `ImSdkClient` for both. */
export type ImMpChatSdkPort = ImMpChatInboxPort &
  ImMpChatConversationPort & {
    /** Opens the CCP realtime connection (wx socket factory injected). */
    connect(options?: ImConnectOptions): Promise<ImLiveConnection>;
  };

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

/**
 * Orders two int64 sequence values carried as decimal strings.
 *
 * `API_SPEC.md` §13.6 forbids converting ids to doubles; length-then-
 * lexicographic comparison is exact for canonical decimal strings and never
 * loses precision.
 */
export function compareImMpSeqStrings(a: string, b: string): number {
  const left = a.trim();
  const right = b.trim();
  if (left.length !== right.length) {
    return left.length - right.length;
  }
  return left < right ? -1 : left > right ? 1 : 0;
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
  const media = resolveImMpMessageImage(entry);
  return {
    messageId: entry.messageId,
    senderId: entry.sender?.id ?? "",
    ...(senderDisplayName ? { senderDisplayName } : {}),
    text,
    occurredAt: entry.occurredAt,
    messageSeq: entry.messageSeq,
    ...(media ? { media } : {}),
  };
}

/**
 * Extracts the first Drive-backed renderable media part of a message.
 *
 * The mini program renders images and videos (`image`/`video` kinds resolve
 * through download grants); other media kinds stay on the text summary line
 * until their playback surfaces ship.
 */
function resolveImMpMessageImage(
  entry: ConversationMessageEntry,
): ImMpChatMessageMedia | undefined {
  const parts = entry.body?.parts;
  if (!Array.isArray(parts)) {
    return undefined;
  }
  for (const part of parts) {
    if (
      part === null || typeof part !== "object"
      || (part as { kind?: unknown }).kind !== "media"
    ) {
      continue;
    }
    const record = part as {
      resource?: { kind?: unknown; fileName?: unknown };
      drive?: { nodeId?: unknown };
    };
    const nodeId =
      typeof record.drive?.nodeId === "string" ? record.drive.nodeId.trim() : "";
    const kind = typeof record.resource?.kind === "string" ? record.resource.kind : "";
    if (!nodeId || (kind !== "image" && kind !== "video")) {
      continue;
    }
    const fileName =
      typeof record.resource?.fileName === "string" && record.resource.fileName
        ? record.resource.fileName
        : undefined;
    return { kind, nodeId, ...(fileName ? { fileName } : {}) };
  }
  return undefined;
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

/**
 * Contacts capability view types and SDK binding ports for the IM mini
 * program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Pages render
 * view types, never raw wire types, and every id field is an int64 that must
 * never be used in arithmetic (`API_SPEC.md` §13.6).
 *
 * The port interface below is the injection seam: the service receives a
 * `() => port` resolver; it never constructs an SDK client and never falls
 * back to raw request APIs.
 */

import type {
  BindDirectChatRequest,
  ContactsResponse,
  FriendRequest,
  QueryParams,
  SocialFriendRequestListResponse,
  SocialUserSearchResponse,
} from "@sdkwork/im-mp-core/sdk";

/** Projected contact row rendered by the contacts page. */
export interface ImMpContactsContactItem {
  readonly userId: string;
  readonly displayName: string;
  readonly avatarUrl?: string;
  readonly relationshipState: string;
  /** Existing direct conversation, when the contact already has one. */
  readonly conversationId?: string;
  readonly directChatId?: string;
}

/** Projected friend request row rendered by the new-friends view. */
export interface ImMpContactsFriendRequestItem {
  readonly friendRequestId: string;
  readonly requesterUserId: string;
  readonly requesterDisplayName?: string;
  readonly requesterAvatarUrl?: string;
  readonly status: string;
  readonly requestMessage?: string;
  readonly createdAt: string;
}

/** Projected user search hit rendered by the add-friend flow. */
export interface ImMpContactsUserSearchItem {
  readonly userId: string;
  readonly displayName: string;
  readonly avatarUrl?: string;
  readonly relationshipState: string;
}

export interface ImMpContactsPageOf<TItem> {
  readonly items: TItem[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
}

/** Contacts read/write port. Structurally satisfied by `ImSdkClient`. */
export interface ImMpContactsSdkPort {
  conversations: {
    bindDirectChat(body: BindDirectChatRequest): Promise<{ conversationId: string }>;
  };
  social: {
    contacts: {
      list(params?: QueryParams): Promise<ContactsResponse>;
    };
    users: {
      list(params?: {
        q?: string;
        pageSize?: number;
        cursor?: string;
      }): Promise<SocialUserSearchResponse>;
    };
    friendRequests: {
      list(params?: QueryParams & { direction?: string; status?: string }): Promise<SocialFriendRequestListResponse>;
      create(body: { targetUserId: string; requestMessage?: string }): Promise<unknown>;
      accept(requestId: string): Promise<unknown>;
      decline(requestId: string): Promise<unknown>;
      cancel(requestId: string): Promise<unknown>;
      pendingCount(): Promise<{ count: number }>;
    };
  };
}

/** Resolver injected by the root bootstrap; throws before bootstrap runs. */
export type ImMpContactsClientResolver = () => ImMpContactsSdkPort;

/** Contacts page size, aligned with the shared chat page cap. */
export const IM_MP_CONTACTS_PAGE_SIZE = 50;

function normalizeString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Projects a wire contact row.
 *
 * `displayName` falls back to the target user id so a row never renders
 * blank — a nameless contact reads as a rendering bug.
 */
export function toImMpContactsContactItem(contact: {
  targetUserId?: unknown;
  displayName?: unknown;
  avatarUrl?: unknown;
  relationshipState?: unknown;
  conversationId?: unknown;
  directChatId?: unknown;
}): ImMpContactsContactItem {
  const userId = normalizeString(contact.targetUserId) ?? "";
  const displayName = normalizeString(contact.displayName) ?? userId;
  const avatarUrl = normalizeString(contact.avatarUrl);
  const conversationId = normalizeString(contact.conversationId);
  const directChatId = normalizeString(contact.directChatId);
  return {
    userId,
    displayName,
    ...(avatarUrl ? { avatarUrl } : {}),
    relationshipState: normalizeString(contact.relationshipState) ?? "",
    ...(conversationId ? { conversationId } : {}),
    ...(directChatId ? { directChatId } : {}),
  };
}

/** Projects a wire friend request row. */
export function toImMpContactsFriendRequestItem(request: FriendRequest): ImMpContactsFriendRequestItem {
  const requesterDisplayName = normalizeString(request.requesterDisplayName)
    ?? normalizeString(request.requesterUserId)
    ?? "";
  const requesterAvatarUrl = normalizeString(request.requesterAvatarUrl);
  const requestMessage = normalizeString(request.requestMessage);
  return {
    friendRequestId: request.friendRequestId,
    requesterUserId: request.requesterUserId,
    requesterDisplayName,
    ...(requesterAvatarUrl ? { requesterAvatarUrl } : {}),
    status: request.status,
    ...(requestMessage ? { requestMessage } : {}),
    createdAt: request.createdAt,
  };
}

/** Projects a wire user search hit. */
export function toImMpContactsUserSearchItem(result: {
  userId?: unknown;
  displayName?: unknown;
  avatarUrl?: unknown;
  relationshipState?: unknown;
}): ImMpContactsUserSearchItem {
  const userId = normalizeString(result.userId) ?? "";
  const displayName = normalizeString(result.displayName) ?? userId;
  const avatarUrl = normalizeString(result.avatarUrl);
  return {
    userId,
    displayName,
    ...(avatarUrl ? { avatarUrl } : {}),
    relationshipState: normalizeString(result.relationshipState) ?? "",
  };
}

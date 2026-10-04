/**
 * Contacts read/write service for the IM mini program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Operations
 * map one-to-one onto the generated `social` surface (contacts, user search,
 * friend requests) plus the direct-chat binding on `conversations`. The mini
 * program renders a narrow contacts surface — list, search, request
 * accept/decline/cancel/submit, and open-direct-chat — without inventing
 * operations the wire does not offer (tag/permission management stays with
 * the PC/H5 clients).
 */

import {
  toImMpContactsContactItem,
  toImMpContactsFriendRequestItem,
  toImMpContactsUserSearchItem,
  IM_MP_CONTACTS_PAGE_SIZE,
  type ImMpContactsClientResolver,
  type ImMpContactsContactItem,
  type ImMpContactsFriendRequestItem,
  type ImMpContactsPageOf,
  type ImMpContactsUserSearchItem,
} from "../types/contactsTypes";

export type { ImMpContactsClientResolver } from "../types/contactsTypes";

export interface ImMpContactsService {
  /** Reads one cursor page of the friend list. */
  listContacts(options?: { cursor?: string }): Promise<ImMpContactsPageOf<ImMpContactsContactItem>>;
  /** Searches users by free text for the add-friend flow. */
  searchUsers(query: string, options?: { cursor?: string }): Promise<ImMpContactsPageOf<ImMpContactsUserSearchItem>>;
  /** Reads the pending inbound friend requests. */
  listPendingFriendRequests(): Promise<ImMpContactsFriendRequestItem[]>;
  /** Reads the pending inbound friend-request count for badges. */
  pendingFriendRequestCount(): Promise<number>;
  /** Submits a friend request to a user found through search. */
  sendFriendRequest(targetUserId: string, requestMessage?: string): Promise<void>;
  acceptFriendRequest(friendRequestId: string): Promise<void>;
  declineFriendRequest(friendRequestId: string): Promise<void>;
  cancelFriendRequest(friendRequestId: string): Promise<void>;
  /** Opens (or re-binds) the direct chat with a contact; returns its id. */
  startDirectChat(currentUserId: string, contact: ImMpContactsContactItem): Promise<string>;
}

/** Actor kind for user principals on the direct-chat binding. */
const IM_MP_USER_ACTOR_KIND = "user";
/** Inbound friend-request direction on the wire. */
const IM_MP_INBOUND_DIRECTION = "inbound";
/** Pending friend-request status filter on the wire. */
const IM_MP_PENDING_STATUS = "pending";

export function createImMpContactsService(
  resolveClient: ImMpContactsClientResolver,
): ImMpContactsService {
  return {
    async listContacts(options = {}): Promise<ImMpContactsPageOf<ImMpContactsContactItem>> {
      const page = await resolveClient().social.contacts.list({
        pageSize: IM_MP_CONTACTS_PAGE_SIZE,
        ...(options.cursor ? { cursor: options.cursor } : {}),
      });
      const pageInfo = page.pageInfo;
      return {
        items: page.items.map(toImMpContactsContactItem),
        hasMore: pageInfo.hasMore === true,
        ...(pageInfo.nextCursor ? { nextCursor: pageInfo.nextCursor } : {}),
      };
    },

    async searchUsers(query, options = {}): Promise<ImMpContactsPageOf<ImMpContactsUserSearchItem>> {
      const body = query.trim();
      if (!body) {
        throw new Error("A search query is required.");
      }
      const page = await resolveClient().social.users.list({
        q: body,
        pageSize: IM_MP_CONTACTS_PAGE_SIZE,
        ...(options.cursor ? { cursor: options.cursor } : {}),
      });
      const pageInfo = page.pageInfo;
      return {
        items: page.items.map(toImMpContactsUserSearchItem),
        hasMore: pageInfo.hasMore === true,
        ...(pageInfo.nextCursor ? { nextCursor: pageInfo.nextCursor } : {}),
      };
    },

    async listPendingFriendRequests(): Promise<ImMpContactsFriendRequestItem[]> {
      const page = await resolveClient().social.friendRequests.list({
        direction: IM_MP_INBOUND_DIRECTION,
        status: IM_MP_PENDING_STATUS,
      });
      return page.items.map(toImMpContactsFriendRequestItem);
    },

    async pendingFriendRequestCount(): Promise<number> {
      const response = await resolveClient().social.friendRequests.pendingCount();
      return typeof response.count === "number" ? response.count : 0;
    },

    async sendFriendRequest(targetUserId, requestMessage): Promise<void> {
      const normalized = targetUserId.trim();
      if (!normalized) {
        throw new Error("A target user id is required.");
      }
      const body = requestMessage?.trim();
      await resolveClient().social.friendRequests.create({
        targetUserId: normalized,
        ...(body ? { requestMessage: body } : {}),
      });
    },

    async acceptFriendRequest(friendRequestId): Promise<void> {
      requireRequestId(friendRequestId);
      await resolveClient().social.friendRequests.accept(friendRequestId.trim());
    },

    async declineFriendRequest(friendRequestId): Promise<void> {
      requireRequestId(friendRequestId);
      await resolveClient().social.friendRequests.decline(friendRequestId.trim());
    },

    async cancelFriendRequest(friendRequestId): Promise<void> {
      requireRequestId(friendRequestId);
      await resolveClient().social.friendRequests.cancel(friendRequestId.trim());
    },

    async startDirectChat(currentUserId: string, contact: ImMpContactsContactItem): Promise<string> {
      const selfId = currentUserId.trim();
      const peerId = contact.userId.trim();
      if (!selfId) {
        throw new Error("The current user id is required.");
      }
      if (!peerId) {
        throw new Error("A contact user id is required.");
      }
      const result = await resolveClient().conversations.bindDirectChat({
        leftActorId: selfId,
        leftActorKind: IM_MP_USER_ACTOR_KIND,
        rightActorId: peerId,
        rightActorKind: IM_MP_USER_ACTOR_KIND,
        ...(contact.conversationId ? { conversationId: contact.conversationId } : {}),
        ...(contact.directChatId ? { directChatId: contact.directChatId } : {}),
      });
      return result.conversationId;
    },
  };
}

function requireRequestId(friendRequestId: string): void {
  if (!friendRequestId.trim()) {
    throw new Error("A friend request id is required.");
  }
}

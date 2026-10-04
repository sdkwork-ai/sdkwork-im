/**
 * Group profile and management service for the IM mini program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Operations map
 * one-to-one onto the generated `chat.conversations` surface (profile
 * retrieve/update, paged members, add/remove member, leave). Role changes and
 * membership permissions are enforced server-side; this surface never sends a
 * role mutation and never invents an operation the wire does not offer.
 */

import type {
  ImMpChatClientResolver,
  ImMpChatGroupMember,
} from "../types/chatTypes";

export interface ImMpChatGroupProfile {
  readonly displayName: string;
  readonly notice: string;
  readonly avatarUrl?: string;
}

export interface ImMpChatGroupMemberPage {
  readonly items: ImMpChatGroupMember[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
}

export interface ImMpChatGroupService {
  loadGroupProfile(conversationId: string): Promise<ImMpChatGroupProfile>;
  loadMembers(
    conversationId: string,
    options?: { cursor?: string },
  ): Promise<ImMpChatGroupMemberPage>;
  renameGroup(conversationId: string, name: string): Promise<void>;
  addMember(conversationId: string, userId: string): Promise<void>;
  removeMember(conversationId: string, memberId: string): Promise<void>;
  leaveGroup(conversationId: string): Promise<void>;
}

/** Member page size, aligned with the shared chat page cap. */
const GROUP_MEMBERS_PAGE_SIZE = 50;

export function createImMpChatGroupService(
  resolveClient: ImMpChatClientResolver,
): ImMpChatGroupService {
  const requireConversationId = (conversationId: string): string => {
    const normalized = conversationId.trim();
    if (!normalized) {
      throw new Error("A conversation id is required.");
    }
    return normalized;
  };

  return {
    async loadGroupProfile(conversationId): Promise<ImMpChatGroupProfile> {
      const profile = await resolveClient().conversations.getProfile(
        requireConversationId(conversationId),
      );
      const avatarUrl =
        typeof profile.avatarUrl === "string" && profile.avatarUrl.trim()
          ? profile.avatarUrl.trim()
          : undefined;
      return {
        displayName: typeof profile.displayName === "string" ? profile.displayName : "",
        notice: typeof profile.notice === "string" ? profile.notice : "",
        ...(avatarUrl ? { avatarUrl } : {}),
      };
    },

    async loadMembers(conversationId, options = {}): Promise<ImMpChatGroupMemberPage> {
      const page = await resolveClient().conversations.listMembers(
        requireConversationId(conversationId),
        {
          pageSize: GROUP_MEMBERS_PAGE_SIZE,
          ...(options.cursor ? { cursor: options.cursor } : {}),
        },
      );
      const items = (page.items ?? []).map((member) => ({
        memberId: member.memberId,
        userId: member.principalId,
        role: member.role,
      }));
      return {
        items,
        hasMore: page.pageInfo.hasMore === true,
        ...(page.pageInfo.nextCursor ? { nextCursor: page.pageInfo.nextCursor } : {}),
      };
    },

    async renameGroup(conversationId, name): Promise<void> {
      const body = name.trim();
      if (!body) {
        throw new Error("A group name is required.");
      }
      await resolveClient().conversations.updateProfile(
        requireConversationId(conversationId),
        { displayName: body },
      );
    },

    async addMember(conversationId, userId): Promise<void> {
      const normalized = userId.trim();
      if (!normalized) {
        throw new Error("A member user id is required.");
      }
      await resolveClient().conversations.addMember(requireConversationId(conversationId), {
        principalId: normalized,
        principalKind: "user",
        role: "member",
      });
    },

    async removeMember(conversationId, memberId): Promise<void> {
      const normalized = memberId.trim();
      if (!normalized) {
        throw new Error("A member id is required.");
      }
      await resolveClient().conversations.removeMember(requireConversationId(conversationId), {
        memberId: normalized,
      });
    },

    async leaveGroup(conversationId): Promise<void> {
      await resolveClient().conversations.leave(requireConversationId(conversationId));
    },
  };
}

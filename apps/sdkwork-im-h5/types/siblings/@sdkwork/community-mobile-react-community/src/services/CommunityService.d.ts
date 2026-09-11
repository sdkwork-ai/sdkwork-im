import type { Community, CommunityGroup, CommunityMember, MembershipTier, Post, PostComment, Resource } from "../types";
/** True when the error indicates the circle member limit was reached. */
export declare function isMemberLimitError(error: unknown): boolean;
/** True when the circle's funding target was reached and purchases are closed. */
export declare function isRevenueTargetError(error: unknown): boolean;
export declare const CommunityService: {
    getMembersByCommunity(communityId: string): Promise<CommunityMember[]>;
    updateMemberRole(communityId: string, memberId: string, role: CommunityMember["role"]): Promise<void>;
    updateMemberStatus(communityId: string, memberId: string, status: CommunityMember["status"]): Promise<void>;
    removeMember(communityId: string, memberId: string): Promise<void>;
    createCommunity(community: Omit<Community, "id" | "memberCount" | "postCount" | "isJoined">): Promise<Community>;
    getCommunities(): Promise<Community[]>;
    getCommunityById(id: string): Promise<Community | undefined>;
    joinCommunity(id: string): Promise<void>;
    /** Leaves a circle: resolves the current membership and removes it. */
    leaveCommunity(communityId: string): Promise<void>;
    /** Deletes a circle; the backend requires the owner role. */
    deleteCommunity(communityId: string): Promise<void>;
    getPostsByCommunity(communityId: string): Promise<Post[]>;
    /**
     * Creates a post. Images are uploaded through the host-injected media
     * runtime (drive-backed) and stored on the backend entry as media URLs;
     * the backend mints the post id.
     */
    createPost(communityId: string, content: string, images?: File[]): Promise<Post>;
    /** Creates a comment and returns the backend-minted comment (id included). */
    addComment(communityId: string, postId: string, text: string): Promise<PostComment>;
    toggleLikePost(communityId: string, postId: string): Promise<void>;
    /** Resources are backend entries of kind "resource" within the circle. */
    getResourcesByCommunity(communityId: string): Promise<Resource[]>;
    getGroupsByCommunity(communityId: string): Promise<CommunityGroup[]>;
    createGroup(communityId: string, group: Omit<CommunityGroup, "id" | "createdAt" | "communityId">): Promise<CommunityGroup>;
    updateGroup(communityId: string, groupId: string, data: Partial<CommunityGroup>): Promise<CommunityGroup>;
    updateCommunity(communityId: string, updates: Partial<Community>): Promise<void>;
    deleteGroup(communityId: string, groupId: string): Promise<void>;
    /** Lists purchasable (enabled) membership tiers of a circle. */
    getMembershipTiers(communityId: string): Promise<MembershipTier[]>;
    /** Owner/admin: lists all tiers including unpublished ones. */
    listAllMembershipTiers(communityId: string): Promise<MembershipTier[]>;
    /** Owner/admin: creates an unpublished membership tier. */
    createMembershipTier(communityId: string, tier: Omit<MembershipTier, "id" | "categoryId" | "enabled">): Promise<MembershipTier>;
    /** Owner/admin: updates a membership tier. */
    updateMembershipTier(communityId: string, tierId: string, tier: Partial<Omit<MembershipTier, "id" | "categoryId" | "enabled">>): Promise<MembershipTier>;
    /** Owner/admin: publishes a tier (registers its catalog package). */
    publishMembershipTier(communityId: string, tierId: string): Promise<MembershipTier>;
    /** Owner/admin: unpublishes a tier. */
    unpublishMembershipTier(communityId: string, tierId: string): Promise<MembershipTier>;
    /** Owner/admin: deletes a membership tier. */
    deleteMembershipTier(communityId: string, tierId: string): Promise<void>;
    /** Activates a paid membership after order payment (order verified server-side). */
    activateMembership(communityId: string, orderId: string, tierId: string, packageId?: string): Promise<CommunityMember>;
};

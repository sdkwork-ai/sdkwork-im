import { Post, Resource, CommunityGroup, Community } from "../../types";
export declare const CommunityTabsContent: ({ activeTab, posts, resources, groups, community, platformNameMap, onLike, onCommentClick, }: {
    activeTab: string;
    posts: Post[];
    resources: Resource[];
    groups: CommunityGroup[];
    community: Community;
    platformNameMap: Record<string, string>;
    onLike: (postId: string) => void;
    onCommentClick: (postId: string) => void;
}) => import("react/jsx-runtime").JSX.Element;

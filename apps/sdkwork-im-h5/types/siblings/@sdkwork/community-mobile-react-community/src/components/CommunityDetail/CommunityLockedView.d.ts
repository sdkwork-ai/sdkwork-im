import { Community } from "../../types";
export declare const CommunityLockedView: ({ community, onJoin, tierCount, }: {
    community: Community;
    onJoin: () => void;
    /** Number of purchasable tiers; >1 means the circle offers multiple prices. */
    tierCount?: number;
}) => import("react/jsx-runtime").JSX.Element;

import React from "react";
import { Community } from "../types";
interface CommunityCardProps {
    community: Community;
    onClick?: () => void;
    onLongPressProps?: any;
    onMoreClick?: (e: React.MouseEvent) => void;
    onJoinClick?: (e: React.MouseEvent) => void;
}
/**
 * Circle list item: circular avatar + circle name, compact metadata row and
 * a join action. No full-width cover image — the avatar always renders (with
 * an initials fallback), so the card can never be dominated by a broken
 * image.
 */
export declare const CommunityCard: React.FC<CommunityCardProps>;
export {};

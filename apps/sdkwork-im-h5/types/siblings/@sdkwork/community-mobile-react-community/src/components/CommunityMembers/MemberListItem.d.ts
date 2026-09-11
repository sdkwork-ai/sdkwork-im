import React from "react";
import { CommunityMember } from "../../types";
interface MemberListItemProps {
    member: CommunityMember;
    isLast: boolean;
    onSelect: (member: CommunityMember) => void;
}
export declare const MemberListItem: React.FC<MemberListItemProps>;
export {};

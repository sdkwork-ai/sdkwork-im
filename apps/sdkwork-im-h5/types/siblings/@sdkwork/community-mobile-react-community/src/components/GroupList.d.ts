import React from "react";
import { CommunityGroup } from "../types";
interface GroupListProps {
    groups: CommunityGroup[];
    communityId: string;
    platformNameMap: Record<string, string>;
}
export declare const GroupList: React.FC<GroupListProps>;
export {};

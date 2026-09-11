import React from "react";
import { CommunityMember } from "../../types";
interface MemberActionSheetsProps {
    selectedMember: CommunityMember | null;
    isActionSheetOpen: boolean;
    isBanDurationSheetOpen: boolean;
    onCloseActionSheet: () => void;
    onCloseBanSheet: () => void;
    onOpenBanSheet: () => void;
    onAction: (action: string) => void;
    onBan: (durationText: string) => void;
}
export declare const MemberActionSheets: React.FC<MemberActionSheetsProps>;
export {};

import type { TFunction } from "i18next";
import React from "react";
export declare const AVAILABLE_TAB_IDS: readonly ["feeds", "resources", "groups", "news", "docs", "repos", "software"];
export declare function resolveAvailableTabs(t: TFunction): {
    id: string;
    name: string;
}[];
export declare const CommunityEditTabs: React.FC;

import React from "react";
interface TierManagementPanelProps {
    communityId: string;
}
/**
 * Circle owner membership-tier management (会员等级管理).
 *
 * Owners create/edit tiers and publish them — publishing registers the
 * purchasable membership package through the backend (sdkwork-order
 * `packageId`) so the tier appears on the purchase surface.
 */
export declare const TierManagementPanel: React.FC<TierManagementPanelProps>;
export {};

import React from "react";
import type { MembershipTier } from "../types";
/** Purchase confirmation payload: which tier, which package (yearly vs
 * lifetime) and which payment method. */
export interface CirclePurchaseConfirm {
    tier: MembershipTier;
    /** order packageId: the yearly (catalogPackageId) or lifetime package. */
    packageId: string;
    paymentMethod: string;
    /** true when the purchase is the lifetime package. */
    isLifetime: boolean;
}
interface PaymentSheetProps {
    communityName: string;
    communityCoverImage: string;
    tiers: MembershipTier[];
    onClose: () => void;
    onConfirm: (confirm: CirclePurchaseConfirm) => void;
}
export declare const PaymentSheet: React.FC<PaymentSheetProps>;
export {};

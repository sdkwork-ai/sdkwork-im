/**
 * Host-injectable circle membership order runtime.
 *
 * Circle membership orders MUST flow through sdkwork-order: the host injects
 * `createMembershipOrder` (backed by the order App SDK
 * `memberships.orders.create`). Payment execution and payment-status polling
 * reuse the official `OrderService` from `@sdkwork/order-mobile-react-orders`
 * (which is configured by the host through `configureOrderMobileRuntime`).
 */
export interface CreateCircleMembershipOrderOptions {
    /** membership_package external id resolved from the tier. */
    packageId: string;
    paymentMethod: string;
    /** Purchase source tag for order attribution. */
    source?: string;
}
export interface CircleMembershipOrder {
    orderId: string;
    orderNo: string;
    amount: string;
    cashierUrl: string;
}
export interface CommunityOrderRuntime {
    createMembershipOrder(options: CreateCircleMembershipOrderOptions): Promise<CircleMembershipOrder>;
}
export declare function configureCommunityOrderRuntime(nextRuntime: CommunityOrderRuntime): void;
export declare function resetCommunityOrderRuntime(): void;
export declare function getCommunityOrderRuntime(): CommunityOrderRuntime;
export declare class CommunityOrderUnavailableError extends Error {
    constructor();
}
/** Payment-status polling helper for the cashier bridge (3s interval). */
export declare const CIRCLE_CASHIER_POLL_INTERVAL_MS = 3000;
export declare function isCircleMembershipOrderPaid(orderId: string): Promise<boolean>;

import React from "react";
interface CircleCashierBridgeProps {
    orderDetailPath?: string;
    orderCenterPath?: string;
}
/**
 * Circle membership cashier bridge.
 *
 * Renders the official order cashier (`CashierPage` from
 * sdkwork-order-mobile-react-orders) while the bridge polls the order payment
 * status. Once paid, the circle membership is activated through the community
 * App SDK (server-side order verification) and the payer is automatically
 * redirected back to the circle detail page.
 */
export declare const CircleCashierBridge: React.FC<CircleCashierBridgeProps>;
export {};

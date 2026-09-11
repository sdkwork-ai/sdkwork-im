import type { ApiRequestOptions, HttpClient } from '../http/client';
import type { RefundRequestCreateCommand, SdkWorkPageData } from '../types';
export interface OrdersRefundRequestsListParams {
    status?: string;
    page?: number;
    pageSize?: number;
}
export interface OrdersRefundRequestsCreateParams {
    idempotencyKey: string;
}
export declare class OrdersRefundRequestsApi {
    private client;
    constructor(client: HttpClient);
    /** Order refund requests list. */
    list(params?: OrdersRefundRequestsListParams, requestOptions?: ApiRequestOptions): Promise<SdkWorkPageData>;
    /** Order refund requests create. */
    create(body: RefundRequestCreateCommand, params: OrdersRefundRequestsCreateParams, requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>>;
    /** Order refund requests retrieve. */
    retrieve(refundRequestId: string, requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>>;
}
export declare class OrdersApi {
    readonly refundRequests: OrdersRefundRequestsApi;
    constructor(client: HttpClient);
}
export declare function createOrdersApi(client: HttpClient): OrdersApi;

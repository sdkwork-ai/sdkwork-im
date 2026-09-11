import type { ApiRequestOptions, HttpClient } from '../http/client';
import type { CommerceOperationCommand, RechargeOrderCreateCommand, SdkWorkCommandData, SdkWorkPageData } from '../types';
export interface RechargesPlansListParams {
    status?: string;
    page?: number;
    pageSize?: number;
}
export declare class RechargesPlansApi {
    private client;
    constructor(client: HttpClient);
    /** Token Bank plans list. */
    list(params?: RechargesPlansListParams, requestOptions?: ApiRequestOptions): Promise<SdkWorkPageData>;
}
export interface RechargesOrdersListParams {
    subject?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}
export interface RechargesOrdersCreateParams {
    idempotencyKey: string;
}
export interface RechargesOrdersCancelParams {
    idempotencyKey: string;
}
export declare class RechargesOrdersApi {
    private client;
    constructor(client: HttpClient);
    /** Recharges orders list. */
    list(params?: RechargesOrdersListParams, requestOptions?: ApiRequestOptions): Promise<SdkWorkPageData>;
    /** Recharges orders create. */
    create(body: RechargeOrderCreateCommand, params: RechargesOrdersCreateParams, requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>>;
    /** Recharges orders retrieve. */
    retrieve(orderId: string, requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>>;
    /** Recharges orders cancel. */
    cancel(orderId: string, params: RechargesOrdersCancelParams, body?: CommerceOperationCommand, requestOptions?: ApiRequestOptions): Promise<SdkWorkCommandData>;
}
export declare class RechargesSettingsApi {
    private client;
    constructor(client: HttpClient);
    /** Recharges settings retrieve. */
    retrieve(requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>>;
}
export interface RechargesPackagesListParams {
    page?: number;
    pageSize?: number;
}
export declare class RechargesPackagesApi {
    private client;
    constructor(client: HttpClient);
    /** Recharges packages list. */
    list(params?: RechargesPackagesListParams, requestOptions?: ApiRequestOptions): Promise<SdkWorkPageData>;
}
export declare class RechargesApi {
    readonly packages: RechargesPackagesApi;
    readonly settings: RechargesSettingsApi;
    readonly orders: RechargesOrdersApi;
    readonly plans: RechargesPlansApi;
    constructor(client: HttpClient);
}
export declare function createRechargesApi(client: HttpClient): RechargesApi;

import type { ApiRequestOptions, HttpClient } from '../http/client';
import type { WithdrawalRequestCreateCommand } from '../types';
export interface WithdrawalsRequestsCreateParams {
    idempotencyKey: string;
}
export declare class WithdrawalsRequestsApi {
    private client;
    constructor(client: HttpClient);
    /** Withdrawal requests create. */
    create(body: WithdrawalRequestCreateCommand, params: WithdrawalsRequestsCreateParams, requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>>;
    /** Withdrawal requests retrieve. */
    retrieve(withdrawalRequestId: string, requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>>;
}
export declare class WithdrawalsApi {
    readonly requests: WithdrawalsRequestsApi;
    constructor(client: HttpClient);
}
export declare function createWithdrawalsApi(client: HttpClient): WithdrawalsApi;

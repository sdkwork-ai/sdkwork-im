import { type SdkworkFeedsOpenClient, type SdkworkCustomConfig } from "@sdkwork/feeds-sdk";
/**
 * Standard feeds stream open-surface client.
 *
 * Feed streams are categorized by `feed_type` and isolated by `stream_id`
 * (news, community circles, moments/朋友圈, inspiration assets never
 * interfere with each other). Product surfaces read curated streams through
 * this client: operations are `skipAuth`, so content stays browsable without
 * login and without session tokens.
 */
export type SdkworkFeedsClient = SdkworkFeedsOpenClient;
export declare function configureFeedsOpenSdkClientProvider(provider: () => SdkworkFeedsClient): void;
export declare function resolveFeedsOpenSdkBaseUrl(): string;
export declare function createFeedsOpenSdkClientConfig(): SdkworkCustomConfig;
export declare function initFeedsOpenSdkClient(config?: SdkworkCustomConfig): SdkworkFeedsClient;
export declare function getFeedsOpenSdkClient(): SdkworkFeedsClient;
export declare function resetFeedsOpenSdkClient(): void;
export type { FeedItem, FeedStream, SdkWorkPageData } from "@sdkwork/feeds-sdk";

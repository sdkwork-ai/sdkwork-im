import type { SdkworkCommunityAppSdkPort } from "@sdkwork/community-sdk-ports";
import type { SdkworkFeedsClient } from "@sdkwork/feeds-sdk";
export declare function configureCommunityRuntimePort(port: SdkworkCommunityAppSdkPort): void;
export declare function resetCommunityRuntimePort(): void;
export declare function getCommunityRuntimePort(): SdkworkCommunityAppSdkPort;
/**
 * Binds the standard feeds stream client (open surface, anonymous reads).
 * Circle post/resource feeds are read through the standard feeds stream
 * system (`community-{circleId}` / `community-{circleId}-resources` streams);
 * content write operations keep the community App SDK port above.
 */
export declare function configureCommunityFeedsPort(port: SdkworkFeedsClient): void;
export declare function resetCommunityFeedsPort(): void;
export declare function isCommunityFeedsPortConfigured(): boolean;
export declare function getCommunityFeedsPort(): SdkworkFeedsClient;

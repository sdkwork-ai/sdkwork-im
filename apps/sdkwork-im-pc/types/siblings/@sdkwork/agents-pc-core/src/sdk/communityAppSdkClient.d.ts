import { type SdkworkAppClient as GeneratedCommunityAppClient, type SdkworkAppConfig } from "@sdkwork/community-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkCommunityAppClient = GeneratedCommunityAppClient;
export type SdkworkCommunityAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureCommunityAppSdkClientProvider(provider: () => SdkworkCommunityAppClient): void;
export declare function resolveCommunityAppSdkBaseUrl(): string;
export declare function isCommunityAppSdkConfigured(): boolean;
export declare function createCommunityAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkCommunityAppClientConfig;
export declare function initCommunityAppSdkClient(config?: SdkworkCommunityAppClientConfig): SdkworkCommunityAppClient;
export declare function getCommunityAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkCommunityAppClient;
export declare function getCommunityAppSdkClient(): SdkworkCommunityAppClient;
export declare function resetCommunityAppSdkClient(): void;
export type { CommunityEntry, SdkWorkPageData } from "@sdkwork/community-app-sdk";

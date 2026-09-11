import { type SdkworkAppClient as GeneratedAssetsAppClient, type SdkworkAppConfig } from "@sdkwork/assets-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type { AssetItem, MediaResource } from "@sdkwork/assets-app-sdk";
export type SdkworkAgentsAssetsAppClient = GeneratedAssetsAppClient;
export type SdkworkAgentsAssetsAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureAssetsAppSdkClientProvider(provider: () => SdkworkAgentsAssetsAppClient): void;
export declare function resolveAssetsAppSdkBaseUrl(): string;
export declare function createAssetsAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkAgentsAssetsAppClientConfig;
export declare function initAssetsAppSdkClient(config?: SdkworkAgentsAssetsAppClientConfig): SdkworkAgentsAssetsAppClient;
export declare function getAssetsAppSdkClient(): SdkworkAgentsAssetsAppClient;
export declare function getAssetsAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkAgentsAssetsAppClient;
export declare function resetAssetsAppSdkClient(): void;

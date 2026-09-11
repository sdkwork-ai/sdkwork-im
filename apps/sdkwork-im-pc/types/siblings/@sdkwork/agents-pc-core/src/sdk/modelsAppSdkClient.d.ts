import { type SdkworkAppClient as GeneratedModelsAppClient, type SdkworkAppConfig } from "@sdkwork/models-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkModelsAppClient = GeneratedModelsAppClient;
export type SdkworkModelsAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureModelsAppSdkClientProvider(provider: () => SdkworkModelsAppClient): void;
export declare function resolveModelsAppSdkBaseUrl(): string;
export declare function isModelsAppSdkConfigured(): boolean;
export declare function createModelsAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkModelsAppClientConfig;
export declare function initModelsAppSdkClient(config?: SdkworkModelsAppClientConfig): SdkworkModelsAppClient;
export declare function getModelsAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkModelsAppClient;
export declare function getModelsAppSdkClient(): SdkworkModelsAppClient;
export declare function resetModelsAppSdkClient(): void;
export type { AiModelsListParams, AppModelCatalogGroup, AppModelCatalogItem, AppModelCatalogPage, } from "@sdkwork/models-app-sdk";

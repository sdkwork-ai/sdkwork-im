import { type SdkworkKnowledgebaseAppClient as GeneratedKnowledgebaseAppClient, type SdkworkAppConfig } from "@sdkwork/knowledgebase-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkKnowledgebaseAppClient = GeneratedKnowledgebaseAppClient;
export type SdkworkKnowledgebaseAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function resolveKnowledgebaseAppSdkBaseUrl(): string;
export declare function isKnowledgebaseAppSdkConfigured(): boolean;
export declare function createKnowledgebaseAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkKnowledgebaseAppClientConfig;
export declare function initKnowledgebaseAppSdkClient(config?: SdkworkKnowledgebaseAppClientConfig): SdkworkKnowledgebaseAppClient;
export declare function getKnowledgebaseAppSdkClient(): SdkworkKnowledgebaseAppClient;
export declare function resetKnowledgebaseAppSdkClient(): void;
export type { KnowledgeMarketCatalogItem } from "@sdkwork/knowledgebase-app-sdk";

import { type SdkworkAppClient as GeneratedGenerationsAppClient, type SdkworkAppConfig } from "@sdkwork/generations-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkGenerationsAppClient = GeneratedGenerationsAppClient;
export type SdkworkGenerationsAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureGenerationsAppSdkClientProvider(provider: () => SdkworkGenerationsAppClient): void;
export declare function resolveGenerationsAppSdkBaseUrl(): string;
export declare function isGenerationsAppSdkConfigured(): boolean;
export declare function createGenerationsAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkGenerationsAppClientConfig;
export declare function initGenerationsAppSdkClient(config?: SdkworkGenerationsAppClientConfig): SdkworkGenerationsAppClient;
export declare function getGenerationsAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkGenerationsAppClient;
export declare function getGenerationsAppSdkClient(): SdkworkGenerationsAppClient;
export declare function resetGenerationsAppSdkClient(): void;
export type { CreateGenerationCommandRequest, GenerationCommandResponse, GenerationModality, GenerationRecord, GenerationRecordPage, GenerationResult, GenerationResultPage, GenerationStatus, } from "@sdkwork/generations-app-sdk";

import { type SdkworkAppClient as SdkworkMemoryAppClient, type SdkworkAppConfig } from "@sdkwork/memory-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkAgentsMemoryAppClient = SdkworkMemoryAppClient;
export type SdkworkAgentsMemoryAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureMemoryAppSdkClientProvider(provider: () => SdkworkAgentsMemoryAppClient): void;
export declare function resolveMemoryAppSdkBaseUrl(): string;
export declare function createMemoryAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkAgentsMemoryAppClientConfig;
export declare function initMemoryAppSdkClient(config?: SdkworkAgentsMemoryAppClientConfig): SdkworkAgentsMemoryAppClient;
export declare function getMemoryAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkAgentsMemoryAppClient;
export declare function resetMemoryAppSdkClient(): void;
export type { MemorySpace, MemorySpaceList } from "@sdkwork/memory-app-sdk";

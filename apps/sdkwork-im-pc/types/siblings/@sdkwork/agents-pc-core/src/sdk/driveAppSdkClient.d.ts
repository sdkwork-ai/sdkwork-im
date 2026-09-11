import { type SdkworkDriveAppClient } from "@sdkwork/drive-app-sdk";
import type { SdkworkAppConfig } from "@sdkwork/drive-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
export type { MediaResource } from "@sdkwork/assets-app-sdk";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkAgentsDriveAppClient = SdkworkDriveAppClient;
export type SdkworkAgentsDriveAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureDriveAppSdkClientProvider(provider: () => SdkworkAgentsDriveAppClient): void;
export declare function resolveDriveAppSdkBaseUrl(): string;
export declare function createDriveAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkAgentsDriveAppClientConfig;
export declare function initDriveAppSdkClient(config?: SdkworkAgentsDriveAppClientConfig): SdkworkAgentsDriveAppClient;
export declare function getDriveAppSdkClient(): SdkworkAgentsDriveAppClient;
export declare function getDriveAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkAgentsDriveAppClient;
export declare function resetDriveAppSdkClient(): void;

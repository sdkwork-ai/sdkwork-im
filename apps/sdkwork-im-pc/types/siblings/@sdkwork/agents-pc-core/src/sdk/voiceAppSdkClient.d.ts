import { type SdkworkAppClient as GeneratedVoiceAppClient, type SdkworkAppConfig } from "@sdkwork/voice-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkVoiceAppClient = GeneratedVoiceAppClient;
export type SdkworkVoiceAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function resolveVoiceAppSdkBaseUrl(): string;
export declare function isVoiceAppSdkConfigured(): boolean;
export declare function createVoiceAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkVoiceAppClientConfig;
export declare function initVoiceAppSdkClient(config?: SdkworkVoiceAppClientConfig): SdkworkVoiceAppClient;
export declare function getVoiceAppSdkClient(): SdkworkVoiceAppClient;
export declare function resetVoiceAppSdkClient(): void;

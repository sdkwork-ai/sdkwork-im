import { type SdkworkAppClient as GeneratedSkillsAppClient, type SdkworkAppConfig } from "@sdkwork/skills-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkSkillsAppClient = GeneratedSkillsAppClient;
export type SdkworkSkillsAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureSkillsAppSdkClientProvider(provider: () => SdkworkSkillsAppClient): void;
export declare function resolveSkillsAppSdkBaseUrl(): string;
export declare function isSkillsAppSdkConfigured(): boolean;
export declare function createSkillsAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkSkillsAppClientConfig;
export declare function initSkillsAppSdkClient(config?: SdkworkSkillsAppClientConfig): SdkworkSkillsAppClient;
export declare function getSkillsAppSdkClient(): SdkworkSkillsAppClient;
export declare function resetSkillsAppSdkClient(): void;
export type { SkillPackageRecord, SkillRecord } from "@sdkwork/skills-app-sdk";

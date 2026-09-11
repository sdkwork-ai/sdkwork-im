import { type SdkworkAppClient as SdkworkPromptsAppClient, type SdkworkAppConfig } from "@sdkwork/prompts-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkAgentsPromptsAppClient = SdkworkPromptsAppClient;
export type SdkworkAgentsPromptsAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configurePromptsAppSdkClientProvider(provider: () => SdkworkAgentsPromptsAppClient): void;
export declare function resolvePromptsAppSdkBaseUrl(): string;
export declare function createPromptsAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkAgentsPromptsAppClientConfig;
export declare function initPromptsAppSdkClient(config?: SdkworkAgentsPromptsAppClientConfig): SdkworkAgentsPromptsAppClient;
export declare function getPromptsAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkAgentsPromptsAppClient;
export declare function resetPromptsAppSdkClient(): void;
export type { PromptTemplate, PromptTemplatePage, PromptTemplateVersion, PromptTemplateVersionPage, } from "@sdkwork/prompts-app-sdk";

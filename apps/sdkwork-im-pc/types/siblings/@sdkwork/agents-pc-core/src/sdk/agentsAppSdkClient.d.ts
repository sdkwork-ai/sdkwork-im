import { completeAgentTurn, completeAgentTurnStream, TURN_EVENT_PROTOCOL_KERNEL_V1, type CompleteAgentTurnResult, type SdkworkAppClient as GeneratedSdkworkAgentsAppClient, type SdkworkAppConfig, type TurnRichToolEvent, type TurnStreamHandlers } from "@sdkwork/agents-app-sdk";
import type { Interceptors } from "@sdkwork/sdk-common";
import { type SdkworkChatSession } from "../session/session";
export type SdkworkAgentsAppClient = GeneratedSdkworkAgentsAppClient;
export type SdkworkAgentsAppClientConfig = SdkworkAppConfig & {
    interceptors?: Interceptors;
};
export declare function configureAgentsAppSdkClientProvider(provider: () => SdkworkAgentsAppClient): void;
export declare function resolveAgentsAppSdkBaseUrl(): string;
export declare function createAgentsAppSdkClientConfig(session?: SdkworkChatSession | null): SdkworkAgentsAppClientConfig;
export declare function initAgentsAppSdkClient(config?: SdkworkAgentsAppClientConfig): SdkworkAgentsAppClient;
export declare function getAgentsAppSdkClient(): SdkworkAgentsAppClient;
export declare function getAgentsAppSdkClientWithSession(session?: SdkworkChatSession | null): SdkworkAgentsAppClient;
export declare function resetAgentsAppSdkClient(): void;
export declare function useAgentsAppSdkClient(): SdkworkAgentsAppClient;
export type { AgentCompositionSlotRecord, AgentImplementationKind, AgentItemFeedbackRecord, AgentManagementProfile, AgentProjectCompositionSlotRecord, AgentProjectRecord, AgentProviderBindingRecord, AgentRecord, AgentResourceUserStateRecord, AgentRuntimeExecutionRecord, AgentSessionItemRecord, AgentSessionRecord, AgentSessionRuntimeBindingRecord, AgentSessionRuntimeBindingStatus, AgentEngineCatalog, AgentEngineCatalogEngine, AgentEngineModelCatalogEntry, CreateAgentProviderBindingRequest, CreateAgentRequest, CreateAgentSessionRuntimeBindingRequest, CreateAgentTurnRequest, McpServerMarketplaceRecord, PageInfo, UpdateAgentRequest, UpdateAgentSessionRuntimeBindingRequest, } from "@sdkwork/agents-app-sdk";
export { completeAgentTurn, completeAgentTurnStream, TURN_EVENT_PROTOCOL_KERNEL_V1 };
export type { CompleteAgentTurnResult, TurnRichToolEvent, TurnStreamHandlers };

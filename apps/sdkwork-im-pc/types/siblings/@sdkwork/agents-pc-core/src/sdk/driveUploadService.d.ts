import type { DriveUploaderProgress, MediaResource } from "@sdkwork/drive-app-sdk";
import { type SdkworkAgentsDriveAppClient } from "./driveAppSdkClient";
export type AgentsMediaKind = "image" | "video" | "audio" | "voice" | "document" | "archive" | "other";
/**
 * Drive node property that marks a chat-uploaded file as a member of the chat
 * file library. Written with `app_public` visibility so the file library can
 * list marked files through the Drive `propertyNodes.list` app API.
 */
export declare const CHAT_FILE_LIBRARY_PROPERTY_KEY = "agents.chat_file_library";
export interface AgentsDriveMediaResource extends MediaResource {
    id: string;
    kind: AgentsMediaKind;
    source: "drive";
    uri: string;
    url?: string;
    fileName?: string;
    mimeType?: string;
    sizeBytes?: string;
    metadata: {
        driveSpaceId?: string;
        driveNodeId?: string;
        uploadItemId?: string;
        drive?: {
            spaceId: string;
            nodeId: string;
            spaceType?: string;
            nodeVersion?: string;
        };
    };
}
export type AgentsDriveUploadPurpose = "agent-avatar" | "agent-chat-attachment" | "agent-chat-image" | "agent-chat-video" | "agent-chat-voice" | "agent-creative-image" | "agent-creative-audio" | "agent-creative-video";
export interface AgentsDriveUploadRequest {
    file: File;
    purpose: AgentsDriveUploadPurpose;
    resourceId: string;
    signal?: AbortSignal;
    onProgress?: (progress: DriveUploaderProgress) => void;
}
export declare class AgentsDriveUploadService {
    private readonly getClient;
    constructor(getClient?: () => SdkworkAgentsDriveAppClient);
    upload(request: AgentsDriveUploadRequest): Promise<AgentsDriveMediaResource>;
    resolvePreviewUrl(driveUri: string): Promise<string>;
    private markChatFileLibrary;
}
export declare const agentsDriveUploadService: AgentsDriveUploadService;

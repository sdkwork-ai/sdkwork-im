import type { GenerationCommandResponse, GenerationModality, GenerationRecord, GenerationRecordPage, GenerationResult, GenerationResultPage, SdkworkGenerationsAppClient } from "./generationsAppSdkClient";
export type { GenerationRecord } from "./generationsAppSdkClient";
export interface GenerationCommandInput {
    modality: "image" | "video";
    operationType?: "image_edit" | "image_to_video" | "text_to_image" | "text_to_video";
    prompt: string;
    model?: string;
    inputAssetIds?: readonly string[];
    parameters?: Record<string, unknown>;
}
export interface GenerationMediaResult {
    generationResult: GenerationResult;
    kind: "image" | "video";
    url: string;
}
export interface WaitForGenerationOptions {
    intervalMs?: number;
    maxAttempts?: number;
    onStatus?: (record: GenerationRecord) => void;
}
type Sleep = (milliseconds: number) => Promise<void>;
type GenerationsClientProvider = () => (SdkworkGenerationsAppClient | Promise<SdkworkGenerationsAppClient>);
export declare class AgentsGenerationsService {
    private readonly getClient;
    private readonly resolveDrivePreviewUrl;
    private readonly sleep;
    constructor(getClient?: GenerationsClientProvider, resolveDrivePreviewUrl?: (driveUri: string) => Promise<string>, sleep?: Sleep);
    create(input: GenerationCommandInput): Promise<GenerationCommandResponse>;
    listRecords(input?: {
        cursor?: string;
        modality?: GenerationModality;
        pageSize?: number;
        q?: string;
    }): Promise<GenerationRecordPage>;
    listResults(generationId: string): Promise<GenerationResultPage>;
    listMediaResults(generationId: string): Promise<GenerationMediaResult[]>;
    waitForCompletion(initialRecord: GenerationRecord, options?: WaitForGenerationOptions): Promise<GenerationRecord>;
}
export declare const agentsGenerationsService: AgentsGenerationsService;

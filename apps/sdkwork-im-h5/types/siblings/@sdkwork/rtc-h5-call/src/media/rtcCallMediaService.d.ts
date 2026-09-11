import type { RtcDataSource, RtcProviderPackageCatalogEntry, RtcTrackKind } from "@sdkwork/rtc-sdk";
/**
 * RTC call media runtime.
 *
 * Wraps `@sdkwork/rtc-sdk` (the RTC authority SDK family) with the same
 * provider installation, credential-backed join, publish, mute, and DOM
 * render-binding flow proven by the desktop call implementation. The media
 * layer is signaling-agnostic: the join token is issued by the host through
 * the signaling port and passed in as plain data.
 */
export interface RtcCallMediaJoinOptions {
    /** Provider application id; falls back to the volcengine env override. */
    appId?: string;
    sessionId: string;
    roomId: string;
    participantId: string;
    token: string;
    displayName?: string;
    providerKey?: string;
    accessEndpoint?: string;
    providerRegion?: string;
    rtcMode?: string;
    metadata?: Record<string, unknown>;
}
export interface RtcCallMediaPublishOptions {
    kinds: readonly Extract<RtcTrackKind, "audio" | "video">[];
    sessionId: string;
}
export interface RtcCallMediaStatus {
    connected: boolean;
    providerKey: string;
    message?: string;
}
export interface RtcCallMediaService {
    bindLocalVideoElement(element: HTMLElement | null): Promise<void>;
    bindRemoteVideoElement(remoteUserId: string | null | undefined, element: HTMLElement | null): Promise<void>;
    join(options: RtcCallMediaJoinOptions): Promise<void>;
    leave(): Promise<void>;
    muteAudio(muted: boolean): Promise<void>;
    muteVideo(muted: boolean): Promise<void>;
    publish(options: RtcCallMediaPublishOptions): Promise<void>;
    getStatus(): RtcCallMediaStatus;
}
export interface RtcCallMediaServiceDependencies {
    createDataSource?: (options: RtcCallMediaJoinOptions) => Promise<RtcDataSource> | RtcDataSource;
    loadProviderModule?: (packageEntry: RtcProviderPackageCatalogEntry) => Promise<Record<string, unknown>>;
}
export declare function resolveRtcCallMediaPublishKinds(options: RtcCallMediaJoinOptions): readonly Extract<RtcTrackKind, "audio" | "video">[];
export declare class StandardRtcCallMediaService implements RtcCallMediaService {
    private readonly createDataSource;
    private client?;
    private joinedSessionId?;
    private localVideoBound;
    private localVideoElement?;
    private remoteVideoBound;
    private remoteVideoElement?;
    private remoteVideoUserId?;
    private publishedTrackIds;
    private providerKey;
    private message?;
    constructor(dependencies?: RtcCallMediaServiceDependencies);
    getStatus(): RtcCallMediaStatus;
    bindLocalVideoElement(element: HTMLElement | null): Promise<void>;
    bindRemoteVideoElement(remoteUserId: string | null | undefined, element: HTMLElement | null): Promise<void>;
    join(options: RtcCallMediaJoinOptions): Promise<void>;
    publish(options: RtcCallMediaPublishOptions): Promise<void>;
    muteAudio(muted: boolean): Promise<void>;
    muteVideo(muted: boolean): Promise<void>;
    leave(): Promise<void>;
    private getVolcengineLocalVideoEngine;
    private syncLocalVideoBinding;
    private syncRemoteVideoBinding;
    private unbindRemoteVideo;
    private unbindLocalVideo;
    private requireClient;
}
export declare function createRtcCallMediaService(dependencies?: RtcCallMediaServiceDependencies): RtcCallMediaService;

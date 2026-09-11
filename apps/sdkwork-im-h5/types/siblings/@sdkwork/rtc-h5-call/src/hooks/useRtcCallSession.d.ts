import { type RtcCallDirection, type RtcCallSnapshot, type RtcCallType } from "../domain/callTypes";
import { type RtcCallMediaService } from "../media/rtcCallMediaService";
import { type RtcCallSignalingPort } from "../signaling/rtcCallSignalingPort";
export interface UseRtcCallSessionOptions {
    /** Injected signaling port; when omitted the surface is fail-closed unavailable. */
    signaling?: RtcCallSignalingPort;
    /** Media runtime factory; defaults to the standard RTC media service. */
    mediaService?: () => RtcCallMediaService;
    type: RtcCallType;
    mode: RtcCallDirection;
    conversationId?: string;
    targetName?: string;
    targetAvatar?: string;
    targetUserId?: string;
    /** Session to recover (incoming call lifted by a watcher, or refresh restore). */
    rtcSessionId?: string;
    /** Automatically start the outgoing call when the hook mounts (outgoing mode). */
    autoStart?: boolean;
    onTerminal?: (snapshot: RtcCallSnapshot) => void;
    onError?: (message: string) => void;
}
export interface UseRtcCallSessionResult {
    snapshot: RtcCallSnapshot;
    /** True when no signaling port is injected or it is the fail-closed default. */
    isUnavailable: boolean;
    isBusy: boolean;
    durationSeconds: number;
    startOutgoing(): Promise<void>;
    acceptIncoming(): Promise<void>;
    rejectIncoming(): Promise<void>;
    endCall(): Promise<void>;
    toggleAudioMuted(): Promise<void>;
    toggleVideoMuted(): Promise<void>;
    bindLocalVideoElement(element: HTMLElement | null): Promise<void>;
    bindRemoteVideoElement(element: HTMLElement | null): Promise<void>;
}
export declare function useRtcCallSession(options: UseRtcCallSessionOptions): UseRtcCallSessionResult;

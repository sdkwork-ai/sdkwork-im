/**
 * RTC call domain types and pure state machine helpers.
 *
 * This module is the authoritative, UI-agnostic call domain for the mobile-browser
 * call surface. Signaling and media implementations are injected by the host
 * application through ports; UUID generation uses `@sdkwork/utils/id`.
 */
export type RtcCallType = "voice" | "video";
export type RtcCallDirection = "incoming" | "outgoing";
export type RtcCallState = "idle" | "ringing" | "connecting" | "connected" | "ended" | "rejected" | "errored";
export type RtcCallControllerState = "idle" | "watching" | "incoming_ringing" | "outgoing_ringing" | "connecting" | "connected" | "ended" | "rejected" | "errored";
export interface RtcCallSnapshot {
    accessEndpoint?: string;
    state: RtcCallState;
    controllerState?: RtcCallControllerState;
    conversationId?: string;
    direction?: RtcCallDirection;
    errorMessage?: string;
    initiatorId?: string;
    isParticipantCredentialReady?: boolean;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    participantCredentialExpiresAt?: string;
    participantId?: string;
    peerUserId?: string;
    providerKey?: string;
    providerRegion?: string;
    roomId?: string;
    rtcMode?: string;
    rtcSessionId?: string;
    targetName?: string;
    targetAvatar?: string;
    targetUserId?: string;
    type?: RtcCallType;
    durationSeconds?: number;
}
export type RtcCallTerminalState = "ended" | "rejected" | "errored";
export declare function createIdleRtcCallSnapshot(): RtcCallSnapshot;
export declare function isTerminalRtcCallState(state: RtcCallState): state is RtcCallTerminalState;
export declare function canApplyRtcCallState(current: RtcCallState, next: RtcCallState): boolean;
export declare function toRtcCallControllerState(state: RtcCallState, direction?: RtcCallDirection): RtcCallControllerState;
export declare function isRtcCallActive(snapshot: Pick<RtcCallSnapshot, "rtcSessionId" | "controllerState" | "state">): boolean;
/**
 * Normalizes a service state string into the domain state.
 * Unknown states keep ringing semantics so the caller still gets an answer
 * surface instead of a silent drop.
 */
export declare function toRecoveredRtcCallState(state: string | undefined): RtcCallState;
export declare function resolveRtcCallType(rtcMode: string | undefined): RtcCallType;
export declare function toRtcCallMode(type: RtcCallType): string;
/** The peer of a 1:1 call is the initiator unless the local participant initiated. */
export declare function resolveRtcCallPeerUserId(session: {
    initiatorId?: string | null;
}, participantId: string | undefined): string | undefined;
export declare function normalizeRtcIdSegment(value: string): string;
export declare function createRtcRuntimeId(prefix: string, stablePart: string): string;
export declare function formatRtcCallDuration(totalSeconds: number): string;
export declare function toRtcCallErrorMessage(error: unknown): string;

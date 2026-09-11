import type { RtcCallSnapshot } from "../domain/callTypes";
/**
 * Full-screen mobile call surface.
 *
 * Phases (mirror of the desktop overlay contract):
 *   unavailable        — fail-closed: no signaling injected
 *   incoming-ringing   — avatar + accept/reject
 *   outgoing-ringing   — avatar + status + cancel (+ mute for video calls)
 *   connecting         — avatar + connecting status
 *   connected          — video stage (remote + local PiP) or avatar for voice
 *   finished           — terminal status + close (auto-exits after a beat)
 */
export type RtcCallScreenPhase = "unavailable" | "incoming-ringing" | "outgoing-ringing" | "connecting" | "connected" | "finished";
export declare function resolveRtcCallScreenPhase(snapshot: RtcCallSnapshot, isUnavailable: boolean): RtcCallScreenPhase;
export interface RtcCallScreenTexts {
    call: {
        video: string;
        voice: string;
    };
    status: {
        connecting: string;
        waitingAnswer: string;
        inviting: string;
        ended: string;
        rejected: string;
        connectionFailed: string;
        unavailableTitle: string;
        unavailableDesc: string;
    };
    media: {
        micOn: string;
        micOff: string;
        cameraOn: string;
        cameraOff: string;
        self: string;
        remoteVideo: string;
    };
    actions: {
        accept: string;
        reject: string;
        cancel: string;
        hangup: string;
        close: string;
        mute: string;
        unmute: string;
        enableVideo: string;
        disableVideo: string;
        shareScreen: string;
    };
}
export interface RtcCallScreenProps {
    phase: RtcCallScreenPhase;
    snapshot: RtcCallSnapshot;
    durationSeconds: number;
    isBusy: boolean;
    texts: RtcCallScreenTexts;
    localVideoRef: React.RefObject<HTMLDivElement | null>;
    remoteVideoRef: React.RefObject<HTMLDivElement | null>;
    onAccept: () => void;
    onReject: () => void;
    onCancel: () => void;
    onHangup: () => void;
    onClose: () => void;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onShareScreen: () => void;
}
export declare function RtcCallScreen({ phase, snapshot, durationSeconds, isBusy, texts, localVideoRef, remoteVideoRef, onAccept, onReject, onCancel, onHangup, onClose, onToggleAudio, onToggleVideo, onShareScreen, }: RtcCallScreenProps): import("react").JSX.Element;

import type { RtcCallControllerState } from "../domain/callTypes";
/**
 * Bottom controls bar. Buttons are derived from the controller phase so each
 * phase exposes exactly the actions the product allows (mirrors the desktop
 * overlay contract): accept/reject while incoming-ringing, cancel while
 * outgoing-ringing, hangup while connected, close when finished.
 */
export interface RtcCallControlsBarProps {
    controllerState: RtcCallControllerState;
    type: "voice" | "video";
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    canShareScreen: boolean;
    isBusy: boolean;
    texts: {
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
    onAccept: () => void;
    onReject: () => void;
    onCancel: () => void;
    onHangup: () => void;
    onClose: () => void;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onShareScreen: () => void;
}
export declare function RtcCallControlsBar({ controllerState, type, isAudioMuted, isVideoMuted, canShareScreen, isBusy, texts, onAccept, onReject, onCancel, onHangup, onClose, onToggleAudio, onToggleVideo, onShareScreen, }: RtcCallControlsBarProps): import("react").JSX.Element;

/**
 * RTC call surface dictionary (en-US).
 *
 * Authored fragment kept in this package so host applications can embed the
 * call surface without dictionary merge concerns. Every key mirrors
 * `RTC_CALL_ZH_CN` (host merge enforces zh/en key parity).
 */
export interface RtcCallI18nTexts {
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
        switchSpeaker: string;
    };
    toast: {
        muteFailed: string;
        videoFailed: string;
        acceptFailed: string;
        localVideoBindFailed: string;
        remoteVideoBindFailed: string;
        screenShareStarted: string;
        screenShareEnded: string;
        screenShareDenied: string;
        screenShareCancelled: string;
        screenShareUnsupported: string;
    };
}
export declare const RTC_CALL_EN_US: RtcCallI18nTexts;

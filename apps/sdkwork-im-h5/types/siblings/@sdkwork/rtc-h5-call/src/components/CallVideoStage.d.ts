/**
 * Connected-call video stage: remote video fills the screen, local video is
 * rendered as a picture-in-picture tile. The containers are the binding
 * targets for the media runtime; the page wires them through
 * `bindLocalVideoElement` / `bindRemoteVideoElement`.
 */
export interface RtcCallVideoStageProps {
    type: "voice" | "video";
    isVideoOff: boolean;
    peerUserId?: string;
    peerName?: string;
    peerAvatar?: string;
    localMediaStatusText: string;
    localVideoRef: React.RefObject<HTMLDivElement | null>;
    remoteVideoRef: React.RefObject<HTMLDivElement | null>;
    selfText: string;
    remoteVideoText: string;
}
export declare function RtcCallVideoStage({ type, isVideoOff, peerUserId, peerName, peerAvatar, localMediaStatusText, localVideoRef, remoteVideoRef, selfText, remoteVideoText, }: RtcCallVideoStageProps): import("react").JSX.Element;

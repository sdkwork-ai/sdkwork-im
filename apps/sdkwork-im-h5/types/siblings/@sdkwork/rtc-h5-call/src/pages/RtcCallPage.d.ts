import type { RtcCallDirection, RtcCallType } from "../domain/callTypes";
import type { RtcCallI18nTexts } from "../i18n";
import { type RtcCallLocale } from "../i18n/rtcCallI18n";
import type { RtcCallSignalingPort } from "../signaling/rtcCallSignalingPort";
/**
 * Page-level call surface. Renders the full-screen call UI and drives the
 * session hook. `signaling` is injected by the host application; without it
 * the page is fail-closed unavailable (product requirement — never simulate).
 */
export interface RtcCallPageProps {
    type: RtcCallType;
    mode?: RtcCallDirection;
    /** Injected signaling port (IM H5 adapter, or omitted for fail-closed). */
    signaling?: RtcCallSignalingPort;
    conversationId?: string;
    targetName?: string;
    targetAvatar?: string;
    targetUserId?: string;
    /** Session to recover (incoming call lifted by a watcher, or refresh restore). */
    rtcSessionId?: string;
    /** Auto-start the outgoing call on mount (default true for outgoing mode). */
    autoStart?: boolean;
    /** How long the finished phase stays visible before auto-exit (ms). */
    finishedAutoExitMs?: number;
    locale?: RtcCallLocale;
    texts?: Partial<RtcCallI18nTexts>;
    onExit: () => void;
    onError?: (message: string) => void;
}
export declare function RtcCallPage(props: RtcCallPageProps): import("react").JSX.Element;

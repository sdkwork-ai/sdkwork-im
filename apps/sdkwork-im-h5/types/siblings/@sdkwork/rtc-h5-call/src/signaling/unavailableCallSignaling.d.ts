import type { RtcCallSignalingPort } from "./rtcCallSignalingPort";
export declare class RtcCallUnavailableError extends Error {
    constructor(message?: string);
}
/**
 * Fail-closed default signaling port.
 *
 * Product requirement: the call surface must never simulate a connection or
 * show placeholder media. Without a real signaling implementation the page
 * renders the typed unavailable state; every mutation rejects and
 * `watchIncoming` resolves `null`.
 */
export declare function createUnavailableRtcCallSignaling(): RtcCallSignalingPort;

/**
 * Caller avatar with a pulsing ring while the call is ringing.
 */
export interface RtcCallAvatarProps {
    name?: string;
    avatarUrl?: string;
    ringing?: boolean;
    size?: "md" | "lg" | "xl";
}
export declare function RtcCallAvatar({ name, avatarUrl, ringing, size }: RtcCallAvatarProps): import("react").JSX.Element;

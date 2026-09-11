import type { ReactNode } from "react";
/**
 * Circular call control button.
 *
 * Visual contract migrated verbatim from the IM H5 chat surface
 * (`sdkwork-im-h5-chat/components/Chat/CallControlButton.tsx`): a rounded
 * pill whose variant is danger (red), active (white), or default
 * (translucent white over dark glass) with an optional label beneath.
 */
export type RtcCallControlButtonVariant = "danger" | "active" | "default";
export interface RtcCallControlButtonProps {
    icon: ReactNode;
    label?: string;
    variant?: RtcCallControlButtonVariant;
    disabled?: boolean;
    onClick?: () => void;
    size?: "md" | "lg";
    title?: string;
}
export declare function RtcCallControlButton({ icon, label, variant, disabled, onClick, size, title, }: RtcCallControlButtonProps): import("react").JSX.Element;

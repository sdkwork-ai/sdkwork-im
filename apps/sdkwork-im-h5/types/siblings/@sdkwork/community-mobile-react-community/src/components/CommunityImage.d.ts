import React from "react";
/**
 * Community image with a guaranteed-visible fallback.
 *
 * Seed circles reference remote placeholder assets; in restricted networks
 * (WeChat X5, mainland China) remote hosts can be unreachable or slow. When
 * the image fails to load (or no src is provided) this component renders a
 * deterministic inline SVG placeholder (brand color + first character of the
 * seed) so avatars and covers are never an empty/broken box.
 */
export type CommunityImageKind = "avatar" | "cover";
interface CommunityImageProps {
    src?: string | null;
    alt?: string;
    className?: string;
    /** Text used to derive the fallback placeholder (name preferred). */
    fallbackSeed?: string;
    kind?: CommunityImageKind;
}
export declare const CommunityImage: React.FC<CommunityImageProps>;
export {};

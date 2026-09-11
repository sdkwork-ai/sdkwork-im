import { type ReactNode } from "react";
import { type RtcCallI18nTexts } from "./";
export type RtcCallLocale = "zh-CN" | "en-US";
export interface RtcCallI18nProviderProps {
    children: ReactNode;
    locale?: RtcCallLocale;
    texts?: Partial<RtcCallI18nTexts>;
}
/**
 * Optional i18n provider. Without it the call surface falls back to the
 * browser language with built-in dictionaries; hosts may pin a locale and
 * override individual strings.
 */
export declare function RtcCallI18nProvider({ children, locale, texts, }: RtcCallI18nProviderProps): import("react").JSX.Element;
export declare function useRtcCallI18n(): RtcCallI18nTexts;

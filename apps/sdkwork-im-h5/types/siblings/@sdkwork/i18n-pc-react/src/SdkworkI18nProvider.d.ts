import { type ReactNode } from "react";
import { type i18n as I18nInstance } from "i18next";
import { type SdkworkI18nRuntimeConfig, type SdkworkLocale, type SdkworkLocaleTag, type SdkworkMessageCatalog, type SdkworkMessageTree } from "./catalog.ts";
export interface SdkworkI18nValue {
    catalogs: Record<string, SdkworkMessageCatalog>;
    changeLocale(locale: string): Promise<void>;
    config: SdkworkI18nRuntimeConfig;
    i18n: I18nInstance;
    /** Backward-compatible SDKWork core locale projection. */
    locale: SdkworkLocale;
    localeTag: SdkworkLocaleTag;
    resolveMessages<TMessages extends SdkworkMessageTree>(catalog: SdkworkMessageCatalog<TMessages>): TMessages;
}
export interface SdkworkI18nProviderProps {
    catalogs?: readonly SdkworkMessageCatalog[];
    children?: ReactNode;
    config?: SdkworkI18nRuntimeConfig;
    defaultVariables?: Readonly<Record<string, unknown>>;
    locale?: string | null;
    syncDocumentLanguage?: boolean;
}
export declare function SdkworkI18nProvider({ catalogs, children, config, defaultVariables, locale, syncDocumentLanguage, }: SdkworkI18nProviderProps): import("react").FunctionComponentElement<import("react").ProviderProps<SdkworkI18nValue | null>>;
export declare function useSdkworkI18n(): SdkworkI18nValue | null;
export declare function useSdkworkModuleMessages<TMessages extends SdkworkMessageTree>(catalog: SdkworkMessageCatalog<TMessages>): TMessages;

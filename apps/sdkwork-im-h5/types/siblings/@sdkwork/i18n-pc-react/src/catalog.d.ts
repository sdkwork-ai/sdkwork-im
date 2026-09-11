export declare const SDKWORK_STANDARD_LOCALES: readonly ["en-US", "zh-CN", "de-DE", "fr-FR", "ja-JP", "ko-KR", "ru-RU"];
export type SdkworkLocale = "en-US" | "zh-CN";
export type SdkworkLocaleTag = string;
export interface SdkworkI18nRuntimeConfig {
    activeLocales: readonly SdkworkLocaleTag[];
    defaultLocale: SdkworkLocaleTag;
    fallbackLocale: SdkworkLocaleTag;
    loadingStrategy?: "eager-core-lazy-feature" | "lazy-route-fragments" | "platform-generated-bundle";
    supportedLocales: readonly SdkworkLocaleTag[];
}
export type SdkworkDeepPartial<T> = {
    [K in keyof T]?: T[K] extends (...args: never[]) => unknown ? T[K] : T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? SdkworkDeepPartial<T[K]> : T[K];
};
export type SdkworkMessageTree = object;
export interface CreateSdkworkMessageCatalogOptions<TMessages extends SdkworkMessageTree> {
    defaultLocale?: SdkworkLocaleTag;
    locales: Record<SdkworkLocaleTag, TMessages>;
    namespace: string;
    overrides?: Partial<Record<SdkworkLocaleTag, SdkworkDeepPartial<TMessages>>>;
}
export interface SdkworkMessageCatalog<TMessages extends SdkworkMessageTree = SdkworkMessageTree> {
    defaultLocale: SdkworkLocaleTag;
    locales: Record<SdkworkLocaleTag, TMessages>;
    namespace: string;
    resolveMessages(locale?: string | null): TMessages;
}
export declare function defineSdkworkI18nRuntimeConfig(config: Omit<SdkworkI18nRuntimeConfig, "activeLocales"> & {
    activeLocales?: readonly string[];
}): SdkworkI18nRuntimeConfig;
export declare const DEFAULT_SDKWORK_I18N_RUNTIME_CONFIG: SdkworkI18nRuntimeConfig;
export declare function normalizeSdkworkLocale(locale?: string | null): SdkworkLocale;
export declare function normalizeSdkworkLocale(locale?: string | null, config?: SdkworkI18nRuntimeConfig): SdkworkLocaleTag;
export declare function mergeSdkworkMessages<T>(base: T, overrides?: SdkworkDeepPartial<T>): T;
export declare function cloneSdkworkMessageTree<T>(value: T): T;
export declare function createSdkworkMessageCatalog<TMessages extends SdkworkMessageTree>({ defaultLocale, locales, namespace, overrides, }: CreateSdkworkMessageCatalogOptions<TMessages>): SdkworkMessageCatalog<TMessages>;
export declare function assertSdkworkCatalogLocaleParity(catalog: SdkworkMessageCatalog, locales?: readonly string[]): void;

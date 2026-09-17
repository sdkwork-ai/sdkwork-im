/// <reference types="miniprogram-api-typings" />

/**
 * WeChat navigation, tab bar, locale, and feedback adapters.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8. Capability
 * packages return route ids and page paths; only this package turns them into
 * `wx.navigateTo` / `wx.switchTab` / `wx.showToast` calls, so no capability
 * ever hard-codes a platform API.
 *
 * The locale helper exists because the platform cannot express a localized tab
 * label in `app.json`: the root bootstrap applies labels through
 * `wx.setTabBarItem` once the locale registry is ready.
 */

export interface WxNavigationApi {
  navigateTo(options: { url: string }): void;
  redirectTo(options: { url: string }): void;
  switchTab(options: { url: string }): void;
  reLaunch(options: { url: string }): void;
  setTabBarItem(options: { index: number; text: string }): void;
  setNavigationBarTitle(options: { title: string }): void;
}

export interface WxFeedbackApi {
  showToast(options: { title: string; icon?: "none" | "success" | "error" | "loading"; duration?: number }): void;
}

export interface WxLocaleApi {
  getAppBaseInfo?(): { language?: string };
  getSystemInfoSync?(): { language?: string };
}

export type ImMpToastIcon = "none" | "success" | "error";

/** Navigation surface consumed by pages through the runtime bundle. */
export interface ImMpNavigationAdapter {
  /** Pushes a page. `pagePath` is a route-contribution `pagePath`. */
  readonly navigateTo: (pagePath: string, query?: Record<string, string>) => void;
  readonly redirectTo: (pagePath: string, query?: Record<string, string>) => void;
  /** Switches to a tab page; the platform rejects `navigateTo` for those. */
  readonly switchTab: (pagePath: string) => void;
  readonly reLaunch: (pagePath: string, query?: Record<string, string>) => void;
  readonly setTabBarItem: (index: number, item: { text: string }) => void;
  /**
   * Sets the navigation bar title.
   *
   * A capability page resolves its title from a locale registry at runtime,
   * which `page.json#navigationBarTitleText` (static) cannot express, so the
   * page applies the localized value through this adapter.
   */
  readonly setNavigationBarTitle: (title: string) => void;
  readonly showToast: (title: string, icon?: ImMpToastIcon) => void;
}

/** Default toast duration in milliseconds; matches the platform default. */
const DEFAULT_TOAST_DURATION_MS = 2_000;

export function createWeixinNavigationAdapter(
  navigation: WxNavigationApi,
  feedback: Partial<WxFeedbackApi> = {},
): ImMpNavigationAdapter {
  return {
    navigateTo: (pagePath, query) => navigation.navigateTo({ url: toNavigationUrl(pagePath, query) }),
    redirectTo: (pagePath, query) => navigation.redirectTo({ url: toNavigationUrl(pagePath, query) }),
    switchTab: (pagePath) => navigation.switchTab({ url: toNavigationUrl(pagePath) }),
    reLaunch: (pagePath, query) => navigation.reLaunch({ url: toNavigationUrl(pagePath, query) }),
    setTabBarItem: (index, item) => navigation.setTabBarItem({ index, text: item.text }),
    setNavigationBarTitle: (title) => navigation.setNavigationBarTitle({ title }),
    showToast: (title, icon = "none") => {
      feedback.showToast?.({ title, icon, duration: DEFAULT_TOAST_DURATION_MS });
    },
  };
}

export function readWeixinNavigationApi(): WxNavigationApi {
  const candidate = (globalThis as { wx?: Partial<WxNavigationApi> }).wx;
  if (!candidate || typeof candidate.navigateTo !== "function") {
    throw new Error("WeChat navigation API is unavailable");
  }
  return candidate as WxNavigationApi;
}

export function createWeixinNavigationAdapterFromGlobal(): ImMpNavigationAdapter {
  return createWeixinNavigationAdapter(
    readWeixinNavigationApi(),
    (globalThis as { wx?: Partial<WxFeedbackApi> }).wx ?? {},
  );
}

/**
 * Converts a route-contribution page path into a navigation URL.
 *
 * `pages/inbox/index` -> `/pages/inbox/index`. The platform requires the
 * leading slash; route contributions deliberately omit it so the projector can
 * strip subpackage prefixes without special-casing a slash.
 */
export function toNavigationUrl(pagePath: string, query?: Record<string, string>): string {
  const normalized = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  if (!query) {
    return normalized;
  }
  const params = Object.entries(query)
    .filter(([, value]) => typeof value === "string" && value.length > 0)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  return params.length > 0 ? `${normalized}?${params.join("&")}` : normalized;
}

/**
 * Reads the platform language for locale negotiation.
 *
 * `getAppBaseInfo` is the current API; `getSystemInfoSync` is the deprecated
 * fallback kept for older devtools builds. Returns `undefined` when neither is
 * available so the caller falls back to the default locale instead of guessing.
 */
export function readWeixinLanguage(locale: WxLocaleApi): string | undefined {
  const fromAppBaseInfo = locale.getAppBaseInfo?.().language;
  if (typeof fromAppBaseInfo === "string" && fromAppBaseInfo.trim().length > 0) {
    return fromAppBaseInfo.trim();
  }
  const fromSystemInfo = locale.getSystemInfoSync?.().language;
  if (typeof fromSystemInfo === "string" && fromSystemInfo.trim().length > 0) {
    return fromSystemInfo.trim();
  }
  return undefined;
}

export function readWeixinLanguageFromGlobal(): string | undefined {
  return readWeixinLanguage((globalThis as { wx?: WxLocaleApi }).wx ?? {});
}

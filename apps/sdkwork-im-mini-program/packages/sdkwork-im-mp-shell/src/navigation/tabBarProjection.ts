/**
 * Tab bar projection for the IM mini program surface.
 *
 * Authority: `APP_MINI_PROGRAM_UI_SPEC.md`. The platform tab bar is declared
 * statically in `app.json`, but its labels must follow the negotiated locale,
 * which `app.json` cannot express. The root bootstrap therefore applies
 * `wx.setTabBarItem` from this projection after the locale registry is ready,
 * and `app.json` keeps a static fallback for first paint.
 *
 * Only root-package routes in the `main` layout group may appear in the tab
 * bar: the platform rejects tab pages placed in a subpackage.
 */

import type { ImMpRouteContribution } from "./routeContribution";

export interface ImMpTabBarEntry {
  readonly pagePath: string;
  readonly titleKey: string;
  /** Resolved label for the active locale. */
  readonly text: string;
  readonly iconPath?: string;
  readonly selectedIconPath?: string;
}

export interface ImMpTabBarProjectionOptions {
  /** Resolves a title key for the active locale; falls back to the key itself. */
  readonly resolveTitle?: (titleKey: string) => string;
}

/**
 * Platform minimum tab count.
 *
 * WeChat rejects a `tabBar` with fewer than two items, so a build whose
 * capability set yields a single `main` page MUST omit the tab bar entirely
 * rather than declare one the platform refuses to load. The current IM mini
 * program slice ships one `main` page (the inbox), which is exactly this case.
 */
export const IM_MP_TAB_BAR_MIN_ITEMS = 2;

export interface ImMpTabBarDeclaration {
  readonly enabled: boolean;
  /** Present when `enabled` is false; explains why, for build logs. */
  readonly reason?: string;
}

/**
 * Decides whether the build may declare `app.json#tabBar`.
 *
 * Callers must use this before calling `applyImMpTabBar`: applying labels to a
 * tab bar that `app.json` does not declare throws on device.
 */
export function resolveImMpTabBarDeclaration(
  entries: ImMpTabBarEntry[],
): ImMpTabBarDeclaration {
  if (entries.length < IM_MP_TAB_BAR_MIN_ITEMS) {
    return {
      enabled: false,
      reason:
        `tab bar requires at least ${IM_MP_TAB_BAR_MIN_ITEMS} main pages; this build declares ${entries.length}`,
    };
  }
  return { enabled: true };
}

export function projectImMpTabBar(
  routes: ImMpRouteContribution[],
  options: ImMpTabBarProjectionOptions = {},
): ImMpTabBarEntry[] {
  const resolveTitle = options.resolveTitle ?? ((titleKey: string) => titleKey);
  return routes
    .filter((route) => route.layoutGroup === "main" && route.miniProgram.rootPackage === true)
    .map((route) => ({
      pagePath: route.miniProgram.pagePath,
      titleKey: route.titleKey,
      text: resolveTitle(route.titleKey),
    }));
}

/**
 * Applies the projection through the platform tab bar API.
 *
 * The platform adapter is injected so `mp-shell` stays free of `wx.*` globals
 * (`MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8). Returns the number of
 * items written; `0` means the build declares no tab pages.
 */
export function applyImMpTabBar(
  entries: ImMpTabBarEntry[],
  setTabBarItem: (index: number, item: { text: string }) => void,
): number {
  entries.forEach((entry, index) => {
    setTabBarItem(index, { text: entry.text });
  });
  return entries.length;
}

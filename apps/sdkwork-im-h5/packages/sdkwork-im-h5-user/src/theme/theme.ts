/**
 * Theme mode access for the SDKWork IM H5 user-settings surface.
 *
 * Per `THEME_DARKMODE_SPEC.md` §3.2/§7.2 the mode root
 * (`document.documentElement`) has a single writer on this surface: the shell
 * theme owner (`sdkwork-im-h5-shell/src/theme/theme.ts`). Settings pages
 * `MUST NOT` toggle the root class directly — they route the explicit user
 * choice through this owner-side module, which performs the write on behalf
 * of the settings UI and keeps persistence handling in one place.
 */

/**
 * @returns whether the surface root is currently in dark mode.
 */
export function isDarkModeActive(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return document.documentElement.classList.contains("dark");
}

/**
 * Applies an explicit dark/light choice made in settings to the surface root.
 * The explicit preference itself is persisted by the shell preference store;
 * this call only propagates the resolved mode so the change is visible
 * without a reload.
 */
export function applyExplicitDarkMode(dark: boolean): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Single theme owner for the SDKWork IM H5 shell surface.
 *
 * Per `THEME_DARKMODE_SPEC.md` §3.2 this module is the only place on the H5
 * surface that resolves the OS color-scheme preference and writes the mode
 * root (`document.documentElement`): explicit user preference first, system
 * scheme as fallback, live system-change sync while no explicit choice exists.
 * Feature components and settings pages consume the resolved mode through the
 * mode root or the exported API — they never read `prefers-color-scheme` or
 * write the root themselves.
 */

/** Storage key shared with `SettingsService` in `@sdkwork/im-h5-user`. */
const IM_H5_SETTINGS_STORAGE_KEY = "sdkwork_im_h5_settings";

/**
 * Reads the persisted dark-mode preference; `null` when the user never made
 * an explicit choice (then the system color scheme applies).
 */
export function readExplicitDarkPreference(): boolean | null {
  try {
    const stored = window.localStorage.getItem(IM_H5_SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { darkMode?: boolean };
      if (typeof parsed.darkMode === "boolean") {
        return parsed.darkMode;
      }
    }
  } catch {
    // malformed storage: treated as no explicit preference
  }
  return null;
}

/**
 * Applies the persisted dark-mode preference on startup; falls back to the
 * system color scheme when the user never chose. Keeps the `.dark` class in
 * sync so both the theme variables and the `dark:` variants switch together.
 */
export function applyInitialTheme() {
  const root = document.documentElement;
  const explicit = readExplicitDarkPreference();
  if (explicit !== null) {
    root.classList.toggle("dark", explicit);
    return;
  }
  root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
}

/**
 * Applies an explicit user dark-mode choice from the settings surface.
 * Writes the mode root on behalf of the caller (the single-writer exception
 * of the theme owner) and persists the preference.
 */
export function applyExplicitDarkMode(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Boot-time initializer: applies the initial theme and follows live system
 * theme changes while the user has not made an explicit choice.
 *
 * 实时跟随系统/微信开发者工具的主题切换：开发者工具模拟器在页面加载后
 * 切换深色模式时 matchMedia 事件会触发，若不监听则页面一直停留在启动时
 * 的配色。用户已在设置中显式选择深/浅色时不覆盖其偏好。
 */
export function watchSystemTheme(): () => void {
  applyInitialTheme();
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = (event: MediaQueryListEvent) => {
    if (readExplicitDarkPreference() !== null) {
      return;
    }
    document.documentElement.classList.toggle("dark", event.matches);
  };
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

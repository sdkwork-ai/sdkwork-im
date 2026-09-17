/**
 * Package-local i18n resource helpers.
 *
 * Authority: `I18N_SPEC.md`. Platform monolithic resources must be assembled
 * from fragments and must not be hand-authored whole-root catalogs.
 *
 * These helpers are locale math only; they hold no copy. Authored strings live
 * under `<package>/src/main/ets/i18n/<locale>/<domain>/<capability>/<fragment>.ets`.
 */
export type ImHarmonyLocale = 'en-US' | 'zh-CN';

export const IM_HARMONY_DEFAULT_LOCALE: ImHarmonyLocale = 'en-US';

/**
 * Normalizes any platform locale tag onto the supported set.
 *
 * A bare `zh`, `zh-Hans`, or `zh-Hans-CN` all resolve to `zh-CN`: HarmonyOS
 * reports the region-qualified form, and treating it as unsupported would drop
 * the user to English on a Chinese device.
 */
export function normalizeImHarmonyLocale(value: string): ImHarmonyLocale {
  return value.trim().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
}

/**
 * Merges locale fragments into one catalog.
 *
 * Later fragments win, so a caller can layer an override after the base
 * fragment without mutating it.
 */
export function mergeImHarmonyFragments(
  fragments: Array<Record<string, string>>,
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const fragment of fragments) {
    for (const key of Object.keys(fragment)) {
      merged[key] = fragment[key];
    }
  }
  return merged;
}

/**
 * Resolves one message.
 *
 * The fallback defaults to the key itself so a missing translation renders as a
 * visible key rather than an empty element: a blank label in a native app looks
 * like a layout bug and never gets reported.
 */
export function pickImHarmonyMessage(
  catalog: Record<string, string>,
  key: string,
  fallback: string = key,
): string {
  const value: string | undefined = catalog[key];
  if (value === undefined || value.trim().length === 0) {
    return fallback;
  }
  return value;
}

/**
 * Substitutes `{{name}}` placeholders.
 *
 * Unknown placeholders are left intact on purpose: a stray `{{count}}` on screen
 * is a diagnosable bug, whereas an empty string hides the mistake.
 */
export function formatImHarmonyMessage(
  template: string,
  params: Record<string, string | number>,
): string {
  let result: string = template;
  for (const name of Object.keys(params)) {
    const token: string = '{{' + name + '}}';
    result = result.split(token).join(String(params[name]));
  }
  return result;
}

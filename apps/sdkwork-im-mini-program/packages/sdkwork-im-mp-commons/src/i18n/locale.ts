/**
 * Thin locale boundary for the IM mini program capability family.
 *
 * Authority: `I18N_SPEC.md` section 6.1. Thin boundaries (`index`, `manifest`,
 * `locale`, `locales`, `registry`, `runtime`, `types`, `provider`) may
 * normalize, look up, register, or type fragments; they MUST NOT author
 * feature copy. Authored fragments live under
 * `src/i18n/<locale>/<domain>/<capability>/<fragment>.ts` inside the owning
 * capability package.
 */
export type ImMpLocale = "en-US" | "zh-CN";

export function normalizeImMpLocale(value: string): ImMpLocale {
  return value.trim().toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
}

export function pickImMpMessage(
  fragment: Record<string, string>,
  key: string,
  fallback: string,
): string {
  const value = fragment[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function mergeImMpFragments(
  fragments: readonly Record<string, string>[],
): Record<string, string> {
  return fragments.reduce<Record<string, string>>(
    (merged, fragment) => Object.assign(merged, fragment),
    {},
  );
}

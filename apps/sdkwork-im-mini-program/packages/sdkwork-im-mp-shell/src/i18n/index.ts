/**
 * Thin locale registry for the IM mini program shell.
 *
 * Authority: `I18N_SPEC.md` section 6.1. A thin registry may normalize, merge,
 * and look up fragments; it MUST NOT author feature copy. Authored strings live
 * under `src/i18n/<locale>/<domain>/<capability>/<fragment>.ts`.
 */

import {
  mergeImMpFragments,
  normalizeImMpLocale,
  pickImMpMessage,
  type ImMpLocale,
} from "@sdkwork/im-mp-commons";

import { imMpSessionLoginMessages as zhSessionLoginMessages } from "./zh-CN/communication/session/login";
import { imMpSessionLoginMessages as enSessionLoginMessages } from "./en-US/communication/session/login";

export type { ImMpLocale };

/** Merged shell message catalogs per locale. */
export const imMpShellMessages: Record<ImMpLocale, Record<string, string>> = {
  "zh-CN": mergeImMpFragments([zhSessionLoginMessages]),
  "en-US": mergeImMpFragments([enSessionLoginMessages]),
};

/** Resolves one shell message; a missing key falls back to the key itself. */
export function resolveImMpShellMessage(
  locale: string,
  key: string,
  fallback: string = key,
): string {
  return pickImMpMessage(imMpShellMessages[normalizeImMpLocale(locale)], key, fallback);
}

/**
 * Thin locale registry for the IM HarmonyOS shell.
 *
 * Authority: `I18N_SPEC.md` section 6.1. A thin registry may normalize, merge,
 * and look up fragments; it MUST NOT author feature copy. Every authored string
 * lives under `src/main/ets/i18n/<locale>/<domain>/<capability>/<fragment>.ets`.
 */
import {
  mergeImHarmonyFragments,
  normalizeImHarmonyLocale,
  pickImHarmonyMessage,
  type ImHarmonyLocale,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import { imHarmonySessionLoginMessagesZhCn } from './zh-CN/communication/session/login';
import { imHarmonySessionLoginMessagesEnUs } from './en-US/communication/session/login';

export type { ImHarmonyLocale };

/** Merged shell message catalogs per locale. */
export const imHarmonyShellMessages: Record<string, Record<string, string>> = {};
imHarmonyShellMessages['zh-CN'] = mergeImHarmonyFragments([imHarmonySessionLoginMessagesZhCn]);
imHarmonyShellMessages['en-US'] = mergeImHarmonyFragments([imHarmonySessionLoginMessagesEnUs]);

/** Keys the shell contributes, in stable order. */
export function listImHarmonyShellMessageKeys(locale: ImHarmonyLocale): string[] {
  return Object.keys(imHarmonyShellMessages[locale]).sort();
}

export function resolveImHarmonyShellMessage(
  locale: string,
  key: string,
  fallback: string = key,
): string {
  return pickImHarmonyMessage(imHarmonyShellMessages[normalizeImHarmonyLocale(locale)], key, fallback);
}

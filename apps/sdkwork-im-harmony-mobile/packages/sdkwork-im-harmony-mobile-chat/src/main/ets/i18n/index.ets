/**
 * Thin locale registry for the IM HarmonyOS chat capability.
 *
 * Authority: `I18N_SPEC.md` section 6.1. A thin registry may normalize, merge,
 * and look up fragments; it MUST NOT author feature copy. Every authored string
 * lives under `src/main/ets/i18n/<locale>/<domain>/<capability>/<fragment>.ets`.
 *
 * The registry is a plain object lookup instead of a full i18n library: the
 * capability ships a fixed resource budget inside the HAP, and the chat surface
 * needs exactly one capability of messages.
 */
import {
  formatImHarmonyMessage,
  mergeImHarmonyFragments,
  normalizeImHarmonyLocale,
  pickImHarmonyMessage,
  type ImHarmonyLocale,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import { imHarmonyChatInboxMessagesZhCn } from './zh-CN/communication/chat/inbox';
import { imHarmonyChatConversationMessagesZhCn } from './zh-CN/communication/chat/conversation';
import { imHarmonyChatCreateGroupMessagesZhCn } from './zh-CN/communication/chat/create-group';
import { imHarmonyChatStateMessagesZhCn } from './zh-CN/communication/chat/state';
import { imHarmonyChatInboxMessagesEnUs } from './en-US/communication/chat/inbox';
import { imHarmonyChatConversationMessagesEnUs } from './en-US/communication/chat/conversation';
import { imHarmonyChatCreateGroupMessagesEnUs } from './en-US/communication/chat/create-group';
import { imHarmonyChatStateMessagesEnUs } from './en-US/communication/chat/state';

export type { ImHarmonyLocale };

/** Merged chat message catalogs per locale. */
export const imHarmonyChatMessages: Record<string, Record<string, string>> = {};
imHarmonyChatMessages['zh-CN'] = mergeImHarmonyFragments([
  imHarmonyChatInboxMessagesZhCn,
  imHarmonyChatConversationMessagesZhCn,
  imHarmonyChatCreateGroupMessagesZhCn,
  imHarmonyChatStateMessagesZhCn,
]);
imHarmonyChatMessages['en-US'] = mergeImHarmonyFragments([
  imHarmonyChatInboxMessagesEnUs,
  imHarmonyChatConversationMessagesEnUs,
  imHarmonyChatCreateGroupMessagesEnUs,
  imHarmonyChatStateMessagesEnUs,
]);

/** Keys the chat capability contributes, in stable order. */
export function listImHarmonyChatMessageKeys(locale: ImHarmonyLocale): string[] {
  return Object.keys(imHarmonyChatMessages[locale]).sort();
}

/**
 * Resolves one chat message.
 *
 * `fallback` defaults to the key itself so a missing translation renders as a
 * visible key rather than an empty element — a blank label in a native app looks
 * like a layout bug and never gets reported.
 */
export function resolveImHarmonyChatMessage(
  locale: string,
  key: string,
  fallback: string = key,
): string {
  return pickImHarmonyMessage(imHarmonyChatMessages[normalizeImHarmonyLocale(locale)], key, fallback);
}

/**
 * Substitutes `{{name}}` placeholders.
 *
 * Unknown placeholders are left intact on purpose: a stray `{{count}}` on screen
 * is a diagnosable bug, whereas an empty string hides the mistake.
 */
export function formatImHarmonyChatMessage(
  template: string,
  params: Record<string, string | number>,
): string {
  return formatImHarmonyMessage(template, params);
}

/**
 * Thin locale registry for the IM mini program chat capability.
 *
 * Authority: `I18N_SPEC.md` section 6.1. A thin registry may normalize, merge,
 * and look up fragments; it MUST NOT author feature copy. Every authored string
 * lives under `src/i18n/<locale>/<domain>/<capability>/<fragment>.ts`.
 *
 * The registry is a plain object lookup instead of a full i18n library: the
 * mini program ships a fixed bundle budget per subpackage, and the chat surface
 * needs exactly one capability of messages.
 */

import {
  mergeImMpFragments,
  normalizeImMpLocale,
  pickImMpMessage,
  type ImMpLocale,
} from "@sdkwork/im-mp-commons";

import { imMpChatInboxMessages as zhInboxMessages } from "./zh-CN/communication/chat/inbox";
import { imMpChatConversationMessages as zhConversationMessages } from "./zh-CN/communication/chat/conversation";
import { imMpChatCreateGroupMessages as zhCreateGroupMessages } from "./zh-CN/communication/chat/create-group";
import { imMpChatInboxMessages as enInboxMessages } from "./en-US/communication/chat/inbox";
import { imMpChatConversationMessages as enConversationMessages } from "./en-US/communication/chat/conversation";
import { imMpChatCreateGroupMessages as enCreateGroupMessages } from "./en-US/communication/chat/create-group";

export type { ImMpLocale };

/** Merged chat message catalogs per locale. */
export const imMpChatMessages: Record<ImMpLocale, Record<string, string>> = {
  "zh-CN": mergeImMpFragments([
    zhInboxMessages,
    zhConversationMessages,
    zhCreateGroupMessages,
  ]),
  "en-US": mergeImMpFragments([
    enInboxMessages,
    enConversationMessages,
    enCreateGroupMessages,
  ]),
};

/** Keys the chat capability contributes, in stable order. */
export function listImMpChatMessageKeys(locale: ImMpLocale): string[] {
  return Object.keys(imMpChatMessages[locale]).sort();
}

/**
 * Resolves one chat message.
 *
 * `fallback` defaults to the key itself so a missing translation renders as a
 * visible key rather than an empty element — a blank label in a mini program
 * looks like a layout bug and never gets reported.
 */
export function resolveImMpChatMessage(
  locale: string,
  key: string,
  fallback: string = key,
): string {
  return pickImMpMessage(imMpChatMessages[normalizeImMpLocale(locale)], key, fallback);
}

/**
 * Substitutes `{{name}}` placeholders.
 *
 * Unknown placeholders are left intact on purpose: a stray `{{count}}` on
 * screen is a diagnosable bug, whereas an empty string hides the mistake.
 */
export function formatImMpChatMessage(
  template: string,
  params: Record<string, string | number> = {},
): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/gu, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

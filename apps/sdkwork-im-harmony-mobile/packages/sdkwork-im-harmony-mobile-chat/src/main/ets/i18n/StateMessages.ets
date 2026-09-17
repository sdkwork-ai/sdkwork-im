/**
 * Screen-state copy resolution for the chat capability.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 11 and
 * `APP_HARMONY_NATIVE_UI_SPEC.md`. Every chat screen maps the same
 * loading/empty/error/offline/permission-denied statuses, so the status-to-key
 * decision lives here once instead of being re-derived per page — a page that
 * reinvents it is how one screen ends up rendering an empty list where it should
 * render an error.
 */
import { IM_HARMONY_UNKNOWN_ERROR, type ImHarmonyScreenStatus } from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import { resolveImHarmonyChatMessage } from './index';

/**
 * Keys a chat screen supplies for the states that are not screen-specific.
 *
 * Passed in rather than imported because the loading, empty, and retry strings
 * differ per screen while the offline and permission-denied strings do not.
 */
export interface ImHarmonyChatScreenKeys {
  readonly loading: string;
  readonly empty: string;
  readonly retry: string;
}

/**
 * Resolves the message a state renders.
 *
 * A reported failure keeps its own detail when the SDK produced one, because
 * "message send failed: content rejected" is actionable and the generic
 * unknown-error copy is not.
 */
export function resolveImHarmonyChatStateMessage(
  locale: string,
  status: ImHarmonyScreenStatus,
  keys: ImHarmonyChatScreenKeys,
  errorMessage?: string,
): string {
  if (status === 'offline') {
    return resolveImHarmonyChatMessage(locale, 'chat.state.offline');
  }
  if (status === 'permission-denied') {
    return resolveImHarmonyChatMessage(locale, 'chat.state.permission_denied');
  }
  if (status === 'empty') {
    return resolveImHarmonyChatMessage(locale, keys.empty);
  }
  if (status === 'error') {
    const detail: string = errorMessage === undefined ? '' : errorMessage.trim();
    if (detail.length > 0 && detail !== IM_HARMONY_UNKNOWN_ERROR) {
      return detail;
    }
    return resolveImHarmonyChatMessage(locale, 'chat.state.unknown_error');
  }
  return resolveImHarmonyChatMessage(locale, keys.loading);
}

/** Retry label for a retryable state. */
export function resolveImHarmonyChatStateRetryLabel(
  locale: string,
  keys: ImHarmonyChatScreenKeys,
): string {
  return resolveImHarmonyChatMessage(locale, keys.retry);
}

/** Key sets the three chat screens supply. */
export const IM_HARMONY_CHAT_INBOX_SCREEN_KEYS: ImHarmonyChatScreenKeys = {
  loading: 'chat.inbox.loading',
  empty: 'chat.inbox.empty',
  retry: 'chat.inbox.retry',
};

export const IM_HARMONY_CHAT_CONVERSATION_SCREEN_KEYS: ImHarmonyChatScreenKeys = {
  loading: 'chat.conversation.loading',
  empty: 'chat.conversation.empty',
  retry: 'chat.conversation.retry',
};

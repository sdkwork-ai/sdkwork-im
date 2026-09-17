/**
 * Domain-neutral screen state model.
 *
 * Authority: `APP_HARMONY_NATIVE_UI_SPEC.md`. Every capability screen renders
 * the same loading/success/empty/error states, so the state machine lives here
 * once instead of being re-derived per page.
 *
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 11 requires UI tests to
 * cover loading, success, empty, validation-error, permission-denied,
 * offline/unavailable, and unknown-error. Those states are enumerated here so a
 * page cannot quietly render only the happy path.
 */
export type ImHarmonyScreenStatus =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error'
  | 'offline'
  | 'permission-denied';

/**
 * Derives the status for a completed read.
 *
 * `itemCount === 0` maps to `empty`, never to `success`: an inbox that renders
 * an empty success screen instead of the empty state shows a blank page with no
 * explanation.
 */
export function resolveImHarmonyScreenStatus(
  itemCount: number,
  failed: boolean,
): ImHarmonyScreenStatus {
  if (failed) {
    return 'error';
  }
  return itemCount > 0 ? 'success' : 'empty';
}

/** True when the page should offer a retry affordance. */
export function isImHarmonyRetryableStatus(status: ImHarmonyScreenStatus): boolean {
  return status === 'error' || status === 'offline';
}

/**
 * Applies platform-level conditions on top of a data-derived status.
 *
 * `offline` and `permission-denied` outrank the read result: a screen that shows
 * "no conversations yet" while the device has no network teaches the user that
 * the inbox is empty, which is a lie the data read cannot correct. Section 11 of
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` requires both states to be covered,
 * and neither is derivable from an SDK response.
 */
export function resolveImHarmonyEffectiveStatus(
  status: ImHarmonyScreenStatus,
  offline: boolean,
  permissionDenied: boolean,
): ImHarmonyScreenStatus {
  if (permissionDenied) {
    return 'permission-denied';
  }
  if (offline) {
    return 'offline';
  }
  return status;
}

/**
 * Fallback detail returned when a thrown value carries no usable message.
 *
 * Exported so a screen can tell "the SDK told us something" apart from "we have
 * nothing to show" without string-matching a literal in three packages.
 */
export const IM_HARMONY_UNKNOWN_ERROR: string = 'unknown-error';

/**
 * Narrows an unknown thrown value into a displayable message.
 *
 * Never leaks a raw error object to a template: an ArkTS error string can carry
 * a stack trace that is unreadable on a phone and may expose internal hosts.
 */
export function resolveImHarmonyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message: string = error.message.trim();
    if (message.length > 0) {
      return message;
    }
  }
  const text: string = typeof error === 'string' ? error.trim() : '';
  return text.length > 0 ? text : IM_HARMONY_UNKNOWN_ERROR;
}

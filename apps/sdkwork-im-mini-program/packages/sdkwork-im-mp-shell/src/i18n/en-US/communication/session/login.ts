/**
 * Authored messages for the IM mini program session/login screen (`en-US`).
 *
 * Authority: `I18N_SPEC.md` section 6.1. Key set must stay identical to the
 * `zh-CN` fragment.
 */
export const imMpSessionLoginMessages = {
  "common.session.login_title": "Sign in",
  "common.session.login_description": "Sign in with WeChat to sync your conversations and messages.",
  "common.session.login_action": "Sign in with WeChat",
  "common.session.login_pending": "Signing in…",
  "common.session.login_failed": "Sign-in failed",
  "common.session.login_code_failed": "Could not obtain a WeChat login code. Please retry.",
  "common.session.runtime_unavailable": "The runtime is not ready, so sign-in is unavailable.",
  "common.session.logout_action": "Sign out",
} as const;

export type ImMpSessionLoginMessageKey = keyof typeof imMpSessionLoginMessages;

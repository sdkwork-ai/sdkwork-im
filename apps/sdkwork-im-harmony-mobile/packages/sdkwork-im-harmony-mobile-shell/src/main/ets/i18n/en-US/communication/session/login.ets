/**
 * Authored messages for the IM HarmonyOS session/login screen (`en-US`).
 *
 * Authority: `I18N_SPEC.md` section 6.1. The key set must stay identical to the
 * `zh-CN` fragment so a missing translation is a reviewable diff, not a runtime
 * fallback.
 */
export const imHarmonySessionLoginMessagesEnUs: Record<string, string> = {
  'common.session.login_title': 'Sign in',
  'common.session.login_description': 'Sign in to sync your conversations and messages.',
  'common.session.login_action': 'Sign in',
  'common.session.login_pending': 'Signing in…',
  'common.session.login_failed': 'Sign-in failed',
  'common.session.login_authorization_failed': 'Could not obtain a platform authorization credential. Please retry.',
  'common.session.runtime_unavailable': 'The runtime is not ready, so sign-in is unavailable.',
  'common.session.logout_action': 'Sign out',
};

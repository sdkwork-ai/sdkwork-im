/**
 * Authored state messages for the IM HarmonyOS chat capability (`en-US`).
 *
 * Authority: `I18N_SPEC.md` section 6.1. The key set must stay identical to the
 * `zh-CN` fragment so a missing translation is a reviewable diff, not a runtime
 * fallback.
 */
export const imHarmonyChatStateMessagesEnUs: Record<string, string> = {
  'chat.state.offline': 'No network connection. Check your connection and retry.',
  'chat.state.permission_denied': 'You do not have permission to view this content.',
  'chat.state.unknown_error': 'Something went wrong. Please retry.',
};

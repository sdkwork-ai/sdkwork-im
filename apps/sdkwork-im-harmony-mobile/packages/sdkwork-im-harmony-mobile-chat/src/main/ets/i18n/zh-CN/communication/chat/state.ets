/**
 * Authored state messages for the IM HarmonyOS chat capability (`zh-CN`).
 *
 * Authority: `I18N_SPEC.md` section 6.1.
 *
 * These three keys are Harmony-only and are additive to the shared chat key set.
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 11 requires the
 * offline/unavailable, permission-denied, and unknown-error states to be
 * covered, and neither state is derivable from an SDK response, so no PC/H5/mini
 * program chat key names them. Reusing `chat.*.load_failed` for a device with no
 * network would tell the user the server failed, which is a different problem
 * with a different fix.
 */
export const imHarmonyChatStateMessagesZhCn: Record<string, string> = {
  'chat.state.offline': '网络不可用，请检查网络后重试。',
  'chat.state.permission_denied': '没有访问该内容的权限。',
  'chat.state.unknown_error': '发生未知错误，请重试。',
};

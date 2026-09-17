/**
 * Authored messages for the IM HarmonyOS session/login screen (`zh-CN`).
 *
 * Authority: `I18N_SPEC.md` section 6.1. Authored copy lives under
 * `<locale>/<domain>/<capability>/<fragment>`; only the thin registry at
 * `src/main/ets/i18n/index.ets` may read this module.
 *
 * The key set is shared with the PC, H5, and mini program clients so one screen
 * keeps one key across every client architecture. `login_authorization_failed`
 * is Harmony-specific: this platform authorizes through the HarmonyOS account
 * flow, not through a mini program code exchange, so reusing the mini program's
 * code-specific key would name the wrong failure.
 */
export const imHarmonySessionLoginMessagesZhCn: Record<string, string> = {
  'common.session.login_title': '登录',
  'common.session.login_description': '登录后即可同步会话与消息。',
  'common.session.login_action': '登录',
  'common.session.login_pending': '正在登录…',
  'common.session.login_failed': '登录失败',
  'common.session.login_authorization_failed': '未获取到平台授权凭证，请重试。',
  'common.session.runtime_unavailable': '运行环境未就绪，暂时无法登录。',
  'common.session.logout_action': '退出登录',
};

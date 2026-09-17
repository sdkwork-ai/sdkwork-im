/**
 * Authored messages for the IM mini program session/login screen (`zh-CN`).
 *
 * Authority: `I18N_SPEC.md` section 6.1. The login screen belongs to the shell
 * because it must exist before any capability package is reachable, so its copy
 * lives with the shell's route contribution.
 */
export const imMpSessionLoginMessages = {
  "common.session.login_title": "登录",
  "common.session.login_description": "使用微信登录后即可同步会话与消息。",
  "common.session.login_action": "微信一键登录",
  "common.session.login_pending": "正在登录…",
  "common.session.login_failed": "登录失败",
  "common.session.login_code_failed": "未获取到微信登录凭证，请重试。",
  "common.session.runtime_unavailable": "运行环境未就绪，暂时无法登录。",
  "common.session.logout_action": "退出登录",
} as const;

export type ImMpSessionLoginMessageKey = keyof typeof imMpSessionLoginMessages;

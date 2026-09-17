/**
 * Authored messages for the IM HarmonyOS inbox (`zh-CN`).
 *
 * Authority: `I18N_SPEC.md` section 6.1. Authored copy lives under
 * `<locale>/<domain>/<capability>/<fragment>`; only the thin registry at
 * `src/main/ets/i18n/index.ets` may read this module.
 *
 * The key set is identical to the PC, H5, and mini program chat fragments, so
 * one screen keeps one key across every client architecture.
 */
export const imHarmonyChatInboxMessagesZhCn: Record<string, string> = {
  'common.tabs.chat': '消息',
  'chat.inbox.title': '消息',
  'chat.inbox.loading': '加载中…',
  'chat.inbox.empty': '暂无会话',
  'chat.inbox.load_failed': '加载失败',
  'chat.inbox.retry': '重试',
  'chat.inbox.load_more': '加载更多',
  'chat.inbox.loading_more': '正在加载…',
  'chat.inbox.no_more': '没有更多会话了',
  'chat.inbox.unread_badge': '{{count}}',
  'chat.inbox.create_group': '发起群聊',
};

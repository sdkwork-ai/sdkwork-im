/**
 * Authored messages for the IM mini program inbox (`en-US`).
 *
 * Authority: `I18N_SPEC.md` section 6.1. Key set must stay identical to the
 * `zh-CN` fragment so a missing translation is a reviewable diff, not a
 * runtime fallback.
 */
export const imMpChatInboxMessages = {
  "common.tabs.chat": "Chats",
  "chat.inbox.title": "Chats",
  "chat.inbox.loading": "Loading…",
  "chat.inbox.empty": "No conversations yet",
  "chat.inbox.load_failed": "Failed to load",
  "chat.inbox.retry": "Retry",
  "chat.inbox.load_more": "Load more",
  "chat.inbox.loading_more": "Loading…",
  "chat.inbox.no_more": "No more conversations",
  "chat.inbox.unread_badge": "{{count}}",
  "chat.inbox.create_group": "New group chat",
} as const;

export type ImMpChatInboxMessageKey = keyof typeof imMpChatInboxMessages;

/**
 * Authored messages for the IM mini program conversation thread (`en-US`).
 *
 * Authority: `I18N_SPEC.md` section 6.1.
 */
export const imMpChatConversationMessages: Record<string, string> = {
  "chat.conversation.recall": "Recall",
  "chat.conversation.edit": "Edit",
  "chat.conversation.edit_placeholder": "Enter the new text",
  "chat.conversation.action_failed": "Operation failed",
  "chat.conversation.pick_image": "Photo",
  "chat.conversation.image_send_failed": "Image send failed",
  "chat.conversation.image_load_failed": "Image unavailable",
  "chat.conversation.title": "Chat",
  "chat.conversation.loading": "Loading…",
  "chat.conversation.empty": "No messages yet",
  "chat.conversation.load_failed": "Failed to load",
  "chat.conversation.retry": "Retry",
  "chat.conversation.load_earlier": "Load earlier messages",
  "chat.conversation.no_more": "No earlier messages",
  "chat.conversation.input_placeholder": "Type a message",
  "chat.conversation.send": "Send",
  "chat.conversation.sending": "Sending…",
  "chat.conversation.send_failed": "Failed to send",
  "chat.conversation.empty_input": "Enter a message first",
  "chat.conversation.peer_typing": "Peer is typing…",
} as const;

export type ImMpChatConversationMessageKey = keyof typeof imMpChatConversationMessages;

/**
 * Authored messages for the IM mini program group-creation screen (`en-US`).
 *
 * Authority: `I18N_SPEC.md` section 6.1.
 */
export const imMpChatCreateGroupMessages = {
  "chat.create_group.title": "New group chat",
  "chat.create_group.name_label": "Group name",
  "chat.create_group.name_placeholder": "Enter a group name",
  "chat.create_group.members_label": "Members",
  "chat.create_group.members_placeholder": "Comma-separated member user ids",
  "chat.create_group.submit": "Create",
  "chat.create_group.submitting": "Creating…",
  "chat.create_group.name_required": "Enter a group name",
  "chat.create_group.failed": "Failed to create",
} as const;

export type ImMpChatCreateGroupMessageKey = keyof typeof imMpChatCreateGroupMessages;

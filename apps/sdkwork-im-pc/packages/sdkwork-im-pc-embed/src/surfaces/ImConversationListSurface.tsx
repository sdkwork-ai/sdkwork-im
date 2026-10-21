import type { ReactNode } from 'react';
import { ChatList } from '../../../sdkwork-im-pc-chat/src/components/ChatList';
import { useImChats } from './useImChats';

/** Props of the embedded conversation list. */
export interface ImConversationListSurfaceProps {
  /** Conversation the host currently shows in its conversation pane. */
  selectedConversationId?: string;
  /** Host-owned search term applied to the list. */
  searchQuery?: string;
  /** Called with the conversation id when the user selects a row. */
  onConversationSelect: (conversationId: string) => void;
}

/**
 * Render the IM conversation list for an embedding host.
 *
 * Data comes from the IM runtime's own inbox service, so the host owns only the
 * selection: it passes the selected id down and receives the new id back.
 * @param props selected conversation, search term, and the selection callback.
 * @returns the conversation list column.
 */
export function ImConversationListSurface({
  selectedConversationId,
  searchQuery = '',
  onConversationSelect,
}: ImConversationListSurfaceProps): ReactNode {
  const { chats } = useImChats();

  return (
    <ChatList
      chats={chats}
      activeChatId={selectedConversationId}
      searchQuery={searchQuery}
      onChatSelect={(chat) => { onConversationSelect(chat.id); }}
    />
  );
}

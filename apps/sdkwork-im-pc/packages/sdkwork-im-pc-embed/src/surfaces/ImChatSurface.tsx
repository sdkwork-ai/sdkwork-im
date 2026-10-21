import type { ReactNode } from 'react';
import { ChatWindow } from '../../../sdkwork-im-pc-chat/src/components/ChatWindow';
import { useImChats } from './useImChats';

/** Props of the embedded conversation pane. */
export interface ImChatSurfaceProps {
  /** Conversation to render; the host owns which one is open. */
  conversationId: string;
  /** Optional group-invite follow-up owned by the host. */
  onOpenGroupInvite?: (groupId: string) => Promise<void>;
}

/**
 * Render one IM conversation for an embedding host.
 *
 * The component resolves the conversation metadata from the IM runtime inbox
 * and renders the product's own conversation window, so message loading,
 * pagination, sending, and realtime behavior stay in the IM package.
 * @param props conversation id and the optional group-invite callback.
 * @returns the conversation window, or null while its metadata is unavailable.
 */
export function ImChatSurface({ conversationId, onOpenGroupInvite }: ImChatSurfaceProps): ReactNode {
  const { chats } = useImChats();
  const chat = chats.find((candidate) => candidate.id === conversationId);
  if (!chat) {
    return null;
  }

  return <ChatWindow chat={chat} onOpenGroupInvite={onOpenGroupInvite} />;
}

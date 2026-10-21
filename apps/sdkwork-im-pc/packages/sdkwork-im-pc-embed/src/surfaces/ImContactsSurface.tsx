import type { ReactNode } from 'react';
import type { Chat, User } from '@sdkwork/im-pc-types';
import { ContactsView } from '../../../sdkwork-im-pc-chat/src/pages/ContactsView';
import { chatService, contactService } from '../../../sdkwork-im-pc-chat/src/embed-services';

/** Props of the embedded contacts directory. */
export interface ImContactsSurfaceProps {
  /** Called with the conversation id after the user starts a direct chat. */
  onConversationOpen: (conversationId: string) => void;
  /** Optional voice or video call follow-up owned by the host. */
  onStartCall?: (type: 'voice' | 'video', user: User) => void;
  /** Optional add-friend flow owned by the host. */
  onAddFriend?: () => void;
  /** Optional capability-app selection owned by the host. */
  onAppSelect?: (appId: string) => void;
  /** Optional group open follow-up owned by the host. */
  onOpenGroup?: (group: Chat) => void;
  /** Host-owned search term applied to the directory. */
  searchQuery?: string;
  /** Reports a failed direct-chat creation to the host. */
  onError?: (error: unknown) => void;
}

/**
 * Resolve the most complete directory record for a contact before binding a
 * direct conversation. The directory entry carries the conversation binding
 * when one was established earlier.
 * @param user the contact row the user acted on.
 * @returns the user merged with the hydrated directory record, when present.
 */
async function resolveDirectChatTarget(user: User): Promise<User> {
  const hydratedUser = await contactService.getUserById(user.id).catch(() => null);
  if (hydratedUser?.conversationId) {
    return { ...user, ...hydratedUser };
  }
  const matchedContact = await contactService.listContactsPage()
    .then((page) => page.items.find((contact) => contact.id === user.id || contact.chatId === user.chatId))
    .catch(() => null);
  return { ...user, ...(hydratedUser ?? {}), ...(matchedContact ?? {}) };
}

/**
 * Render the IM contacts directory for an embedding host.
 *
 * Directory loading, grouping, friend requests, and profile details stay in the
 * IM package; the host receives only the outcome of "send message" as a
 * conversation id it can show in its own pane.
 * @param props host callbacks for conversation, calls, and follow-up flows.
 * @returns the contacts directory surface.
 */
export function ImContactsSurface({
  onConversationOpen,
  onStartCall,
  onAddFriend,
  onAppSelect,
  onOpenGroup,
  searchQuery = '',
  onError,
}: ImContactsSurfaceProps): ReactNode {
  const handleSendMessage = (user: User): void => {
    void (async () => {
      try {
        const target = await resolveDirectChatTarget(user);
        const chat = await chatService.startDirectChat(target);
        onConversationOpen(chat.id);
      } catch (error) {
        onError?.(error);
      }
    })();
  };

  return (
    <ContactsView
      onSendMessage={handleSendMessage}
      onStartCall={onStartCall}
      onAddFriend={onAddFriend}
      onAppSelect={onAppSelect}
      onOpenGroup={onOpenGroup}
      searchQuery={searchQuery}
    />
  );
}

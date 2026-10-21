import { useEffect, useState } from 'react';
import type { Chat } from '@sdkwork/im-pc-types';
// The IM application's Vite alias maps the chat package root to its `src`
// directory, so subpath exports do not resolve inside this app build; import
// the sibling app package by path instead.
import { chatService } from '../../../sdkwork-im-pc-chat/src/embed-services';

/** Live conversation snapshot shared by the embedded surfaces. */
export interface ImChatsSnapshot {
  chats: Chat[];
  loading: boolean;
  error: boolean;
}

const INITIAL_SNAPSHOT: ImChatsSnapshot = { chats: [], loading: true, error: false };

/**
 * Subscribe to the conversation inbox the IM runtime maintains.
 *
 * The subscription is owned by the calling surface: the inbox itself stays in
 * `chatService`, so several embedded surfaces can observe the same data without
 * coordinating a host store.
 * @returns the latest inbox snapshot and its load state.
 */
export function useImChats(): ImChatsSnapshot {
  const [snapshot, setSnapshot] = useState<ImChatsSnapshot>(INITIAL_SNAPSHOT);

  useEffect(() => {
    let active = true;
    const unsubscribe = chatService.subscribeChats((next) => {
      if (!active) {
        return;
      }
      setSnapshot({ chats: next, loading: false, error: false });
    });
    void chatService.getChats()
      .then((next) => {
        if (!active) {
          return;
        }
        setSnapshot({ chats: next, loading: false, error: false });
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setSnapshot((previous) => ({ ...previous, loading: false, error: true }));
      });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return snapshot;
}

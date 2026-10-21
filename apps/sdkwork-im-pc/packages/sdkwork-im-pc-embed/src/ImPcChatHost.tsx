import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ChatLayout } from '@sdkwork/im-pc-chat';

/** Props of the embedded IM chat host. */
export interface ImPcChatHostProps {
  /** Initial in-memory route; the chat surface is the root route. */
  initialPath?: string;
}

/**
 * Render the SDKWork IM PC surface for an embedding host.
 *
 * The host must call {@link configureImPcEmbedRuntime} before mounting this
 * component, and dispose that handle when it unmounts. The IM application's
 * own stylesheet stays a host import so the host controls the cascade layer it
 * lands in.
 * @param props optional initial in-memory route.
 * @returns the IM PC surface.
 */
export function ImPcChatHost({ initialPath = '/' }: ImPcChatHostProps): ReactNode {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <ChatLayout />
    </MemoryRouter>
  );
}

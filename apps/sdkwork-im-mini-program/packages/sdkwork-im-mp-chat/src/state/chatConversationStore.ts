/**
 * Conversation (message thread) state store.
 *
 * Authority: `APP_MINI_PROGRAM_UI_SPEC.md`. Same split as the inbox store: the
 * store owns data and transitions, the page owns `setData`.
 *
 * Title resolution is deliberately ordered: the inbox cache wins, then an
 * explicit fallback (the `title` query parameter), then the conversation id.
 * `ConversationSummaryView` carries no display name, so a deep-linked
 * conversation genuinely has no name to show — falling back to the id is
 * honest, whereas inventing a placeholder name is not.
 */

import {
  createImMpObservableStore,
  resolveImMpScreenStatus,
  type ImMpObservableStore,
  type ImMpScreenStatus,
} from "@sdkwork/im-mp-commons";

import {
  prependImMpChatMessages,
  type ImMpChatConversationService,
} from "../services/chatConversationService";
import type {
  ImMpChatConversationSummary,
  ImMpChatMessageItem,
} from "../types/chatTypes";
import { resolveImMpErrorMessage } from "./chatInboxStore";

export interface ImMpChatConversationState {
  readonly status: ImMpScreenStatus;
  readonly conversationId: string;
  readonly title: string;
  readonly summary?: ImMpChatConversationSummary;
  readonly messages: ImMpChatMessageItem[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
  /** int64-as-string per the wire contract. */
  readonly highWatermark?: string;
  readonly loadingEarlier: boolean;
  readonly sending: boolean;
  readonly errorMessage?: string;
}

export const initialImMpChatConversationState: ImMpChatConversationState = {
  status: "loading",
  conversationId: "",
  title: "",
  messages: [],
  hasMore: false,
  loadingEarlier: false,
  sending: false,
};

export interface ImMpChatConversationStore
  extends ImMpObservableStore<ImMpChatConversationState> {
  /**
   * Loads the thread. `fallbackTitle` is the caller's best guess (usually the
   * `title` query parameter); it is ignored when a title is already resolved.
   */
  load(input: { conversationId: string; fallbackTitle?: string }): Promise<void>;
  /** Prepends older messages; no-op when exhausted or busy. */
  loadEarlier(): Promise<void>;
  /** Sends a text message and appends the echoed result optimistically. */
  sendText(text: string): Promise<void>;
  reset(): void;
}

export function createImMpChatConversationStore(
  service: ImMpChatConversationService,
  resolveCachedTitle?: (conversationId: string) => string | undefined,
): ImMpChatConversationStore {
  const store = createImMpObservableStore<ImMpChatConversationState>(
    initialImMpChatConversationState,
  );

  const resolveTitle = (conversationId: string, fallback?: string): string =>
    resolveCachedTitle?.(conversationId) ?? fallback?.trim() ?? conversationId;

  return {
    ...store,

    async load(input): Promise<void> {
      const conversationId = input.conversationId.trim();
      if (!conversationId) {
        throw new Error("A conversation id is required.");
      }
      store.replaceState({
        ...initialImMpChatConversationState,
        conversationId,
        title: resolveTitle(conversationId, input.fallbackTitle),
      });
      try {
        const [summary, page] = await Promise.all([
          service.loadSummary(conversationId),
          service.listMessages(conversationId),
        ]);
        store.replaceState({
          status: resolveImMpScreenStatus(page.items.length, false),
          conversationId,
          title: resolveTitle(conversationId, input.fallbackTitle),
          summary,
          messages: page.items,
          hasMore: page.hasMore,
          ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
          highWatermark: page.highWatermark,
          loadingEarlier: false,
          sending: false,
        });
      } catch (error) {
        store.replaceState({
          status: "error",
          conversationId,
          title: resolveTitle(conversationId, input.fallbackTitle),
          messages: [],
          hasMore: false,
          loadingEarlier: false,
          sending: false,
          errorMessage: resolveImMpErrorMessage(error),
        });
      }
    },

    async loadEarlier(): Promise<void> {
      const state = store.getState();
      if (state.loadingEarlier || !state.hasMore || !state.nextCursor) {
        return;
      }
      store.setState({ loadingEarlier: true });
      try {
        const page = await service.listMessages(state.conversationId, {
          cursor: state.nextCursor,
        });
        const messages = prependImMpChatMessages(state.messages, page.items);
        store.replaceState({
          ...state,
          status: resolveImMpScreenStatus(messages.length, false),
          messages,
          hasMore: page.hasMore,
          ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
          highWatermark: page.highWatermark,
          loadingEarlier: false,
        });
      } catch (error) {
        store.setState({
          loadingEarlier: false,
          errorMessage: resolveImMpErrorMessage(error),
        });
      }
    },

    async sendText(text: string): Promise<void> {
      const body = text.trim();
      if (!body) {
        return;
      }
      const state = store.getState();
      store.setState({ sending: true });
      try {
        const result = await service.sendText(state.conversationId, body);
        const current = store.getState();
        const alreadyPresent = current.messages.some(
          (message) => message.messageId === result.messageId,
        );
        store.replaceState({
          ...current,
          sending: false,
          messages: alreadyPresent
            ? current.messages
            : [
                ...current.messages,
                {
                  messageId: result.messageId,
                  senderId: "",
                  text: body,
                  occurredAt: new Date().toISOString(),
                  messageSeq: result.messageSeq,
                },
              ],
        });
      } catch (error) {
        store.setState({ sending: false, errorMessage: resolveImMpErrorMessage(error) });
        throw error;
      }
    },

    reset(): void {
      store.replaceState(initialImMpChatConversationState);
    },
  };
}

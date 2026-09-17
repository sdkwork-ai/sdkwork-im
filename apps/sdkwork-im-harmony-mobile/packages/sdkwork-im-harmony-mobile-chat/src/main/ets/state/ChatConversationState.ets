/**
 * Conversation state store.
 *
 * Same shape as the inbox store, plus a `sending` flag: the composer must not
 * admit a second send while the first is in flight, and the flag is the only
 * thing that can express that.
 */
import {
  isImHarmonyRetryableStatus,
  resolveImHarmonyErrorMessage,
  resolveImHarmonyScreenStatus,
  type ImHarmonyScreenStatus,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import {
  mergeImHarmonyChatMessagePages,
  type ImHarmonyChatConversationService,
} from '../services/ChatConversationService';
import type {
  ImHarmonyChatConversationSummary,
  ImHarmonyChatMessageItem,
} from '../models/ChatModels';
import { createImHarmonyObservableStore, type ImHarmonyObservableStore } from './ObservableStore';

export interface ImHarmonyChatConversationState {
  readonly conversationId: string;
  readonly status: ImHarmonyScreenStatus;
  readonly summary?: ImHarmonyChatConversationSummary;
  readonly items: ImHarmonyChatMessageItem[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
  readonly loadingOlder: boolean;
  readonly sending: boolean;
  readonly errorMessage?: string;
  readonly retryable: boolean;
}

export function createInitialImHarmonyChatConversationState(
  conversationId: string,
): ImHarmonyChatConversationState {
  return {
    conversationId,
    status: 'loading',
    items: [],
    hasMore: false,
    loadingOlder: false,
    sending: false,
    retryable: false,
  };
}

export interface ImHarmonyChatConversationStore
  extends ImHarmonyObservableStore<ImHarmonyChatConversationState> {
  /** Loads the summary and the first message page. */
  open(): Promise<void>;
  /** Prepends the older message page. */
  loadOlder(): Promise<void>;
  /** Sends a text message and reloads on success. */
  send(text: string): Promise<boolean>;
  reset(): void;
}

export function createImHarmonyChatConversationStore(
  conversationId: string,
  service: ImHarmonyChatConversationService,
): ImHarmonyChatConversationStore {
  const store = createImHarmonyObservableStore<ImHarmonyChatConversationState>(
    createInitialImHarmonyChatConversationState(conversationId),
  );

  return {
    getState: store.getState,
    replaceState: store.replaceState,
    subscribe: store.subscribe,

    async open(): Promise<void> {
      const state: ImHarmonyChatConversationState = store.getState();
      store.replaceState({
        conversationId: state.conversationId,
        status: 'loading',
        items: [],
        hasMore: false,
        loadingOlder: false,
        sending: false,
        retryable: false,
      });
      try {
        const summary: ImHarmonyChatConversationSummary = await service.readSummary(conversationId);
        const page = await service.listMessages(conversationId);
        const status: ImHarmonyScreenStatus = resolveImHarmonyScreenStatus(page.items.length, false);
        store.replaceState({
          conversationId,
          status,
          summary,
          items: page.items,
          hasMore: page.hasMore,
          nextCursor: page.nextCursor,
          loadingOlder: false,
          sending: false,
          retryable: isImHarmonyRetryableStatus(status),
        });
      } catch (error) {
        const status: ImHarmonyScreenStatus = resolveImHarmonyScreenStatus(0, true);
        store.replaceState({
          conversationId,
          status,
          items: [],
          hasMore: false,
          loadingOlder: false,
          sending: false,
          errorMessage: resolveImHarmonyErrorMessage(error),
          retryable: isImHarmonyRetryableStatus(status),
        });
      }
    },

    async loadOlder(): Promise<void> {
      const state: ImHarmonyChatConversationState = store.getState();
      if (state.loadingOlder || !state.hasMore || state.nextCursor === undefined) {
        return;
      }
      store.replaceState({
        conversationId: state.conversationId,
        status: state.status,
        summary: state.summary,
        items: state.items,
        hasMore: state.hasMore,
        nextCursor: state.nextCursor,
        loadingOlder: true,
        sending: state.sending,
        retryable: state.retryable,
      });
      try {
        const page = await service.listMessages(conversationId, { cursor: state.nextCursor });
        const items: ImHarmonyChatMessageItem[] = mergeImHarmonyChatMessagePages(
          page.items,
          state.items,
        );
        store.replaceState({
          conversationId: state.conversationId,
          status: resolveImHarmonyScreenStatus(items.length, false),
          summary: state.summary,
          items,
          hasMore: page.hasMore,
          nextCursor: page.nextCursor,
          loadingOlder: false,
          sending: state.sending,
          retryable: false,
        });
      } catch (error) {
        // Keep the rendered history; a failed history page must not blank the
        // thread the user is reading.
        store.replaceState({
          conversationId: state.conversationId,
          status: state.status,
          summary: state.summary,
          items: state.items,
          hasMore: state.hasMore,
          nextCursor: state.nextCursor,
          loadingOlder: false,
          sending: state.sending,
          errorMessage: resolveImHarmonyErrorMessage(error),
          retryable: true,
        });
      }
    },

    async send(text: string): Promise<boolean> {
      const state: ImHarmonyChatConversationState = store.getState();
      if (state.sending) {
        return false;
      }
      store.replaceState({
        conversationId: state.conversationId,
        status: state.status,
        summary: state.summary,
        items: state.items,
        hasMore: state.hasMore,
        nextCursor: state.nextCursor,
        loadingOlder: state.loadingOlder,
        sending: true,
        retryable: state.retryable,
      });
      try {
        await service.sendText(conversationId, text);
        const page = await service.listMessages(conversationId);
        store.replaceState({
          conversationId: state.conversationId,
          status: resolveImHarmonyScreenStatus(page.items.length, false),
          summary: state.summary,
          items: page.items,
          hasMore: page.hasMore,
          nextCursor: page.nextCursor,
          loadingOlder: false,
          sending: false,
          retryable: false,
        });
        return true;
      } catch (error) {
        store.replaceState({
          conversationId: state.conversationId,
          status: state.status,
          summary: state.summary,
          items: state.items,
          hasMore: state.hasMore,
          nextCursor: state.nextCursor,
          loadingOlder: false,
          sending: false,
          errorMessage: resolveImHarmonyErrorMessage(error),
          retryable: true,
        });
        return false;
      }
    },

    reset(): void {
      store.replaceState(createInitialImHarmonyChatConversationState(conversationId));
    },
  };
}

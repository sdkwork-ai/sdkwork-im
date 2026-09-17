/**
 * Inbox state store.
 *
 * The page subscribes and forwards a projection into ArkUI `@State`; the store
 * owns the data, the page owns rendering. That is what keeps the inbox's
 * loading/error/pagination rules testable without a HarmonyOS runtime.
 */
import {
  isImHarmonyRetryableStatus,
  resolveImHarmonyErrorMessage,
  resolveImHarmonyScreenStatus,
  type ImHarmonyScreenStatus,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import {
  mergeImHarmonyChatInboxPages,
  type ImHarmonyChatInboxService,
} from '../services/ChatInboxService';
import type { ImHarmonyChatInboxItem } from '../models/ChatModels';
import { createImHarmonyObservableStore, type ImHarmonyObservableStore } from './ObservableStore';

export interface ImHarmonyChatInboxState {
  readonly status: ImHarmonyScreenStatus;
  readonly items: ImHarmonyChatInboxItem[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
  readonly loadingMore: boolean;
  readonly errorMessage?: string;
  readonly retryable: boolean;
}

export const initialImHarmonyChatInboxState: ImHarmonyChatInboxState = {
  status: 'loading',
  items: [],
  hasMore: false,
  loadingMore: false,
  retryable: false,
};

export interface ImHarmonyChatInboxStore
  extends ImHarmonyObservableStore<ImHarmonyChatInboxState> {
  /** Replaces the list with a fresh first page. */
  refresh(options?: { readonly q?: string }): Promise<void>;
  /** Appends the next page; no-op when the list is exhausted or busy. */
  loadMore(): Promise<void>;
  /** Clears the list, e.g. on logout. */
  reset(): void;
}

export function createImHarmonyChatInboxStore(
  service: ImHarmonyChatInboxService,
): ImHarmonyChatInboxStore {
  const store = createImHarmonyObservableStore<ImHarmonyChatInboxState>(
    initialImHarmonyChatInboxState,
  );

  return {
    getState: store.getState,
    replaceState: store.replaceState,
    subscribe: store.subscribe,

    async refresh(options = {}): Promise<void> {
      store.replaceState({
        status: 'loading',
        items: [],
        hasMore: false,
        loadingMore: false,
        retryable: false,
      });
      try {
        const page = await service.listPage({ q: options.q });
        const status: ImHarmonyScreenStatus = resolveImHarmonyScreenStatus(page.items.length, false);
        store.replaceState({
          status,
          items: page.items,
          hasMore: page.hasMore,
          nextCursor: page.nextCursor,
          loadingMore: false,
          retryable: isImHarmonyRetryableStatus(status),
        });
      } catch (error) {
        const status: ImHarmonyScreenStatus = resolveImHarmonyScreenStatus(0, true);
        store.replaceState({
          status,
          items: [],
          hasMore: false,
          loadingMore: false,
          errorMessage: resolveImHarmonyErrorMessage(error),
          retryable: isImHarmonyRetryableStatus(status),
        });
      }
    },

    async loadMore(): Promise<void> {
      const state: ImHarmonyChatInboxState = store.getState();
      if (state.loadingMore || !state.hasMore || state.nextCursor === undefined) {
        return;
      }
      store.replaceState({
        status: state.status,
        items: state.items,
        hasMore: state.hasMore,
        nextCursor: state.nextCursor,
        loadingMore: true,
        retryable: state.retryable,
      });
      try {
        const page = await service.listPage({ cursor: state.nextCursor });
        const items: ImHarmonyChatInboxItem[] = mergeImHarmonyChatInboxPages(state.items, page.items);
        const status: ImHarmonyScreenStatus = resolveImHarmonyScreenStatus(items.length, false);
        store.replaceState({
          status,
          items,
          hasMore: page.hasMore,
          nextCursor: page.nextCursor,
          loadingMore: false,
          retryable: isImHarmonyRetryableStatus(status),
        });
      } catch (error) {
        // A failed "load more" must keep the already-rendered rows: replacing
        // them with an error screen loses the user's reading position.
        store.replaceState({
          status: state.status,
          items: state.items,
          hasMore: state.hasMore,
          nextCursor: state.nextCursor,
          loadingMore: false,
          errorMessage: resolveImHarmonyErrorMessage(error),
          retryable: true,
        });
      }
    },

    reset(): void {
      store.replaceState(initialImHarmonyChatInboxState);
    },
  };
}

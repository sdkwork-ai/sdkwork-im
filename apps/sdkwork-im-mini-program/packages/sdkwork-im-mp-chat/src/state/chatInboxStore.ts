/**
 * Inbox state store.
 *
 * Authority: `APP_MINI_PROGRAM_UI_SPEC.md`. The page subscribes and forwards a
 * projection into `setData`; the store owns the data, the page owns rendering.
 * That is what keeps the inbox's loading/error/pagination rules testable
 * without a WeChat runtime.
 */

import {
  createImMpObservableStore,
  resolveImMpScreenStatus,
  type ImMpObservableStore,
  type ImMpScreenStatus,
} from "@sdkwork/im-mp-commons";

import { mergeImMpChatInboxPages, type ImMpChatInboxService } from "../services/chatInboxService";
import type { ImMpChatInboxItem } from "../types/chatTypes";

export interface ImMpChatInboxState {
  readonly status: ImMpScreenStatus;
  readonly items: ImMpChatInboxItem[];
  readonly hasMore: boolean;
  readonly nextCursor?: string;
  readonly loadingMore: boolean;
  readonly errorMessage?: string;
}

export const initialImMpChatInboxState: ImMpChatInboxState = {
  status: "loading",
  items: [],
  hasMore: false,
  loadingMore: false,
};

export interface ImMpChatInboxStore
  extends ImMpObservableStore<ImMpChatInboxState> {
  /** Replaces the list with a fresh first page. */
  refresh(options?: { q?: string }): Promise<void>;
  /** Appends the next page; no-op when the list is exhausted or busy. */
  loadMore(): Promise<void>;
  /** Clears the list, e.g. on logout. */
  reset(): void;
}

export function createImMpChatInboxStore(
  service: ImMpChatInboxService,
): ImMpChatInboxStore {
  const store = createImMpObservableStore<ImMpChatInboxState>(initialImMpChatInboxState);

  return {
    ...store,

    async refresh(options = {}): Promise<void> {
      store.setState({ status: "loading", errorMessage: undefined });
      try {
        const page = await service.listPage({ q: options.q });
        store.replaceState({
          status: resolveImMpScreenStatus(page.items.length, false),
          items: page.items,
          hasMore: page.hasMore,
          ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
          loadingMore: false,
        });
      } catch (error) {
        store.replaceState({
          status: "error",
          items: [],
          hasMore: false,
          loadingMore: false,
          errorMessage: resolveImMpErrorMessage(error),
        });
      }
    },

    async loadMore(): Promise<void> {
      const state = store.getState();
      if (state.loadingMore || !state.hasMore || !state.nextCursor) {
        return;
      }
      store.setState({ loadingMore: true });
      try {
        const page = await service.listPage({ cursor: state.nextCursor });
        const items = mergeImMpChatInboxPages(state.items, page.items);
        store.replaceState({
          status: resolveImMpScreenStatus(items.length, false),
          items,
          hasMore: page.hasMore,
          ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
          loadingMore: false,
        });
      } catch (error) {
        // A failed "load more" must keep the already-rendered rows: replacing
        // them with an error screen loses the user's reading position.
        store.setState({ loadingMore: false, errorMessage: resolveImMpErrorMessage(error) });
      }
    },

    reset(): void {
      store.replaceState(initialImMpChatInboxState);
    },
  };
}

/** Narrow error-to-message projection; never leaks a raw error object to a template. */
export function resolveImMpErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  const text = typeof error === "string" ? error.trim() : "";
  return text || "unknown-error";
}

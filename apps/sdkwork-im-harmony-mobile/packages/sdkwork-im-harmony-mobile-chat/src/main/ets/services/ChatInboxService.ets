/**
 * Inbox (conversation list) read service.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 4 and
 * `PAGINATION_SPEC.md`. Cursor pagination only; the page-merge rule lives here so
 * the inbox page never re-implements "append without duplicating".
 *
 * The SDK client is injected as a resolver. This module never constructs a client
 * and never issues a raw request — the injected generated port is the only
 * sanctioned surface.
 */
import {
  resolveImHarmonyPageSize,
  toImHarmonyChatInboxItem,
  type ImHarmonyChatClientResolver,
  type ImHarmonyChatInboxItem,
  type ImHarmonyChatPage,
  type ImHarmonyInboxEntryPort,
  type ImHarmonyInboxListParams,
} from '../models/ChatModels';
import { assertImHarmonyCursorPage } from '../models/Pagination';

export interface ImHarmonyChatInboxListOptions {
  readonly cursor?: string;
  readonly q?: string;
  readonly pageSize?: number;
}

export interface ImHarmonyChatInboxService {
  /** Reads one page. Never mutates; the caller decides how to merge. */
  listPage(options?: ImHarmonyChatInboxListOptions): Promise<ImHarmonyChatPage<ImHarmonyChatInboxItem>>;
  /**
   * Loads the next page and merges it into the supplied page.
   *
   * Returns the same page object when there is nothing more to load, so the
   * caller can compare identity and skip a redundant re-render.
   */
  loadMore(
    current: ImHarmonyChatPage<ImHarmonyChatInboxItem>,
  ): Promise<ImHarmonyChatPage<ImHarmonyChatInboxItem>>;
}

export function createImHarmonyChatInboxService(
  resolveClient: ImHarmonyChatClientResolver,
): ImHarmonyChatInboxService {
  const listPage = async (
    options: ImHarmonyChatInboxListOptions = {},
  ): Promise<ImHarmonyChatPage<ImHarmonyChatInboxItem>> => {
    const q: string | undefined = options.q?.trim();
    const params: ImHarmonyInboxListParams = {
      pageSize: resolveImHarmonyPageSize(options.pageSize),
    };
    if (options.cursor !== undefined && options.cursor.length > 0) {
      params.cursor = options.cursor;
    }
    if (q !== undefined && q.length > 0) {
      params.q = q;
    }
    const page = await resolveClient().listInbox(params);
    assertImHarmonyCursorPage(page.pageInfo, 'IM inbox');
    const result: ImHarmonyChatPage<ImHarmonyChatInboxItem> = {
      items: page.items.map((entry: ImHarmonyInboxEntryPort) => toImHarmonyChatInboxItem(entry)),
      hasMore: page.pageInfo.hasMore === true,
      nextCursor: page.pageInfo.nextCursor,
    };
    return result;
  };

  return {
    listPage,
    async loadMore(
      current: ImHarmonyChatPage<ImHarmonyChatInboxItem>,
    ): Promise<ImHarmonyChatPage<ImHarmonyChatInboxItem>> {
      if (!current.hasMore || current.nextCursor === undefined) {
        return current;
      }
      const next = await listPage({ cursor: current.nextCursor });
      const merged: ImHarmonyChatPage<ImHarmonyChatInboxItem> = {
        items: mergeImHarmonyChatInboxPages(current.items, next.items),
        hasMore: next.hasMore,
        nextCursor: next.nextCursor,
      };
      return merged;
    },
  };
}

/**
 * Appends `incoming` rows to `existing`, dropping rows already present.
 *
 * A message arriving between two page reads shifts the cursor window, so the same
 * conversation can be returned twice. De-duplicating by conversation id keeps the
 * rendered list stable.
 */
export function mergeImHarmonyChatInboxPages(
  existing: ImHarmonyChatInboxItem[],
  incoming: ImHarmonyChatInboxItem[],
): ImHarmonyChatInboxItem[] {
  const seen: Set<string> = new Set<string>();
  for (const item of existing) {
    seen.add(item.conversationId);
  }
  const merged: ImHarmonyChatInboxItem[] = existing.slice();
  for (const item of incoming) {
    if (seen.has(item.conversationId)) {
      continue;
    }
    seen.add(item.conversationId);
    merged.push(item);
  }
  return merged;
}

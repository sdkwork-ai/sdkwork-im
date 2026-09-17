/**
 * Inbox (conversation list) read service.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and
 * `PAGINATION_SPEC.md`. Cursor pagination only; the page-merge rule lives here
 * so the inbox page never re-implements "append without duplicating".
 *
 * The SDK client is injected as a resolver. This module never constructs a
 * client and never issues a raw request — the generated IM SDK is the only
 * sanctioned surface.
 */

import {
  assertImMpCursorPage,
  resolveImMpPageSize,
  toImMpChatInboxItem,
  type ImMpChatClientResolver,
  type ImMpChatInboxItem,
  type ImMpChatPage,
} from "../types/chatTypes";

export interface ImMpChatInboxListOptions {
  readonly cursor?: string;
  readonly q?: string;
  readonly conversationType?: string;
  readonly pageSize?: number;
}

export interface ImMpChatInboxService {
  /** Reads one page. Never mutates; the caller decides how to merge. */
  listPage(options?: ImMpChatInboxListOptions): Promise<ImMpChatPage<ImMpChatInboxItem>>;
  /**
   * Loads the next page and merges it into the supplied page.
   *
   * Returns the same page object when there is nothing more to load, so the
   * caller can compare identity and skip a `setData` round trip.
   */
  loadMore(current: ImMpChatPage<ImMpChatInboxItem>): Promise<ImMpChatPage<ImMpChatInboxItem>>;
}

export function createImMpChatInboxService(
  resolveClient: ImMpChatClientResolver,
): ImMpChatInboxService {
  const listPage = async (
    options: ImMpChatInboxListOptions = {},
  ): Promise<ImMpChatPage<ImMpChatInboxItem>> => {
    const q = options.q?.trim();
    const page = await resolveClient().conversations.list({
      pageSize: resolveImMpPageSize(options.pageSize),
      ...(options.cursor ? { cursor: options.cursor } : {}),
      ...(q ? { q } : {}),
      ...(options.conversationType ? { conversationType: options.conversationType } : {}),
    });
    assertImMpCursorPage(page.pageInfo, "IM inbox");
    return {
      items: page.items.map(toImMpChatInboxItem),
      hasMore: page.pageInfo.hasMore === true,
      ...(page.pageInfo.nextCursor ? { nextCursor: page.pageInfo.nextCursor } : {}),
    };
  };

  return {
    listPage,
    async loadMore(
      current: ImMpChatPage<ImMpChatInboxItem>,
    ): Promise<ImMpChatPage<ImMpChatInboxItem>> {
      if (!current.hasMore || !current.nextCursor) {
        return current;
      }
      const next = await listPage({ cursor: current.nextCursor });
      return {
        items: mergeImMpChatInboxPages(current.items, next.items),
        hasMore: next.hasMore,
        ...(next.nextCursor ? { nextCursor: next.nextCursor } : {}),
      };
    },
  };
}

/**
 * Appends `incoming` rows to `existing`, dropping rows already present.
 *
 * A message arriving between two page reads shifts the cursor window, so the
 * same conversation can be returned twice. De-duplicating by conversation id
 * keeps the rendered list stable.
 */
export function mergeImMpChatInboxPages(
  existing: ImMpChatInboxItem[],
  incoming: ImMpChatInboxItem[],
): ImMpChatInboxItem[] {
  const seen = new Set(existing.map((item) => item.conversationId));
  const merged = [...existing];
  for (const item of incoming) {
    if (seen.has(item.conversationId)) {
      continue;
    }
    seen.add(item.conversationId);
    merged.push(item);
  }
  return merged;
}

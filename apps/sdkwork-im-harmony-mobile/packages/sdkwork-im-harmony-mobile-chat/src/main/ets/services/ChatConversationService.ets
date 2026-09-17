/**
 * Conversation (thread) read/write service.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 4 and
 * `PAGINATION_SPEC.md`. The SDK client is injected as a resolver; this module
 * never constructs a client and never issues a raw request.
 */
import {
  resolveImHarmonyPageSize,
  toImHarmonyChatConversationSummary,
  toImHarmonyChatMessageItem,
  type ImHarmonyChatClientResolver,
  type ImHarmonyChatConversationSummary,
  type ImHarmonyChatMessageItem,
  type ImHarmonyChatPage,
  type ImHarmonyCreateConversationRequest,
  type ImHarmonyCreateConversationResult,
  type ImHarmonyCurrentUserIdResolver,
  type ImHarmonyMessageEntryPort,
  type ImHarmonyMessageListParams,
} from '../models/ChatModels';
import { assertImHarmonyCursorPage } from '../models/Pagination';

export interface ImHarmonyChatConversationService {
  /** Reads the header summary for one conversation. */
  readSummary(conversationId: string): Promise<ImHarmonyChatConversationSummary>;
  /** Reads one message page, oldest-to-newest as the wire returns it. */
  listMessages(
    conversationId: string,
    options?: { readonly cursor?: string; readonly pageSize?: number },
  ): Promise<ImHarmonyChatPage<ImHarmonyChatMessageItem>>;
  /**
   * Loads the older message page and prepends it.
   *
   * Chat history pages backwards: the merge must prepend, and de-duplicate,
   * otherwise scrolling up duplicates the boundary message.
   */
  loadOlder(
    conversationId: string,
    current: ImHarmonyChatPage<ImHarmonyChatMessageItem>,
  ): Promise<ImHarmonyChatPage<ImHarmonyChatMessageItem>>;
  /** Sends a text message and returns the stored result. */
  sendText(conversationId: string, text: string): Promise<void>;
  /** Creates a conversation and returns its id. */
  createConversation(
    request: ImHarmonyCreateConversationRequest,
  ): Promise<ImHarmonyCreateConversationResult>;
}

export function createImHarmonyChatConversationService(
  resolveClient: ImHarmonyChatClientResolver,
  resolveCurrentUserId: ImHarmonyCurrentUserIdResolver,
): ImHarmonyChatConversationService {
  const listMessages = async (
    conversationId: string,
    options: { readonly cursor?: string; readonly pageSize?: number } = {},
  ): Promise<ImHarmonyChatPage<ImHarmonyChatMessageItem>> => {
    const params: ImHarmonyMessageListParams = {
      pageSize: resolveImHarmonyPageSize(options.pageSize),
    };
    if (options.cursor !== undefined && options.cursor.length > 0) {
      params.cursor = options.cursor;
    }
    const page = await resolveClient().listMessages(conversationId, params);
    assertImHarmonyCursorPage(page.pageInfo, 'IM conversation messages');
    const currentUserId: string | undefined = resolveCurrentUserId();
    const result: ImHarmonyChatPage<ImHarmonyChatMessageItem> = {
      items: page.items.map(
        (entry: ImHarmonyMessageEntryPort) => toImHarmonyChatMessageItem(entry, currentUserId),
      ),
      hasMore: page.pageInfo.hasMore === true,
      nextCursor: page.pageInfo.nextCursor,
    };
    return result;
  };

  return {
    async readSummary(conversationId: string): Promise<ImHarmonyChatConversationSummary> {
      if (conversationId.trim().length === 0) {
        throw new Error('conversationId is required to read a conversation summary');
      }
      const summary = await resolveClient().getSummary(conversationId);
      return toImHarmonyChatConversationSummary(summary);
    },

    listMessages,

    async loadOlder(
      conversationId: string,
      current: ImHarmonyChatPage<ImHarmonyChatMessageItem>,
    ): Promise<ImHarmonyChatPage<ImHarmonyChatMessageItem>> {
      if (!current.hasMore || current.nextCursor === undefined) {
        return current;
      }
      const older = await listMessages(conversationId, { cursor: current.nextCursor });
      const result: ImHarmonyChatPage<ImHarmonyChatMessageItem> = {
        items: mergeImHarmonyChatMessagePages(older.items, current.items),
        hasMore: older.hasMore,
        nextCursor: older.nextCursor,
      };
      return result;
    },

    async sendText(conversationId: string, text: string): Promise<void> {
      const body: string = text.trim();
      if (body.length === 0) {
        throw new Error('a message body is required');
      }
      await resolveClient().postText(conversationId, body);
    },

    async createConversation(
      request: ImHarmonyCreateConversationRequest,
    ): Promise<ImHarmonyCreateConversationResult> {
      if (request.memberIds.length === 0) {
        throw new Error('at least one member is required to create a conversation');
      }
      return resolveClient().createConversation(request);
    },
  };
}

/**
 * Prepends `older` rows to `newer`, dropping overlapping rows.
 *
 * The page boundary can shift while a user scrolls, so the same message can
 * arrive in two pages. De-duplicating by message id keeps the rendered list
 * stable.
 */
export function mergeImHarmonyChatMessagePages(
  older: ImHarmonyChatMessageItem[],
  newer: ImHarmonyChatMessageItem[],
): ImHarmonyChatMessageItem[] {
  const seen: Set<string> = new Set<string>();
  for (const item of newer) {
    seen.add(item.messageId);
  }
  const prepended: ImHarmonyChatMessageItem[] = [];
  for (const item of older) {
    if (seen.has(item.messageId)) {
      continue;
    }
    seen.add(item.messageId);
    prepended.push(item);
  }
  return prepended.concat(newer);
}

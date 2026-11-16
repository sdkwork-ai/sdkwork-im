/**
 * Notification-centre read service.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and
 * `PAGINATION_SPEC.md`. Cursor pagination only, same contract as the inbox: the
 * page never re-implements "append without duplicating", and a page that claims
 * `hasMore` without a `nextCursor` is a hard failure instead of a spinner that
 * never stops.
 *
 * The client is injected as a resolver; this module constructs none and never
 * issues a raw request. The generated `@sdkwork/im-app-sdk` client satisfies
 * `ImMpNotificationsPort` structurally.
 */

export interface ImMpNotificationQuery {
  readonly cursor?: string;
  readonly pageSize?: number;
}

/** Structural slice of the generated IM app SDK used by the notice centre. */
export interface ImMpNotificationsPort {
  notifications: {
    list(params?: ImMpNotificationQuery): Promise<unknown>;
    retrieve(notificationId: string): Promise<unknown>;
  };
}

/** Resolver injected by the root bootstrap; throws before bootstrap runs. */
export type ImMpNotificationsClientResolver = () => ImMpNotificationsPort;

/** One projected notice row. */
export interface ImMpNotificationItem {
  readonly body: string;
  readonly category: string;
  readonly notificationId: string;
  readonly requestedAt: string;
  readonly status: string;
  readonly title: string;
}

export interface ImMpNotificationPage {
  readonly hasMore: boolean;
  readonly items: ImMpNotificationItem[];
  readonly nextCursor?: string;
}

export interface ImMpNotificationsService {
  /** Reads one page. Never mutates; the caller decides how to merge. */
  listPage(options?: ImMpNotificationQuery): Promise<ImMpNotificationPage>;
  /** Loads the next page and merges it, de-duplicating by notification id. */
  loadMore(current: ImMpNotificationPage): Promise<ImMpNotificationPage>;
  /** Reads one notice body; `null` when the server returns nothing usable. */
  retrieve(notificationId: string): Promise<ImMpNotificationItem | null>;
}

function readRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(record: Record<string, unknown>, keys: readonly string[], fallback = ""): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value) {
      return value;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return fallback;
}

function readRows(payload: unknown): Record<string, unknown>[] {
  const record = readRecord(payload);
  const rows = record.items ?? record.content;
  return Array.isArray(rows)
    ? rows.filter((entry): entry is Record<string, unknown> => (
        entry !== null && typeof entry === "object" && !Array.isArray(entry)
      ))
    : [];
}

/**
 * Projects one wire record onto the notice view.
 *
 * @param record - A notice record from the generated IM app SDK.
 */
export function toImMpNotificationItem(record: Record<string, unknown>): ImMpNotificationItem {
  return {
    notificationId: readString(record, ["notificationId", "notification_id", "id"]),
    category: readString(record, ["category"], "system"),
    title: readString(record, ["title"], "消息通知"),
    body: readString(record, ["body", "content"]),
    status: readString(record, ["status"], "unread"),
    requestedAt: readString(record, ["requestedAt", "requested_at", "createdAt", "created_at"]),
  };
}

function readPageInfo(payload: unknown): { hasMore: boolean; nextCursor: string } {
  const pageInfo = readRecord(readRecord(payload).pageInfo);
  const nextCursor = readString(pageInfo, ["nextCursor", "next_cursor"]);
  const hasMore = pageInfo.hasMore === true || Boolean(nextCursor);
  return { hasMore, nextCursor };
}

export function createImMpNotificationsService(
  resolveClient: ImMpNotificationsClientResolver,
): ImMpNotificationsService {
  const listPage = async (options: ImMpNotificationQuery = {}): Promise<ImMpNotificationPage> => {
    const payload = await resolveClient().notifications.list({
      ...(options.pageSize ? { pageSize: options.pageSize } : {}),
      ...(options.cursor ? { cursor: options.cursor } : {}),
    });
    const pageInfo = readPageInfo(payload);
    if (pageInfo.hasMore && !pageInfo.nextCursor) {
      throw new Error("IM notifications returned hasMore without nextCursor.");
    }
    return {
      items: readRows(payload).map(toImMpNotificationItem),
      hasMore: pageInfo.hasMore,
      ...(pageInfo.nextCursor ? { nextCursor: pageInfo.nextCursor } : {}),
    };
  };

  return {
    listPage,
    async loadMore(current) {
      if (!current.hasMore || !current.nextCursor) {
        return current;
      }
      const next = await listPage({ cursor: current.nextCursor });
      return {
        items: mergeImMpNotificationPages(current.items, next.items),
        hasMore: next.hasMore,
        ...(next.nextCursor ? { nextCursor: next.nextCursor } : {}),
      };
    },
    async retrieve(notificationId) {
      const payload = await resolveClient().notifications.retrieve(notificationId);
      const record = readRecord(readRecord(payload).item ?? payload);
      return readString(record, ["notificationId", "notification_id", "id"])
        ? toImMpNotificationItem(record)
        : null;
    },
  };
}

/**
 * Appends `incoming` rows to `existing`, dropping rows already present.
 *
 * A notice arriving between two page reads shifts the cursor window, so the same
 * notification can be returned twice.
 */
export function mergeImMpNotificationPages(
  existing: ImMpNotificationItem[],
  incoming: ImMpNotificationItem[],
): ImMpNotificationItem[] {
  const seen = new Set(existing.map((item) => item.notificationId));
  const merged = [...existing];
  for (const item of incoming) {
    if (seen.has(item.notificationId)) {
      continue;
    }
    seen.add(item.notificationId);
    merged.push(item);
  }
  return merged;
}

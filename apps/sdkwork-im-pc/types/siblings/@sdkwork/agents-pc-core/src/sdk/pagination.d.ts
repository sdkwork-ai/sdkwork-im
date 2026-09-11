export declare const DEFAULT_LIST_PAGE_SIZE = 20;
export declare const MAX_LIST_PAGE_SIZE = 200;
export interface OffsetPageInfo {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
}
export interface CanonicalPageInfo {
    page?: number;
    pageSize?: number;
    totalPages?: number;
    totalItems?: number | string;
    hasMore?: boolean;
}
/** Map an already-unwrapped SDKWork `pageInfo` value into the UI page model. */
export declare function toOffsetPageInfo(pageInfo: CanonicalPageInfo): OffsetPageInfo;
export interface SyncAllOffsetPagesOptions<TQuery = Record<string, unknown>> {
    pageSize?: number;
    maxPages?: number;
    query?: TQuery;
}
export interface CanonicalOffsetPage<T> {
    items: T[];
    pageInfo: CanonicalPageInfo;
}
/**
 * Export/batch-only helper: follow server `pageInfo.hasMore` across pages.
 * Per `PAGINATION_SPEC.md` §7–§8 — must not back interactive UI tables or feeds.
 */
export declare function syncAllOffsetPages<T, TQuery extends Record<string, unknown> = Record<string, unknown>>(fetchPage: (params: {
    page: number;
    pageSize: number;
} & TQuery) => Promise<CanonicalOffsetPage<T>>, options: SyncAllOffsetPagesOptions<TQuery>): Promise<T[]>;
export declare function extractListItems(value: unknown): unknown[];
export interface CursorPageInfo {
    hasMore: boolean;
    nextPageToken?: string;
}
/** Parse SdkWork cursor-mode `pageInfo` from an SDK list response envelope. */
export declare function extractCursorPageInfo(value: unknown): CursorPageInfo;

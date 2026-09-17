/**
 * Cursor-pagination contract for IM HarmonyOS list reads.
 *
 * Authority: `PAGINATION_SPEC.md`. An interactive list is cursor-paginated. An
 * offset page silently truncates at high offsets, and `hasMore` without a
 * `nextCursor` makes "load more" spin forever. Both are hard failures — a
 * swallowed one is only ever visible to users.
 */

export interface ImHarmonyPageInfo {
  readonly mode: string;
  readonly hasMore: boolean;
  readonly nextCursor?: string;
}

export function assertImHarmonyCursorPage(pageInfo: ImHarmonyPageInfo, resource: string): void {
  if (pageInfo.mode !== 'cursor') {
    throw new Error(resource + ' must use cursor pagination.');
  }
  if (pageInfo.hasMore && (pageInfo.nextCursor === undefined || pageInfo.nextCursor === '')) {
    throw new Error(resource + ' returned hasMore without nextCursor.');
  }
}

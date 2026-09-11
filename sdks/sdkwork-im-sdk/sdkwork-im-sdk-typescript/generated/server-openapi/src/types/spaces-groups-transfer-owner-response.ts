import type { SpaceGroupView } from './space-group-view';

export interface SpacesGroupsTransferOwnerResponse {
  code: 0;
  data: unknown & { item: SpaceGroupView; };
  /** Server-owned request correlation id. */
  traceId: string;
}

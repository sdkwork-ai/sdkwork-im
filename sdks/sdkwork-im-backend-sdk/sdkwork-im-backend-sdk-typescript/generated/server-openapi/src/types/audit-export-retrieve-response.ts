import type { AuditRecordView } from './audit-record-view';
import type { PageInfo } from './page-info';

export interface AuditExportRetrieveResponse {
  code: 0;
  data: unknown & { items: AuditRecordView[]; pageInfo: PageInfo; };
  /** Server-owned request correlation id. */
  traceId: string;
}

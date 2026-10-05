import type { AuditRecordListResponse } from './audit-record-list-response';

export interface AuditRecordsListResponse {
  code: 0;
  data: unknown & AuditRecordListResponse;
  /** Server-owned request correlation id. */
  traceId: string;
}

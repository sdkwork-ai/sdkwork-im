import type { AuditRecordView } from './audit-record-view';

export interface AuditRecordsCreateResponse201 {
  code: 0;
  data: unknown & { item: AuditRecordView; };
  /** Server-owned request correlation id. */
  traceId: string;
}

import type { AuditRecordView } from './audit-record-view';
import type { PageInfo } from './page-info';

export interface AuditRecordListResponse {
  items: AuditRecordView[];
  pageInfo: PageInfo;
}

export interface AuditRecordAnchorRequest {
  recordId: string;
  aggregateType: string;
  aggregateId: string;
  action: string;
  /** Bounded JSON payload evidence (max 128 KiB). */
  payload?: string | null;
}

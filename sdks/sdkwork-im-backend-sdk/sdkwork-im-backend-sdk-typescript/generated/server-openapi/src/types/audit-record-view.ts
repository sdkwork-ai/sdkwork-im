export interface AuditRecordView {
  tenantId: string;
  recordId: string;
  auditSeq: string;
  aggregateType: string;
  aggregateId: string;
  action: string;
  actorId: string;
  actorKind: string;
  actorSessionId?: string | null;
  payload?: string | null;
  recordedAt: string;
  chainPrevHash?: string | null;
  chainHash: string;
}

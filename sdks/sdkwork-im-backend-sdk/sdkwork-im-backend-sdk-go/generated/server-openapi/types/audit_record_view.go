package types


type AuditRecordView struct {
	TenantId string `json:"tenantId"`
	RecordId string `json:"recordId"`
	AuditSeq string `json:"auditSeq"`
	AggregateType string `json:"aggregateType"`
	AggregateId string `json:"aggregateId"`
	Action string `json:"action"`
	ActorId string `json:"actorId"`
	ActorKind string `json:"actorKind"`
	ActorSessionId string `json:"actorSessionId"`
	Payload string `json:"payload"`
	RecordedAt string `json:"recordedAt"`
	ChainPrevHash string `json:"chainPrevHash"`
	ChainHash string `json:"chainHash"`
}

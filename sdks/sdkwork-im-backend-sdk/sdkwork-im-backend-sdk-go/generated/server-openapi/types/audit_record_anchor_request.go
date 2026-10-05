package types


type AuditRecordAnchorRequest struct {
	RecordId string `json:"recordId"`
	AggregateType string `json:"aggregateType"`
	AggregateId string `json:"aggregateId"`
	Action string `json:"action"`
	Payload string `json:"payload"`
}

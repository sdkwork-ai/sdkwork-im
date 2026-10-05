package types


type AuditRecordListResponse struct {
	Items []AuditRecordView `json:"items"`
	PageInfo PageInfo `json:"pageInfo"`
}

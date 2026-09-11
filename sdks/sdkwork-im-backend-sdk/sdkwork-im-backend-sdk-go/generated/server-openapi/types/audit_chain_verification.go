package types


type AuditChainVerification struct {
	TenantId string `json:"tenantId"`
	VerifiedAt string `json:"verifiedAt"`
	Total string `json:"total"`
	ChainHeadHash string `json:"chainHeadHash"`
	ChainValid bool `json:"chainValid"`
}

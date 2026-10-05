package types


type ConversationMember struct {
	TenantId string `json:"tenantId"`
	ConversationId string `json:"conversationId"`
	MemberId string `json:"memberId"`
	PrincipalId string `json:"principalId"`
	PrincipalKind string `json:"principalKind"`
	Role string `json:"role"`
	State MembershipState `json:"state"`
	JoinedAt string `json:"joinedAt"`
	InvitedBy string `json:"invitedBy"`
	RemovedAt string `json:"removedAt"`
	Attributes map[string]string `json:"attributes"`
}

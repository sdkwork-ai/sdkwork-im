package types


type DirectChat struct {
	TenantId string `json:"tenantId"`
	DirectChatId string `json:"directChatId"`
	LeftActorId string `json:"leftActorId"`
	RightActorId string `json:"rightActorId"`
	PairHash string `json:"pairHash"`
	Status string `json:"status"`
	ConversationId string `json:"conversationId"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

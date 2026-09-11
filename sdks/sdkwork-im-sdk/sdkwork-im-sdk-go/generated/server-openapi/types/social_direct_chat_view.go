package types


type SocialDirectChatView struct {
	DirectChatId string `json:"directChatId"`
	LeftActorId string `json:"leftActorId"`
	RightActorId string `json:"rightActorId"`
	Status string `json:"status"`
	ConversationId string `json:"conversationId"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

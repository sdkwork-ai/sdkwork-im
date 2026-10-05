package types


type MessageInteractionSummaryView struct {
	TenantId string `json:"tenantId"`
	ConversationId string `json:"conversationId"`
	MessageId string `json:"messageId"`
	MessageSeq string `json:"messageSeq"`
	TotalReactionCount int `json:"totalReactionCount"`
	ReactionCounts []MessageReactionCountView `json:"reactionCounts"`
	Pin MessagePinView `json:"pin"`
}

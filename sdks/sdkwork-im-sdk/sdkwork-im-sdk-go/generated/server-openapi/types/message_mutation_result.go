package types


type MessageMutationResult struct {
	ConversationId string `json:"conversationId"`
	MessageId string `json:"messageId"`
	MessageSeq string `json:"messageSeq"`
	EventId string `json:"eventId"`
}

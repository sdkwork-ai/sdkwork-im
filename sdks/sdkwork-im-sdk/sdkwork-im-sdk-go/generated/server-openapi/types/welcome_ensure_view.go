package types


type WelcomeEnsureView struct {
	Status string `json:"status"`
	ConversationId string `json:"conversationId"`
	MessageId string `json:"messageId"`
	MessageSeq string `json:"messageSeq"`
}

package types


type MessageSearchHit struct {
	ConversationId string `json:"conversationId"`
	MessageId string `json:"messageId"`
	MessageSeq string `json:"messageSeq"`
}

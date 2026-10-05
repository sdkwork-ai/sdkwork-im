package types


type ConversationsTypingSignalResponse struct {
	Code int `json:"code"`
	Data interface{} `json:"data"`
	TraceId string `json:"traceId"`
}

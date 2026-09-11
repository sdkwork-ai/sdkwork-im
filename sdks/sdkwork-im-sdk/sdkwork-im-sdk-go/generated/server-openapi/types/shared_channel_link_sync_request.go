package types


type SharedChannelLinkSyncRequest struct {
	ConversationId string `json:"conversationId"`
	SharedChannelPolicyId string `json:"sharedChannelPolicyId"`
	ExternalConnectionId string `json:"externalConnectionId"`
	LocalActorId string `json:"localActorId"`
	LocalActorKind string `json:"localActorKind"`
	ExternalMemberId string `json:"externalMemberId"`
	RequestKey string `json:"requestKey"`
}

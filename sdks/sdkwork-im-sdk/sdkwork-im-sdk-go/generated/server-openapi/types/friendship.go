package types


type Friendship struct {
	TenantId string `json:"tenantId"`
	FriendshipId string `json:"friendshipId"`
	InitiatorUserId string `json:"initiatorUserId"`
	UserLowId string `json:"userLowId"`
	UserHighId string `json:"userHighId"`
	Status string `json:"status"`
	EstablishedAt string `json:"establishedAt"`
	UpdatedAt string `json:"updatedAt"`
}

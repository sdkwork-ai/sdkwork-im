package types

// Friend request inventory entry mirroring the social service FriendRequestHttpView DTO.
type SocialFriendRequestInventoryItem struct {
	TenantId string `json:"tenantId"`
	FriendRequestId string `json:"friendRequestId"`
	RequesterUserId string `json:"requesterUserId"`
	TargetUserId string `json:"targetUserId"`
	Status string `json:"status"`
	RequestMessage string `json:"requestMessage"`
	ExpiredAt string `json:"expiredAt"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
	RequesterDisplayName string `json:"requesterDisplayName"`
	RequesterAvatarUrl string `json:"requesterAvatarUrl"`
}

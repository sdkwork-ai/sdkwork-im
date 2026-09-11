package types


type SocialFriendRequestInventoryPageData struct {
	Items []SocialFriendRequestInventoryItem `json:"items"`
	PageInfo PageInfo `json:"pageInfo"`
}

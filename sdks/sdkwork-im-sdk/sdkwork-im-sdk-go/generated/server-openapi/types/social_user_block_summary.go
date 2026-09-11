package types


type SocialUserBlockSummary struct {
	BlockId string `json:"blockId"`
	BlockerUserId string `json:"blockerUserId"`
	BlockedUserId string `json:"blockedUserId"`
	Scope string `json:"scope"`
	CreatedAt string `json:"createdAt"`
}

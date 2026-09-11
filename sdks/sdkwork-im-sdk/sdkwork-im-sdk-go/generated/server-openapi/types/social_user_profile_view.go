package types


type SocialUserProfileView struct {
	UserId string `json:"userId"`
	ImNickname string `json:"imNickname"`
	ImAvatarUrl string `json:"imAvatarUrl"`
	ImStatusMessage string `json:"imStatusMessage"`
	ImOnlineStatus string `json:"imOnlineStatus"`
	LastActiveAt string `json:"lastActiveAt"`
}

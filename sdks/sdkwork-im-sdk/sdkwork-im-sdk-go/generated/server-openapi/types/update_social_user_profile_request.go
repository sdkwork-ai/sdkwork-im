package types


type UpdateSocialUserProfileRequest struct {
	ImNickname string `json:"imNickname"`
	ImAvatarUrl string `json:"imAvatarUrl"`
	ImStatusMessage string `json:"imStatusMessage"`
}

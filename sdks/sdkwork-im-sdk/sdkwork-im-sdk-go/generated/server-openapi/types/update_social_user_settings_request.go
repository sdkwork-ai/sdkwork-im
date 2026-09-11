package types


type UpdateSocialUserSettingsRequest struct {
	Settings map[string]interface{} `json:"settings"`
}

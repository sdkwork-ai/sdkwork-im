package types


type SpaceInviteView struct {
	InvitationId string `json:"invitationId"`
	InviterUserId string `json:"inviterUserId"`
	InviteeUserId string `json:"inviteeUserId"`
	TargetType string `json:"targetType"`
	TargetId string `json:"targetId"`
	Role string `json:"role"`
	Status string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

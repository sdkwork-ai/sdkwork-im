package types

// Invitation to join the space. At least one of inviteeUserId, inviteeEmail, or inviteePhone is required.
type SpaceInviteCreateRequest struct {
	InviteeUserId string `json:"inviteeUserId"`
	InviteeEmail string `json:"inviteeEmail"`
	InviteePhone string `json:"inviteePhone"`
	TargetType string `json:"targetType"`
	TargetId string `json:"targetId"`
	Role string `json:"role"`
	Message string `json:"message"`
	ExpiresAt string `json:"expiresAt"`
}

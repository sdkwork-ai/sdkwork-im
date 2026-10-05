use serde::{Deserialize, Serialize};

/// Invitation to join the space. At least one of inviteeUserId, inviteeEmail, or inviteePhone is required.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SpaceInviteCreateRequest {
    /// Invitee user id when the invitation is addressed to a registered user.
    #[serde(rename = "inviteeUserId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invitee_user_id: Option<String>,

    /// Invitee email when the invitation is delivered by email.
    #[serde(rename = "inviteeEmail")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invitee_email: Option<String>,

    /// Invitee phone when the invitation is delivered by phone.
    #[serde(rename = "inviteePhone")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invitee_phone: Option<String>,

    /// Invitation target type. Only space invitations are supported.
    #[serde(rename = "targetType")]
    pub target_type: String,

    /// Invitation target id, must equal the spaceId path parameter.
    #[serde(rename = "targetId")]
    pub target_id: String,

    /// Role granted to the invitee on acceptance. Defaults to member.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,

    /// Optional personal message shown to the invitee.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// RFC3339 expiry instant. Must be in the future when provided.
    #[serde(rename = "expiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SpaceInviteView {
    /// Invitation identifier, passed as the inviteCode path parameter.
    #[serde(rename = "invitationId")]
    pub invitation_id: String,

    #[serde(rename = "inviterUserId")]
    pub inviter_user_id: String,

    #[serde(rename = "inviteeUserId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invitee_user_id: Option<String>,

    #[serde(rename = "targetType")]
    pub target_type: String,

    #[serde(rename = "targetId")]
    pub target_id: String,

    pub role: String,

    pub status: String,

    #[serde(rename = "createdAt")]
    pub created_at: String,
}

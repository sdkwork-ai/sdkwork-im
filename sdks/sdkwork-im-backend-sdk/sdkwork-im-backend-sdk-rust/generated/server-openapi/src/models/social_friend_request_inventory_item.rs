use serde::{Deserialize, Serialize};

/// Friend request inventory entry mirroring the social service FriendRequestHttpView DTO.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SocialFriendRequestInventoryItem {
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    #[serde(rename = "friendRequestId")]
    pub friend_request_id: String,

    #[serde(rename = "requesterUserId")]
    pub requester_user_id: String,

    #[serde(rename = "targetUserId")]
    pub target_user_id: String,

    pub status: String,

    #[serde(rename = "requestMessage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_message: Option<String>,

    #[serde(rename = "expiredAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expired_at: Option<String>,

    #[serde(rename = "createdAt")]
    pub created_at: String,

    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Resolved from the IM user profile store when configured.
    #[serde(rename = "requesterDisplayName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requester_display_name: Option<String>,

    /// Resolved from the IM user profile store when configured.
    #[serde(rename = "requesterAvatarUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requester_avatar_url: Option<String>,
}

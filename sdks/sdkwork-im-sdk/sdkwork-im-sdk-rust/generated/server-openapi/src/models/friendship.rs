use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Friendship {
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    #[serde(rename = "friendshipId")]
    pub friendship_id: String,

    #[serde(rename = "initiatorUserId")]
    pub initiator_user_id: String,

    #[serde(rename = "userLowId")]
    pub user_low_id: String,

    #[serde(rename = "userHighId")]
    pub user_high_id: String,

    pub status: String,

    #[serde(rename = "establishedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub established_at: Option<String>,

    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}

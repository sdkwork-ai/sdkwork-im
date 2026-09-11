use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SocialUserBlockSummary {
    #[serde(rename = "blockId")]
    pub block_id: String,

    #[serde(rename = "blockerUserId")]
    pub blocker_user_id: String,

    #[serde(rename = "blockedUserId")]
    pub blocked_user_id: String,

    pub scope: String,

    #[serde(rename = "createdAt")]
    pub created_at: String,
}

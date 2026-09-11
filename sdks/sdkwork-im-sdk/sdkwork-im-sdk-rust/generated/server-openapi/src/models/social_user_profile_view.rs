use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SocialUserProfileView {
    #[serde(rename = "userId")]
    pub user_id: String,

    #[serde(rename = "imNickname")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub im_nickname: Option<String>,

    #[serde(rename = "imAvatarUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub im_avatar_url: Option<String>,

    #[serde(rename = "imStatusMessage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub im_status_message: Option<String>,

    #[serde(rename = "imOnlineStatus")]
    pub im_online_status: String,

    #[serde(rename = "lastActiveAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_active_at: Option<String>,
}

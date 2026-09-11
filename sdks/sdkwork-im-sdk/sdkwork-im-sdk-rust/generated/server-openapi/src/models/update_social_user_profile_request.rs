use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UpdateSocialUserProfileRequest {
    #[serde(rename = "imNickname")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub im_nickname: Option<String>,

    #[serde(rename = "imAvatarUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub im_avatar_url: Option<String>,

    #[serde(rename = "imStatusMessage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub im_status_message: Option<String>,
}

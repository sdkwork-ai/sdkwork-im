use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UpdateSocialUserSettingsRequest {
    pub settings: std::collections::HashMap<String, serde_json::Value>,
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct TypingIndicatorListItem {
    #[serde(rename = "userId")]
    pub user_id: String,

    #[serde(rename = "userKind")]
    pub user_kind: String,
}

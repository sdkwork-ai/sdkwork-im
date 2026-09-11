use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SocialDirectChatView {
    #[serde(rename = "directChatId")]
    pub direct_chat_id: String,

    #[serde(rename = "leftActorId")]
    pub left_actor_id: String,

    #[serde(rename = "rightActorId")]
    pub right_actor_id: String,

    pub status: String,

    #[serde(rename = "conversationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    #[serde(rename = "createdAt")]
    pub created_at: String,

    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ConversationBindingView {
    #[serde(rename = "conversationId")]
    pub conversation_id: String,

    #[serde(rename = "businessType")]
    pub business_type: String,

    #[serde(rename = "businessId")]
    pub business_id: String,
}

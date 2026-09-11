use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SharedChannelLinkSyncResponse {
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    #[serde(rename = "conversationId")]
    pub conversation_id: String,

    #[serde(rename = "memberId")]
    pub member_id: String,

    #[serde(rename = "principalId")]
    pub principal_id: String,

    #[serde(rename = "principalKind")]
    pub principal_kind: String,

    pub role: String,

    pub state: String,

    #[serde(rename = "joinedAt")]
    pub joined_at: String,

    #[serde(rename = "invitedBy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invited_by: Option<String>,

    #[serde(rename = "removedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub removed_at: Option<String>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attributes: Option<std::collections::HashMap<String, String>>,

    #[serde(rename = "proofVersion")]
    pub proof_version: String,

    #[serde(rename = "requestKey")]
    pub request_key: String,

    pub status: String,
}

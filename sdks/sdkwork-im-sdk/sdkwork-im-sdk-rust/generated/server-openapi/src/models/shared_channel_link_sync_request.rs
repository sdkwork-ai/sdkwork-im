use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SharedChannelLinkSyncRequest {
    #[serde(rename = "conversationId")]
    pub conversation_id: String,

    #[serde(rename = "sharedChannelPolicyId")]
    pub shared_channel_policy_id: String,

    #[serde(rename = "externalConnectionId")]
    pub external_connection_id: String,

    #[serde(rename = "localActorId")]
    pub local_actor_id: String,

    #[serde(rename = "localActorKind")]
    pub local_actor_kind: String,

    #[serde(rename = "externalMemberId")]
    pub external_member_id: String,

    #[serde(rename = "requestKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_key: Option<String>,
}

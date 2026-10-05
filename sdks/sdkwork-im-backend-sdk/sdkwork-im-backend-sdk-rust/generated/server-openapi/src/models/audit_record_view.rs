use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AuditRecordView {
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    #[serde(rename = "recordId")]
    pub record_id: String,

    #[serde(rename = "auditSeq")]
    pub audit_seq: String,

    #[serde(rename = "aggregateType")]
    pub aggregate_type: String,

    #[serde(rename = "aggregateId")]
    pub aggregate_id: String,

    pub action: String,

    #[serde(rename = "actorId")]
    pub actor_id: String,

    #[serde(rename = "actorKind")]
    pub actor_kind: String,

    #[serde(rename = "actorSessionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actor_session_id: Option<String>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload: Option<String>,

    #[serde(rename = "recordedAt")]
    pub recorded_at: String,

    #[serde(rename = "chainPrevHash")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chain_prev_hash: Option<String>,

    #[serde(rename = "chainHash")]
    pub chain_hash: String,
}

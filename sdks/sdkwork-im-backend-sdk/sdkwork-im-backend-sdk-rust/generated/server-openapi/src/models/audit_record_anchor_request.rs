use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AuditRecordAnchorRequest {
    #[serde(rename = "recordId")]
    pub record_id: String,

    #[serde(rename = "aggregateType")]
    pub aggregate_type: String,

    #[serde(rename = "aggregateId")]
    pub aggregate_id: String,

    pub action: String,

    /// Bounded JSON payload evidence (max 128 KiB).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload: Option<String>,
}

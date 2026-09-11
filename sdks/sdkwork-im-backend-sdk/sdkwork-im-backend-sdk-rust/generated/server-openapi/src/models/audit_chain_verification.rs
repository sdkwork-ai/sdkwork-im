use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AuditChainVerification {
    #[serde(rename = "tenantId")]
    pub tenant_id: String,

    #[serde(rename = "verifiedAt")]
    pub verified_at: String,

    pub total: String,

    #[serde(rename = "chainHeadHash")]
    pub chain_head_hash: String,

    #[serde(rename = "chainValid")]
    pub chain_valid: bool,
}

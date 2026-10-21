//! Durable Conversation projections: summary and profile.
//!
//! Both read models are derived from normalized tables — never from the
//! process-local projection cache — so a restart or a second replica serves the
//! same current state.

use sdkwork_im_contract_core::ContractError;
use serde::{Deserialize, Serialize};

use crate::ConversationInboxHandoffRecord;

/// One durable Conversation summary (`im_conversations` summary columns).
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConversationSummaryRecord {
    pub tenant_id: String,
    pub organization_id: String,
    pub conversation_id: String,
    pub message_count: u64,
    pub last_message_id: Option<String>,
    pub last_message_seq: u64,
    pub last_sender_kind: Option<String>,
    pub last_sender_id: Option<String>,
    pub last_summary: Option<String>,
    pub last_message_at: Option<String>,
    pub handoff: Option<ConversationInboxHandoffRecord>,
}

/// Durable Conversation profile (custom display name, avatar, notice).
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConversationProfileRecord {
    pub tenant_id: String,
    pub organization_id: String,
    pub conversation_id: String,
    pub display_name: String,
    pub avatar_url: String,
    pub notice: String,
    pub updated_at: String,
    pub updated_by_principal_kind: Option<String>,
    pub updated_by_principal_id: Option<String>,
}

/// Durable summary reader.
pub trait ConversationSummaryAuthority: Send + Sync {
    fn load_conversation_summary(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<Option<ConversationSummaryRecord>, ContractError>;
}

/// Durable Conversation profile store.
pub trait ConversationProfileStore: Send + Sync {
    fn load_profile(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<Option<ConversationProfileRecord>, ContractError>;

    fn save_profile(&self, record: ConversationProfileRecord) -> Result<(), ContractError>;
}

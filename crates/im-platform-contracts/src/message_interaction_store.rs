//! Durable read authority for message reactions and pins.

use crate::ContractError;

/// One durable reaction row.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StoredMessageReaction {
    pub actor_principal_kind: String,
    pub actor_principal_id: String,
    pub reaction_key: String,
    pub reacted_at: String,
}

/// One durable pin row.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StoredMessagePin {
    pub pinned_by_principal_kind: String,
    pub pinned_by_principal_id: String,
    pub pinned_at: String,
}

/// Durable interaction state for one message.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StoredMessageInteraction {
    pub message_id: String,
    pub message_seq: u64,
    pub reactions: Vec<StoredMessageReaction>,
    pub pin: Option<StoredMessagePin>,
}

/// Pinned message identity used by the pinned-message list.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StoredPinnedMessage {
    pub message_id: String,
    pub message_seq: u64,
    pub pin: StoredMessagePin,
}

/// Reads reaction/pin state from the canonical IM tables.
///
/// The in-process interaction cache is disposable; this authority is the
/// durable fallback so pins and reaction counts survive a process restart.
pub trait MessageInteractionReadStore: Send + Sync {
    fn read_interactions(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        message_ids: &[String],
    ) -> Result<Vec<StoredMessageInteraction>, ContractError>;

    fn list_pinned_messages(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        limit: usize,
    ) -> Result<Vec<StoredPinnedMessage>, ContractError>;
}

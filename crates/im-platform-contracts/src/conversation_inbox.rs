//! Durable Conversation inbox and per-member preference ports.
//!
//! The inbox is a normalized-table read model: Conversation membership +
//! Conversation summary columns + per-member read cursor + unread count +
//! per-member preferences. It is never rebuilt from the commit journal and
//! never sourced from process memory in a production runtime.

use sdkwork_im_contract_core::ContractError;
use serde::{Deserialize, Serialize};

/// Default interactive inbox page size (`PAGINATION_SPEC.md` §3).
pub const CONVERSATION_INBOX_PAGE_SIZE_DEFAULT: usize = 20;
/// Maximum interactive inbox page size (`PAGINATION_SPEC.md` §3).
pub const CONVERSATION_INBOX_PAGE_SIZE_MAX: usize = 200;

/// Per-member Conversation preferences.
///
/// Pinning, muting, "mark unread", and hiding are member-scoped facts, not
/// Conversation-scoped ones; they are stored per principal and survive a
/// process restart.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConversationMemberPreferencesRecord {
    pub tenant_id: String,
    pub organization_id: String,
    pub conversation_id: String,
    pub principal_kind: String,
    pub principal_id: String,
    pub is_pinned: bool,
    pub is_muted: bool,
    pub is_marked_unread: bool,
    pub is_hidden: bool,
    pub updated_at: String,
}

impl ConversationMemberPreferencesRecord {
    /// Default (all-false) preferences for a member that has never customised
    /// the Conversation.
    #[must_use]
    pub fn defaults(
        tenant_id: impl Into<String>,
        organization_id: impl Into<String>,
        conversation_id: impl Into<String>,
        principal_kind: impl Into<String>,
        principal_id: impl Into<String>,
    ) -> Self {
        Self {
            tenant_id: tenant_id.into(),
            organization_id: organization_id.into(),
            conversation_id: conversation_id.into(),
            principal_kind: principal_kind.into(),
            principal_id: principal_id.into(),
            is_pinned: false,
            is_muted: false,
            is_marked_unread: false,
            is_hidden: false,
            updated_at: String::new(),
        }
    }
}

/// Active agent handoff attached to a Conversation, as stored in
/// `im_conversation_handoffs`.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConversationInboxHandoffRecord {
    pub status: String,
    pub source_principal_kind: String,
    pub source_principal_id: String,
    pub target_principal_kind: String,
    pub target_principal_id: String,
    pub handoff_session_id: String,
    pub handoff_reason: Option<String>,
    pub accepted_at: Option<String>,
    pub accepted_by_principal_kind: Option<String>,
    pub accepted_by_principal_id: Option<String>,
    pub resolved_at: Option<String>,
    pub resolved_by_principal_kind: Option<String>,
    pub resolved_by_principal_id: Option<String>,
    pub closed_at: Option<String>,
    pub closed_by_principal_kind: Option<String>,
    pub closed_by_principal_id: Option<String>,
}

/// One durable inbox row for an authorized Conversation member.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConversationInboxRecord {
    pub tenant_id: String,
    pub organization_id: String,
    pub principal_kind: String,
    pub principal_id: String,
    /// Storage member id (Snowflake as decimal string).
    pub member_id: String,
    pub conversation_id: String,
    pub conversation_type: String,
    /// Conversation display title (group name / channel name when present).
    pub conversation_title: Option<String>,
    pub conversation_avatar_url: Option<String>,
    /// Peer of a direct Conversation.
    pub peer_principal_kind: Option<String>,
    pub peer_principal_id: Option<String>,
    pub peer_display_name: Option<String>,
    pub peer_avatar_url: Option<String>,
    pub message_count: u64,
    pub last_message_id: Option<String>,
    pub last_message_seq: u64,
    pub last_sender_kind: Option<String>,
    pub last_sender_id: Option<String>,
    pub last_summary: Option<String>,
    pub unread_count: u64,
    pub last_activity_at: String,
    pub preferences: ConversationMemberPreferencesRecord,
    pub handoff: Option<ConversationInboxHandoffRecord>,
}

/// Keyset position of an inbox page: `(last_activity_at, conversation_id)`.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConversationInboxPageCursor {
    pub activity_at: String,
    pub conversation_id: String,
}

/// One bounded inbox page read from the authoritative store.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ConversationInboxPage {
    pub items: Vec<ConversationInboxRecord>,
    pub next_cursor: Option<ConversationInboxPageCursor>,
    pub has_more: bool,
}

/// Durable inbox reader.
///
/// Implementations must:
///
/// - scope every predicate by tenant, organization, principal kind, and
///   principal id;
/// - order by `(last_activity_at DESC, conversation_id DESC)` and page with a
///   keyset predicate, never `OFFSET`;
/// - fetch at most `limit + 1` rows to report continuation;
/// - compute unread state from the member's read cursor and Message truth.
pub trait ConversationInboxAuthority: Send + Sync {
    #[allow(clippy::too_many_arguments)]
    fn list_inbox_page(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        cursor: Option<&ConversationInboxPageCursor>,
        limit: usize,
        conversation_type: Option<&str>,
        search: Option<&str>,
    ) -> Result<ConversationInboxPage, ContractError>;
}

/// Durable per-member Conversation preference store.
pub trait ConversationMemberPreferencesStore: Send + Sync {
    fn load_preferences(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Result<Option<ConversationMemberPreferencesRecord>, ContractError>;

    fn save_preferences(
        &self,
        record: ConversationMemberPreferencesRecord,
    ) -> Result<(), ContractError>;

    /// Authoritative active-membership check used by member-scoped
    /// personalization endpoints, independent of any process cache.
    fn is_active_member(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Result<bool, ContractError>;

    /// Authoritative membership role (`owner`, `admin`, `member`, ...) for an
    /// active member, independent of any process cache.
    fn active_member_role(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Result<Option<String>, ContractError>;
}

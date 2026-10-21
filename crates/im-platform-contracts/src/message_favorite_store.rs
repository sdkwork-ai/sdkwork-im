//! Durable Message favorite store.
//!
//! Favorites are principal-scoped user data. They are keyed by a deterministic
//! `favorite_id` (one favorite per principal and Message), survive Message
//! recall, and page by `(favorited_at DESC, favorite_id DESC)`.

use sdkwork_im_contract_core::ContractError;
use serde::{Deserialize, Serialize};

/// One durable Message favorite.
///
/// `message_seq` is resolved from `im_conversation_messages` when the favorite
/// is created; callers pass `0` and the store fills the authoritative value.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct MessageFavoriteRecord {
    pub tenant_id: String,
    pub organization_id: String,
    pub principal_kind: String,
    pub principal_id: String,
    pub favorite_id: String,
    pub favorite_type: String,
    pub conversation_id: String,
    pub message_id: String,
    pub message_seq: u64,
    pub title: String,
    pub content_preview: String,
    pub source_display_name: String,
    pub favorited_at: String,
}

/// Keyset position of a favorite page.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct MessageFavoritePageCursor {
    pub favorited_at: String,
    pub favorite_id: String,
}

/// One bounded favorite page.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct MessageFavoritePage {
    pub items: Vec<MessageFavoriteRecord>,
    pub next_cursor: Option<MessageFavoritePageCursor>,
    pub has_more: bool,
}

/// Durable Message favorite store.
pub trait MessageFavoriteStore: Send + Sync {
    #[allow(clippy::too_many_arguments)]
    fn list_favorites(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        cursor: Option<&MessageFavoritePageCursor>,
        limit: usize,
        favorite_type: Option<&str>,
        search: Option<&str>,
    ) -> Result<MessageFavoritePage, ContractError>;

    /// Creates or refreshes a favorite. Returns `Ok(None)` when the Message does
    /// not exist in the Conversation (no authoritative `message_seq`).
    fn create_favorite(
        &self,
        record: MessageFavoriteRecord,
    ) -> Result<Option<MessageFavoriteRecord>, ContractError>;

    fn delete_favorite(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        favorite_id: &str,
    ) -> Result<bool, ContractError>;
}

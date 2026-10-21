use std::cmp::Ordering;
use std::ops::Bound::{Excluded, Unbounded};

use im_platform_contracts::{
    ContractError, MessageFavoritePageCursor, MessageFavoriteRecord, MessageFavoriteStore,
};
use im_time::utc_now_rfc3339_millis;
use sdkwork_utils_rust::SdkWorkPageData;

use super::model::{FavoriteMessageRequest, FavoriteMessagesListCursor, MessageFavoriteView};
use super::{ConversationStateService, lock_conversation_state_mutex, scope::scope_key};

#[derive(Clone, Eq, PartialEq)]
pub(crate) struct MessageFavoriteIndexEntry {
    favorited_at: String,
    favorite_id: String,
}

pub(crate) struct MessageFavoritesWindowQuery<'a> {
    pub tenant_id: &'a str,
    pub organization_id: &'a str,
    pub principal_kind: &'a str,
    pub principal_id: &'a str,
    pub limit: usize,
    pub cursor: FavoriteMessagesListCursor,
    pub favorite_type: Option<&'a str>,
    pub search_query: Option<&'a str>,
}

impl Ord for MessageFavoriteIndexEntry {
    fn cmp(&self, other: &Self) -> Ordering {
        other
            .favorited_at
            .cmp(&self.favorited_at)
            .then_with(|| other.favorite_id.cmp(&self.favorite_id))
    }
}

impl PartialOrd for MessageFavoriteIndexEntry {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl MessageFavoriteIndexEntry {
    fn from_view(view: &MessageFavoriteView) -> Self {
        Self {
            favorited_at: view.favorited_at.clone(),
            favorite_id: view.favorite_id.clone(),
        }
    }
}

pub(super) fn message_favorites_scope_key(
    tenant_id: &str,
    organization_id: &str,
    principal_kind: &str,
    principal_id: &str,
) -> String {
    format!(
        "{}:{}:{}",
        scope_key(tenant_id, organization_id, "message-favorites"),
        principal_kind,
        principal_id
    )
}

pub(super) fn favorite_id_for_message(principal_id: &str, message_id: &str) -> String {
    format!("fav_{principal_id}_{message_id}")
}

impl ConversationStateService {
    pub fn message_favorites_for_principal(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Vec<MessageFavoriteView> {
        let key =
            message_favorites_scope_key(tenant_id, organization_id, principal_kind, principal_id);
        let mut favorites =
            lock_conversation_state_mutex(&self.message_favorites, "message favorites store")
                .get(key.as_str())
                .cloned()
                .unwrap_or_default()
                .into_values()
                .collect::<Vec<_>>();
        favorites.sort_by(|left, right| right.favorited_at.cmp(&left.favorited_at));
        favorites
    }

    pub fn create_message_favorite(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        message_id: &str,
        request: FavoriteMessageRequest,
    ) -> MessageFavoriteView {
        let favorite_id = favorite_id_for_message(principal_id, message_id);
        let message_seq = self.message_seq_for_conversation_message(
            tenant_id,
            organization_id,
            request.conversation_id.as_str(),
            message_id,
        );
        let view = MessageFavoriteView {
            tenant_id: tenant_id.to_owned(),
            principal_kind: principal_kind.to_owned(),
            principal_id: principal_id.to_owned(),
            favorite_id: favorite_id.clone(),
            favorite_type: request.favorite_type,
            conversation_id: request.conversation_id,
            message_id: message_id.to_owned(),
            message_seq,
            title: request.title,
            content_preview: request.content_preview,
            source_display_name: request.source_display_name,
            favorited_at: utc_now_rfc3339_millis(),
        };
        let key =
            message_favorites_scope_key(tenant_id, organization_id, principal_kind, principal_id);
        lock_conversation_state_mutex(&self.message_favorites, "message favorites store")
            .entry(key.clone())
            .or_default()
            .insert(favorite_id, view.clone());
        self.upsert_message_favorite_index(key.as_str(), &view);
        view
    }

    pub fn delete_message_favorite(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        favorite_id: &str,
    ) -> bool {
        let key =
            message_favorites_scope_key(tenant_id, organization_id, principal_kind, principal_id);
        let removed =
            lock_conversation_state_mutex(&self.message_favorites, "message favorites store")
                .get_mut(key.as_str())
                .is_some_and(|favorites| favorites.remove(favorite_id).is_some());
        if removed {
            self.remove_message_favorite_index_entry(key.as_str(), favorite_id);
        }
        removed
    }

    pub(crate) fn message_favorites_window_for_principal(
        &self,
        query: MessageFavoritesWindowQuery<'_>,
    ) -> Result<
        SdkWorkPageData<super::MessageFavoriteView>,
        crate::conversation_state::event_apply::ConversationStateError,
    > {
        let limit = query.limit;
        let mut items = self.collect_message_favorites_index_window(&query);
        let has_more = items.len() > limit;
        if has_more {
            items.truncate(limit);
        }
        let next_cursor = if has_more {
            items
                .last()
                .map(|favorite| {
                    let payload = serde_json::json!({
                        "favoritedAt": favorite.favorited_at,
                        "favoriteId": favorite.favorite_id,
                    });
                    crate::conversation_state::cursor_auth::encode_conversation_state_list_cursor(
                        &payload,
                    )
                })
                .transpose()?
        } else {
            None
        };
        Ok(super::list_page::cursor_page(
            items,
            limit,
            next_cursor,
            has_more,
        ))
    }

    fn collect_message_favorites_index_window(
        &self,
        query: &MessageFavoritesWindowQuery<'_>,
    ) -> Vec<MessageFavoriteView> {
        let key = message_favorites_scope_key(
            query.tenant_id,
            query.organization_id,
            query.principal_kind,
            query.principal_id,
        );
        let limit = query.limit.max(1);
        let mut window = Vec::with_capacity(limit.saturating_add(1));
        let favorites =
            lock_conversation_state_mutex(&self.message_favorites, "message favorites store");
        let index =
            lock_conversation_state_mutex(&self.message_favorites_index, "message favorites index");
        let Some(scope_index) = index.get(key.as_str()) else {
            return window;
        };
        let scope_favorites = favorites.get(key.as_str());
        let keyset_cursor = match &query.cursor {
            FavoriteMessagesListCursor::Keyset {
                favorited_at,
                favorite_id,
            } => Some((favorited_at.clone(), favorite_id.clone())),
            _ => None,
        };
        let index_iter: Box<dyn Iterator<Item = &MessageFavoriteIndexEntry>> =
            if let Some((favorited_at, favorite_id)) = keyset_cursor.as_ref() {
                let cursor_entry = MessageFavoriteIndexEntry {
                    favorited_at: favorited_at.clone(),
                    favorite_id: favorite_id.clone(),
                };
                Box::new(scope_index.range((Excluded(cursor_entry), Unbounded)))
            } else {
                Box::new(scope_index.iter())
            };
        for entry in index_iter {
            let Some(scope_favorites) = scope_favorites else {
                break;
            };
            let Some(favorite) = scope_favorites.get(entry.favorite_id.as_str()) else {
                continue;
            };
            if !favorite_matches_filters(favorite, query.favorite_type, query.search_query) {
                continue;
            }
            window.push(favorite.clone());
            if window.len() > limit {
                break;
            }
        }
        window
    }

    fn upsert_message_favorite_index(&self, scope_key: &str, favorite: &MessageFavoriteView) {
        lock_conversation_state_mutex(&self.message_favorites_index, "message favorites index")
            .entry(scope_key.to_owned())
            .or_default()
            .insert(MessageFavoriteIndexEntry::from_view(favorite));
    }

    fn remove_message_favorite_index_entry(&self, scope_key: &str, favorite_id: &str) {
        let mut store =
            lock_conversation_state_mutex(&self.message_favorites_index, "message favorites index");
        if let Some(index) = store.get_mut(scope_key) {
            index.retain(|entry| entry.favorite_id != favorite_id);
            if index.is_empty() {
                store.remove(scope_key);
            }
        }
    }
}

impl ConversationStateService {
    /// Durable favorites page from `im_message_favorites`.
    pub(crate) fn message_favorites_window_from_authority(
        &self,
        store: &dyn MessageFavoriteStore,
        query: MessageFavoritesWindowQuery<'_>,
    ) -> Result<
        SdkWorkPageData<super::MessageFavoriteView>,
        crate::conversation_state::event_apply::ConversationStateError,
    > {
        let limit = query.limit.max(1);
        let cursor = match &query.cursor {
            FavoriteMessagesListCursor::Start => None,
            FavoriteMessagesListCursor::Keyset {
                favorited_at,
                favorite_id,
            } => Some(MessageFavoritePageCursor {
                favorited_at: favorited_at.clone(),
                favorite_id: favorite_id.clone(),
            }),
        };
        let page = store
            .list_favorites(
                query.tenant_id,
                query.organization_id,
                query.principal_kind,
                query.principal_id,
                cursor.as_ref(),
                limit,
                query.favorite_type,
                query.search_query,
            )
            .map_err(
                crate::conversation_state::event_apply::ConversationStateError::StoreFailure,
            )?;
        let items = page
            .items
            .into_iter()
            .map(message_favorite_view_from_record)
            .collect::<Vec<_>>();
        let next_cursor = if page.has_more {
            page.next_cursor
                .as_ref()
                .map(|next| {
                    let payload = serde_json::json!({
                        "favoritedAt": next.favorited_at,
                        "favoriteId": next.favorite_id,
                    });
                    crate::conversation_state::cursor_auth::encode_conversation_state_list_cursor(
                        &payload,
                    )
                })
                .transpose()?
        } else {
            None
        };
        Ok(super::list_page::cursor_page(
            items,
            limit,
            next_cursor,
            page.has_more,
        ))
    }

    /// Durable favorite create/refresh. `None` means the Message is not in the
    /// Conversation, so no authoritative `message_seq` exists.
    pub(crate) fn create_message_favorite_in_authority(
        &self,
        store: &dyn MessageFavoriteStore,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        message_id: &str,
        request: FavoriteMessageRequest,
    ) -> Result<Option<MessageFavoriteView>, ContractError> {
        let record = MessageFavoriteRecord {
            tenant_id: tenant_id.to_owned(),
            organization_id: organization_id.to_owned(),
            principal_kind: principal_kind.to_owned(),
            principal_id: principal_id.to_owned(),
            favorite_id: favorite_id_for_message(principal_id, message_id),
            favorite_type: request.favorite_type,
            conversation_id: request.conversation_id,
            message_id: message_id.to_owned(),
            message_seq: 0,
            title: request.title,
            content_preview: request.content_preview,
            source_display_name: request.source_display_name,
            favorited_at: utc_now_rfc3339_millis(),
        };
        Ok(store
            .create_favorite(record)?
            .map(message_favorite_view_from_record))
    }

    pub(crate) fn delete_message_favorite_in_authority(
        &self,
        store: &dyn MessageFavoriteStore,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        favorite_id: &str,
    ) -> Result<bool, ContractError> {
        store.delete_favorite(
            tenant_id,
            organization_id,
            principal_kind,
            principal_id,
            favorite_id,
        )
    }
}

fn message_favorite_view_from_record(record: MessageFavoriteRecord) -> MessageFavoriteView {
    MessageFavoriteView {
        tenant_id: record.tenant_id,
        principal_kind: record.principal_kind,
        principal_id: record.principal_id,
        favorite_id: record.favorite_id,
        favorite_type: record.favorite_type,
        conversation_id: record.conversation_id,
        message_id: record.message_id,
        message_seq: record.message_seq,
        title: record.title,
        content_preview: record.content_preview,
        source_display_name: record.source_display_name,
        favorited_at: record.favorited_at,
    }
}

fn favorite_matches_query(favorite: &MessageFavoriteView, query: &str) -> bool {
    let needle = query.trim().to_ascii_lowercase();
    if needle.is_empty() {
        return true;
    }
    [
        favorite.title.as_str(),
        favorite.content_preview.as_str(),
        favorite.source_display_name.as_str(),
    ]
    .into_iter()
    .any(|value| value.to_ascii_lowercase().contains(needle.as_str()))
}

fn favorite_matches_filters(
    favorite: &MessageFavoriteView,
    favorite_type: Option<&str>,
    query: Option<&str>,
) -> bool {
    favorite_type.is_none_or(|value| favorite.favorite_type == value)
        && query.is_none_or(|value| {
            let trimmed = value.trim();
            trimmed.is_empty() || favorite_matches_query(favorite, trimmed)
        })
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_CURSOR_SECRET_ENV: &str = "SDKWORK_IM_CONVERSATION_STATE_CURSOR_HS256_SECRET";

    struct TestEnvGuard {
        _lock: std::sync::MutexGuard<'static, ()>,
        name: &'static str,
        previous: Option<String>,
    }

    impl TestEnvGuard {
        fn set(name: &'static str, value: &str) -> Self {
            let lock = crate::conversation_state::lock_conversation_state_test_environment();
            let previous = std::env::var(name).ok();
            #[allow(unsafe_code)]
            unsafe {
                std::env::set_var(name, value);
            }
            Self {
                _lock: lock,
                name,
                previous,
            }
        }
    }

    impl Drop for TestEnvGuard {
        fn drop(&mut self) {
            // The workspace lints deny `unsafe_code`; this reviewed process-identity
            // env-bootstrap site opts back in locally (deny is allow-overrideable).
            #[allow(unsafe_code)]
            unsafe {
                match &self.previous {
                    Some(value) => std::env::set_var(self.name, value),
                    None => std::env::remove_var(self.name),
                }
            }
        }
    }

    #[test]
    fn favorite_messages_indexed_window_paginates_without_full_collect() {
        let _cursor_secret = TestEnvGuard::set(
            TEST_CURSOR_SECRET_ENV,
            "conversation_state-service-test-cursor-secret-32-bytes",
        );
        let service = super::ConversationStateService::default();
        service.create_message_favorite(
            "100001",
            "default",
            "user",
            "1",
            "m1",
            FavoriteMessageRequest {
                conversation_id: "c1".into(),
                favorite_type: "message".into(),
                title: String::new(),
                content_preview: String::new(),
                source_display_name: String::new(),
            },
        );
        service.create_message_favorite(
            "100001",
            "default",
            "user",
            "1",
            "m2",
            FavoriteMessageRequest {
                conversation_id: "c1".into(),
                favorite_type: "message".into(),
                title: String::new(),
                content_preview: String::new(),
                source_display_name: String::new(),
            },
        );
        service.create_message_favorite(
            "100001",
            "default",
            "user",
            "1",
            "m3",
            FavoriteMessageRequest {
                conversation_id: "c1".into(),
                favorite_type: "message".into(),
                title: String::new(),
                content_preview: String::new(),
                source_display_name: String::new(),
            },
        );

        let first_page = service
            .message_favorites_window_for_principal(MessageFavoritesWindowQuery {
                tenant_id: "100001",
                organization_id: "default",
                principal_kind: "user",
                principal_id: "1",
                limit: 2,
                cursor: FavoriteMessagesListCursor::Start,
                favorite_type: None,
                search_query: None,
            })
            .expect("first favorites page");
        assert_eq!(first_page.page_info.has_more, Some(true));
        assert_eq!(first_page.items.len(), 2);

        let cursor = FavoriteMessagesListCursor::Keyset {
            favorited_at: first_page.items[1].favorited_at.clone(),
            favorite_id: first_page.items[1].favorite_id.clone(),
        };
        let second_page = service
            .message_favorites_window_for_principal(MessageFavoritesWindowQuery {
                tenant_id: "100001",
                organization_id: "default",
                principal_kind: "user",
                principal_id: "1",
                limit: 2,
                cursor,
                favorite_type: None,
                search_query: None,
            })
            .expect("second favorites page");
        assert_ne!(second_page.page_info.has_more, Some(true));
        assert_eq!(second_page.items.len(), 1);
    }

    #[test]
    fn favorite_messages_filtered_index_window_avoids_full_principal_collect() {
        let service = ConversationStateService::default();
        for (message_id, favorite_type) in [("m1", "message"), ("m2", "link"), ("m3", "message")] {
            service.create_message_favorite(
                "100001",
                "default",
                "user",
                "1",
                message_id,
                FavoriteMessageRequest {
                    conversation_id: "c1".into(),
                    favorite_type: favorite_type.into(),
                    title: String::new(),
                    content_preview: String::new(),
                    source_display_name: String::new(),
                },
            );
        }

        let filtered = service
            .message_favorites_window_for_principal(MessageFavoritesWindowQuery {
                tenant_id: "100001",
                organization_id: "default",
                principal_kind: "user",
                principal_id: "1",
                limit: 10,
                cursor: FavoriteMessagesListCursor::Start,
                favorite_type: Some("message"),
                search_query: None,
            })
            .expect("filtered favorites page");
        assert_eq!(filtered.items.len(), 2);
        assert!(
            filtered
                .items
                .iter()
                .all(|favorite| favorite.favorite_type == "message")
        );
    }
}

#[cfg(test)]
mod authority_tests {
    use std::sync::Mutex;

    use im_platform_contracts::{
        ContractError, MessageFavoritePage, MessageFavoritePageCursor, MessageFavoriteRecord,
        MessageFavoriteStore,
    };

    use super::{
        ConversationStateService, FavoriteMessageRequest, FavoriteMessagesListCursor,
        MessageFavoritesWindowQuery,
    };

    const TEST_CURSOR_SECRET_ENV: &str = "SDKWORK_IM_CONVERSATION_STATE_CURSOR_HS256_SECRET";

    struct CursorSecretGuard {
        _lock: std::sync::MutexGuard<'static, ()>,
        previous: Option<String>,
    }

    impl CursorSecretGuard {
        fn set() -> Self {
            let lock = crate::conversation_state::lock_conversation_state_test_environment();
            let previous = std::env::var(TEST_CURSOR_SECRET_ENV).ok();
            #[allow(unsafe_code)]
            unsafe {
                std::env::set_var(
                    TEST_CURSOR_SECRET_ENV,
                    "favorites-authority-test-secret-at-least-32-bytes",
                );
            }
            Self {
                _lock: lock,
                previous,
            }
        }
    }

    impl Drop for CursorSecretGuard {
        fn drop(&mut self) {
            #[allow(unsafe_code)]
            unsafe {
                match &self.previous {
                    Some(value) => std::env::set_var(TEST_CURSOR_SECRET_ENV, value),
                    None => std::env::remove_var(TEST_CURSOR_SECRET_ENV),
                }
            }
        }
    }

    #[derive(Default)]
    struct FakeFavoriteStore {
        page: Mutex<Option<MessageFavoritePage>>,
        deleted: Mutex<bool>,
        create_seq: Mutex<Option<u64>>,
    }

    impl MessageFavoriteStore for FakeFavoriteStore {
        fn list_favorites(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            _principal_kind: &str,
            _principal_id: &str,
            _cursor: Option<&MessageFavoritePageCursor>,
            _limit: usize,
            _favorite_type: Option<&str>,
            _search: Option<&str>,
        ) -> Result<MessageFavoritePage, ContractError> {
            Ok(self
                .page
                .lock()
                .expect("page lock")
                .take()
                .unwrap_or(MessageFavoritePage {
                    items: Vec::new(),
                    next_cursor: None,
                    has_more: false,
                }))
        }

        fn create_favorite(
            &self,
            mut record: MessageFavoriteRecord,
        ) -> Result<Option<MessageFavoriteRecord>, ContractError> {
            let Some(seq) = *self.create_seq.lock().expect("seq lock") else {
                return Ok(None);
            };
            record.message_seq = seq;
            Ok(Some(record))
        }

        fn delete_favorite(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            _principal_kind: &str,
            _principal_id: &str,
            _favorite_id: &str,
        ) -> Result<bool, ContractError> {
            Ok(*self.deleted.lock().expect("deleted lock"))
        }
    }

    fn record(favorite_id: &str, favorited_at: &str) -> MessageFavoriteRecord {
        MessageFavoriteRecord {
            tenant_id: "100001".into(),
            organization_id: "0".into(),
            principal_kind: "user".into(),
            principal_id: "1".into(),
            favorite_id: favorite_id.into(),
            favorite_type: "message".into(),
            conversation_id: "c_fav".into(),
            message_id: "9001".into(),
            message_seq: 3,
            title: "title".into(),
            content_preview: "preview".into(),
            source_display_name: "Alice".into(),
            favorited_at: favorited_at.into(),
        }
    }

    #[test]
    fn favorites_page_maps_durable_rows_and_emits_cursor() {
        let _cursor_secret = CursorSecretGuard::set();
        let store = FakeFavoriteStore::default();
        *store.page.lock().expect("page lock") = Some(MessageFavoritePage {
            items: vec![
                record("fav_1", "2026-10-20T02:00:00.000Z"),
                record("fav_2", "2026-10-20T01:00:00.000Z"),
            ],
            next_cursor: Some(MessageFavoritePageCursor {
                favorited_at: "2026-10-20T01:00:00.000Z".into(),
                favorite_id: "fav_2".into(),
            }),
            has_more: true,
        });
        let service = ConversationStateService::default();

        let window = service
            .message_favorites_window_from_authority(
                &store,
                MessageFavoritesWindowQuery {
                    tenant_id: "100001",
                    organization_id: "0",
                    principal_kind: "user",
                    principal_id: "1",
                    limit: 2,
                    cursor: FavoriteMessagesListCursor::Start,
                    favorite_type: None,
                    search_query: None,
                },
            )
            .expect("durable favorites page");
        assert_eq!(window.items.len(), 2);
        assert_eq!(window.items[0].favorite_id, "fav_1");
        assert_eq!(window.items[0].message_seq, 3);
        assert_eq!(window.page_info.has_more, Some(true));
        assert!(window.page_info.next_cursor.is_some());
    }

    #[test]
    fn create_and_delete_favorite_use_the_durable_store() {
        let store = FakeFavoriteStore::default();
        *store.create_seq.lock().expect("seq lock") = Some(7);
        *store.deleted.lock().expect("deleted lock") = true;
        let service = ConversationStateService::default();

        let created = service
            .create_message_favorite_in_authority(
                &store,
                "100001",
                "0",
                "user",
                "1",
                "9001",
                FavoriteMessageRequest {
                    conversation_id: "c_fav".into(),
                    favorite_type: "message".into(),
                    title: "title".into(),
                    content_preview: "preview".into(),
                    source_display_name: "Alice".into(),
                },
            )
            .expect("durable favorite create")
            .expect("favorite view");
        assert_eq!(created.favorite_id, "fav_1_9001");
        assert_eq!(created.message_seq, 7);

        let deleted = service
            .delete_message_favorite_in_authority(&store, "100001", "0", "user", "1", "fav_1_9001")
            .expect("durable favorite delete");
        assert!(deleted);
    }
}

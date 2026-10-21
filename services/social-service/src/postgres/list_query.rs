//! Shared list query types for social-service Postgres HTTP handlers.

use im_adapters_social_postgres::wire_id::parse_social_entity_id;
use sdkwork_im_keyset_cursor::{CursorScope, KeysetCursorError, decode_keyset_cursor};
use sdkwork_routes_web_framework_backend_api::response::ApiProblem;

pub use sdkwork_utils_rust::SdkWorkCursorListQuery as ListQuery;

/// Keyset page parameters for social-service list queries.
///
/// Uses `(created_at DESC, entity_id DESC)` keyset cursor instead of OFFSET
/// to satisfy `PAGINATION_SPEC.md` §2 (no unbounded collect then skip/take).
#[derive(Clone, Debug)]
pub struct KeysetPageParams {
    pub page_size: usize,
    pub cursor_created_at: Option<String>,
    pub cursor_block_id: Option<i64>,
    pub cursor_direct_chat_id: Option<i64>,
}

impl KeysetPageParams {
    /// SQL LIMIT value: `page_size + 1` to detect `has_more` without a separate COUNT query.
    pub fn fetch_limit(&self) -> i64 {
        i64::try_from(self.page_size.saturating_add(1)).unwrap_or(i64::MAX)
    }
}

/// Resolve keyset page parameters from the standard `SdkWorkCursorListQuery`.
///
/// `scope` binds the opaque cursor to one list and one caller; unsigned
/// `created_at|entity_id` tokens are rejected.
pub fn resolve_keyset_page(
    query: &ListQuery,
    scope: &CursorScope<'_>,
) -> Result<KeysetPageParams, ApiProblem> {
    let page_size = query.resolve_page_size().map_err(|_| {
        ApiProblem::bad_request("page_size must be between 1 and 200")
    })?;

    let (cursor_created_at, cursor_entity_id) = match query
        .cursor
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        Some(cursor) => {
            let position = decode_keyset_cursor(scope, cursor)
                .map_err(|error: KeysetCursorError| ApiProblem::bad_request(error.to_string()))?;
            (Some(position.sort_value), Some(position.entity_id))
        }
        None => (None, None),
    };

    let cursor_entity_id = cursor_entity_id
        .as_deref()
        .map(parse_social_entity_id)
        .transpose()
        .map_err(|_| {
            ApiProblem::bad_request(
                "cursor entity_id must be a canonical positive signed int64 string",
            )
        })?;

    Ok(KeysetPageParams {
        page_size,
        cursor_created_at,
        cursor_block_id: cursor_entity_id,
        cursor_direct_chat_id: cursor_entity_id,
    })
}

#[cfg(test)]
mod tests {
    use super::{CursorScope, ListQuery, resolve_keyset_page};
    use sdkwork_im_keyset_cursor::{KeysetPosition, encode_keyset_cursor};

    static ENV_LOCK: std::sync::Mutex<()> = std::sync::Mutex::new(());

    struct TestEnvironment {
        previous: Option<String>,
        _guard: std::sync::MutexGuard<'static, ()>,
    }

    impl TestEnvironment {
        fn new() -> Self {
            let guard = ENV_LOCK.lock().expect("social list env lock");
            let previous = std::env::var("SDKWORK_IM_ENVIRONMENT").ok();
            #[allow(unsafe_code)]
            // SAFETY: ENV_LOCK serializes mutations in this module.
            unsafe {
                std::env::set_var("SDKWORK_IM_ENVIRONMENT", "test");
            }
            Self {
                previous,
                _guard: guard,
            }
        }
    }

    impl Drop for TestEnvironment {
        fn drop(&mut self) {
            #[allow(unsafe_code)]
            // SAFETY: ENV_LOCK is still held.
            unsafe {
                match &self.previous {
                    Some(value) => std::env::set_var("SDKWORK_IM_ENVIRONMENT", value),
                    None => std::env::remove_var("SDKWORK_IM_ENVIRONMENT"),
                }
            }
        }
    }

    fn scope() -> CursorScope<'static> {
        CursorScope {
            resource: "social.user_blocks",
            tenant_id: "100001",
            organization_id: "100001",
            principal_id: "42",
        }
    }

    #[test]
    fn rejects_unsigned_cursor_entity_ids() {
        let _environment = TestEnvironment::new();
        for entity_id in ["0", "01", "-1", "block_1", "9223372036854775808"] {
            let query = ListQuery {
                cursor: Some(format!("2026-07-24T00:00:00Z|{entity_id}")),
                ..Default::default()
            };
            assert!(
                resolve_keyset_page(&query, &scope()).is_err(),
                "unsigned cursor entity id {entity_id:?} must be rejected"
            );
        }
    }

    #[test]
    fn decodes_signed_cursor_and_rejects_foreign_scope() {
        let _environment = TestEnvironment::new();
        let position = KeysetPosition {
            sort_value: "2026-07-24T00:00:00Z".into(),
            entity_id: "330339707122622464".into(),
        };
        let cursor = encode_keyset_cursor(&scope(), &position).expect("encode cursor");
        let query = ListQuery {
            cursor: Some(cursor),
            ..Default::default()
        };

        let paging = resolve_keyset_page(&query, &scope()).expect("canonical cursor");

        assert_eq!(paging.cursor_block_id, Some(330339707122622464));
        assert_eq!(paging.cursor_direct_chat_id, Some(330339707122622464));

        let foreign = CursorScope {
            resource: "social.direct_chats",
            ..scope()
        };
        assert!(resolve_keyset_page(&query, &foreign).is_err());
    }

    #[test]
    fn rejects_out_of_range_page_size_instead_of_clamping() {
        let _environment = TestEnvironment::new();
        for page_size in [0, 201, 1000] {
            let query = ListQuery {
                page_size: Some(page_size),
                ..Default::default()
            };
            assert!(
                resolve_keyset_page(&query, &scope()).is_err(),
                "page_size={page_size} must be rejected"
            );
        }
        let query = ListQuery {
            page_size: Some(200),
            ..Default::default()
        };
        assert_eq!(
            resolve_keyset_page(&query, &scope())
                .expect("max page size")
                .page_size,
            200
        );
    }
}

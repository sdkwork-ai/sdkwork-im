//! Shared list query types for space-service HTTP handlers.
//!
//! All space-service list endpoints use keyset pagination (`(sort_value, entity_id)`
//! cursor) instead of OFFSET, per `PAGINATION_SPEC.md` §2 (no unbounded collect then
//! skip/take in process memory). Cursors are opaque signed tokens bound to the
//! list resource and the caller's tenant/organization/principal scope.

use sdkwork_im_keyset_cursor::{CursorScope, KeysetCursorError, decode_keyset_cursor};
use sdkwork_routes_web_framework_backend_api::response::ApiProblem;

pub use sdkwork_utils_rust::SdkWorkCursorListQuery as ListQuery;

/// Keyset page parameters for space-service list queries.
///
/// Uses `(sort_value, entity_id)` keyset cursor instead of OFFSET to satisfy
/// `PAGINATION_SPEC.md` §2. `sort_value` is typically `created_at` or `joined_at`,
/// while `entity_id` is the primary key of the listed entity.
#[derive(Clone, Debug)]
pub struct KeysetPageParams {
    pub page_size: usize,
    pub cursor_sort_value: Option<String>,
    pub cursor_entity: Option<String>,
}

impl KeysetPageParams {
    /// SQL LIMIT value: `page_size + 1` to detect `has_more` without a separate COUNT query.
    pub fn fetch_limit(&self) -> i64 {
        i64::try_from(self.page_size.saturating_add(1)).unwrap_or(i64::MAX)
    }
}

fn invalid_cursor(error: KeysetCursorError) -> ApiProblem {
    ApiProblem::bad_request(error.to_string())
}

/// Resolve keyset page parameters from the standard `SdkWorkCursorListQuery`.
///
/// `scope` binds the cursor to one list and one caller; a cursor minted for a
/// different resource, tenant, organization, or principal is rejected.
pub fn resolve_keyset_page(
    query: &ListQuery,
    scope: &CursorScope<'_>,
) -> Result<KeysetPageParams, ApiProblem> {
    // PAGINATION_SPEC §10.1: reject out-of-range page_size instead of silently
    // clamping, so clients cannot mistake a truncated page for their request.
    let page_size = query
        .resolve_page_size()
        .map_err(|_| ApiProblem::bad_request("page_size must be between 1 and 200"))?;

    let (cursor_sort_value, cursor_entity) = match query
        .cursor
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
    {
        Some(cursor) => {
            let position = decode_keyset_cursor(scope, cursor).map_err(invalid_cursor)?;
            (Some(position.sort_value), Some(position.entity_id))
        }
        None => (None, None),
    };

    Ok(KeysetPageParams {
        page_size,
        cursor_sort_value,
        cursor_entity,
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
            let guard = ENV_LOCK.lock().expect("space list env lock");
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
            resource: "space.spaces",
            tenant_id: "100001",
            organization_id: "100001",
            principal_id: "42",
        }
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

    #[test]
    fn decodes_scope_bound_cursor_and_rejects_foreign_or_forged_tokens() {
        let _environment = TestEnvironment::new();
        let position = KeysetPosition {
            sort_value: "2026-10-21T00:00:00Z".into(),
            entity_id: "330339707122622464".into(),
        };
        let cursor = encode_keyset_cursor(&scope(), &position).expect("encode cursor");
        let query = ListQuery {
            cursor: Some(cursor.clone()),
            ..Default::default()
        };
        let paging = resolve_keyset_page(&query, &scope()).expect("own cursor");
        assert_eq!(
            paging.cursor_sort_value.as_deref(),
            Some("2026-10-21T00:00:00Z")
        );
        assert_eq!(
            paging.cursor_entity.as_deref(),
            Some("330339707122622464")
        );

        let foreign = CursorScope {
            resource: "space.members",
            ..scope()
        };
        assert!(resolve_keyset_page(&query, &foreign).is_err());

        let forged = ListQuery {
            cursor: Some("2026-10-21T00:00:00Z|330339707122622464".into()),
            ..Default::default()
        };
        assert!(resolve_keyset_page(&forged, &scope()).is_err());
    }
}

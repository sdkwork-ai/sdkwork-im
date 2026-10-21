//! HTTP operator surfaces for shared-channel sync runtime control.

use axum::extract::{Extension, Query, State};
use axum::response::Response;
use axum::{Json, Router};
use im_app_context::AppContext;
use sdkwork_utils_rust::{SdkWorkCursorListQuery, SdkWorkPageData, cursor_list_page_data};
use sdkwork_web_core::WebRequestContext;
use serde::Deserialize;

use crate::api_payload::resource_item;
use crate::control_access::{ensure_control_read_access, ensure_control_write_access};
use crate::envelope::finish_enveloped_json;
use crate::friendship::{
    AppState, SocialServiceError, decode_signed_inventory_cursor_payload,
    encode_signed_inventory_cursor,
};
use crate::shared_channel_sync_runtime::SharedChannelSyncOwnerConflict;

fn paginate_inventory<T, F>(
    items: Vec<T>,
    query: &SdkWorkCursorListQuery,
    resource: &str,
    auth: &AppContext,
    key_of: F,
) -> Result<SdkWorkPageData<T>, SocialServiceError>
where
    F: Fn(&T) -> &str,
{
    let page_size = query.resolve_page_size().map_err(|_| {
        SocialServiceError::invalid("invalid_parameter", "page_size must be between 1 and 200")
    })?;
    let scope = format!(
        "social.shared_channel_sync.{resource}:{}:{}:{}",
        auth.tenant_id, auth.organization_id, auth.actor_id
    );
    let after = match query.cursor.as_deref().map(str::trim).filter(|value| !value.is_empty()) {
        Some(cursor) => {
            let payload = decode_signed_inventory_cursor_payload(cursor)?;
            if payload.get("scope").and_then(serde_json::Value::as_str) != Some(scope.as_str()) {
                return Err(SocialServiceError::invalid(
                    "cursor_invalid",
                    "inventory cursor scope does not match the request",
                ));
            }
            Some(
                payload
                    .get("after")
                    .and_then(serde_json::Value::as_str)
                    .filter(|value| !value.is_empty())
                    .ok_or_else(|| {
                        SocialServiceError::invalid(
                            "cursor_invalid",
                            "inventory cursor position is missing",
                        )
                    })?
                    .to_owned(),
            )
        }
        None => None,
    };
    let mut keyed: Vec<(String, T)> = items
        .into_iter()
        .map(|item| (key_of(&item).to_owned(), item))
        .collect();
    keyed.sort_by(|left, right| left.0.cmp(&right.0));
    if let Some(after) = after.as_deref() {
        keyed.retain(|(key, _)| key.as_str() > after);
    }
    let has_more = keyed.len() > page_size;
    if has_more {
        keyed.truncate(page_size);
    }
    let next_cursor = if has_more {
        keyed
            .last()
            .map(|(key, _)| {
                encode_signed_inventory_cursor(&serde_json::json!({
                    "scope": scope,
                    "after": key,
                }))
            })
            .transpose()?
    } else {
        None
    };
    Ok(cursor_list_page_data(
        keyed.into_iter().map(|(_, item)| item).collect(),
        page_size,
        next_cursor,
        has_more,
    ))
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct TargetedRequestKeysBody {
    pub request_keys: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct TargetedTakeoverBody {
    pub request_keys: Vec<String>,
    #[serde(default)]
    pub legacy_override: bool,
}

pub fn build_runtime_control_routes() -> Router<AppState> {
    Router::new()
        .route(
            "/backend/v3/api/control/social/runtime/pending_shared_channel_sync",
            axum::routing::get(list_pending_shared_channel_sync),
        )
        .route(
            "/backend/v3/api/control/social/runtime/dead_letter_shared_channel_sync",
            axum::routing::get(list_dead_letter_shared_channel_sync),
        )
        .route(
            "/backend/v3/api/control/social/runtime/delivered_shared_channel_sync",
            axum::routing::get(list_delivered_shared_channel_sync),
        )
        .route(
            "/backend/v3/api/control/social/runtime/delivery_state_shared_channel_sync",
            axum::routing::get(list_delivery_state_shared_channel_sync),
        )
        .route(
            "/backend/v3/api/control/social/runtime/reclaim_stale_pending_shared_channel_sync",
            axum::routing::post(reclaim_stale_pending_shared_channel_sync),
        )
        .route(
            "/backend/v3/api/control/social/runtime/repair_derived_snapshot",
            axum::routing::post(repair_derived_snapshot),
        )
        .route(
            "/backend/v3/api/control/social/runtime/repair_shared_channel_sync",
            axum::routing::post(repair_shared_channel_sync),
        )
        .route(
            "/backend/v3/api/control/social/runtime/requeue_dead_letter_shared_channel_sync",
            axum::routing::post(requeue_dead_letter_shared_channel_sync),
        )
        .route(
            "/backend/v3/api/control/social/runtime/requeue_dead_letter_shared_channel_sync_targeted",
            axum::routing::post(requeue_dead_letter_shared_channel_sync_targeted),
        )
        .route(
            "/backend/v3/api/control/social/runtime/claim_pending_shared_channel_sync_targeted",
            axum::routing::post(claim_pending_shared_channel_sync_targeted),
        )
        .route(
            "/backend/v3/api/control/social/runtime/release_pending_shared_channel_sync_targeted",
            axum::routing::post(release_pending_shared_channel_sync_targeted),
        )
        .route(
            "/backend/v3/api/control/social/runtime/takeover_pending_shared_channel_sync_targeted",
            axum::routing::post(takeover_pending_shared_channel_sync_targeted),
        )
        .route(
            "/backend/v3/api/control/social/runtime/republish_pending_shared_channel_sync_targeted",
            axum::routing::post(republish_pending_shared_channel_sync_targeted),
        )
}

async fn list_pending_shared_channel_sync(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Query(query): Query<SdkWorkCursorListQuery>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_read_access(&auth)?;
        let inventory = state.social_runtime.pending_shared_channel_sync_inventory(
            auth.actor_id.as_str(),
            auth.actor_kind.as_str(),
        );
        paginate_inventory(
            inventory.items,
            &query,
            "pending",
            &auth,
            |item| item.request_key.as_str(),
        )
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn list_dead_letter_shared_channel_sync(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Query(query): Query<SdkWorkCursorListQuery>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_read_access(&auth)?;
        let inventory = state
            .social_runtime
            .dead_letter_shared_channel_sync_inventory(
                auth.actor_id.as_str(),
                auth.actor_kind.as_str(),
            );
        paginate_inventory(
            inventory.items,
            &query,
            "dead_letter",
            &auth,
            |item| item.request_key.as_str(),
        )
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn list_delivered_shared_channel_sync(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Query(query): Query<SdkWorkCursorListQuery>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_read_access(&auth)?;
        let inventory = state
            .social_runtime
            .delivered_shared_channel_sync_inventory();
        paginate_inventory(
            inventory.items,
            &query,
            "delivered",
            &auth,
            |item| item.request_key.as_str(),
        )
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn list_delivery_state_shared_channel_sync(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_read_access(&auth)?;
        let inventory = state
            .social_runtime
            .delivery_state_shared_channel_sync_inventory();
        Ok(resource_item(inventory))
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn reclaim_stale_pending_shared_channel_sync(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .reclaim_stale_pending_shared_channel_sync_claims_persisted()
            .map(resource_item)
            .map_err(|error| {
                SocialServiceError::invalid("shared_channel_sync_reclaim_failed", error)
            })
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn repair_derived_snapshot(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .repair_derived_snapshot()
            .map(resource_item)
            .map_err(|error| {
                SocialServiceError::invalid("derived_snapshot_repair_failed", error)
            })
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn repair_shared_channel_sync(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .repair_shared_channel_sync()
            .map(resource_item)
            .map_err(|error| {
                SocialServiceError::invalid("shared_channel_sync_repair_failed", error)
            })
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn requeue_dead_letter_shared_channel_sync(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .requeue_dead_letter_shared_channel_sync_persisted(None)
            .map(resource_item)
            .map_err(|error| {
                SocialServiceError::invalid("shared_channel_sync_requeue_failed", error)
            })
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn requeue_dead_letter_shared_channel_sync_targeted(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Json(body): Json<TargetedRequestKeysBody>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .requeue_dead_letter_shared_channel_sync_persisted(Some(body.request_keys.as_slice()))
            .map(resource_item)
            .map_err(|error| {
                SocialServiceError::invalid("shared_channel_sync_requeue_failed", error)
            })
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn claim_pending_shared_channel_sync_targeted(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Json(body): Json<TargetedRequestKeysBody>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .claim_pending_shared_channel_sync_targeted_persisted(
                body.request_keys.as_slice(),
                auth.actor_id.as_str(),
                auth.actor_kind.as_str(),
            )
            .map(resource_item)
            .map_err(owner_conflict_into_service_error)
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn release_pending_shared_channel_sync_targeted(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Json(body): Json<TargetedRequestKeysBody>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .release_pending_shared_channel_sync_targeted_persisted(
                body.request_keys.as_slice(),
                auth.actor_id.as_str(),
                auth.actor_kind.as_str(),
            )
            .map(resource_item)
            .map_err(owner_conflict_into_service_error)
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn takeover_pending_shared_channel_sync_targeted(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Json(body): Json<TargetedTakeoverBody>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .takeover_pending_shared_channel_sync_targeted_persisted(
                body.request_keys.as_slice(),
                auth.actor_id.as_str(),
                auth.actor_kind.as_str(),
                body.legacy_override,
            )
            .map(resource_item)
            .map_err(owner_conflict_into_service_error)
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

async fn republish_pending_shared_channel_sync_targeted(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Json(body): Json<TargetedRequestKeysBody>,
) -> Response {
    let result = crate::envelope::run_blocking_social_call(state, move |state| {
        ensure_control_write_access(&auth)?;
        state
            .social_runtime
            .republish_pending_shared_channel_sync_targeted(
                auth.actor_id.as_str(),
                auth.actor_kind.as_str(),
                body.request_keys,
            )
            .map(resource_item)
            .map_err(owner_conflict_into_service_error)
    })
    .await;
    finish_enveloped_json(&ctx, result)
}

fn owner_conflict_into_service_error(error: SharedChannelSyncOwnerConflict) -> SocialServiceError {
    SocialServiceError::conflict_with_details(error.code, error.message, error.details)
}

#[cfg(test)]
mod tests {
    use super::{SdkWorkCursorListQuery as ListQuery, paginate_inventory};
    use im_app_context::local_service_app_context;

    struct Row(&'static str);

    struct TestEnvironment {
        previous: Option<String>,
        _guard: std::sync::MutexGuard<'static, ()>,
    }

    impl TestEnvironment {
        fn new() -> Self {
            let guard = crate::friend_request_rate_limit::social_service_test_env_lock();
            let previous = std::env::var("SDKWORK_IM_ENVIRONMENT").ok();
            #[allow(unsafe_code)]
            // SAFETY: the shared social-service env lock serializes mutations.
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
            // SAFETY: the shared social-service env lock is still held.
            unsafe {
                match &self.previous {
                    Some(value) => std::env::set_var("SDKWORK_IM_ENVIRONMENT", value),
                    None => std::env::remove_var("SDKWORK_IM_ENVIRONMENT"),
                }
            }
        }
    }

    fn auth() -> im_app_context::AppContext {
        local_service_app_context("100001", "42", "user", None, ["*"])
    }

    fn rows(keys: &[&'static str]) -> Vec<Row> {
        keys.iter().map(|key| Row(key)).collect()
    }

    #[test]
    fn inventory_pages_are_keyset_and_cursor_bound() {
        let _environment = TestEnvironment::new();
        let query = ListQuery {
            page_size: Some(2),
            ..Default::default()
        };
        let first = paginate_inventory(
            rows(&["c", "a", "b"]),
            &query,
            "pending",
            &auth(),
            |row| row.0,
        )
        .expect("first inventory page");
        assert_eq!(first.items.len(), 2);
        assert_eq!(first.items[0].0, "a");
        assert_eq!(first.items[1].0, "b");
        assert_eq!(first.page_info.has_more, Some(true));
        let cursor = first
            .page_info
            .next_cursor
            .clone()
            .expect("first page cursor");

        let next_query = ListQuery {
            page_size: Some(2),
            cursor: Some(cursor),
            ..Default::default()
        };
        let second = paginate_inventory(
            rows(&["c", "a", "b"]),
            &next_query,
            "pending",
            &auth(),
            |row| row.0,
        )
        .expect("second inventory page");
        assert_eq!(second.items.len(), 1);
        assert_eq!(second.items[0].0, "c");
        assert_eq!(second.page_info.has_more, Some(false));
    }

    #[test]
    fn inventory_rejects_out_of_range_page_size_and_foreign_cursor() {
        let _environment = TestEnvironment::new();
        let too_large = ListQuery {
            page_size: Some(201),
            ..Default::default()
        };
        assert!(
            paginate_inventory(rows(&["a"]), &too_large, "pending", &auth(), |row| row.0).is_err()
        );

        let cursor_query = ListQuery {
            page_size: Some(1),
            ..Default::default()
        };
        let cursor = paginate_inventory(
            rows(&["a", "b"]),
            &cursor_query,
            "pending",
            &auth(),
            |row| row.0,
        )
        .expect("cursor page")
        .page_info
        .next_cursor
        .expect("cursor");
        let foreign = ListQuery {
            page_size: Some(1),
            cursor: Some(cursor),
            ..Default::default()
        };
        assert!(
            paginate_inventory(rows(&["a", "b"]), &foreign, "delivered", &auth(), |row| row.0)
                .is_err()
        );
    }
}

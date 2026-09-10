use std::sync::Arc;

use axum::extract::Extension;
use axum::http::HeaderMap;
use im_app_context::AppContext;

use crate::client_route_registration::ClientRouteRegistration;
use crate::{ApiError, AppState, RealtimeDeliveryRuntime, resolve_requested_device_id};

pub(crate) struct RealtimeWebsocketRouteContext {
    pub auth: AppContext,
    pub device_id: String,
    pub runtime: Arc<RealtimeDeliveryRuntime>,
    pub route_owner: ClientRouteRegistration,
}

pub(crate) async fn prepare_realtime_websocket_route(
    auth: Option<Extension<AppContext>>,
    headers: &HeaderMap,
    state: &AppState,
    query_device_id: Option<String>,
) -> Result<RealtimeWebsocketRouteContext, ApiError> {
    let auth = crate::resolve_request_app_context(auth, headers, &state.auth_resolver).await?;
    let device_id = resolve_requested_device_id(&auth, query_device_id)?;
    // Route bind performs blocking Redis/Postgres IO (with bounded
    // retry backoff); run it on the blocking pool so an upgrade storm
    // cannot stall the async reactor threads.
    let blocking_state = state.clone();
    let blocking_auth = auth.clone();
    let blocking_device_id = device_id.clone();
    tokio::task::spawn_blocking(move || {
        blocking_state.prepare_active_client_route(
            &blocking_auth,
            blocking_device_id.as_str(),
            "websocket",
            false,
        )
    })
    .await
    .map_err(|error| {
        ApiError::internal(
            "route_bind_join_failed",
            format!("route bind task failed: {error}"),
        )
    })??;
    Ok(RealtimeWebsocketRouteContext {
        auth,
        device_id,
        runtime: state.realtime_runtime.clone(),
        route_owner: state.client_route_registration.clone(),
    })
}

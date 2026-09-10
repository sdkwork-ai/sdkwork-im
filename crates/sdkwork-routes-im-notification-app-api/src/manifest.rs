use sdkwork_web_contract::{HttpMethod, HttpRoute};
use sdkwork_web_core::HttpRouteManifest;

use crate::paths;

/// API surface: app-api
pub const API_SURFACE: &str = "app-api";

/// `notification.prefix` (GET /app/v3/api/notifications) doubles as the list
/// operation documented as `notifications.list`; the mount descriptor entry
/// keeps the group root addressable in the gateway manifest.
///
/// The operation ids mirror the authored
/// `apis/app-api/communication/sdkwork-im-app-api.openapi.yaml` entries so
/// the interceptor pipeline admits them.
pub const ROUTES: &[HttpRoute] = &[
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::PREFIX,
        "notification",
        "notifications.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::REQUESTS,
        "notification",
        "notifications.requests.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::NOTIFICATION,
        "notification",
        "notifications.retrieve",
    ),
];

pub fn route_manifest() -> HttpRouteManifest {
    HttpRouteManifest::new(ROUTES)
}

use sdkwork_web_contract::{HttpMethod, HttpRoute};
use sdkwork_web_core::HttpRouteManifest;

use crate::paths;

/// API surface: app-api
pub const API_SURFACE: &str = "app-api";

/// Media app-api route inventory.
///
/// A bound route manifest is the auth-profile authority: every path mounted by
/// `media_service::build_domain_api_router` must be declared here, otherwise the
/// framework interceptor answers 404 ("route-not-in-manifest"). The previous
/// entry declared the bare group root (`media.prefix`), which is not mounted and
/// left the real `mediaHealth.retrieve` operation undeclared.
pub const ROUTES: &[HttpRoute] = &[HttpRoute::dual_token(
    HttpMethod::Get,
    paths::PROVIDER_HEALTH,
    "provider",
    "mediaHealth.retrieve",
)];

pub fn route_manifest() -> HttpRouteManifest {
    HttpRouteManifest::new(ROUTES)
}

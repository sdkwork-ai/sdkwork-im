use sdkwork_web_contract::{HttpMethod, HttpRoute};
use sdkwork_web_core::HttpRouteManifest;

use crate::paths;

/// API surface: backend-api
pub const API_SURFACE: &str = "backend-api";

/// `audit.prefix` (GET /backend/v3/api/audit) is a mount descriptor for the
/// audit API group, not a real HTTP operation: `audit_service::
/// build_domain_api_router` registers no handler at the group root (only
/// `/records`, `/export`, and `/verify`). It is therefore not a documented
/// operation in
/// `apis/backend-api/communication/sdkwork-im-backend-api.openapi.yaml`.
/// It must not be documented with the id `audit.prefix` because the root
/// segment would duplicate the `audit` tag and fail the
/// `check-api-operation-patterns` operation-id/tag rule.
///
/// The `/records` and `/export` operation ids mirror
/// `audit.records.create|audit.records.list|audit.export.retrieve` in the
/// authored backend OpenAPI so the interceptor pipeline admits them.
pub const ROUTES: &[HttpRoute] = &[
    // Mount descriptor only; see the route-coverage note above.
    HttpRoute::dual_token(HttpMethod::Get, paths::PREFIX, "audit", "audit.prefix"),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::RECORDS,
        "audit",
        "audit.records.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::RECORDS,
        "audit",
        "audit.records.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::EXPORT,
        "audit",
        "audit.export.retrieve",
    ),
    HttpRoute::dual_token(HttpMethod::Get, paths::VERIFY, "audit", "verify.retrieve"),
];

pub fn route_manifest() -> HttpRouteManifest {
    HttpRouteManifest::new(ROUTES)
}

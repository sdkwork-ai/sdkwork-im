/// Mount root of the media app-api surface.
///
/// The group root is not itself an operation; only concrete child routes are
/// declared in the route manifest so the manifest-derived OpenAPI/permission
/// catalog never advertises an unmounted path.
pub const PREFIX: &str = "/app/v3/api/media";

/// Media provider health operation (`mediaHealth.retrieve`).
///
/// Declared in `apis/app-api/communication/sdkwork-im-app-api.openapi.yaml` and
/// mounted by `media_service::build_domain_api_router`.
pub const PROVIDER_HEALTH: &str = "/app/v3/api/media/provider_health";

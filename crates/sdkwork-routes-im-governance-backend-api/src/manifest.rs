use sdkwork_web_contract::{HttpMethod, HttpRoute};
use sdkwork_web_core::HttpRouteManifest;

use crate::paths;

/// API surface: backend-api
pub const API_SURFACE: &str = "backend-api";

pub const ROUTES: &[HttpRoute] = &[
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::AUTOMATION_GOVERNANCE,
        "automation",
        "governance.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::PROTOCOL_REGISTRY,
        "governance",
        "protocolRegistry.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::PROTOCOL_GOVERNANCE,
        "governance",
        "protocolGovernance.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::PROVIDER_REGISTRY,
        "governance",
        "providerRegistry.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::PROVIDER_BINDINGS,
        "governance",
        "control.providerBindings.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::PROVIDER_BINDINGS,
        "governance",
        "control.providerBindings.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::PROVIDER_POLICIES,
        "governance",
        "providerPolicies.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        paths::PROVIDER_POLICIES_DIFF,
        "governance",
        "providerPolicies.diff.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::PROVIDER_POLICIES_PREVIEW,
        "governance",
        "providerPolicies.preview",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::PROVIDER_POLICIES_ROLLBACK,
        "governance",
        "providerPolicies.rollback",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::NODE_DRAIN,
        "governance",
        "governance.nodes.drain.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::NODE_ACTIVATE,
        "governance",
        "governance.nodes.activate.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        paths::NODE_ROUTES_MIGRATE,
        "governance",
        "governance.nodes.routes.migrate.create",
    ),
];

pub fn route_manifest() -> HttpRouteManifest {
    // Defense in depth: route-level permission is enforced by the framework
    // interceptor in addition to handler-level access checks.
    let routes = ROUTES
        .iter()
        .map(|route| {
            let permission = if route.method == HttpMethod::Get {
                "control.read"
            } else {
                "control.write"
            };
            route.with_required_permission(permission)
        })
        .collect::<Vec<_>>();
    HttpRouteManifest::new(&routes)
}

//! Governance backend control-plane route manifest.
//!
//! Lives in the service (not the route crate) because the manifest must be
//! available to the service's own router composition — the interceptor
//! pipeline can only resolve `/backend/v3/api/control/*` operations when it
//! is wrapped with the real route table, and the route crate already depends
//! on this service (a service -> route-crate dependency would be a cycle).

use sdkwork_web_contract::{HttpMethod, HttpRoute};
use sdkwork_web_core::HttpRouteManifest;

pub const AUTOMATION_GOVERNANCE: &str = "/backend/v3/api/automation/governance";
pub const PROTOCOL_REGISTRY: &str = "/backend/v3/api/control/protocol_registry";
pub const PROTOCOL_GOVERNANCE: &str = "/backend/v3/api/control/protocol_governance";
pub const PROVIDER_REGISTRY: &str = "/backend/v3/api/control/provider_registry";
pub const PROVIDER_BINDINGS: &str = "/backend/v3/api/control/provider_bindings";
pub const PROVIDER_POLICIES: &str = "/backend/v3/api/control/provider_policies";
pub const PROVIDER_POLICIES_DIFF: &str = "/backend/v3/api/control/provider_policies/diff";
pub const PROVIDER_POLICIES_PREVIEW: &str = "/backend/v3/api/control/provider_policies/preview";
pub const PROVIDER_POLICIES_ROLLBACK: &str = "/backend/v3/api/control/provider_policies/rollback";
pub const NODE_DRAIN: &str = "/backend/v3/api/control/nodes/{node_id}/drain";
pub const NODE_ACTIVATE: &str = "/backend/v3/api/control/nodes/{node_id}/activate";
pub const NODE_ROUTES_MIGRATE: &str = "/backend/v3/api/control/nodes/{node_id}/routes/migrate";

pub const ROUTES: &[HttpRoute] = &[
    HttpRoute::dual_token(
        HttpMethod::Get,
        AUTOMATION_GOVERNANCE,
        "automation",
        "automation.governance.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        PROTOCOL_REGISTRY,
        "governance",
        "governance.protocolRegistry.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        PROTOCOL_GOVERNANCE,
        "governance",
        "governance.protocolGovernance.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        PROVIDER_REGISTRY,
        "governance",
        "governance.providerRegistry.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        PROVIDER_BINDINGS,
        "governance",
        "governance.providerBindings.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        PROVIDER_BINDINGS,
        "governance",
        "governance.providerBindings.upsert",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        PROVIDER_POLICIES,
        "governance",
        "governance.providerPolicies.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        PROVIDER_POLICIES_DIFF,
        "governance",
        "governance.providerPolicies.diff.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        PROVIDER_POLICIES_PREVIEW,
        "governance",
        "governance.providerPolicies.preview.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        PROVIDER_POLICIES_ROLLBACK,
        "governance",
        "governance.providerPolicies.rollback.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        NODE_DRAIN,
        "governance",
        "governance.nodes.drain.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        NODE_ACTIVATE,
        "governance",
        "governance.nodes.activate.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        NODE_ROUTES_MIGRATE,
        "governance",
        "governance.nodes.routes.migrate.create",
    ),
];

pub fn backend_route_manifest() -> HttpRouteManifest {
    HttpRouteManifest::new(ROUTES)
}

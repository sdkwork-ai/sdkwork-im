use std::sync::OnceLock;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use im_app_context::DualTokenRequestBuilderExt;
use tower::ServiceExt;

fn ensure_route_merge_test_environment() {
    static TEST_ENVIRONMENT: OnceLock<()> = OnceLock::new();
    // The workspace lints deny `unsafe_code`; this reviewed test-only
    // process-identity bootstrap site opts back in locally (deny is
    // allow-overrideable), matching the other environment-bootstrap sites in
    // the workspace.
    #[allow(unsafe_code)]
    TEST_ENVIRONMENT.get_or_init(|| {
        // SAFETY: this runs inside a single-threaded test bootstrap helper before
        // any test body reads `SDKWORK_IM_ENVIRONMENT`, so the process-global
        // assignment cannot race with a concurrent environment read.
        unsafe {
            std::env::set_var("SDKWORK_IM_ENVIRONMENT", "test");
        }
    });
}

async fn chat_gateway_mount_for_test() -> axum::Router {
    let state = conversation_runtime::http::default_app_state();
    sdkwork_routes_im_chat_open_api::gateway_mount_with_state(state)
        .await
        .expect("chat gateway mount should complete with explicit test state")
}

#[tokio::test]
async fn chat_router_mounts_conversation_queries_without_duplicate_routes() {
    ensure_route_merge_test_environment();

    let _router = axum::Router::<()>::new().merge(chat_gateway_mount_for_test().await);
}

#[tokio::test]
async fn gateway_domain_routers_merge_without_duplicate_routes() {
    ensure_route_merge_test_environment();

    let _router = axum::Router::<()>::new()
        .merge(sdkwork_routes_im_audit_backend_api::gateway_mount())
        .merge(sdkwork_routes_im_automation_app_api::gateway_mount())
        .merge(sdkwork_routes_im_calls_open_api::gateway_mount())
        .merge(chat_gateway_mount_for_test().await)
        .merge(sdkwork_routes_im_governance_backend_api::gateway_mount())
        .merge(sdkwork_routes_im_media_app_api::gateway_mount())
        .merge(sdkwork_routes_im_notification_app_api::gateway_mount())
        .merge(sdkwork_routes_im_ops_backend_api::gateway_mount())
        .merge(sdkwork_routes_im_portal_app_api::gateway_mount());
}

#[tokio::test]
async fn automation_app_mount_does_not_export_backend_governance() {
    ensure_route_merge_test_environment();

    let response = sdkwork_routes_im_automation_app_api::gateway_mount()
        .oneshot(
            Request::builder()
                .uri("/backend/v3/api/automation/governance")
                // The single-shot context helper is required: the chained
                // `with_dual_token_*` mutators rebuild each request from the
                // fallback context and would silently drop the permission scope.
                .with_dual_token_context("100001", "1", "admin", None, ["automation.read"])
                .body(Body::empty())
                .expect("request should build"),
        )
        .await
        .expect("app mount should return a response");

    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn media_provider_health_is_declared_in_the_route_manifest() {
    ensure_route_merge_test_environment();

    let response = sdkwork_routes_im_media_app_api::gateway_mount()
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/media/provider_health")
                .with_dual_token_context("100001", "1", "user", None, ["media.read"])
                .body(Body::empty())
                .expect("request should build"),
        )
        .await
        .expect("media mount should return a response");

    // A bound route manifest is the auth-profile authority: a mounted path that
    // the manifest does not declare is answered 404 ("route-not-in-manifest").
    assert_ne!(
        response.status(),
        StatusCode::NOT_FOUND,
        "GET /app/v3/api/media/provider_health is mounted but absent from the media route manifest"
    );
}

#[tokio::test]
async fn governance_backend_mount_exports_automation_governance() {
    ensure_route_merge_test_environment();

    let response = sdkwork_routes_im_governance_backend_api::gateway_mount()
        .oneshot(
            Request::builder()
                .uri("/backend/v3/api/automation/governance")
                .with_dual_token_context("100001", "1", "admin", None, ["control.read"])
                .body(Body::empty())
                .expect("request should build"),
        )
        .await
        .expect("backend mount should return a response");

    // Production resolves `permission_scope` server-side from the IAM session
    // row (IAM_SPEC §5.2/§5.6), so a fixture principal without an IAM grant is
    // correctly rejected with 403. The regression this test guards is routing:
    // an undeclared path is answered 404 ("route-not-in-manifest") by the bound
    // manifest before authorization runs.
    assert_ne!(
        response.status(),
        StatusCode::NOT_FOUND,
        "governance backend mount must export /backend/v3/api/automation/governance"
    );
}

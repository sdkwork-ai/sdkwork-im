use axum::body::Body;
use axum::http::{Request, request::Builder};
use im_app_context::DualTokenRequestBuilderExt;

/// Governance tests use local dual-token context helpers instead of real
/// signed orchestration headers; disable the signature gate explicitly so
/// the control plane tests exercise routing logic, not signature validation.
pub fn ensure_control_plane_test_env() {
    unsafe {
        std::env::set_var("SDKWORK_IM_APP_CONTEXT_REQUIRE_SIGNATURE", "false");
    }
}

pub fn control_plane_request_builder(
    method: &str,
    uri: &str,
    user_id: &str,
    actor_kind: &str,
    permission: &str,
) -> Builder {
    ensure_control_plane_test_env();
    Request::builder()
        .method(method)
        .uri(uri)
        .with_dual_token_context("100001", user_id, actor_kind, Some("d_pad"), [permission])
        .with_dual_token_organization("100001")
}

pub fn control_plane_write_request(
    method: &str,
    uri: &str,
    user_id: &str,
    actor_kind: &str,
) -> Builder {
    control_plane_request_builder(method, uri, user_id, actor_kind, "control.write")
}

pub fn control_plane_json_body(body: &str) -> Body {
    Body::from(body.to_owned())
}

fn ensure_test_environment() {
    static TEST_ENVIRONMENT: std::sync::OnceLock<()> = std::sync::OnceLock::new();
    TEST_ENVIRONMENT.get_or_init(|| {
        // Dual-token test helpers rely on the relaxed test posture; production
        // processes always configure SDKWORK_IM_ENVIRONMENT explicitly.
        // Safety: process env is single-threaded at bootstrap time via OnceLock.
        unsafe { std::env::set_var("SDKWORK_IM_ENVIRONMENT", "test") }
    });
}

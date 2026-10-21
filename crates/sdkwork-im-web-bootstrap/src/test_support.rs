//! Integration-test pipeline support for IM HTTP services.
//!
//! IAM_SPEC §5.2/§5.6 forbids signing authorization scope into credentials:
//! production resolves `permission_scope` server-side from the IAM session row
//! through the IAM web adapter. Service integration tests run without an IAM
//! database, so the fail-closed scope resolution leaves every principal
//! permission-free and manifest-gated backend routes (`required_permission`)
//! answer 403. This module emulates exactly the missing authority: identity
//! still resolves through the canonical dev resolver, while the test fixture
//! grants the permission scope the production IAM session row would carry.
//!
//! Nothing here may be wired into a production assembly.

use std::sync::Arc;

use async_trait::async_trait;
use axum::http::{HeaderMap, HeaderValue, header};
use im_app_context::resolve_web_environment_from_process_env;
use sdkwork_iam_web_adapter::IamAuthorizationPolicy;
use sdkwork_web_axum::WebFrameworkLayer;
use sdkwork_web_bootstrap::SecurityPolicy;
use sdkwork_web_core::{
    EnforcePrincipalTenantIsolationPolicy, JwtProductionClaimPolicy, ResolverProductionProfile,
    WebAuthLevel, WebAuthorizationScope, WebDeploymentMode, WebFrameworkError,
    WebRequestContextResolver, WebRequestPrincipal, WebSubjectType,
};

use crate::{ImAppContextInjector, im_service_context_profile, im_service_http_metrics};

/// Resolves the same signed dual-token headers the IM gateway forwards, without
/// requiring the deployment IAM session database.
///
/// The IAM adapter's fallback resolver verifies tokens with its own JWT secret
/// policy; IM integration fixtures are minted by `im_app_context`, so the
/// canonical IM resolution path is the correct verifier for tests.
#[derive(Clone, Default)]
pub struct LocalDualTokenResolver;

fn local_principal_from_context(
    context: &im_app_context::AppContext,
) -> WebRequestPrincipal {
    // The standard principal models user/service/system/api-key subjects; IM
    // additionally uses the delegated `agent` actor kind on open-api. Preserve
    // the closest standard subject instead of collapsing every non-service
    // actor to `user`, otherwise idempotency keys that include actor kind would
    // collide across system and user requests.
    let (auth_level, subject_type) = match context.actor_kind.as_str() {
        "service" => (WebAuthLevel::System, WebSubjectType::Service),
        "system" => (WebAuthLevel::System, WebSubjectType::System),
        "api_key" => (WebAuthLevel::ApiKey, WebSubjectType::ApiKey),
        "agent" => (WebAuthLevel::System, WebSubjectType::Service),
        _ => (WebAuthLevel::Password, WebSubjectType::User),
    };
    WebRequestPrincipal::builder()
        .tenant_id(context.tenant_id.clone())
        .organization_id(Some(context.organization_id.clone()))
        .user_id(context.actor_id.clone())
        .session_id(context.session_id.clone())
        .app_id(
            context
                .app_id
                .clone()
                .unwrap_or_else(|| "sdkwork-im".to_owned()),
        )
        .environment(resolve_web_environment_from_process_env())
        .deployment_mode(WebDeploymentMode::Local)
        .auth_level(auth_level)
        .subject_type(subject_type)
        .data_scope(context.data_scope.iter().cloned().collect())
        .permission_scope(context.permission_scope.iter().cloned().collect())
        .build()
}

#[async_trait]
impl WebRequestContextResolver for LocalDualTokenResolver {
    fn resolver_production_profile(&self) -> ResolverProductionProfile {
        ResolverProductionProfile::Unspecified
    }

    async fn resolve_api_key(
        &self,
        _raw_api_key: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Err(WebFrameworkError::invalid_credentials(
            "local dual-token test resolver does not accept API keys",
        ))
    }

    async fn resolve_oauth_bearer(
        &self,
        _raw_bearer_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Err(WebFrameworkError::invalid_credentials(
            "local dual-token test resolver does not accept OAuth bearer tokens",
        ))
    }

    async fn resolve_bearer_auth_token(
        &self,
        _raw_bearer_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Err(WebFrameworkError::invalid_credentials(
            "local dual-token test resolver does not accept bearer auth tokens",
        ))
    }

    async fn resolve_dual_token(
        &self,
        raw_auth_token: &str,
        raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        let mut headers = HeaderMap::new();
        let authorization = HeaderValue::from_str(format!("Bearer {raw_auth_token}").as_str())
            .map_err(|_| {
                WebFrameworkError::invalid_credentials("invalid Authorization header fixture")
            })?;
        headers.insert(header::AUTHORIZATION, authorization);
        let access_token = HeaderValue::from_str(raw_access_token).map_err(|_| {
            WebFrameworkError::invalid_credentials("invalid Access-Token header fixture")
        })?;
        headers.insert("Access-Token", access_token);
        let context = im_app_context::resolve_app_context(&headers).map_err(|error| {
            WebFrameworkError::invalid_credentials(format!(
                "{}: {}",
                error.code(),
                error.message()
            ))
        })?;
        Ok(local_principal_from_context(&context))
    }

    async fn resolve_access_token(
        &self,
        _raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Err(WebFrameworkError::invalid_credentials(
            "local dual-token test resolver requires both tokens",
        ))
    }
}

/// Resolver that grants a fixture permission scope to every resolved principal.
///
/// Identity resolution delegates to the wrapped resolver; only the scope
/// projection — the piece production reads from the IAM session row — is
/// replaced by the configured grant.
#[derive(Clone)]
pub struct ScopedPermissionResolver<R> {
    inner: R,
    grant: WebAuthorizationScope,
}

impl<R> ScopedPermissionResolver<R> {
    pub fn new(inner: R, data_scope: &[&str], permission_scope: &[&str]) -> Self {
        Self {
            inner,
            grant: WebAuthorizationScope::new(
                data_scope.iter().map(|value| value.to_string()).collect(),
                permission_scope
                    .iter()
                    .map(|value| value.to_string())
                    .collect(),
            ),
        }
    }

    fn granted(&self, mut principal: WebRequestPrincipal) -> WebRequestPrincipal {
        self.grant.apply_to(&mut principal);
        principal
    }
}

#[async_trait]
impl<R: WebRequestContextResolver> WebRequestContextResolver for ScopedPermissionResolver<R> {
    fn resolver_production_profile(&self) -> ResolverProductionProfile {
        self.inner.resolver_production_profile()
    }

    fn jwt_production_claim_policy(&self) -> Option<JwtProductionClaimPolicy> {
        self.inner.jwt_production_claim_policy()
    }

    async fn resolve_api_key(
        &self,
        raw_api_key: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(self.inner.resolve_api_key(raw_api_key).await?))
    }

    async fn resolve_oauth_bearer(
        &self,
        raw_bearer_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(self.inner.resolve_oauth_bearer(raw_bearer_token).await?))
    }

    async fn resolve_bearer_auth_token(
        &self,
        raw_bearer_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(
            self.inner
                .resolve_bearer_auth_token(raw_bearer_token)
                .await?,
        ))
    }

    async fn resolve_dual_token(
        &self,
        raw_auth_token: &str,
        raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(
            self.inner
                .resolve_dual_token(raw_auth_token, raw_access_token)
                .await?,
        ))
    }

    async fn resolve_access_token(
        &self,
        raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(self.inner.resolve_access_token(raw_access_token).await?))
    }
}

/// Resolver that grants permission scope per subject user id.
///
/// Fixture for tests that assert authorization semantics: principals whose
/// user id has no grant stay permission-free (the production analogue is an
/// IAM session row without the permission).
#[derive(Clone)]
pub struct UserScopedPermissionResolver<R> {
    inner: R,
    grants: Arc<std::collections::BTreeMap<String, WebAuthorizationScope>>,
}

impl<R> UserScopedPermissionResolver<R> {
    /// `grants` maps a user id to its `(data_scope, permission_scope)` fixture.
    pub fn new(inner: R, grants: &[(&str, &[&str], &[&str])]) -> Self {
        let mapped = grants
            .iter()
            .map(|(user_id, data_scope, permission_scope)| {
                (
                    (*user_id).to_string(),
                    WebAuthorizationScope::new(
                        data_scope.iter().map(|value| value.to_string()).collect(),
                        permission_scope
                            .iter()
                            .map(|value| value.to_string())
                            .collect(),
                    ),
                )
            })
            .collect();
        Self {
            inner,
            grants: Arc::new(mapped),
        }
    }

    fn granted(&self, mut principal: WebRequestPrincipal) -> WebRequestPrincipal {
        if let Some(grant) = self.grants.get(principal.user_id()) {
            grant.apply_to(&mut principal);
        }
        principal
    }
}

#[async_trait]
impl<R: WebRequestContextResolver> WebRequestContextResolver for UserScopedPermissionResolver<R> {
    fn resolver_production_profile(&self) -> ResolverProductionProfile {
        self.inner.resolver_production_profile()
    }

    fn jwt_production_claim_policy(&self) -> Option<JwtProductionClaimPolicy> {
        self.inner.jwt_production_claim_policy()
    }

    async fn resolve_api_key(
        &self,
        raw_api_key: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(self.inner.resolve_api_key(raw_api_key).await?))
    }

    async fn resolve_oauth_bearer(
        &self,
        raw_bearer_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(self.inner.resolve_oauth_bearer(raw_bearer_token).await?))
    }

    async fn resolve_bearer_auth_token(
        &self,
        raw_bearer_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(
            self.inner
                .resolve_bearer_auth_token(raw_bearer_token)
                .await?,
        ))
    }

    async fn resolve_dual_token(
        &self,
        raw_auth_token: &str,
        raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(
            self.inner
                .resolve_dual_token(raw_auth_token, raw_access_token)
                .await?,
        ))
    }

    async fn resolve_access_token(
        &self,
        raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        Ok(self.granted(self.inner.resolve_access_token(raw_access_token).await?))
    }
}

/// The canonical IM service pipeline with per-user fixture permission grants.
///
/// Mirrors [`crate::wrap_im_service_router_with_manifest`] wiring; only the IAM
/// session scope projection is emulated, keyed by the resolved user id.
pub fn im_service_test_framework_layer_with_user_grants(
    grants: &[(&str, &[&str], &[&str])],
    route_manifest: sdkwork_web_core::HttpRouteManifest,
) -> WebFrameworkLayer<UserScopedPermissionResolver<LocalDualTokenResolver>> {
    let resolver = UserScopedPermissionResolver::new(LocalDualTokenResolver, grants);
    let environment = resolve_web_environment_from_process_env();
    WebFrameworkLayer::new(resolver)
        .with_profile(im_service_context_profile())
        .with_security_policy(crate::im_service_security_policy(&environment))
        .with_route_manifest(route_manifest.clone())
        .with_authorization_policy(Arc::new(IamAuthorizationPolicy::new(route_manifest)))
        .with_tenant_isolation_policy(Arc::new(EnforcePrincipalTenantIsolationPolicy))
        .with_domain_injector(Arc::new(ImAppContextInjector))
        .with_metrics(im_service_http_metrics())
}

/// The canonical IM service pipeline with a fixture-granted permission scope.
///
/// Mirrors [`crate::wrap_im_service_router_with_manifest`] wiring (profile,
/// security policy, manifest authorization, tenant isolation, domain injector,
/// metrics) so integration tests exercise the real interceptor chain and
/// manifest gate; only the IAM session scope projection is emulated.
pub fn im_service_test_framework_layer(
    data_scope: &[&str],
    permission_scope: &[&str],
    route_manifest: sdkwork_web_core::HttpRouteManifest,
) -> WebFrameworkLayer<ScopedPermissionResolver<LocalDualTokenResolver>> {
    let resolver = ScopedPermissionResolver::new(
        LocalDualTokenResolver,
        data_scope,
        permission_scope,
    );
    let environment = resolve_web_environment_from_process_env();
    WebFrameworkLayer::new(resolver)
        .with_profile(im_service_context_profile())
        .with_security_policy(security_policy_for_environment(&environment))
        .with_route_manifest(route_manifest.clone())
        .with_authorization_policy(Arc::new(IamAuthorizationPolicy::new(route_manifest)))
        .with_tenant_isolation_policy(Arc::new(EnforcePrincipalTenantIsolationPolicy))
        .with_domain_injector(Arc::new(ImAppContextInjector))
        .with_metrics(im_service_http_metrics())
}

fn security_policy_for_environment(
    environment: &sdkwork_web_core::WebEnvironment,
) -> SecurityPolicy {
    crate::im_service_security_policy(environment)
}

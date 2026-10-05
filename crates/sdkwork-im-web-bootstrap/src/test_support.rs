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
use im_app_context::resolve_web_environment_from_process_env;
use sdkwork_iam_web_adapter::{IamAuthorizationPolicy, IamWebRequestContextResolver};
use sdkwork_web_axum::WebFrameworkLayer;
use sdkwork_web_bootstrap::SecurityPolicy;
use sdkwork_web_core::{
    EnforcePrincipalTenantIsolationPolicy, JwtProductionClaimPolicy, ResolverProductionProfile,
    WebAuthorizationScope, WebFrameworkError, WebRequestContextResolver, WebRequestPrincipal,
};

use crate::{ImAppContextInjector, im_service_context_profile, im_service_http_metrics};

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
) -> WebFrameworkLayer<UserScopedPermissionResolver<IamWebRequestContextResolver>> {
    let resolver = UserScopedPermissionResolver::new(
        crate::cached_iam_web_request_context_resolver()
            .unwrap_or_else(|| IamWebRequestContextResolver::new(None)),
        grants,
    );
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
) -> WebFrameworkLayer<ScopedPermissionResolver<IamWebRequestContextResolver>> {
    let resolver = ScopedPermissionResolver::new(
        crate::cached_iam_web_request_context_resolver()
            .unwrap_or_else(|| IamWebRequestContextResolver::new(None)),
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

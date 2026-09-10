//! Realtime scope access policies backed by conversation membership.

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use im_domain_core::realtime::RealtimeEvent;
use im_platform_contracts::ConversationMemberAccessGate;
use sdkwork_im_contract_core::ContractError;

use crate::realtime::{RealtimeRuntimeError, RealtimeScopeAccessPolicy};

const USER_SCOPE_TYPE: &str = "user";
const CONVERSATION_SCOPE_TYPE: &str = "conversation";

/// Upper bound on cached membership verdicts. When exceeded, expired
/// entries are reclaimed first and the cache is cleared only as a last
/// resort so the cache can never grow without bound.
const MEMBER_CACHE_MAX_ENTRIES: usize = 100_000;

/// Per-event visibility checks call the member gate once per event; a
/// short-lived membership cache turns the catch-up read path (up to 1000
/// events per pull page) into one gate lookup per (member, conversation)
/// instead of one per event. Subscription validation still goes straight
/// to the gate, so authorization at subscribe time stays authoritative.
/// TTL is env-tunable via `SDKWORK_IM_REALTIME_MEMBER_CACHE_TTL_MS`
/// (0 disables caching). Default: 5 seconds.
const MEMBER_CACHE_TTL_MS_ENV: &str = "SDKWORK_IM_REALTIME_MEMBER_CACHE_TTL_MS";
const MEMBER_CACHE_TTL_DEFAULT_MS: u64 = 5_000;

fn resolve_member_cache_ttl() -> Duration {
    let millis = std::env::var(MEMBER_CACHE_TTL_MS_ENV)
        .ok()
        .and_then(|value| value.trim().parse::<u64>().ok())
        .unwrap_or(MEMBER_CACHE_TTL_DEFAULT_MS);
    Duration::from_millis(millis)
}

/// Production policy: user scopes are self-only; conversation scopes require active membership.
#[derive(Clone)]
pub struct ConversationMemberRealtimeScopeAccessPolicy {
    member_gate: Arc<dyn ConversationMemberAccessGate>,
    member_cache: Arc<Mutex<HashMap<String, (bool, Instant)>>>,
    member_cache_ttl: Duration,
}

impl ConversationMemberRealtimeScopeAccessPolicy {
    pub fn new(member_gate: Arc<dyn ConversationMemberAccessGate>) -> Self {
        Self {
            member_gate,
            member_cache: Arc::new(Mutex::new(HashMap::new())),
            member_cache_ttl: resolve_member_cache_ttl(),
        }
    }

    fn cached_membership(&self, key: &str) -> Option<bool> {
        if self.member_cache_ttl.is_zero() {
            return None;
        }
        let cache = self
            .member_cache
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        cache.get(key).and_then(|(value, expires_at)| {
            (*expires_at > Instant::now()).then_some(*value)
        })
    }

    fn store_membership(&self, key: String, value: bool) {
        if self.member_cache_ttl.is_zero() {
            return;
        }
        let mut cache = self
            .member_cache
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        if cache.len() >= MEMBER_CACHE_MAX_ENTRIES {
            let now = Instant::now();
            cache.retain(|_, (_, expires_at)| *expires_at > now);
            if cache.len() >= MEMBER_CACHE_MAX_ENTRIES {
                cache.clear();
            }
        }
        cache.insert(key, (value, Instant::now() + self.member_cache_ttl));
    }
}

impl RealtimeScopeAccessPolicy for ConversationMemberRealtimeScopeAccessPolicy {
    fn validate_subscription_scope(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_id: &str,
        principal_kind: &str,
        scope_type: &str,
        scope_id: &str,
    ) -> Result<(), RealtimeRuntimeError> {
        if scope_type == USER_SCOPE_TYPE {
            if scope_id == principal_id {
                return Ok(());
            }
            return Err(RealtimeRuntimeError {
                code: "realtime_scope_access_denied",
                message: format!("user scope {scope_id} is not owned by principal {principal_id}"),
            });
        }

        if scope_type == CONVERSATION_SCOPE_TYPE {
            return self
                .member_gate
                .ensure_active_member(
                    tenant_id,
                    organization_id,
                    scope_id,
                    principal_kind,
                    principal_id,
                )
                .map_err(map_member_gate_error);
        }

        Err(RealtimeRuntimeError {
            code: "realtime_scope_access_denied",
            message: format!("unsupported realtime scope type: {scope_type}"),
        })
    }

    fn is_event_visible(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_id: &str,
        principal_kind: &str,
        event: &RealtimeEvent,
    ) -> bool {
        if event.scope_type == USER_SCOPE_TYPE {
            return event.scope_id == principal_id;
        }
        if event.scope_type == CONVERSATION_SCOPE_TYPE {
            let cache_key = format!(
                "{tenant_id}|{organization_id}|{}|{principal_kind}|{principal_id}",
                event.scope_id
            );
            if let Some(cached) = self.cached_membership(cache_key.as_str()) {
                return cached;
            }
            let active = self
                .member_gate
                .ensure_active_member(
                    tenant_id,
                    organization_id,
                    event.scope_id.as_str(),
                    principal_kind,
                    principal_id,
                )
                .is_ok();
            self.store_membership(cache_key, active);
            return active;
        }
        false
    }
}

fn map_member_gate_error(error: ContractError) -> RealtimeRuntimeError {
    let message = format!("{error:?}");
    if message.contains("conversation_permission_denied") {
        RealtimeRuntimeError {
            code: "conversation_permission_denied",
            message,
        }
    } else {
        RealtimeRuntimeError {
            code: "realtime_scope_access_denied",
            message,
        }
    }
}

//! Redis cache for typing indicators.
//!
//! Key patterns:
//! - per-user marker: `typing:{tenant_id}:{org_id}:{conversation_id}:{user_id}` (STRING, TTL)
//! - per-conversation member set: `typing:members:{tenant_id}:{org_id}:{conversation_id}` (SET, TTL)
//!
//! TTL: 5 seconds (auto-expire), refreshed on every signal.

use redis::AsyncCommands;
use redis::aio::ConnectionManager;

use crate::redis_unavailable;

/// Trait for typing indicator cache operations.
#[async_trait::async_trait]
pub trait TypingCache: Send + Sync {
    async fn set_typing(
        &self,
        tenant_id: &str,
        org_id: &str,
        conversation_id: &str,
        user_id: &str,
        ttl_seconds: u64,
    ) -> Result<(), im_platform_contracts::ContractError>;

    async fn is_typing(
        &self,
        tenant_id: &str,
        org_id: &str,
        conversation_id: &str,
        user_id: &str,
    ) -> Result<bool, im_platform_contracts::ContractError>;

    /// Lists principals whose typing markers are currently live in a
    /// conversation.
    async fn list_typing_users(
        &self,
        tenant_id: &str,
        org_id: &str,
        conversation_id: &str,
    ) -> Result<Vec<String>, im_platform_contracts::ContractError>;
}

fn typing_key(tenant_id: &str, org_id: &str, conversation_id: &str, user_id: &str) -> String {
    format!("typing:{tenant_id}:{org_id}:{conversation_id}:{user_id}")
}

fn typing_members_key(tenant_id: &str, org_id: &str, conversation_id: &str) -> String {
    format!("typing:members:{tenant_id}:{org_id}:{conversation_id}")
}

/// Redis-backed typing indicator cache.
#[derive(Clone)]
pub struct RedisTypingCache {
    manager: ConnectionManager,
}

impl RedisTypingCache {
    pub fn new(manager: ConnectionManager) -> Self {
        Self { manager }
    }
}

#[async_trait::async_trait]
impl TypingCache for RedisTypingCache {
    async fn set_typing(
        &self,
        tenant_id: &str,
        org_id: &str,
        conversation_id: &str,
        user_id: &str,
        ttl_seconds: u64,
    ) -> Result<(), im_platform_contracts::ContractError> {
        let user_key = typing_key(tenant_id, org_id, conversation_id, user_id);
        let members_key = typing_members_key(tenant_id, org_id, conversation_id);
        let mut conn = self.manager.clone();

        let _: () = conn
            .set_ex(&user_key, "1", ttl_seconds)
            .await
            .map_err(|e| redis_unavailable("set_typing", e))?;
        let _: () = conn
            .sadd(&members_key, user_id)
            .await
            .map_err(|e| redis_unavailable("set_typing", e))?;
        let _: () = conn
            .expire(&members_key, ttl_seconds as i64)
            .await
            .map_err(|e| redis_unavailable("set_typing", e))?;

        Ok(())
    }

    async fn is_typing(
        &self,
        tenant_id: &str,
        org_id: &str,
        conversation_id: &str,
        user_id: &str,
    ) -> Result<bool, im_platform_contracts::ContractError> {
        let user_key = typing_key(tenant_id, org_id, conversation_id, user_id);
        let mut conn = self.manager.clone();

        let exists: bool = conn
            .exists(&user_key)
            .await
            .map_err(|e| redis_unavailable("is_typing", e))?;

        Ok(exists)
    }

    async fn list_typing_users(
        &self,
        tenant_id: &str,
        org_id: &str,
        conversation_id: &str,
    ) -> Result<Vec<String>, im_platform_contracts::ContractError> {
        let members_key = typing_members_key(tenant_id, org_id, conversation_id);
        let mut conn = self.manager.clone();

        // Keep only principals whose per-user marker is still live; expired
        // members are dropped so the list never outlives its TTLs.
        let members: Vec<String> = conn
            .smembers(&members_key)
            .await
            .map_err(|e| redis_unavailable("list_typing_users", e))?;
        let mut live = Vec::with_capacity(members.len());
        for user_id in members {
            let user_key = typing_key(tenant_id, org_id, conversation_id, &user_id);
            let exists: bool = conn
                .exists(&user_key)
                .await
                .map_err(|e| redis_unavailable("list_typing_users", e))?;
            if exists {
                live.push(user_id);
            } else {
                let _: () = conn
                    .srem(&members_key, &user_id)
                    .await
                    .map_err(|e| redis_unavailable("list_typing_users", e))?;
            }
        }

        Ok(live)
    }
}

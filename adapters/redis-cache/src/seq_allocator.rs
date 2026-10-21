//! Redis-backed [`ConversationSeqAllocator`] implementation.
//!
//! Eliminates the single-row hotspot in `im_conversation_seq_counters` by
//! batch-prefetching sequences via `INCRBY`. Each node fetches `batch_size`
//! sequences at once and allocates locally until exhausted.
//!
//! ## Key pattern
//! `seq:{length-prefixed tenant/org/conversation scope}` -> atomic counter (i64)

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use sdkwork_im_contract_core::ContractError;

use crate::redis_blocking::{RedisBlockingTimeouts, run_bounded_redis_command};
use crate::redis_key::encode_redis_key_segments;

const DEFAULT_BATCH_SIZE: u32 = 1000;
/// Upper bound on locally cached sequence batches. Entries beyond this limit
/// are evicted in LRU order so a long-running node serving many conversations
/// cannot grow the cache without bound.
const MAX_CACHED_BATCHES: usize = 4096;

/// Seeds the Redis counter from durable message state after a cache loss.
///
/// Redis is only a batching accelerator: when the counter key is missing (flush,
/// failover, eviction) the allocator must resume above the highest sequence
/// already committed to PostgreSQL, otherwise it would re-issue `message_seq`
/// values that already exist and violate the per-conversation uniqueness
/// constraint.
pub trait ConversationSeqHighWatermark: Send + Sync {
    fn high_watermark(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<u64, ContractError>;
}

/// Atomically seeds a missing counter from the durable floor and reserves one
/// batch. `ARGV[1]` is the floor (`-1` asks the script to report whether a seed
/// is required without mutating the key); `ARGV[2]` is the batch size.
const SEED_AND_RESERVE_SCRIPT: &str = r#"
local floor = tonumber(ARGV[1])
local batch = tonumber(ARGV[2])
local raw = redis.call('GET', KEYS[1])
if (not raw) and floor < 0 then
    return -1
end
local current = tonumber(raw or '0')
if current < floor then
    current = floor
end
local upper = current + batch
redis.call('SET', KEYS[1], upper)
return upper
"#;

fn seq_key(tenant_id: &str, org_id: &str, conversation_id: &str) -> String {
    format!(
        "seq:{}",
        encode_redis_key_segments([tenant_id, org_id, conversation_id])
    )
}

/// One locally cached sequence batch.
struct SeqBatch {
    next_seq: u64,
    upper_bound: u64,
    /// Monotonic clock tick refreshed on every hit; drives LRU eviction.
    last_used: u64,
}

/// Bounded batch cache with LRU eviction.
#[derive(Default)]
struct BatchCache {
    batches: HashMap<String, SeqBatch>,
    clock: u64,
}

impl BatchCache {
    fn next_seq(&mut self, key: &str) -> Option<u64> {
        let batch = self.batches.get_mut(key)?;
        if batch.next_seq > batch.upper_bound {
            return None;
        }
        self.clock = self.clock.saturating_add(1);
        batch.last_used = self.clock;
        let seq = batch.next_seq;
        batch.next_seq = seq.saturating_add(1);
        Some(seq)
    }

    fn insert(&mut self, key: String, next_seq: u64, upper_bound: u64) {
        self.clock = self.clock.saturating_add(1);
        let is_new = !self.batches.contains_key(&key);
        self.batches.insert(
            key,
            SeqBatch {
                next_seq,
                upper_bound,
                last_used: self.clock,
            },
        );
        if is_new && self.batches.len() > MAX_CACHED_BATCHES {
            // Evict the least recently used entry.
            let victim_key = self
                .batches
                .iter()
                .min_by_key(|(_, batch)| batch.last_used)
                .map(|(key, _)| key.clone());
            if let Some(victim_key) = victim_key {
                self.batches.remove(&victim_key);
            }
        }
    }

    fn remove(&mut self, key: &str) {
        self.batches.remove(key);
    }
}

/// Redis-backed conversation sequence allocator with local batch caching.
pub struct RedisSeqAllocator {
    client: redis::Client,
    batch_size: u32,
    timeouts: RedisBlockingTimeouts,
    /// Local batch cache: key -> batch with LRU eviction.
    batches: Mutex<BatchCache>,
    high_watermark: Option<Arc<dyn ConversationSeqHighWatermark>>,
}

impl RedisSeqAllocator {
    pub fn new(client: redis::Client) -> Self {
        Self {
            client,
            batch_size: DEFAULT_BATCH_SIZE,
            timeouts: RedisBlockingTimeouts::from_env(),
            batches: Mutex::new(BatchCache::default()),
            high_watermark: None,
        }
    }

    pub fn with_batch_size(mut self, batch_size: u32) -> Self {
        self.batch_size = batch_size.max(1);
        self
    }

    /// Wires the durable high-watermark source used to seed Redis after a flush.
    pub fn with_high_watermark(
        mut self,
        high_watermark: Arc<dyn ConversationSeqHighWatermark>,
    ) -> Self {
        self.high_watermark = Some(high_watermark);
        self
    }

    fn reserve_batch_upper(&self, key: &str, floor: i64) -> Result<i64, ContractError> {
        let redis_key = key.to_owned();
        let batch = i64::from(self.batch_size);
        run_bounded_redis_command(
            &self.client,
            self.timeouts,
            "seq_allocator_seed_and_reserve",
            move |mut connection| async move {
                redis::cmd("EVAL")
                    .arg(SEED_AND_RESERVE_SCRIPT)
                    .arg(1)
                    .arg(redis_key)
                    .arg(floor)
                    .arg(batch)
                    .query_async(&mut connection)
                    .await
            },
        )
    }
}

impl im_platform_contracts::ConversationSeqAllocator for RedisSeqAllocator {
    fn allocate_seq(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<u64, ContractError> {
        let key = seq_key(tenant_id, organization_id, conversation_id);

        // Fast path: serve from local batch cache under lock. The lock is
        // released before any blocking Redis IO so other conversations can
        // allocate concurrently.
        {
            let mut batches = self
                .batches
                .lock()
                .map_err(|_| ContractError::Unavailable("seq_allocator lock poisoned".into()))?;
            if let Some(seq) = batches.next_seq(&key) {
                return Ok(seq);
            }
        }

        // Slow path: atomically reserve a batch. The script first reports
        // whether the counter needs seeding; only then do we read the durable
        // floor from PostgreSQL so the hot path never pays a database round trip.
        let batch_size_u64 = u64::from(self.batch_size);
        let mut new_upper = self.reserve_batch_upper(&key, -1)?;
        if new_upper < 0 {
            let floor = match &self.high_watermark {
                Some(provider) => {
                    provider.high_watermark(tenant_id, organization_id, conversation_id)?
                }
                None => 0,
            };
            let floor = i64::try_from(floor).unwrap_or(i64::MAX);
            new_upper = self.reserve_batch_upper(&key, floor)?;
        }
        if new_upper < 0 {
            return Err(ContractError::Unavailable(
                "seq_allocator could not seed the Redis sequence counter".into(),
            ));
        }
        let new_upper = new_upper as u64;
        let first_seq = new_upper.saturating_sub(batch_size_u64).saturating_add(1);

        if batch_size_u64 == 1 {
            let mut batches = self
                .batches
                .lock()
                .map_err(|_| ContractError::Unavailable("seq_allocator lock poisoned".into()))?;
            batches.remove(&key);
            return Ok(first_seq);
        }

        let next_seq = first_seq.saturating_add(1);
        let mut batches = self
            .batches
            .lock()
            .map_err(|_| ContractError::Unavailable("seq_allocator lock poisoned".into()))?;
        batches.insert(key, next_seq, new_upper);

        Ok(first_seq)
    }

    fn batch_size(&self) -> u32 {
        self.batch_size
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_seq_key_is_segment_safe() {
        let k1 = seq_key("tenant:a", "default", "conversation");
        let k2 = seq_key("tenant", "a:default", "conversation");
        assert_ne!(k1, k2, "segment-safe sequence keys must not collide");
    }

    #[test]
    fn test_default_batch_size_is_reasonable() {
        const _: () = assert!(DEFAULT_BATCH_SIZE >= 100);
        const _: () = assert!(DEFAULT_BATCH_SIZE <= 10000);
        assert_eq!(DEFAULT_BATCH_SIZE, 1000);
    }

    #[test]
    fn seed_script_requires_a_durable_floor_for_missing_counters() {
        // The guard prevents silently restarting at 0 after a Redis flush; a
        // missing counter must be seeded from the PostgreSQL high watermark.
        assert!(SEED_AND_RESERVE_SCRIPT.contains("if (not raw) and floor < 0"));
        assert!(SEED_AND_RESERVE_SCRIPT.contains("current = floor"));
        assert!(SEED_AND_RESERVE_SCRIPT.contains("redis.call('SET'"));
    }

    struct FixedHighWatermark(u64);

    impl ConversationSeqHighWatermark for FixedHighWatermark {
        fn high_watermark(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            _conversation_id: &str,
        ) -> Result<u64, ContractError> {
            Ok(self.0)
        }
    }

    #[test]
    fn allocator_accepts_a_durable_high_watermark_provider() {
        let client = redis::Client::open("redis://127.0.0.1/").expect("redis client");
        let _allocator = RedisSeqAllocator::new(client)
            .with_high_watermark(Arc::new(FixedHighWatermark(4096)));
    }

    #[test]
    fn test_batch_cache_evicts_least_recently_used_entry() {
        let mut cache = BatchCache::default();
        for index in 0..MAX_CACHED_BATCHES {
            cache.insert(format!("k{index}"), 1, 10);
        }
        // Touch k0 so it becomes the most recently used entry; k1 is now the
        // least recently used one.
        assert_eq!(cache.next_seq("k0"), Some(1));
        cache.insert("overflow".into(), 1, 10);
        assert_eq!(
            cache.batches.len(),
            MAX_CACHED_BATCHES,
            "cache must never exceed its capacity"
        );
        assert!(
            cache.next_seq("k1").is_none(),
            "least recently used entry must be evicted"
        );
        assert_eq!(
            cache.next_seq("k0"),
            Some(2),
            "recently used entry must survive eviction"
        );
        assert_eq!(
            cache.next_seq("overflow"),
            Some(1),
            "newest entry must survive eviction"
        );
    }

    #[test]
    fn test_batch_cache_exhausted_batch_is_replaced_not_duplicated() {
        let mut cache = BatchCache::default();
        cache.insert("k".into(), 11, 10);
        assert!(
            cache.next_seq("k").is_none(),
            "an exhausted batch must not serve sequences"
        );
        cache.insert("k".into(), 21, 30);
        assert_eq!(cache.next_seq("k"), Some(21));
        assert_eq!(
            cache.batches.len(),
            1,
            "replacing a batch must not grow the cache"
        );
    }

    #[test]
    fn test_batch_cache_remove_drops_entry() {
        let mut cache = BatchCache::default();
        cache.insert("k".into(), 1, 10);
        cache.remove("k");
        assert!(cache.next_seq("k").is_none());
        assert_eq!(cache.batches.len(), 0);
    }
}

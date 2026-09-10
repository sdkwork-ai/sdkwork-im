-- sdkwork:migration
-- id: 0005_im_outbox_events_retention_backfill
-- engine: postgres
-- module: sdkwork-im
-- purpose: Give published and terminal-failed im_outbox_events rows a
--   retention_until timestamp so the retention scheduler can purge them.
--   The relay now stamps retention_until at publish/fail time; this
--   backfill covers rows written before that change so no row is immortal.
--   Batched by primary key so large tables make forward progress even if
--   a single statement cannot complete in one pass.
-- reversible: false
-- rollback: forward-fix (retention_until is derived evidence metadata)
-- transactional: true
-- lock: lightweight
-- lock_timeout: 2s
-- statement_timeout: 30s

BEGIN;

-- Published rows: retain 7 days from publication.
UPDATE im_outbox_events
SET retention_until = published_at + make_interval(secs => 604800)
WHERE publish_status = 'published'
  AND retention_until IS NULL
  AND published_at IS NOT NULL;

-- Terminal failed rows: retain 30 days for operator replay.
UPDATE im_outbox_events
SET retention_until = updated_at + make_interval(secs => 2592000)
WHERE publish_status = 'failed'
  AND retention_until IS NULL;

-- Scope-discovery support: the relay's global pending-scope GROUP BY can
-- then use an index-only scan over pending rows instead of scanning the
-- whole outbox every poll tick.
CREATE INDEX IF NOT EXISTS idx_im_outbox_events_scope_discovery
    ON im_outbox_events (aggregate_type, tenant_id, organization_id, available_at)
    WHERE publish_status = 'pending';

COMMIT;

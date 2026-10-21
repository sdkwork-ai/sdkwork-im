-- sdkwork:migration
-- id: 0012_im_retention_scan_indexes
-- engine: postgres
-- module: sdkwork-im
-- purpose: Add cross-tenant retention scan indexes. The existing retention
--   indexes lead with (tenant_id, organization_id), but the privileged
--   retention purge scans by retention_until alone, so PostgreSQL could not
--   use them and rewrote the whole table each tick. A partial
--   (retention_until) index lets the bounded purge walk only expired rows.
-- reversible: true
-- rollback: down-migration 0012_im_retention_scan_indexes.down.sql drops the
--   scan indexes; the tenant-leading retention indexes remain untouched.
-- transactional: true
-- lock: SHARE lock per table while each index builds (blocks writes, not reads)
-- lock_timeout: 5s
-- statement_timeout: 600s

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '600s';

CREATE INDEX IF NOT EXISTS idx_im_conversation_messages_retention_scan
    ON im_conversation_messages (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_message_media_refs_retention_scan
    ON im_message_media_refs (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_outbox_events_retention_scan
    ON im_outbox_events (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_inbox_events_retention_scan
    ON im_inbox_events (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_commit_journal_retention_scan
    ON im_commit_journal (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_realtime_device_events_retention_scan
    ON im_realtime_device_events (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_realtime_subscriptions_retention_scan
    ON im_realtime_subscriptions (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_presence_states_retention_scan
    ON im_presence_states (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_realtime_disconnect_fences_retention_scan
    ON im_realtime_disconnect_fences (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_rtc_sessions_retention_scan
    ON im_rtc_sessions (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_audit_records_retention_scan
    ON im_audit_records (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_notification_tasks_retention_scan
    ON im_notification_tasks (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_automation_executions_retention_scan
    ON im_automation_executions (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_conversations_retention_scan
    ON im_conversations (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_conversation_members_retention_scan
    ON im_conversation_members (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_conversation_read_cursors_retention_scan
    ON im_conversation_read_cursors (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_registered_client_routes_retention_scan
    ON im_registered_client_routes (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_client_sync_events_retention_scan
    ON im_client_sync_events (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_client_sync_cursors_retention_scan
    ON im_client_sync_cursors (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_stream_sessions_retention_scan
    ON im_stream_sessions (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_stream_frames_retention_scan
    ON im_stream_frames (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_invitations_retention_scan
    ON im_invitations (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_conversation_agent_assignments_retention_scan
    ON im_conversation_agent_assignments (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_conversation_agent_binding_retention_scan
    ON im_conversation_agent_binding (retention_until)
    WHERE retention_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_im_agent_dispatch_retention_scan
    ON im_agent_dispatch (retention_until)
    WHERE retention_until IS NOT NULL;

COMMIT;

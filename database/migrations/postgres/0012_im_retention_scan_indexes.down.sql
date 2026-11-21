-- sdkwork:migration-down
-- id: 0012_im_retention_scan_indexes
-- engine: postgres
-- module: sdkwork-im
-- reversible: true
-- rollback: down-migration
-- purpose: Drop the cross-tenant retention scan indexes added by the forward
--   migration. The tenant-leading retention indexes created in the baseline
--   remain in place. Forward-fix is the supported recovery path; this down
--   migration exists for schema rollback drills and removes only additive
--   indexes.

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';

DROP INDEX IF EXISTS idx_im_conversation_messages_retention_scan;
DROP INDEX IF EXISTS idx_im_message_media_refs_retention_scan;
DROP INDEX IF EXISTS idx_im_outbox_events_retention_scan;
DROP INDEX IF EXISTS idx_im_inbox_events_retention_scan;
DROP INDEX IF EXISTS idx_im_commit_journal_retention_scan;
DROP INDEX IF EXISTS idx_im_realtime_device_events_retention_scan;
DROP INDEX IF EXISTS idx_im_realtime_subscriptions_retention_scan;
DROP INDEX IF EXISTS idx_im_presence_states_retention_scan;
DROP INDEX IF EXISTS idx_im_realtime_disconnect_fences_retention_scan;
DROP INDEX IF EXISTS idx_im_rtc_sessions_retention_scan;
DROP INDEX IF EXISTS idx_im_audit_records_retention_scan;
DROP INDEX IF EXISTS idx_im_notification_tasks_retention_scan;
DROP INDEX IF EXISTS idx_im_automation_executions_retention_scan;
DROP INDEX IF EXISTS idx_im_conversations_retention_scan;
DROP INDEX IF EXISTS idx_im_conversation_members_retention_scan;
DROP INDEX IF EXISTS idx_im_conversation_read_cursors_retention_scan;
DROP INDEX IF EXISTS idx_im_registered_client_routes_retention_scan;
DROP INDEX IF EXISTS idx_im_client_sync_events_retention_scan;
DROP INDEX IF EXISTS idx_im_client_sync_cursors_retention_scan;
DROP INDEX IF EXISTS idx_im_stream_sessions_retention_scan;
DROP INDEX IF EXISTS idx_im_stream_frames_retention_scan;
DROP INDEX IF EXISTS idx_im_invitations_retention_scan;
DROP INDEX IF EXISTS idx_im_conversation_agent_assignments_retention_scan;
DROP INDEX IF EXISTS idx_im_conversation_agent_binding_retention_scan;
DROP INDEX IF EXISTS idx_im_agent_dispatch_retention_scan;

COMMIT;

//! Batch purge of rows whose `retention_until` timestamp is in the past.
//!
//! Uses the partial indexes declared in `001_im_core_schema.sql` and verified by
//! `database_schema_contract_test`.

use im_platform_contracts::{ContractError, PrivilegedOperationContext};
use r2d2_postgres::postgres;

use crate::{PostgresJournalPool, postgres_pool_client, postgres_unavailable, run_postgres_io};

const DEFAULT_PURGE_BATCH_SIZE: i64 = 500;
pub const RETENTION_PURGE_BATCH_SIZE_MAX: i64 = 5_000;

const PURGE_COMMIT_JOURNAL_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_commit_journal
WHERE ctid IN (
    SELECT ctid
    FROM im_commit_journal
    WHERE retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

const PURGE_CONVERSATION_MESSAGES_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_conversation_messages
WHERE ctid IN (
    SELECT ctid
    FROM im_conversation_messages
    WHERE retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

const PURGE_MESSAGE_MEDIA_REFS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_message_media_refs
WHERE ctid IN (
    SELECT ctid
    FROM im_message_media_refs
    WHERE retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

const PURGE_OUTBOX_EVENTS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_outbox_events
WHERE ctid IN (
    SELECT ctid
    FROM im_outbox_events
    WHERE retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

const PURGE_INBOX_EVENTS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_inbox_events
WHERE ctid IN (
    SELECT ctid
    FROM im_inbox_events
    WHERE retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

const PURGE_REALTIME_DEVICE_EVENTS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_realtime_device_events
WHERE ctid IN (
    SELECT ctid
    FROM im_realtime_device_events
    WHERE retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

const PURGE_RTC_SESSIONS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_rtc_sessions
WHERE ctid IN (
    SELECT ctid
    FROM im_rtc_sessions
    WHERE retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

/// Invitation records carry invitee contact data (email/phone), so terminal
/// invitations (accepted/declined/expired/canceled) are purged when their
/// `retention_until` expires (`PRIVACY_SPEC.md`). Pending invitations are
/// never purged: they remain active until consumed, revoked, or expired.
const PURGE_INVITATIONS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_invitations
WHERE ctid IN (
    SELECT ctid
    FROM im_invitations
    WHERE status <> 'pending'
      AND retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

/// Audit records are purged per `retention_class` in bounded batches so the
/// class-level index and the DDL-documented differentiated windows
/// (security=2y, access=180d, admin=1y, data_lifecycle=3y) drive expiry.
///
/// Note: the audit chain (`chain_prev_hash`/`chain_hash`) is not re-written
/// when expired rows are removed. Deletion is a privileged, audited
/// cross-organization operation, and chain verification reports the retained
/// state truthfully: a scope that has undergone retention purge reports
/// `chain_valid=false` once evidence before the retained window is gone.
const PURGE_AUDIT_RECORDS_BY_CLASS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
DELETE FROM im_audit_records
WHERE ctid IN (
    SELECT ctid
    FROM im_audit_records
    WHERE retention_class = $2
      AND retention_until IS NOT NULL
      AND retention_until <= NOW()
    ORDER BY retention_until ASC
    LIMIT $1
)
"#;

macro_rules! simple_retention_purge_sql {
    ($table:literal) => {
        concat!(
            "/* sdkwork:cross-organization-operation=retention-expiry-purge */\n",
            "DELETE FROM ", $table, "\n",
            "WHERE ctid IN (\n",
            "    SELECT ctid\n",
            "    FROM ", $table, "\n",
            "    WHERE retention_until IS NOT NULL\n",
            "      AND retention_until <= NOW()\n",
            "    ORDER BY retention_until ASC\n",
            "    LIMIT $1\n",
            ")\n",
        )
    };
}

// Additional tables that declare `retention_until` and had no purge path.
// Ordering matters for FK-bearing pairs: frames before sessions, assignments
// before the agent binding they reference.
const PURGE_REALTIME_SUBSCRIPTIONS_SQL: &str =
    simple_retention_purge_sql!("im_realtime_subscriptions");
const PURGE_PRESENCE_STATES_SQL: &str = simple_retention_purge_sql!("im_presence_states");
const PURGE_REALTIME_DISCONNECT_FENCES_SQL: &str =
    simple_retention_purge_sql!("im_realtime_disconnect_fences");
const PURGE_NOTIFICATION_TASKS_SQL: &str = simple_retention_purge_sql!("im_notification_tasks");
const PURGE_AUTOMATION_EXECUTIONS_SQL: &str =
    simple_retention_purge_sql!("im_automation_executions");
const PURGE_CONVERSATION_MEMBERS_SQL: &str =
    simple_retention_purge_sql!("im_conversation_members");
const PURGE_CONVERSATION_READ_CURSORS_SQL: &str =
    simple_retention_purge_sql!("im_conversation_read_cursors");
const PURGE_REGISTERED_CLIENT_ROUTES_SQL: &str =
    simple_retention_purge_sql!("im_registered_client_routes");
const PURGE_CLIENT_SYNC_EVENTS_SQL: &str = simple_retention_purge_sql!("im_client_sync_events");
const PURGE_CLIENT_SYNC_CURSORS_SQL: &str = simple_retention_purge_sql!("im_client_sync_cursors");
const PURGE_STREAM_FRAMES_SQL: &str = simple_retention_purge_sql!("im_stream_frames");
const PURGE_STREAM_SESSIONS_SQL: &str = simple_retention_purge_sql!("im_stream_sessions");
const PURGE_CONVERSATION_AGENT_ASSIGNMENTS_SQL: &str =
    simple_retention_purge_sql!("im_conversation_agent_assignments");
const PURGE_CONVERSATION_AGENT_BINDING_SQL: &str =
    simple_retention_purge_sql!("im_conversation_agent_binding");
const PURGE_AGENT_DISPATCH_SQL: &str = simple_retention_purge_sql!("im_agent_dispatch");

/// Expired conversations are purged as a bounded cascade: dependent rows are
/// removed first, then the conversation row itself. Deleting the conversation
/// without its messages/members would leave orphaned content behind, so the
/// batch is defined by the expired conversations and every statement reuses the
/// same bounded, ordered selection.
const PURGE_CONVERSATION_STREAM_FRAMES_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_stream_frames f
USING im_stream_sessions s, expired e
WHERE s.tenant_id = e.tenant_id
  AND s.organization_id = e.organization_id
  AND s.scope_kind = 'conversation'
  AND s.scope_id = e.conversation_id
  AND f.tenant_id = s.tenant_id
  AND f.organization_id = s.organization_id
  AND f.stream_id = s.stream_id
"#;

const PURGE_CONVERSATION_STREAM_SESSIONS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_stream_sessions s
USING expired e
WHERE s.tenant_id = e.tenant_id
  AND s.organization_id = e.organization_id
  AND s.scope_kind = 'conversation'
  AND s.scope_id = e.conversation_id
"#;

const PURGE_CONVERSATION_AGENT_DISPATCH_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_agent_dispatch d
USING expired e
WHERE d.conversation_id = e.conversation_id
  AND d.tenant_id::text = e.tenant_id
  AND d.organization_id::text = e.organization_id
"#;

const PURGE_CONVERSATION_CASCADE_AGENT_ASSIGNMENTS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_conversation_agent_assignments a
USING expired e
WHERE a.conversation_id = e.conversation_id
  AND a.tenant_id::text = e.tenant_id
  AND a.organization_id::text = e.organization_id
"#;

const PURGE_CONVERSATION_CASCADE_AGENT_BINDING_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_conversation_agent_binding b
USING expired e
WHERE b.conversation_id = e.conversation_id
  AND b.tenant_id::text = e.tenant_id
  AND b.organization_id::text = e.organization_id
"#;

const PURGE_CONVERSATION_CASCADE_READ_CURSORS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_conversation_read_cursors c
USING expired e
WHERE c.tenant_id = e.tenant_id
  AND c.organization_id = e.organization_id
  AND c.conversation_id = e.conversation_id
"#;

const PURGE_CONVERSATION_CASCADE_MEMBERS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_conversation_members m
USING expired e
WHERE m.tenant_id = e.tenant_id
  AND m.organization_id = e.organization_id
  AND m.conversation_id = e.conversation_id
"#;

const PURGE_CONVERSATION_CASCADE_MESSAGES_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT tenant_id, organization_id, conversation_id
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_conversation_messages msg
USING expired e
WHERE msg.tenant_id = e.tenant_id
  AND msg.organization_id = e.organization_id
  AND msg.conversation_id = e.conversation_id
"#;

/// Final statement: removes the expired conversation rows after every
/// dependent row in this module has been deleted. Conversation policies,
/// business bindings, and handoffs cascade from this FK.
const PURGE_CONVERSATIONS_SQL: &str = r#"
/* sdkwork:cross-organization-operation=retention-expiry-purge */
WITH expired AS (
    SELECT ctid
    FROM im_conversations
    WHERE retention_until IS NOT NULL AND retention_until <= NOW()
    ORDER BY retention_until ASC, tenant_id, organization_id, conversation_id
    LIMIT $1
)
DELETE FROM im_conversations
WHERE ctid IN (SELECT ctid FROM expired)
"#;

const SIMPLE_RETENTION_PURGE_SQLS: [&str; 15] = [
    PURGE_REALTIME_SUBSCRIPTIONS_SQL,
    PURGE_PRESENCE_STATES_SQL,
    PURGE_REALTIME_DISCONNECT_FENCES_SQL,
    PURGE_NOTIFICATION_TASKS_SQL,
    PURGE_AUTOMATION_EXECUTIONS_SQL,
    PURGE_CONVERSATION_MEMBERS_SQL,
    PURGE_CONVERSATION_READ_CURSORS_SQL,
    PURGE_REGISTERED_CLIENT_ROUTES_SQL,
    PURGE_CLIENT_SYNC_EVENTS_SQL,
    PURGE_CLIENT_SYNC_CURSORS_SQL,
    PURGE_STREAM_FRAMES_SQL,
    PURGE_STREAM_SESSIONS_SQL,
    PURGE_CONVERSATION_AGENT_ASSIGNMENTS_SQL,
    PURGE_CONVERSATION_AGENT_BINDING_SQL,
    PURGE_AGENT_DISPATCH_SQL,
];

const AUDIT_RETENTION_CLASSES: [&str; 4] = ["security", "access", "admin", "data_lifecycle"];

#[derive(Clone, Debug, PartialEq, Eq, Default)]
pub struct RetentionCleanupReport {
    pub commit_journal_deleted: u64,
    pub conversation_messages_deleted: u64,
    pub message_media_refs_deleted: u64,
    pub outbox_events_deleted: u64,
    pub inbox_events_deleted: u64,
    pub realtime_device_events_deleted: u64,
    pub rtc_sessions_deleted: u64,
    pub invitations_deleted: u64,
    pub audit_records_deleted: u64,
    pub realtime_subscriptions_deleted: u64,
    pub presence_states_deleted: u64,
    pub realtime_disconnect_fences_deleted: u64,
    pub notification_tasks_deleted: u64,
    pub automation_executions_deleted: u64,
    pub conversation_members_deleted: u64,
    pub conversation_read_cursors_deleted: u64,
    pub registered_client_routes_deleted: u64,
    pub client_sync_events_deleted: u64,
    pub client_sync_cursors_deleted: u64,
    pub stream_frames_deleted: u64,
    pub stream_sessions_deleted: u64,
    pub conversation_agent_assignments_deleted: u64,
    pub conversation_agent_binding_deleted: u64,
    pub agent_dispatch_deleted: u64,
    pub conversations_deleted: u64,
}

impl RetentionCleanupReport {
    pub fn total_deleted(&self) -> u64 {
        self.commit_journal_deleted
            + self.conversation_messages_deleted
            + self.message_media_refs_deleted
            + self.outbox_events_deleted
            + self.inbox_events_deleted
            + self.realtime_device_events_deleted
            + self.rtc_sessions_deleted
            + self.invitations_deleted
            + self.audit_records_deleted
            + self.realtime_subscriptions_deleted
            + self.presence_states_deleted
            + self.realtime_disconnect_fences_deleted
            + self.notification_tasks_deleted
            + self.automation_executions_deleted
            + self.conversation_members_deleted
            + self.conversation_read_cursors_deleted
            + self.registered_client_routes_deleted
            + self.client_sync_events_deleted
            + self.client_sync_cursors_deleted
            + self.stream_frames_deleted
            + self.stream_sessions_deleted
            + self.conversation_agent_assignments_deleted
            + self.conversation_agent_binding_deleted
            + self.agent_dispatch_deleted
            + self.conversations_deleted
    }
}

#[derive(Clone, Debug)]
pub struct RetentionPurgeRequest {
    context: PrivilegedOperationContext,
    batch_size: i64,
}

impl RetentionPurgeRequest {
    pub fn try_new(
        context: PrivilegedOperationContext,
        batch_size: Option<i64>,
    ) -> Result<Self, ContractError> {
        let batch_size = batch_size.unwrap_or(DEFAULT_PURGE_BATCH_SIZE);
        if !(1..=RETENTION_PURGE_BATCH_SIZE_MAX).contains(&batch_size) {
            return Err(ContractError::Invalid(format!(
                "retention purge batch size must be between 1 and {RETENTION_PURGE_BATCH_SIZE_MAX}"
            )));
        }
        Ok(Self {
            context,
            batch_size,
        })
    }

    pub fn context(&self) -> &PrivilegedOperationContext {
        &self.context
    }

    pub const fn batch_size(&self) -> i64 {
        self.batch_size
    }
}

pub fn purge_expired_retention_batch(
    pool: &PostgresJournalPool,
    request: RetentionPurgeRequest,
) -> Result<RetentionCleanupReport, ContractError> {
    let actor_kind = request.context().actor_kind().as_str().to_owned();
    let actor_id = request.context().actor_id().to_owned();
    let trace_id = request.context().trace_id().to_owned();
    let limit = request.batch_size();
    let pool = pool.clone();
    let result = run_postgres_io(move || {
        let mut client = postgres_pool_client(&pool, "journal retention purge")?;
        let mut txn = client
            .transaction()
            .map_err(|error| postgres_unavailable("journal retention purge begin", error))?;
        let report = purge_retention_batch_on_txn(&mut txn, limit)?;
        txn.commit()
            .map_err(|error| postgres_unavailable("journal retention purge commit", error))?;
        Ok(report)
    });
    log_retention_purge_outcome(&actor_kind, &actor_id, &trace_id, limit, &result);
    result
}

/// Runs the retention deletes on an already-open transaction. Used by the
/// public single-batch entrypoint and by the retention scheduler, which holds
/// one transaction (and its advisory xact lock) across a whole tick.
pub(crate) fn purge_retention_batch_on_txn(
    txn: &mut postgres::Transaction<'_>,
    limit: i64,
) -> Result<RetentionCleanupReport, ContractError> {
    let commit_journal_deleted = execute_retention_delete(txn, PURGE_COMMIT_JOURNAL_SQL, limit)?;
    let mut conversation_messages_deleted =
        execute_retention_delete(txn, PURGE_CONVERSATION_MESSAGES_SQL, limit)?;
    let message_media_refs_deleted =
        execute_retention_delete(txn, PURGE_MESSAGE_MEDIA_REFS_SQL, limit)?;
    let outbox_events_deleted = execute_retention_delete(txn, PURGE_OUTBOX_EVENTS_SQL, limit)?;
    let inbox_events_deleted = execute_retention_delete(txn, PURGE_INBOX_EVENTS_SQL, limit)?;
    let realtime_device_events_deleted =
        execute_retention_delete(txn, PURGE_REALTIME_DEVICE_EVENTS_SQL, limit)?;
    let rtc_sessions_deleted = execute_retention_delete(txn, PURGE_RTC_SESSIONS_SQL, limit)?;
    let invitations_deleted = execute_retention_delete(txn, PURGE_INVITATIONS_SQL, limit)?;
    let realtime_subscriptions_deleted =
        execute_retention_delete(txn, PURGE_REALTIME_SUBSCRIPTIONS_SQL, limit)?;
    let presence_states_deleted =
        execute_retention_delete(txn, PURGE_PRESENCE_STATES_SQL, limit)?;
    let realtime_disconnect_fences_deleted =
        execute_retention_delete(txn, PURGE_REALTIME_DISCONNECT_FENCES_SQL, limit)?;
    let notification_tasks_deleted =
        execute_retention_delete(txn, PURGE_NOTIFICATION_TASKS_SQL, limit)?;
    let automation_executions_deleted =
        execute_retention_delete(txn, PURGE_AUTOMATION_EXECUTIONS_SQL, limit)?;
    let mut conversation_members_deleted =
        execute_retention_delete(txn, PURGE_CONVERSATION_MEMBERS_SQL, limit)?;
    let mut conversation_read_cursors_deleted =
        execute_retention_delete(txn, PURGE_CONVERSATION_READ_CURSORS_SQL, limit)?;
    let registered_client_routes_deleted =
        execute_retention_delete(txn, PURGE_REGISTERED_CLIENT_ROUTES_SQL, limit)?;
    let client_sync_events_deleted =
        execute_retention_delete(txn, PURGE_CLIENT_SYNC_EVENTS_SQL, limit)?;
    let client_sync_cursors_deleted =
        execute_retention_delete(txn, PURGE_CLIENT_SYNC_CURSORS_SQL, limit)?;
    let mut stream_frames_deleted = execute_retention_delete(txn, PURGE_STREAM_FRAMES_SQL, limit)?;
    let mut stream_sessions_deleted =
        execute_retention_delete(txn, PURGE_STREAM_SESSIONS_SQL, limit)?;
    let mut conversation_agent_assignments_deleted = execute_retention_delete(
        txn,
        PURGE_CONVERSATION_AGENT_ASSIGNMENTS_SQL,
        limit,
    )?;
    let mut conversation_agent_binding_deleted = execute_retention_delete(
        txn,
        PURGE_CONVERSATION_AGENT_BINDING_SQL,
        limit,
    )?;
    let mut agent_dispatch_deleted =
        execute_retention_delete(txn, PURGE_AGENT_DISPATCH_SQL, limit)?;

    // Bounded cascade for expired conversations: dependent rows first, then the
    // conversation row. Counts are folded into the owning table counters.
    stream_frames_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_STREAM_FRAMES_SQL,
        limit,
    )?;
    stream_sessions_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_STREAM_SESSIONS_SQL,
        limit,
    )?;
    agent_dispatch_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_AGENT_DISPATCH_SQL,
        limit,
    )?;
    conversation_agent_assignments_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_CASCADE_AGENT_ASSIGNMENTS_SQL,
        limit,
    )?;
    conversation_agent_binding_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_CASCADE_AGENT_BINDING_SQL,
        limit,
    )?;
    conversation_read_cursors_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_CASCADE_READ_CURSORS_SQL,
        limit,
    )?;
    conversation_members_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_CASCADE_MEMBERS_SQL,
        limit,
    )?;
    conversation_messages_deleted += execute_retention_delete(
        txn,
        PURGE_CONVERSATION_CASCADE_MESSAGES_SQL,
        limit,
    )?;
    let conversations_deleted = execute_retention_delete(txn, PURGE_CONVERSATIONS_SQL, limit)?;
    let mut audit_records_deleted = 0_u64;
    for retention_class in AUDIT_RETENTION_CLASSES {
        audit_records_deleted += execute_audit_retention_delete(txn, retention_class, limit)?;
    }

    Ok(RetentionCleanupReport {
        commit_journal_deleted,
        conversation_messages_deleted,
        message_media_refs_deleted,
        outbox_events_deleted,
        inbox_events_deleted,
        realtime_device_events_deleted,
        rtc_sessions_deleted,
        invitations_deleted,
        audit_records_deleted,
        realtime_subscriptions_deleted,
        presence_states_deleted,
        realtime_disconnect_fences_deleted,
        notification_tasks_deleted,
        automation_executions_deleted,
        conversation_members_deleted,
        conversation_read_cursors_deleted,
        registered_client_routes_deleted,
        client_sync_events_deleted,
        client_sync_cursors_deleted,
        stream_frames_deleted,
        stream_sessions_deleted,
        conversation_agent_assignments_deleted,
        conversation_agent_binding_deleted,
        agent_dispatch_deleted,
        conversations_deleted,
    })
}

/// Security audit log for one retention purge batch (cross-organization
/// operation evidence). Shared by the public entrypoint and the scheduler.
pub(crate) fn log_retention_purge_outcome(
    actor_kind: &str,
    actor_id: &str,
    trace_id: &str,
    limit: i64,
    result: &Result<RetentionCleanupReport, ContractError>,
) {
    match result {
        Ok(report) => tracing::info!(
            target: "sdkwork.im.security",
            event = "im.retention_purge.operation_completed",
            actor_kind,
            actor_id,
            trace_id,
            outcome = "succeeded",
            batch_size = limit,
            rows_deleted = report.total_deleted(),
            "cross-organization retention purge completed"
        ),
        Err(error) => tracing::warn!(
            target: "sdkwork.im.security",
            event = "im.retention_purge.operation_completed",
            actor_kind,
            actor_id,
            trace_id,
            outcome = "failed",
            batch_size = limit,
            error = ?error,
            "cross-organization retention purge failed"
        ),
    }
}

fn execute_retention_delete(
    txn: &mut postgres::Transaction<'_>,
    sql: &str,
    limit: i64,
) -> Result<u64, ContractError> {
    txn.execute(sql, &[&limit])
        .map_err(|error| postgres_unavailable("journal retention purge delete", error))
}

fn execute_audit_retention_delete(
    txn: &mut postgres::Transaction<'_>,
    retention_class: &str,
    limit: i64,
) -> Result<u64, ContractError> {
    txn.execute(
        PURGE_AUDIT_RECORDS_BY_CLASS_SQL,
        &[&limit, &retention_class],
    )
    .map_err(|error| postgres_unavailable("journal retention purge delete", error))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_retention_purge_sql_requires_expired_retention_until() {
        for sql in [
            PURGE_COMMIT_JOURNAL_SQL,
            PURGE_CONVERSATION_MESSAGES_SQL,
            PURGE_MESSAGE_MEDIA_REFS_SQL,
            PURGE_OUTBOX_EVENTS_SQL,
            PURGE_INBOX_EVENTS_SQL,
            PURGE_REALTIME_DEVICE_EVENTS_SQL,
            PURGE_RTC_SESSIONS_SQL,
            PURGE_INVITATIONS_SQL,
            PURGE_AUDIT_RECORDS_BY_CLASS_SQL,
            PURGE_REALTIME_SUBSCRIPTIONS_SQL,
            PURGE_PRESENCE_STATES_SQL,
            PURGE_REALTIME_DISCONNECT_FENCES_SQL,
            PURGE_NOTIFICATION_TASKS_SQL,
            PURGE_AUTOMATION_EXECUTIONS_SQL,
            PURGE_CONVERSATION_MEMBERS_SQL,
            PURGE_CONVERSATION_READ_CURSORS_SQL,
            PURGE_REGISTERED_CLIENT_ROUTES_SQL,
            PURGE_CLIENT_SYNC_EVENTS_SQL,
            PURGE_CLIENT_SYNC_CURSORS_SQL,
            PURGE_STREAM_FRAMES_SQL,
            PURGE_STREAM_SESSIONS_SQL,
            PURGE_CONVERSATION_AGENT_ASSIGNMENTS_SQL,
            PURGE_CONVERSATION_AGENT_BINDING_SQL,
            PURGE_AGENT_DISPATCH_SQL,
            PURGE_CONVERSATIONS_SQL,
            PURGE_CONVERSATION_STREAM_FRAMES_SQL,
            PURGE_CONVERSATION_STREAM_SESSIONS_SQL,
            PURGE_CONVERSATION_AGENT_DISPATCH_SQL,
            PURGE_CONVERSATION_CASCADE_AGENT_ASSIGNMENTS_SQL,
            PURGE_CONVERSATION_CASCADE_AGENT_BINDING_SQL,
            PURGE_CONVERSATION_CASCADE_READ_CURSORS_SQL,
            PURGE_CONVERSATION_CASCADE_MEMBERS_SQL,
            PURGE_CONVERSATION_CASCADE_MESSAGES_SQL,
        ] {
            assert!(
                sql.contains("retention_until IS NOT NULL"),
                "purge SQL must skip indefinite retention rows"
            );
            assert!(
                sql.contains("retention_until <= NOW()"),
                "purge SQL must only delete expired rows"
            );
        }
    }

    #[test]
    fn every_simple_retention_table_has_a_bounded_purge_statement() {
        assert_eq!(SIMPLE_RETENTION_PURGE_SQLS.len(), 15);
        for sql in SIMPLE_RETENTION_PURGE_SQLS {
            assert!(
                sql.contains("LIMIT $1"),
                "retention purge must stay batch-bounded"
            );
            assert!(
                sql.contains("ORDER BY retention_until ASC"),
                "retention purge must walk the oldest expired rows first"
            );
        }
    }

    #[test]
    fn test_audit_retention_purge_scoped_by_class() {
        let sql = PURGE_AUDIT_RECORDS_BY_CLASS_SQL;
        assert!(
            sql.contains("retention_class = $2"),
            "audit purge must scope by retention_class"
        );
        assert!(
            sql.contains("LIMIT $1"),
            "audit purge must keep the shared bounded-batch limit"
        );
        assert_eq!(AUDIT_RETENTION_CLASSES.len(), 4);
    }
}

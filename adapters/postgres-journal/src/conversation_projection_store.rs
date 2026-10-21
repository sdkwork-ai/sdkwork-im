//! PostgreSQL authority for durable Conversation summary and profile reads.
//!
//! Both projections come from normalized tables: the summary columns on
//! `im_conversations` (+ `im_conversation_handoffs`) and
//! `im_conversation_profiles` with group/channel display fallback. The
//! process-local projection cache is never consulted here.

use chrono::{DateTime, SecondsFormat, Utc};
use im_platform_contracts::{
    ContractError, ConversationProfileRecord, ConversationProfileStore,
    ConversationSummaryAuthority, ConversationSummaryRecord,
};

use crate::{
    PostgresJournalPool, inbox_store::handoff_from_row, postgres_pool_client, postgres_row_get,
    postgres_timestamptz, postgres_unavailable_db, run_postgres_io,
};

const LOAD_SUMMARY_SQL: &str = r#"
select
    c.tenant_id,
    c.organization_id,
    c.conversation_id,
    c.message_count,
    c.last_message_id,
    c.last_message_seq,
    c.last_sender_kind,
    c.last_sender_id,
    c.last_summary,
    c.last_message_at,
    h.status,
    h.source_principal_kind,
    h.source_principal_id,
    h.target_principal_kind,
    h.target_principal_id,
    h.handoff_session_id,
    h.handoff_reason,
    h.accepted_at,
    h.accepted_by_principal_kind,
    h.accepted_by_principal_id,
    h.resolved_at,
    h.resolved_by_principal_kind,
    h.resolved_by_principal_id,
    h.closed_at,
    h.closed_by_principal_kind,
    h.closed_by_principal_id
from im_conversations c
left join im_conversation_handoffs h
  on h.tenant_id = c.tenant_id
 and h.organization_id = c.organization_id
 and h.conversation_id = c.conversation_id
where c.tenant_id = $1 and c.organization_id = $2 and c.conversation_id = $3
"#;

const LOAD_PROFILE_SQL: &str = r#"
select
    coalesce(p.display_name, g.group_name, ch.channel_name, c.conversation_id) as display_name,
    coalesce(p.avatar_url, g.avatar_url, '') as avatar_url,
    coalesce(p.notice, '') as notice,
    coalesce(p.updated_at, c.updated_at) as updated_at,
    p.updated_by_principal_kind,
    p.updated_by_principal_id
from im_conversations c
left join im_conversation_profiles p
  on p.tenant_id = c.tenant_id
 and p.organization_id = c.organization_id
 and p.conversation_id = c.conversation_id
left join im_chat_groups g
  on g.tenant_id = c.tenant_id
 and g.organization_id = c.organization_id
 and g.conversation_id = c.conversation_id
left join im_chat_channels ch
  on ch.tenant_id = c.tenant_id
 and ch.organization_id = c.organization_id
 and ch.conversation_id = c.conversation_id
where c.tenant_id = $1 and c.organization_id = $2 and c.conversation_id = $3
"#;

const UPSERT_PROFILE_SQL: &str = r#"
insert into im_conversation_profiles (
    tenant_id, organization_id, conversation_id, display_name, avatar_url, notice,
    updated_by_principal_kind, updated_by_principal_id, created_at, updated_at
) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
on conflict (tenant_id, organization_id, conversation_id)
do update set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    notice = excluded.notice,
    updated_by_principal_kind = excluded.updated_by_principal_kind,
    updated_by_principal_id = excluded.updated_by_principal_id,
    updated_at = excluded.updated_at
where im_conversation_profiles.updated_at <= excluded.updated_at
"#;

/// PostgreSQL Conversation summary/profile authority.
#[derive(Clone)]
pub struct PostgresConversationProjectionStore {
    pool: PostgresJournalPool,
}

impl PostgresConversationProjectionStore {
    pub fn from_pool(pool: PostgresJournalPool) -> Self {
        Self { pool }
    }
}

impl ConversationSummaryAuthority for PostgresConversationProjectionStore {
    fn load_conversation_summary(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<Option<ConversationSummaryRecord>, ContractError> {
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let conversation_id = conversation_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "load_conversation_summary")?;
            let row = client
                .query_opt(
                    LOAD_SUMMARY_SQL,
                    &[&tenant_id, &organization_id, &conversation_id],
                )
                .map_err(|error| postgres_unavailable_db("load conversation summary", error))?;
            let Some(row) = row else {
                return Ok(None);
            };
            let message_count: i64 =
                postgres_row_get(&row, 3, "conversation summary", "message_count")?;
            let last_message_id: Option<i64> =
                postgres_row_get(&row, 4, "conversation summary", "last_message_id")?;
            let last_message_seq: i64 =
                postgres_row_get(&row, 5, "conversation summary", "last_message_seq")?;
            let last_message_at: Option<DateTime<Utc>> =
                postgres_row_get(&row, 9, "conversation summary", "last_message_at")?;
            Ok(Some(ConversationSummaryRecord {
                tenant_id: postgres_row_get(&row, 0, "conversation summary", "tenant_id")?,
                organization_id: postgres_row_get(
                    &row,
                    1,
                    "conversation summary",
                    "organization_id",
                )?,
                conversation_id: postgres_row_get(
                    &row,
                    2,
                    "conversation summary",
                    "conversation_id",
                )?,
                message_count: non_negative(message_count, "message_count")?,
                last_message_id: last_message_id.map(|value| value.to_string()),
                last_message_seq: non_negative(last_message_seq, "last_message_seq")?,
                last_sender_kind: postgres_row_get(
                    &row,
                    6,
                    "conversation summary",
                    "last_sender_kind",
                )?,
                last_sender_id: postgres_row_get(
                    &row,
                    7,
                    "conversation summary",
                    "last_sender_id",
                )?,
                last_summary: postgres_row_get(&row, 8, "conversation summary", "last_summary")?,
                last_message_at: last_message_at.map(format_timestamp),
                handoff: handoff_from_row(&row, 10)?,
            }))
        })
    }
}

impl ConversationProfileStore for PostgresConversationProjectionStore {
    fn load_profile(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<Option<ConversationProfileRecord>, ContractError> {
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let conversation_id = conversation_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "load_conversation_profile")?;
            let row = client
                .query_opt(
                    LOAD_PROFILE_SQL,
                    &[&tenant_id, &organization_id, &conversation_id],
                )
                .map_err(|error| postgres_unavailable_db("load conversation profile", error))?;
            let Some(row) = row else {
                return Ok(None);
            };
            let updated_at: DateTime<Utc> =
                postgres_row_get(&row, 3, "conversation profile", "updated_at")?;
            Ok(Some(ConversationProfileRecord {
                tenant_id,
                organization_id,
                conversation_id,
                display_name: postgres_row_get(&row, 0, "conversation profile", "display_name")?,
                avatar_url: postgres_row_get(&row, 1, "conversation profile", "avatar_url")?,
                notice: postgres_row_get(&row, 2, "conversation profile", "notice")?,
                updated_at: format_timestamp(updated_at),
                updated_by_principal_kind: postgres_row_get(
                    &row,
                    4,
                    "conversation profile",
                    "updated_by_principal_kind",
                )?,
                updated_by_principal_id: postgres_row_get(
                    &row,
                    5,
                    "conversation profile",
                    "updated_by_principal_id",
                )?,
            }))
        })
    }

    fn save_profile(&self, record: ConversationProfileRecord) -> Result<(), ContractError> {
        let pool = self.pool.clone();
        let updated_at = if record.updated_at.trim().is_empty() {
            crate::now_rfc3339()
        } else {
            record.updated_at.clone()
        };
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "save_conversation_profile")?;
            let updated_at =
                postgres_timestamptz(updated_at.as_str(), "conversation profile updated_at")?;
            client
                .execute(
                    UPSERT_PROFILE_SQL,
                    &[
                        &record.tenant_id,
                        &record.organization_id,
                        &record.conversation_id,
                        &record.display_name,
                        &record.avatar_url,
                        &record.notice,
                        &record.updated_by_principal_kind,
                        &record.updated_by_principal_id,
                        &updated_at,
                    ],
                )
                .map_err(|error| postgres_unavailable_db("save conversation profile", error))?;
            Ok(())
        })
    }
}

fn non_negative(value: i64, field: &'static str) -> Result<u64, ContractError> {
    u64::try_from(value).map_err(|_| {
        ContractError::Unavailable(format!(
            "postgres conversation summary returned a negative {field}"
        ))
    })
}

fn format_timestamp(value: DateTime<Utc>) -> String {
    value.to_rfc3339_opts(SecondsFormat::Millis, true)
}

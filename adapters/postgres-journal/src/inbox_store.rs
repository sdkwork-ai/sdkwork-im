//! PostgreSQL authority for the Conversation inbox and per-member preferences.
//!
//! The inbox is read from normalized tables only:
//!
//! ```text
//! im_conversation_members
//!   -> im_conversations          (type, summary columns, lifecycle)
//!   -> im_conversation_read_cursors (per-member keyset read position)
//!   -> im_conversation_messages  (bounded unread count)
//!   -> im_chat_groups / im_chat_channels (display title)
//!   -> im_user_profiles          (direct-chat peer display)
//!   -> im_conversation_member_preferences
//!   -> im_conversation_handoffs
//! ```
//!
//! The query is a single bounded statement: tenant/organization/principal
//! predicates are mandatory, ordering is `(last_activity_at DESC,
//! conversation_id DESC)`, paging is a keyset predicate, and the adapter
//! fetches one extra row to report continuation.

use chrono::{DateTime, SecondsFormat, Utc};
use im_platform_contracts::{
    CONVERSATION_INBOX_PAGE_SIZE_MAX, ContractError, ConversationInboxAuthority,
    ConversationInboxHandoffRecord, ConversationInboxPage, ConversationInboxPageCursor,
    ConversationInboxRecord, ConversationMemberPreferencesRecord,
    ConversationMemberPreferencesStore,
};

use crate::{
    PostgresJournalPool, now_rfc3339, postgres_pool_client, postgres_row_get, postgres_timestamptz,
    postgres_unavailable_db, run_postgres_io,
};

const LIST_INBOX_SQL: &str = r#"
select
    m.tenant_id,
    m.organization_id,
    m.principal_kind,
    m.principal_id,
    m.member_id,
    c.conversation_id,
    c.conversation_type,
    coalesce(g.group_name, ch.channel_name) as conversation_title,
    g.avatar_url as conversation_avatar_url,
    peer.principal_kind as peer_principal_kind,
    peer.principal_id as peer_principal_id,
    up.im_nickname as peer_display_name,
    up.im_avatar_url as peer_avatar_url,
    c.message_count,
    c.last_message_id,
    c.last_message_seq,
    c.last_sender_kind,
    c.last_sender_id,
    c.last_summary,
    (select count(*)
       from im_conversation_messages msg
      where msg.tenant_id = c.tenant_id
        and msg.organization_id = c.organization_id
        and msg.conversation_id = c.conversation_id
        and msg.message_seq > coalesce(rc.read_seq, 0)
        and msg.deleted_at is null
        and not (msg.sender_principal_kind = m.principal_kind
                 and msg.sender_principal_id = m.principal_id)
    ) as unread_count,
    c.last_activity_at,
    coalesce(p.is_pinned, false) as is_pinned,
    coalesce(p.is_muted, false) as is_muted,
    coalesce(p.is_marked_unread, false) as is_marked_unread,
    coalesce(p.is_hidden, false) as is_hidden,
    p.updated_at as preferences_updated_at,
    h.status as handoff_status,
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
from im_conversation_members m
join im_conversations c
  on c.tenant_id = m.tenant_id
 and c.organization_id = m.organization_id
 and c.conversation_id = m.conversation_id
left join lateral (
    select max(read_seq) as read_seq
    from im_conversation_read_cursors rc
    where rc.tenant_id = m.tenant_id
      and rc.organization_id = m.organization_id
      and rc.conversation_id = m.conversation_id
      and rc.principal_kind = m.principal_kind
      and rc.principal_id = m.principal_id
) rc on true
left join im_chat_groups g
  on g.tenant_id = c.tenant_id
 and g.organization_id = c.organization_id
 and g.conversation_id = c.conversation_id
left join im_chat_channels ch
  on ch.tenant_id = c.tenant_id
 and ch.organization_id = c.organization_id
 and ch.conversation_id = c.conversation_id
-- Only direct conversations resolve a peer. The guard is repeated INSIDE the
-- lateral so group/channel rows filter their member tuples before the sort
-- instead of ranking every member of a large roster just to have the join
-- condition discard the result. The `on` condition below still rejects
-- non-direct rows, so the join output is unchanged.
left join lateral (
    select om.principal_kind, om.principal_id
    from im_conversation_members om
    where c.conversation_type = 'direct'
      and om.tenant_id = c.tenant_id
      and om.organization_id = c.organization_id
      and om.conversation_id = c.conversation_id
      and om.membership_state in ('joined', 'linked')
      and not (om.principal_kind = m.principal_kind and om.principal_id = m.principal_id)
    order by om.joined_at asc, om.principal_kind asc, om.principal_id asc
    limit 1
) peer on c.conversation_type = 'direct'
left join im_user_profiles up
  on up.tenant_id = c.tenant_id
 and up.organization_id = c.organization_id
 and up.user_id = peer.principal_id
 and peer.principal_kind = 'user'
left join im_conversation_member_preferences p
  on p.tenant_id = m.tenant_id
 and p.organization_id = m.organization_id
 and p.conversation_id = m.conversation_id
 and p.principal_kind = m.principal_kind
 and p.principal_id = m.principal_id
left join im_conversation_handoffs h
  on h.tenant_id = c.tenant_id
 and h.organization_id = c.organization_id
 and h.conversation_id = c.conversation_id
where m.tenant_id = $1
  and m.organization_id = $2
  and m.principal_kind = $3
  and m.principal_id = $4
  and m.membership_state in ('joined', 'linked')
  and c.lifecycle_state = 'active'
  and (
      $5::timestamptz is null
      or (c.last_activity_at, c.conversation_id) < ($5::timestamptz, $6::text)
  )
  and ($7::text is null or lower(c.conversation_type) = lower($7::text))
  and (
      $8::text is null
      or position(
          lower($8::text) in lower(
              coalesce(coalesce(g.group_name, ch.channel_name), '')
              || ' ' || coalesce(c.last_summary, '')
              || ' ' || c.conversation_id
              || ' ' || coalesce(up.im_nickname, '')
          )
      ) > 0
  )
order by c.last_activity_at desc, c.conversation_id desc
limit $9
"#;

const LOAD_PREFERENCES_SQL: &str = r#"
select is_pinned, is_muted, is_marked_unread, is_hidden, updated_at
from im_conversation_member_preferences
where tenant_id = $1 and organization_id = $2 and conversation_id = $3
  and principal_kind = $4 and principal_id = $5
"#;

const ACTIVE_MEMBER_SQL: &str = r#"
select 1
from im_conversation_members
where tenant_id = $1 and organization_id = $2 and conversation_id = $3
  and principal_kind = $4 and principal_id = $5
  and membership_state in ('joined', 'linked')
"#;

const ACTIVE_MEMBER_ROLE_SQL: &str = r#"
select membership_role
from im_conversation_members
where tenant_id = $1 and organization_id = $2 and conversation_id = $3
  and principal_kind = $4 and principal_id = $5
  and membership_state in ('joined', 'linked')
"#;

const UPSERT_PREFERENCES_SQL: &str = r#"
insert into im_conversation_member_preferences (
    tenant_id, organization_id, conversation_id, principal_kind, principal_id,
    is_pinned, is_muted, is_marked_unread, is_hidden, created_at, updated_at
) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
on conflict (tenant_id, organization_id, conversation_id, principal_kind, principal_id)
do update set
    is_pinned = excluded.is_pinned,
    is_muted = excluded.is_muted,
    is_marked_unread = excluded.is_marked_unread,
    is_hidden = excluded.is_hidden,
    updated_at = excluded.updated_at
where im_conversation_member_preferences.updated_at <= excluded.updated_at
"#;

/// PostgreSQL inbox reader.
#[derive(Clone)]
pub struct PostgresConversationInboxAuthority {
    pool: PostgresJournalPool,
}

impl PostgresConversationInboxAuthority {
    pub fn from_pool(pool: PostgresJournalPool) -> Self {
        Self { pool }
    }
}

impl ConversationInboxAuthority for PostgresConversationInboxAuthority {
    fn list_inbox_page(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        cursor: Option<&ConversationInboxPageCursor>,
        limit: usize,
        conversation_type: Option<&str>,
        search: Option<&str>,
    ) -> Result<ConversationInboxPage, ContractError> {
        let limit = limit.clamp(1, CONVERSATION_INBOX_PAGE_SIZE_MAX);
        let fetch_limit = limit.saturating_add(1);
        let cursor_activity_at = cursor
            .map(|cursor| postgres_timestamptz(cursor.activity_at.as_str(), "inbox cursor"))
            .transpose()?;
        let cursor_conversation_id = cursor.map(|cursor| cursor.conversation_id.clone());
        let conversation_type = conversation_type
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_ascii_lowercase);
        let search = search
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_lowercase);
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let principal_kind = principal_kind.to_owned();
        let principal_id = principal_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "list_conversation_inbox")?;
            let rows = client
                .query(
                    LIST_INBOX_SQL,
                    &[
                        &tenant_id,
                        &organization_id,
                        &principal_kind,
                        &principal_id,
                        &cursor_activity_at,
                        &cursor_conversation_id,
                        &conversation_type,
                        &search,
                        &(fetch_limit as i64),
                    ],
                )
                .map_err(|error| postgres_unavailable_db("list conversation inbox", error))?;
            let mut items = Vec::with_capacity(rows.len());
            let mut next_cursor = None;
            for row in rows.iter().take(limit) {
                let record = inbox_record_from_row(row)?;
                next_cursor = Some(ConversationInboxPageCursor {
                    activity_at: record.last_activity_at.clone(),
                    conversation_id: record.conversation_id.clone(),
                });
                items.push(record);
            }
            let has_more = rows.len() > limit;
            Ok(ConversationInboxPage {
                items,
                next_cursor: next_cursor.filter(|_| has_more),
                has_more,
            })
        })
    }
}

/// PostgreSQL per-member Conversation preference store.
#[derive(Clone)]
pub struct PostgresConversationMemberPreferencesStore {
    pool: PostgresJournalPool,
}

impl PostgresConversationMemberPreferencesStore {
    pub fn from_pool(pool: PostgresJournalPool) -> Self {
        Self { pool }
    }
}

impl ConversationMemberPreferencesStore for PostgresConversationMemberPreferencesStore {
    fn load_preferences(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Result<Option<ConversationMemberPreferencesRecord>, ContractError> {
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let conversation_id = conversation_id.to_owned();
        let principal_kind = principal_kind.to_owned();
        let principal_id = principal_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "load_conversation_preferences")?;
            let row = client
                .query_opt(
                    LOAD_PREFERENCES_SQL,
                    &[
                        &tenant_id,
                        &organization_id,
                        &conversation_id,
                        &principal_kind,
                        &principal_id,
                    ],
                )
                .map_err(|error| postgres_unavailable_db("load conversation preferences", error))?;
            let Some(row) = row else {
                return Ok(None);
            };
            let updated_at: DateTime<Utc> =
                postgres_row_get(&row, 4, "load conversation preferences", "updated_at")?;
            Ok(Some(ConversationMemberPreferencesRecord {
                tenant_id,
                organization_id,
                conversation_id,
                principal_kind,
                principal_id,
                is_pinned: postgres_row_get(&row, 0, "load conversation preferences", "is_pinned")?,
                is_muted: postgres_row_get(&row, 1, "load conversation preferences", "is_muted")?,
                is_marked_unread: postgres_row_get(
                    &row,
                    2,
                    "load conversation preferences",
                    "is_marked_unread",
                )?,
                is_hidden: postgres_row_get(&row, 3, "load conversation preferences", "is_hidden")?,
                updated_at: format_timestamp(updated_at),
            }))
        })
    }

    fn save_preferences(
        &self,
        record: ConversationMemberPreferencesRecord,
    ) -> Result<(), ContractError> {
        let pool = self.pool.clone();
        let updated_at = if record.updated_at.trim().is_empty() {
            now_rfc3339()
        } else {
            record.updated_at.clone()
        };
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "save_conversation_preferences")?;
            let updated_at =
                postgres_timestamptz(updated_at.as_str(), "conversation preferences updated_at")?;
            client
                .execute(
                    UPSERT_PREFERENCES_SQL,
                    &[
                        &record.tenant_id,
                        &record.organization_id,
                        &record.conversation_id,
                        &record.principal_kind,
                        &record.principal_id,
                        &record.is_pinned,
                        &record.is_muted,
                        &record.is_marked_unread,
                        &record.is_hidden,
                        &updated_at,
                    ],
                )
                .map_err(|error| postgres_unavailable_db("save conversation preferences", error))?;
            Ok(())
        })
    }

    fn is_active_member(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Result<bool, ContractError> {
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let conversation_id = conversation_id.to_owned();
        let principal_kind = principal_kind.to_owned();
        let principal_id = principal_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "check_conversation_membership")?;
            let row = client
                .query_opt(
                    ACTIVE_MEMBER_SQL,
                    &[
                        &tenant_id,
                        &organization_id,
                        &conversation_id,
                        &principal_kind,
                        &principal_id,
                    ],
                )
                .map_err(|error| postgres_unavailable_db("check conversation membership", error))?;
            Ok(row.is_some())
        })
    }

    fn active_member_role(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Result<Option<String>, ContractError> {
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let conversation_id = conversation_id.to_owned();
        let principal_kind = principal_kind.to_owned();
        let principal_id = principal_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "load_conversation_member_role")?;
            let row = client
                .query_opt(
                    ACTIVE_MEMBER_ROLE_SQL,
                    &[
                        &tenant_id,
                        &organization_id,
                        &conversation_id,
                        &principal_kind,
                        &principal_id,
                    ],
                )
                .map_err(|error| postgres_unavailable_db("load conversation member role", error))?;
            let Some(row) = row else {
                return Ok(None);
            };
            let role: String =
                postgres_row_get(&row, 0, "load conversation member role", "membership_role")?;
            Ok(Some(role))
        })
    }
}

/// Default preference record used when a member has not customised a Conversation.
#[must_use]
pub fn default_conversation_member_preferences(
    tenant_id: &str,
    organization_id: &str,
    conversation_id: &str,
    principal_kind: &str,
    principal_id: &str,
) -> ConversationMemberPreferencesRecord {
    ConversationMemberPreferencesRecord::defaults(
        tenant_id,
        organization_id,
        conversation_id,
        principal_kind,
        principal_id,
    )
}

#[allow(clippy::too_many_lines)]
fn inbox_record_from_row(row: &postgres::Row) -> Result<ConversationInboxRecord, ContractError> {
    let member_id: i64 = postgres_row_get(row, 4, "conversation inbox", "member_id")?;
    let message_count: i64 = postgres_row_get(row, 13, "conversation inbox", "message_count")?;
    let last_message_id: Option<i64> =
        postgres_row_get(row, 14, "conversation inbox", "last_message_id")?;
    let last_message_seq: i64 =
        postgres_row_get(row, 15, "conversation inbox", "last_message_seq")?;
    let unread_count: i64 = postgres_row_get(row, 19, "conversation inbox", "unread_count")?;
    let last_activity_at: DateTime<Utc> =
        postgres_row_get(row, 20, "conversation inbox", "last_activity_at")?;
    let preferences_updated_at: Option<DateTime<Utc>> =
        postgres_row_get(row, 25, "conversation inbox", "preferences_updated_at")?;

    let tenant_id: String = postgres_row_get(row, 0, "conversation inbox", "tenant_id")?;
    let organization_id: String =
        postgres_row_get(row, 1, "conversation inbox", "organization_id")?;
    let principal_kind: String = postgres_row_get(row, 2, "conversation inbox", "principal_kind")?;
    let principal_id: String = postgres_row_get(row, 3, "conversation inbox", "principal_id")?;
    let conversation_id: String =
        postgres_row_get(row, 5, "conversation inbox", "conversation_id")?;

    let preferences = ConversationMemberPreferencesRecord {
        tenant_id: tenant_id.clone(),
        organization_id: organization_id.clone(),
        conversation_id: conversation_id.clone(),
        principal_kind: principal_kind.clone(),
        principal_id: principal_id.clone(),
        is_pinned: postgres_row_get(row, 21, "conversation inbox", "is_pinned")?,
        is_muted: postgres_row_get(row, 22, "conversation inbox", "is_muted")?,
        is_marked_unread: postgres_row_get(row, 23, "conversation inbox", "is_marked_unread")?,
        is_hidden: postgres_row_get(row, 24, "conversation inbox", "is_hidden")?,
        updated_at: preferences_updated_at.map_or_else(String::new, format_timestamp),
    };

    let handoff = handoff_from_row(row, 26)?;

    Ok(ConversationInboxRecord {
        tenant_id,
        organization_id,
        principal_kind,
        principal_id,
        member_id: member_id.to_string(),
        conversation_id,
        conversation_type: postgres_row_get(row, 6, "conversation inbox", "conversation_type")?,
        conversation_title: postgres_row_get(row, 7, "conversation inbox", "conversation_title")?,
        conversation_avatar_url: postgres_row_get(
            row,
            8,
            "conversation inbox",
            "conversation_avatar_url",
        )?,
        peer_principal_kind: postgres_row_get(row, 9, "conversation inbox", "peer_principal_kind")?,
        peer_principal_id: postgres_row_get(row, 10, "conversation inbox", "peer_principal_id")?,
        peer_display_name: postgres_row_get(row, 11, "conversation inbox", "peer_display_name")?,
        peer_avatar_url: postgres_row_get(row, 12, "conversation inbox", "peer_avatar_url")?,
        message_count: non_negative(message_count, "message_count")?,
        last_message_id: last_message_id.map(|value| value.to_string()),
        last_message_seq: non_negative(last_message_seq, "last_message_seq")?,
        last_sender_kind: postgres_row_get(row, 16, "conversation inbox", "last_sender_kind")?,
        last_sender_id: postgres_row_get(row, 17, "conversation inbox", "last_sender_id")?,
        last_summary: postgres_row_get(row, 18, "conversation inbox", "last_summary")?,
        unread_count: non_negative(unread_count, "unread_count")?,
        last_activity_at: format_timestamp(last_activity_at),
        preferences,
        handoff,
    })
}

/// Maps the 16 consecutive handoff columns starting at `start`.
///
/// Shared by the inbox query (handoff at the end of the projection) and the
/// summary query (handoff at column 10).
pub(crate) fn handoff_from_row(
    row: &postgres::Row,
    start: usize,
) -> Result<Option<ConversationInboxHandoffRecord>, ContractError> {
    let Some(status): Option<String> =
        postgres_row_get(row, start, "conversation handoff", "status")?
    else {
        return Ok(None);
    };
    Ok(Some(ConversationInboxHandoffRecord {
        status,
        source_principal_kind: postgres_row_get(
            row,
            start + 1,
            "conversation handoff",
            "source_principal_kind",
        )?,
        source_principal_id: postgres_row_get(
            row,
            start + 2,
            "conversation handoff",
            "source_principal_id",
        )?,
        target_principal_kind: postgres_row_get(
            row,
            start + 3,
            "conversation handoff",
            "target_principal_kind",
        )?,
        target_principal_id: postgres_row_get(
            row,
            start + 4,
            "conversation handoff",
            "target_principal_id",
        )?,
        handoff_session_id: postgres_row_get(
            row,
            start + 5,
            "conversation handoff",
            "handoff_session_id",
        )?,
        handoff_reason: postgres_row_get(row, start + 6, "conversation handoff", "handoff_reason")?,
        accepted_at: optional_timestamp(row, start + 7)?,
        accepted_by_principal_kind: postgres_row_get(
            row,
            start + 8,
            "conversation handoff",
            "accepted_by_principal_kind",
        )?,
        accepted_by_principal_id: postgres_row_get(
            row,
            start + 9,
            "conversation handoff",
            "accepted_by_principal_id",
        )?,
        resolved_at: optional_timestamp(row, start + 10)?,
        resolved_by_principal_kind: postgres_row_get(
            row,
            start + 11,
            "conversation handoff",
            "resolved_by_principal_kind",
        )?,
        resolved_by_principal_id: postgres_row_get(
            row,
            start + 12,
            "conversation handoff",
            "resolved_by_principal_id",
        )?,
        closed_at: optional_timestamp(row, start + 13)?,
        closed_by_principal_kind: postgres_row_get(
            row,
            start + 14,
            "conversation handoff",
            "closed_by_principal_kind",
        )?,
        closed_by_principal_id: postgres_row_get(
            row,
            start + 15,
            "conversation handoff",
            "closed_by_principal_id",
        )?,
    }))
}

fn optional_timestamp(row: &postgres::Row, column: usize) -> Result<Option<String>, ContractError> {
    let value: Option<DateTime<Utc>> =
        postgres_row_get(row, column, "conversation inbox", "timestamp")?;
    Ok(value.map(format_timestamp))
}

fn non_negative(value: i64, field: &'static str) -> Result<u64, ContractError> {
    u64::try_from(value).map_err(|_| {
        ContractError::Unavailable(format!(
            "postgres conversation inbox returned a negative {field}"
        ))
    })
}

fn format_timestamp(value: DateTime<Utc>) -> String {
    value.to_rfc3339_opts(SecondsFormat::Millis, true)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Extracts the `im_conversation_members` lateral body (everything between
    /// `left join lateral (` and the closing `) peer on ...`).
    fn peer_lateral_body(sql: &str) -> String {
        let normalized = sql.to_ascii_lowercase();
        let lateral_start = normalized
            .rfind("left join lateral (")
            .expect("inbox SQL must keep the peer lateral join");
        let lateral_end = normalized[lateral_start..]
            .find(") peer on")
            .expect("peer lateral must be closed by `) peer on ...`");
        let body = normalized[lateral_start..lateral_start + lateral_end].to_owned();
        assert!(
            body.contains("from im_conversation_members om"),
            "the last lateral must be the peer member lookup"
        );
        body
    }

    #[test]
    fn list_inbox_guards_peer_lateral_on_direct_conversations_inside_the_subquery() {
        let body = peer_lateral_body(LIST_INBOX_SQL);
        // The guard must be part of the lateral's own WHERE clause, i.e. it
        // must precede the closing paren of `) peer on ...`.
        assert!(
            body.contains("where c.conversation_type = 'direct'"),
            "the direct-conversation guard must be the lateral's first predicate"
        );
        // Ordering and single-row semantics of the direct-chat peer contract
        // must be untouched.
        assert!(body.contains("order by om.joined_at asc"));
        assert!(body.contains("limit 1"));
        assert!(body.contains("om.membership_state in ('joined', 'linked')"));
        assert!(body.contains(
            "not (om.principal_kind = m.principal_kind and om.principal_id = m.principal_id)"
        ));
    }

    #[test]
    fn list_inbox_keeps_peer_join_condition_that_discards_non_direct_rows() {
        let normalized = LIST_INBOX_SQL.to_ascii_lowercase();
        assert!(
            normalized.contains(") peer on c.conversation_type = 'direct'"),
            "the LEFT JOIN condition must keep rejecting non-direct peer rows"
        );
    }

    #[test]
    fn list_inbox_unread_count_stays_exact_per_row() {
        // The correlated count is deliberately NOT capped: a bounded subquery
        // would change the reported unread number whenever the backlog exceeds
        // the cap. Guard the shape so a silent truncation cannot be introduced.
        let normalized = LIST_INBOX_SQL.to_ascii_lowercase();
        assert!(normalized.contains("(select count(*)"));
        assert!(normalized.contains("msg.message_seq > coalesce(rc.read_seq, 0)"));
        assert!(
            !normalized.contains("least(("),
            "unread_count must stay exact; do not cap it in SQL"
        );
    }
}

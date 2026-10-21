//! PostgreSQL Message favorite store (`im_message_favorites`).

use chrono::{DateTime, SecondsFormat, Utc};
use im_platform_contracts::{
    ContractError, MessageFavoritePage, MessageFavoritePageCursor, MessageFavoriteRecord,
    MessageFavoriteStore,
};

use crate::{
    PostgresJournalPool, postgres_pool_client, postgres_row_get, postgres_timestamptz,
    postgres_unavailable_db, run_postgres_io,
};

const LIST_FAVORITES_SQL: &str = r#"
select
    favorite_id, favorite_type, conversation_id, message_id, message_seq,
    title, content_preview, source_display_name, favorited_at
from im_message_favorites
where tenant_id = $1 and organization_id = $2
  and principal_kind = $3 and principal_id = $4
  and (
      $5::timestamptz is null
      or (favorited_at, favorite_id) < ($5::timestamptz, $6::text)
  )
  and ($7::text is null or favorite_type = $7::text)
  and (
      $8::text is null
      or position(
          lower($8::text) in lower(
              title || ' ' || content_preview || ' ' || source_display_name
              || ' ' || conversation_id
          )
      ) > 0
  )
order by favorited_at desc, favorite_id desc
limit $9
"#;

const CREATE_FAVORITE_SQL: &str = r#"
with target as (
    select message_seq
    from im_conversation_messages
    where tenant_id = $1 and organization_id = $2 and conversation_id = $7
      and message_id = $8 and deleted_at is null
)
insert into im_message_favorites (
    tenant_id, organization_id, principal_kind, principal_id, favorite_id,
    favorite_type, conversation_id, message_id, message_seq, title, content_preview,
    source_display_name, favorited_at, created_at, updated_at
)
select
    $1, $2, $3, $4, $5, $6, $7, $8, target.message_seq, $9, $10, $11, $12, $12, $12
from target
on conflict (tenant_id, organization_id, principal_kind, principal_id, favorite_id)
do update set
    favorite_type = excluded.favorite_type,
    conversation_id = excluded.conversation_id,
    message_id = excluded.message_id,
    message_seq = excluded.message_seq,
    title = excluded.title,
    content_preview = excluded.content_preview,
    source_display_name = excluded.source_display_name,
    favorited_at = excluded.favorited_at,
    updated_at = excluded.updated_at
returning message_seq
"#;

const DELETE_FAVORITE_SQL: &str = r#"
delete from im_message_favorites
where tenant_id = $1 and organization_id = $2
  and principal_kind = $3 and principal_id = $4 and favorite_id = $5
"#;

/// PostgreSQL Message favorite store.
#[derive(Clone)]
pub struct PostgresMessageFavoriteStore {
    pool: PostgresJournalPool,
}

impl PostgresMessageFavoriteStore {
    pub fn from_pool(pool: PostgresJournalPool) -> Self {
        Self { pool }
    }
}

impl MessageFavoriteStore for PostgresMessageFavoriteStore {
    fn list_favorites(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        cursor: Option<&MessageFavoritePageCursor>,
        limit: usize,
        favorite_type: Option<&str>,
        search: Option<&str>,
    ) -> Result<MessageFavoritePage, ContractError> {
        let limit = limit.clamp(1, 200);
        let fetch_limit = limit.saturating_add(1);
        let cursor_at = cursor
            .map(|cursor| postgres_timestamptz(cursor.favorited_at.as_str(), "favorite cursor"))
            .transpose()?;
        let cursor_id = cursor.map(|cursor| cursor.favorite_id.clone());
        let favorite_type = favorite_type
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_owned);
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
            let mut client = postgres_pool_client(&pool, "list_message_favorites")?;
            let rows = client
                .query(
                    LIST_FAVORITES_SQL,
                    &[
                        &tenant_id,
                        &organization_id,
                        &principal_kind,
                        &principal_id,
                        &cursor_at,
                        &cursor_id,
                        &favorite_type,
                        &search,
                        &(fetch_limit as i64),
                    ],
                )
                .map_err(|error| postgres_unavailable_db("list message favorites", error))?;
            let mut items = Vec::with_capacity(rows.len());
            let mut next_cursor = None;
            for row in rows.iter().take(limit) {
                let record = favorite_record_from_row(
                    row,
                    &tenant_id,
                    &organization_id,
                    &principal_kind,
                    &principal_id,
                )?;
                next_cursor = Some(MessageFavoritePageCursor {
                    favorited_at: record.favorited_at.clone(),
                    favorite_id: record.favorite_id.clone(),
                });
                items.push(record);
            }
            let has_more = rows.len() > limit;
            Ok(MessageFavoritePage {
                items,
                next_cursor: next_cursor.filter(|_| has_more),
                has_more,
            })
        })
    }

    fn create_favorite(
        &self,
        record: MessageFavoriteRecord,
    ) -> Result<Option<MessageFavoriteRecord>, ContractError> {
        let message_id = record.message_id.parse::<i64>().map_err(|_| {
            ContractError::Invalid("message favorite message id must be a signed int64".into())
        })?;
        let favorited_at = postgres_timestamptz(
            record.favorited_at.as_str(),
            "message favorite favorited_at",
        )?;
        let pool = self.pool.clone();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "create_message_favorite")?;
            let row = client
                .query_opt(
                    CREATE_FAVORITE_SQL,
                    &[
                        &record.tenant_id,
                        &record.organization_id,
                        &record.principal_kind,
                        &record.principal_id,
                        &record.favorite_id,
                        &record.favorite_type,
                        &record.conversation_id,
                        &message_id,
                        &record.title,
                        &record.content_preview,
                        &record.source_display_name,
                        &favorited_at,
                    ],
                )
                .map_err(|error| postgres_unavailable_db("create message favorite", error))?;
            let Some(row) = row else {
                return Ok(None);
            };
            let message_seq: i64 =
                postgres_row_get(&row, 0, "create message favorite", "message_seq")?;
            Ok(Some(MessageFavoriteRecord {
                message_seq: u64::try_from(message_seq).map_err(|_| {
                    ContractError::Unavailable(
                        "postgres message favorite returned a negative message_seq".into(),
                    )
                })?,
                ..record
            }))
        })
    }

    fn delete_favorite(
        &self,
        tenant_id: &str,
        organization_id: &str,
        principal_kind: &str,
        principal_id: &str,
        favorite_id: &str,
    ) -> Result<bool, ContractError> {
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let principal_kind = principal_kind.to_owned();
        let principal_id = principal_id.to_owned();
        let favorite_id = favorite_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "delete_message_favorite")?;
            let affected = client
                .execute(
                    DELETE_FAVORITE_SQL,
                    &[
                        &tenant_id,
                        &organization_id,
                        &principal_kind,
                        &principal_id,
                        &favorite_id,
                    ],
                )
                .map_err(|error| postgres_unavailable_db("delete message favorite", error))?;
            Ok(affected == 1)
        })
    }
}

fn favorite_record_from_row(
    row: &postgres::Row,
    tenant_id: &str,
    organization_id: &str,
    principal_kind: &str,
    principal_id: &str,
) -> Result<MessageFavoriteRecord, ContractError> {
    let message_id: i64 = postgres_row_get(row, 3, "message favorites", "message_id")?;
    let message_seq: i64 = postgres_row_get(row, 4, "message favorites", "message_seq")?;
    let favorited_at: DateTime<Utc> =
        postgres_row_get(row, 8, "message favorites", "favorited_at")?;
    Ok(MessageFavoriteRecord {
        tenant_id: tenant_id.to_owned(),
        organization_id: organization_id.to_owned(),
        principal_kind: principal_kind.to_owned(),
        principal_id: principal_id.to_owned(),
        favorite_id: postgres_row_get(row, 0, "message favorites", "favorite_id")?,
        favorite_type: postgres_row_get(row, 1, "message favorites", "favorite_type")?,
        conversation_id: postgres_row_get(row, 2, "message favorites", "conversation_id")?,
        message_id: message_id.to_string(),
        message_seq: u64::try_from(message_seq).map_err(|_| {
            ContractError::Unavailable(
                "postgres message favorite returned a negative message_seq".into(),
            )
        })?,
        title: postgres_row_get(row, 5, "message favorites", "title")?,
        content_preview: postgres_row_get(row, 6, "message favorites", "content_preview")?,
        source_display_name: postgres_row_get(row, 7, "message favorites", "source_display_name")?,
        favorited_at: favorited_at.to_rfc3339_opts(SecondsFormat::Millis, true),
    })
}

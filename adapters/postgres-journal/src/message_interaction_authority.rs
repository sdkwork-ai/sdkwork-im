//! PostgreSQL read authority for message reactions and pins.

use std::collections::HashMap;

use chrono::{DateTime, Utc};
use im_platform_contracts::{
    ContractError, MessageInteractionReadStore, StoredMessageInteraction, StoredMessagePin,
    StoredMessageReaction, StoredPinnedMessage,
};

use crate::{
    PostgresJournalPool, postgres_pool_client, postgres_unavailable, run_postgres_io,
};

const READ_MESSAGE_SEQS_SQL: &str = r#"
select message_id, message_seq
from im_conversation_messages
where tenant_id = $1 and organization_id = $2 and conversation_id = $3
  and message_id = any($4)
"#;

const READ_REACTIONS_SQL: &str = r#"
select message_id, actor_principal_kind, actor_principal_id, reaction_type, created_at
from im_message_reactions
where tenant_id = $1 and organization_id = $2 and conversation_id = $3
  and message_id = any($4)
order by message_id, created_at
"#;

const READ_PINS_SQL: &str = r#"
select message_id, pinned_by_principal_kind, pinned_by_principal_id, pinned_at
from im_message_pins
where tenant_id = $1 and organization_id = $2 and conversation_id = $3
  and message_id = any($4)
"#;

const LIST_PINNED_SQL: &str = r#"
select p.message_id, m.message_seq,
       p.pinned_by_principal_kind, p.pinned_by_principal_id, p.pinned_at
from im_message_pins p
join im_conversation_messages m
  on m.tenant_id = p.tenant_id
 and m.organization_id = p.organization_id
 and m.conversation_id = p.conversation_id
 and m.message_id = p.message_id
where p.tenant_id = $1 and p.organization_id = $2 and p.conversation_id = $3
order by p.pinned_at desc, m.message_seq desc, p.message_id desc
limit $4
"#;

/// Read-only adapter over the canonical reaction/pin tables.
#[derive(Clone)]
pub struct PostgresMessageInteractionReadStore {
    pool: PostgresJournalPool,
}

impl PostgresMessageInteractionReadStore {
    pub fn from_pool(pool: PostgresJournalPool) -> Self {
        Self { pool }
    }
}

fn timestamptz_string(value: &DateTime<Utc>) -> String {
    value.to_rfc3339()
}

impl MessageInteractionReadStore for PostgresMessageInteractionReadStore {
    fn read_interactions(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        message_ids: &[String],
    ) -> Result<Vec<StoredMessageInteraction>, ContractError> {
        if message_ids.is_empty() {
            return Ok(Vec::new());
        }
        let ids = message_ids
            .iter()
            .map(|value| {
                value.parse::<i64>().map_err(|_| {
                    ContractError::Invalid(format!(
                        "message interaction read requires canonical int64 ids, got {value:?}"
                    ))
                })
            })
            .collect::<Result<Vec<_>, _>>()?;
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let conversation_id = conversation_id.to_owned();
        run_postgres_io(move || {
            let mut client =
                postgres_pool_client(&pool, "read_message_interactions")?;
            let seq_rows = client
                .query(
                    READ_MESSAGE_SEQS_SQL,
                    &[&tenant_id, &organization_id, &conversation_id, &ids],
                )
                .map_err(|error| postgres_unavailable("read_message_seqs", error))?;
            let mut seqs = HashMap::new();
            for row in seq_rows {
                let message_id: i64 = row.get(0);
                let message_seq: i64 = row.get(1);
                seqs.insert(message_id, u64::try_from(message_seq).unwrap_or(0));
            }

            let reaction_rows = client
                .query(
                    READ_REACTIONS_SQL,
                    &[&tenant_id, &organization_id, &conversation_id, &ids],
                )
                .map_err(|error| postgres_unavailable("read_message_reactions", error))?;
            let mut reactions: HashMap<i64, Vec<StoredMessageReaction>> = HashMap::new();
            for row in reaction_rows {
                let message_id: i64 = row.get(0);
                let created_at: DateTime<Utc> = row.get(4);
                reactions.entry(message_id).or_default().push(StoredMessageReaction {
                    actor_principal_kind: row.get(1),
                    actor_principal_id: row.get(2),
                    reaction_key: row.get(3),
                    reacted_at: timestamptz_string(&created_at),
                });
            }

            let pin_rows = client
                .query(
                    READ_PINS_SQL,
                    &[&tenant_id, &organization_id, &conversation_id, &ids],
                )
                .map_err(|error| postgres_unavailable("read_message_pins", error))?;
            let mut pins = HashMap::new();
            for row in pin_rows {
                let message_id: i64 = row.get(0);
                let pinned_at: DateTime<Utc> = row.get(3);
                pins.insert(
                    message_id,
                    StoredMessagePin {
                        pinned_by_principal_kind: row.get(1),
                        pinned_by_principal_id: row.get(2),
                        pinned_at: timestamptz_string(&pinned_at),
                    },
                );
            }

            let mut interactions = Vec::with_capacity(ids.len());
            for id in ids {
                let Some(message_seq) = seqs.get(&id).copied() else {
                    continue;
                };
                interactions.push(StoredMessageInteraction {
                    message_id: id.to_string(),
                    message_seq,
                    reactions: reactions.remove(&id).unwrap_or_default(),
                    pin: pins.remove(&id),
                });
            }
            Ok(interactions)
        })
    }

    fn list_pinned_messages(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        limit: usize,
    ) -> Result<Vec<StoredPinnedMessage>, ContractError> {
        let limit = i64::try_from(limit.clamp(1, 200)).unwrap_or(200);
        let pool = self.pool.clone();
        let tenant_id = tenant_id.to_owned();
        let organization_id = organization_id.to_owned();
        let conversation_id = conversation_id.to_owned();
        run_postgres_io(move || {
            let mut client = postgres_pool_client(&pool, "list_pinned_messages")?;
            let rows = client
                .query(
                    LIST_PINNED_SQL,
                    &[&tenant_id, &organization_id, &conversation_id, &limit],
                )
                .map_err(|error| postgres_unavailable("list_pinned_messages", error))?;
            Ok(rows
                .into_iter()
                .map(|row| {
                    let message_id: i64 = row.get(0);
                    let message_seq: i64 = row.get(1);
                    let pinned_at: DateTime<Utc> = row.get(4);
                    StoredPinnedMessage {
                        message_id: message_id.to_string(),
                        message_seq: u64::try_from(message_seq).unwrap_or(0),
                        pin: StoredMessagePin {
                            pinned_by_principal_kind: row.get(2),
                            pinned_by_principal_id: row.get(3),
                            pinned_at: timestamptz_string(&pinned_at),
                        },
                    }
                })
                .collect())
        })
    }
}

//! Atomic PostgreSQL authority for the Social journal, normalized state, and
//! outbox evidence writes.

use std::sync::Arc;

use im_adapters_postgres_journal::{
    PostgresCommitJournal, enqueue_outbox_event_on_transaction,
};
use im_platform_contracts::{CommitEnvelope, ContractError, IdGenerator};

use crate::normalized_store::SocialPostgresNormalizedStore;

/// In-transaction social realtime outbox wiring. When present, the atomic
/// write authority enqueues one durable outbox row per commit inside the same
/// PostgreSQL transaction that appends the journal and writes the normalized
/// state, so delivery evidence can never be lost to a crash between the
/// authority commit and a separate outbox insert.
#[derive(Clone, Copy)]
pub(crate) struct SocialOutboxInTransaction<'a> {
    pub id_generator: &'a dyn IdGenerator,
}

pub(crate) trait SocialAtomicWriteAuthority: Send + Sync {
    fn append_and_write(
        &self,
        commits: Vec<CommitEnvelope>,
        outbox: Option<&SocialOutboxInTransaction<'_>>,
    ) -> Result<Vec<CommitEnvelope>, ContractError>;
}

pub(crate) struct SocialPostgresAtomicWriteAuthority {
    journal: PostgresCommitJournal,
    normalized_store: Arc<SocialPostgresNormalizedStore>,
}

impl SocialPostgresAtomicWriteAuthority {
    pub(crate) fn new(
        journal: PostgresCommitJournal,
        normalized_store: Arc<SocialPostgresNormalizedStore>,
    ) -> Self {
        Self {
            journal,
            normalized_store,
        }
    }
}

impl SocialAtomicWriteAuthority for SocialPostgresAtomicWriteAuthority {
    fn append_and_write(
        &self,
        commits: Vec<CommitEnvelope>,
        outbox: Option<&SocialOutboxInTransaction<'_>>,
    ) -> Result<Vec<CommitEnvelope>, ContractError> {
        if commits.is_empty() {
            return Ok(Vec::new());
        }

        let mut inserted_commits = Vec::new();
        self.journal
            .append_batch_with_allocated_sequences_in_transaction(
                commits,
                |txn, sequenced_commits| {
                    self.normalized_store
                        .write_commits_on_transaction(txn, sequenced_commits)?;
                    if let Some(outbox) = outbox {
                        for commit in sequenced_commits {
                            let Some(record) =
                                crate::social_realtime::build_social_realtime_outbox_record(
                                    commit,
                                    outbox.id_generator,
                                )
                                .map_err(ContractError::Invalid)?
                            else {
                                continue;
                            };
                            // Idempotent (`on conflict do nothing`); an
                            // enqueue failure aborts the whole transaction so
                            // journal, state, and delivery evidence commit or
                            // roll back as one unit.
                            enqueue_outbox_event_on_transaction(txn, &record)?;
                        }
                    }
                    inserted_commits.extend_from_slice(sequenced_commits);
                    Ok(())
                },
            )?;
        Ok(inserted_commits)
    }
}

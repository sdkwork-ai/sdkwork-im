//! Durable Conversation summary and profile reads/writes.
//!
//! These methods are only used when the corresponding authority/store is
//! configured (production PostgreSQL hosts). In-memory and test hosts keep the
//! projection-based path in [`super::conversation_personalization`].

use im_platform_contracts::{ContractError, ConversationProfileRecord, ConversationSummaryRecord};
use im_time::utc_now_rfc3339_millis;

use super::ConversationStateService;
use super::inbox::agent_handoff_view_from_authority_record;
use super::model::{
    ConversationProfileView, ConversationSummaryView, SummarySenderView,
    UpdateConversationProfileRequest,
};

impl ConversationStateService {
    /// Durable Conversation summary. Returns `Ok(None)` when no summary
    /// authority is configured, so the caller keeps the projection path.
    pub fn conversation_summary_from_authority(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<Option<ConversationSummaryView>, ContractError> {
        let Some(authority) = self.conversation_summary_authority() else {
            return Ok(None);
        };
        Ok(authority
            .load_conversation_summary(tenant_id, organization_id, conversation_id)?
            .map(conversation_summary_view_from_record))
    }

    /// Durable Conversation profile. Returns `Ok(None)` when no profile store
    /// is configured.
    pub fn conversation_profile_from_authority(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> Result<Option<ConversationProfileView>, ContractError> {
        let Some(store) = self.conversation_profile_store() else {
            return Ok(None);
        };
        Ok(store
            .load_profile(tenant_id, organization_id, conversation_id)?
            .map(conversation_profile_view_from_record))
    }

    /// Durable profile mutation: read-modify-write against the authoritative
    /// row, then return the saved view. Returns `Ok(None)` when no profile
    /// store is configured.
    pub fn update_conversation_profile_in_authority(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
        update: UpdateConversationProfileRequest,
    ) -> Result<Option<ConversationProfileView>, ContractError> {
        let Some(store) = self.conversation_profile_store() else {
            return Ok(None);
        };
        let mut record = store
            .load_profile(tenant_id, organization_id, conversation_id)?
            .unwrap_or_else(|| ConversationProfileRecord {
                tenant_id: tenant_id.to_owned(),
                organization_id: organization_id.to_owned(),
                conversation_id: conversation_id.to_owned(),
                display_name: String::new(),
                avatar_url: String::new(),
                notice: String::new(),
                updated_at: String::new(),
                updated_by_principal_kind: None,
                updated_by_principal_id: None,
            });
        if let Some(display_name) = update.display_name {
            record.display_name = display_name;
        }
        if let Some(avatar_url) = update.avatar_url {
            record.avatar_url = avatar_url;
        }
        if let Some(notice) = update.notice {
            record.notice = notice;
        }
        record.updated_at = utc_now_rfc3339_millis();
        record.updated_by_principal_kind = Some(principal_kind.to_owned());
        record.updated_by_principal_id = Some(principal_id.to_owned());
        store.save_profile(record.clone())?;
        Ok(Some(conversation_profile_view_from_record(record)))
    }

    /// Authoritative membership role lookup for profile mutation checks.
    pub fn conversation_member_role_from_authority(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Option<Result<Option<String>, ContractError>> {
        self.conversation_member_preferences_store().map(|store| {
            store.active_member_role(
                tenant_id,
                organization_id,
                conversation_id,
                principal_kind,
                principal_id,
            )
        })
    }
}

/// Maps a durable summary row to the public Conversation summary view.
#[must_use]
pub fn conversation_summary_view_from_record(
    record: ConversationSummaryRecord,
) -> ConversationSummaryView {
    let last_sender = match (&record.last_sender_id, &record.last_sender_kind) {
        (Some(id), Some(kind)) => Some(SummarySenderView {
            id: id.clone(),
            kind: kind.clone(),
        }),
        _ => None,
    };
    ConversationSummaryView {
        tenant_id: record.tenant_id,
        conversation_id: record.conversation_id,
        message_count: record.message_count,
        last_message_id: record.last_message_id,
        last_message_seq: record.last_message_seq,
        last_sender_id: record.last_sender_id,
        last_sender_kind: record.last_sender_kind,
        last_sender,
        last_summary: record.last_summary,
        last_message_at: record.last_message_at,
        agent_handoff: record
            .handoff
            .as_ref()
            .map(agent_handoff_view_from_authority_record),
    }
}

/// Maps a durable profile row to the public Conversation profile view.
#[must_use]
pub fn conversation_profile_view_from_record(
    record: ConversationProfileRecord,
) -> ConversationProfileView {
    ConversationProfileView {
        tenant_id: record.tenant_id,
        conversation_id: record.conversation_id,
        display_name: record.display_name,
        avatar_url: record.avatar_url,
        notice: record.notice,
        updated_at: record.updated_at,
        updated_by_principal_kind: record.updated_by_principal_kind,
        updated_by_principal_id: record.updated_by_principal_id,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn summary_record_maps_sender_and_handoff() {
        let view = conversation_summary_view_from_record(ConversationSummaryRecord {
            tenant_id: "100001".into(),
            organization_id: "0".into(),
            conversation_id: "c_1".into(),
            message_count: 9,
            last_message_id: Some("99".into()),
            last_message_seq: 9,
            last_sender_kind: Some("user".into()),
            last_sender_id: Some("2".into()),
            last_summary: Some("hello".into()),
            last_message_at: Some("2026-10-20T10:00:00.000Z".into()),
            handoff: None,
        });
        assert_eq!(view.message_count, 9);
        assert_eq!(
            view.last_sender,
            Some(SummarySenderView {
                id: "2".into(),
                kind: "user".into()
            })
        );
        assert!(view.agent_handoff.is_none());
    }

    #[test]
    fn profile_record_maps_all_fields() {
        let view = conversation_profile_view_from_record(ConversationProfileRecord {
            tenant_id: "100001".into(),
            organization_id: "0".into(),
            conversation_id: "c_1".into(),
            display_name: "Team A".into(),
            avatar_url: "https://cdn/a.png".into(),
            notice: "notice".into(),
            updated_at: "2026-10-20T10:00:00.000Z".into(),
            updated_by_principal_kind: Some("user".into()),
            updated_by_principal_id: Some("1".into()),
        });
        assert_eq!(view.display_name, "Team A");
        assert_eq!(view.avatar_url, "https://cdn/a.png");
        assert_eq!(view.notice, "notice");
    }
}

#[cfg(test)]
mod durability_tests {
    use std::sync::{Arc, Mutex};

    use im_platform_contracts::{
        ContractError, ConversationProfileRecord, ConversationProfileStore,
        ConversationSummaryAuthority, ConversationSummaryRecord,
    };

    use super::{ConversationStateService, UpdateConversationProfileRequest};

    struct FakeSummaryAuthority {
        summary: Mutex<Option<ConversationSummaryRecord>>,
    }

    impl ConversationSummaryAuthority for FakeSummaryAuthority {
        fn load_conversation_summary(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            _conversation_id: &str,
        ) -> Result<Option<ConversationSummaryRecord>, ContractError> {
            Ok(self.summary.lock().expect("summary lock").clone())
        }
    }

    #[derive(Default)]
    struct FakeProfileStore {
        profile: Mutex<Option<ConversationProfileRecord>>,
    }

    impl ConversationProfileStore for FakeProfileStore {
        fn load_profile(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            _conversation_id: &str,
        ) -> Result<Option<ConversationProfileRecord>, ContractError> {
            Ok(self.profile.lock().expect("profile lock").clone())
        }

        fn save_profile(&self, record: ConversationProfileRecord) -> Result<(), ContractError> {
            *self.profile.lock().expect("profile lock") = Some(record);
            Ok(())
        }
    }

    #[test]
    fn summary_is_served_from_the_durable_authority() {
        let service = ConversationStateService::default();
        service.configure_conversation_summary_authority(Arc::new(FakeSummaryAuthority {
            summary: Mutex::new(Some(ConversationSummaryRecord {
                tenant_id: "100001".into(),
                organization_id: "0".into(),
                conversation_id: "c_durable".into(),
                message_count: 5,
                last_message_id: Some("55".into()),
                last_message_seq: 5,
                last_sender_kind: Some("user".into()),
                last_sender_id: Some("2".into()),
                last_summary: Some("latest".into()),
                last_message_at: Some("2026-10-20T10:00:00.000Z".into()),
                handoff: None,
            })),
        }));

        let summary = service
            .conversation_summary_from_authority("100001", "0", "c_durable")
            .expect("durable summary")
            .expect("summary row");
        assert_eq!(summary.message_count, 5);
        assert_eq!(summary.last_summary.as_deref(), Some("latest"));
        assert_eq!(
            summary
                .last_sender
                .as_ref()
                .map(|sender| sender.id.as_str()),
            Some("2")
        );
    }

    #[test]
    fn profile_update_persists_and_survives_a_new_service_instance() {
        let store = Arc::new(FakeProfileStore::default());
        let service = ConversationStateService::default();
        service.configure_conversation_profile_store(store.clone());

        let updated = service
            .update_conversation_profile_in_authority(
                "100001",
                "0",
                "c_profile",
                "user",
                "1",
                UpdateConversationProfileRequest {
                    display_name: Some("Durable Team".into()),
                    avatar_url: Some("https://cdn.example.test/team.png".into()),
                    notice: Some("notice".into()),
                },
            )
            .expect("durable profile update")
            .expect("profile view");
        assert_eq!(updated.display_name, "Durable Team");

        let restarted = ConversationStateService::default();
        restarted.configure_conversation_profile_store(store);
        let loaded = restarted
            .conversation_profile_from_authority("100001", "0", "c_profile")
            .expect("durable profile read")
            .expect("profile row");
        assert_eq!(loaded.display_name, "Durable Team");
        assert_eq!(loaded.avatar_url, "https://cdn.example.test/team.png");
        assert_eq!(loaded.updated_by_principal_id.as_deref(), Some("1"));
    }
}

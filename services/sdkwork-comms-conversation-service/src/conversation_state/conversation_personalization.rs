use im_platform_contracts::{ContractError, ConversationMemberPreferencesRecord};
use im_time::utc_now_rfc3339_millis;

use super::model::{
    ConversationPreferencesView, ConversationProfileView, UpdateConversationPreferencesRequest,
    UpdateConversationProfileRequest,
};
use super::{
    ConversationStateService, event_apply::ConversationStateError, lock_conversation_state_mutex,
    scope::scope_key,
};

pub(super) fn conversation_preferences_key(
    tenant_id: &str,
    organization_id: &str,
    conversation_id: &str,
    principal_kind: &str,
    principal_id: &str,
) -> String {
    format!(
        "{}:{}:{}",
        scope_key(tenant_id, organization_id, conversation_id),
        principal_kind,
        principal_id
    )
}

fn default_conversation_profile(tenant_id: &str, conversation_id: &str) -> ConversationProfileView {
    ConversationProfileView {
        tenant_id: tenant_id.into(),
        conversation_id: conversation_id.into(),
        display_name: String::new(),
        avatar_url: String::new(),
        notice: String::new(),
        updated_at: utc_now_rfc3339_millis(),
        updated_by_principal_kind: None,
        updated_by_principal_id: None,
    }
}

fn default_conversation_preferences(
    tenant_id: &str,
    conversation_id: &str,
    principal_kind: &str,
    principal_id: &str,
) -> ConversationPreferencesView {
    ConversationPreferencesView {
        tenant_id: tenant_id.into(),
        conversation_id: conversation_id.into(),
        principal_kind: principal_kind.into(),
        principal_id: principal_id.into(),
        is_pinned: false,
        is_muted: false,
        is_marked_unread: false,
        is_hidden: false,
        updated_at: utc_now_rfc3339_millis(),
    }
}

impl ConversationStateService {
    pub fn conversation_profile(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
    ) -> ConversationProfileView {
        let key = scope_key(tenant_id, organization_id, conversation_id);
        let profile = if let Some(profile) =
            lock_conversation_state_mutex(&self.conversation_profiles, "conversation profile store")
                .get(key.as_str())
                .cloned()
        {
            profile
        } else {
            default_conversation_profile(tenant_id, conversation_id)
        };

        self.apply_catalog_title_profile_fallback(key.as_str(), profile)
    }

    fn apply_catalog_title_profile_fallback(
        &self,
        scope: &str,
        mut profile: ConversationProfileView,
    ) -> ConversationProfileView {
        if !profile.display_name.trim().is_empty() {
            return profile;
        }
        let Some((display_name, created_at)) = self.catalog_title_for_profile_fallback(scope)
        else {
            return profile;
        };

        profile.display_name = display_name;
        if profile.updated_at.trim().is_empty() {
            profile.updated_at = created_at;
        }
        lock_conversation_state_mutex(&self.conversation_profiles, "conversation profile store")
            .insert(scope.to_owned(), profile.clone());
        profile
    }

    fn catalog_title_for_profile_fallback(&self, scope: &str) -> Option<(String, String)> {
        let catalog = lock_conversation_state_mutex(&self.conversations, "conversation store")
            .get(scope)
            .cloned()?;
        let title = catalog
            .title
            .as_deref()
            .map(str::trim)
            .filter(|value| !value.is_empty())?
            .to_owned();
        Some((title, catalog.created_at))
    }

    pub fn update_conversation_profile(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
        update: UpdateConversationProfileRequest,
    ) -> ConversationProfileView {
        let key = scope_key(tenant_id, organization_id, conversation_id);
        let mut profiles = lock_conversation_state_mutex(
            &self.conversation_profiles,
            "conversation profile store",
        );
        let mut profile = profiles
            .get(key.as_str())
            .cloned()
            .unwrap_or_else(|| default_conversation_profile(tenant_id, conversation_id));

        if let Some(display_name) = update.display_name {
            profile.display_name = display_name;
        }
        if let Some(avatar_url) = update.avatar_url {
            profile.avatar_url = avatar_url;
        }
        if let Some(notice) = update.notice {
            profile.notice = notice;
        }
        profile.updated_at = utc_now_rfc3339_millis();
        profile.updated_by_principal_kind = Some(principal_kind.into());
        profile.updated_by_principal_id = Some(principal_id.into());

        profiles.insert(key, profile.clone());
        profile
    }

    pub fn update_conversation_profile_checked(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
        update: UpdateConversationProfileRequest,
    ) -> Result<ConversationProfileView, ConversationStateError> {
        let profile = self.update_conversation_profile(
            tenant_id,
            organization_id,
            conversation_id,
            principal_kind,
            principal_id,
            update,
        );
        Ok(profile)
    }

    /// Process-local preference view used by in-memory entry building and
    /// tests. Durability-aware callers use
    /// [`Self::conversation_preferences_from_authority`].
    pub fn conversation_preferences(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> ConversationPreferencesView {
        let key = conversation_preferences_key(
            tenant_id,
            organization_id,
            conversation_id,
            principal_kind,
            principal_id,
        );
        lock_conversation_state_mutex(
            &self.conversation_preferences,
            "conversation preferences store",
        )
        .get(key.as_str())
        .cloned()
        .unwrap_or_else(|| {
            default_conversation_preferences(
                tenant_id,
                conversation_id,
                principal_kind,
                principal_id,
            )
        })
    }

    /// Durable preference read with an in-memory hot cache.
    ///
    /// A cache miss loads the member's row from the authoritative store; a
    /// missing row yields the all-default preference view. Store failures are
    /// surfaced instead of silently resetting a member's preferences.
    pub fn conversation_preferences_from_authority(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Result<ConversationPreferencesView, ContractError> {
        let key = conversation_preferences_key(
            tenant_id,
            organization_id,
            conversation_id,
            principal_kind,
            principal_id,
        );
        if let Some(view) = lock_conversation_state_mutex(
            &self.conversation_preferences,
            "conversation preferences store",
        )
        .get(key.as_str())
        .cloned()
        {
            return Ok(view);
        }
        let Some(store) = self.conversation_member_preferences_store() else {
            return Ok(default_conversation_preferences(
                tenant_id,
                conversation_id,
                principal_kind,
                principal_id,
            ));
        };
        let view = match store.load_preferences(
            tenant_id,
            organization_id,
            conversation_id,
            principal_kind,
            principal_id,
        )? {
            Some(record) => preferences_view_from_record(record),
            None => default_conversation_preferences(
                tenant_id,
                conversation_id,
                principal_kind,
                principal_id,
            ),
        };
        lock_conversation_state_mutex(
            &self.conversation_preferences,
            "conversation preferences store",
        )
        .insert(key, view.clone());
        Ok(view)
    }

    pub fn update_conversation_preferences(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
        update: UpdateConversationPreferencesRequest,
    ) -> Result<ConversationPreferencesView, ContractError> {
        let key = conversation_preferences_key(
            tenant_id,
            organization_id,
            conversation_id,
            principal_kind,
            principal_id,
        );
        let mut view = {
            let preferences = lock_conversation_state_mutex(
                &self.conversation_preferences,
                "conversation preferences store",
            );
            preferences.get(key.as_str()).cloned().unwrap_or_else(|| {
                default_conversation_preferences(
                    tenant_id,
                    conversation_id,
                    principal_kind,
                    principal_id,
                )
            })
        };

        if let Some(is_pinned) = update.is_pinned {
            view.is_pinned = is_pinned;
        }
        if let Some(is_muted) = update.is_muted {
            view.is_muted = is_muted;
        }
        if let Some(is_marked_unread) = update.is_marked_unread {
            view.is_marked_unread = is_marked_unread;
        }
        if let Some(is_hidden) = update.is_hidden {
            view.is_hidden = is_hidden;
        }
        view.updated_at = utc_now_rfc3339_millis();

        // Persist before publishing the cache entry: a failed durable write
        // must not leave the process claiming a preference it never stored.
        if let Some(store) = self.conversation_member_preferences_store() {
            store.save_preferences(ConversationMemberPreferencesRecord {
                tenant_id: tenant_id.to_owned(),
                organization_id: organization_id.to_owned(),
                conversation_id: conversation_id.to_owned(),
                principal_kind: principal_kind.to_owned(),
                principal_id: principal_id.to_owned(),
                is_pinned: view.is_pinned,
                is_muted: view.is_muted,
                is_marked_unread: view.is_marked_unread,
                is_hidden: view.is_hidden,
                updated_at: view.updated_at.clone(),
            })?;
        }
        lock_conversation_state_mutex(
            &self.conversation_preferences,
            "conversation preferences store",
        )
        .insert(key, view.clone());
        Ok(view)
    }

    /// Authoritative active-membership check for member-scoped endpoints.
    pub fn conversation_member_is_active_in_authority(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        principal_kind: &str,
        principal_id: &str,
    ) -> Option<Result<bool, ContractError>> {
        self.conversation_member_preferences_store().map(|store| {
            store.is_active_member(
                tenant_id,
                organization_id,
                conversation_id,
                principal_kind,
                principal_id,
            )
        })
    }
}

fn preferences_view_from_record(
    record: ConversationMemberPreferencesRecord,
) -> ConversationPreferencesView {
    ConversationPreferencesView {
        tenant_id: record.tenant_id,
        conversation_id: record.conversation_id,
        principal_kind: record.principal_kind,
        principal_id: record.principal_id,
        is_pinned: record.is_pinned,
        is_muted: record.is_muted,
        is_marked_unread: record.is_marked_unread,
        is_hidden: record.is_hidden,
        updated_at: record.updated_at,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn conversation_profile_and_preferences_round_trip_in_memory_store() {
        let service = ConversationStateService::default();
        let profile = service.update_conversation_profile(
            "100001",
            "default",
            "c_agent_e7f6182d320811b42f4484f9",
            "user",
            "1",
            UpdateConversationProfileRequest {
                display_name: Some("SdkWork Assistant".into()),
                avatar_url: Some("https://example.test/assistant.png".into()),
                notice: None,
            },
        );
        assert_eq!(profile.display_name, "SdkWork Assistant");
        assert_eq!(profile.avatar_url, "https://example.test/assistant.png");

        let loaded =
            service.conversation_profile("100001", "default", "c_agent_e7f6182d320811b42f4484f9");
        assert_eq!(loaded.display_name, "SdkWork Assistant");

        let preferences = service
            .update_conversation_preferences(
                "100001",
                "default",
                "c_agent_e7f6182d320811b42f4484f9",
                "user",
                "1",
                UpdateConversationPreferencesRequest {
                    is_pinned: Some(true),
                    is_muted: None,
                    is_marked_unread: None,
                    is_hidden: Some(false),
                },
            )
            .expect("in-memory preference update");
        assert!(preferences.is_pinned);
        assert!(!preferences.is_hidden);
    }
}

#[cfg(test)]
mod durability_tests {
    use std::collections::HashMap;
    use std::sync::{Arc, Mutex};

    use im_platform_contracts::{
        ContractError, ConversationMemberPreferencesRecord, ConversationMemberPreferencesStore,
    };

    use super::{ConversationStateService, UpdateConversationPreferencesRequest};

    fn row_key(conversation_id: &str, principal_id: &str) -> String {
        format!("{conversation_id}:user:{principal_id}")
    }

    #[derive(Default)]
    struct FakePreferencesStore {
        rows: Mutex<HashMap<String, ConversationMemberPreferencesRecord>>,
        fail_save: Mutex<bool>,
    }

    impl ConversationMemberPreferencesStore for FakePreferencesStore {
        fn load_preferences(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            conversation_id: &str,
            _principal_kind: &str,
            principal_id: &str,
        ) -> Result<Option<ConversationMemberPreferencesRecord>, ContractError> {
            Ok(self
                .rows
                .lock()
                .expect("rows lock")
                .get(row_key(conversation_id, principal_id).as_str())
                .cloned())
        }

        fn save_preferences(
            &self,
            record: ConversationMemberPreferencesRecord,
        ) -> Result<(), ContractError> {
            if *self.fail_save.lock().expect("fail lock") {
                return Err(ContractError::Unavailable("preferences store down".into()));
            }
            self.rows.lock().expect("rows lock").insert(
                row_key(
                    record.conversation_id.as_str(),
                    record.principal_id.as_str(),
                ),
                record,
            );
            Ok(())
        }

        fn is_active_member(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            _conversation_id: &str,
            _principal_kind: &str,
            _principal_id: &str,
        ) -> Result<bool, ContractError> {
            Ok(true)
        }

        fn active_member_role(
            &self,
            _tenant_id: &str,
            _organization_id: &str,
            _conversation_id: &str,
            _principal_kind: &str,
            _principal_id: &str,
        ) -> Result<Option<String>, ContractError> {
            Ok(Some("owner".to_owned()))
        }
    }

    #[test]
    fn preferences_survive_a_new_service_instance_after_restart() {
        let store = Arc::new(FakePreferencesStore::default());
        let service = ConversationStateService::default();
        service.configure_conversation_member_preferences_store(store.clone());

        let updated = service
            .update_conversation_preferences(
                "100001",
                "0",
                "c_pref_restart",
                "user",
                "1",
                UpdateConversationPreferencesRequest {
                    is_pinned: Some(true),
                    is_muted: Some(true),
                    is_marked_unread: None,
                    is_hidden: None,
                },
            )
            .expect("durable preference update");
        assert!(updated.is_pinned && updated.is_muted);

        // A fresh process (empty cache) must read the durable row.
        let restarted = ConversationStateService::default();
        restarted.configure_conversation_member_preferences_store(store);
        let loaded = restarted
            .conversation_preferences_from_authority("100001", "0", "c_pref_restart", "user", "1")
            .expect("durable preference read");
        assert!(loaded.is_pinned);
        assert!(loaded.is_muted);
        assert!(!loaded.is_marked_unread);
        assert_eq!(loaded.tenant_id, "100001");
    }

    #[test]
    fn durable_preference_write_failure_does_not_publish_a_cache_entry() {
        let store = Arc::new(FakePreferencesStore::default());
        *store.fail_save.lock().expect("fail lock") = true;
        let service = ConversationStateService::default();
        service.configure_conversation_member_preferences_store(store);

        let error = service
            .update_conversation_preferences(
                "100001",
                "0",
                "c_pref_fail",
                "user",
                "1",
                UpdateConversationPreferencesRequest {
                    is_pinned: Some(true),
                    is_muted: None,
                    is_marked_unread: None,
                    is_hidden: None,
                },
            )
            .expect_err("durable save failure must surface");
        assert!(matches!(error, ContractError::Unavailable(_)));
        let cached = service.conversation_preferences("100001", "0", "c_pref_fail", "user", "1");
        assert!(
            !cached.is_pinned,
            "failed write must not be cached as applied"
        );
    }
}

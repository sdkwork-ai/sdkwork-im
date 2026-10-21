use std::sync::Arc;

use im_adapters_redis_cache::TypingCache;
use im_app_context::AppContext;
use im_domain_core::typing::{
    TYPING_DEFAULT_TTL_SECONDS, TYPING_EVENT_TYPE, TYPING_SCOPE_TYPE, TypingIndicator,
    TypingIndicatorListItem,
};
use im_platform_contracts::{
    RealtimeEventPublisher, RealtimeEventRecipient, RealtimeScopeEventPublishCommand,
};
use im_time::utc_now_rfc3339_millis;

use super::{ConversationRuntime, RuntimeError, organization_id_from_auth_context};

#[derive(Clone, Debug, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignalTypingResult {
    /// Number of connected devices that received the realtime push.
    pub delivered: usize,
}

/// One bounded window of live typing indicators.
///
/// The source is a TTL-bounded ephemeral cache (entries expire within seconds),
/// so the window is small and never grows with Conversation history. Items are
/// ordered by `(user_kind, user_id)` and paged with an opaque keyset cursor.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TypingIndicatorWindow {
    pub conversation_id: String,
    pub items: Vec<TypingIndicatorListItem>,
    pub has_more: bool,
}

/// Orders typing indicators by `(user_kind, user_id)`, applies the opaque
/// keyset cursor, and truncates to one page. The source is a TTL-bounded
/// ephemeral cache, so this is a bounded maintained index, not a full-scope
/// per-request scan.
pub(crate) fn paginate_typing_indicators(
    items: &mut Vec<TypingIndicatorListItem>,
    after: Option<(&str, &str)>,
    limit: usize,
) -> (Vec<TypingIndicatorListItem>, bool) {
    let limit = limit.max(1);
    items.sort_by(|left, right| {
        (left.user_kind.as_str(), left.user_id.as_str())
            .cmp(&(right.user_kind.as_str(), right.user_id.as_str()))
    });
    if let Some((after_kind, after_id)) = after {
        items.retain(|item| {
            (item.user_kind.as_str(), item.user_id.as_str()) > (after_kind, after_id)
        });
    }
    let has_more = items.len() > limit;
    items.truncate(limit);
    (std::mem::take(items), has_more)
}

impl<J> ConversationRuntime<J>
where
    J: sdkwork_im_contract_message::CommitJournal,
{
    pub fn typing_cache(&self) -> Option<&Arc<dyn TypingCache>> {
        self.typing_cache.as_ref()
    }

    pub async fn signal_typing_from_auth_context(
        &self,
        auth: &AppContext,
        conversation_id: &str,
    ) -> Result<SignalTypingResult, RuntimeError> {
        let tenant_id = auth.tenant_id.as_str();
        let organization_id = organization_id_from_auth_context(auth);
        let organization_id = organization_id.as_str();
        let actor_id = auth.actor_id.as_str();
        let actor_kind = auth.actor_kind.as_str();

        self.require_active_member_from_auth_context(auth, conversation_id)?;
        self.ensure_conversation_loaded(tenant_id, organization_id, conversation_id)?;

        if let Some(cache) = self.typing_cache() {
            cache
                .set_typing(
                    tenant_id,
                    organization_id,
                    conversation_id,
                    actor_id,
                    TYPING_DEFAULT_TTL_SECONDS,
                )
                .await?;
        }

        let delivered = self
            .publish_typing_indicator_to_peers(
                tenant_id,
                organization_id,
                conversation_id,
                actor_id,
                actor_kind,
            )
            .unwrap_or(0);

        Ok(SignalTypingResult { delivered })
    }

    pub async fn list_typing_indicators_from_auth_context(
        &self,
        auth: &AppContext,
        conversation_id: &str,
        after: Option<(&str, &str)>,
        limit: usize,
    ) -> Result<TypingIndicatorWindow, RuntimeError> {
        let tenant_id = auth.tenant_id.as_str();
        let organization_id = organization_id_from_auth_context(auth);
        let organization_id = organization_id.as_str();
        let actor_id = auth.actor_id.as_str();
        let actor_kind = auth.actor_kind.as_str();

        self.require_active_member_from_auth_context(auth, conversation_id)?;
        self.ensure_conversation_loaded(tenant_id, organization_id, conversation_id)?;

        let Some(cache) = self.typing_cache() else {
            return Ok(TypingIndicatorWindow {
                conversation_id: conversation_id.to_owned(),
                items: Vec::new(),
                has_more: false,
            });
        };

        let typing_users = cache
            .list_typing_users(tenant_id, organization_id, conversation_id)
            .await?;

        let members = self.list_members(tenant_id, organization_id, conversation_id)?;
        let member_kinds = members
            .iter()
            .map(|member| (member.principal_id.as_str(), member.principal_kind.as_str()))
            .collect::<std::collections::HashMap<_, _>>();

        let mut items: Vec<TypingIndicatorListItem> = typing_users
            .into_iter()
            .filter(|user_id| user_id.as_str() != actor_id)
            .filter_map(|user_id| {
                member_kinds
                    .get(user_id.as_str())
                    .map(|principal_kind| TypingIndicatorListItem {
                        user_id,
                        user_kind: (*principal_kind).to_owned(),
                    })
            })
            .collect();
        let (items, has_more) = paginate_typing_indicators(&mut items, after, limit);

        let _ = actor_kind;
        Ok(TypingIndicatorWindow {
            conversation_id: conversation_id.to_owned(),
            items,
            has_more,
        })
    }

    fn publish_typing_indicator_to_peers(
        &self,
        tenant_id: &str,
        organization_id: &str,
        conversation_id: &str,
        actor_id: &str,
        actor_kind: &str,
    ) -> Result<usize, RuntimeError> {
        let Some(publisher) = self.resolve_realtime_publisher() else {
            return Ok(0);
        };

        let members = self.list_members(tenant_id, organization_id, conversation_id)?;
        let recipients = members
            .iter()
            .filter(|member| {
                !(member.principal_id.as_str() == actor_id
                    && member.principal_kind.as_str() == actor_kind)
            })
            .map(|member| {
                RealtimeEventRecipient::new(
                    member.principal_id.clone(),
                    member.principal_kind.clone(),
                )
            })
            .collect::<Vec<_>>();

        if recipients.is_empty() {
            return Ok(0);
        }

        let indicator = TypingIndicator::new(
            conversation_id,
            actor_id,
            actor_kind,
            utc_now_rfc3339_millis(),
        );
        let payload = indicator.to_payload_json().map_err(|error| {
            RuntimeError::InvalidInput(format!("typing payload encode failed: {error}"))
        })?;

        publisher
            .publish_ephemeral_scope_event_to_recipients(RealtimeScopeEventPublishCommand {
                tenant_id,
                organization_id,
                scope_type: TYPING_SCOPE_TYPE,
                scope_id: conversation_id,
                event_type: TYPING_EVENT_TYPE,
                payload,
                recipients,
            })
            .map_err(RuntimeError::from)
    }
}

#[cfg(test)]
mod pagination_tests {
    use im_domain_core::typing::TypingIndicatorListItem;

    use super::paginate_typing_indicators;

    fn item(kind: &str, id: &str) -> TypingIndicatorListItem {
        TypingIndicatorListItem {
            user_id: id.to_owned(),
            user_kind: kind.to_owned(),
        }
    }

    #[test]
    fn typing_window_orders_filters_and_reports_continuation() {
        let mut items = vec![item("user", "9"), item("user", "2"), item("agent", "5")];
        let (page, has_more) = paginate_typing_indicators(&mut items, None, 2);
        assert_eq!(
            page.iter()
                .map(|entry| (entry.user_kind.as_str(), entry.user_id.as_str()))
                .collect::<Vec<_>>(),
            vec![("agent", "5"), ("user", "2")]
        );
        assert!(has_more);

        let mut remaining = vec![item("user", "9"), item("user", "2"), item("agent", "5")];
        let (next_page, has_more) =
            paginate_typing_indicators(&mut remaining, Some(("user", "2")), 2);
        assert_eq!(next_page.len(), 1);
        assert_eq!(next_page[0].user_id, "9");
        assert!(!has_more);
    }
}

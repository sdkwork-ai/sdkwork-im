//! Lazy system-agent welcome delivery triggered by chat-open reads.
//!
//! The inbox query is the first call a chat client makes when a user opens
//! the conversation list, so invoking the idempotent
//! [`crate::runtime::ConversationRuntime::ensure_user_welcome`] there lets a
//! newly registered user receive the system-agent welcome message
//! server-side, without explicit client wiring. The trigger is best-effort:
//! a welcome failure must never fail the inbox read.

use std::sync::Arc;

use crate::embedded_wiring::resolve_embedded_conversation_runtime;
use crate::runtime::ConversationRuntime;

/// Best-effort welcome delivery hook invoked when a user opens the chat
/// surface (inbox query). Implementations must be idempotent.
pub trait UserWelcomeTrigger: Send + Sync {
    fn ensure_user_welcome(&self, tenant_id: &str, organization_id: &str, user_id: &str);
}

/// Adapter delivering the welcome through the embedded conversation runtime.
pub struct RuntimeWelcomeEnsureTrigger {
    runtime: Arc<ConversationRuntime<crate::runtime::ConversationCommitJournal>>,
}

impl RuntimeWelcomeEnsureTrigger {
    pub fn new(
        runtime: Arc<ConversationRuntime<crate::runtime::ConversationCommitJournal>>,
    ) -> Self {
        Self { runtime }
    }
}

impl UserWelcomeTrigger for RuntimeWelcomeEnsureTrigger {
    fn ensure_user_welcome(&self, tenant_id: &str, organization_id: &str, user_id: &str) {
        match self
            .runtime
            .ensure_user_welcome(tenant_id, organization_id, user_id, None)
        {
            Ok(_) => {}
            Err(error) => tracing::warn!(
                error = %error,
                tenant_id = tenant_id,
                organization_id = organization_id,
                user_id = user_id,
                "inbox welcome ensure failed; continuing without the welcome message"
            ),
        }
    }
}

/// Resolve the welcome trigger for the process: an explicitly configured one
/// wins, otherwise the embedded conversation runtime registered at
/// [`crate::embedded_wiring`] is wrapped lazily. Query-only hosts without an
/// embedded runtime resolve nothing.
pub(crate) fn resolve_process_welcome_trigger(
    configured: Option<&Arc<dyn UserWelcomeTrigger>>,
) -> Option<Arc<dyn UserWelcomeTrigger>> {
    if let Some(trigger) = configured {
        return Some(trigger.clone());
    }
    resolve_embedded_conversation_runtime().map(|runtime| {
        let trigger: Arc<dyn UserWelcomeTrigger> =
            Arc::new(RuntimeWelcomeEnsureTrigger::new(runtime));
        trigger
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::conversation_state::ConversationStateService;
    use crate::runtime::{ConversationCommitJournal, InMemoryJournal};
    use im_app_context::AppContext;
    use im_platform_contracts::InMemoryWelcomeStateStore;
    use std::sync::Mutex;

    #[test]
    fn runtime_trigger_delivers_welcome_and_swallows_store_errors() {
        let runtime = Arc::new(
            ConversationRuntime::new(ConversationCommitJournal::Memory(InMemoryJournal::default()))
                .with_welcome_state_store(Arc::new(InMemoryWelcomeStateStore::default())),
        );
        let trigger = RuntimeWelcomeEnsureTrigger::new(runtime);
        // 第一次投递成功；重复调用幂等跳过；无 panic 即错误被吞掉。
        trigger.ensure_user_welcome("t_1", "0", "u_trigger");
        trigger.ensure_user_welcome("t_1", "0", "u_trigger");
    }

    #[derive(Default, Clone)]
    struct RecordingTrigger {
        calls: Arc<Mutex<Vec<(String, String, String)>>>,
    }

    impl UserWelcomeTrigger for RecordingTrigger {
        fn ensure_user_welcome(&self, tenant_id: &str, organization_id: &str, user_id: &str) {
            self.calls.lock().unwrap().push((
                tenant_id.to_owned(),
                organization_id.to_owned(),
                user_id.to_owned(),
            ));
        }
    }

    fn inbox_auth(actor_kind: &str) -> AppContext {
        AppContext {
            tenant_id: "t_1".into(),
            organization_id: "0".into(),
            user_id: "u_inbox".into(),
            session_id: None,
            app_id: None,
            environment: None,
            deployment_mode: None,
            auth_level: None,
            data_scope: Default::default(),
            permission_scope: Default::default(),
            actor_id: "u_inbox".into(),
            actor_kind: actor_kind.into(),
            device_id: None,
        }
    }

    #[test]
    fn inbox_open_invokes_the_welcome_trigger_for_user_principals() {
        let trigger = RecordingTrigger::default();
        let service = ConversationStateService::default();
        service.configure_welcome_trigger(Arc::new(trigger.clone()));

        let _ = service.inbox_window_from_auth_context_filtered(&inbox_auth("user"), None, None, None, None);
        assert_eq!(
            trigger.calls.lock().unwrap().as_slice(),
            [("t_1".into(), "0".into(), "u_inbox".into())],
            "opening the inbox must ensure the user welcome exactly once"
        );

        // 非 user 主体（服务 actor）不触发欢迎投递。
        let _ = service
            .inbox_window_from_auth_context_filtered(&inbox_auth("system"), None, None, None, None);
        assert_eq!(trigger.calls.lock().unwrap().len(), 1);
    }
}

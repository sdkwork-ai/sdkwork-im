use serde::{Deserialize, Serialize};

use crate::models::{ConversationAgentAssignment};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ConversationAgentAssignments {
    pub generation: String,

    pub source: String,

    pub agents: Vec<ConversationAgentAssignment>,
}

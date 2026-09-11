use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct JournalReplayStatusView {
    pub status: String,

    pub mode: String,

    #[serde(rename = "databaseConfigured")]
    pub database_configured: bool,

    #[serde(rename = "journalReady")]
    pub journal_ready: bool,

    #[serde(rename = "totalCommits")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_commits: Option<String>,

    #[serde(rename = "headCommitOffset")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub head_commit_offset: Option<String>,

    #[serde(rename = "latestOccurredAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_occurred_at: Option<String>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub detail: Option<String>,

    #[serde(rename = "generatedAt")]
    pub generated_at: String,
}

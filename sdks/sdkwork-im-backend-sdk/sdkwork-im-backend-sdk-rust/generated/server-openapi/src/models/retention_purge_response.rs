use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RetentionPurgeResponse {
    #[serde(rename = "generatedAt")]
    pub generated_at: String,

    #[serde(rename = "batchSize")]
    pub batch_size: String,

    #[serde(rename = "commitJournalDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub commit_journal_deleted: Option<String>,

    #[serde(rename = "conversationMessagesDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_messages_deleted: Option<String>,

    #[serde(rename = "messageMediaRefsDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_media_refs_deleted: Option<String>,

    #[serde(rename = "outboxEventsDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub outbox_events_deleted: Option<String>,

    #[serde(rename = "inboxEventsDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inbox_events_deleted: Option<String>,

    #[serde(rename = "realtimeDeviceEventsDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub realtime_device_events_deleted: Option<String>,

    #[serde(rename = "rtcSessionsDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rtc_sessions_deleted: Option<String>,

    #[serde(rename = "invitationsDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invitations_deleted: Option<String>,

    #[serde(rename = "auditRecordsDeleted")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audit_records_deleted: Option<String>,
}

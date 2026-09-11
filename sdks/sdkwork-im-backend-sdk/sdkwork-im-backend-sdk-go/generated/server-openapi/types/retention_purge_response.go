package types


type RetentionPurgeResponse struct {
	GeneratedAt string `json:"generatedAt"`
	BatchSize string `json:"batchSize"`
	CommitJournalDeleted string `json:"commitJournalDeleted"`
	ConversationMessagesDeleted string `json:"conversationMessagesDeleted"`
	MessageMediaRefsDeleted string `json:"messageMediaRefsDeleted"`
	OutboxEventsDeleted string `json:"outboxEventsDeleted"`
	InboxEventsDeleted string `json:"inboxEventsDeleted"`
	RealtimeDeviceEventsDeleted string `json:"realtimeDeviceEventsDeleted"`
	RtcSessionsDeleted string `json:"rtcSessionsDeleted"`
	InvitationsDeleted string `json:"invitationsDeleted"`
	AuditRecordsDeleted string `json:"auditRecordsDeleted"`
}

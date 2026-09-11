package com.sdkwork.im.backend.api.generated

data class RetentionPurgeResponse(
    val generatedAt: String? = null,
    val batchSize: String? = null,
    val commitJournalDeleted: String? = null,
    val conversationMessagesDeleted: String? = null,
    val messageMediaRefsDeleted: String? = null,
    val outboxEventsDeleted: String? = null,
    val inboxEventsDeleted: String? = null,
    val realtimeDeviceEventsDeleted: String? = null,
    val rtcSessionsDeleted: String? = null,
    val invitationsDeleted: String? = null,
    val auditRecordsDeleted: String? = null
)

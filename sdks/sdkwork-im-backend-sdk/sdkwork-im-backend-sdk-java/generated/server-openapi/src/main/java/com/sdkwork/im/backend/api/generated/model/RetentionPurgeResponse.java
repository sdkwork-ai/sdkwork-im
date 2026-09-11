package com.sdkwork.im.backend.api.generated.model;


public class RetentionPurgeResponse {
    private String generatedAt;
    private String batchSize;
    private String commitJournalDeleted;
    private String conversationMessagesDeleted;
    private String messageMediaRefsDeleted;
    private String outboxEventsDeleted;
    private String inboxEventsDeleted;
    private String realtimeDeviceEventsDeleted;
    private String rtcSessionsDeleted;
    private String invitationsDeleted;
    private String auditRecordsDeleted;

    public String getGeneratedAt() {
        return this.generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getBatchSize() {
        return this.batchSize;
    }

    public void setBatchSize(String batchSize) {
        this.batchSize = batchSize;
    }

    public String getCommitJournalDeleted() {
        return this.commitJournalDeleted;
    }

    public void setCommitJournalDeleted(String commitJournalDeleted) {
        this.commitJournalDeleted = commitJournalDeleted;
    }

    public String getConversationMessagesDeleted() {
        return this.conversationMessagesDeleted;
    }

    public void setConversationMessagesDeleted(String conversationMessagesDeleted) {
        this.conversationMessagesDeleted = conversationMessagesDeleted;
    }

    public String getMessageMediaRefsDeleted() {
        return this.messageMediaRefsDeleted;
    }

    public void setMessageMediaRefsDeleted(String messageMediaRefsDeleted) {
        this.messageMediaRefsDeleted = messageMediaRefsDeleted;
    }

    public String getOutboxEventsDeleted() {
        return this.outboxEventsDeleted;
    }

    public void setOutboxEventsDeleted(String outboxEventsDeleted) {
        this.outboxEventsDeleted = outboxEventsDeleted;
    }

    public String getInboxEventsDeleted() {
        return this.inboxEventsDeleted;
    }

    public void setInboxEventsDeleted(String inboxEventsDeleted) {
        this.inboxEventsDeleted = inboxEventsDeleted;
    }

    public String getRealtimeDeviceEventsDeleted() {
        return this.realtimeDeviceEventsDeleted;
    }

    public void setRealtimeDeviceEventsDeleted(String realtimeDeviceEventsDeleted) {
        this.realtimeDeviceEventsDeleted = realtimeDeviceEventsDeleted;
    }

    public String getRtcSessionsDeleted() {
        return this.rtcSessionsDeleted;
    }

    public void setRtcSessionsDeleted(String rtcSessionsDeleted) {
        this.rtcSessionsDeleted = rtcSessionsDeleted;
    }

    public String getInvitationsDeleted() {
        return this.invitationsDeleted;
    }

    public void setInvitationsDeleted(String invitationsDeleted) {
        this.invitationsDeleted = invitationsDeleted;
    }

    public String getAuditRecordsDeleted() {
        return this.auditRecordsDeleted;
    }

    public void setAuditRecordsDeleted(String auditRecordsDeleted) {
        this.auditRecordsDeleted = auditRecordsDeleted;
    }
}

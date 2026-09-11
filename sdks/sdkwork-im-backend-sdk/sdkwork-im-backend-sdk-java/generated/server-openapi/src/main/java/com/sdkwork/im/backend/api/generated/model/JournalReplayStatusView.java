package com.sdkwork.im.backend.api.generated.model;


public class JournalReplayStatusView {
    private String status;
    private String mode;
    private Boolean databaseConfigured;
    private Boolean journalReady;
    private String totalCommits;
    private String headCommitOffset;
    private String latestOccurredAt;
    private String detail;
    private String generatedAt;

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMode() {
        return this.mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Boolean getDatabaseConfigured() {
        return this.databaseConfigured;
    }

    public void setDatabaseConfigured(Boolean databaseConfigured) {
        this.databaseConfigured = databaseConfigured;
    }

    public Boolean getJournalReady() {
        return this.journalReady;
    }

    public void setJournalReady(Boolean journalReady) {
        this.journalReady = journalReady;
    }

    public String getTotalCommits() {
        return this.totalCommits;
    }

    public void setTotalCommits(String totalCommits) {
        this.totalCommits = totalCommits;
    }

    public String getHeadCommitOffset() {
        return this.headCommitOffset;
    }

    public void setHeadCommitOffset(String headCommitOffset) {
        this.headCommitOffset = headCommitOffset;
    }

    public String getLatestOccurredAt() {
        return this.latestOccurredAt;
    }

    public void setLatestOccurredAt(String latestOccurredAt) {
        this.latestOccurredAt = latestOccurredAt;
    }

    public String getDetail() {
        return this.detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getGeneratedAt() {
        return this.generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }
}

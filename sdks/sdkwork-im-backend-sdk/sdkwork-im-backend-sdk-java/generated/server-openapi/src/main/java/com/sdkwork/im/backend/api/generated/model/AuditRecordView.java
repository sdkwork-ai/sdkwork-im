package com.sdkwork.im.backend.api.generated.model;


public class AuditRecordView {
    private String tenantId;
    private String recordId;
    private String auditSeq;
    private String aggregateType;
    private String aggregateId;
    private String action;
    private String actorId;
    private String actorKind;
    private String actorSessionId;
    private String payload;
    private String recordedAt;
    private String chainPrevHash;
    private String chainHash;

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getRecordId() {
        return this.recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getAuditSeq() {
        return this.auditSeq;
    }

    public void setAuditSeq(String auditSeq) {
        this.auditSeq = auditSeq;
    }

    public String getAggregateType() {
        return this.aggregateType;
    }

    public void setAggregateType(String aggregateType) {
        this.aggregateType = aggregateType;
    }

    public String getAggregateId() {
        return this.aggregateId;
    }

    public void setAggregateId(String aggregateId) {
        this.aggregateId = aggregateId;
    }

    public String getAction() {
        return this.action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActorId() {
        return this.actorId;
    }

    public void setActorId(String actorId) {
        this.actorId = actorId;
    }

    public String getActorKind() {
        return this.actorKind;
    }

    public void setActorKind(String actorKind) {
        this.actorKind = actorKind;
    }

    public String getActorSessionId() {
        return this.actorSessionId;
    }

    public void setActorSessionId(String actorSessionId) {
        this.actorSessionId = actorSessionId;
    }

    public String getPayload() {
        return this.payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getRecordedAt() {
        return this.recordedAt;
    }

    public void setRecordedAt(String recordedAt) {
        this.recordedAt = recordedAt;
    }

    public String getChainPrevHash() {
        return this.chainPrevHash;
    }

    public void setChainPrevHash(String chainPrevHash) {
        this.chainPrevHash = chainPrevHash;
    }

    public String getChainHash() {
        return this.chainHash;
    }

    public void setChainHash(String chainHash) {
        this.chainHash = chainHash;
    }
}

package com.sdkwork.im.backend.api.generated.model;


public class AuditRecordAnchorRequest {
    private String recordId;
    private String aggregateType;
    private String aggregateId;
    private String action;
    private String payload;

    public String getRecordId() {
        return this.recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
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

    public String getPayload() {
        return this.payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }
}

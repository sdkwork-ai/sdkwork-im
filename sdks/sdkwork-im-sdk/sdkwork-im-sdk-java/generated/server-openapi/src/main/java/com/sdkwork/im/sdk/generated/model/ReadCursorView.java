package com.sdkwork.im.sdk.generated.model;


public class ReadCursorView {
    private String tenantId;
    private String conversationId;
    private String principalId;
    private String readSeq;
    private String updatedAt;

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getConversationId() {
        return this.conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getPrincipalId() {
        return this.principalId;
    }

    public void setPrincipalId(String principalId) {
        this.principalId = principalId;
    }

    public String getReadSeq() {
        return this.readSeq;
    }

    public void setReadSeq(String readSeq) {
        this.readSeq = readSeq;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}

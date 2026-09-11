package com.sdkwork.im.sdk.generated.model;

import java.util.Map;

public class SharedChannelLinkSyncResponse {
    private String tenantId;
    private String conversationId;
    private String memberId;
    private String principalId;
    private String principalKind;
    private String role;
    private String state;
    private String joinedAt;
    private String invitedBy;
    private String removedAt;
    private Map<String, String> attributes;
    private String proofVersion;
    private String requestKey;
    private String status;

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

    public String getMemberId() {
        return this.memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getPrincipalId() {
        return this.principalId;
    }

    public void setPrincipalId(String principalId) {
        this.principalId = principalId;
    }

    public String getPrincipalKind() {
        return this.principalKind;
    }

    public void setPrincipalKind(String principalKind) {
        this.principalKind = principalKind;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getJoinedAt() {
        return this.joinedAt;
    }

    public void setJoinedAt(String joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getInvitedBy() {
        return this.invitedBy;
    }

    public void setInvitedBy(String invitedBy) {
        this.invitedBy = invitedBy;
    }

    public String getRemovedAt() {
        return this.removedAt;
    }

    public void setRemovedAt(String removedAt) {
        this.removedAt = removedAt;
    }

    public Map<String, String> getAttributes() {
        return this.attributes;
    }

    public void setAttributes(Map<String, String> attributes) {
        this.attributes = attributes;
    }

    public String getProofVersion() {
        return this.proofVersion;
    }

    public void setProofVersion(String proofVersion) {
        this.proofVersion = proofVersion;
    }

    public String getRequestKey() {
        return this.requestKey;
    }

    public void setRequestKey(String requestKey) {
        this.requestKey = requestKey;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

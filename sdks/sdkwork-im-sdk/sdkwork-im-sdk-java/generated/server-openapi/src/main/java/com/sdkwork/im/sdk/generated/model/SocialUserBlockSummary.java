package com.sdkwork.im.sdk.generated.model;


public class SocialUserBlockSummary {
    private String blockId;
    private String blockerUserId;
    private String blockedUserId;
    private String scope;
    private String createdAt;

    public String getBlockId() {
        return this.blockId;
    }

    public void setBlockId(String blockId) {
        this.blockId = blockId;
    }

    public String getBlockerUserId() {
        return this.blockerUserId;
    }

    public void setBlockerUserId(String blockerUserId) {
        this.blockerUserId = blockerUserId;
    }

    public String getBlockedUserId() {
        return this.blockedUserId;
    }

    public void setBlockedUserId(String blockedUserId) {
        this.blockedUserId = blockedUserId;
    }

    public String getScope() {
        return this.scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}

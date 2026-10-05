package com.sdkwork.im.sdk.generated.model;


public class Friendship {
    private String tenantId;
    private String friendshipId;
    private String initiatorUserId;
    private String userLowId;
    private String userHighId;
    private String status;
    private String establishedAt;
    private String updatedAt;

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getFriendshipId() {
        return this.friendshipId;
    }

    public void setFriendshipId(String friendshipId) {
        this.friendshipId = friendshipId;
    }

    public String getInitiatorUserId() {
        return this.initiatorUserId;
    }

    public void setInitiatorUserId(String initiatorUserId) {
        this.initiatorUserId = initiatorUserId;
    }

    public String getUserLowId() {
        return this.userLowId;
    }

    public void setUserLowId(String userLowId) {
        this.userLowId = userLowId;
    }

    public String getUserHighId() {
        return this.userHighId;
    }

    public void setUserHighId(String userHighId) {
        this.userHighId = userHighId;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEstablishedAt() {
        return this.establishedAt;
    }

    public void setEstablishedAt(String establishedAt) {
        this.establishedAt = establishedAt;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}

package com.sdkwork.im.sdk.generated.model;


public class SpaceInviteCreateRequest {
    private String inviteeUserId;
    private String inviteeEmail;
    private String inviteePhone;
    private String targetType;
    private String targetId;
    private String role;
    private String message;
    private String expiresAt;

    public String getInviteeUserId() {
        return this.inviteeUserId;
    }

    public void setInviteeUserId(String inviteeUserId) {
        this.inviteeUserId = inviteeUserId;
    }

    public String getInviteeEmail() {
        return this.inviteeEmail;
    }

    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }

    public String getInviteePhone() {
        return this.inviteePhone;
    }

    public void setInviteePhone(String inviteePhone) {
        this.inviteePhone = inviteePhone;
    }

    public String getTargetType() {
        return this.targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getTargetId() {
        return this.targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }
}

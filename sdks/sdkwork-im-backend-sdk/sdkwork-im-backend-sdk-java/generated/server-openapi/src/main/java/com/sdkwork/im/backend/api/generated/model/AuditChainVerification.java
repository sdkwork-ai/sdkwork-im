package com.sdkwork.im.backend.api.generated.model;


public class AuditChainVerification {
    private String tenantId;
    private String verifiedAt;
    private String total;
    private String chainHeadHash;
    private Boolean chainValid;

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getVerifiedAt() {
        return this.verifiedAt;
    }

    public void setVerifiedAt(String verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getTotal() {
        return this.total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public String getChainHeadHash() {
        return this.chainHeadHash;
    }

    public void setChainHeadHash(String chainHeadHash) {
        this.chainHeadHash = chainHeadHash;
    }

    public Boolean getChainValid() {
        return this.chainValid;
    }

    public void setChainValid(Boolean chainValid) {
        this.chainValid = chainValid;
    }
}

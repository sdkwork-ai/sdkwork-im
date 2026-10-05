package com.sdkwork.im.backend.api.generated.model;

import java.util.List;

public class AuditRecordListResponse {
    private List<AuditRecordView> items;
    private PageInfo pageInfo;

    public List<AuditRecordView> getItems() {
        return this.items;
    }

    public void setItems(List<AuditRecordView> items) {
        this.items = items;
    }

    public PageInfo getPageInfo() {
        return this.pageInfo;
    }

    public void setPageInfo(PageInfo pageInfo) {
        this.pageInfo = pageInfo;
    }
}

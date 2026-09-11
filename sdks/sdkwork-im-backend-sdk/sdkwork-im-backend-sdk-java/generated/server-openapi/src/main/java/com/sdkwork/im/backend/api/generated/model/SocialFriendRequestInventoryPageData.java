package com.sdkwork.im.backend.api.generated.model;

import java.util.List;

public class SocialFriendRequestInventoryPageData {
    private List<SocialFriendRequestInventoryItem> items;
    private PageInfo pageInfo;

    public List<SocialFriendRequestInventoryItem> getItems() {
        return this.items;
    }

    public void setItems(List<SocialFriendRequestInventoryItem> items) {
        this.items = items;
    }

    public PageInfo getPageInfo() {
        return this.pageInfo;
    }

    public void setPageInfo(PageInfo pageInfo) {
        this.pageInfo = pageInfo;
    }
}

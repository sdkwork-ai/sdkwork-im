/**
 * Contacts page (friend list, new friends, add friend).
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. The page owns
 * rendering and platform lifecycle; everything data-side goes through the
 * runtime-injected contacts service. No SDK client construction, no wx
 * network calls.
 */

const {
  IM_MP_CHAT_QUERY_PARAMS,
  IM_MP_CHAT_ROUTE_IDS,
  formatImMpTimestamp,
  getImMpRuntime,
} = require("../../../runtime/im-app");

Page({
  data: {
    status: "loading",
    contacts: [],
    hasMore: false,
    loadingMore: false,
    newFriends: [],
    searchQuery: "",
    searchResults: null,
    searching: false,
    errorText: "",
    texts: {},
  },

  unsubscribeRealtime: null,

  onLoad() {
    const runtime = getImMpRuntime();
    this.setData({ texts: this.resolveTexts(runtime) });
    void this.reload();
    void this.reloadNewFriends();
  },

  onShow() {
    // Pending-request badges and accepted friends change while away.
    void this.reloadNewFriends();
  },

  resolveTexts(runtime) {
    const t = (key) => runtime.t(key);
    return {
      title: t("chat.contacts.title"),
      loading: t("chat.contacts.loading"),
      empty: t("chat.contacts.empty"),
      loadFailed: t("chat.contacts.load_failed"),
      retry: t("chat.contacts.retry"),
      loadMore: t("chat.contacts.load_more"),
      noMore: t("chat.contacts.no_more"),
      searchPlaceholder: t("chat.contacts.search_placeholder"),
      search: t("chat.contacts.search"),
      searchEmpty: t("chat.contacts.search_empty"),
      addFriend: t("chat.contacts.add_friend"),
      requestSent: t("chat.contacts.request_sent"),
      requestFailed: t("chat.contacts.request_failed"),
      newFriends: t("chat.contacts.new_friends"),
      newFriendsEmpty: t("chat.contacts.new_friends_empty"),
      accept: t("chat.contacts.accept"),
      decline: t("chat.contacts.decline"),
      sendMessage: t("chat.contacts.send_message"),
      signOut: t("chat.settings.title"),
    };
  },

  async reload() {
    this.setData({ status: "loading", errorText: "" });
    try {
      const page = await getImMpRuntime().contactsService().listContacts();
      this.setData({
        status: page.items.length > 0 ? "ready" : "empty",
        contacts: page.items.map((item) => this.renderContact(item)),
        hasMore: page.hasMore,
        nextCursor: page.nextCursor || "",
      });
    } catch (error) {
      this.setData({
        status: "error",
        errorText: error && error.message ? error.message : "",
      });
    }
  },

  renderContact(item) {
    return {
      userId: item.userId,
      displayName: item.displayName,
      avatarUrl: item.avatarUrl || "",
    };
  },

  async loadMore() {
    if (this.data.loadingMore || !this.data.hasMore || !this.data.nextCursor) {
      return;
    }
    this.setData({ loadingMore: true });
    try {
      const page = await getImMpRuntime()
        .contactsService()
        .listContacts({ cursor: this.data.nextCursor });
      const merged = this.data.contacts.concat(page.items.map((item) => this.renderContact(item)));
      this.setData({
        contacts: merged,
        hasMore: page.hasMore,
        nextCursor: page.nextCursor || "",
      });
    } catch {
      // A failed next page keeps the loaded window visible.
    } finally {
      this.setData({ loadingMore: false });
    }
  },

  async reloadNewFriends() {
    try {
      const requests = await getImMpRuntime().contactsService().listPendingFriendRequests();
      const now = new Date();
      this.setData({
        newFriends: requests.map((request) => ({
          friendRequestId: request.friendRequestId,
          requesterDisplayName: request.requesterDisplayName,
          avatarUrl: request.requesterAvatarUrl || "",
          requestMessage: request.requestMessage || "",
          timeText: formatImMpTimestamp(request.createdAt, now),
        })),
      });
    } catch {
      // Badge-less degradation: the list still renders.
    }
  },

  onSearchInput(event) {
    this.setData({ searchQuery: event.detail.value });
  },

  async onSearch() {
    const query = this.data.searchQuery.trim();
    if (!query || this.data.searching) {
      return;
    }
    this.setData({ searching: true });
    try {
      const page = await getImMpRuntime().contactsService().searchUsers(query);
      this.setData({
        searchResults: page.items.map((item) => ({
          userId: item.userId,
          displayName: item.displayName,
          avatarUrl: item.avatarUrl || "",
          relationshipState: item.relationshipState,
        })),
      });
    } catch {
      this.setData({ searchResults: [] });
    } finally {
      this.setData({ searching: false });
    }
  },

  async onAddFriend(event) {
    const userId = event.currentTarget.dataset.userId;
    if (!userId) {
      return;
    }
    try {
      await getImMpRuntime().contactsService().sendFriendRequest(userId);
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.requestSent, "success");
    } catch {
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.requestFailed, "none");
    }
  },

  async onAcceptRequest(event) {
    await this.actOnRequest(event, "acceptFriendRequest");
    await Promise.all([this.reload(), this.reloadNewFriends()]);
  },

  async onDeclineRequest(event) {
    await this.actOnRequest(event, "declineFriendRequest");
    await this.reloadNewFriends();
  },

  async actOnRequest(event, action) {
    const friendRequestId = event.currentTarget.dataset.requestId;
    if (!friendRequestId) {
      return;
    }
    try {
      await getImMpRuntime().contactsService()[action](friendRequestId);
    } catch {
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.requestFailed, "none");
    }
  },

  async onOpenConversation(event) {
    const userId = event.currentTarget.dataset.userId;
    const displayName = event.currentTarget.dataset.displayName || "";
    if (!userId) {
      return;
    }
    const runtime = getImMpRuntime();
    try {
      const conversationId = await runtime
        .contactsService()
        .startDirectChat(runtime.currentUserId(), { userId, displayName, relationshipState: "friend" });
      runtime.navigation.navigateTo(
        runtime.routePagePath(IM_MP_CHAT_ROUTE_IDS.conversation),
        {
          [IM_MP_CHAT_QUERY_PARAMS.conversationId]: conversationId,
          ...(displayName ? { [IM_MP_CHAT_QUERY_PARAMS.conversationTitle]: displayName } : {}),
        },
      );
    } catch {
      runtime.hostAdapters.navigation.showToast(this.data.texts.requestFailed, "none");
    }
  },

  async onReachBottom() {
    await this.loadMore();
  },

  async onRetry() {
    await this.reload();
  },

  onOpenSettings() {
    const runtime = getImMpRuntime();
    runtime.navigation.navigateTo(runtime.routePagePath("app.communication.chat.settings"), {});
  },
});

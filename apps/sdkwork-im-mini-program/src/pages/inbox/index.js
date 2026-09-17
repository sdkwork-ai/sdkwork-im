/**
 * Inbox page (conversation list).
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. The page owns
 * rendering and the platform lifecycle; the shared inbox store owns the data
 * and the pagination transitions. Nothing here constructs an SDK client or
 * issues a request.
 *
 * The store is a singleton on the runtime, so navigating into a conversation
 * and back does not refetch the whole list — `onShow` refreshes instead, which
 * is what keeps an unread badge correct after a reply.
 */

const {
  IM_MP_CHAT_QUERY_PARAMS,
  IM_MP_CHAT_ROUTE_IDS,
  formatImMpBadgeCount,
  formatImMpTimestamp,
  getImMpRuntime,
} = require("../../runtime/im-app");

Page({
  data: {
    status: "loading",
    items: [],
    hasMore: false,
    loadingMore: false,
    errorText: "",
    texts: {},
  },

  /** Store subscription teardown; must run in `onUnload`. */
  unsubscribeStore: null,

  onLoad() {
    const runtime = getImMpRuntime();
    this.store = runtime.inboxStore();
    this.setData({ texts: this.resolveTexts(runtime) });
    this.unsubscribeStore = this.store.subscribe((state) => {
      this.renderState(state);
    });
    this.renderState(this.store.getState());
  },

  onShow() {
    // Refresh on every show so an unread count read while inside a thread is
    // corrected when the user comes back.
    void this.store.refresh();
  },

  onUnload() {
    if (typeof this.unsubscribeStore === "function") {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  },

  async onPullDownRefresh() {
    await this.store.refresh();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    await this.store.loadMore();
  },

  async onRetry() {
    await this.store.refresh();
  },

  onOpenConversation(event) {
    const conversationId = event.currentTarget.dataset.conversationId;
    if (!conversationId) {
      return;
    }
    const item = this.data.items.find((row) => row.conversationId === conversationId);
    const runtime = getImMpRuntime();
    runtime.navigation.navigateTo(
      runtime.routePagePath(IM_MP_CHAT_ROUTE_IDS.conversation),
      {
        [IM_MP_CHAT_QUERY_PARAMS.conversationId]: conversationId,
        ...(item ? { [IM_MP_CHAT_QUERY_PARAMS.conversationTitle]: item.displayName } : {}),
      },
    );
  },

  onOpenCreateGroup() {
    const runtime = getImMpRuntime();
    runtime.navigation.navigateTo(runtime.routePagePath(IM_MP_CHAT_ROUTE_IDS.createGroup));
  },

  resolveTexts(runtime) {
    const t = (key) => runtime.t(key);
    return {
      loading: t("chat.inbox.loading"),
      empty: t("chat.inbox.empty"),
      loadFailed: t("chat.inbox.load_failed"),
      retry: t("chat.inbox.retry"),
      loadMore: t("chat.inbox.load_more"),
      loadingMore: t("chat.inbox.loading_more"),
      noMore: t("chat.inbox.no_more"),
      createGroup: t("chat.inbox.create_group"),
    };
  },

  renderState(state) {
    const now = new Date();
    this.setData({
      status: state.status,
      hasMore: state.hasMore,
      loadingMore: state.loadingMore,
      errorText: state.errorMessage || "",
      items: state.items.map((item) => ({
        conversationId: item.conversationId,
        displayName: item.displayName,
        avatarUrl: item.avatarUrl || "",
        summary: item.lastSummary || "",
        timeText: formatImMpTimestamp(item.lastActivityAt, now),
        unreadBadge: formatImMpBadgeCount(item.unreadCount),
      })),
    });
  },
});

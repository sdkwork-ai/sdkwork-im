/**
 * Conversation page (message thread).
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. The page owns
 * rendering, the composer input, and the platform lifecycle; the conversation
 * store owns loading, pagination, and sending.
 *
 * Package note: this page lives in the `package-chat` subpackage. WeChat allows
 * a regular (non-independent) subpackage to require main-package files, which
 * is why the shared runtime bundle is imported from `src/runtime/`. It is NOT
 * an independent subpackage: making it one would forbid exactly this import and
 * force a second copy of the SDK clients into the subpackage.
 */

const {
  IM_MP_CHAT_QUERY_PARAMS,
  formatImMpTimestamp,
  getImMpRuntime,
} = require("../../../runtime/im-app");

Page({
  data: {
    status: "loading",
    title: "",
    messages: [],
    hasMore: false,
    loadingEarlier: false,
    sending: false,
    inputValue: "",
    errorText: "",
    scrollToId: "",
    texts: {},
  },

  unsubscribeStore: null,
  store: null,

  onLoad(options) {
    const runtime = getImMpRuntime();
    this.setData({ texts: this.resolveTexts(runtime) });

    const conversationId = options ? options[IM_MP_CHAT_QUERY_PARAMS.conversationId] : "";
    if (!conversationId) {
      this.setData({ status: "error", errorText: this.data.texts.loadFailed });
      return;
    }
    const fallbackTitle = options[IM_MP_CHAT_QUERY_PARAMS.conversationTitle];

    this.store = runtime.createConversationStore();
    this.unsubscribeStore = this.store.subscribe((state) => {
      this.renderState(state);
    });
    void this.store.load({
      conversationId,
      ...(fallbackTitle ? { fallbackTitle } : {}),
    });
  },

  onUnload() {
    if (typeof this.unsubscribeStore === "function") {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  },

  async onReachTop() {
    if (!this.store) {
      return;
    }
    await this.store.loadEarlier();
  },

  async onRetry() {
    if (!this.store) {
      return;
    }
    const state = this.store.getState();
    await this.store.load({ conversationId: state.conversationId, fallbackTitle: state.title });
  },

  onInput(event) {
    this.setData({ inputValue: event.detail.value });
  },

  async onSend() {
    if (!this.store || this.data.sending) {
      return;
    }
    const text = this.data.inputValue.trim();
    if (!text) {
      // Local validation only; no request is issued for whitespace.
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.emptyInput, "none");
      return;
    }
    try {
      await this.store.sendText(text);
      this.setData({ inputValue: "" });
    } catch {
      // The store already recorded `errorMessage`; the toast is the user-facing
      // signal so a failed send is never silent.
      this.setData({ errorText: this.store.getState().errorMessage || "" });
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.sendFailed, "none");
    }
  },

  resolveTexts(runtime) {
    const t = (key) => runtime.t(key);
    return {
      loading: t("chat.conversation.loading"),
      empty: t("chat.conversation.empty"),
      loadFailed: t("chat.conversation.load_failed"),
      retry: t("chat.conversation.retry"),
      loadEarlier: t("chat.conversation.load_earlier"),
      noMore: t("chat.conversation.no_more"),
      inputPlaceholder: t("chat.conversation.input_placeholder"),
      send: t("chat.conversation.send"),
      sending: t("chat.conversation.sending"),
      sendFailed: t("chat.conversation.send_failed"),
      emptyInput: t("chat.conversation.empty_input"),
    };
  },

  renderState(state) {
    const now = new Date();
    const messages = state.messages.map((message) => ({
      messageId: message.messageId,
      text: message.text,
      senderDisplayName: message.senderDisplayName || "",
      timeText: formatImMpTimestamp(message.occurredAt, now),
      anchorId: `msg-${message.messageId}`,
    }));
    const last = messages[messages.length - 1];
    this.setData({
      status: state.status,
      title: state.title,
      messages,
      hasMore: state.hasMore,
      loadingEarlier: state.loadingEarlier,
      sending: state.sending,
      errorText: state.errorMessage || "",
      // Only anchor to the newest message; anchoring while `loadEarlier` runs
      // would jump the user away from the history they just opened.
      scrollToId: state.loadingEarlier ? this.data.scrollToId : last ? last.anchorId : "",
    });
    if (state.title && state.title !== this.data.title) {
      // The title is resolved from the locale registry at runtime, which the
      // static `page.json#navigationBarTitleText` cannot express; the host
      // adapter is the only place that turns it into a platform call.
      getImMpRuntime().navigation.setNavigationBarTitle(state.title);
    }
  },
});

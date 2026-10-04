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
    imageUrls: {},
    uploadingImage: false,
    texts: {},
  },

  unsubscribeStore: null,
  unsubscribeRealtime: null,
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
    // Live delivery: a lease on this thread merges pushed messages via a
    // delta refresh; the lease is released in `onUnload`.
    this.unsubscribeRealtime = runtime
      .realtime()
      .subscribeConversation(conversationId, () => {
        void this.store
          ?.syncNew()
          .then(() => {
            void this.store.markRead();
          });
      });
    void this.store
      .load({
        conversationId,
        ...(fallbackTitle ? { fallbackTitle } : {}),
      })
      .then(() => {
        void this.store.markRead();
      });
  },

  onUnload() {
    if (typeof this.unsubscribeStore === "function") {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
    if (typeof this.unsubscribeRealtime === "function") {
      this.unsubscribeRealtime();
      this.unsubscribeRealtime = null;
    }
  },

  onShow() {
    // Returning from a subpage: re-clear the unread state if new messages
    // landed while the profile sheet was open.
    void this.store?.markRead();
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

  async onPickImage() {
    if (this.data.uploadingImage) {
      return;
    }
    const runtime = getImMpRuntime();
    const picked = await runtime.hostAdapters.media.chooseChatImage();
    if (!picked.ok || !picked.value) {
      // Cancelled or unavailable: silent, the composer stays usable.
      return;
    }
    this.setData({ uploadingImage: true });
    try {
      const upload = await runtime.mediaService().uploadChatImage({
        file: picked.value,
        appResourceId: this.store.getState().conversationId,
      });
      await this.store.sendImage(upload);
      await this.store.syncNew();
    } catch {
      runtime.hostAdapters.navigation.showToast(this.data.texts.imageSendFailed, "none");
    } finally {
      this.setData({ uploadingImage: false });
    }
  },

  /** Resolves display URLs for image rows after the message list lands. */
  async resolveImageUrls(messages) {
    const runtime = getImMpRuntime();
    const imageUrls = { ...this.data.imageUrls };
    let changed = false;
    for (const message of messages) {
      if (!message.media || imageUrls[message.messageId]) {
        continue;
      }
      try {
        imageUrls[message.messageId] = await runtime
          .mediaService()
          .resolveChatMediaUrl(message.media.nodeId);
        changed = true;
      } catch {
        // Leave unresolved; the bubble shows the fallback text.
      }
    }
    if (changed) {
      this.setData({ imageUrls });
    }
  },

  onMessageLongPress(event) {
    const messageId = event.currentTarget.dataset.messageId;
    const senderId = event.currentTarget.dataset.senderId;
    const isText = event.currentTarget.dataset.isText === true || event.currentTarget.dataset.isText === 'true';
    if (!messageId) {
      return;
    }
    const runtime = getImMpRuntime();
    // Optimistic local echoes carry an empty sender id; only the sender's
    // own device produces them, so an empty id counts as own.
    const currentUserId = runtime.currentUserId();
    const ownMessage = !senderId || (currentUserId && senderId === currentUserId);
    if (!ownMessage) {
      return;
    }
    const actions = [this.data.texts.recall];
    if (isText) {
      actions.push(this.data.texts.edit);
    }
    wx.showActionSheet({
      itemList: actions,
      success: (result) => {
        if (result.tapIndex === 0) {
          void this.recallMessage(messageId);
        } else if (result.tapIndex === 1 && isText) {
          this.promptEditMessage(messageId);
        }
      },
    });
  },

  async recallMessage(messageId) {
    try {
      await this.store.recallMessage(messageId);
    } catch {
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.actionFailed, "none");
    }
  },

  promptEditMessage(messageId) {
    const current = this.store
      .getState()
      .messages.find((message) => message.messageId === messageId);
    wx.showModal({
      title: this.data.texts.edit,
      editable: true,
      placeholderText: this.data.texts.editPlaceholder,
      content: current?.text || "",
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        const text = (result.content || "").trim();
        if (!text) {
          return;
        }
        void this.editMessage(messageId, text);
      },
    });
  },

  async editMessage(messageId, text) {
    try {
      await this.store.editMessage(messageId, text);
    } catch {
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.actionFailed, "none");
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
      pickImage: t("chat.conversation.pick_image"),
      imageSendFailed: t("chat.conversation.image_send_failed"),
      imageLoadFailed: t("chat.conversation.image_load_failed"),
      recall: t("chat.conversation.recall"),
      edit: t("chat.conversation.edit"),
      editPlaceholder: t("chat.conversation.edit_placeholder"),
      actionFailed: t("chat.conversation.action_failed"),
    };
  },

  renderState(state) {
    const now = new Date();
    const messages = state.messages.map((message) => ({
      messageId: message.messageId,
      text: message.text,
      senderId: message.senderId || "",
      senderDisplayName: message.senderDisplayName || "",
      timeText: formatImMpTimestamp(message.occurredAt, now),
      anchorId: `msg-${message.messageId}`,
      media: message.media || null,
    }));
    void this.resolveImageUrls(messages);
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

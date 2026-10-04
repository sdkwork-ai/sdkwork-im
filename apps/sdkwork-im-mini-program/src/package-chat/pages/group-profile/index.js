/**
 * Group profile page (rename, members, invite, remove, leave).
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Everything
 * data-side goes through the runtime-injected group and contacts services;
 * role/membership permissions are enforced server-side and failures surface
 * as toasts, never as fabricated state.
 */

const {
  IM_MP_CHAT_QUERY_PARAMS,
  getImMpRuntime,
} = require("../../../runtime/im-app");

Page({
  data: {
    status: "loading",
    conversationId: "",
    groupName: "",
    members: [],
    hasMore: false,
    loadingMore: false,
    addingMembers: false,
    contactPickerOpen: false,
    contactCandidates: [],
    selectedUserIds: [],
    errorText: "",
    texts: {},
  },

  onLoad(options) {
    const runtime = getImMpRuntime();
    this.setData({ texts: this.resolveTexts(runtime) });
    const conversationId = options ? options[IM_MP_CHAT_QUERY_PARAMS.conversationId] : "";
    if (!conversationId) {
      this.setData({ status: "error", errorText: this.data.texts.actionFailed });
      return;
    }
    this.setData({ conversationId });
    void this.reload();
  },

  resolveTexts(runtime) {
    const t = (key) => runtime.t(key);
    return {
      title: t("chat.group_profile.title"),
      groupName: t("chat.group_profile.group_name"),
      members: t("chat.group_profile.members"),
      membersEmpty: t("chat.group_profile.members_empty"),
      loadMore: t("chat.group_profile.load_more"),
      addMembers: t("chat.group_profile.add_members"),
      addMembersEmpty: t("chat.group_profile.add_members_empty"),
      removeMember: t("chat.group_profile.remove_member"),
      removeConfirm: t("chat.group_profile.remove_confirm"),
      leave: t("chat.group_profile.leave"),
      leaveConfirm: t("chat.group_profile.leave_confirm"),
      rename: t("chat.group_profile.rename"),
      actionFailed: t("chat.group_profile.action_failed"),
      confirm: t("chat.group_profile.confirm"),
      cancel: t("chat.group_profile.cancel"),
    };
  },

  async reload() {
    const runtime = getImMpRuntime();
    this.setData({ status: "loading", errorText: "" });
    try {
      const [profile, memberPage] = await Promise.all([
        runtime.groupService().loadGroupProfile(this.data.conversationId),
        runtime.groupService().loadMembers(this.data.conversationId),
      ]);
      this.setData({
        status: "ready",
        groupName: profile.displayName,
        members: memberPage.items,
        hasMore: memberPage.hasMore,
        nextCursor: memberPage.nextCursor || "",
      });
    } catch (error) {
      this.setData({
        status: "error",
        errorText: error && error.message ? error.message : "",
      });
    }
  },

  onRetry() {
    void this.reload();
  },

  onRename() {
    const that = this;
    wx.showModal({
      title: this.data.texts.rename,
      editable: true,
      placeholderText: this.data.texts.groupName,
      content: this.data.groupName,
      cancelText: this.data.texts.cancel,
      confirmText: this.data.texts.confirm,
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        const name = (result.content || "").trim();
        if (!name) {
          return;
        }
        void that.applyRename(name);
      },
    });
  },

  async applyRename(name) {
    try {
      await getImMpRuntime().groupService().renameGroup(this.data.conversationId, name);
      this.setData({ groupName: name });
    } catch {
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.actionFailed, "none");
    }
  },

  async onLoadMoreMembers() {
    if (this.data.loadingMore || !this.data.hasMore || !this.data.nextCursor) {
      return;
    }
    this.setData({ loadingMore: true });
    try {
      const page = await getImMpRuntime()
        .groupService()
        .loadMembers(this.data.conversationId, { cursor: this.data.nextCursor });
      this.setData({
        members: this.data.members.concat(page.items),
        hasMore: page.hasMore,
        nextCursor: page.nextCursor || "",
      });
    } catch {
      // A failed next page keeps the loaded window visible.
    } finally {
      this.setData({ loadingMore: false });
    }
  },

  onToggleAddMembers() {
    if (this.data.contactPickerOpen) {
      this.setData({ contactPickerOpen: false, contactCandidates: [], selectedUserIds: [] });
      return;
    }
    this.setData({ contactPickerOpen: true, contactCandidates: [] });
    void this.loadContactCandidates();
  },

  async loadContactCandidates() {
    try {
      const page = await getImMpRuntime().contactsService().listContacts();
      const existing = new Set(this.data.members.map((member) => member.userId));
      this.setData({
        contactCandidates: page.items
          .filter((contact) => !existing.has(contact.userId))
          .map((contact) => ({
            userId: contact.userId,
            displayName: contact.displayName,
            selected: false,
          })),
      });
    } catch {
      this.setData({ contactCandidates: [] });
    }
  },

  onToggleCandidate(event) {
    const userId = event.currentTarget.dataset.userId;
    if (!userId) {
      return;
    }
    const selectedUserIds = new Set(this.data.selectedUserIds);
    if (selectedUserIds.has(userId)) {
      selectedUserIds.delete(userId);
    } else {
      selectedUserIds.add(userId);
    }
    const contactCandidates = this.data.contactCandidates.map((item) => ({
      ...item,
      selected: selectedUserIds.has(item.userId),
    }));
    this.setData({ contactCandidates, selectedUserIds: [...selectedUserIds] });
  },

  async onConfirmAddMembers() {
    if (this.data.addingMembers || this.data.selectedUserIds.length === 0) {
      return;
    }
    const runtime = getImMpRuntime();
    this.setData({ addingMembers: true });
    try {
      for (const userId of this.data.selectedUserIds) {
        await runtime.groupService().addMember(this.data.conversationId, userId);
      }
      this.setData({ contactPickerOpen: false, contactCandidates: [], selectedUserIds: [] });
      await this.reload();
    } catch {
      runtime.hostAdapters.navigation.showToast(this.data.texts.actionFailed, "none");
    } finally {
      this.setData({ addingMembers: false });
    }
  },

  onRemoveMember(event) {
    const memberId = event.currentTarget.dataset.memberId;
    const userId = event.currentTarget.dataset.userId;
    if (!memberId) {
      return;
    }
    if (userId && userId === getImMpRuntime().currentUserId()) {
      // Leaving is the explicit leave-group action, not a member removal.
      return;
    }
    const that = this;
    wx.showModal({
      title: this.data.texts.removeMember,
      content: this.data.texts.removeConfirm,
      cancelText: this.data.texts.cancel,
      confirmText: this.data.texts.confirm,
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        void that.applyRemoveMember(memberId);
      },
    });
  },

  async applyRemoveMember(memberId) {
    try {
      await getImMpRuntime().groupService().removeMember(this.data.conversationId, memberId);
      await this.reload();
    } catch {
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.actionFailed, "none");
    }
  },

  onLeaveGroup() {
    const that = this;
    wx.showModal({
      title: this.data.texts.leave,
      content: this.data.texts.leaveConfirm,
      cancelText: this.data.texts.cancel,
      confirmText: this.data.texts.confirm,
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        void that.applyLeaveGroup();
      },
    });
  },

  async applyLeaveGroup() {
    try {
      await getImMpRuntime().groupService().leaveGroup(this.data.conversationId);
      wx.navigateBack();
    } catch {
      getImMpRuntime().hostAdapters.navigation.showToast(this.data.texts.actionFailed, "none");
    }
  },
});

/**
 * Group-creation page.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. The page owns
 * the two form fields and the platform lifecycle; creating the conversation is
 * `runtime.createGroup`, which goes through the chat capability service and the
 * generated IM SDK.
 *
 * On success the page is replaced rather than pushed onto: the creation form has
 * no reason to stay in the back stack, and `redirectTo` leaves the inbox as the
 * single back target, which is where the user expects to land.
 *
 * The Knowledgebase provisioning flag stays off. The binding between a group and
 * its Knowledgebase space is Knowledgebase-owned
 * (`AGENTS.md` -> Group Knowledgebase Boundary), so requesting provisioning from
 * a form the user did not ask for would be a side effect this page cannot
 * explain.
 */

const {
  IM_MP_CHAT_QUERY_PARAMS,
  IM_MP_CHAT_ROUTE_IDS,
  getImMpRuntime,
} = require("../../../runtime/im-app");

Page({
  data: {
    groupName: "",
    memberIds: "",
    submitting: false,
    errorText: "",
    texts: {},
  },

  onLoad() {
    const runtime = getImMpRuntime();
    const texts = this.resolveTexts(runtime);
    this.setData({ texts });
    runtime.navigation.setNavigationBarTitle(texts.title);
  },

  onNameInput(event) {
    this.setData({ groupName: event.detail.value });
  },

  onMembersInput(event) {
    this.setData({ memberIds: event.detail.value });
  },

  async onSubmit() {
    if (this.data.submitting) {
      return;
    }
    const runtime = getImMpRuntime();
    const groupName = this.data.groupName.trim();
    if (!groupName) {
      // Local validation only: no request is issued for a blank name, and the
      // service would reject it anyway.
      runtime.navigation.showToast(this.data.texts.nameRequired, "none");
      return;
    }

    this.setData({ submitting: true, errorText: "" });
    try {
      const created = await runtime.createGroup({
        groupName,
        memberUserIds: this.parseMemberIds(this.data.memberIds),
      });
      runtime.navigation.redirectTo(
        runtime.routePagePath(IM_MP_CHAT_ROUTE_IDS.conversation),
        {
          [IM_MP_CHAT_QUERY_PARAMS.conversationId]: created.conversationId,
          [IM_MP_CHAT_QUERY_PARAMS.conversationTitle]: groupName,
        },
      );
    } catch (error) {
      // Stay on the form so the entered name and members are not lost, and
      // surface why: a silent failure here would leave the user re-tapping a
      // button that never worked.
      this.setData({
        submitting: false,
        errorText: error && error.message ? error.message : String(error),
      });
      runtime.navigation.showToast(this.data.texts.failed, "none");
    }
  },

  /**
   * Parses the member field.
   *
   * Accepts both the ASCII comma and the full-width comma, plus whitespace and
   * newlines, because the field is typed on a phone keyboard where the
   * full-width comma is the default on a Chinese IME.
   */
  parseMemberIds(value) {
    return String(value ?? "")
      .split(/[,，\s]+/u)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  },

  resolveTexts(runtime) {
    const t = (key) => runtime.t(key);
    return {
      title: t("chat.create_group.title"),
      nameLabel: t("chat.create_group.name_label"),
      namePlaceholder: t("chat.create_group.name_placeholder"),
      membersLabel: t("chat.create_group.members_label"),
      membersPlaceholder: t("chat.create_group.members_placeholder"),
      submit: t("chat.create_group.submit"),
      submitting: t("chat.create_group.submitting"),
      nameRequired: t("chat.create_group.name_required"),
      failed: t("chat.create_group.failed"),
    };
  },
});

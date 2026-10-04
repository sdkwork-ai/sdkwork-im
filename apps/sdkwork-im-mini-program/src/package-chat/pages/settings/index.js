/**
 * Settings page (sign-out surface).
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Logout goes
 * through the runtime's auth runtime (`auth.logout`), which revokes the
 * server session and clears every local credential surface. This page adds
 * no credential handling of its own.
 */

const {
  IM_MP_LOGIN_PAGE_PATH,
  getImMpRuntime,
} = require("../../../runtime/im-app");

Page({
  data: {
    signingOut: false,
    texts: {},
  },

  onLoad() {
    const runtime = getImMpRuntime();
    this.setData({ texts: this.resolveTexts(runtime) });
  },

  resolveTexts(runtime) {
    const t = (key) => runtime.t(key);
    return {
      signOut: t("chat.settings.sign_out"),
      signOutConfirm: t("chat.settings.sign_out_confirm"),
      signOutFailed: t("chat.settings.sign_out_failed"),
      signedOut: t("chat.settings.signed_out"),
      cancel: t("chat.settings.cancel"),
    };
  },

  onSignOut() {
    const runtime = getImMpRuntime();
    if (this.data.signingOut) {
      return;
    }
    wx.showModal({
      title: this.data.texts.signOut,
      content: this.data.texts.signOutConfirm,
      cancelText: this.data.texts.cancel,
      success: (result) => {
        if (result.confirm) {
          void this.confirmSignOut(runtime);
        }
      },
    });
  },

  async confirmSignOut(runtime) {
    this.setData({ signingOut: true });
    try {
      await runtime.auth.logout();
      runtime.hostAdapters.navigation.showToast(this.data.texts.signedOut, "success");
      wx.reLaunch({ url: `/${IM_MP_LOGIN_PAGE_PATH}` });
    } catch {
      runtime.hostAdapters.navigation.showToast(this.data.texts.signOutFailed, "none");
    } finally {
      this.setData({ signingOut: false });
    }
  },
});

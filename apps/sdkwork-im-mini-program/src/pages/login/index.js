/**
 * Login page.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. The page owns
 * rendering only: it calls `runtime.auth.login()` and navigates. It does not
 * touch `wx.login`, the IAM SDK, storage, or the token manager — those are
 * host, core, and bootstrap responsibilities respectively.
 *
 * This page is the first entry in `app.json#pages`, so it must be safe to
 * render with no session, no gateway, and a failed bootstrap.
 */

const {
  IM_MP_HOME_PAGE_PATH,
  getImMpRuntime,
  resolveImMpShellMessage,
} = require("../../runtime/im-app");

Page({
  data: {
    title: "",
    description: "",
    actionText: "",
    pendingText: "",
    pending: false,
    errorText: "",
  },

  onLoad() {
    const app = getApp();
    const fallback = this.resolveFallbackMessages();
    this.setData(fallback);

    if (!app.globalData.runtimeReady) {
      // Bootstrap failed in `app.js`; the reason is already captured there and
      // is the only actionable text a user (or the operator reading a
      // screenshot) can act on.
      this.setData({
        errorText:
          app.globalData.runtimeError || fallback.runtimeUnavailableText,
      });
      return;
    }

    const runtime = getImMpRuntime();
    wx.setNavigationBarTitle({ title: fallback.title });
    if (runtime.auth.isAuthenticated()) {
      // A deep link to the login page with a live session: go home instead of
      // asking the user to sign in again.
      runtime.navigation.reLaunch(IM_MP_HOME_PAGE_PATH);
    }
  },

  /**
   * Resolves copy for the active locale when the runtime is available, and
   * falls back to the default locale when it is not — the login page must
   * render in the bootstrap-failure path too, and a bilingual page is not an
   * option the platform offers.
   */
  resolveFallbackMessages() {
    const locale = this.resolveLocale();
    const t = (key) => resolveImMpShellMessage(locale, key);
    return {
      title: t("common.session.login_title"),
      description: t("common.session.login_description"),
      actionText: t("common.session.login_action"),
      pendingText: t("common.session.login_pending"),
      runtimeUnavailableText: t("common.session.runtime_unavailable"),
    };
  },

  resolveLocale() {
    const app = getApp();
    if (!app.globalData.runtimeReady) {
      return "zh-CN";
    }
    return getImMpRuntime().locale;
  },

  async onLogin() {
    if (this.data.pending) {
      return;
    }
    this.setData({ pending: true, errorText: "" });
    try {
      const runtime = getImMpRuntime();
      await runtime.auth.login();
      runtime.navigation.reLaunch(IM_MP_HOME_PAGE_PATH);
    } catch (error) {
      this.setData({
        errorText: error && error.message ? error.message : String(error),
      });
    } finally {
      this.setData({ pending: false });
    }
  },
});

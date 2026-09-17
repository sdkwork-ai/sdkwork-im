/**
 * WeChat mini program entry.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 6. This file is
 * plain CommonJS because the WeChat runtime loads it directly; everything it
 * depends on is bundled into `src/runtime/im-app.js` by
 * `scripts/build-runtime.mjs`, and the materialized profile is
 * `src/runtime/runtime-env.js`.
 *
 * Launch flow:
 * 1. bootstrap (host adapters -> environment -> SDK clients -> routes);
 * 2. restore the persisted dual-token session and re-validate it against IAM;
 * 3. relaunch to the inbox or the login page based on the restore result.
 *
 * Step 3 is why the first entry in `app.json#pages` is the login page: before
 * the session is known, the only page that is always safe to show is the one
 * that displays no protected data. An authenticated user is moved to the inbox
 * within the same launch, before first paint of any chat content.
 */

const {
  bootstrapImMpMiniProgram,
  IM_MP_HOME_PAGE_PATH,
  IM_MP_LOGIN_PAGE_PATH,
  resolveImMpLaunchPagePath,
} = require("./runtime/im-app");
const runtimeEnv = require("./runtime/runtime-env");

App({
  globalData: {
    sdkworkProfileId: runtimeEnv.SDKWORK_PROFILE_ID,
    runtimeReady: false,
    runtimeError: null,
  },

  onLaunch() {
    bootstrapImMpMiniProgram({ runtimeEnv })
      .then(async (runtime) => {
        this.globalData.runtimeReady = true;
        this.globalData.sdkworkProfileId = runtime.environment.profileId;
        const restore = await runtime.auth.restore();
        wx.reLaunch({
          url: `/${resolveImMpLaunchPagePath(restore.authenticated, IM_MP_HOME_PAGE_PATH)}`,
        });
      })
      .catch((error) => {
        // Bootstrap failure (missing runtime bundle, invalid profile identity,
        // unreachable host API) must still land the user on the login page:
        // a white screen is undiagnosable, and the login page surfaces the
        // reason through `runtimeError`.
        this.globalData.runtimeError = error && error.message ? error.message : String(error);
        wx.reLaunch({ url: `/${IM_MP_LOGIN_PAGE_PATH}` });
      });
  },
});

/**
 * SDK client inventory consumed by the IM mini program core.
 *
 * Authority: `specs/component.spec.json` `contracts.sdkDependencies`. All
 * clients are generated SDK workspaces owned by this repository or by a
 * workspace sibling; no transport is vendored into the application root.
 *
 * `@sdkwork/iam-app-sdk` is what makes WeChat mini program sign-in possible:
 * `oauth.miniProgramSessions.create` is the generated surface for the one-time
 * `wx.login()` code exchange, and `auth.sessions.current` validates the
 * persisted session on cold launch.
 */
export const imMpCoreSdkInventory = [
  "@sdkwork/im-sdk",
  "@sdkwork/im-app-sdk",
  "@sdkwork/iam-app-sdk",
] as const;

export function listImMpCoreSdkInventory(): readonly string[] {
  return imMpCoreSdkInventory;
}

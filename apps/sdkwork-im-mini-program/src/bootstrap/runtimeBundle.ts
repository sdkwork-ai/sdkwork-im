/**
 * esbuild entry for the IM mini program runtime bundle.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 6. WeChat loads
 * plain CommonJS, and the packages are TypeScript with workspace-relative
 * imports, so `scripts/build-runtime.mjs` bundles this module into
 * `src/runtime/im-app.js`. `src/app.js` and the platform pages consume that
 * bundle — they never import a workspace package directly.
 *
 * Everything a page needs is re-exported here so the platform layer has exactly
 * one import specifier to depend on.
 */

import type { ImMpRuntimeEnvSource } from "./environment";
import { bootstrapImMpRuntime, getImMpRuntime, isImMpRuntimeBootstrapped, type ImMpRuntime } from "./runtime";

export interface ImMpMiniProgramBootstrapOptions {
  readonly runtimeEnv: ImMpRuntimeEnvSource;
}

/**
 * Boots the IM mini program runtime.
 *
 * Returns the composed runtime so `app.js` can stash it on `globalData` for the
 * pages, and so an integration test can assert on the result.
 */
export function bootstrapImMpMiniProgram(
  options: ImMpMiniProgramBootstrapOptions,
): Promise<ImMpRuntime> {
  return bootstrapImMpRuntime(options);
}

export { getImMpRuntime, isImMpRuntimeBootstrapped };
export type { ImMpRuntime };

// --- Runtime environment -----------------------------------------------------

export {
  IM_MP_DEPLOYMENT_PROFILES,
  IM_MP_ENVIRONMENTS,
  IM_MP_RUNTIME_TARGET,
  getImMpRuntimeEnvironment,
  validateImMpRuntimeIdentity,
  type ImMpDeploymentProfile,
  type ImMpEnvironment,
  type ImMpRuntimeEnvironment,
  type ImMpRuntimeEnvSource,
} from "./environment";

// --- Host adapters -----------------------------------------------------------

export { getImMpHostAdapters } from "./hostAdapters";
export type { ImMpHostAdapters } from "./hostAdapters";

// --- Session and auth --------------------------------------------------------

export {
  clearImMpSessionForRuntime,
  commitImMpSessionForRuntime,
  isImMpAuthenticated,
  readImMpCurrentSession,
  restoreImMpSession,
  type ImMpSessionRestoreReason,
  type ImMpSessionRestoreResult,
} from "./session";
export { getImMpAuthRuntime, type ImMpAuthRuntime } from "./iamRuntime";

// --- Routes ------------------------------------------------------------------

export {
  composeImMpRoutes,
  listImMpRouteContributions,
  validateImMpComposedRoutes,
  type ImMpRouteComposition,
} from "./routes";

// --- Shell surface -----------------------------------------------------------

export {
  IM_MP_HOME_PAGE_PATH,
  IM_MP_LOGIN_PAGE_PATH,
  IM_MP_TAB_BAR_MIN_ITEMS,
  evaluateImMpAuthGate,
  projectImMpAppJson,
  projectImMpPages,
  projectImMpSubPackages,
  projectImMpTabBar,
  resolveImMpLaunchPagePath,
  resolveImMpShellMessage,
  resolveImMpTabBarDeclaration,
  validateImMpRouteContributions,
  type ImMpAppJsonProjection,
  type ImMpAuthGateDecision,
  type ImMpPageProjectionEntry,
  type ImMpRouteContribution,
  type ImMpSubPackageProjection,
  type ImMpTabBarDeclaration,
  type ImMpTabBarEntry,
} from "@sdkwork/im-mp-shell";

// --- Commons surface ---------------------------------------------------------

export {
  formatImMpBadgeCount,
  formatImMpTimestamp,
  imMpTokens,
  normalizeImMpLocale,
  resolveImMpScreenStatus,
  type ImMpLocale,
  type ImMpScreenState,
  type ImMpScreenStatus,
} from "@sdkwork/im-mp-commons";

// --- Chat capability surface -------------------------------------------------

export {
  IM_MP_CHAT_PAGE_SIZE,
  IM_MP_CHAT_QUERY_PARAMS,
  IM_MP_CHAT_ROUTE_IDS,
  IM_MP_CHAT_SUBPACKAGE,
  IM_MP_GROUP_CONVERSATION_TYPE,
  assertImMpCursorPage,
  createImMpChatConversationService,
  createImMpChatConversationStore,
  createImMpChatInboxService,
  createImMpChatInboxStore,
  formatImMpChatMessage,
  imMpChatRouteContributions,
  listImMpChatMessageKeys,
  prependImMpChatMessages,
  mergeImMpChatInboxPages,
  resolveImMpChatMessage,
  resolveImMpErrorMessage,
  toImMpChatConversationSummary,
  toImMpChatInboxItem,
  toImMpChatMessageItem,
  type ImMpChatConversationService,
  type ImMpChatConversationState,
  type ImMpChatConversationStore,
  type ImMpChatConversationSummary,
  type ImMpChatCreateGroupInput,
  type ImMpChatCreateGroupResult,
  type ImMpChatInboxItem,
  type ImMpChatInboxService,
  type ImMpChatInboxState,
  type ImMpChatInboxStore,
  type ImMpChatMessageItem,
  type ImMpChatMessagePage,
  type ImMpChatPage,
  type ImMpChatSendTextResult,
} from "@sdkwork/im-mp-chat";

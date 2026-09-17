/// <reference types="miniprogram-api-typings" />

/**
 * IM mini program bootstrap.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md`. One function composes
 * everything the platform pages need, in an order that is load-bearing:
 *
 * 1. host adapters (installs `fetch`, registers session storage, builds the
 *    socket factory) — must precede any SDK request;
 * 2. runtime environment (validated against the materialized profile) — needs
 *    the host language for locale negotiation;
 * 3. SDK clients — need the environment and the socket factory;
 * 4. session restore — needs the clients to call `auth.sessions.current`;
 * 5. route composition + tab-bar localization — needs the locale.
 *
 * Pages consume this runtime through the bundle projected by
 * `runtimeBundle.ts`; they never construct clients or read `wx.*`.
 */

import {
  applyImMpTabBar,
  evaluateImMpAuthGate,
  resolveImMpTabBarDeclaration,
  type ImMpAuthGateDecision,
  type ImMpRouteContribution,
  type ImMpTabBarDeclaration,
  type ImMpTabBarEntry,
} from "@sdkwork/im-mp-shell";
// `ImMpNavigationAdapter` is a host-layer contract: only `mp-host` may describe
// the platform navigation surface, so the type comes from there and not from the
// shell (which owns route metadata, not platform APIs).
import type { ImMpNavigationAdapter } from "@sdkwork/im-mp-host";
import { normalizeImMpLocale, type ImMpLocale } from "@sdkwork/im-mp-commons";
import {
  createImMpChatConversationStore,
  createImMpChatInboxStore,
  createImMpChatInboxService,
  createImMpChatConversationService,
  formatImMpChatMessage,
  resolveImMpChatMessage,
  type ImMpChatConversationStore,
  type ImMpChatCreateGroupInput,
  type ImMpChatCreateGroupResult,
  type ImMpChatInboxStore,
} from "@sdkwork/im-mp-chat";

import {
  configureImMpRuntimeEnvSource,
  resolveImMpRuntimeEnvironment,
  type ImMpRuntimeEnvSource,
  type ImMpRuntimeEnvironment,
} from "./environment";
import { registerImMpHostAdapters, type ImMpHostAdapters } from "./hostAdapters";
import { initImMpSdkClients, type ImMpSdkClientComposition } from "./sdkClients";
import { getImMpAuthRuntime, type ImMpAuthRuntime } from "./iamRuntime";
import { composeImMpRoutes } from "./routes";
import { isImMpAuthenticated } from "./session";

export interface ImMpRuntimeOptions {
  /** The materialized `SDKWORK_*` values, injected by `src/app.js`. */
  readonly runtimeEnv: ImMpRuntimeEnvSource;
}

export interface ImMpRuntime {
  readonly environment: ImMpRuntimeEnvironment;
  readonly hostAdapters: ImMpHostAdapters;
  readonly clients: ImMpSdkClientComposition;
  readonly auth: ImMpAuthRuntime;
  readonly routes: ImMpRouteContribution[];
  readonly tabBar: ImMpTabBarEntry[];
  /** Whether the build declares `app.json#tabBar` (platform minimum is two). */
  readonly tabBarDeclaration: ImMpTabBarDeclaration;
  readonly locale: ImMpLocale;
  readonly navigation: ImMpNavigationAdapter;
  /** Resolves a chat message key for the active locale. */
  readonly t: (key: string, fallback?: string) => string;
  /** Substitutes `{{name}}` placeholders in a resolved message. */
  readonly format: typeof formatImMpChatMessage;
  /** Shared inbox store; the conversation page resolves titles from it. */
  inboxStore(): ImMpChatInboxStore;
  /** Fresh conversation store per opened thread. */
  createConversationStore(): ImMpChatConversationStore;
  /** Creates a group conversation; used by the create-group page. */
  createGroup(input: ImMpChatCreateGroupInput): Promise<ImMpChatCreateGroupResult>;
  /** Guard decision for a route contribution. */
  evaluateRoute(route: { auth: ImMpRouteContribution["auth"] }): ImMpAuthGateDecision;
  /**
   * Resolves a route id to its platform page path.
   *
   * Pages navigate by route id rather than by hard-coded path, so moving a page
   * between the main package and a subpackage is a one-line change in the route
   * contribution and cannot leave a stale path behind.
   */
  routePagePath(routeId: string): string;
}

let runtime: ImMpRuntime | null = null;

export async function bootstrapImMpRuntime(
  options: ImMpRuntimeOptions,
): Promise<ImMpRuntime> {
  if (runtime) {
    return runtime;
  }

  const hostAdapters = registerImMpHostAdapters();
  configureImMpRuntimeEnvSource(options.runtimeEnv, {
    ...(hostAdapters.hostLanguage ? { hostLanguage: hostAdapters.hostLanguage } : {}),
  });
  const environment = resolveImMpRuntimeEnvironment();
  const clients = initImMpSdkClients(environment);
  const auth = getImMpAuthRuntime();

  const locale = normalizeImMpLocale(
    environment.hostLanguage ?? environment.defaultLocale,
  );

  const composition = composeImMpRoutes((titleKey) => resolveImMpChatMessage(locale, titleKey));
  // The platform cannot localize `app.json` tab labels, so they are applied
  // once here. Only when the build actually declares a tab bar: the platform
  // rejects fewer than two items, and `setTabBarItem` throws when `app.json`
  // has no `tabBar` at all.
  const tabBarDeclaration = resolveImMpTabBarDeclaration(composition.tabBar);
  if (tabBarDeclaration.enabled) {
    applyImMpTabBar(composition.tabBar, hostAdapters.navigation.setTabBarItem);
  }

  const inbox = createImMpChatInboxStore(
    createImMpChatInboxService(() => clients.imSdkClient),
  );
  const conversationService = createImMpChatConversationService(() => clients.imSdkClient);

  runtime = {
    environment,
    hostAdapters,
    clients,
    auth,
    routes: composition.routes,
    tabBar: composition.tabBar,
    tabBarDeclaration,
    locale,
    navigation: hostAdapters.navigation,
    t: (key, fallback) => resolveImMpChatMessage(locale, key, fallback),
    format: formatImMpChatMessage,
    inboxStore: () => inbox,
    createConversationStore: () =>
      createImMpChatConversationStore(conversationService, (conversationId) =>
        inbox.getState().items.find((item) => item.conversationId === conversationId)
          ?.displayName,
      ),
    createGroup: (input) => conversationService.createGroup(input),
    evaluateRoute: (route) => evaluateImMpAuthGate(route.auth, isImMpAuthenticated()),
    routePagePath: (routeId) => resolveImMpRoutePagePath(composition.routes, routeId),
  };

  return runtime;
}

/** Runtime accessor for platform pages; throws before bootstrap runs. */
export function getImMpRuntime(): ImMpRuntime {
  if (!runtime) {
    throw new Error(
      "IM mini program runtime must be bootstrapped by src/app.js before a page can use it",
    );
  }
  return runtime;
}

/**
 * Resolves a route id to its platform page path.
 *
 * Throws on an unknown id instead of returning the id: a navigation to a typo'd
 * route must fail loudly at the call site, not open a blank page on device.
 */
export function resolveImMpRoutePagePath(
  routes: ImMpRouteContribution[],
  routeId: string,
): string {
  const route = routes.find((candidate) => candidate.id === routeId);
  if (!route) {
    throw new Error(`Unknown IM mini program route id: ${routeId}`);
  }
  return route.miniProgram.pagePath;
}

export function isImMpRuntimeBootstrapped(): boolean {
  return runtime !== null;
}

/** Clears the runtime; used by tests and by a full teardown. */
export function resetImMpRuntime(): void {
  runtime = null;
}

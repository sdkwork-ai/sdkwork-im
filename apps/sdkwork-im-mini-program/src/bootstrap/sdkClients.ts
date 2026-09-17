/**
 * IM mini program SDK client construction and token propagation.
 *
 * Authority: `APP_SDK_INTEGRATION_SPEC.md`. Every generated client is built
 * here, in the application root's bootstrap, and injected into capability
 * services. Capability packages must not construct a client.
 *
 * One `AuthTokenManager` is shared by all three clients. Logout, refresh
 * failure, account switch, and tenant switch MUST clear it together with the
 * session store (see `session.ts`) — a client holding a stale token while the
 * store is empty is exactly the state that produces masked 401s.
 */

import { createTokenManager, type AuthTokenManager } from "@sdkwork/sdk-common";

import {
  createIamAppSdkClientConfig,
  createImAppSdkClientConfig,
  initIamAppSdkClient,
  initImAppSdkClient,
  initImSdkClient,
  createImSdkClientConfig,
  resetIamAppSdkClient,
  resetImAppSdkClient,
  resetImSdkClient,
  type IamAppSdkClient,
  type ImAppSdkClient,
  type ImSdkClient,
} from "@sdkwork/im-mp-core/sdk";
import type { ImMpSession } from "@sdkwork/im-mp-core/session";

import type { ImMpRuntimeEnvironment } from "./environment";
import { getImMpHostAdapters } from "./hostAdapters";

export interface ImMpSdkClientComposition {
  readonly tokenManager: AuthTokenManager;
  readonly imSdkClient: ImSdkClient;
  readonly imAppSdkClient: ImAppSdkClient;
  readonly iamAppSdkClient: IamAppSdkClient;
}

let composition: ImMpSdkClientComposition | null = null;

/**
 * Builds every SDK client for the resolved environment.
 *
 * The IM runtime client receives the host socket factory, which is what makes
 * `client.connect()` reachable at all in a WeChat runtime; without it the IM
 * SDK throws at connect time.
 */
export function initImMpSdkClients(
  environment: ImMpRuntimeEnvironment,
): ImMpSdkClientComposition {
  if (composition) {
    return composition;
  }

  const { socketFactory } = getImMpHostAdapters();
  const tokenManager = createTokenManager();

  const imSdkClient = initImSdkClient(
    createImSdkClientConfig(environment.imApiBaseUrl, {
      websocketBaseUrl: environment.imWebsocketBaseUrl,
      tokenManager,
      webSocketFactory: socketFactory,
    }),
  );

  const imAppSdkClient = initImAppSdkClient(
    createImAppSdkClientConfig(environment.imApiBaseUrl),
  );

  const iamAppSdkClient = initIamAppSdkClient({
    baseUrl: environment.iamApiBaseUrl,
    tokenManager,
    ...(environment.iamMiniProgramSurfaceCode
      ? { surfaceCode: environment.iamMiniProgramSurfaceCode }
      : {}),
  });

  composition = { tokenManager, imSdkClient, imAppSdkClient, iamAppSdkClient };
  return composition;
}

/**
 * Pushes a committed session into the token manager and every client.
 *
 * Called after a successful login and after a cold-launch restore. Both tokens
 * are required: the IM gateway rejects the CCP upgrade without them, and the
 * IAM gateway rejects `/app/v3/api` calls without the access token.
 */
export function applyImMpSession(session: ImMpSession): void {
  const current = composition;
  if (!current) {
    throw new Error("SDK clients must be initialized before a session can be applied");
  }
  current.tokenManager.setTokens({
    accessToken: session.accessToken,
    authToken: session.authToken,
    ...(session.refreshToken ? { refreshToken: session.refreshToken } : {}),
  });
  current.imSdkClient.setAccessToken(session.accessToken);
  current.imSdkClient.setAuthToken(session.authToken);
  current.imAppSdkClient.setAccessToken(session.accessToken);
  current.imAppSdkClient.setAuthToken(session.authToken);
  current.iamAppSdkClient.setAccessToken(session.accessToken);
  current.iamAppSdkClient.setAuthToken(session.authToken);
  current.iamAppSdkClient.setTokenManager(current.tokenManager);
}

/** Clears tokens from the manager and every client without dropping them. */
export function clearImMpSdkCredentials(): void {
  const current = composition;
  if (!current) {
    return;
  }
  current.tokenManager.clearTokens();
  current.imSdkClient.setAccessToken("");
  current.imSdkClient.setAuthToken("");
  current.imAppSdkClient.setAccessToken("");
  current.imAppSdkClient.setAuthToken("");
  current.iamAppSdkClient.setAccessToken("");
  current.iamAppSdkClient.setAuthToken("");
}

/** Full teardown; used on logout and by tests. */
export function resetImMpSdkClients(): void {
  composition = null;
  resetImSdkClient();
  resetImAppSdkClient();
  resetIamAppSdkClient();
}

/** Test/runtime accessor; throws before initialization. */
export function getImMpSdkClients(): ImMpSdkClientComposition {
  if (!composition) {
    throw new Error("SDK clients must be initialized by bootstrap before use");
  }
  return composition;
}

export function isImMpSdkClientsInitialized(): boolean {
  return composition !== null;
}

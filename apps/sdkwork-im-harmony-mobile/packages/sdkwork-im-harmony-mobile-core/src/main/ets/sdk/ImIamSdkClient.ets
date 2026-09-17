/**
 * IAM app-api SDK port and the Harmony session-exchange boundary.
 *
 * Authority: `APP_SDK_INTEGRATION_SPEC.md`, `IAM_LOGIN_INTEGRATION_SPEC.md`, and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6.
 *
 * Authentication is a composition concern, not a capability concern: the chat
 * packages must never construct an SDK client or reach for raw HTTP, so the
 * session exchange lives here and the root bootstrap injects it.
 *
 * The exchange itself is a generated-operation call. On HarmonyOS the ability
 * layer obtains the platform authorization fact (an account/authorization code)
 * through the host adapter; the exchange then goes through the IAM app SDK. The
 * port below is the seam the adapter plugs into until an ArkTS target of
 * `sdkwork-iam-app-sdk` exists.
 */

import {
  commitImHarmonySession,
  readImHarmonySession,
  resolveImHarmonyAccessToken,
  resolveImHarmonyAuthToken,
  type ImHarmonySession,
} from '../session/SessionStore';

/** Configuration handed to the generated IAM app SDK client. */
export interface ImIamAppSdkClientConfig {
  readonly baseUrl: string;
  readonly accessToken?: string;
  readonly authToken?: string;
  readonly platform?: string;
}

/** Injected IAM app-api surface used for session lifecycle calls. */
export interface ImIamAppSdkClient {
  readonly baseUrl: string;
  readonly platform: string;
}

export interface ImHarmonyIamClientOptions {
  readonly baseUrl: string;
  readonly accessToken?: string;
  readonly authToken?: string;
}

/** Result of a HarmonyOS session exchange. */
export interface ImHarmonySessionExchangeResult {
  readonly session: ImHarmonySession;
  readonly committed: boolean;
}

let iamAppSdkClient: ImIamAppSdkClient | null = null;

export function createImHarmonyIamAppSdkClientConfig(
  options: ImHarmonyIamClientOptions,
): ImIamAppSdkClientConfig {
  const normalized: string = options.baseUrl.trim().replace(/\/+$/u, '');
  if (normalized.length === 0) {
    throw new Error('IAM app-api base URL is required before SDK bootstrap');
  }
  const session: ImHarmonySession | null = readImHarmonySession();
  const accessToken: string | undefined = options.accessToken ?? resolveImHarmonyAccessToken(session);
  const authToken: string | undefined = options.authToken ?? resolveImHarmonyAuthToken(session);
  return {
    baseUrl: normalized,
    accessToken,
    authToken,
    platform: 'harmony-native',
  };
}

export function initImHarmonyIamAppSdkClient(
  options: ImHarmonyIamClientOptions,
): ImIamAppSdkClient {
  const config: ImIamAppSdkClientConfig = createImHarmonyIamAppSdkClientConfig(options);
  iamAppSdkClient = { baseUrl: config.baseUrl, platform: config.platform ?? 'harmony-native' };
  return iamAppSdkClient;
}

export function getImHarmonyIamAppSdkClient(): ImIamAppSdkClient {
  if (iamAppSdkClient === null) {
    throw new Error('IAM app SDK client must be initialized by bootstrap before use');
  }
  return iamAppSdkClient;
}

export function isImHarmonyIamAppSdkClientInitialized(): boolean {
  return iamAppSdkClient !== null;
}

export function resetImHarmonyIamAppSdkClient(): void {
  iamAppSdkClient = null;
}

/**
 * Normalizes a platform session payload into the session store shape.
 *
 * The V3 unwrap returns `item` when present, the payload directly otherwise,
 * and the raw envelope when the code is non-zero. Session-create responses have
 * shipped all three shapes, so this normalizes them in one place instead of
 * betting on one.
 */
export function extractImHarmonySessionPayload(value: unknown): ImHarmonySession | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const record: Record<string, Object> = value as Record<string, Object>;
  const candidates: Object[] = [];
  const item: Object | undefined = record.item as Object | undefined;
  if (item !== undefined) {
    candidates.push(item);
  }
  candidates.push(value);
  const data: Object | undefined = record.data as Object | undefined;
  if (data !== undefined && typeof data === 'object' && !Array.isArray(data)) {
    candidates.push(data);
    const nested: Object | undefined = (data as Record<string, Object>).item as Object | undefined;
    if (nested !== undefined) {
      candidates.push(nested);
    }
  }
  for (const candidate of candidates) {
    if (candidate === null || typeof candidate !== 'object' || Array.isArray(candidate)) {
      continue;
    }
    const entry: Record<string, Object> = candidate as Record<string, Object>;
    const accessToken: string | undefined = entry.accessToken as string | undefined;
    const authToken: string | undefined = entry.authToken as string | undefined;
    if (typeof accessToken === 'string' || typeof authToken === 'string') {
      return {
        accessToken,
        authToken,
        tenantId: entry.tenantId as string | undefined,
        userId: entry.userId as string | undefined,
      };
    }
  }
  return null;
}

/**
 * Commits an exchanged session to the store and to the injected apply hook.
 *
 * Both SDK clients are refreshed through the hook in the same tick, so the
 * post-login redirect cannot observe an authenticated SDK next to an empty
 * session store.
 *
 * Throws when the payload carries no session: a partially applied session that
 * only fails later at the gateway is far harder to diagnose than a failed
 * exchange.
 */
export function applyImHarmonySessionPayload(
  value: unknown,
  applySession?: (session: ImHarmonySession) => void,
): ImHarmonySessionExchangeResult {
  const extracted: ImHarmonySession | null = extractImHarmonySessionPayload(value);
  if (extracted === null) {
    throw new Error('IAM session exchange returned no usable session payload');
  }
  const session: ImHarmonySession = commitImHarmonySession(extracted);
  applySession?.(session);
  return { session, committed: true };
}

let iamRuntimeAuthenticated: boolean = false;

/**
 * Global token-manager equivalent state.
 *
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6 requires one shared
 * token-manager equivalent across the appbase SDK, every authenticated app-api
 * SDK client, and any backend-admin client. Logout and refresh failure must
 * clear it together with the session store and realtime bridges.
 */
export function markImHarmonyIamAuthenticated(authenticated: boolean): void {
  iamRuntimeAuthenticated = authenticated;
}

export function isImHarmonyIamAuthenticated(): boolean {
  return iamRuntimeAuthenticated;
}

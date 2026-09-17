/**
 * IAM app SDK client (`@sdkwork/iam-app-sdk`) construction and the WeChat mini
 * program session exchange.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and
 * `APP_SDK_INTEGRATION_SPEC.md`.
 *
 * Why this lives in `mp-core`: authentication is a composition concern, not a
 * capability concern. The chat capability must never construct an SDK client,
 * and the login page must not reach for raw HTTP. The only sanctioned surfaces
 * are generated SDKs, so the WeChat exchange goes through the generated
 * `oauth.miniProgramSessions.create` operation
 * (`POST /app/v3/api/oauth/mini_program_sessions`) with the one-time
 * `wx.login()` code.
 *
 * The session-store writes stay here too: a successful exchange must commit the
 * dual-token session and both SDK clients in one step, otherwise a page could
 * observe an authenticated SDK with an empty session store.
 */

import {
  createClient,
  type SdkworkAppClient as GeneratedIamAppClient,
  type SdkworkAppConfig as GeneratedIamAppConfig,
} from "@sdkwork/iam-app-sdk";

import {
  clearImMpSession,
  commitImMpSession,
  isImMpSessionComplete,
  readImMpSession,
  resolveImMpAccessToken,
  resolveImMpAuthToken,
  type ImMpSession,
} from "../session/session";

export type IamAppSdkClient = GeneratedIamAppClient;
export type IamAppSdkClientConfig = GeneratedIamAppConfig;

/** WeChat mini program provider key registered in the IAM OAuth catalog. */
export const IM_MP_WECHAT_PROVIDER_CODE = "wechat_mini_program" as const;

export interface ImMpWechatLoginRequest {
  /** One-time code returned by `wx.login()`. */
  readonly jsCode: string;
  /** Registered IAM OAuth mini-program surface code. */
  readonly surfaceCode?: string;
}

export interface ImMpIamClientOptions {
  readonly baseUrl: string;
  readonly accessToken?: string;
  readonly authToken?: string;
  readonly tokenManager?: unknown;
  /** Default `surfaceCode` sent with the WeChat exchange when a call omits it. */
  readonly surfaceCode?: string;
}

let iamAppSdkClient: IamAppSdkClient | null = null;
let configuredSurfaceCode: string | null = null;

/**
 * Extracts the session payload from the generated client's unwrapped response.
 *
 * The V3 unwrap (`sdkworkUnwrapKind: 'item'`) returns `data.item` when present,
 * `data` otherwise, and the raw envelope when `code !== 0`. Session-create
 * endpoints across SDKWork have shipped all three shapes, so this normalizes
 * them in one place instead of betting on one.
 */
export function extractImMpSessionPayload(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  const record = value as Record<string, unknown>;
  for (const key of ["item", "session"]) {
    const nested = record[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const candidate = nested as Record<string, unknown>;
      if (typeof candidate.accessToken === "string" || typeof candidate.authToken === "string") {
        return candidate;
      }
    }
  }
  const data = record.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const candidate = data as Record<string, unknown>;
    if (typeof candidate.accessToken === "string" || typeof candidate.authToken === "string") {
      return candidate;
    }
    if (candidate.item && typeof candidate.item === "object") {
      return candidate.item;
    }
  }
  return record;
}

export function createIamAppSdkClientConfig(
  options: ImMpIamClientOptions,
): IamAppSdkClientConfig {
  const normalized = options.baseUrl.trim().replace(/\/+$/u, "");
  if (normalized.length === 0) {
    throw new Error("IAM app-api base URL is required before SDK bootstrap");
  }
  const session = readImMpSession();
  const accessToken = options.accessToken ?? resolveImMpAccessToken(session);
  const authToken = options.authToken ?? resolveImMpAuthToken(session);
  const config: IamAppSdkClientConfig = { baseUrl: normalized, platform: "mini-program" };
  if (accessToken) {
    config.accessToken = accessToken;
  }
  if (authToken) {
    config.authToken = authToken;
  }
  if (options.tokenManager) {
    config.tokenManager = options.tokenManager as IamAppSdkClientConfig["tokenManager"];
  }
  return config;
}

export function initIamAppSdkClient(
  options: ImMpIamClientOptions,
): IamAppSdkClient {
  iamAppSdkClient = createClient(createIamAppSdkClientConfig(options));
  configuredSurfaceCode = options.surfaceCode?.trim() || null;
  return iamAppSdkClient;
}

export function getIamAppSdkClient(): IamAppSdkClient {
  if (!iamAppSdkClient) {
    throw new Error("IAM app SDK client must be initialized by bootstrap before use");
  }
  return iamAppSdkClient;
}

export function isIamAppSdkClientInitialized(): boolean {
  return iamAppSdkClient !== null;
}

export function resetIamAppSdkClient(): void {
  iamAppSdkClient = null;
  configuredSurfaceCode = null;
}

/**
 * Exchanges a `wx.login()` code for an IAM dual-token session.
 *
 * On success the session is committed to the session store AND pushed into both
 * SDK clients, so the next call in the same tick already carries credentials
 * (this is what makes the post-login redirect to the inbox work without a
 * second bootstrap pass).
 *
 * Throws when the backend returns a payload without both tokens: a partial
 * session that only fails later at the gateway is far harder to diagnose than a
 * failed login.
 */
export async function exchangeImMpWechatMiniProgramSession(
  request: ImMpWechatLoginRequest,
  applySession?: (session: ImMpSession) => void,
): Promise<ImMpSession> {
  const jsCode = request.jsCode.trim();
  if (!jsCode) {
    throw new Error("wx.login() did not return a code; cannot exchange a session.");
  }
  const surfaceCode = request.surfaceCode?.trim() || configuredSurfaceCode || undefined;
  const response = await getIamAppSdkClient().oauth.miniProgramSessions.create({
    jsCode,
    providerCode: IM_MP_WECHAT_PROVIDER_CODE,
    ...(surfaceCode ? { surfaceCode } : {}),
  });
  const session = commitImMpSession(extractImMpSessionPayload(response));
  applySession?.(session);
  return session;
}

/**
 * Re-validates the persisted session against IAM after a cold launch.
 *
 * Mirrors the PC/H5 semantics: only a definitive rejection clears the session.
 * Transient failures (offline, timeout, 5xx) keep the session, because logging
 * a user out on a subway ride is worse than one failed refresh.
 */
export async function validateImMpCurrentSession(): Promise<{
  readonly valid: boolean;
  readonly reason: "valid" | "no-session" | "rejected" | "transient";
}> {
  if (!isImMpSessionComplete(readImMpSession())) {
    clearImMpSession();
    return { valid: false, reason: "no-session" };
  }
  try {
    await getIamAppSdkClient().auth.sessions.current.retrieve();
    return { valid: true, reason: "valid" };
  } catch (error) {
    if (isImMpSessionRejectedError(error)) {
      clearImMpSession();
      return { valid: false, reason: "rejected" };
    }
    return { valid: true, reason: "transient" };
  }
}

/** Revokes the server session, then clears the local one. */
export async function logoutImMpSession(): Promise<void> {
  try {
    await getIamAppSdkClient().auth.sessions.current.delete();
  } catch {
    // A failed revoke must not trap the user in a signed-in shell; the local
    // session is cleared regardless and the next launch re-validates.
  } finally {
    clearImMpSession();
  }
}

function isImMpSessionRejectedError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const candidate = error as {
    httpStatus?: number;
    status?: number;
    statusCode?: number;
    response?: { status?: number };
  };
  const status = candidate.httpStatus
    ?? candidate.status
    ?? candidate.statusCode
    ?? candidate.response?.status;
  if (status === 401 || status === 403) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return /\b401\b/u.test(message) || /\b403\b/u.test(message) || /unauthorized/iu.test(message);
}

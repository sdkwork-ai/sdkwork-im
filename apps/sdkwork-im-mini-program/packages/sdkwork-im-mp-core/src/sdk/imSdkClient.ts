/**
 * IM runtime SDK client (`@sdkwork/im-sdk`) construction.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and
 * `APP_SDK_INTEGRATION_SPEC.md`. The concrete client is constructed here, in
 * core, and injected into capability services. Capability packages never
 * construct transport, and never fall back to raw request APIs.
 *
 * Realtime note: the generated IM SDK drives its WebSocket transport through a
 * runtime-provided factory. The WeChat mini program runtime has no global
 * `WebSocket` compatible with the current transport, so a
 * `wx.connectSocket`-backed factory must be supplied by the host layer before
 * realtime is enabled. HTTP-backed conversation and message reads work without
 * it; `transportReady` reports which mode the client is in so bootstrap and
 * tests never assume realtime silently works.
 */

import { ImSdkClient, type ImSdkClientOptions } from "@sdkwork/im-sdk";

import { readImMpSession, resolveImMpAccessToken, resolveImMpAuthToken } from "../session/session";

export type { ImSdkClient, ImSdkClientOptions };

export interface ImMpRuntimeClientConfig {
  readonly apiBaseUrl: string;
  readonly websocketBaseUrl?: string;
  readonly accessToken?: string;
  readonly authToken?: string;
  readonly tokenManager?: unknown;
  readonly webSocketFactory?: unknown;
}

let imSdkClient: ImSdkClient | null = null;
let configuredBaseUrl: string | null = null;

export function configureImMpApiBaseUrl(baseUrl: string): void {
  const normalized = baseUrl.trim().replace(/\/+$/u, "");
  if (normalized.length === 0) {
    throw new Error("SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL is required");
  }
  configuredBaseUrl = normalized;
}

export function resolveImMpApiBaseUrl(): string {
  if (!configuredBaseUrl) {
    throw new Error("IM API base URL must be configured before SDK bootstrap");
  }
  return configuredBaseUrl;
}

export function createImSdkClientConfig(
  baseUrl: string,
  overrides: Omit<ImMpRuntimeClientConfig, "apiBaseUrl"> = {},
): ImSdkClientOptions {
  configureImMpApiBaseUrl(baseUrl);
  const session = readImMpSession();
  const accessToken = overrides.accessToken ?? resolveImMpAccessToken(session);
  const authToken = overrides.authToken ?? resolveImMpAuthToken(session);
  const options: ImSdkClientOptions = {
    apiBaseUrl: resolveImMpApiBaseUrl(),
    platform: "mini-program",
  };
  if (overrides.websocketBaseUrl) {
    options.websocketBaseUrl = overrides.websocketBaseUrl;
  }
  if (accessToken) {
    options.accessToken = accessToken;
  }
  if (authToken) {
    options.authToken = authToken;
  }
  if (overrides.tokenManager) {
    options.tokenManager = overrides.tokenManager;
  }
  if (overrides.webSocketFactory) {
    options.webSocketFactory = overrides.webSocketFactory as ImSdkClientOptions["webSocketFactory"];
  }
  return options;
}

export function initImSdkClient(options: ImSdkClientOptions): ImSdkClient {
  imSdkClient = new ImSdkClient(options);
  return imSdkClient;
}

export function getImSdkClient(): ImSdkClient {
  if (!imSdkClient) {
    throw new Error("IM SDK client must be initialized by bootstrap before use");
  }
  return imSdkClient;
}

/** Non-throwing probe used by bootstrap and contract tests. */
export function isImSdkClientInitialized(): boolean {
  return imSdkClient !== null;
}

export function resetImSdkClient(): void {
  imSdkClient = null;
  configuredBaseUrl = null;
}

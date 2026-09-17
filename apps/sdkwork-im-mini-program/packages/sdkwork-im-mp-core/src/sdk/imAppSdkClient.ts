/**
 * IM app-api SDK client (`@sdkwork/im-app-sdk`) construction.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. User-facing
 * mini program packages consume `/app/v3/api` through this generated client;
 * it shares the same session credentials and token manager as the IM runtime
 * client.
 */

import {
  createClient,
  type SdkworkAppClient as GeneratedImAppClient,
  type SdkworkAppConfig as GeneratedImAppConfig,
} from "@sdkwork/im-app-sdk";

import { readImMpSession, resolveImMpAccessToken, resolveImMpAuthToken } from "../session/session";

export type ImAppSdkClient = GeneratedImAppClient;
export type ImAppSdkClientConfig = GeneratedImAppConfig;

let imAppSdkClient: ImAppSdkClient | null = null;

export function createImAppSdkClientConfig(
  baseUrl: string,
  overrides: { accessToken?: string; authToken?: string } = {},
): ImAppSdkClientConfig {
  const normalized = baseUrl.trim().replace(/\/+$/u, "");
  if (normalized.length === 0) {
    throw new Error("IM app-api base URL is required before SDK bootstrap");
  }
  const session = readImMpSession();
  const accessToken = overrides.accessToken ?? resolveImMpAccessToken(session);
  const authToken = overrides.authToken ?? resolveImMpAuthToken(session);
  const config: ImAppSdkClientConfig = { baseUrl: normalized, platform: "mini-program" };
  if (accessToken) {
    config.accessToken = accessToken;
  }
  if (authToken) {
    config.authToken = authToken;
  }
  return config;
}

export function initImAppSdkClient(
  config: ImAppSdkClientConfig,
): ImAppSdkClient {
  imAppSdkClient = createClient(config);
  return imAppSdkClient;
}

export function getImAppSdkClient(): ImAppSdkClient {
  if (!imAppSdkClient) {
    throw new Error("IM app SDK client must be initialized by bootstrap before use");
  }
  return imAppSdkClient;
}

export function isImAppSdkClientInitialized(): boolean {
  return imAppSdkClient !== null;
}

export function resetImAppSdkClient(): void {
  imAppSdkClient = null;
}

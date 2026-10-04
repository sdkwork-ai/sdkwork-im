/**
 * Drive app-api SDK client (`@sdkwork/drive-app-sdk`) construction.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Chat media
 * uploads and download grants run through this generated client; it shares the
 * same gateway origin, session credentials, and token lifecycle as the IM
 * runtime client. The transport is `fetch`, which the host polyfill installs
 * before any client is constructed (`APP_SDK_INTEGRATION_SPEC.md`).
 */

import {
  createDriveAppClient,
  type SdkworkAppConfig as DriveAppConfig,
  type SdkworkDriveAppClient,
} from "@sdkwork/drive-app-sdk";

import { readImMpSession, resolveImMpAccessToken, resolveImMpAuthToken } from "../session/session";

export type DriveAppSdkClient = SdkworkDriveAppClient;
export type DriveAppSdkClientConfig = DriveAppConfig;

let driveAppSdkClient: DriveAppSdkClient | null = null;

export function createDriveAppSdkClientConfig(
  baseUrl: string,
  overrides: { accessToken?: string; authToken?: string } = {},
): DriveAppSdkClientConfig {
  const normalized = baseUrl.trim().replace(/\/+$/u, "");
  if (normalized.length === 0) {
    throw new Error("Drive app-api base URL is required before SDK bootstrap");
  }
  const session = readImMpSession();
  const accessToken = overrides.accessToken ?? resolveImMpAccessToken(session);
  const authToken = overrides.authToken ?? resolveImMpAuthToken(session);
  const config: DriveAppSdkClientConfig = { baseUrl: normalized, platform: "mini-program" };
  if (accessToken) {
    config.accessToken = accessToken;
  }
  if (authToken) {
    config.authToken = authToken;
  }
  return config;
}

export function initDriveAppSdkClient(
  config: DriveAppSdkClientConfig,
): DriveAppSdkClient {
  driveAppSdkClient = createDriveAppClient(config);
  return driveAppSdkClient;
}

export function getDriveAppSdkClient(): DriveAppSdkClient {
  if (!driveAppSdkClient) {
    throw new Error("Drive SDK client must be initialized by bootstrap before use");
  }
  return driveAppSdkClient;
}

export function isDriveAppSdkClientInitialized(): boolean {
  return driveAppSdkClient !== null;
}

export function resetDriveAppSdkClient(): void {
  driveAppSdkClient = null;
}

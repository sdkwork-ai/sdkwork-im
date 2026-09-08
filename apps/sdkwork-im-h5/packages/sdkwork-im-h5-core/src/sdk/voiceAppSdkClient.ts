/**
 * Voice app SDK client construction (H5).
 *
 * The generated `@sdkwork/voice-app-sdk` composed facade is constructed once
 * in bootstrap and injected into feature services. UI packages MUST NOT
 * construct clients; they consume `getVoiceAppSdkClient()` from core.
 */

import {
  createClient as createGeneratedVoiceAppClient,
  type SdkworkAppClient as SdkworkVoiceAppClient,
  type SdkworkAppConfig,
} from '@sdkwork/voice-app-sdk';
import { resolveBaseUrl } from '@sdkwork/sdk-common';

export type { SdkworkVoiceAppClient };

let voiceAppSdkClient: SdkworkVoiceAppClient | null = null;

function resolveVoiceAppBaseUrl(): string {
  // Single shared base-url key; the matching API host is chosen from the
  // current page's environment+brand. This SDK client expects a bare origin.
  return resolveBaseUrl({ envKey: 'SDKWORK_API_BASE_URL' }).url;
}

export function createVoiceAppSdkClientConfig(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppConfig {
  return {
    baseUrl: config.baseUrl ?? resolveVoiceAppBaseUrl(),
    accessToken: config.accessToken,
    authToken: config.authToken,
    headers: config.headers,
    platform: 'h5',
    tokenManager: config.tokenManager,
  };
}

export function initVoiceAppSdkClient(
  config: SdkworkAppConfig = createVoiceAppSdkClientConfig(),
): SdkworkVoiceAppClient {
  voiceAppSdkClient = createGeneratedVoiceAppClient(config);
  return voiceAppSdkClient;
}

export function getVoiceAppSdkClient(): SdkworkVoiceAppClient {
  return voiceAppSdkClient ?? initVoiceAppSdkClient();
}

export function getVoiceAppSdkClientWithSession(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkVoiceAppClient {
  return initVoiceAppSdkClient(createVoiceAppSdkClientConfig(config));
}

export function resetVoiceAppSdkClient(): void {
  voiceAppSdkClient = null;
}

export function createVoiceAppSdkClient(
  config: SdkworkAppConfig = createVoiceAppSdkClientConfig(),
): SdkworkVoiceAppClient {
  return createGeneratedVoiceAppClient(config);
}

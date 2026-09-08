import {
  createClient,
  type SdkworkAppClient,
  type SdkworkAppConfig,
} from '@sdkwork/account-app-sdk';
import { resolveBaseUrl } from '@sdkwork/sdk-common';

export type { SdkworkAppClient as SdkworkAccountAppClient };

let accountAppSdkClient: SdkworkAppClient | null = null;

function resolveAccountAppBaseUrl(): string {
  // Single shared base-url key; the matching API host is chosen from the
  // current page's environment+brand. This SDK client expects a bare origin
  // (the generated SDK appends /app/v3/api itself).
  return resolveBaseUrl({ envKey: 'SDKWORK_API_BASE_URL' }).url;
}

export function createAccountAppSdkClientConfig(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppConfig {
  return {
    baseUrl: config.baseUrl ?? resolveAccountAppBaseUrl(),
    accessToken: config.accessToken,
    authToken: config.authToken,
    tenantId: config.tenantId,
    organizationId: config.organizationId,
    headers: config.headers,
    platform: 'h5',
    authMode: config.authMode,
    tokenManager: config.tokenManager,
  };
}

export function initAccountAppSdkClient(
  config: SdkworkAppConfig = createAccountAppSdkClientConfig(),
): SdkworkAppClient {
  accountAppSdkClient = createClient(config);
  return accountAppSdkClient;
}

export function getAccountAppSdkClient(): SdkworkAppClient {
  return accountAppSdkClient ?? initAccountAppSdkClient();
}

export function getAccountAppSdkClientWithSession(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppClient {
  return initAccountAppSdkClient(createAccountAppSdkClientConfig(config));
}

export function resetAccountAppSdkClient(): void {
  accountAppSdkClient = null;
}

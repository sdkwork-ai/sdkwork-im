import {
  createClient,
  type SdkworkAppClient,
  type SdkworkAppConfig,
} from '@sdkwork/iam-app-sdk';
import { resolveBaseUrl } from '@sdkwork/sdk-common';

export type { SdkworkAppClient as SdkworkIamAppClient };

let iamAppSdkClient: SdkworkAppClient | null = null;

function resolveIamAppBaseUrl(): string {
  // Single shared base-url key; the matching API host is chosen from the
  // current page's environment+brand. This SDK client expects a bare origin.
  return resolveBaseUrl({ envKey: 'SDKWORK_API_BASE_URL' }).url;
}

export function createIamAppSdkClientConfig(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppConfig {
  return {
    baseUrl: config.baseUrl ?? resolveIamAppBaseUrl(),
    accessToken: config.accessToken,
    authToken: config.authToken,
    tenantId: config.tenantId,
    organizationId: config.organizationId,
    headers: config.headers,
    platform: 'h5',
    authMode: config.authMode ?? 'dual-token',
    tokenManager: config.tokenManager,
  };
}

export function initIamAppSdkClient(
  config: SdkworkAppConfig = createIamAppSdkClientConfig(),
): SdkworkAppClient {
  iamAppSdkClient = createClient(config);
  return iamAppSdkClient;
}

export function getIamAppSdkClient(): SdkworkAppClient {
  return iamAppSdkClient ?? initIamAppSdkClient();
}

export function resetIamAppSdkClient(): void {
  iamAppSdkClient = null;
}

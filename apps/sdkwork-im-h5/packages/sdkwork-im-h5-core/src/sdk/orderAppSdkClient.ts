import {
  createClient,
  type SdkworkAppClient,
  type SdkworkAppConfig,
} from '@sdkwork/order-app-sdk';
import {resolveBaseUrlWithAlignProtocol} from '@sdkwork/sdk-common';

export type { SdkworkAppClient };

let orderAppSdkClient: SdkworkAppClient | null = null;

function resolveOrderAppBaseUrl(): string {
  // Single shared base-url key; the matching API host is chosen from the
  // current page's environment+brand. This SDK client expects a bare origin.
  return resolveBaseUrlWithAlignProtocol({ envKey: 'SDKWORK_API_BASE_URL' }).url;
}

export function createOrderAppSdkClientConfig(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppConfig {
  return {
    baseUrl: config.baseUrl ?? resolveOrderAppBaseUrl(),
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

export function initOrderAppSdkClient(
  config: SdkworkAppConfig = createOrderAppSdkClientConfig(),
): SdkworkAppClient {
  orderAppSdkClient = createClient(config);
  return orderAppSdkClient;
}

export function getOrderAppSdkClient(): SdkworkAppClient {
  return orderAppSdkClient ?? initOrderAppSdkClient();
}

export function getOrderAppSdkClientWithSession(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppClient {
  return initOrderAppSdkClient(createOrderAppSdkClientConfig(config));
}

export function resetOrderAppSdkClient(): void {
  orderAppSdkClient = null;
}

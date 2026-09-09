import {
  createClient,
  type SdkworkAppClient,
  type SdkworkAppConfig,
} from '@sdkwork/agents-app-sdk';
import {resolveBaseUrlWithAlignProtocol} from '@sdkwork/sdk-common';

export type { SdkworkAppClient as SdkworkAgentsAppClient };

let agentsAppSdkClient: SdkworkAppClient | null = null;

/**
 * Resolve the agents app SDK gateway root.
 *
 * Single shared base-url key; the matching API host is chosen from the current
 * page's environment+brand. This SDK client expects a bare origin (the
 * generated SDK appends /app/v3/api itself).
 */
function resolveAgentsAppBaseUrl(): string {
  return resolveBaseUrlWithAlignProtocol({ envKey: 'SDKWORK_API_BASE_URL' }).url;
}

export function createAgentsAppSdkClientConfig(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppConfig {
  return {
    baseUrl: config.baseUrl ?? resolveAgentsAppBaseUrl(),
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

export function initAgentsAppSdkClient(
  config: SdkworkAppConfig = createAgentsAppSdkClientConfig(),
): SdkworkAppClient {
  agentsAppSdkClient = createClient(config);
  return agentsAppSdkClient;
}

export function getAgentsAppSdkClient(): SdkworkAppClient {
  return agentsAppSdkClient ?? initAgentsAppSdkClient();
}

export function getAgentsAppSdkClientWithSession(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppClient {
  return initAgentsAppSdkClient(createAgentsAppSdkClientConfig(config));
}

export function resetAgentsAppSdkClient(): void {
  agentsAppSdkClient = null;
}

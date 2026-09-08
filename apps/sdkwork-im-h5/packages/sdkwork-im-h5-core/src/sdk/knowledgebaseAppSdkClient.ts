import {
  createKnowledgebaseAppClient as createGeneratedKnowledgebaseAppClient,
  type SdkworkAppConfig,
  type SdkworkKnowledgebaseAppClient,
} from '@sdkwork/knowledgebase-app-sdk';
import { resolveBaseUrl } from '@sdkwork/sdk-common';

export type { SdkworkKnowledgebaseAppClient };

let knowledgebaseAppSdkClient: SdkworkKnowledgebaseAppClient | null = null;

function resolveKnowledgebaseAppBaseUrl(): string {
  // Single shared base-url key; the matching API host is chosen from the
  // current page's environment+brand. This SDK client expects a bare origin.
  return resolveBaseUrl({ envKey: 'SDKWORK_API_BASE_URL' }).url;
}

export function createKnowledgebaseAppSdkClientConfig(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkAppConfig {
  return {
    baseUrl: config.baseUrl ?? resolveKnowledgebaseAppBaseUrl(),
    accessToken: config.accessToken,
    authToken: config.authToken,
    authMode: 'dual-token',
    headers: config.headers,
    platform: 'h5',
    tenantId: config.tenantId,
    organizationId: config.organizationId,
    tokenManager: config.tokenManager,
  };
}

export function initKnowledgebaseAppSdkClient(
  config: SdkworkAppConfig = createKnowledgebaseAppSdkClientConfig(),
): SdkworkKnowledgebaseAppClient {
  knowledgebaseAppSdkClient = createGeneratedKnowledgebaseAppClient(config);
  return knowledgebaseAppSdkClient;
}

export function getKnowledgebaseAppSdkClient(): SdkworkKnowledgebaseAppClient {
  return knowledgebaseAppSdkClient ?? initKnowledgebaseAppSdkClient();
}

export function getKnowledgebaseAppSdkClientWithSession(
  config: Partial<SdkworkAppConfig> = {},
): SdkworkKnowledgebaseAppClient {
  return initKnowledgebaseAppSdkClient(createKnowledgebaseAppSdkClientConfig(config));
}

export function resetKnowledgebaseAppSdkClient(): void {
  knowledgebaseAppSdkClient = null;
}

export function createKnowledgebaseAppClient(
  config: SdkworkAppConfig = createKnowledgebaseAppSdkClientConfig(),
): SdkworkKnowledgebaseAppClient {
  return createGeneratedKnowledgebaseAppClient(config);
}

/**
 * H5 runtime environment loader.
 *
 * Browser SDK base origins resolve through the shared `resolveBaseUrl`
 * contract from `@sdkwork/sdk-common` (ENVIRONMENT_SPEC.md §6.3): the unified
 * `SDKWORK_API_BASE_URL` candidate list (comma/semicolon separated) is matched
 * against the current page host, its environment suffix and the deployment
 * profile, so cloud pages map `im[-dev].sdkwork.com` onto
 * `api[-dev].sdkwork.com`, standalone pages stay same-origin, and `pnpm dev`
 * pages resolve to the same-origin dev server (standalone) or the local
 * cloud-gateway dev port (cloud). Authored per-surface
 * `SDKWORK_*`/`VITE_SDKWORK_*` overrides remain the explicit deployment
 * materialization and win over the derived origin.
 */

import {resolveBaseUrlWithAlignProtocol} from '@sdkwork/sdk-common';

export interface H5RuntimeEnvironment {
  readonly appKey: string;
  readonly deploymentProfile: 'standalone' | 'cloud';
  /** Payment cashier region: `cn` (国内) or `overseas` (海外部署). */
  readonly paymentRegion: 'cn' | 'overseas';
  readonly imApiBaseUrl: string;
  /** IM realtime WebSocket base URL (CCP connection endpoint). */
  readonly imWebsocketBaseUrl: string;
  readonly sdkGatewayApiBaseUrl: string;
  readonly driveAppApiBaseUrl: string;
  readonly orderAppApiBaseUrl: string;
  readonly iamApiBaseUrl: string;
  readonly knowledgebaseAppApiBaseUrl: string;
  readonly agentsAppApiBaseUrl: string;
  /** Voice app SDK base URL (`sdkwork-voice` app-api via gateway or direct). */
  readonly voiceAppApiBaseUrl: string;
  /** CMS app API base URL (`sdkwork-cms` app-api via gateway or direct). */
  readonly cmsAppApiBaseUrl: string;
  /** Company app API base URL (`sdkwork-company` app-api via gateway or direct). */
  readonly companyAppApiBaseUrl: string;
  /**
   * Feeds open API base URL (`sdkwork-feeds` open surface, anonymous reads).
   * Feeds stream lists (朋友圈 moments included) are read through the
   * standard feeds stream system instead of module-local feed surfaces.
   */
  readonly feedsOpenApiBaseUrl: string;
}

const DEFAULT_APP_KEY = 'sdkwork-im-h5';
const DEFAULT_DEPLOYMENT_PROFILE: H5RuntimeEnvironment['deploymentProfile'] = 'standalone';
const DEFAULT_PAYMENT_REGION: H5RuntimeEnvironment['paymentRegion'] = 'cn';

function readEnvValue(key: string): string | undefined {
  const meta = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  };
  const value = meta.env?.[key];
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return undefined;
}

function resolveDeploymentProfile(): H5RuntimeEnvironment['deploymentProfile'] {
  const value = readEnvValue('SDKWORK_DEPLOYMENT_PROFILE')
    ?? readEnvValue('VITE_SDKWORK_DEPLOYMENT_PROFILE');
  if (value === 'cloud' || value === 'standalone') {
    return value;
  }
  return DEFAULT_DEPLOYMENT_PROFILE;
}

function resolvePaymentRegion(): H5RuntimeEnvironment['paymentRegion'] {
  const value = readEnvValue('SDKWORK_PAYMENT_REGION')
    ?? readEnvValue('VITE_SDKWORK_PAYMENT_REGION');
  if (value === 'cn' || value === 'overseas') {
    return value;
  }
  return DEFAULT_PAYMENT_REGION;
}

/**
 * Resolve the agents app SDK gateway root.
 *
 * The generated agents SDK rejects same-origin `"/"` as an empty base URL, so
 * this chain must produce a concrete gateway root. The final fallback is the
 * shared resolved origin (§6.3), which keeps the same-origin semantics the
 * other H5 SDKs get from `"/"` while satisfying the agents SDK validation.
 */
function resolveAgentsAppApiBaseUrl(
  explicitAgentsBaseUrl: string | undefined,
  sharedApiOrigin: string | undefined,
): string {
  const resolved = explicitAgentsBaseUrl ?? sharedApiOrigin ?? resolveBrowserOrigin();
  if (!resolved) {
    throw new Error(
      'Agents App SDK requires a gateway root. Set SDKWORK_AGENTS_APP_API_BASE_URL ' +
        '(or seed the shared origin with SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL / SDKWORK_API_BASE_URL).',
    );
  }
  return resolved;
}

function resolveBrowserOrigin(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const origin = window.location?.origin;
  if (typeof origin === 'string' && origin.trim().length > 0 && origin !== 'null') {
    return origin.trim();
  }
  return undefined;
}

let cachedEnvironment: H5RuntimeEnvironment | null = null;

export function resolveH5RuntimeEnvironment(): H5RuntimeEnvironment {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const deploymentProfile = resolveDeploymentProfile();
  const platformGatewayApiBaseUrl = readEnvValue('SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL')
    ?? readEnvValue('VITE_SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL');
  if (deploymentProfile === 'cloud' && !platformGatewayApiBaseUrl) {
    throw new Error(
      'Cloud H5 requires SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL for dependency App SDK routing',
    );
  }

  // Single shared origin (§6.3): the materialized platform gateway, when
  // present, seeds the candidate list; otherwise the resolver reads
  // `SDKWORK_API_BASE_URL` and finally derives the origin from the current
  // page host, environment and deployment profile.
  const sharedApiOrigin = resolveBaseUrlWithAlignProtocol({
    baseUrls: platformGatewayApiBaseUrl,
    mode: deploymentProfile,
  }).url || undefined;

  cachedEnvironment = {
    appKey: readEnvValue('SDKWORK_APP_KEY') ?? DEFAULT_APP_KEY,
    deploymentProfile,
    paymentRegion: resolvePaymentRegion(),
    // IM HTTP API base: explicit override first, then the shared resolved
    // origin, then a relative fallback (same-origin proxy).
    imApiBaseUrl: readEnvValue('SDKWORK_IM_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_IM_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    // Feeds open surface: explicit feeds gateway URL, else the shared resolved
    // origin (cloud profiles serve every surface on one origin).
    feedsOpenApiBaseUrl: readEnvValue('SDKWORK_IM_H5_FEEDS_OPEN_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_IM_H5_FEEDS_OPEN_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    // IM realtime WebSocket base: explicit WS URL first, else derived from the
    // explicit IM API base URL (http->ws) so standalone deployments pinning
    // only `SDKWORK_IM_API_BASE_URL` keep HTTP and WS on one host, then from
    // the shared resolved HTTP origin (http->ws). Without this the SDK falls
    // back to a relative `ws://<frontend-origin>/...` endpoint that no dev
    // server proxies.
    imWebsocketBaseUrl: readEnvValue('SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL')
      ?? readEnvValue('VITE_SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL')
      ?? readEnvValue('SDKWORK_IM_API_BASE_URL')?.replace(/^http/u, 'ws')
      ?? readEnvValue('VITE_SDKWORK_IM_API_BASE_URL')?.replace(/^http/u, 'ws')
      ?? sharedApiOrigin?.replace(/^http/u, 'ws')
      ?? '/',
    sdkGatewayApiBaseUrl: platformGatewayApiBaseUrl ?? sharedApiOrigin ?? '/',
    driveAppApiBaseUrl: readEnvValue('SDKWORK_DRIVE_APP_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_DRIVE_APP_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    orderAppApiBaseUrl: readEnvValue('SDKWORK_ORDER_APP_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_ORDER_APP_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    iamApiBaseUrl: readEnvValue('SDKWORK_IAM_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_IAM_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    knowledgebaseAppApiBaseUrl: readEnvValue('SDKWORK_KNOWLEDGEBASE_APP_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_KNOWLEDGEBASE_APP_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    agentsAppApiBaseUrl: resolveAgentsAppApiBaseUrl(
      readEnvValue('SDKWORK_AGENTS_APP_API_BASE_URL')
        ?? readEnvValue('VITE_SDKWORK_AGENTS_APP_API_BASE_URL'),
      sharedApiOrigin,
    ),
    voiceAppApiBaseUrl: readEnvValue('SDKWORK_VOICE_APP_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_VOICE_APP_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    cmsAppApiBaseUrl: readEnvValue('SDKWORK_CMS_APP_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_CMS_APP_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
    companyAppApiBaseUrl: readEnvValue('SDKWORK_COMPANY_APP_API_BASE_URL')
      ?? readEnvValue('VITE_SDKWORK_COMPANY_APP_API_BASE_URL')
      ?? sharedApiOrigin
      ?? '/',
  };

  return cachedEnvironment;
}

export function resetH5RuntimeEnvironment(): void {
  cachedEnvironment = null;
}

export function getH5RuntimeEnvironment(): H5RuntimeEnvironment {
  return cachedEnvironment ?? resolveH5RuntimeEnvironment();
}

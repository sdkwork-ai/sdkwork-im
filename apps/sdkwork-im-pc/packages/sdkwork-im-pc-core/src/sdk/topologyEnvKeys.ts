/** v2 topology client env keys — see specs/topology.spec.json and sdkwork-specs/APP_RUNTIME_TOPOLOGY_NAMING.md */

// base-url-check: exempt (pure env-key name declarations and local-stack
// dev defaults; runtime resolution happens in sdkBaseUrls.ts through
// @sdkwork/sdk-common resolveBaseUrl, ENVIRONMENT_SPEC §6.3)
export const VITE_SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL =
  'VITE_SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL';
export const VITE_SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL =
  'VITE_SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL';
export const VITE_SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL =
  'VITE_SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL';
export const VITE_SDKWORK_IAM_APP_API_BASE_URL = 'VITE_SDKWORK_IAM_APP_API_BASE_URL';

export const DEFAULT_LOCAL_PLATFORM_API_GATEWAY_HTTP_URL = 'http://127.0.0.1:18079';
export const DEFAULT_LOCAL_APPLICATION_PUBLIC_HTTP_URL = 'http://127.0.0.1:18079';
export const DEFAULT_LOCAL_APPLICATION_PUBLIC_WEBSOCKET_URL = 'ws://127.0.0.1:18079';

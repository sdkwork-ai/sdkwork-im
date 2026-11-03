/**
 * Typed runtime environment access for the PC renderer.
 *
 * Authority: `APP_RUNTIME_ENV_SPEC.md` §3.2. Browser surfaces keep a
 * deploy-time runtime document; this facade is the single read order for
 * runtime env values:
 *
 *   1. `globalThis.SDKWORK_RUNTIME_ENV` (host/deploy document)
 *   2. Vite `import.meta.env` (build-time profile)
 *   3. Node `process.env` (desktop/test hosts)
 *
 * Feature code must read through this module instead of reaching into
 * `import.meta.env`/`globalThis` directly.
 */

export interface ImPcEnvConfig {
  readonly environment?: string;
  readonly deploymentProfile?: string;
  readonly profileId?: string;
  readonly runtimeTarget?: string;
  readonly accessToken?: string;
  readonly applicationPublicHttpUrl?: string;
  readonly applicationPublicWebSocketUrl?: string;
  readonly platformApiGatewayHttpUrl?: string;
  readonly iamAppApiBaseUrl?: string;
}

type RuntimeEnvBridge = Record<string, unknown>;

function readBridgeValue(key: string): unknown {
  const bridge = (globalThis as typeof globalThis & {
    SDKWORK_RUNTIME_ENV?: RuntimeEnvBridge;
  }).SDKWORK_RUNTIME_ENV;
  return bridge?.[key];
}

function readViteValue(key: string): unknown {
  return (import.meta.env as Record<string, unknown> | undefined)?.[key];
}

function readProcessValue(key: string): unknown {
  return (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env?.[key];
}

function normalize(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

/**
 * Reads one runtime env value with the canonical browser precedence.
 */
export function readImPcEnvValue(key: string): string | undefined {
  return normalize(readBridgeValue(key))
    ?? normalize(readViteValue(key))
    ?? normalize(readProcessValue(key));
}

function firstValue(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = readImPcEnvValue(key);
    if (value) {
      return value;
    }
  }
  return undefined;
}

/**
 * Typed projection of the selected runtime profile.
 */
export function getImPcEnvConfig(): ImPcEnvConfig {
  return {
    environment: firstValue('SDKWORK_ENVIRONMENT', 'VITE_SDKWORK_ENVIRONMENT'),
    deploymentProfile: firstValue('SDKWORK_DEPLOYMENT_PROFILE', 'VITE_SDKWORK_DEPLOYMENT_PROFILE'),
    profileId: firstValue('SDKWORK_PROFILE_ID', 'VITE_SDKWORK_PROFILE_ID'),
    runtimeTarget: firstValue('SDKWORK_RUNTIME_TARGET', 'VITE_SDKWORK_RUNTIME_TARGET'),
    accessToken: firstValue('SDKWORK_ACCESS_TOKEN'),
    applicationPublicHttpUrl: firstValue(
      'VITE_SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL',
      'SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL',
    ),
    applicationPublicWebSocketUrl: firstValue(
      'VITE_SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL',
      'SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL',
    ),
    platformApiGatewayHttpUrl: firstValue(
      'VITE_SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL',
      'SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL',
    ),
    iamAppApiBaseUrl: firstValue('VITE_SDKWORK_IAM_APP_API_BASE_URL', 'SDKWORK_IAM_APP_API_BASE_URL'),
  };
}

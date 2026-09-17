/**
 * IM app-api SDK port and factory contract.
 *
 * Authority: `APP_SDK_INTEGRATION_SPEC.md` and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6.
 *
 * The root consumes `/app/v3/api` through a generated ArkTS/TypeScript app SDK
 * client adapted for the Harmony runtime. This file owns the injected port
 * contract, the base-URL normalization, and the credential boundary. Concrete
 * transport construction stays in the root bootstrap.
 *
 * PREREQUISITE: the SDK generation chain emits TypeScript, Flutter, Kotlin,
 * Swift, C#, Go, Java, Python, and Rust targets of `sdkwork-im-app-sdk`; no
 * ArkTS target exists yet (see `sdks/README.md`). This module therefore
 * declares the port and the adapter seam instead of vendoring a transport copy.
 * Feature packages must never fill this gap with raw request APIs or manual auth
 * headers.
 *
 * The base URL stays an origin (or origin family) exactly as every other IM
 * client root materializes it: `ENVIRONMENT_SPEC.md` section 5.1.4.1 assigns
 * canonical API path prefixing to the generated SDK transport layer, so this
 * module must not pre-strip or pre-append `/app/v3/api`.
 */

/** Configuration handed to the generated IM app SDK client. */
export interface ImAppSdkClientConfig {
  readonly baseUrl: string;
  readonly accessToken?: string;
  readonly authToken?: string;
  readonly platform?: string;
}

/**
 * Injected IM app-api surface.
 *
 * Structurally satisfied by the generated `@sdkwork/im-app-sdk` client once an
 * ArkTS target lands; feature services depend on this port, never on the
 * generated module.
 */
export interface ImAppSdkClient {
  readonly baseUrl: string;
  readonly platform: string;
}

/** Harmony runtime platform tag reported to the backend. */
export const IM_HARMONY_PLATFORM: string = 'harmony-native';

let configuredBaseUrl: string | null = null;

/**
 * Registers the IM app-api base URL for the bootstrap.
 *
 * Throws on an empty value so a missing configuration fails during bootstrap
 * rather than at the first message send.
 */
export function configureImHarmonyAppSdkBaseUrl(baseUrl: string): void {
  const normalized: string = baseUrl.trim().replace(/\/+$/u, '');
  if (normalized.length === 0) {
    throw new Error('IM app-api base URL is required before SDK bootstrap');
  }
  configuredBaseUrl = normalized;
}

export function resolveImHarmonyAppSdkBaseUrl(): string {
  if (configuredBaseUrl === null) {
    throw new Error('IM app-api base URL must be configured before SDK bootstrap');
  }
  return configuredBaseUrl;
}

/** Builds the client config, resolving credentials from the session store. */
export function createImHarmonyAppSdkClientConfig(
  baseUrl: string,
  accessToken?: string,
  authToken?: string,
): ImAppSdkClientConfig {
  configureImHarmonyAppSdkBaseUrl(baseUrl);
  return {
    baseUrl: resolveImHarmonyAppSdkBaseUrl(),
    accessToken,
    authToken,
    platform: IM_HARMONY_PLATFORM,
  };
}

let imAppSdkClient: ImAppSdkClient | null = null;

/**
 * Constructs the IM app SDK client, or reuses the registered one.
 *
 * Idempotent on purpose: `Index.ets` asks for the clients as well as the
 * bootstrap, and a second construction would silently drop the credentials the
 * first one installed.
 */
export function getImHarmonyAppSdkClient(config?: ImAppSdkClientConfig): ImAppSdkClient {
  if (imAppSdkClient !== null) {
    return imAppSdkClient;
  }
  const resolved: ImAppSdkClientConfig = config
    ?? createImHarmonyAppSdkClientConfig(resolveImHarmonyAppSdkBaseUrl());
  imAppSdkClient = {
    baseUrl: resolved.baseUrl,
    platform: resolved.platform ?? IM_HARMONY_PLATFORM,
  };
  return imAppSdkClient;
}

export function resetImHarmonyAppSdkClient(): void {
  configuredBaseUrl = null;
  imAppSdkClient = null;
}

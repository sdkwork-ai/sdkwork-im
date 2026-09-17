/// <reference types="miniprogram-api-typings" />

/**
 * IM mini program runtime environment resolution.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 6. The four
 * identity keys (`SDKWORK_ENVIRONMENT`, `SDKWORK_DEPLOYMENT_PROFILE`,
 * `SDKWORK_PROFILE_ID`, `SDKWORK_RUNTIME_TARGET`) MUST agree with the profile
 * the build selected, and `SDKWORK_RUNTIME_TARGET` MUST be `mini-program`.
 *
 * The values are NOT hand-written: they are materialized from `etc/topology/*`
 * into `config/mini-program/runtime-env.<profileId>.json` by
 * `pnpm workflow:materialize-client-env`, bundled into
 * `src/runtime/runtime-env.js` by `scripts/build-runtime.mjs`, and injected
 * here by `src/app.js`.
 *
 * Resolution is via an injected source rather than a module import so the
 * bundle stays a pure function of its input and the Node test runner can drive
 * every profile without touching the WeChat runtime.
 */

export type ImMpDeploymentProfile = "standalone" | "cloud";

export type ImMpEnvironment =
  | "development"
  | "test"
  | "staging"
  | "demo"
  | "production";

export const IM_MP_DEPLOYMENT_PROFILES: readonly ImMpDeploymentProfile[] = [
  "standalone",
  "cloud",
];

export const IM_MP_ENVIRONMENTS: readonly ImMpEnvironment[] = [
  "development",
  "test",
  "staging",
  "demo",
  "production",
];

export const IM_MP_RUNTIME_TARGET = "mini-program" as const;

/** Raw materialized values keyed by `SDKWORK_*`. */
export type ImMpRuntimeEnvSource = Record<string, string | undefined>;

export interface ImMpRuntimeEnvironment {
  readonly appKey: string;
  readonly deploymentProfile: ImMpDeploymentProfile;
  readonly environment: ImMpEnvironment;
  readonly profileId: string;
  readonly runtimeTarget: typeof IM_MP_RUNTIME_TARGET;
  /** IM app-api base URL; the gateway root the generated IM SDK targets. */
  readonly imApiBaseUrl: string;
  /** IM realtime WebSocket base URL (CCP connection endpoint). */
  readonly imWebsocketBaseUrl: string;
  /** Platform gateway root used for IAM (and other dependency app-apis). */
  readonly platformGatewayApiBaseUrl: string;
  /** IAM app-api base URL used by the WeChat session exchange. */
  readonly iamApiBaseUrl: string;
  /** IAM OAuth mini-program surface code; absent when the deployment omits it. */
  readonly iamMiniProgramSurfaceCode?: string;
  /** Host language, or `undefined` so the caller picks the default locale. */
  readonly hostLanguage?: string;
  readonly defaultLocale: string;
}

const DEFAULT_APP_KEY = "sdkwork-im-mini-program";
const DEFAULT_LOCALE = "zh-CN";

let envSource: ImMpRuntimeEnvSource | null = null;
let hostLanguage: string | undefined;
let cachedEnvironment: ImMpRuntimeEnvironment | null = null;

/**
 * Registers the materialized runtime values.
 *
 * Called once from `src/app.js` before any bootstrap step reads the
 * environment. Passing `null` clears the cache, which is how the Node test
 * runner walks every profile in one process.
 */
export function configureImMpRuntimeEnvSource(
  source: ImMpRuntimeEnvSource | null,
  options: { hostLanguage?: string } = {},
): void {
  envSource = source;
  hostLanguage = options.hostLanguage?.trim() || undefined;
  cachedEnvironment = null;
}

function readEnv(key: string): string | undefined {
  const value = envSource?.[key];
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Reads an identity key, accepting both the shared `SDKWORK_*` and the
 * application-prefixed `SDKWORK_IM_*` form.
 *
 * The materializer emits both, and a profile edited by hand may carry only one;
 * accepting either keeps the check about the VALUE, not about which spelling
 * the writer chose.
 */
function readIdentity(sharedKey: string, prefixedKey: string): string | undefined {
  return readEnv(sharedKey) ?? readEnv(prefixedKey);
}

/**
 * Validates the four identity keys against the selected profile.
 *
 * Throws rather than defaulting: a mini program that quietly falls back to
 * `standalone.development` would ship a dev build pointed at a dev gateway, and
 * nothing on screen would say so.
 */
export function validateImMpRuntimeIdentity(source: ImMpRuntimeEnvSource = envSource ?? {}): string[] {
  const issues: string[] = [];
  const profile = source.SDKWORK_DEPLOYMENT_PROFILE ?? source.SDKWORK_IM_DEPLOYMENT_PROFILE;
  const environment = source.SDKWORK_ENVIRONMENT ?? source.SDKWORK_IM_ENVIRONMENT;
  const profileId = source.SDKWORK_PROFILE_ID ?? source.SDKWORK_IM_PROFILE_ID;
  const runtimeTarget = source.SDKWORK_RUNTIME_TARGET ?? source.SDKWORK_IM_RUNTIME_TARGET;

  if (!profile || !IM_MP_DEPLOYMENT_PROFILES.includes(profile as ImMpDeploymentProfile)) {
    issues.push(
      `SDKWORK_DEPLOYMENT_PROFILE must be one of ${IM_MP_DEPLOYMENT_PROFILES.join(", ")}; received ${JSON.stringify(profile ?? null)}`,
    );
  }
  if (!environment || !IM_MP_ENVIRONMENTS.includes(environment as ImMpEnvironment)) {
    issues.push(
      `SDKWORK_ENVIRONMENT must be one of ${IM_MP_ENVIRONMENTS.join(", ")}; received ${JSON.stringify(environment ?? null)}`,
    );
  }
  if (!profileId) {
    issues.push("SDKWORK_PROFILE_ID is required");
  } else if (profile && environment && profileId !== `${profile}.${environment}`) {
    issues.push(
      `SDKWORK_PROFILE_ID must be ${profile}.${environment}; received ${JSON.stringify(profileId)}`,
    );
  }
  if (runtimeTarget !== IM_MP_RUNTIME_TARGET) {
    issues.push(
      `SDKWORK_RUNTIME_TARGET must be ${IM_MP_RUNTIME_TARGET}; received ${JSON.stringify(runtimeTarget ?? null)}`,
    );
  }
  return issues;
}

/**
 * Picks the primary entry from a materialized URL value and rejects anything
 * the SDK cannot use.
 *
 * Cloud profiles materialize `SDKWORK_IM_API_BASE_URL` as a semicolon-separated
 * brand candidate list (ENVIRONMENT_SPEC §6.3). The browser resolver matches
 * that list against `location.host`; a mini program has no page origin to match
 * against, so it must take the primary entry explicitly instead of passing the
 * list through. The first entry is the canonical origin by construction.
 */
function requireUrl(value: string | undefined, key: string): string {
  const raw = value?.trim() ?? "";
  const primary = raw.split(/[;,]/u)[0]?.trim().replace(/\/+$/u, "") ?? "";
  if (!/^https?:\/\//u.test(primary)) {
    throw new Error(`${key} must be an absolute http(s) URL; received ${JSON.stringify(value ?? null)}`);
  }
  return primary;
}

/**
 * Resolves the runtime environment.
 *
 * The result is cached per configured source; callers that need a different
 * profile in one process must call `configureImMpRuntimeEnvSource` again.
 */
export function resolveImMpRuntimeEnvironment(): ImMpRuntimeEnvironment {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const issues = validateImMpRuntimeIdentity();
  if (issues.length > 0) {
    throw new Error(`IM mini program runtime identity is invalid: ${issues.join("; ")}`);
  }

  const deploymentProfile = readIdentity(
    "SDKWORK_DEPLOYMENT_PROFILE",
    "SDKWORK_IM_DEPLOYMENT_PROFILE",
  ) as ImMpDeploymentProfile;
  const environment = readIdentity(
    "SDKWORK_ENVIRONMENT",
    "SDKWORK_IM_ENVIRONMENT",
  ) as ImMpEnvironment;
  const profileId = readIdentity("SDKWORK_PROFILE_ID", "SDKWORK_IM_PROFILE_ID") as string;

  const platformGatewayApiBaseUrl = readEnv("SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL");
  const imApiBaseUrl = requireUrl(
    readIdentity("SDKWORK_IM_API_BASE_URL", "SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL"),
    "SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL",
  );
  if (deploymentProfile === "cloud" && !platformGatewayApiBaseUrl) {
    throw new Error(
      "Cloud mini program requires SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL for dependency App SDK routing",
    );
  }

  const surfaceCode = readEnv("SDKWORK_IM_IAM_MINI_PROGRAM_SURFACE_CODE");

  cachedEnvironment = {
    appKey: readEnv("SDKWORK_APP_KEY") ?? DEFAULT_APP_KEY,
    deploymentProfile,
    environment,
    profileId,
    runtimeTarget: IM_MP_RUNTIME_TARGET,
    imApiBaseUrl,
    imWebsocketBaseUrl: readEnv("SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL")
      ?? imApiBaseUrl.replace(/^http/u, "ws"),
    platformGatewayApiBaseUrl: platformGatewayApiBaseUrl
      ? requireUrl(platformGatewayApiBaseUrl, "SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL")
      : imApiBaseUrl,
    iamApiBaseUrl: requireUrl(
      readEnv("SDKWORK_IAM_APP_API_BASE_URL") ?? platformGatewayApiBaseUrl ?? imApiBaseUrl,
      "SDKWORK_IAM_APP_API_BASE_URL",
    ),
    ...(surfaceCode ? { iamMiniProgramSurfaceCode: surfaceCode } : {}),
    ...(hostLanguage ? { hostLanguage } : {}),
    defaultLocale: DEFAULT_LOCALE,
  };

  return cachedEnvironment;
}

export function getImMpRuntimeEnvironment(): ImMpRuntimeEnvironment {
  return cachedEnvironment ?? resolveImMpRuntimeEnvironment();
}

export function resetImMpRuntimeEnvironment(): void {
  cachedEnvironment = null;
}

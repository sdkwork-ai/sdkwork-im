/**
 * HarmonyOS runtime environment resolution.
 *
 * Authority: `ENVIRONMENT_SPEC.md` sections 5.1.2, 5.1.3, and 5.1.4.2. The build
 * packages exactly one selected non-secret runtime document; this module validates
 * it and normalizes it for the SDK factory.
 *
 * This module reads no file and no `process.env`: the ten tracked documents are
 * projected into `generated/RuntimeConfig.ets` by
 * `scripts/generate-harmony-runtime-config.mjs`, and selection happens here.
 */
import {
  IM_HARMONY_RUNTIME_TARGET,
  type ImHarmonyAppbaseEndpoints,
  type ImHarmonyImEndpoints,
  type ImHarmonyRuntimeEnvDocument,
} from './EnvironmentContract';
import {
  IM_HARMONY_DEFAULT_PROFILE_ID,
  IM_HARMONY_RUNTIME_ENV_DOCUMENTS,
} from '../generated/RuntimeConfig';

export {
  IM_HARMONY_RUNTIME_TARGET,
  type ImHarmonyAppbaseEndpoints,
  type ImHarmonyImEndpoints,
  type ImHarmonyRuntimeEnvDocument,
};

/** A validated, normalized environment ready for SDK construction. */
export interface ImHarmonyEnvironment {
  readonly environment: string;
  readonly deploymentProfile: string;
  readonly profileId: string;
  readonly runtimeTarget: string;
  readonly imApiBaseUrl: string;
  readonly imPlatformApiGatewayHttpUrl: string;
  readonly imApplicationPublicHttpUrl: string;
  readonly imApplicationPublicWebsocketUrl: string;
  readonly appbaseAppApiBaseUrl: string;
  readonly appbaseLoginUrl: string;
}

const HTTP_SCHEMES: string[] = ['http', 'https'];
const WEBSOCKET_SCHEMES: string[] = ['ws', 'wss'];

/**
 * Canonical API path prefixes owned by the generated SDK transport layer.
 *
 * `ENVIRONMENT_SPEC.md` section 5.1.4.1 assigns prefix normalization to the
 * transport, so a document that already carries the prefix produces
 * `/app/v3/api/app/v3/api` at request time. Sibling mobile roots in this repository
 * (`apps/sdkwork-im-flutter-mobile`, `apps/sdkwork-im-mini-program`) materialize
 * bare origins; this rejects the prefixed form instead of silently doubling it.
 */
const CANONICAL_API_PREFIXES: string[] = ['/app/v3/api', '/backend/v3/api'];

function requireNonEmpty(value: string | undefined, key: string): string {
  const normalized: string = value === undefined ? '' : value.trim();
  if (normalized.length === 0) {
    throw new Error('Harmony runtime config is missing ' + key);
  }
  return normalized;
}

/** Removes every trailing slash, which is the only base-URL rewrite allowed here. */
function stripTrailingSlashes(value: string): string {
  let normalized: string = value;
  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, normalized.length - 1);
  }
  return normalized;
}

/**
 * Validates one origin, or a semicolon-joined origin family.
 *
 * A `cloud` profile materializes the registered origin family
 * (`ENVIRONMENT_SPEC.md` section 5.1.0.1), so a single-origin assumption would
 * reject every cloud production document in this repository.
 */
function normalizeOriginFamily(value: string, key: string, schemes: string[]): string {
  const segments: string[] = requireNonEmpty(value, key).split(';');
  const normalized: string[] = [];
  for (const raw of segments) {
    const origin: string = stripTrailingSlashes(raw.trim());
    if (origin.length === 0) {
      throw new Error('Harmony runtime config ' + key + ' contains an empty origin');
    }
    const match: RegExpMatchArray | null = origin.match(/^([a-z][a-z0-9+.-]*):\/\/([^/\s]+)/u);
    if (match === null) {
      throw new Error('Harmony runtime config ' + key + ' must be an absolute origin, found ' + origin);
    }
    const scheme: string = match[1].toLowerCase();
    if (!schemes.includes(scheme)) {
      throw new Error(
        'Harmony runtime config ' + key + ' must use ' + schemes.join('/') + ', found ' + scheme,
      );
    }
    for (const prefix of CANONICAL_API_PREFIXES) {
      if (origin.endsWith(prefix)) {
        throw new Error(
          'Harmony runtime config ' + key + ' must be an origin without ' + prefix
          + ' (ENVIRONMENT_SPEC.md section 5.1.4.1)',
        );
      }
    }
    normalized.push(origin);
  }
  return normalized.join(';');
}

/**
 * Validates and normalizes one runtime document.
 *
 * Identity coherence is checked here as well as in the generator: the generator
 * guards the tracked JSON, while this guards whatever document bootstrap is handed
 * at runtime, and the two must not be able to disagree.
 */
export function createImHarmonyEnvironment(
  document: ImHarmonyRuntimeEnvDocument,
): ImHarmonyEnvironment {
  const environment: string = requireNonEmpty(document.environment, 'environment');
  const deploymentProfile: string = requireNonEmpty(document.deploymentProfile, 'deploymentProfile');
  const profileId: string = requireNonEmpty(document.profileId, 'profileId');
  const runtimeTarget: string = requireNonEmpty(document.runtimeTarget, 'runtimeTarget');
  if (runtimeTarget !== IM_HARMONY_RUNTIME_TARGET) {
    throw new Error(
      'Harmony runtime config runtimeTarget must be ' + IM_HARMONY_RUNTIME_TARGET
      + ', found ' + runtimeTarget,
    );
  }
  const expectedProfileId: string = deploymentProfile + '.' + environment;
  if (profileId !== expectedProfileId) {
    throw new Error(
      'Harmony runtime config profileId ' + profileId + ' does not match ' + expectedProfileId,
    );
  }

  const im: ImHarmonyImEndpoints = document.im;
  const appbase: ImHarmonyAppbaseEndpoints = document.appbase;
  if (im === undefined || appbase === undefined) {
    throw new Error('Harmony runtime config requires both im and appbase endpoint groups');
  }

  return {
    environment,
    deploymentProfile,
    profileId,
    runtimeTarget,
    imApiBaseUrl: normalizeOriginFamily(im.apiBaseUrl, 'im.apiBaseUrl', HTTP_SCHEMES),
    imPlatformApiGatewayHttpUrl: normalizeOriginFamily(
      im.platformApiGatewayHttpUrl,
      'im.platformApiGatewayHttpUrl',
      HTTP_SCHEMES,
    ),
    imApplicationPublicHttpUrl: normalizeOriginFamily(
      im.applicationPublicHttpUrl,
      'im.applicationPublicHttpUrl',
      HTTP_SCHEMES,
    ),
    imApplicationPublicWebsocketUrl: normalizeOriginFamily(
      im.applicationPublicWebsocketUrl,
      'im.applicationPublicWebsocketUrl',
      WEBSOCKET_SCHEMES,
    ),
    appbaseAppApiBaseUrl: normalizeOriginFamily(
      appbase.appApiBaseUrl,
      'appbase.appApiBaseUrl',
      HTTP_SCHEMES,
    ),
    appbaseLoginUrl: normalizeOriginFamily(appbase.loginUrl, 'appbase.loginUrl', HTTP_SCHEMES),
  };
}

/** Lists the profile ids packaged into this build, in stable order. */
export function listImHarmonyProfileIds(): string[] {
  return IM_HARMONY_RUNTIME_ENV_DOCUMENTS.map((document) => document.profileId);
}

/**
 * Selects a tracked runtime document.
 *
 * Selection is by value rather than by build-time code generation for the single
 * document: the HAP carries all ten so one artifact can be validated against every
 * profile, and an unknown profile id fails loudly instead of silently falling back
 * to development endpoints in a production build.
 */
export function selectImHarmonyRuntimeEnvDocument(
  profileId: string = IM_HARMONY_DEFAULT_PROFILE_ID,
): ImHarmonyRuntimeEnvDocument {
  const requested: string = requireNonEmpty(profileId, 'profileId');
  const found: ImHarmonyRuntimeEnvDocument | undefined = IM_HARMONY_RUNTIME_ENV_DOCUMENTS.find(
    (document) => document.profileId === requested,
  );
  if (found === undefined) {
    throw new Error(
      'Harmony runtime config has no profile ' + requested
      + '; packaged profiles: ' + listImHarmonyProfileIds().join(', '),
    );
  }
  return found;
}

/** Selects and validates in one step. */
export function resolveImHarmonyEnvironment(
  profileId: string = IM_HARMONY_DEFAULT_PROFILE_ID,
): ImHarmonyEnvironment {
  return createImHarmonyEnvironment(selectImHarmonyRuntimeEnvDocument(profileId));
}

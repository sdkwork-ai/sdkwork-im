/**
 * Runtime environment document contract.
 *
 * Authority: `ENVIRONMENT_SPEC.md` section 5.1.3 (native HarmonyOS tracks
 * `config/app/runtime-env.<profile-id>.json`) and section 5.1.2 (required
 * identity keys).
 *
 * The interfaces live in their own module with no imports so the generated
 * `generated/RuntimeConfig.ets` module and the validating `./Environment` module
 * can both depend on them without a cycle. `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md`
 * section 5 forbids cyclic dependencies, and a type-only cycle is exactly the kind
 * that survives review because nothing fails until a toolchain changes.
 */

/** Runtime target every document in this root must declare. */
export const IM_HARMONY_RUNTIME_TARGET: string = 'harmony-native';

/**
 * IM endpoints.
 *
 * Every value is an origin, or a semicolon-joined origin family for a `cloud`
 * profile (`ENVIRONMENT_SPEC.md` section 5.1.0.1). None carries a canonical API
 * path prefix: section 5.1.4.1 assigns prefix normalization to the generated SDK
 * transport layer, and the sibling Flutter and mini program roots materialize the
 * same bare origins.
 */
export interface ImHarmonyImEndpoints {
  readonly apiBaseUrl: string;
  readonly platformApiGatewayHttpUrl: string;
  readonly applicationPublicHttpUrl: string;
  readonly applicationPublicWebsocketUrl: string;
}

/** Appbase (IAM) endpoints. */
export interface ImHarmonyAppbaseEndpoints {
  readonly appApiBaseUrl: string;
  readonly loginUrl: string;
}

/** One tracked runtime document, as authored under `config/app/`. */
export interface ImHarmonyRuntimeEnvDocument {
  readonly environment: string;
  readonly deploymentProfile: string;
  readonly profileId: string;
  readonly runtimeTarget: string;
  readonly im: ImHarmonyImEndpoints;
  readonly appbase: ImHarmonyAppbaseEndpoints;
}

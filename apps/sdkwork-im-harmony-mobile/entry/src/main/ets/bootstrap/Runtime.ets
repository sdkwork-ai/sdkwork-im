/**
 * Root composition entry.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` sections 1 and 6. This
 * module assembles the environment, SDK clients, IAM runtime, host adapters, and
 * route registry. It must not own product business logic.
 *
 * The ability context is deliberately not a parameter. No host adapter in this
 * slice is context-backed — every platform-backed adapter reports `unsupported`
 * until the HarmonyOS toolkit and a concrete implementation land — and accepting an
 * unused context would advertise an integration that does not exist. The single
 * call site to change when one does is `createHostAdapters()`.
 */
import {
  IM_HARMONY_UNKNOWN_ERROR,
  resolveImHarmonyErrorMessage,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';
import { IM_HARMONY_DEFAULT_LOCALE } from '@sdkwork/sdkwork-im-harmony-mobile-commons';
import type { ImHarmonyRouteRegistration } from '@sdkwork/sdkwork-im-harmony-mobile-shell';

import {
  IM_HARMONY_DEFAULT_PROFILE_ID,
} from '../generated/RuntimeConfig';
import { resolveImHarmonyEnvironment, type ImHarmonyEnvironment } from './Environment';
import { registerImHarmonyHostAdapters } from './HostAdapters';
import { getImHarmonyIamRuntime, type ImHarmonyIamRuntime } from './IamRuntime';
import { createImHarmonyRoutes } from './Routes';
import {
  createImHarmonySdkClients,
  type ImHarmonySdkClients,
  type ImHarmonySdkWiringReport,
} from './SdkClients';

export interface ImHarmonyBootstrapOptions {
  /**
   * Runtime profile to bind.
   *
   * Defaults to the root's development profile. A production build supplies its own
   * id; an unknown id fails instead of silently falling back to development
   * endpoints, which is the failure mode a fallback would produce in the field.
   */
  readonly profileId?: string;
}

export interface ImHarmonyAppRuntime {
  readonly environment: ImHarmonyEnvironment;
  readonly routes: ImHarmonyRouteRegistration[];
  readonly routeCount: number;
  readonly iam: ImHarmonyIamRuntime;
  readonly sdk: ImHarmonySdkClients;
  readonly sdkWiring: ImHarmonySdkWiringReport;
}

let runtime: ImHarmonyAppRuntime | null = null;
let bootstrapError: string | null = null;

/**
 * Builds the application runtime.
 *
 * Throws on a configuration defect. The caller is `EntryAbility`, which records the
 * message so the root page can render it; swallowing it here would produce an app
 * that launches into a blank screen with no explanation.
 */
export function bootstrapImHarmonyApp(
  options: ImHarmonyBootstrapOptions = {},
): ImHarmonyAppRuntime {
  const profileId: string = options.profileId ?? IM_HARMONY_DEFAULT_PROFILE_ID;
  const environment: ImHarmonyEnvironment = resolveImHarmonyEnvironment(profileId);

  const sdk: ImHarmonySdkClients = createImHarmonySdkClients();
  sdk.initialize(environment);

  const routes: ImHarmonyRouteRegistration[] = createImHarmonyRoutes();
  registerImHarmonyHostAdapters();

  const assembled: ImHarmonyAppRuntime = {
    environment,
    routes,
    routeCount: routes.length,
    iam: getImHarmonyIamRuntime(),
    sdk,
    sdkWiring: sdk.describe(),
  };
  runtime = assembled;
  bootstrapError = null;
  return assembled;
}

export function getImHarmonyAppRuntime(): ImHarmonyAppRuntime | null {
  return runtime;
}

/** Records a bootstrap failure so the root page can render it. */
export function recordImHarmonyBootstrapFailure(error: unknown): string {
  const message: string = resolveImHarmonyErrorMessage(error);
  bootstrapError = message.length > 0 ? message : IM_HARMONY_UNKNOWN_ERROR;
  return bootstrapError;
}

export function getImHarmonyBootstrapError(): string | null {
  return bootstrapError;
}

export function resetImHarmonyAppRuntime(): void {
  runtime = null;
  bootstrapError = null;
}

/**
 * Resolves the display locale.
 *
 * PENDING PLATFORM WIRING: the device locale comes from the HarmonyOS
 * localization kit (`@kit.LocalizationKit`, `i18n.System.getSystemLanguage()`).
 * That call needs the DevEco toolchain to compile, so it is not shipped as
 * unverified code here; until it is wired, every screen renders the default
 * locale's fragment, which is a real two-locale catalog rather than a stub.
 */
export function resolveImHarmonyAppLocale(): string {
  return IM_HARMONY_DEFAULT_LOCALE;
}

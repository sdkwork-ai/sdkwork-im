/**
 * Host adapter registration.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 7. Feature packages
 * depend on the typed interfaces and never call HarmonyOS system APIs, global
 * ability context, direct want handling, or SDK singleton globals.
 */
import {
  createHostAdapters,
  type ImHarmonyHostAdapters,
} from '@sdkwork/sdkwork-im-harmony-mobile-host';

let hostAdapters: ImHarmonyHostAdapters | null = null;

export function registerImHarmonyHostAdapters(): ImHarmonyHostAdapters {
  hostAdapters = createHostAdapters();
  return hostAdapters;
}

export function getImHarmonyHostAdapters(): ImHarmonyHostAdapters {
  if (hostAdapters === null) {
    return registerImHarmonyHostAdapters();
  }
  return hostAdapters;
}

/**
 * Reports whether the device should be treated as offline.
 *
 * A result of `ok: false` means the adapter cannot tell, which is **not** the same
 * as offline. Treating "cannot tell" as offline would render the offline state on
 * every cold launch, and section 11 requires that state to be meaningful rather
 * than permanent.
 */
export async function readImHarmonyOffline(): Promise<boolean> {
  const result = await getImHarmonyHostAdapters().networkStatus.isOnline();
  if (!result.ok) {
    return false;
  }
  return result.value === false;
}

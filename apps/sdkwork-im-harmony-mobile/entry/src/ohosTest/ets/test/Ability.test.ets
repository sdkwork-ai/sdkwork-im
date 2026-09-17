import { describe, expect, it } from '@ohos/hypium';

import { listImHarmonyProfileIds, resolveImHarmonyEnvironment } from '../../../../main/ets/bootstrap/Environment';
import { createImHarmonyRoutes } from '../../../../main/ets/bootstrap/Routes';
import { IM_HARMONY_DEFAULT_PROFILE_ID } from '../../../../main/ets/generated/RuntimeConfig';

/**
 * HarmonyOS on-device contract test.
 *
 * Runs under `hvigor test` with the HarmonyOS SDK available, which is the only
 * environment where these modules can be evaluated at all. It asserts the same
 * properties the repository-level `node --test` suite asserts by reading source:
 * the two are deliberately redundant, because a source scan proves a value is
 * written down while this proves the built module actually produces it.
 */
export default function harmonyContractTest() {
  describe('SdkworkImHarmonyContract', () => {
    it('packages all ten runtime profiles', 0, () => {
      expect(listImHarmonyProfileIds().length).assertEqual(10);
    });

    it('resolves the default profile as harmony-native', 0, () => {
      const environment = resolveImHarmonyEnvironment(IM_HARMONY_DEFAULT_PROFILE_ID);
      expect(environment.runtimeTarget).assertEqual('harmony-native');
      expect(environment.profileId).assertEqual(IM_HARMONY_DEFAULT_PROFILE_ID);
    });

    it('keeps every base URL free of the canonical api prefix', 0, () => {
      for (const profileId of listImHarmonyProfileIds()) {
        const environment = resolveImHarmonyEnvironment(profileId);
        expect(environment.imApiBaseUrl.indexOf('/app/v3/api')).assertEqual(-1);
        expect(environment.appbaseAppApiBaseUrl.indexOf('/app/v3/api')).assertEqual(-1);
      }
    });

    it('registers a validated route registry', 0, () => {
      const routes = createImHarmonyRoutes();
      expect(routes.length).assertEqual(4);
    });
  });
}

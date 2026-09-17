import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';
import { hilog } from '@kit.PerformanceAnalysisKit';

import { bootstrapImHarmonyApp, recordImHarmonyBootstrapFailure } from '../bootstrap/Runtime';

const DOMAIN: number = 0x0000;
const TAG: string = 'SdkworkImEntry';

/**
 * HarmonyOS entry ability.
 *
 * This module stays thin by contract (`HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md`
 * section 1): it runs the composition bootstrap and loads the root page, nothing
 * else. Business pages live in capability packages.
 *
 * A failed bootstrap is logged and recorded rather than rethrown. Rethrowing from
 * `onCreate` kills the ability before any window exists, so the user sees the
 * launcher for a moment and then nothing — with no way to learn why. Recording it
 * lets the root page render the reason.
 */
export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(DOMAIN, TAG, 'onCreate');
    try {
      const runtime = bootstrapImHarmonyApp();
      hilog.info(
        DOMAIN,
        TAG,
        'bootstrap completed for profile %{public}s with %{public}d route(s)',
        runtime.environment.profileId,
        runtime.routeCount,
      );
      hilog.info(
        DOMAIN,
        TAG,
        'sdk wiring: im=%{public}s iam=%{public}s chatPort=%{public}s',
        String(runtime.sdkWiring.imAppSdkInitialized),
        String(runtime.sdkWiring.iamAppSdkInitialized),
        String(runtime.sdkWiring.chatSdkPortRegistered),
      );
    } catch (error) {
      const message: string = recordImHarmonyBootstrapFailure(error);
      hilog.error(DOMAIN, TAG, 'bootstrap failed: %{public}s', message);
    }
  }

  onDestroy(): void {
    hilog.info(DOMAIN, TAG, 'onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        hilog.error(DOMAIN, TAG, 'loadContent failed: %{public}s', JSON.stringify(err));
        return;
      }
      hilog.info(DOMAIN, TAG, 'loadContent succeeded');
    });
  }

  onWindowStageDestroy(): void {
    hilog.info(DOMAIN, TAG, 'onWindowStageDestroy');
  }

  onForeground(): void {
    hilog.info(DOMAIN, TAG, 'onForeground');
  }

  onBackground(): void {
    hilog.info(DOMAIN, TAG, 'onBackground');
  }
}

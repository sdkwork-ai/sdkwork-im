import { ImHarmonyTokens } from '../theme/DesignTokens';

/**
 * Domain-neutral empty/loading/error primitive.
 *
 * Capability pages mount this for every non-success state so the seven states
 * the architecture standard requires stay visually identical across screens.
 */
@Component
export struct ScreenStateView {
  @Prop status: string = 'loading';
  @Prop message: string = '';
  @Prop retryLabel: string = '';

  build() {
    Column() {
      Text(this.message)
        .fontSize(ImHarmonyTokens.fontSizeBody)
        .fontColor(ImHarmonyTokens.colorTextMuted)
        .textAlign(TextAlign.Center)
      if (this.status === 'error' || this.status === 'offline') {
        Text(this.retryLabel)
          .fontSize(ImHarmonyTokens.fontSizeBody)
          .fontColor(ImHarmonyTokens.colorPrimary)
          .margin({ top: ImHarmonyTokens.spacingMd })
      }
    }
    .width('100%')
    .padding(ImHarmonyTokens.spacingLg)
    .justifyContent(FlexAlign.Center)
  }
}

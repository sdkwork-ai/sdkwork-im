/**
 * Session screen mounted by the root page for the login route.
 */
import { ImHarmonyTokens } from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import { resolveImHarmonyShellMessage } from '../i18n';

@Component
export struct ImHarmonyLoginPage {
  @Prop locale: string = 'en-US';
  @Prop pending: boolean = false;
  @Prop errorMessage: string = '';

  build() {
    Column() {
      Text(resolveImHarmonyShellMessage(this.locale, 'common.session.login_title'))
        .fontSize(ImHarmonyTokens.fontSizeTitle)
        .fontWeight(FontWeight.Bold)
        .fontColor(ImHarmonyTokens.colorText)
      Text(resolveImHarmonyShellMessage(this.locale, 'common.session.login_description'))
        .fontSize(ImHarmonyTokens.fontSizeBody)
        .fontColor(ImHarmonyTokens.colorTextMuted)
        .textAlign(TextAlign.Center)
        .margin({ top: ImHarmonyTokens.spacingSm })
      if (this.errorMessage.length > 0) {
        Text(this.errorMessage)
          .fontSize(ImHarmonyTokens.fontSizeCaption)
          .fontColor(ImHarmonyTokens.colorDanger)
          .margin({ top: ImHarmonyTokens.spacingMd })
      }
      Text(this.pending
        ? resolveImHarmonyShellMessage(this.locale, 'common.session.login_pending')
        : resolveImHarmonyShellMessage(this.locale, 'common.session.login_action'))
        .fontSize(ImHarmonyTokens.fontSizeBody)
        .fontColor(ImHarmonyTokens.colorSurface)
        .backgroundColor(ImHarmonyTokens.colorPrimary)
        .borderRadius(ImHarmonyTokens.radiusMd)
        .padding(ImHarmonyTokens.spacingMd)
        .margin({ top: ImHarmonyTokens.spacingLg })
    }
    .width('100%')
    .height('100%')
    .padding(ImHarmonyTokens.spacingLg)
    .justifyContent(FlexAlign.Center)
  }
}

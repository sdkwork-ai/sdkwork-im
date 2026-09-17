/**
 * Domain-neutral design tokens.
 *
 * Authority: `APP_HARMONY_NATIVE_UI_SPEC.md`. Shared packages must not import
 * application app shells, and capability packages must not fork their own
 * palette, so the IM visual identity is declared once here.
 *
 * Values are HarmonyOS viewport units (vp): ArkTS layout dimensions are numbers,
 * unlike the mini program's `rpx` strings, so these tokens are not
 * interchangeable with `sdkwork-im-mp-commons` token values even where the
 * logical name matches.
 */
export class ImHarmonyTokens {
  /** SDKWork IM brand accent. */
  static readonly colorPrimary: string = '#12B7F5';
  static readonly colorBackground: string = '#F5F6F8';
  static readonly colorSurface: string = '#FFFFFF';
  /**
   * Elevated-but-muted surface, such as an incoming message bubble.
   *
   * Distinct from `colorBackground`: the page background and a component surface
   * are different roles, and collapsing them makes one of the two impossible to
   * restyle without moving the other.
   */
  static readonly colorSurfaceMuted: string = '#F2F3F5';
  static readonly colorText: string = '#181818';
  static readonly colorTextMuted: string = '#8A8A8A';
  static readonly colorDivider: string = '#EBEDF0';
  static readonly colorDanger: string = '#FA5151';
  static readonly colorUnreadBadge: string = '#FA5151';
  static readonly fontSizeTitle: number = 20;
  static readonly fontSizeBody: number = 16;
  static readonly fontSizeCaption: number = 13;
  static readonly spacingXs: number = 4;
  static readonly spacingSm: number = 8;
  static readonly spacingMd: number = 16;
  static readonly spacingLg: number = 24;
  static readonly radiusMd: number = 8;
}

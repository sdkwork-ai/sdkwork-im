/**
 * Domain-neutral design tokens for the IM mini program surface.
 *
 * Authority: `APP_MINI_PROGRAM_UI_SPEC.md`. Domain-neutral only; business
 * screens belong to capability packages. Values mirror the IM mobile surface
 * so the mini program reads as the same product as the H5 and Flutter clients.
 */
export const imMpTokens = {
  colorPrimary: "#0f766e",
  colorBackground: "#f5f5f5",
  colorSurface: "#ffffff",
  colorText: "#181818",
  colorTextMuted: "#888888",
  colorDanger: "#fa5151",
  colorDivider: "#ededed",
  spacingXs: "8rpx",
  spacingSm: "16rpx",
  spacingMd: "24rpx",
  spacingLg: "32rpx",
  radiusMd: "16rpx",
} as const;

export type ImMpTokens = typeof imMpTokens;

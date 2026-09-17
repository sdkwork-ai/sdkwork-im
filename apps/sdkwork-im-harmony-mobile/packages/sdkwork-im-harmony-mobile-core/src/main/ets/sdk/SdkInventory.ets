/**
 * SDK packages consumed by Harmony core.
 *
 * Authority: `specs/component.spec.json` `contracts.sdkDependencies`.
 */
export const imHarmonyCoreSdkInventory: string[] = [
  'sdkwork-im-sdk',
  'sdkwork-im-app-sdk',
  'sdkwork-iam-app-sdk',
];

export function listSdkworkCoreSdkInventory(): string[] {
  return imHarmonyCoreSdkInventory;
}

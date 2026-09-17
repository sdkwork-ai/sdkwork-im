/**
 * Host adapter capability registry.
 *
 * Renderer/feature code routes through the declared capability set; direct
 * platform branches on HarmonyOS globals are forbidden by
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 7.
 *
 * The registry is static metadata: it must stay readable without constructing an
 * adapter, so a feature can ask "is clipboard available on this host?" during
 * render without touching the platform.
 */
export const imHarmonyHostCapabilities: string[] = [
  'secureStorage',
  'networkStatus',
  'appLifecycle',
  'deepLinks',
  'filePicker',
  'pushNotifications',
  'clipboard',
  'deviceInfo',
];

export function hasImHarmonyHostCapability(capability: string): boolean {
  return imHarmonyHostCapabilities.includes(capability);
}

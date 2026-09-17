/**
 * Host adapter capability registry.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8. Feature code
 * routes through the declared capability set or a shared capability helper;
 * hand-written branches on WeChat globals are forbidden.
 */

export const imMpHostCapabilities = [
  "platformLogin",
  "secureStorage",
  "networkStatus",
  "appLifecycle",
  "deepLinksOrScene",
  "mediaPicker",
  "share",
  "clipboard",
  "deviceInfo",
] as const;

export type ImMpHostCapability = (typeof imMpHostCapabilities)[number];

export function hasImMpHostCapability(capability: string): boolean {
  return (imMpHostCapabilities as readonly string[]).includes(capability);
}

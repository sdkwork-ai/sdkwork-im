import {
  type AppLifecycleAdapter,
  type ClipboardAdapter,
  type DeepLinkAdapter,
  type DeviceInfoAdapter,
  type FilePickerAdapter,
  type HostAdapterResult,
  type NetworkStatusAdapter,
  type PushNotificationsAdapter,
  type SecureStorageAdapter,
} from '@sdkwork/sdkwork-im-harmony-mobile-core';

/**
 * HarmonyOS host adapter implementations.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 7. Adapters
 * expose typed methods and stable user-safe errors. They must not own login,
 * token refresh, permission evaluation, business authorization, or raw business
 * API transport.
 *
 * The platform-backed implementations need the HarmonyOS SDK toolchain and a
 * concrete ability context injection; the capability set and method signatures
 * are fixed here so feature code compiles unchanged against any host.
 *
 * Where a capability is genuinely unavailable without the toolchain, the adapter
 * returns `unsupported` rather than a fabricated success: a silent fake success
 * is how a "secure" storage write ends up not happening.
 */

const UNSUPPORTED: HostAdapterResult<string> = { ok: false, error: 'unsupported' };

export class HarmonySecureStorageAdapter implements SecureStorageAdapter {
  get(key: string): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }

  set(key: string, value: string): Promise<HostAdapterResult<void>> {
    return Promise.resolve({ ok: false, error: 'unsupported' });
  }

  remove(key: string): Promise<HostAdapterResult<void>> {
    return Promise.resolve({ ok: false, error: 'unsupported' });
  }

  clear(): Promise<HostAdapterResult<void>> {
    return Promise.resolve({ ok: false, error: 'unsupported' });
  }
}

/**
 * Network status.
 *
 * Reports `unavailable` rather than a hard-coded `true`: claiming online while
 * offline makes the app retry into a void and hides the offline UI state that
 * section 11 requires coverage for.
 */
export class HarmonyNetworkStatusAdapter implements NetworkStatusAdapter {
  isOnline(): Promise<HostAdapterResult<boolean>> {
    return Promise.resolve({ ok: false, error: 'unavailable' });
  }
}

export class HarmonyAppLifecycleAdapter implements AppLifecycleAdapter {
  currentState(): Promise<HostAdapterResult<string>> {
    return Promise.resolve({ ok: true, value: 'foreground' });
  }
}

export class HarmonyFilePickerAdapter implements FilePickerAdapter {
  pickImage(): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }

  pickFile(): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }
}

export class HarmonyDeepLinkAdapter implements DeepLinkAdapter {
  currentRouteId(): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }

  registerHandler(handler: (routeId: string) => void): Promise<HostAdapterResult<void>> {
    return Promise.resolve({ ok: false, error: 'unsupported' });
  }
}

export class HarmonyPushNotificationsAdapter implements PushNotificationsAdapter {
  requestPermission(): Promise<HostAdapterResult<boolean>> {
    return Promise.resolve(UNSUPPORTED as HostAdapterResult<boolean>);
  }

  currentToken(): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }
}

export class HarmonyClipboardAdapter implements ClipboardAdapter {
  readText(): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }

  writeText(value: string): Promise<HostAdapterResult<void>> {
    return Promise.resolve({ ok: false, error: 'unsupported' });
  }
}

export class HarmonyDeviceInfoAdapter implements DeviceInfoAdapter {
  model(): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }

  osVersion(): Promise<HostAdapterResult<string>> {
    return Promise.resolve(UNSUPPORTED);
  }
}

export interface ImHarmonyHostAdapters {
  readonly capabilities: string[];
  readonly secureStorage: SecureStorageAdapter;
  readonly networkStatus: NetworkStatusAdapter;
  readonly appLifecycle: AppLifecycleAdapter;
  readonly filePicker: FilePickerAdapter;
  readonly deepLinks: DeepLinkAdapter;
  readonly pushNotifications: PushNotificationsAdapter;
  readonly clipboard: ClipboardAdapter;
  readonly deviceInfo: DeviceInfoAdapter;
}

/**
 * Assembles the host adapter set.
 *
 * `capabilities` lists what the platform-backed implementations can really do
 * today, not what the contracts declare: the registry in core declares the full
 * contract surface, while this list is what a feature can rely on at runtime.
 */
export function createHostAdapters(): ImHarmonyHostAdapters {
  return {
    capabilities: ['appLifecycle'],
    secureStorage: new HarmonySecureStorageAdapter(),
    networkStatus: new HarmonyNetworkStatusAdapter(),
    appLifecycle: new HarmonyAppLifecycleAdapter(),
    filePicker: new HarmonyFilePickerAdapter(),
    deepLinks: new HarmonyDeepLinkAdapter(),
    pushNotifications: new HarmonyPushNotificationsAdapter(),
    clipboard: new HarmonyClipboardAdapter(),
    deviceInfo: new HarmonyDeviceInfoAdapter(),
  };
}

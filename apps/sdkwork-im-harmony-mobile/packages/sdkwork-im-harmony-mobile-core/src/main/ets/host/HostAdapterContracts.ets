/**
 * Host adapter contracts owned by core and implemented by the host package.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 7. Host adapters
 * expose typed methods and stable user-safe errors only; feature packages depend
 * on these interfaces and never call HarmonyOS system APIs directly.
 */

export type HostAdapterError =
  | 'unsupported'
  | 'permission-denied'
  | 'unavailable'
  | 'cancelled'
  | 'invalid-state';

export interface HostAdapterResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly error?: HostAdapterError;
}

export interface SecureStorageAdapter {
  get(key: string): Promise<HostAdapterResult<string>>;
  set(key: string, value: string): Promise<HostAdapterResult<void>>;
  remove(key: string): Promise<HostAdapterResult<void>>;
  clear(): Promise<HostAdapterResult<void>>;
}

export interface NetworkStatusAdapter {
  isOnline(): Promise<HostAdapterResult<boolean>>;
}

export interface AppLifecycleAdapter {
  currentState(): Promise<HostAdapterResult<string>>;
}

/**
 * Files/media picking and capture.
 *
 * The adapter returns a local handle only; Drive/storage lifecycle stays with
 * the Drive app SDK per section 7, so this contract deliberately has no upload
 * method.
 */
export interface FilePickerAdapter {
  pickImage(): Promise<HostAdapterResult<string>>;
  pickFile(): Promise<HostAdapterResult<string>>;
}

/**
 * Deep-link / want intake.
 *
 * Section 7 requires scheme, host, path, state, nonce, and expiry validation
 * before a sensitive flow completes, so the adapter reports a validated route id
 * rather than a raw want.
 */
export interface DeepLinkAdapter {
  currentRouteId(): Promise<HostAdapterResult<string>>;
  registerHandler(handler: (routeId: string) => void): Promise<HostAdapterResult<void>>;
}

/**
 * Push notification token facts.
 *
 * Section 7: token registration is an app-api workflow. The adapter only obtains
 * the platform token fact and the permission state.
 */
export interface PushNotificationsAdapter {
  requestPermission(): Promise<HostAdapterResult<boolean>>;
  currentToken(): Promise<HostAdapterResult<string>>;
}

export interface ClipboardAdapter {
  readText(): Promise<HostAdapterResult<string>>;
  writeText(value: string): Promise<HostAdapterResult<void>>;
}

export interface DeviceInfoAdapter {
  model(): Promise<HostAdapterResult<string>>;
  osVersion(): Promise<HostAdapterResult<string>>;
}

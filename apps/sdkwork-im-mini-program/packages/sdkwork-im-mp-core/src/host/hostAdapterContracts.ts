/**
 * Host adapter contracts for the IM mini program surface.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8. Feature
 * packages depend on these typed contracts only and never call `wx.*`,
 * `my.*`, `dd.*`, or `tt.*` platform globals directly.
 *
 * Adapter methods normalize platform-specific failures into the stable
 * SDKWork host errors below.
 */
export type ImMpHostAdapterError =
  | "unsupported"
  | "permission-denied"
  | "unavailable"
  | "cancelled"
  | "invalid-state";

export interface ImMpHostAdapterResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly error?: ImMpHostAdapterError;
}

export interface ImMpSecureStorageAdapter {
  get(key: string): Promise<ImMpHostAdapterResult<string>>;
  set(key: string, value: string): Promise<ImMpHostAdapterResult<void>>;
  remove(key: string): Promise<ImMpHostAdapterResult<void>>;
  clear(): Promise<ImMpHostAdapterResult<void>>;
}

export interface ImMpPlatformLoginAdapter {
  /** Platform login code for exchange through an approved app-api flow. */
  login(): Promise<ImMpHostAdapterResult<string>>;
}

/** Ranged byte source for one picked image; platform-agnostic by design. */
export interface ImMpPickedImageSourceContract {
  readonly size: number;
  readonly name?: string;
  readonly type?: string;
  readRange(offsetBytes: number, lengthBytes: number): Promise<ArrayBuffer>;
}

export interface ImMpMediaAdapterContract {
  /** Picks one chat image; resolves cancelled/unavailable through the result. */
  chooseChatImage(): Promise<ImMpHostAdapterResult<ImMpPickedImageSourceContract>>;
}

export interface ImMpHostAdapters {
  readonly capabilities: readonly string[];
  readonly secureStorage: ImMpSecureStorageAdapter;
  readonly platformLogin: ImMpPlatformLoginAdapter;
  readonly media?: ImMpMediaAdapterContract;
}

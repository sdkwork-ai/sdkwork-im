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

export interface ImMpHostAdapters {
  readonly capabilities: readonly string[];
  readonly secureStorage: ImMpSecureStorageAdapter;
  readonly platformLogin: ImMpPlatformLoginAdapter;
}

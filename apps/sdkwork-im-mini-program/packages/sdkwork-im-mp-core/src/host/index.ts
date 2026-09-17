/**
 * Host adapter contracts owned by `mp-core` and implemented by `mp-host`.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8. This subpath
 * exists so feature packages can depend on the contract surface without
 * importing platform implementations. Concrete `wx.*` adapters live in
 * `@sdkwork/im-mp-host`.
 */
export type {
  ImMpHostAdapterError,
  ImMpHostAdapterResult,
  ImMpHostAdapters,
  ImMpSecureStorageAdapter,
  ImMpPlatformLoginAdapter,
} from "./hostAdapterContracts";

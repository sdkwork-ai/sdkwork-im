/// <reference types="miniprogram-api-typings" />

/**
 * WeChat storage adapter for the IM mini program session store.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 (session and
 * credential persistence) and section 8 (feature/core packages must not call
 * `wx.*` directly). `mp-core` owns the session semantics; this package owns the
 * only place that touches `wx.setStorageSync` / `wx.getStorageSync`.
 *
 * The WeChat storage API returns `any` on read and throws on quota/JSON errors,
 * so every read is normalized to `string | null` and every failure degrades to
 * "no session" rather than propagating into bootstrap.
 */

import type { ImMpSessionStorage } from "@sdkwork/im-mp-core/session";

export interface WxStorageApi {
  getStorageSync(key: string): unknown;
  setStorageSync(key: string, value: string): void;
  removeStorageSync(key: string): void;
}

/** Reads the WeChat storage API off the runtime global. */
export function readWeixinStorageApi(): WxStorageApi {
  const candidate = (globalThis as { wx?: Partial<WxStorageApi> }).wx;
  if (
    !candidate
    || typeof candidate.getStorageSync !== "function"
    || typeof candidate.setStorageSync !== "function"
    || typeof candidate.removeStorageSync !== "function"
  ) {
    throw new Error("WeChat mini program synchronous storage is unavailable");
  }
  return candidate as WxStorageApi;
}

/**
 * Creates the session storage adapter from an explicit storage API.
 *
 * Taking the API as an argument keeps the adapter unit-testable without a
 * WeChat runtime and keeps `globalThis.wx` reads in one function.
 */
export function createWeixinSessionStorage(
  storage: WxStorageApi,
): ImMpSessionStorage {
  return {
    read(key: string): string | null {
      try {
        const value = storage.getStorageSync(key);
        return typeof value === "string" && value.length > 0 ? value : null;
      } catch {
        // Unreadable storage is treated as "no session"; the login flow then
        // runs instead of the app crashing on launch.
        return null;
      }
    },
    write(key: string, value: string): void {
      storage.setStorageSync(key, value);
    },
    remove(key: string): void {
      try {
        storage.removeStorageSync(key);
      } catch {
        // A failed clear must not strand the caller mid-logout; the in-memory
        // session is already cleared by `clearImMpSession`.
      }
    },
  };
}

/** Convenience wrapper reading `globalThis.wx` for the root bootstrap. */
export function createWeixinSessionStorageFromGlobal(): ImMpSessionStorage {
  return createWeixinSessionStorage(readWeixinStorageApi());
}

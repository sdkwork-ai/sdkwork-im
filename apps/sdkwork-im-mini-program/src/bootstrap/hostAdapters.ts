/// <reference types="miniprogram-api-typings" />

/**
 * Host adapter registration for the IM mini program bootstrap.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8. This is the one
 * place in the application root that reaches for `wx.*`; every adapter is
 * created in `@sdkwork/im-mp-host` and injected outward from here.
 *
 * Registration order matters and is enforced by this function:
 * 1. `fetch` must exist before any generated SDK performs a request;
 * 2. session storage must be registered before the persisted session is read,
 *    otherwise a cold launch looks signed-out and re-triggers login.
 */

import type { ImWebSocketFactory } from "@sdkwork/im-sdk";

import {
  createWeixinNavigationAdapterFromGlobal,
  createWeixinSessionStorageFromGlobal,
  createWeixinSocketFactory,
  installWeixinFetch,
  readWeixinLanguageFromGlobal,
  readWeixinSocketApi,
  type ImMpNavigationAdapter,
  type ImMpSocketDiagnostics,
} from "@sdkwork/im-mp-host";
import { configureImMpSessionStorage } from "@sdkwork/im-mp-core/session";

export interface ImMpHostAdapters {
  readonly navigation: ImMpNavigationAdapter;
  readonly socketFactory: ImWebSocketFactory;
  readonly socketDiagnostics: ImMpSocketDiagnostics;
  /** `true` when this call installed the `fetch` polyfill. */
  readonly fetchInstalled: boolean;
  readonly hostLanguage?: string;
}

let registered: ImMpHostAdapters | null = null;

/**
 * Registers every platform adapter and returns the handles bootstrap needs.
 *
 * Idempotent: `app.js` may run more than once per WeChat session (a relaunch
 * re-executes it), and re-registering must not reset the session store or open
 * a second `fetch` shim.
 */
export function registerImMpHostAdapters(): ImMpHostAdapters {
  if (registered) {
    return registered;
  }

  const fetchInstalled = installWeixinFetch();

  configureImMpSessionStorage(createWeixinSessionStorageFromGlobal());

  const socketDiagnostics: ImMpSocketDiagnostics = { opened: 0 };
  const socketFactory = createWeixinSocketFactory(readWeixinSocketApi(), socketDiagnostics);

  const hostLanguage = readWeixinLanguageFromGlobal();

  registered = {
    navigation: createWeixinNavigationAdapterFromGlobal(),
    socketFactory,
    socketDiagnostics,
    fetchInstalled,
    ...(hostLanguage ? { hostLanguage } : {}),
  };
  return registered;
}

/** Test/runtime accessor; throws when registration has not run. */
export function getImMpHostAdapters(): ImMpHostAdapters {
  if (!registered) {
    throw new Error("Mini program host adapters must be registered before use");
  }
  return registered;
}

/** Clears the registration; used by tests and by a full teardown. */
export function resetImMpHostAdapters(): void {
  registered = null;
}

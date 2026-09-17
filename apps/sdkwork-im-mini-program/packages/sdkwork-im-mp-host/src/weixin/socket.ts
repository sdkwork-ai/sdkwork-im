/// <reference types="miniprogram-api-typings" />

/**
 * `ImWebSocketLike` adapter over `wx.connectSocket`.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8 and
 * `APP_SDK_INTEGRATION_SPEC.md`. The IM SDK drives its CCP realtime state
 * machine through an injected `webSocketFactory`; the WeChat runtime has no
 * global `WebSocket` that satisfies that contract, so without this adapter
 * `client.connect()` throws
 * `IM websocket transport is unavailable; provide ImSdkClientOptions.webSocketFactory.`
 *
 * This adapter is the honest fix for that: it maps `wx.connectSocket`'s
 * task/callback API onto the `readyState` + `addEventListener` shape the SDK
 * expects, and it never pretends the socket is open before `onOpen` fires.
 *
 * Contract details that matter:
 * - `readyState` must track the WeChat task lifecycle, because the SDK polls it
 *   when deciding whether a connect attempt is still in flight.
 * - `@sdkwork/im-sdk` only registers `open`/`close`/`error`/`message` handlers,
 *   so the adapter keeps one listener set per event name.
 * - `headers` are passed through as `wx.connectSocket`'s `header`; WeChat strips
 *   them unless the domain is whitelisted, so the mini program admin console
 *   must register the gateway origin as a socket domain.
 */

import type { ImWebSocketFactory, ImWebSocketLike } from "@sdkwork/im-sdk";

/** WebSocket readyState values, matching the browser constants. */
const SOCKET_CONNECTING = 0;
const SOCKET_OPEN = 1;
const SOCKET_CLOSING = 2;
const SOCKET_CLOSED = 3;

export interface WxSocketTask {
  send(options: { data: string | ArrayBuffer }): void;
  close(options?: { code?: number; reason?: string }): void;
  onOpen(listener: () => void): void;
  onClose(listener: (result: { code: number; reason: string }) => void): void;
  onError(listener: (result: { errMsg: string }) => void): void;
  onMessage(listener: (result: { data: string | ArrayBuffer }) => void): void;
}

export interface WxConnectSocketOptions {
  url: string;
  header?: Record<string, string>;
  protocols?: string[];
}

export interface WxSocketApi {
  connectSocket(options: WxConnectSocketOptions): WxSocketTask;
}

export interface ImMpSocketDiagnostics {
  /** Number of sockets opened since bootstrap; exposed for tests and logs. */
  opened: number;
  /** Last transport error message reported by `wx.connectSocket`. */
  lastError?: string;
}

/**
 * Adapts one `wx.connectSocket` task to `ImWebSocketLike`.
 *
 * Exported for direct unit testing: the WeChat task is the only platform
 * dependency, and it is injected rather than read from `globalThis`.
 */
export function createWeixinSocketAdapter(
  task: WxSocketTask,
  diagnostics?: ImMpSocketDiagnostics,
): ImWebSocketLike {
  const openHandlers = new Set<(event: unknown) => void>();
  const closeHandlers = new Set<(event: unknown) => void>();
  const errorHandlers = new Set<(event: unknown) => void>();
  const messageHandlers = new Set<(event: unknown) => void>();

  let readyState = SOCKET_CONNECTING;
  let closeDispatched = false;

  task.onOpen(() => {
    readyState = SOCKET_OPEN;
    for (const handler of [...openHandlers]) {
      handler({ type: "open" });
    }
  });

  task.onMessage((result) => {
    if (readyState !== SOCKET_OPEN) {
      return;
    }
    for (const handler of [...messageHandlers]) {
      handler({ data: result.data });
    }
  });

  task.onError((result) => {
    const message = result.errMsg || "wx.connectSocket failed";
    if (diagnostics) {
      diagnostics.lastError = message;
    }
    for (const handler of [...errorHandlers]) {
      handler(new Error(message));
    }
  });

  task.onClose((result) => {
    readyState = SOCKET_CLOSED;
    if (closeDispatched) {
      return;
    }
    closeDispatched = true;
    for (const handler of [...closeHandlers]) {
      handler({
        code: result.code,
        reason: result.reason,
        wasClean: result.code === 1000,
      });
    }
  });

  return {
    get readyState(): number {
      return readyState;
    },
    addEventListener(type, handler): void {
      if (type === "open") {
        openHandlers.add(handler);
        // The WeChat task registers its own `onOpen` before this adapter can be
        // returned, so a socket that opened first must be replayed or the SDK
        // waits forever for an `open` event that already happened.
        if (readyState === SOCKET_OPEN) {
          handler({ type: "open" });
        }
        return;
      }
      if (type === "message") {
        messageHandlers.add(handler);
        return;
      }
      if (type === "error") {
        errorHandlers.add(handler);
        return;
      }
      closeHandlers.add(handler);
      if (readyState === SOCKET_CLOSED) {
        handler({ code: 1000, reason: "socket_already_closed", wasClean: true });
      }
    },
    close(code?: number, reason?: string): void {
      if (readyState === SOCKET_CLOSED || readyState === SOCKET_CLOSING) {
        return;
      }
      readyState = SOCKET_CLOSING;
      const options: { code?: number; reason?: string } = {};
      if (typeof code === "number") {
        options.code = code;
      }
      if (typeof reason === "string") {
        options.reason = reason;
      }
      task.close(Object.keys(options).length > 0 ? options : undefined);
    },
    send(value: string): void {
      if (readyState !== SOCKET_OPEN) {
        throw new Error("Cannot send on a WeChat socket that is not open");
      }
      task.send({ data: value });
    },
  };
}

/**
 * Creates the `ImWebSocketFactory` the IM SDK accepts.
 *
 * `diagnostics` is optional and mutation-visible so bootstrap and tests can
 * assert that realtime was actually attempted, rather than assuming it works.
 */
export function createWeixinSocketFactory(
  socket: WxSocketApi,
  diagnostics: ImMpSocketDiagnostics = { opened: 0 },
): ImWebSocketFactory {
  return (url, options): ImWebSocketLike => {
    const connectOptions: WxConnectSocketOptions = { url };
    if (Object.keys(options.headers).length > 0) {
      connectOptions.header = options.headers;
    }
    if (options.protocols.length > 0) {
      connectOptions.protocols = options.protocols;
    }
    const task = socket.connectSocket(connectOptions);
    diagnostics.opened += 1;
    return createWeixinSocketAdapter(task, diagnostics);
  };
}

/** Reads the WeChat socket API off the runtime global. */
export function readWeixinSocketApi(): WxSocketApi {
  const candidate = (globalThis as { wx?: Partial<WxSocketApi> }).wx;
  if (!candidate || typeof candidate.connectSocket !== "function") {
    throw new Error("WeChat wx.connectSocket is unavailable");
  }
  return candidate as WxSocketApi;
}

/** Convenience wrapper reading `globalThis.wx` for the root bootstrap. */
export function createWeixinSocketFactoryFromGlobal(
  diagnostics?: ImMpSocketDiagnostics,
): ImWebSocketFactory {
  return createWeixinSocketFactory(readWeixinSocketApi(), diagnostics);
}

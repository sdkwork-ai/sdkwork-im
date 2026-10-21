import { configureImPcEmbedEnvironment } from '@sdkwork/im-pc-core/sdk/embedHost';
import {
  applyImPcEmbedSession,
  detachImPcEmbedSession,
  type SdkworkChatSession,
} from '@sdkwork/im-pc-core/sdk/session';
import {
  getImSdkClientWithSession,
  resetImSdkClient,
} from '@sdkwork/im-pc-core/sdk/imSdkClient';
import { disposePcLiveConnection } from '@sdkwork/im-pc-core/sdk/pcRealtimeConnectionManager';

/** Session envelope an embedding host hands to the IM runtime. */
export type ImPcEmbedSession = SdkworkChatSession;

/** Host-provided facts an embedded IM runtime cannot read from its own launch config. */
export interface ImPcEmbedOptions {
  /** SDKWork API gateway origin serving `/im/v3/api`. */
  apiBaseUrl: string;
  /** Realtime origin; derived from {@link apiBaseUrl} when omitted. */
  websocketBaseUrl?: string;
  /** Host-authenticated session; null renders the surfaces signed out. */
  session: ImPcEmbedSession | null;
}

/** Lifecycle handle for one embedded runtime. */
export interface ImPcEmbedRuntime {
  /** Restore host-neutral state: sign the runtime out and drop the overrides. */
  dispose(): void;
  /**
   * First host-fact or SDK initialization failure, or null when the runtime is
   * healthy. The surfaces still mount with this error so the host can show its
   * own product shell and report the failure as a transient notice.
   */
  readonly error: ImPcEmbedInitError | null;
}

/** Failure class for a host that cannot establish an embedded IM runtime. */
export type ImPcEmbedInitErrorCode =
  | 'im-embed-invalid-api-base-url'
  | 'im-embed-invalid-websocket-base-url'
  | 'im-embed-invalid-session'
  | 'im-embed-sdk-init-failed';

/** Typed initialization failure so the host can name the broken input. */
export class ImPcEmbedInitError extends Error {
  readonly code: ImPcEmbedInitErrorCode;

  /** @param code stable failure code. @param message host-readable detail. */
  constructor(code: ImPcEmbedInitErrorCode, message: string) {
    super(message);
    this.name = 'ImPcEmbedInitError';
    this.code = code;
  }
}

/**
 * Whether the host can serve an HTTP-shaped API through this scheme. Besides
 * http(s), an embedding desktop shell may expose the SDKWork API on its own
 * origin (for example `dsh-app://app`), where its main process proxies the
 * request to the gateway and the renderer never runs a CORS check.
 * @param protocol parsed URL protocol.
 * @returns true for http(s) and app-style schemes.
 */
function isReachableApiProtocol(protocol: string): boolean {
  if (protocol === 'http:' || protocol === 'https:') {
    return true;
  }
  return protocol === 'app:' || /^[a-z][a-z0-9+.-]*-app:$/u.test(protocol);
}

/**
 * Validate a gateway origin without throwing.
 * @param value candidate origin.
 * @param code failure code to record.
 * @param label field name for the message.
 * @returns the normalized origin, or the failure when it is unusable.
 */
function parseApiOrigin(
  value: string,
  code: ImPcEmbedInitErrorCode,
  label: string,
): { origin: string } | { error: ImPcEmbedInitError } {
  const trimmed = value.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { error: new ImPcEmbedInitError(code, `${label} must be an absolute URL; received "${value}".`) };
  }
  if (!isReachableApiProtocol(parsed.protocol)) {
    return {
      error: new ImPcEmbedInitError(
        code,
        `${label} must be an http(s) or application origin; received "${value}".`,
      ),
    };
  }
  return { origin: trimmed };
}

/**
 * Validate a realtime origin without throwing.
 * @param value candidate origin.
 * @returns the normalized origin, or the failure when it is unusable.
 */
function parseWebSocketOrigin(value: string): { origin: string } | { error: ImPcEmbedInitError } {
  const trimmed = value.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      error: new ImPcEmbedInitError(
        'im-embed-invalid-websocket-base-url',
        `websocketBaseUrl must be an absolute ws(s) URL; received "${value}".`,
      ),
    };
  }
  if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
    return {
      error: new ImPcEmbedInitError(
        'im-embed-invalid-websocket-base-url',
        `websocketBaseUrl must use ws or wss; received "${value}".`,
      ),
    };
  }
  return { origin: trimmed };
}

/**
 * Whether the session can authenticate the IM transport.
 * @param session host-authenticated session.
 * @returns true when both tokens are present.
 */
function sessionIsAuthenticated(session: ImPcEmbedSession): boolean {
  return Boolean(session.accessToken?.trim() && session.authToken?.trim());
}

/**
 * Install the host environment and session the IM PC surfaces run against, and
 * initialize the IM SDK client once so configuration failures surface early.
 *
 * Initialization never throws: a host fact the IM runtime cannot use is
 * recorded on the returned handle so the bundle can still render the product
 * shell and report the failure as a transient notice. A runtime that cannot
 * reach the gateway must not blank the interface the user is opening.
 *
 * The SDK client construction is offline: the realtime WebSocket connects lazily
 * when a mounted surface subscribes, and {@link ImPcEmbedRuntime.dispose} closes
 * that shared connection before dropping the overrides.
 *
 * The runtime reads both facts from module-level overrides, so exactly one
 * embedded IM runtime is supported per browser window — the same constraint the
 * standalone IM PC application has.
 * @param options host endpoints and authenticated session.
 * @returns the lifecycle handle owning the installed overrides and any error.
 */
export function configureImPcEmbedRuntime(options: ImPcEmbedOptions): ImPcEmbedRuntime {
  let error: ImPcEmbedInitError | null = null;
  const parsedApi = parseApiOrigin(options.apiBaseUrl, 'im-embed-invalid-api-base-url', 'apiBaseUrl');
  if ('error' in parsedApi) {
    error = parsedApi.error;
    configureImPcEmbedEnvironment(null);
  } else {
    const parsedWebSocket = options.websocketBaseUrl === undefined
      ? undefined
      : parseWebSocketOrigin(options.websocketBaseUrl);
    if (parsedWebSocket !== undefined && 'error' in parsedWebSocket) {
      error = parsedWebSocket.error;
      configureImPcEmbedEnvironment(null);
    } else {
      configureImPcEmbedEnvironment({
        apiBaseUrl: parsedApi.origin,
        ...(parsedWebSocket === undefined ? {} : { websocketBaseUrl: parsedWebSocket.origin }),
      });
    }
  }

  if (options.session !== null && sessionIsAuthenticated(options.session)) {
    try {
      applyImPcEmbedSession(options.session);
    } catch (cause) {
      error ??= new ImPcEmbedInitError(
        'im-embed-invalid-session',
        `SDKWork IM session could not be applied: ${cause instanceof Error ? cause.message : String(cause)}`,
      );
    }
  } else {
    if (options.session !== null) {
      error ??= new ImPcEmbedInitError(
        'im-embed-invalid-session',
        'The host session must carry both accessToken and authToken for the IM SDK.',
      );
    }
    applyImPcEmbedSession(null);
  }

  if (error === null && options.session !== null) {
    try {
      // Constructing the client validates the resolved endpoints, token manager,
      // and session key without opening a socket.
      getImSdkClientWithSession(options.session);
    } catch (cause) {
      error = new ImPcEmbedInitError(
        'im-embed-sdk-init-failed',
        `SDKWork IM SDK initialization failed: ${cause instanceof Error ? cause.message : String(cause)}`,
      );
    }
  }

  let disposed = false;
  return {
    error,
    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      disposePcLiveConnection('im embed runtime disposed');
      resetImSdkClient();
      applyImPcEmbedSession(null);
      detachImPcEmbedSession();
      configureImPcEmbedEnvironment(null);
    },
  };
}

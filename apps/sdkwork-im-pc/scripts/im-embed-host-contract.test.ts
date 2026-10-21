/**
 * Embedding contract: the host-installed environment and session must take
 * precedence over IM's launch configuration and persisted session, the runtime
 * must initialize the IM SDK once with a typed failure for bad host facts, and
 * disposal must restore standalone behavior and drop the realtime connection.
 */
import assert from 'node:assert/strict';
import {
  configureImPcEmbedEnvironment,
  isImPcEmbedded,
  readImPcEmbedEnvironment,
  readImPcEmbedSession,
} from '../packages/sdkwork-im-pc-core/src/sdk/embedHost.ts';
import {
  resolveImApiBaseUrl,
  resolveImWebSocketBaseUrl,
} from '../packages/sdkwork-im-pc-core/src/sdk/sdkBaseUrls.ts';
import {
  applyImPcEmbedSession,
  detachImPcEmbedSession,
  persistAppSdkSessionTokens,
  readAppSdkSessionTokens,
} from '../packages/sdkwork-im-pc-core/src/sdk/session.ts';
import {
  configureImPcEmbedRuntime,
  ImPcEmbedInitError,
} from '../packages/sdkwork-im-pc-embed/src/runtime.ts';
import { getPcLiveConnectionStatus } from '../packages/sdkwork-im-pc-core/src/sdk/pcRealtimeConnectionManager.ts';

configureImPcEmbedEnvironment({
  apiBaseUrl: 'https://im.example.test',
  websocketBaseUrl: 'wss://im.example.test/ws',
});
assert.equal(readImPcEmbedEnvironment()?.apiBaseUrl, 'https://im.example.test');
assert.equal(resolveImApiBaseUrl(), 'https://im.example.test');
assert.equal(resolveImWebSocketBaseUrl(), 'wss://im.example.test/ws');
assert.equal(isImPcEmbedded(), true);

// A host that names only the HTTP origin gets the realtime origin derived from it.
configureImPcEmbedEnvironment({ apiBaseUrl: 'https://im.example.test' });
const derived = resolveImWebSocketBaseUrl();
assert.ok(derived !== undefined, 'websocket origin must be derived from the host HTTP origin');
assert.match(derived, /^wss:\/\/im\.example\.test/u);

// The host session is authoritative without touching IM's own persistence.
applyImPcEmbedSession({
  authToken: 'auth-token',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
});
const installed = readAppSdkSessionTokens();
assert.equal(installed?.authToken, 'auth-token');
assert.equal(installed?.accessToken, 'access-token');
assert.equal(installed?.refreshToken, 'refresh-token');
assert.notEqual(readImPcEmbedSession(), undefined, 'the host session must stay installed');

// Persisting from inside the embedded runtime routes into the host override.
persistAppSdkSessionTokens({ authToken: 'auth-token-2', accessToken: 'access-token-2' });
assert.equal(readAppSdkSessionTokens()?.accessToken, 'access-token-2');

// Signed out means embedded with no session, not the persisted standalone one.
applyImPcEmbedSession(null);
assert.equal(readAppSdkSessionTokens(), null);
assert.equal(isImPcEmbedded(), true);

// Detaching drops the override so the standalone runtime reads its own storage.
detachImPcEmbedSession();
assert.equal(readImPcEmbedSession(), undefined);
configureImPcEmbedEnvironment(null);
assert.equal(readImPcEmbedEnvironment(), null);
assert.equal(isImPcEmbedded(), false);

// The runtime rejects host facts the SDK could not use, with a typed code.
assert.throws(
  () => configureImPcEmbedRuntime({ apiBaseUrl: '', session: null }),
  (error: unknown) => error instanceof ImPcEmbedInitError && error.code === 'im-embed-invalid-api-base-url',
);
assert.throws(
  () => configureImPcEmbedRuntime({ apiBaseUrl: 'ftp://im.example.test', session: null }),
  (error: unknown) => error instanceof ImPcEmbedInitError && error.code === 'im-embed-invalid-api-base-url',
);
assert.throws(
  () => configureImPcEmbedRuntime({
    apiBaseUrl: 'https://im.example.test',
    websocketBaseUrl: 'not-a-url',
    session: null,
  }),
  (error: unknown) => error instanceof ImPcEmbedInitError && error.code === 'im-embed-invalid-websocket-base-url',
);
assert.throws(
  () => configureImPcEmbedRuntime({
    apiBaseUrl: 'https://im.example.test',
    websocketBaseUrl: 'https://im.example.test',
    session: null,
  }),
  (error: unknown) => error instanceof ImPcEmbedInitError && error.code === 'im-embed-invalid-websocket-base-url',
);
// A desktop shell proxies HTTP through its own origin and dials the realtime
// socket directly, so an app-scheme API base plus a wss realtime origin is a
// valid host fact pair.
const desktopRuntime = configureImPcEmbedRuntime({
  apiBaseUrl: 'dsh-app://app',
  websocketBaseUrl: 'wss://im.example.test/ws',
  session: { authToken: 'auth-token', accessToken: 'access-token' },
});
desktopRuntime.dispose();
assert.throws(
  () => configureImPcEmbedRuntime({
    apiBaseUrl: 'https://im.example.test',
    session: { authToken: 'auth-only', accessToken: '' } as never,
  }),
  (error: unknown) => error instanceof ImPcEmbedInitError && error.code === 'im-embed-invalid-session',
);

// A valid host initializes the SDK client eagerly (no socket yet) and disposal
// restores the standalone state with no live realtime connection left behind.
const runtime = configureImPcEmbedRuntime({
  apiBaseUrl: 'https://im.example.test',
  session: { authToken: 'auth-token', accessToken: 'access-token' },
});
assert.equal(readAppSdkSessionTokens()?.authToken, 'auth-token');
assert.equal(getPcLiveConnectionStatus(), 'idle', 'initialization must not open the realtime socket');
runtime.dispose();
assert.equal(readImPcEmbedSession(), undefined);
assert.equal(readImPcEmbedEnvironment(), null);
assert.equal(isImPcEmbedded(), false);
assert.equal(getPcLiveConnectionStatus(), 'idle');

console.log('im-embed-host contract passed.');

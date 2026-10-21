import type { SdkworkChatSession } from './session';

/**
 * Host-installed facts for an embedded IM PC runtime.
 *
 * An embedding host (for example the BirdCoder desktop shell) owns the
 * deployment environment and the authenticated session. The embedded PC
 * surfaces must therefore stop reading launch-time Vite values and must not
 * persist a second copy of the host's credentials. The host installs both
 * facts here before the first IM client is created and removes them when the
 * embedded runtime is disposed.
 */
export interface ImPcEmbedEnvironment {
  /** SDKWork API gateway origin serving `/im/v3/api`. */
  apiBaseUrl?: string;
  /** Realtime origin; derived from {@link apiBaseUrl} when omitted. */
  websocketBaseUrl?: string;
}

let embeddedEnvironment: ImPcEmbedEnvironment | null = null;
let embeddedSession: SdkworkChatSession | null | undefined;

/**
 * Install or clear the deployment endpoints an embedding host provides.
 * @param environment host endpoints, or null to fall back to launch config.
 */
export function configureImPcEmbedEnvironment(environment: ImPcEmbedEnvironment | null): void {
  embeddedEnvironment = environment;
}

/**
 * Read the host-provided deployment endpoints.
 * @returns the installed endpoints, or null when the runtime is not embedded.
 */
export function readImPcEmbedEnvironment(): ImPcEmbedEnvironment | null {
  return embeddedEnvironment;
}

/**
 * Install the host-owned session without touching IM's own session storage.
 * `null` means "embedded and signed out"; `undefined` removes the override so
 * the runtime returns to its persisted-session behavior.
 * @param session host session, null for signed out, or undefined to detach.
 */
export function writeImPcEmbedSession(session: SdkworkChatSession | null | undefined): void {
  embeddedSession = session;
}

/**
 * Read the host-installed session override.
 * @returns the session, null when embedded and signed out, or undefined when
 * the runtime is not embedded and persisted storage stays authoritative.
 */
export function readImPcEmbedSession(): SdkworkChatSession | null | undefined {
  return embeddedSession;
}

/**
 * Whether a host exposes this runtime to another application.
 * @returns true once either the environment or the session override is installed.
 */
export function isImPcEmbedded(): boolean {
  return embeddedEnvironment !== null || embeddedSession !== undefined;
}

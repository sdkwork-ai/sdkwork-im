/**
 * Injected chat SDK port holder.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6. Runtime
 * bootstrap constructs the generated SDK client and injects it; capability
 * services only ever receive it. This module is the injection seam, so the chat
 * services never construct a client and never fall back to raw request APIs.
 *
 * PREREQUISITE, stated rather than hidden: the SDK generation chain emits
 * `sdkwork-im-app-sdk` for TypeScript, Flutter, Kotlin, Swift, C#, Go, Java,
 * Python, and Rust (see `sdks/README.md`); no ArkTS target exists yet. Until one
 * lands, nothing can satisfy `ImHarmonyChatSdkPort`, so resolution fails with a
 * named, user-safe error instead of a fabricated transport. The chat surface
 * renders that as its error state, which is why the app still boots and the
 * shell, session, routing, and i18n layers stay verifiable.
 *
 * Registration is idempotent-by-replacement: bootstrap calls it once, and a
 * later call (for example after a profile switch) must replace the client rather
 * than leave two transports alive against different origins.
 */
import type { ImHarmonyChatClientResolver, ImHarmonyChatSdkPort } from '../models/ChatModels';

/** Stable code surfaced to the UI so the error state is not string-matched. */
export const IM_HARMONY_CHAT_SDK_UNAVAILABLE_CODE: string = 'harmony-chat-sdk-unavailable';

/**
 * User-safe resolution failure.
 *
 * Carries no origin, token, or stack detail: this instance is what reaches a
 * phone screen through the screen-state error message.
 */
export class ImHarmonyChatSdkUnavailableError extends Error {
  readonly code: string = IM_HARMONY_CHAT_SDK_UNAVAILABLE_CODE;

  constructor(message: string) {
    super(message);
    this.name = 'ImHarmonyChatSdkUnavailableError';
  }
}

const UNAVAILABLE_MESSAGE: string =
  'The generated ArkTS IM app SDK client is not registered for harmony-native yet.';

let registeredPort: ImHarmonyChatSdkPort | null = null;

/** Registers the client constructed by the root bootstrap. */
export function registerImHarmonyChatSdkPort(port: ImHarmonyChatSdkPort): void {
  registeredPort = port;
}

export function isImHarmonyChatSdkPortRegistered(): boolean {
  return registeredPort !== null;
}

/**
 * Resolves the registered client, or fails with a named error.
 *
 * Called lazily from inside a service method rather than at import time so a
 * missing transport cannot break module loading — that would take down the shell
 * and the session screen along with the chat surface.
 */
export function resolveImHarmonyChatSdkPort(): ImHarmonyChatSdkPort {
  if (registeredPort === null) {
    throw new ImHarmonyChatSdkUnavailableError(UNAVAILABLE_MESSAGE);
  }
  return registeredPort;
}

/**
 * Clears the registered client.
 *
 * Logout and profile switches must call this together with the session store and
 * realtime bridges (`HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6).
 */
export function resetImHarmonyChatSdkPort(): void {
  registeredPort = null;
}

/**
 * The resolver the chat services are constructed with.
 *
 * Exported as a named function so every service in this package is wired through
 * one seam, and a test can assert the failure mode without reaching into module
 * state.
 */
export const resolveImHarmonyChatClient: ImHarmonyChatClientResolver =
  resolveImHarmonyChatSdkPort;

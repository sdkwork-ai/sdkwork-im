/**
 * SDK client construction for the HarmonyOS root.
 *
 * Authority: `APP_SDK_INTEGRATION_SPEC.md` and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 6. Concrete clients are
 * constructed here and nowhere else; capability packages receive them through an
 * injected port and must not construct one themselves.
 */
import {
  configureImHarmonyAppSdkBaseUrl,
  getImHarmonyAppSdkClient,
  initImHarmonyIamAppSdkClient,
  resetImHarmonyAppSdkClient,
  resetImHarmonyIamAppSdkClient,
  type ImAppSdkClient,
  type ImIamAppSdkClient,
} from '@sdkwork/sdkwork-im-harmony-mobile-core';
import {
  isImHarmonyChatSdkPortRegistered,
  registerImHarmonyChatSdkPort,
  resetImHarmonyChatSdkPort,
  type ImHarmonyChatSdkPort,
} from '@sdkwork/sdkwork-im-harmony-mobile-chat';

import type { ImHarmonyEnvironment } from './Environment';

/**
 * SDK wiring report.
 *
 * Returned rather than logged so the root page can render wiring state and a test
 * can assert it. An unregistered capability port is the difference between "the
 * SDK target has not landed" and "the bootstrap forgot to inject it", and those
 * need different fixes.
 */
export interface ImHarmonySdkWiringReport {
  readonly imAppSdkInitialized: boolean;
  readonly iamAppSdkInitialized: boolean;
  readonly chatSdkPortRegistered: boolean;
}

export class ImHarmonySdkClients {
  private environment: ImHarmonyEnvironment | null = null;
  private imClient: ImAppSdkClient | null = null;
  private iamClient: ImIamAppSdkClient | null = null;

  /**
   * Constructs the generated clients for one environment.
   *
   * `accessToken` is optional because bootstrap runs before login. The IAM client
   * is still constructed, so the session screen has a client to exchange against.
   */
  initialize(environment: ImHarmonyEnvironment, accessToken?: string): void {
    configureImHarmonyAppSdkBaseUrl(environment.imApiBaseUrl);
    this.imClient = getImHarmonyAppSdkClient();
    this.iamClient = initImHarmonyIamAppSdkClient({
      baseUrl: environment.appbaseAppApiBaseUrl,
      accessToken,
    });
    this.environment = environment;
  }

  /**
   * Rebuilds the clients around a freshly exchanged credential.
   *
   * The environment is remembered rather than re-supplied by the caller: login
   * happens in the session screen, which has no business knowing the runtime
   * environment, and re-deriving it there is how a client ends up pointed at a
   * profile other than the one bootstrap validated.
   */
  reinitializeWithAccessToken(accessToken?: string): void {
    const environment: ImHarmonyEnvironment | null = this.environment;
    if (environment === null) {
      throw new Error('IM Harmony SDK clients must be initialized before a session can be applied');
    }
    this.reset();
    this.initialize(environment, accessToken);
  }

  get im(): ImAppSdkClient {
    if (this.imClient === null) {
      throw new Error('IM app SDK client must be initialized by bootstrap before use');
    }
    return this.imClient;
  }

  get iam(): ImIamAppSdkClient {
    if (this.iamClient === null) {
      throw new Error('IAM app SDK client must be initialized by bootstrap before use');
    }
    return this.iamClient;
  }

  /**
   * Registers the capability's SDK port.
   *
   * The generated `sdkwork-im-app-sdk` has no ArkTS target yet, so the bootstrap
   * has nothing to register and the chat screens render their error state. When the
   * target lands, this is the single call site that changes.
   */
  registerChatSdkPort(port: ImHarmonyChatSdkPort): void {
    registerImHarmonyChatSdkPort(port);
  }

  describe(): ImHarmonySdkWiringReport {
    return {
      imAppSdkInitialized: this.imClient !== null,
      iamAppSdkInitialized: this.iamClient !== null,
      chatSdkPortRegistered: isImHarmonyChatSdkPortRegistered(),
    };
  }

  /**
   * Tears every client down.
   *
   * Logout and refresh failure must clear the clients together with the session
   * store and the capability ports (section 6); leaving a configured base URL alive
   * across an account switch points the next session at the previous origin.
   */
  reset(): void {
    resetImHarmonyAppSdkClient();
    resetImHarmonyIamAppSdkClient();
    resetImHarmonyChatSdkPort();
    this.imClient = null;
    this.iamClient = null;
  }
}

let sdkClients: ImHarmonySdkClients | null = null;

export function createImHarmonySdkClients(): ImHarmonySdkClients {
  sdkClients = new ImHarmonySdkClients();
  return sdkClients;
}

export function getImHarmonySdkClients(): ImHarmonySdkClients {
  if (sdkClients === null) {
    return createImHarmonySdkClients();
  }
  return sdkClients;
}

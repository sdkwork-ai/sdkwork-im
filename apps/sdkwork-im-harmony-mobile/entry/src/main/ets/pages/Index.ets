/**
 * Root page.
 *
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 1 keeps `entry/` thin: page
 * registry and composition only. This page is the navigator's mount point, so it
 * resolves the registry the bootstrap validated, evaluates the shell's auth gate,
 * and mounts the capability component the current route declares. It holds no
 * business state of its own.
 */
import {
  IM_HARMONY_DEFAULT_LOCALE,
  ScreenStateView,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';
import {
  ImHarmonyLoginPage,
  resolveImHarmonyEntryRouteId,
} from '@sdkwork/sdkwork-im-harmony-mobile-shell';
import {
  IM_HARMONY_CHAT_ROUTE_IDS,
  ImHarmonyChatConversationPage,
  ImHarmonyChatCreateGroupPage,
  ImHarmonyChatInboxPage,
} from '@sdkwork/sdkwork-im-harmony-mobile-chat';

import { readImHarmonyOffline } from '../bootstrap/HostAdapters';
import {
  getImHarmonyAppRuntime,
  getImHarmonyBootstrapError,
  resolveImHarmonyAppLocale,
} from '../bootstrap/Runtime';

const BOOTSTRAP_FAILED_MESSAGE: string = 'The application runtime failed to start.';

@Entry
@Component
struct Index {
  @State locale: string = IM_HARMONY_DEFAULT_LOCALE;
  @State routeId: string = '';
  @State conversationId: string = '';
  @State conversationTitle: string = '';
  @State offline: boolean = false;
  /**
   * Route-permission denial.
   *
   * Left false in this slice: the shell decides authentication, and no permission
   * facts are resolved yet, so claiming a denial would be inventing a decision the
   * runtime never made. The capability pages already render the state, so wiring a
   * real permission source is a one-line change here.
   */
  @State permissionDenied: boolean = false;
  @State failureMessage: string = '';

  private routes: ImHarmonyRouteRegistration[] = [];

  aboutToAppear(): void {
    const runtime = getImHarmonyAppRuntime();
    if (runtime === null) {
      const recorded: string | null = getImHarmonyBootstrapError();
      this.failureMessage = recorded ?? BOOTSTRAP_FAILED_MESSAGE;
      return;
    }
    this.locale = resolveImHarmonyAppLocale();
    this.routes = runtime.routes;
    const entryRouteId: string | undefined = resolveImHarmonyEntryRouteId(
      runtime.routes,
      runtime.iam.isAuthenticated(),
    );
    this.routeId = entryRouteId ?? '';
    readImHarmonyOffline().then((offline: boolean) => {
      this.offline = offline;
    });
  }

  build() {
    Column() {
      if (this.failureMessage.length > 0) {
        ScreenStateView({
          status: 'error',
          message: this.failureMessage,
          retryLabel: '',
        })
      } else if (this.routeId === IM_HARMONY_CHAT_ROUTE_IDS.inbox) {
        ImHarmonyChatInboxPage({
          locale: this.locale,
          offline: this.offline,
          permissionDenied: this.permissionDenied,
          onOpenConversation: (conversationId: string, title: string) => {
            this.conversationId = conversationId;
            this.conversationTitle = title;
            this.routeId = IM_HARMONY_CHAT_ROUTE_IDS.conversation;
          },
          onCreateGroup: () => {
            this.routeId = IM_HARMONY_CHAT_ROUTE_IDS.createGroup;
          },
        })
      } else if (this.routeId === IM_HARMONY_CHAT_ROUTE_IDS.conversation) {
        ImHarmonyChatConversationPage({
          conversationId: this.conversationId,
          conversationTitle: this.conversationTitle,
          locale: this.locale,
          offline: this.offline,
          permissionDenied: this.permissionDenied,
          resolveCurrentUserId: () => readImHarmonyCurrentUserId(),
          onBack: () => {
            this.routeId = IM_HARMONY_CHAT_ROUTE_IDS.inbox;
          },
        })
      } else if (this.routeId === IM_HARMONY_CHAT_ROUTE_IDS.createGroup) {
        ImHarmonyChatCreateGroupPage({
          locale: this.locale,
          offline: this.offline,
          permissionDenied: this.permissionDenied,
          onBack: () => {
            this.routeId = IM_HARMONY_CHAT_ROUTE_IDS.inbox;
          },
          onCreated: (conversationId: string) => {
            this.conversationId = conversationId;
            this.conversationTitle = '';
            this.routeId = IM_HARMONY_CHAT_ROUTE_IDS.conversation;
          },
        })
      } else {
        ImHarmonyLoginPage({ locale: this.locale })
      }
    }
    .width('100%')
    .height('100%')
  }
}

/**
 * Reads the signed-in account id from the session store.
 *
 * Bubbled through the page rather than imported by the conversation screen, because
 * the capability layer must not read session state directly — that is a runtime
 * concern, and the port it consumes is declared as an injected resolver.
 */
function readImHarmonyCurrentUserId(): string | undefined {
  const runtime = getImHarmonyAppRuntime();
  return runtime === null ? undefined : runtime.iam.currentUserId();
}

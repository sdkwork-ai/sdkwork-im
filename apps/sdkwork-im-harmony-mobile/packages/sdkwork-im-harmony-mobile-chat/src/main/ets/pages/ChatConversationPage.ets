/**
 * Conversation screen: one message thread plus the composer.
 *
 * Authority: `APP_HARMONY_NATIVE_UI_SPEC.md` and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 4. The page renders the
 * store's projection, delegates every read and write to the injected service,
 * and keeps the composer's own validation local: an empty draft is a UI fact,
 * not a service failure, so it must not become a failed network round trip.
 */
import {
  ImHarmonyTokens,
  ScreenStateView,
  isImHarmonyRetryableStatus,
  resolveImHarmonyEffectiveStatus,
  type ImHarmonyScreenStatus,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import { resolveImHarmonyChatMessage } from '../i18n';
import {
  IM_HARMONY_CHAT_CONVERSATION_SCREEN_KEYS,
  resolveImHarmonyChatStateMessage,
  resolveImHarmonyChatStateRetryLabel,
} from '../i18n/StateMessages';
import type {
  ImHarmonyChatMessageItem,
  ImHarmonyCurrentUserIdResolver,
} from '../models/ChatModels';
import { createImHarmonyChatConversationService } from '../services/ChatConversationService';
import { resolveImHarmonyChatClient } from '../services/ChatSdkRegistry';
import {
  createImHarmonyChatConversationStore,
  type ImHarmonyChatConversationStore,
} from '../state/ChatConversationState';

@Component
export struct ImHarmonyChatConversationPage {
  /** Route parameter; the shell resolves it from the route before mounting. */
  @Prop conversationId: string = '';
  /** Route parameter used as the header title until the summary arrives. */
  @Prop conversationTitle: string = '';
  @Prop locale: string = 'en-US';
  @Prop offline: boolean = false;
  @Prop permissionDenied: boolean = false;
  /** Injected by the root bootstrap so message direction can be rendered. */
  resolveCurrentUserId: ImHarmonyCurrentUserIdResolver = () => undefined;
  /** Injected by the shell; the page must not build a page path itself. */
  onBack: () => void = () => {};

  @State status: ImHarmonyScreenStatus = 'loading';
  @State items: ImHarmonyChatMessageItem[] = [];
  @State hasMore: boolean = false;
  @State sending: boolean = false;
  @State errorMessage: string = '';
  @State validationError: string = '';
  @State draft: string = '';

  private store: ImHarmonyChatConversationStore | null = null;
  private unsubscribe: (() => void) | null = null;

  aboutToAppear(): void {
    const store: ImHarmonyChatConversationStore = createImHarmonyChatConversationStore(
      this.conversationId,
      createImHarmonyChatConversationService(resolveImHarmonyChatClient, this.resolveCurrentUserId),
    );
    this.store = store;
    this.unsubscribe = store.subscribe((state) => {
      this.status = state.status;
      this.items = state.items;
      this.hasMore = state.hasMore;
      this.sending = state.sending;
      this.errorMessage = state.errorMessage ?? '';
    });
    store.open();
  }

  aboutToDisappear(): void {
    if (this.unsubscribe !== null) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    // Drop the thread store with the page: a retained store would keep a stale
    // message window alive across a logout and re-login as another account.
    this.store?.reset();
    this.store = null;
  }

  build() {
    Column() {
      this.buildHeader()
      if (this.effectiveStatus() === 'success') {
        this.buildThread()
      } else {
        ScreenStateView({
          status: this.effectiveStatus(),
          message: resolveImHarmonyChatStateMessage(
            this.locale,
            this.effectiveStatus(),
            IM_HARMONY_CHAT_CONVERSATION_SCREEN_KEYS,
            this.errorMessage,
          ),
          retryLabel: isImHarmonyRetryableStatus(this.effectiveStatus())
            ? resolveImHarmonyChatStateRetryLabel(
                this.locale,
                IM_HARMONY_CHAT_CONVERSATION_SCREEN_KEYS,
              )
            : '',
        })
      }
      this.buildComposer()
    }
    .width('100%')
    .height('100%')
    .backgroundColor(ImHarmonyTokens.colorSurface)
  }

  private effectiveStatus(): ImHarmonyScreenStatus {
    return resolveImHarmonyEffectiveStatus(this.status, this.offline, this.permissionDenied);
  }

  @Builder
  buildHeader() {
    Row() {
      Text(resolveImHarmonyChatMessage(this.locale, 'chat.conversation.title'))
        .fontSize(ImHarmonyTokens.fontSizeBody)
        .fontColor(ImHarmonyTokens.colorPrimary)
        .onClick(() => {
          this.onBack();
        })
      Text(this.conversationTitle)
        .fontSize(ImHarmonyTokens.fontSizeTitle)
        .fontWeight(FontWeight.Bold)
        .fontColor(ImHarmonyTokens.colorText)
        .margin({ left: ImHarmonyTokens.spacingMd })
    }
    .width('100%')
    .padding(ImHarmonyTokens.spacingMd)
  }

  @Builder
  buildThread() {
    Column() {
      if (this.hasMore) {
        Text(resolveImHarmonyChatMessage(this.locale, 'chat.conversation.load_earlier'))
          .fontSize(ImHarmonyTokens.fontSizeCaption)
          .fontColor(ImHarmonyTokens.colorPrimary)
          .padding(ImHarmonyTokens.spacingSm)
          .onClick(() => {
            this.store?.loadOlder();
          })
      }
      List() {
        ForEach(this.items, (item: ImHarmonyChatMessageItem) => {
          ListItem() {
            this.buildMessage(item)
          }
        }, (item: ImHarmonyChatMessageItem) => item.messageId)
      }
      .layoutWeight(1)
      .width('100%')
    }
    .layoutWeight(1)
    .width('100%')
  }

  @Builder
  buildMessage(item: ImHarmonyChatMessageItem) {
    Row() {
      Column() {
        if (item.senderDisplayName !== undefined) {
          Text(item.senderDisplayName)
            .fontSize(ImHarmonyTokens.fontSizeCaption)
            .fontColor(ImHarmonyTokens.colorTextMuted)
        }
        Text(item.text)
          .fontSize(ImHarmonyTokens.fontSizeBody)
          .fontColor(item.outgoing ? ImHarmonyTokens.colorSurface : ImHarmonyTokens.colorText)
          .backgroundColor(item.outgoing ? ImHarmonyTokens.colorPrimary : ImHarmonyTokens.colorSurfaceMuted)
          .borderRadius(ImHarmonyTokens.radiusMd)
          .padding(ImHarmonyTokens.spacingMd)
      }
      .alignItems(item.outgoing ? HorizontalAlign.End : HorizontalAlign.Start)
      .width('100%')
    }
    .width('100%')
    .justifyContent(item.outgoing ? FlexAlign.End : FlexAlign.Start)
    .padding({ top: ImHarmonyTokens.spacingSm, bottom: ImHarmonyTokens.spacingSm })
  }

  @Builder
  buildComposer() {
    Column() {
      if (this.validationError.length > 0) {
        Text(this.validationError)
          .fontSize(ImHarmonyTokens.fontSizeCaption)
          .fontColor(ImHarmonyTokens.colorDanger)
      }
      Row() {
        TextInput({
          text: this.draft,
          placeholder: resolveImHarmonyChatMessage(this.locale, 'chat.conversation.input_placeholder'),
        })
          .layoutWeight(1)
          .onChange((value: string) => {
            this.draft = value;
            this.validationError = '';
          })
        Text(this.sending
          ? resolveImHarmonyChatMessage(this.locale, 'chat.conversation.sending')
          : resolveImHarmonyChatMessage(this.locale, 'chat.conversation.send'))
          .fontSize(ImHarmonyTokens.fontSizeBody)
          .fontColor(ImHarmonyTokens.colorSurface)
          .backgroundColor(ImHarmonyTokens.colorPrimary)
          .borderRadius(ImHarmonyTokens.radiusMd)
          .padding(ImHarmonyTokens.spacingMd)
          .margin({ left: ImHarmonyTokens.spacingMd })
          .onClick(() => {
            this.submit();
          })
      }
      .width('100%')
    }
    .width('100%')
    .padding(ImHarmonyTokens.spacingMd)
  }

  /**
   * Validates, then sends through the store.
   *
   * The draft is cleared only on success. Clearing it optimistically loses what
   * the user typed whenever the send fails, which on a phone is the whole
   * message.
   */
  private submit(): void {
    // A second tap while the first send is in flight would resolve `false` and
    // report "send failed" for a send that is still going out.
    if (this.sending) {
      return;
    }
    const text: string = this.draft.trim();
    if (text.length === 0) {
      this.validationError = resolveImHarmonyChatMessage(
        this.locale,
        'chat.conversation.empty_input',
      );
      return;
    }
    const store: ImHarmonyChatConversationStore | null = this.store;
    if (store === null) {
      return;
    }
    this.validationError = '';
    store.send(text).then((sent: boolean) => {
      if (sent) {
        this.draft = '';
        return;
      }
      this.validationError = resolveImHarmonyChatMessage(
        this.locale,
        'chat.conversation.send_failed',
      );
    });
  }
}

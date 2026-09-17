/**
 * Group-creation screen.
 *
 * Authority: `APP_HARMONY_NATIVE_UI_SPEC.md` and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 4. The screen owns form
 * state and field validation; the service owns the write. A required-field miss
 * is a validation error, not a service failure, so it never becomes a network
 * round trip.
 */
import {
  ImHarmonyTokens,
  ScreenStateView,
  resolveImHarmonyEffectiveStatus,
  type ImHarmonyScreenStatus,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import { resolveImHarmonyChatMessage } from '../i18n';
import {
  IM_HARMONY_CHAT_CONVERSATION_SCREEN_KEYS,
  resolveImHarmonyChatStateMessage,
} from '../i18n/StateMessages';
import type {
  ImHarmonyChatClientResolver,
  ImHarmonyCreateConversationRequest,
  ImHarmonyCreateConversationResult,
} from '../models/ChatModels';
import { createImHarmonyChatConversationService } from '../services/ChatConversationService';
import { resolveImHarmonyChatClient } from '../services/ChatSdkRegistry';

@Component
export struct ImHarmonyChatCreateGroupPage {
  @Prop locale: string = 'en-US';
  @Prop offline: boolean = false;
  @Prop permissionDenied: boolean = false;
  /** Injected by the shell; the page must not build a page path itself. */
  onBack: () => void = () => {};
  /** Injected by the shell; receives the new conversation id. */
  onCreated: (conversationId: string) => void = () => {};

  @State groupName: string = '';
  @State membersText: string = '';
  @State submitting: boolean = false;
  @State validationError: string = '';
  @State errorMessage: string = '';

  build() {
    Column() {
      this.buildHeader()
      if (this.blockedStatus() === null) {
        this.buildForm()
      } else {
        ScreenStateView({
          status: this.blockedStatus() as ImHarmonyScreenStatus,
          message: resolveImHarmonyChatStateMessage(
            this.locale,
            this.blockedStatus() as ImHarmonyScreenStatus,
            IM_HARMONY_CHAT_CONVERSATION_SCREEN_KEYS,
            this.errorMessage,
          ),
          retryLabel: '',
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(ImHarmonyTokens.colorSurface)
  }

  /**
   * Platform condition replacing the form entirely.
   *
   * Group creation is a write, so unlike a read it cannot be attempted and
   * reported afterwards — a form that submits into a known-offline device only
   * wastes the user's typing. `success` means "no platform condition applies".
   */
  private blockedStatus(): ImHarmonyScreenStatus {
    return resolveImHarmonyEffectiveStatus('success', this.offline, this.permissionDenied);
  }

  private isBlocked(): boolean {
    return this.blockedStatus() !== 'success';
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
      Text(resolveImHarmonyChatMessage(this.locale, 'chat.create_group.title'))
        .fontSize(ImHarmonyTokens.fontSizeTitle)
        .fontWeight(FontWeight.Bold)
        .fontColor(ImHarmonyTokens.colorText)
        .margin({ left: ImHarmonyTokens.spacingMd })
    }
    .width('100%')
    .padding(ImHarmonyTokens.spacingMd)
  }

  @Builder
  buildForm() {
    Column() {
      Text(resolveImHarmonyChatMessage(this.locale, 'chat.create_group.name_label'))
        .fontSize(ImHarmonyTokens.fontSizeCaption)
        .fontColor(ImHarmonyTokens.colorTextMuted)
        .alignSelf(ItemAlign.Start)
      TextInput({
        text: this.groupName,
        placeholder: resolveImHarmonyChatMessage(this.locale, 'chat.create_group.name_placeholder'),
      })
        .width('100%')
        .onChange((value: string) => {
          this.groupName = value;
          this.validationError = '';
        })
      Text(resolveImHarmonyChatMessage(this.locale, 'chat.create_group.members_label'))
        .fontSize(ImHarmonyTokens.fontSizeCaption)
        .fontColor(ImHarmonyTokens.colorTextMuted)
        .alignSelf(ItemAlign.Start)
        .margin({ top: ImHarmonyTokens.spacingMd })
      TextInput({
        text: this.membersText,
        placeholder: resolveImHarmonyChatMessage(this.locale, 'chat.create_group.members_placeholder'),
      })
        .width('100%')
        .onChange((value: string) => {
          this.membersText = value;
          this.validationError = '';
        })
      if (this.validationError.length > 0) {
        Text(this.validationError)
          .fontSize(ImHarmonyTokens.fontSizeCaption)
          .fontColor(ImHarmonyTokens.colorDanger)
          .margin({ top: ImHarmonyTokens.spacingSm })
      }
      if (this.errorMessage.length > 0) {
        Text(this.errorMessage)
          .fontSize(ImHarmonyTokens.fontSizeCaption)
          .fontColor(ImHarmonyTokens.colorDanger)
          .margin({ top: ImHarmonyTokens.spacingSm })
      }
      Text(this.submitting
        ? resolveImHarmonyChatMessage(this.locale, 'chat.create_group.submitting')
        : resolveImHarmonyChatMessage(this.locale, 'chat.create_group.submit'))
        .fontSize(ImHarmonyTokens.fontSizeBody)
        .fontColor(ImHarmonyTokens.colorSurface)
        .backgroundColor(ImHarmonyTokens.colorPrimary)
        .borderRadius(ImHarmonyTokens.radiusMd)
        .padding(ImHarmonyTokens.spacingMd)
        .margin({ top: ImHarmonyTokens.spacingLg })
        .onClick(() => {
          this.submit();
        })
    }
    .width('100%')
    .padding(ImHarmonyTokens.spacingMd)
  }

  private submit(): void {
    if (this.submitting) {
      return;
    }
    const name: string = this.groupName.trim();
    if (name.length === 0) {
      this.validationError = resolveImHarmonyChatMessage(
        this.locale,
        'chat.create_group.name_required',
      );
      return;
    }
    const memberIds: string[] = parseImHarmonyMemberIds(this.membersText);
    this.validationError = '';
    this.errorMessage = '';
    this.submitting = true;
    const service: ImHarmonyChatConversationService = createImHarmonyChatConversationService(
      resolveImHarmonyChatClient,
      NO_CURRENT_USER,
    );
    const request: ImHarmonyCreateConversationRequest = { memberIds, title: name };
    service.createConversation(request)
      .then((result: ImHarmonyCreateConversationResult) => {
        this.submitting = false;
        this.onCreated(result.conversationId);
      })
      .catch((error: Error) => {
        this.submitting = false;
        // A rejected create keeps its server detail when there is one: "name
        // already taken" is actionable and the generic copy is not.
        const detail: string = resolveImHarmonyErrorMessage(error);
        this.errorMessage = detail === IM_HARMONY_UNKNOWN_ERROR
          ? resolveImHarmonyChatMessage(this.locale, 'chat.create_group.failed')
          : detail;
      });
  }
}

/**
 * Splits a comma-separated member field into ids.
 *
 * Tolerates full-width and ideographic commas because the Chinese IME produces
 * them by default, and an iPhone-style "，"-separated list silently parsing to one
 * bogus id is a bug users cannot see.
 */
export function parseImHarmonyMemberIds(value: string): string[] {
  const ids: string[] = [];
  const seen: Set<string> = new Set<string>();
  for (const raw of value.split(/[,，、]/u)) {
    const id: string = raw.trim();
    if (id.length === 0 || seen.has(id)) {
      continue;
    }
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

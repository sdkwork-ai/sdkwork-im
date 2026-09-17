/**
 * Inbox screen: the conversation list.
 *
 * Authority: `APP_HARMONY_NATIVE_UI_SPEC.md` and
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 4. The page owns rendering
 * and the store owns the data; the page never calls an SDK client, never reads
 * runtime env, and never navigates by constructing a path. Opening a thread and
 * starting a group chat are delegated to callbacks the shell injects, because
 * the shell owns the navigator.
 */
import {
  ImHarmonyTokens,
  ScreenStateView,
  isImHarmonyRetryableStatus,
  resolveImHarmonyEffectiveStatus,
  type ImHarmonyScreenStatus,
} from '@sdkwork/sdkwork-im-harmony-mobile-commons';

import {
  formatImHarmonyChatMessage,
  resolveImHarmonyChatMessage,
} from '../i18n';
/**
 * Imported from the module itself rather than the `i18n` barrel: `StateMessages`
 * reads the registry, so re-exporting it from the barrel would create an
 * import cycle inside one directory.
 */
import {
  IM_HARMONY_CHAT_INBOX_SCREEN_KEYS,
  resolveImHarmonyChatStateMessage,
  resolveImHarmonyChatStateRetryLabel,
} from '../i18n/StateMessages';
import type { ImHarmonyChatInboxItem } from '../models/ChatModels';
import { createImHarmonyChatInboxService } from '../services/ChatInboxService';
import { resolveImHarmonyChatClient } from '../services/ChatSdkRegistry';
import {
  createImHarmonyChatInboxStore,
  type ImHarmonyChatInboxStore,
} from '../state/ChatInboxState';

let inboxStore: ImHarmonyChatInboxStore | null = null;

@Component
export struct ImHarmonyChatInboxPage {
  @Prop locale: string = 'en-US';
  /** Injected by the shell from the host network-status adapter. */
  @Prop offline: boolean = false;
  /** Injected by the shell when the route authorization was refused. */
  @Prop permissionDenied: boolean = false;
  /** Injected by the shell; the page must not build a page path itself. */
  onOpenConversation: (conversationId: string, title: string) => void = () => {};
  onCreateGroup: () => void = () => {};

  @State status: ImHarmonyScreenStatus = 'loading';
  @State items: ImHarmonyChatInboxItem[] = [];
  @State hasMore: boolean = false;
  @State errorMessage: string = '';

  private unsubscribe: (() => void) | null = null;

  aboutToAppear(): void {
    const store: ImHarmonyChatInboxStore = getInboxStore();
    this.unsubscribe = store.subscribe((state) => {
      this.status = state.status;
      this.items = state.items;
      this.hasMore = state.hasMore;
      this.errorMessage = state.errorMessage ?? '';
    });
    const current = store.getState();
    this.status = current.status;
    this.items = current.items;
    this.hasMore = current.hasMore;
    store.refresh();
  }

  aboutToDisappear(): void {
    // Unsubscribing on disappearance is required: the store outlives the page,
    // and a retained listener would assign to a destroyed component.
    if (this.unsubscribe !== null) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  build() {
    Column() {
      if (this.effectiveStatus() === 'success') {
        this.buildList()
      } else {
        ScreenStateView({
          status: this.effectiveStatus(),
          message: resolveImHarmonyChatStateMessage(
            this.locale,
            this.effectiveStatus(),
            IM_HARMONY_CHAT_INBOX_SCREEN_KEYS,
            this.errorMessage,
          ),
          retryLabel: isImHarmonyRetryableStatus(this.effectiveStatus())
            ? resolveImHarmonyChatStateRetryLabel(this.locale, IM_HARMONY_CHAT_INBOX_SCREEN_KEYS)
            : '',
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(ImHarmonyTokens.colorSurface)
  }

  private effectiveStatus(): ImHarmonyScreenStatus {
    return resolveImHarmonyEffectiveStatus(this.status, this.offline, this.permissionDenied);
  }

  @Builder
  buildList() {
    Column() {
      Text(resolveImHarmonyChatMessage(this.locale, 'chat.inbox.create_group'))
        .fontSize(ImHarmonyTokens.fontSizeCaption)
        .fontColor(ImHarmonyTokens.colorPrimary)
        .padding(ImHarmonyTokens.spacingMd)
        .onClick(() => {
          this.onCreateGroup();
        })
      List() {
        ForEach(this.items, (item: ImHarmonyChatInboxItem) => {
          ListItem() {
            this.buildRow(item)
          }
        }, (item: ImHarmonyChatInboxItem) => item.conversationId)
      }
      .layoutWeight(1)
      .width('100%')
      .onReachEnd(() => {
        loadMoreInbox();
      })
      if (this.hasMore) {
        Text(resolveImHarmonyChatMessage(this.locale, 'chat.inbox.loading_more'))
          .fontSize(ImHarmonyTokens.fontSizeCaption)
          .fontColor(ImHarmonyTokens.colorTextMuted)
          .padding(ImHarmonyTokens.spacingSm)
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  buildRow(item: ImHarmonyChatInboxItem) {
    Row() {
      Column() {
        Text(item.displayName)
          .fontSize(ImHarmonyTokens.fontSizeBody)
          .fontColor(ImHarmonyTokens.colorText)
        if (item.lastSummary !== undefined) {
          Text(item.lastSummary)
            .fontSize(ImHarmonyTokens.fontSizeCaption)
            .fontColor(ImHarmonyTokens.colorTextMuted)
            .maxLines(1)
        }
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      if (item.unreadCount > 0) {
        Text(formatImHarmonyChatMessage(
          resolveImHarmonyChatMessage(this.locale, 'chat.inbox.unread_badge'),
          { count: item.unreadCount },
        ))
          .fontSize(ImHarmonyTokens.fontSizeCaption)
          .fontColor(ImHarmonyTokens.colorSurface)
          .backgroundColor(ImHarmonyTokens.colorUnreadBadge)
          .borderRadius(ImHarmonyTokens.radiusMd)
          .padding(ImHarmonyTokens.spacingSm)
      }
    }
    .width('100%')
    .padding(ImHarmonyTokens.spacingMd)
    .onClick(() => {
      this.onOpenConversation(item.conversationId, item.displayName);
    })
  }
}

/**
 * Store reuse across screen mounts.
 *
 * The store is created once per signed-in session and lives here rather than in
 * the component, because ArkUI destroys and rebuilds route components on every
 * navigation: a page-owned store would re-read the first page each time the user
 * returns from a thread.
 */
function getInboxStore(): ImHarmonyChatInboxStore {
  if (inboxStore === null) {
    inboxStore = createImHarmonyChatInboxStore(
      createImHarmonyChatInboxService(resolveImHarmonyChatClient),
    );
  }
  return inboxStore;
}

/** Loads the next page through the shared store. */
export function loadMoreInbox(): void {
  if (inboxStore !== null) {
    inboxStore.loadMore();
  }
}

/** Clears the inbox cache; logout and account switches must call this. */
export function resetImHarmonyChatInbox(): void {
  inboxStore?.reset();
  inboxStore = null;
}

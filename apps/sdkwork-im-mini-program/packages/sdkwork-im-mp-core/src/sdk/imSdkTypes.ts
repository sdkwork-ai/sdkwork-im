/**
 * IM SDK type surface re-exported for IM mini program capability packages.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7. Capability
 * packages consume the IM domain types through the core boundary instead of
 * importing the generated SDK directly, so exactly one package in the root
 * owns the generated dependency edge and a future SDK version bump is a
 * one-file change.
 *
 * Types only: no client, no transport, no request construction.
 */

export type {
  BindDirectChatRequest,
  ContactPreferencesView,
  ContactsResponse,
  ConversationInboxEntry,
  ConversationInboxPage,
  ConversationMember,
  ConversationMessageEntry,
  ConversationMessageListResponse,
  ConversationPreferencesView,
  ConversationProfileView,
  ConversationSummaryView,
  CreateConversationRequest,
  CreateConversationResult,
  EditMessageRequest,
  MessageMutationResult,
  RecallMessageRequest,
  FriendRequest,
  ImConnectOptions,
  ImContentPart,
  ImDecodedMessage,
  ImPostMessageRequest,
  ImLiveConnection,
  ImLiveConnectionState,
  ImMessageContext,
  ListMembersResponse,
  MessageSearchHit,
  MessageSearchPage,
  MessageSearchParams,
  PostMessageResult,
  SocialFriendRequestListResponse,
  SocialUserSearchResponse,
  SocialUserSearchResult,
  QueryParams,
  SdkWorkListPageInfo,
  UpdateConversationPreferencesRequest,
  UpdateReadCursorRequest,
  UpdateConversationProfileRequest,
} from "@sdkwork/im-sdk";

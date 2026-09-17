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
  FriendRequest,
  ImConnectOptions,
  ImDecodedMessage,
  ListMembersResponse,
  MessageMutationResult,
  MessageSearchHit,
  MessageSearchPage,
  MessageSearchParams,
  PostMessageResult,
  QueryParams,
  SdkWorkListPageInfo,
  UpdateConversationPreferencesRequest,
  UpdateConversationProfileRequest,
} from "@sdkwork/im-sdk";

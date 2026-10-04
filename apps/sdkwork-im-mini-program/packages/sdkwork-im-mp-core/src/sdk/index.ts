/**
 * SDK construction boundary of the IM mini program core.
 *
 * Every generated client the IM mini program uses is constructed here and
 * injected into capability services. Capability packages never construct a
 * client and never reach for raw HTTP (`APP_SDK_INTEGRATION_SPEC.md`).
 */

export {
  configureImMpApiBaseUrl,
  createImSdkClientConfig,
  getImSdkClient,
  initImSdkClient,
  isImSdkClientInitialized,
  resetImSdkClient,
  resolveImMpApiBaseUrl,
  type ImMpRuntimeClientConfig,
  type ImSdkClient,
  type ImSdkClientOptions,
} from "./imSdkClient";

export {
  createDriveAppSdkClientConfig,
  getDriveAppSdkClient,
  initDriveAppSdkClient,
  isDriveAppSdkClientInitialized,
  resetDriveAppSdkClient,
  type DriveAppSdkClient,
  type DriveAppSdkClientConfig,
} from "./driveAppSdkClient";

export {
  createImAppSdkClientConfig,
  getImAppSdkClient,
  initImAppSdkClient,
  isImAppSdkClientInitialized,
  resetImAppSdkClient,
  type ImAppSdkClient,
  type ImAppSdkClientConfig,
} from "./imAppSdkClient";

export {
  IM_MP_WECHAT_PROVIDER_CODE,
  createIamAppSdkClientConfig,
  exchangeImMpWechatMiniProgramSession,
  extractImMpSessionPayload,
  getIamAppSdkClient,
  initIamAppSdkClient,
  isIamAppSdkClientInitialized,
  logoutImMpSession,
  resetIamAppSdkClient,
  validateImMpCurrentSession,
  type IamAppSdkClient,
  type IamAppSdkClientConfig,
  type ImMpIamClientOptions,
  type ImMpWechatLoginRequest,
} from "./imIamSdkClient";

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
  FriendRequest,
  ImConnectOptions,
  ImContentPart,
  ImDecodedMessage,
  ImPostMessageRequest,
  ImLiveConnection,
  ImLiveConnectionState,
  ImMessageContext,
  ListMembersResponse,
  MessageMutationResult,
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
  UpdateConversationProfileRequest,
} from "./imSdkTypes";

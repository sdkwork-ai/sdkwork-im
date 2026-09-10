import type {
  AddConversationMemberRequest,
  BindDirectChatRequest,
  ContentPart,
  ConversationMember,
  ConversationProfileView,
  ConversationSummaryView,
  ConversationPreferencesView,
  ConversationAgentAssignments,
  CreateAgentDialogRequest,
  CreateAgentHandoffRequest,
  CreateConversationRequest,
  CreateConversationResult,
  CreateSystemChannelRequest,
  CreateThreadConversationRequest,
  MentionContentPart,
  MessageInteractionSummaryView,
  PostMessageResult,
  PostMessageRequest,
  QueryParams,
  ReadCursorView,
  UpdateConversationPreferencesRequest,
  UpdateConversationProfileRequest,
  UpdateConversationAgentsRequest,
} from '../generated/server-openapi/dist/index.js';
import type {
  ConversationMessageListResponse,
  ConversationInboxPage,
  ListMembersResponse,
  PinnedMessagesResponse,
} from './openapi-compat-types.js';
import { requireStringIdentifier } from './identifier-boundary.js';
import type { ImTransportClientLike, MessageHistoryListParams } from './transport-client-like.js';
import type {
  ImConversationAgentAssignmentSet,
  ImReplaceConversationAgentAssignmentsRequest,
  ImReplaceConversationAgentAssignmentsResult,
} from './transport-client-like.js';

export type { MessageHistoryListParams } from './transport-client-like.js';

/**
 * Composed message types carry the int64 assignment generation as a decimal
 * string. The generated HTTP client exposes int64 values as strings and the
 * server wire contract is string-based per API_SPEC §13.6, so this boundary
 * only owns validation instead of converting the value to a lossy number.
 */
export type ImMentionContentPart = Omit<MentionContentPart, 'assignmentGeneration'> & {
  assignmentGeneration: string;
};

export type ImContentPart = Exclude<ContentPart, MentionContentPart> | ImMentionContentPart;

export type ImPostMessageRequest = Omit<PostMessageRequest, 'parts'> & {
  parts?: ImContentPart[];
};

type CompatiblePostMessageRequest = ImPostMessageRequest | PostMessageRequest;
type CompatiblePostTextOptions =
  | Omit<ImPostMessageRequest, 'text'>
  | Omit<PostMessageRequest, 'text'>;

function normalizePositiveInt64String(value: unknown, fieldName: string): string {
  const numericValue = typeof value === 'number'
    ? value
    : typeof value === 'string' && /^[0-9]+$/u.test(value)
      ? Number(value)
      : Number.NaN;
  if (!Number.isSafeInteger(numericValue) || numericValue < 1) {
    throw new RangeError(`${fieldName} is outside the supported safe integer range.`);
  }
  return String(numericValue);
}

function normalizeAssignmentGeneration(value: string | number): string {
  return normalizePositiveInt64String(value, 'Conversation agent assignment generation');
}

function normalizePostMessageRequest(body: CompatiblePostMessageRequest): PostMessageRequest {
  if (!body.parts) {
    return body as PostMessageRequest;
  }

  const parts = body.parts.map((part) => {
    if (part.kind !== 'mention') {
      return part;
    }
    const assignmentGeneration = normalizePositiveInt64String(
      part.assignmentGeneration,
      'Agent mention assignment generation',
    );
    return { ...part, assignmentGeneration } as unknown as MentionContentPart;
  });

  // The generated transport and the server wire contract both model int64 as
  // a decimal string (API_SPEC §13.6). Keep this normalization inside the
  // composed boundary so callers never need to cast a message request.
  return { ...body, parts } as unknown as PostMessageRequest;
}

function normalizeAgentAssignmentSet(
  value: ConversationAgentAssignments,
): ImConversationAgentAssignmentSet {
  return {
    ...value,
    generation: normalizeAssignmentGeneration(value.generation),
  };
}

export class ImConversationsModule {
  constructor(private readonly transportClient: ImTransportClientLike) {}

  create(body: CreateConversationRequest): Promise<CreateConversationResult> {
    return this.transportClient.chat.conversations.create(body);
  }

  getSummary(conversationId: string): Promise<ConversationSummaryView> {
    return this.transportClient.chat.conversations.retrieve(
      requireStringIdentifier(conversationId, 'conversationId'),
    );
  }

  list(params?: QueryParams): Promise<ConversationInboxPage> {
    return this.transportClient.chat.inbox.list(params);
  }

  createAgentDialog(body: CreateAgentDialogRequest): Promise<CreateConversationResult> {
    return this.transportClient.chat.conversations.agentDialogs.create(body);
  }

  createAgentHandoff(body: CreateAgentHandoffRequest): Promise<CreateConversationResult> {
    return this.transportClient.chat.conversations.agentHandoffs.create(body);
  }

  createSystemChannel(body: CreateSystemChannelRequest): Promise<CreateConversationResult> {
    return this.transportClient.chat.conversations.systemChannels.create(body);
  }

  createThreadConversation(body: CreateThreadConversationRequest): Promise<CreateConversationResult> {
    return this.transportClient.chat.conversations.threads.create(body);
  }

  bindDirectChat(body: BindDirectChatRequest): Promise<CreateConversationResult> {
    return this.transportClient.chat.conversations.directChats.bindings.create(body);
  }

  listMessages(
    conversationId: string,
    params?: MessageHistoryListParams,
  ): Promise<ConversationMessageListResponse> {
    return this.transportClient.chat.conversations.messages.list(
      requireStringIdentifier(conversationId, 'conversationId'),
      params,
    );
  }

  postMessage(conversationId: string, body: ImPostMessageRequest): Promise<PostMessageResult>;
  postMessage(conversationId: string, body: PostMessageRequest): Promise<PostMessageResult>;
  postMessage(
    conversationId: string,
    body: CompatiblePostMessageRequest,
  ): Promise<PostMessageResult> {
    let normalizedBody: PostMessageRequest;
    try {
      normalizedBody = normalizePostMessageRequest(body);
    } catch (error) {
      return Promise.reject(error);
    }
    return this.transportClient.chat.conversations.messages.create(
      requireStringIdentifier(conversationId, 'conversationId'),
      normalizedBody,
    );
  }

  postText(
    conversationId: string,
    text: string,
    body?: Omit<ImPostMessageRequest, 'text'>,
  ): Promise<PostMessageResult>;
  postText(
    conversationId: string,
    text: string,
    body?: Omit<PostMessageRequest, 'text'>,
  ): Promise<PostMessageResult>;
  postText(
    conversationId: string,
    text: string,
    body: CompatiblePostTextOptions = {},
  ): Promise<PostMessageResult> {
    let normalizedBody: PostMessageRequest;
    try {
      normalizedBody = normalizePostMessageRequest({ ...body, text });
    } catch (error) {
      return Promise.reject(error);
    }
    return this.transportClient.chat.conversations.messages.create(
      requireStringIdentifier(conversationId, 'conversationId'),
      normalizedBody,
    );
  }

  updateReadCursor(conversationId: string, body: { readSeq: string }): Promise<ReadCursorView> {
    return this.transportClient.chat.conversations.readCursor.update(
      requireStringIdentifier(conversationId, 'conversationId'),
      body,
    );
  }

  getMessageInteractionSummary(
    conversationId: string,
    messageId: string,
  ): Promise<MessageInteractionSummaryView> {
    return this.transportClient.chat.conversations.messages.interactionSummary.retrieve(
      requireStringIdentifier(conversationId, 'conversationId'),
      requireStringIdentifier(messageId, 'messageId'),
    );
  }

  listPinnedMessages(conversationId: string): Promise<PinnedMessagesResponse> {
    return this.transportClient.chat.conversations.pins.list(
      requireStringIdentifier(conversationId, 'conversationId'),
    );
  }

  getPreferences(conversationId: string): Promise<ConversationPreferencesView> {
    return this.transportClient.chat.conversations.preferences.retrieve(
      requireStringIdentifier(conversationId, 'conversationId'),
    );
  }

  updatePreferences(
    conversationId: string,
    body: UpdateConversationPreferencesRequest,
  ): Promise<ConversationPreferencesView> {
    return this.transportClient.chat.conversations.preferences.update(
      requireStringIdentifier(conversationId, 'conversationId'),
      body,
    );
  }

  getProfile(conversationId: string): Promise<ConversationProfileView> {
    return this.transportClient.chat.conversations.profile.retrieve(
      requireStringIdentifier(conversationId, 'conversationId'),
    );
  }

  updateProfile(
    conversationId: string,
    body: UpdateConversationProfileRequest,
  ): Promise<ConversationProfileView> {
    return this.transportClient.chat.conversations.profile.update(
      requireStringIdentifier(conversationId, 'conversationId'),
      body,
    );
  }

  listMembers(conversationId: string, params?: QueryParams): Promise<ListMembersResponse> {
    return this.transportClient.chat.conversations.members.list(
      requireStringIdentifier(conversationId, 'conversationId'),
      params,
    );
  }

  getCurrentMember(conversationId: string): Promise<ConversationMember> {
    return this.transportClient.chat.conversations.members.current.retrieve(
      requireStringIdentifier(conversationId, 'conversationId'),
    );
  }

  getAgentAssignments(conversationId: string): Promise<ImConversationAgentAssignmentSet> {
    return this.transportClient.chat.conversations.agents
      .retrieve(requireStringIdentifier(conversationId, 'conversationId'))
      .then(normalizeAgentAssignmentSet);
  }

  replaceAgentAssignments(
    conversationId: string,
    body: ImReplaceConversationAgentAssignmentsRequest,
  ): Promise<ImReplaceConversationAgentAssignmentsResult> {
    const expectedGenerationValid = typeof body.expectedGeneration === 'number'
      ? Number.isSafeInteger(body.expectedGeneration) && body.expectedGeneration >= 1
      : typeof body.expectedGeneration === 'string' && /^[0-9]+$/u.test(body.expectedGeneration);
    if (!expectedGenerationValid) {
      return Promise.reject(new Error('A positive safe integer expectedGeneration is required.'));
    }
    // The generator and the server wire contract both model int64 as a decimal
    // string (API_SPEC §13.6), so pass the validated string through and
    // normalize the returned generation explicitly.
    const request = {
      ...body,
      expectedGeneration: String(body.expectedGeneration),
    } as unknown as UpdateConversationAgentsRequest;
    return this.transportClient.chat.conversations.agents
      .update(requireStringIdentifier(conversationId, 'conversationId'), request)
      .then(normalizeAgentAssignmentSet);
  }

  addMember(conversationId: string, body: AddConversationMemberRequest): Promise<unknown> {
    return this.transportClient.chat.conversations.members.add(
      requireStringIdentifier(conversationId, 'conversationId'),
      body,
    );
  }

  removeMember(conversationId: string, body: unknown): Promise<unknown> {
    return this.transportClient.chat.conversations.members.remove(
      requireStringIdentifier(conversationId, 'conversationId'),
      body,
    );
  }

  leave(conversationId: string): Promise<unknown> {
    return this.transportClient.chat.conversations.members.leave(
      requireStringIdentifier(conversationId, 'conversationId'),
    );
  }

  acceptInvitation(conversationId: string): Promise<import('../generated/server-openapi/dist/index.js').ConversationMember> {
    return this.transportClient.chat.conversations.members.acceptInvitation(
      requireStringIdentifier(conversationId, 'conversationId'),
    );
  }
}

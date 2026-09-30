import { imApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';

import type { BlockUserRequest, ContactPreferencesView, ContactRecommendationView, ContactTagView, ContactView, CreateContactRecommendationRequest, CreateContactTagRequest, Friendship, OpenApiUserBlockResponse, SdkWorkPageData, SocialDirectChatView, SocialFriendRequestAcceptanceResponse, SocialFriendRequestMutationResponse, SocialFriendRequestPendingCountResponse, SocialFriendshipMutationResponse, SocialUserBlockSummary, SocialUserProfileView, SocialUserSearchResult, SocialUserSettingsView, SubmitFriendRequestRequest, UpdateContactPreferencesRequest, UpdateContactTagRequest, UpdateSocialUserProfileRequest, UpdateSocialUserSettingsRequest } from '../types';


export class SocialContactsPreferencesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve contact preferences */
  async retrieve(targetUserId: string, requestOptions?: ApiRequestOptions): Promise<ContactPreferencesView> {
    return this.client.request<ContactPreferencesView>(imApiPath(`/social/contacts/${serializePathParameter(targetUserId, { name: 'targetUserId', style: 'simple', explode: false })}/preferences`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'item' });
  }

/** Update contact preferences */
  async update(targetUserId: string, body: UpdateContactPreferencesRequest, requestOptions?: ApiRequestOptions): Promise<ContactPreferencesView> {
    return this.client.request<ContactPreferencesView>(imApiPath(`/social/contacts/${serializePathParameter(targetUserId, { name: 'targetUserId', style: 'simple', explode: false })}/preferences`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }
}

export class SocialContactsRecommendationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Create a contact recommendation */
  async create(targetUserId: string, body: CreateContactRecommendationRequest, requestOptions?: ApiRequestOptions): Promise<ContactRecommendationView> {
    return this.client.request<ContactRecommendationView>(imApiPath(`/social/contacts/${serializePathParameter(targetUserId, { name: 'targetUserId', style: 'simple', explode: false })}/recommendations`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }
}

export interface SocialContactsTagsListParams {
  pageSize?: number;
  cursor?: string;
}

export class SocialContactsTagsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List contact tags */
  async list(params?: SocialContactsTagsListParams, requestOptions?: ApiRequestOptions): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.request<SdkWorkPageData>(appendQueryString(imApiPath(`/social/contacts/tags`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }

/** Create a contact tag */
  async create(body: CreateContactTagRequest, requestOptions?: ApiRequestOptions): Promise<ContactTagView> {
    return this.client.request<ContactTagView>(imApiPath(`/social/contacts/tags`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }

/** Update a contact tag */
  async update(tagId: string, body: UpdateContactTagRequest, requestOptions?: ApiRequestOptions): Promise<ContactTagView> {
    return this.client.request<ContactTagView>(imApiPath(`/social/contacts/tags/${serializePathParameter(tagId, { name: 'tagId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }

/** Delete a contact tag */
  async delete(tagId: string, requestOptions?: ApiRequestOptions): Promise<void> {
    return this.client.request<void>(imApiPath(`/social/contacts/tags/${serializePathParameter(tagId, { name: 'tagId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'DELETE' as any });
  }
}

export interface SocialContactsListParams {
  pageSize?: number;
  cursor?: string;
}

export class SocialContactsApi {
  private client: HttpClient;
  public readonly tags: SocialContactsTagsApi;
  public readonly recommendations: SocialContactsRecommendationsApi;
  public readonly preferences: SocialContactsPreferencesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.tags = new SocialContactsTagsApi(client);
    this.recommendations = new SocialContactsRecommendationsApi(client);
    this.preferences = new SocialContactsPreferencesApi(client);
  }


/** List social contacts */
  async list(params?: SocialContactsListParams, requestOptions?: ApiRequestOptions): Promise<{ items: ContactView[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    const query = buildQueryString([
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.request<{ items: ContactView[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(appendQueryString(imApiPath(`/social/contacts`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }
}

export interface SocialUserBlocksListParams {
  pageSize?: number;
  cursor?: string;
}

export class SocialUserBlocksApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List user blocks created by the authenticated user */
  async list(params?: SocialUserBlocksListParams, requestOptions?: ApiRequestOptions): Promise<{ items: SocialUserBlockSummary[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    const query = buildQueryString([
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.request<{ items: SocialUserBlockSummary[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(appendQueryString(imApiPath(`/social/user_blocks`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }

/** Block a social user */
  async create(body: BlockUserRequest, requestOptions?: ApiRequestOptions): Promise<OpenApiUserBlockResponse> {
    return this.client.request<OpenApiUserBlockResponse>(imApiPath(`/social/user_blocks`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }

/** Release a social user block */
  async delete(blockId: string, requestOptions?: ApiRequestOptions): Promise<void> {
    return this.client.request<void>(imApiPath(`/social/user_blocks/${serializePathParameter(blockId, { name: 'blockId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'DELETE' as any });
  }
}

export class SocialFriendRequestsPendingCountApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve pending incoming friend request count */
  async retrieve(requestOptions?: ApiRequestOptions): Promise<SocialFriendRequestPendingCountResponse> {
    return this.client.request<SocialFriendRequestPendingCountResponse>(imApiPath(`/social/friend_requests/pending/count`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'item' });
  }
}

export class SocialFriendRequestsPendingApi {
  public readonly count: SocialFriendRequestsPendingCountApi;

  constructor(client: HttpClient) {
    this.count = new SocialFriendRequestsPendingCountApi(client);
  }

}

export interface SocialFriendRequestsListParams {
  direction?: 'incoming' | 'outgoing';
  status?: 'pending' | 'accepted' | 'declined' | 'canceled' | 'expired' | 'all';
  pageSize?: number;
  cursor?: string;
}

export class SocialFriendRequestsApi {
  private client: HttpClient;
  public readonly pending: SocialFriendRequestsPendingApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.pending = new SocialFriendRequestsPendingApi(client);
  }


/** List friend requests */
  async list(params?: SocialFriendRequestsListParams, requestOptions?: ApiRequestOptions): Promise<SdkWorkPageData> {
    const query = buildQueryString([
      { name: 'direction', value: params?.direction, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.request<SdkWorkPageData>(appendQueryString(imApiPath(`/social/friend_requests`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }

/** Create a friend request */
  async create(body: SubmitFriendRequestRequest, requestOptions?: ApiRequestOptions): Promise<SocialFriendRequestMutationResponse> {
    return this.client.request<SocialFriendRequestMutationResponse>(imApiPath(`/social/friend_requests`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }

/** Accept a friend request */
  async accept(friendRequestId: string, requestOptions?: ApiRequestOptions): Promise<SocialFriendRequestAcceptanceResponse> {
    return this.client.request<SocialFriendRequestAcceptanceResponse>(imApiPath(`/social/friend_requests/${serializePathParameter(friendRequestId, { name: 'friendRequestId', style: 'simple', explode: false })}/accept`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, sdkworkUnwrapKind: 'item' });
  }

/** Decline a friend request */
  async decline(friendRequestId: string, requestOptions?: ApiRequestOptions): Promise<SocialFriendRequestMutationResponse> {
    return this.client.request<SocialFriendRequestMutationResponse>(imApiPath(`/social/friend_requests/${serializePathParameter(friendRequestId, { name: 'friendRequestId', style: 'simple', explode: false })}/decline`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, sdkworkUnwrapKind: 'item' });
  }

/** Cancel a friend request */
  async cancel(friendRequestId: string, requestOptions?: ApiRequestOptions): Promise<SocialFriendRequestMutationResponse> {
    return this.client.request<SocialFriendRequestMutationResponse>(imApiPath(`/social/friend_requests/${serializePathParameter(friendRequestId, { name: 'friendRequestId', style: 'simple', explode: false })}/cancel`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, sdkworkUnwrapKind: 'item' });
  }
}

export interface SocialDirectChatsListParams {
  pageSize?: number;
  cursor?: string;
}

export class SocialDirectChatsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List direct chats of the authenticated user */
  async list(params?: SocialDirectChatsListParams, requestOptions?: ApiRequestOptions): Promise<{ items: SocialDirectChatView[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    const query = buildQueryString([
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.request<{ items: SocialDirectChatView[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(appendQueryString(imApiPath(`/social/direct_chats`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }

/** Retrieve a direct chat */
  async retrieve(directChatId: string, requestOptions?: ApiRequestOptions): Promise<SocialDirectChatView> {
    return this.client.request<SocialDirectChatView>(imApiPath(`/social/direct_chats/${serializePathParameter(directChatId, { name: 'directChatId', style: 'simple', explode: false })}`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'item' });
  }
}

export interface SocialFriendshipsListParams {
  pageSize?: number;
  cursor?: string;
}

export class SocialFriendshipsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List friendships of the authenticated user */
  async list(params?: SocialFriendshipsListParams, requestOptions?: ApiRequestOptions): Promise<{ items: Friendship[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    const query = buildQueryString([
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.request<{ items: Friendship[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(appendQueryString(imApiPath(`/social/friendships`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }

/** Remove a friendship */
  async remove(friendshipId: string, requestOptions?: ApiRequestOptions): Promise<SocialFriendshipMutationResponse> {
    return this.client.request<SocialFriendshipMutationResponse>(imApiPath(`/social/friendships/${serializePathParameter(friendshipId, { name: 'friendshipId', style: 'simple', explode: false })}/remove`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'POST' as any, sdkworkUnwrapKind: 'item' });
  }
}

export class SocialUsersSettingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve social user settings */
  async retrieve(userId: string, requestOptions?: ApiRequestOptions): Promise<SocialUserSettingsView> {
    return this.client.request<SocialUserSettingsView>(imApiPath(`/social/users/${serializePathParameter(userId, { name: 'userId', style: 'simple', explode: false })}/settings`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'item' });
  }

/** Update social user settings */
  async update(userId: string, body: UpdateSocialUserSettingsRequest, requestOptions?: ApiRequestOptions): Promise<SocialUserSettingsView> {
    return this.client.request<SocialUserSettingsView>(imApiPath(`/social/users/${serializePathParameter(userId, { name: 'userId', style: 'simple', explode: false })}/settings`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }
}

export class SocialUsersProfileApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve a social user profile */
  async retrieve(userId: string, requestOptions?: ApiRequestOptions): Promise<SocialUserProfileView> {
    return this.client.request<SocialUserProfileView>(imApiPath(`/social/users/${serializePathParameter(userId, { name: 'userId', style: 'simple', explode: false })}/profile`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'item' });
  }

/** Update the authenticated user profile */
  async update(userId: string, body: UpdateSocialUserProfileRequest, requestOptions?: ApiRequestOptions): Promise<SocialUserProfileView> {
    return this.client.request<SocialUserProfileView>(imApiPath(`/social/users/${serializePathParameter(userId, { name: 'userId', style: 'simple', explode: false })}/profile`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'PATCH' as any, body, contentType: 'application/json', sdkworkUnwrapKind: 'item' });
  }
}

export interface SocialUsersListParams {
  q?: string;
  pageSize?: number;
  cursor?: string;
}

export class SocialUsersApi {
  private client: HttpClient;
  public readonly profile: SocialUsersProfileApi;
  public readonly settings: SocialUsersSettingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.profile = new SocialUsersProfileApi(client);
    this.settings = new SocialUsersSettingsApi(client);
  }


/** Search social users */
  async list(params?: SocialUsersListParams, requestOptions?: ApiRequestOptions): Promise<{ items: SocialUserSearchResult[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }> {
    const query = buildQueryString([
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.request<{ items: SocialUserSearchResult[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; }>(appendQueryString(imApiPath(`/social/users`), query), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'page' });
  }
}

export class SocialApi {
  public readonly users: SocialUsersApi;
  public readonly friendships: SocialFriendshipsApi;
  public readonly directChats: SocialDirectChatsApi;
  public readonly friendRequests: SocialFriendRequestsApi;
  public readonly userBlocks: SocialUserBlocksApi;
  public readonly contacts: SocialContactsApi;

  constructor(client: HttpClient) {
    this.users = new SocialUsersApi(client);
    this.friendships = new SocialFriendshipsApi(client);
    this.directChats = new SocialDirectChatsApi(client);
    this.friendRequests = new SocialFriendRequestsApi(client);
    this.userBlocks = new SocialUserBlocksApi(client);
    this.contacts = new SocialContactsApi(client);
  }

}

export function createSocialApi(client: HttpClient): SocialApi {
  return new SocialApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
}

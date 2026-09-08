/**
 * CMS app SDK composed facade.
 *
 * The generated `sdkwork-cms-app-sdk-typescript` is not materialized yet
 * (the CMS app-api OpenAPI contract still awaits sdkwork-v3 profile
 * alignment across its pre-existing delivery paths), so this facade composes
 * the CMS app-api favorites surface through the approved h5-core SDK boundary.
 * UI packages must not construct raw HTTP or auth headers; they consume this
 * client through `@sdkwork/im-h5-core/sdk`.
 */

import { resolveBaseUrl, type AuthTokenManager } from '@sdkwork/sdk-common';

export type CmsFavoriteType = 'link' | 'article' | 'image' | 'file' | 'voice' | 'chat';

export interface CmsFavoriteView {
  id: string;
  favoriteId: string;
  favoriteType: CmsFavoriteType;
  targetType: string;
  targetId: string;
  targetUuid: string | null;
  targetUrl: string | null;
  title: string;
  summary: string;
  sourceDisplayName: string;
  media: Record<string, unknown> | null;
  favoritedAt: string;
}

export interface CreateCmsFavoriteRequest {
  targetType: string;
  targetId?: string;
  targetUuid?: string;
  targetUrl?: string;
  favoriteType: CmsFavoriteType;
  title: string;
  summary: string;
  sourceDisplayName: string;
  media?: Record<string, unknown>;
}

export interface CmsFavoritePageInfo {
  mode: 'cursor';
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CmsFavoriteListResponse {
  items: CmsFavoriteView[];
  pageInfo: CmsFavoritePageInfo;
}

export interface CmsAppSdkClientOptions {
  baseUrl: string;
  tokenManager: AuthTokenManager;
}

interface CmsApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: { detail?: string } | null;
}

export class CmsAppSdkClient {
  private readonly baseUrl: string;
  private readonly tokenManager: AuthTokenManager;

  constructor(options: CmsAppSdkClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.tokenManager = options.tokenManager;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const accessToken = this.tokenManager.getAccessToken();
    const authToken = this.tokenManager.getAuthToken();
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> | undefined),
    };
    if (accessToken) {
      headers['Access-Token'] = accessToken;
    }
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    const payload = (await response
      .json()
      .catch(() => null)) as CmsApiEnvelope<T> | null;
    if (!payload || payload.ok !== true || payload.data === undefined) {
      const detail = payload?.error?.detail ?? `CMS request failed with status ${response.status}`;
      throw new Error(detail);
    }
    return payload.data;
  }

  readonly favorites = {
    create: (body: CreateCmsFavoriteRequest): Promise<{ item: CmsFavoriteView }> =>
      this.request('/app/v3/api/cms/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    list: (params?: {
      favoriteType?: CmsFavoriteType;
      q?: string;
      cursor?: string;
      pageSize?: number;
    }): Promise<CmsFavoriteListResponse> => {
      const search = new URLSearchParams();
      if (params?.favoriteType) search.set('favoriteType', params.favoriteType);
      if (params?.q) search.set('q', params.q);
      if (params?.cursor) search.set('cursor', params.cursor);
      if (params?.pageSize !== undefined) search.set('page_size', String(params.pageSize));
      const query = search.toString();
      return this.request(`/app/v3/api/cms/favorites${query ? `?${query}` : ''}`);
    },
    delete: (favoriteId: string): Promise<{ deleted: boolean }> =>
      this.request(`/app/v3/api/cms/favorites/${encodeURIComponent(favoriteId)}`, {
        method: 'DELETE',
      }),
  };
}

let cmsAppSdkClient: CmsAppSdkClient | null = null;

function resolveCmsAppBaseUrl(): string {
  // Single shared base-url key; the matching API host is chosen from the
  // current page's environment+brand. This SDK client expects a bare origin
  // (the client appends /app/v3/api to request paths itself).
  return resolveBaseUrl({ envKey: 'SDKWORK_API_BASE_URL' }).url;
}

export function createCmsAppSdkClientConfig(
  config: Partial<CmsAppSdkClientOptions> = {},
): CmsAppSdkClientOptions {
  return {
    baseUrl: config.baseUrl ?? resolveCmsAppBaseUrl(),
    tokenManager: config.tokenManager as AuthTokenManager,
  };
}

export function initCmsAppSdkClient(
  config: CmsAppSdkClientOptions = createCmsAppSdkClientConfig(),
): CmsAppSdkClient {
  cmsAppSdkClient = new CmsAppSdkClient(config);
  return cmsAppSdkClient;
}

export function getCmsAppSdkClient(): CmsAppSdkClient {
  return cmsAppSdkClient ?? initCmsAppSdkClient();
}

export function resetCmsAppSdkClient(): void {
  cmsAppSdkClient = null;
}

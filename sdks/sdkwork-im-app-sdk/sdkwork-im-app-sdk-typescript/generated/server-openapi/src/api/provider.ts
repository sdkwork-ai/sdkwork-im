import { appApiPath } from './paths';
import type { ApiRequestOptions, HttpClient } from '../http/client';



export class ProviderMediaHealthApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Retrieve media provider health */
  async retrieve(requestOptions?: ApiRequestOptions): Promise<Record<string, unknown>> {
    return this.client.request<Record<string, unknown>>(appApiPath(`/media/provider_health`), { ...(requestOptions?.signal !== undefined ? { signal: requestOptions.signal } : {}), ...(requestOptions?.timeout !== undefined ? { timeout: requestOptions.timeout } : {}), method: 'GET' as any, sdkworkUnwrapKind: 'item' });
  }
}

export class ProviderApi {
  public readonly mediaHealth: ProviderMediaHealthApi;

  constructor(client: HttpClient) {
    this.mediaHealth = new ProviderMediaHealthApi(client);
  }

}

export function createProviderApi(client: HttpClient): ProviderApi {
  return new ProviderApi(client);
}

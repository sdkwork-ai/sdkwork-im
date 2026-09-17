/// <reference types="miniprogram-api-typings" />

/**
 * `fetch` polyfill over `wx.request`.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8. Every generated
 * SDKWork SDK (IM, IAM) is built on the standard `fetch` contract, which the
 * WeChat mini program runtime does not provide. Installing this adapter in
 * bootstrap is what lets the generated clients run unmodified.
 *
 * Deliberately not installed: nothing. `installWeixinFetch` is a no-op when a
 * conforming `fetch` already exists, so the same bootstrap works in the WeChat
 * devtools, in WeChat itself, and under Node test runners.
 *
 * Known limitations (kept explicit instead of silently degrading):
 * - Streaming request/response bodies are not supported by `wx.request`.
 * - `Request`/`Response` objects are duck-typed, not real class instances.
 */

export interface WxRequestTask {
  abort(): void;
}

export interface WxRequestSuccessResult {
  statusCode: number;
  data: unknown;
  header: Record<string, string>;
  cookies?: string[];
}

export interface WxRequestFailResult {
  errMsg?: string;
}

export interface WxRequestOptions {
  url: string;
  method?: string;
  header?: Record<string, string>;
  data?: string | ArrayBuffer | undefined;
  success(result: WxRequestSuccessResult): void;
  fail(result: WxRequestFailResult): void;
}

export interface WxRequestApi {
  request(options: WxRequestOptions): WxRequestTask;
}

type FetchHeaders = Record<string, string>;

interface FetchInit {
  method?: string;
  headers?: HeadersInit;
  body?: string | ArrayBuffer | null;
  signal?: AbortSignal | null;
}

function normalizeHeaders(headers?: HeadersInit): FetchHeaders {
  if (!headers) {
    return {};
  }
  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    const normalized: FetchHeaders = {};
    headers.forEach((value, key) => {
      normalized[key] = value;
    });
    return normalized;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers) as FetchHeaders;
  }
  return { ...(headers as Record<string, string>) };
}

function createFetchResponse(
  statusCode: number,
  data: unknown,
  header: Record<string, string>,
): Response {
  const headerMap = new Map(
    Object.entries(header).map(([key, value]) => [key.toLowerCase(), value]),
  );

  const response = {
    ok: statusCode >= 200 && statusCode < 300,
    status: statusCode,
    headers: {
      get(name: string): string | null {
        return headerMap.get(name.toLowerCase()) ?? null;
      },
    },
    async json(): Promise<unknown> {
      return typeof data === "string" ? (JSON.parse(data) as unknown) : data;
    },
    async text(): Promise<string> {
      return typeof data === "string" ? data : JSON.stringify(data);
    },
  };

  return response as unknown as Response;
}

/** Serializes a `fetch` body into the shape `wx.request` accepts. */
export function normalizeWxRequestBody(body?: string | ArrayBuffer | null): string | ArrayBuffer | undefined {
  if (body === null || body === undefined) {
    return undefined;
  }
  return body;
}

export function createWeixinFetch(
  request: WxRequestApi["request"],
): typeof fetch {
  return (async (input: RequestInfo | URL, init: FetchInit = {}): Promise<Response> => {
    const url = typeof input === "string" ? input : String(input);
    const method = (init.method ?? "GET").toUpperCase();
    const headers = normalizeHeaders(init.headers);
    const data = normalizeWxRequestBody(init.body ?? null);

    if (data !== undefined && !headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }

    return await new Promise<Response>((resolve, reject) => {
      const task = request({
        url,
        method,
        header: headers,
        data,
        success(result) {
          resolve(createFetchResponse(result.statusCode, result.data, result.header ?? {}));
        },
        fail(result) {
          reject(new Error(result.errMsg ?? "wx.request failed"));
        },
      });

      const signal = init.signal;
      if (!signal) {
        return;
      }
      if (signal.aborted) {
        task.abort();
        reject(new Error("Request was cancelled"));
        return;
      }
      signal.addEventListener(
        "abort",
        () => {
          task.abort();
          reject(new Error("Request was cancelled"));
        },
        { once: true },
      );
    });
  }) as typeof fetch;
}

/** Reads the WeChat request API off the runtime global. */
export function readWeixinRequestApi(): WxRequestApi {
  const candidate = (globalThis as { wx?: Partial<WxRequestApi> }).wx;
  if (!candidate || typeof candidate.request !== "function") {
    throw new Error("WeChat wx.request is unavailable");
  }
  return candidate as WxRequestApi;
}

/**
 * Installs the `fetch` polyfill when the runtime lacks one.
 *
 * Returns `true` when the polyfill was installed, `false` when the runtime
 * already provides `fetch` (Node test runners, newer devtools).
 */
export function installWeixinFetch(): boolean {
  if (typeof globalThis.fetch === "function") {
    return false;
  }
  const request = readWeixinRequestApi();
  (globalThis as { fetch: typeof fetch }).fetch = createWeixinFetch(request.request);
  return true;
}

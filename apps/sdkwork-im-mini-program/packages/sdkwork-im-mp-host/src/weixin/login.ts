/// <reference types="miniprogram-api-typings" />

/**
 * `wx.login` adapter.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8. The one-time
 * `jsCode` returned here is the only credential the mini program can obtain
 * from the platform; it is exchanged for an IAM dual-token session through the
 * generated IAM app SDK (`oauth.miniProgramSessions.create`).
 *
 * The code is never logged and never persisted: it is single-use and
 * short-lived, and a leaked code is a usable credential for the exchange.
 */

export interface WxLoginResult {
  code?: string;
  errMsg?: string;
}

export interface WxLoginApi {
  login(options: {
    timeout?: number;
    success(result: WxLoginResult): void;
    fail(result: WxLoginResult): void;
  }): void;
}

export interface ImMpLoginCodeProvider {
  /** Resolves the one-time login code; rejects with a readable message. */
  requestLoginCode(): Promise<string>;
}

/** Default timeout for `wx.login`, in milliseconds. */
const DEFAULT_LOGIN_TIMEOUT_MS = 10_000;

export function createWeixinLoginCodeProvider(
  login: WxLoginApi["login"],
  timeoutMs: number = DEFAULT_LOGIN_TIMEOUT_MS,
): ImMpLoginCodeProvider {
  return {
    async requestLoginCode(): Promise<string> {
      return await new Promise<string>((resolve, reject) => {
        login({
          timeout: timeoutMs,
          success(result) {
            const code = typeof result.code === "string" ? result.code.trim() : "";
            if (code) {
              resolve(code);
              return;
            }
            // `errMsg` is the platform's own wording; keeping it makes a failed
            // login diagnosable without guessing which platform rule blocked it.
            reject(new Error(result.errMsg ?? "wx.login returned no code"));
          },
          fail(result) {
            reject(new Error(result.errMsg ?? "wx.login failed"));
          },
        });
      });
    },
  };
}

export function readWeixinLoginApi(): WxLoginApi {
  const candidate = (globalThis as { wx?: Partial<WxLoginApi> }).wx;
  if (!candidate || typeof candidate.login !== "function") {
    throw new Error("WeChat wx.login is unavailable");
  }
  return candidate as WxLoginApi;
}

export function createWeixinLoginCodeProviderFromGlobal(): ImMpLoginCodeProvider {
  return createWeixinLoginCodeProvider(readWeixinLoginApi().login);
}

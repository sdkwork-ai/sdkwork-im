/**
 * WeChat media picking adapter.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8 — the only
 * package allowed to touch `wx.*`. Chat image bytes leave the picker as a
 * `readRange` source so the Drive uploader can stream ranged reads through
 * `FileSystemManager` without loading a whole image into memory.
 *
 * The injected-argument factory keeps every path unit-testable under Node.
 */

import type { ImMpHostAdapterResult } from "@sdkwork/im-mp-core/host";

/** A picked image exposed as a ranged byte source (`DRIVE_SPEC.md` §8). */
export interface ImMpPickedImageSource {
  readonly size: number;
  readonly name?: string;
  readonly type?: string;
  readRange(offsetBytes: number, lengthBytes: number): Promise<ArrayBuffer>;
}

export interface ImMpMediaAdapter {
  /** Picks one compressed image; resolves `null` when the user cancels. */
  chooseChatImage(): Promise<ImMpHostAdapterResult<ImMpPickedImageSource>>;
}

interface WxChooseMediaResponse {
  tempFiles: Array<{
    tempFilePath: string;
    size: number;
  }>;
}

interface WxFileSystemManagerLike {
  readFile(options: {
    filePath: string;
    position?: number;
    length?: number;
    success(result: { data: ArrayBuffer }): void;
    fail(error: { errMsg?: string }): void;
  }): void;
}

interface WxMediaLike {
  chooseMedia(options: {
    count: number;
    mediaType: string[];
    sourceType: string[];
    sizeType: string[];
    success(result: WxChooseMediaResponse): void;
    fail(error: { errMsg?: string }): void;
  }): void;
  getFileSystemManager(): WxFileSystemManagerLike;
}

const CHUNK_BYTES = 256 * 1024;

function readRangeWith(
  fileSystem: WxFileSystemManagerLike,
  filePath: string,
  offsetBytes: number,
  lengthBytes: number,
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    fileSystem.readFile({
      filePath,
      position: offsetBytes,
      length: lengthBytes,
      success: (result) => resolve(result.data),
      fail: (error) => reject(new Error(error?.errMsg ?? "readFile failed")),
    });
  });
}

function chooseMediaWith(wx: WxMediaLike): Promise<ImMpHostAdapterResult<ImMpPickedImageSource>> {
  return new Promise((resolve) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      sizeType: ["compressed"],
      success: (result) => {
        const file = result.tempFiles[0];
        if (!file) {
          resolve({ ok: false, error: "cancelled" });
          return;
        }
        const fileSystem = wx.getFileSystemManager();
        resolve({
          ok: true,
          value: {
            size: file.size,
            name: file.tempFilePath.split("/").pop() ?? "chat-image.jpg",
            type: "image/jpeg",
            async readRange(offsetBytes: number, lengthBytes: number): Promise<ArrayBuffer> {
              return readRangeWith(fileSystem, file.tempFilePath, offsetBytes, lengthBytes);
            },
          },
        });
      },
      fail: (error) => {
        const message = error?.errMsg ?? "";
        resolve({ ok: false, error: message.includes("cancel") ? "cancelled" : "unavailable" });
      },
    });
  });
}

export function createWeixinMediaAdapter(): ImMpMediaAdapter {
  const globalWx = (globalThis as { wx?: WxMediaLike }).wx;
  if (!globalWx) {
    return {
      chooseChatImage: async () => ({ ok: false, error: "unavailable" as const }),
    };
  }
  return {
    chooseChatImage: () => chooseMediaWith(globalWx),
  };
}

/**
 * Injected-argument factory for Node tests: exercises the same mapping
 * against a recorded `wx` object instead of the platform global.
 */
export function createMediaAdapterFromWx(wx: WxMediaLike): ImMpMediaAdapter {
  return {
    chooseChatImage: () => chooseMediaWith(wx),
  };
}

export const IM_MP_MEDIA_CHUNK_BYTES = CHUNK_BYTES;

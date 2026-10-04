/**
 * Chat media service for the IM mini program.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and
 * `DRIVE_SPEC.md` section 18.3. Bytes enter Drive only through the composed
 * upload service (`@sdkwork/drive-upload-image-core`) bound with this
 * surface's declared intent; the message record carries the stable
 * `drive://` identity only. Download grants are requested per render with a
 * bounded cache (same policy as the H5 reference), so a rebuilt thread never
 * mints a second grant for an already-visible node.
 *
 * The Drive uploader/grant client is injected — capability packages never
 * construct an SDK client.
 */

import { createDriveUploadImageService, type DriveUploadImageFileLike } from "@sdkwork/drive-upload-image-core";

import { IM_MP_CHAT_IMAGE_UPLOAD } from "../uploadDeclaration";

/** Narrow Drive port the bootstrap injects from `@sdkwork/im-mp-core/sdk`. */
export interface ImMpChatMediaDrivePort {
  readonly uploader: unknown;
  createDownloadGrant(nodeId: string): Promise<string>;
}

export interface ImMpChatMediaUpload {
  readonly driveUri: string;
  readonly spaceId: string;
  readonly nodeId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: string;
}

export interface ImMpChatMediaService {
  /** Uploads one chat image and returns the persist-safe Drive identity. */
  uploadChatImage(request: {
    file: DriveUploadImageFileLike;
    appResourceId: string;
  }): Promise<ImMpChatMediaUpload>;
  /** Resolves a short-lived display URL for a stored node. */
  resolveChatMediaUrl(nodeId: string): Promise<string>;
}

interface DriveUploadImageValueLike {
  readonly uri?: unknown;
  readonly driveMetadata?: Readonly<Record<string, unknown>>;
}

const DOWNLOAD_URL_CACHE_TTL_MS = 8 * 60 * 1000;
const DOWNLOAD_URL_CACHE_MAX_ENTRIES = 500;

export function createImMpChatMediaService(
  resolveDrivePort: () => ImMpChatMediaDrivePort,
): ImMpChatMediaService {
  // One composed service instance reuses the injected uploader; the Drive
  // client itself is created once by the root bootstrap.
  let imageService: ReturnType<typeof createDriveUploadImageService> | null = null;

  const resolveService = () => {
    if (!imageService) {
      const port = resolveDrivePort();
      imageService = createDriveUploadImageService({
        // The generated uploader surface is structurally satisfied by the
        // composed Drive client; the narrow port keeps the dependency edge
        // inside the bootstrap.
        uploader: port.uploader as Parameters<typeof createDriveUploadImageService>[0]["uploader"],
        declaration: IM_MP_CHAT_IMAGE_UPLOAD,
      });
    }
    return imageService;
  };

  const downloadUrlCache = new Map<string, { url: string; expiresAt: number }>();

  return {
    async uploadChatImage({ file, appResourceId }) {
      if (!appResourceId.trim()) {
        throw new Error("Chat media upload requires the conversation id.");
      }
      const value = (await resolveService().upload({
        file,
        appResourceId: appResourceId.trim(),
      })) as DriveUploadImageValueLike;
      const metadata = value.driveMetadata ?? {};
      const spaceId = typeof metadata.spaceId === "string" ? metadata.spaceId : "";
      const nodeId = typeof metadata.nodeId === "string" ? metadata.nodeId : "";
      if (!spaceId || !nodeId) {
        throw new Error("Drive upload did not return a space or node id.");
      }
      const fileName = typeof metadata.originalFileName === "string" && metadata.originalFileName
        ? metadata.originalFileName
        : typeof file.name === "string" && file.name
          ? file.name
          : "chat-image.jpg";
      const mimeType = typeof metadata.contentType === "string" && metadata.contentType
        ? metadata.contentType
        : typeof file.type === "string" && file.type
          ? file.type
          : "image/jpeg";
      const sizeBytes = typeof metadata.contentLength === "string" && metadata.contentLength
        ? metadata.contentLength
        : String(file.size);
      const driveUri =
        typeof value.uri === "string" && value.uri
          ? value.uri
          : `drive://spaces/${spaceId}/nodes/${nodeId}`;
      return {
        driveUri,
        spaceId,
        nodeId,
        fileName,
        mimeType,
        sizeBytes,
      };
    },

    async resolveChatMediaUrl(nodeId) {
      const cached = downloadUrlCache.get(nodeId);
      if (cached && cached.expiresAt > Date.now()) {
        // Refresh LRU position.
        downloadUrlCache.delete(nodeId);
        downloadUrlCache.set(nodeId, cached);
        return cached.url;
      }
      const url = await resolveDrivePort().createDownloadGrant(nodeId);
      if (downloadUrlCache.size >= DOWNLOAD_URL_CACHE_MAX_ENTRIES) {
        const oldest = downloadUrlCache.keys().next();
        if (!oldest.done) {
          downloadUrlCache.delete(oldest.value);
        }
      }
      downloadUrlCache.set(nodeId, { url, expiresAt: Date.now() + DOWNLOAD_URL_CACHE_TTL_MS });
      return url;
    },
  };
}

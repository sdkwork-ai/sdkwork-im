import { createDriveUploadImageService, type DriveUploadImageFileLike } from "@sdkwork/drive-upload-image-core";
import {
  getDriveAppSdkClient,
  IM_H5_CHAT_IMAGE_UPLOAD,
  resolveImH5ChatMediaUpload,
  type DriveUploaderBlobLike,
  type DriveUploaderProfile,
  type DriveUploaderUploadResult,
  type SdkworkDriveAppClient,
} from '@sdkwork/im-h5-core/sdk';

export function getDriveAppSdkClientWithSession(): SdkworkDriveAppClient {
  return getDriveAppSdkClient();
}

export interface ChatMediaUpload {
  drive: { driveUri: string; spaceId: string; nodeId: string };
  resource: {
    id: string;
    kind: "image" | "file" | "audio" | "video" | "voice" | "document";
    source: "drive";
    uri: string;
    fileName?: string;
    mimeType?: string;
    sizeBytes?: string;
    durationSeconds?: number;
  };
  /**
   * Raw composed-uploader result. Image media rides the shared Drive
   * image-upload service, which returns the persist-safe
   * `DriveUploadImageValue` instead, so only non-image uploads carry it.
   */
  uploadResult?: DriveUploaderUploadResult;
}

/**
 * Bridges the composer blob onto the shared Drive image-upload file contract,
 * keeping the caller's declared identity (`options.fileName`/`options.mimeType`)
 * as the upload metadata with the blob's own identity as fallback.
 */
function toChatImageFileLike(
  file: DriveUploaderBlobLike,
  options: { fileName?: string; mimeType?: string },
): DriveUploadImageFileLike {
  const arrayBuffer = file.arrayBuffer?.bind(file);
  const readRange = file.readRange?.bind(file);
  return {
    size: file.size,
    ...(options.fileName ? { name: options.fileName } : file.name === undefined ? {} : { name: file.name }),
    ...(options.mimeType ? { type: options.mimeType } : file.type === undefined ? {} : { type: file.type }),
    ...(arrayBuffer === undefined ? {} : { arrayBuffer }),
    ...(readRange === undefined ? {} : { readRange }),
  };
}

export async function uploadChatMedia(
  conversationId: string,
  file: DriveUploaderBlobLike,
  kind: ChatMediaUpload["resource"]["kind"],
  options: { durationSeconds?: number; fileName?: string; mimeType?: string } = {},
): Promise<ChatMediaUpload> {
  const client = getDriveAppSdkClientWithSession();
  const declared = resolveImH5ChatMediaUpload(kind);
  if (kind === "image") {
    // Image media enters Drive through the shared image-upload service: the
    // declared intent (`IM_H5_CHAT_IMAGE_UPLOAD`) is bound with the composed
    // uploader here and the persist-safe value is mapped back onto
    // `ChatMediaUpload` so callers and UI stay unchanged (`DRIVE_SPEC.md`
    // section 18.3). Chat bubble previews stay on the download-grant cache
    // below; the service's data-url preview reader is not used here.
    const imageService = createDriveUploadImageService({
      uploader: client.uploader,
      declaration: IM_H5_CHAT_IMAGE_UPLOAD,
    });
    const value = await imageService.upload({
      file: toChatImageFileLike(file, options),
      appResourceId: conversationId,
    });
    const driveMeta = value.metadata?.drive;
    if (!driveMeta) throw new Error("Drive image upload did not return drive metadata.");
    const driveUri = value.uri;
    return {
      drive: { driveUri, spaceId: driveMeta.spaceId, nodeId: driveMeta.nodeId },
      resource: {
        id: driveMeta.nodeId, kind, source: "drive", uri: driveUri,
        ...(driveMeta.originalFileName ? { fileName: driveMeta.originalFileName } : {}),
        ...(driveMeta.contentType ? { mimeType: driveMeta.contentType } : {}),
        ...(driveMeta.contentLength ? { sizeBytes: driveMeta.contentLength } : {}),
        ...(options.durationSeconds !== undefined ? { durationSeconds: options.durationSeconds } : {}),
      },
    };
  }
  const profile: DriveUploaderProfile = declared.uploadProfileCode as DriveUploaderProfile;
  const request = {
    file, appResourceType: declared.appResourceType, appResourceId: conversationId, scene: declared.scene, source: declared.source, uploadProfileCode: profile,
    ...(options.fileName ? { originalFileName: options.fileName } : {}), ...(options.mimeType ? { contentType: options.mimeType } : {}),
  };
  const uploadResult = kind === "video" ? await client.uploader.uploadVideo(request) : kind === "voice" || kind === "audio" ? await client.uploader.uploadAudio(request) : await client.uploader.uploadAttachment(request);
  const spaceId = uploadResult.uploadItem.spaceId || uploadResult.uploadSession.spaceId;
  const nodeId = uploadResult.uploadItem.nodeId || uploadResult.uploadSession.nodeId;
  if (!spaceId || !nodeId) throw new Error("Drive upload did not return a space or node id.");
  const driveUri = `drive://spaces/${spaceId}/nodes/${nodeId}`;
  return { drive: { driveUri, spaceId, nodeId }, resource: { id: nodeId, kind, source: "drive", uri: driveUri, ...(uploadResult.uploadItem.originalFileName ? { fileName: uploadResult.uploadItem.originalFileName } : {}), ...(uploadResult.uploadItem.contentType ? { mimeType: uploadResult.uploadItem.contentType } : {}), ...(uploadResult.uploadItem.contentLength ? { sizeBytes: uploadResult.uploadItem.contentLength } : {}), ...(options.durationSeconds !== undefined ? { durationSeconds: options.durationSeconds } : {}) }, uploadResult };
}

// Download grants are requested with a 900s TTL; caching below that bound
// means a page reload or a realtime merge for an already-rendered node never
// re-issues a grant (fix: repeated full-page loads used to mint a new grant
// per message per load).
const DOWNLOAD_URL_CACHE_TTL_MS = 8 * 60 * 1000;
const DOWNLOAD_URL_CACHE_MAX_ENTRIES = 500;
const downloadUrlCache = new Map<string, { url: string; expiresAt: number }>();

export async function createChatMediaDownloadUrl(nodeId: string): Promise<string> {
  const cached = downloadUrlCache.get(nodeId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }
  const response = await getDriveAppSdkClientWithSession().drive.downloadGrants.create(nodeId, { requestedTtlSeconds: 900 });
  const url = response.downloadUrl || response.signedSourceUrl;
  if (!url) throw new Error("Drive download grant did not return a URL.");
  // Bound the cache: evict the oldest entry when it grows past the cap so a
  // busy conversation cannot accumulate grants indefinitely.
  if (downloadUrlCache.size >= DOWNLOAD_URL_CACHE_MAX_ENTRIES) {
    const oldestKey = downloadUrlCache.keys().next().value as string | undefined;
    if (oldestKey) downloadUrlCache.delete(oldestKey);
  }
  downloadUrlCache.set(nodeId, { url, expiresAt: Date.now() + DOWNLOAD_URL_CACHE_TTL_MS });
  return url;
}

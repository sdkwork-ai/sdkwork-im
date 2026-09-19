/**
 * Application upload declaration constants.
 *
 * Authority: `DRIVE_SPEC.md` section 18 (Application Upload Declaration Contract).
 * Declared values live in `apps/sdkwork-im-h5/specs/upload.declaration.json`; this module
 * carries them into code so upload call sites reference a constant instead of repeating
 * literals. Call sites MUST NOT inline these values.
 *
 * Two prior values were rule violations and are corrected here:
 *  - `scene = "im"` is Drive's reserved scene (`DRIVE_SPEC.md` section 9.4) and an application
 *    MUST NOT send it; the chat scene is now `chat-message-media`.
 *  - `appResourceType` must be a dotted `<domain>.<resource>` business type, and `source` a
 *    stable kebab-case call-origin label.
 */

export interface ImUploadDeclarationEntry {
  readonly appResourceIdKind: "application" | "entity" | "draft";
  readonly appResourceType: string;
  readonly purpose: string;
  readonly retention: "long_term" | "temporary";
  readonly scene: string;
  readonly source: string;
  readonly uploadProfileCode: string;
}

/** This application's canonical appId, from `sdkwork.app.config.json` `backend.appId`. */
export const IM_H5_APP_ID = "sdkwork-im-h5" as const;

/** The single call-origin label for every upload from this application. */
export const IM_H5_UPLOAD_SOURCE = "sdkwork-im-h5" as const;

const IM_APP_RESOURCE_ID_KIND = "entity" as const;
const IM_RETENTION = "long_term" as const;

const CHAT_MEDIA_APP_RESOURCE_TYPE = "im.conversation_message_media" as const;
const CHAT_MEDIA_SCENE = "chat-message-media" as const;

/**
 * Conversation media uploads.
 *
 * `DRIVE_SPEC.md` section 18.1 requires one entry per distinct
 * `(appResourceType, scene, uploadProfileCode)` triple, and the chat composer selects a profile
 * from the attachment kind, so each kind is declared separately. The four entries therefore
 * share `appResourceType` and `scene` and differ only by `uploadProfileCode`.
 */
export const IM_H5_CHAT_IMAGE_UPLOAD = {
  appResourceIdKind: IM_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: "Image attached to an IM conversation message from the H5 chat surface.",
  retention: IM_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_H5_UPLOAD_SOURCE,
  uploadProfileCode: "image",
} as const satisfies ImUploadDeclarationEntry;

export const IM_H5_CHAT_VIDEO_UPLOAD = {
  appResourceIdKind: IM_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: "Video attached to an IM conversation message from the H5 chat surface.",
  retention: IM_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_H5_UPLOAD_SOURCE,
  uploadProfileCode: "video",
} as const satisfies ImUploadDeclarationEntry;

export const IM_H5_CHAT_AUDIO_UPLOAD = {
  appResourceIdKind: IM_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: "Voice message attached to an IM conversation from the H5 chat surface.",
  retention: IM_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_H5_UPLOAD_SOURCE,
  uploadProfileCode: "audio",
} as const satisfies ImUploadDeclarationEntry;

export const IM_H5_CHAT_ATTACHMENT_UPLOAD = {
  appResourceIdKind: IM_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: "Generic file attached to an IM conversation message from the H5 chat surface.",
  retention: IM_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_H5_UPLOAD_SOURCE,
  uploadProfileCode: "attachment",
} as const satisfies ImUploadDeclarationEntry;

/** Voice-profile sample uploaded from the AI voice surface so a cloned voice can be reused. */
export const IM_H5_VOICE_PROFILE_UPLOAD = {
  appResourceIdKind: IM_APP_RESOURCE_ID_KIND,
  appResourceType: "voice.profile_sample",
  purpose:
    "Voice profile sample uploaded from the H5 AI voice surface so a cloned voice can be reused.",
  retention: IM_RETENTION,
  scene: "voice-profile",
  source: IM_H5_UPLOAD_SOURCE,
  uploadProfileCode: "audio",
} as const satisfies ImUploadDeclarationEntry;

/** Community post media uploaded from the IM H5 community surface. */
export const IM_H5_COMMUNITY_POST_UPLOAD = {
  appResourceIdKind: IM_APP_RESOURCE_ID_KIND,
  appResourceType: "community.post_media",
  purpose: "Community post media uploaded from the IM H5 community surface.",
  retention: IM_RETENTION,
  scene: "community-post",
  source: IM_H5_UPLOAD_SOURCE,
  uploadProfileCode: "image",
} as const satisfies ImUploadDeclarationEntry;

/** Every declared upload purpose for this application. */
export const IM_H5_UPLOAD_DECLARATIONS: readonly ImUploadDeclarationEntry[] = [
  IM_H5_CHAT_IMAGE_UPLOAD,
  IM_H5_CHAT_VIDEO_UPLOAD,
  IM_H5_CHAT_AUDIO_UPLOAD,
  IM_H5_CHAT_ATTACHMENT_UPLOAD,
  IM_H5_VOICE_PROFILE_UPLOAD,
  IM_H5_COMMUNITY_POST_UPLOAD,
];

/**
 * Map a chat attachment kind to the declared upload entry that carries its profile.
 *
 * The profile is chosen by content shape (`DRIVE_SPEC.md` section 18.2), so the kind-to-entry
 * mapping is the only lookup a call site needs.
 */
export function resolveImH5ChatMediaUpload(
  kind: "image" | "file" | "audio" | "video" | "voice" | "document",
): ImUploadDeclarationEntry {
  switch (kind) {
    case "image":
      return IM_H5_CHAT_IMAGE_UPLOAD;
    case "video":
      return IM_H5_CHAT_VIDEO_UPLOAD;
    case "audio":
    case "voice":
      return IM_H5_CHAT_AUDIO_UPLOAD;
    default:
      return IM_H5_CHAT_ATTACHMENT_UPLOAD;
  }
}

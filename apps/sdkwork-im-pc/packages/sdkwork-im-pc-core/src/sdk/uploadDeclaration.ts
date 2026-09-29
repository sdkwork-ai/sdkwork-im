/**
 * Application upload declaration constants.
 *
 * Authority: `DRIVE_SPEC.md` section 18 (Application Upload Declaration Contract).
 * Declared values live in `apps/sdkwork-im-pc/specs/upload.declaration.json`; this module
 * carries them into code so upload call sites reference a constant instead of repeating
 * literals. Call sites MUST NOT inline these values, and the declaration MUST NOT be
 * duplicated as a second local authority.
 *
 * The previous local values (`im_conversation` for `appResourceType`, `im` for `scene`,
 * `chat_message` for `source`) were not rule-conforming:
 * - `appResourceType` must be a dotted `<domain>.<resource>` business type;
 * - `scene` must be stable lowercase kebab-case, and `im` is **reserved by Drive** (§9.4), so an
 *   application must not declare or send it;
 * - `source` must be a stable kebab-case call-origin label.
 * They are converged here to the declared values.
 */

export interface ImPcUploadDeclarationEntry {
  readonly appResourceIdKind: 'application' | 'entity' | 'draft';
  readonly appResourceType: string;
  readonly purpose: string;
  readonly retention: 'long_term' | 'temporary';
  readonly scene: string;
  readonly source: string;
  readonly uploadProfileCode: string;
}

/** This application's canonical appId, from `sdkwork.app.config.json` `backend.appId`. */
export const IM_PC_APP_ID = 'sdkwork-im-pc' as const;

/** The single call-origin label for every upload from this application. */
export const IM_PC_UPLOAD_SOURCE = 'sdkwork-im-pc' as const;

const IM_PC_APP_RESOURCE_ID_KIND = 'entity' as const;
const IM_PC_RETENTION = 'long_term' as const;

const CHAT_MEDIA_APP_RESOURCE_TYPE = 'im.conversation_message_media' as const;
const CHAT_MEDIA_SCENE = 'chat-message-media' as const;

/**
 * Conversation media uploads.
 *
 * `DRIVE_SPEC.md` section 18.1 requires one entry per distinct
 * `(appResourceType, scene, uploadProfileCode)` triple, and the chat composer selects a profile
 * from the attachment kind, so each kind is declared separately. The four entries therefore
 * share `appResourceType` and `scene` and differ only by `uploadProfileCode`.
 */
export const IM_PC_CHAT_IMAGE_UPLOAD = {
  appResourceIdKind: IM_PC_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: 'Image attached to an IM conversation message from the desktop chat surface.',
  retention: IM_PC_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_PC_UPLOAD_SOURCE,
  uploadProfileCode: 'image',
} as const satisfies ImPcUploadDeclarationEntry;

export const IM_PC_CHAT_VIDEO_UPLOAD = {
  appResourceIdKind: IM_PC_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: 'Video attached to an IM conversation message from the desktop chat surface.',
  retention: IM_PC_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_PC_UPLOAD_SOURCE,
  uploadProfileCode: 'video',
} as const satisfies ImPcUploadDeclarationEntry;

export const IM_PC_CHAT_AUDIO_UPLOAD = {
  appResourceIdKind: IM_PC_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: 'Voice message attached to an IM conversation from the desktop chat surface.',
  retention: IM_PC_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_PC_UPLOAD_SOURCE,
  uploadProfileCode: 'audio',
} as const satisfies ImPcUploadDeclarationEntry;

export const IM_PC_CHAT_ATTACHMENT_UPLOAD = {
  appResourceIdKind: IM_PC_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: 'Generic file attached to an IM conversation message from the desktop chat surface.',
  retention: IM_PC_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_PC_UPLOAD_SOURCE,
  uploadProfileCode: 'attachment',
} as const satisfies ImPcUploadDeclarationEntry;

/** Every declared upload purpose for this application. */
export const IM_PC_UPLOAD_DECLARATIONS: readonly ImPcUploadDeclarationEntry[] = [
  IM_PC_CHAT_IMAGE_UPLOAD,
  IM_PC_CHAT_VIDEO_UPLOAD,
  IM_PC_CHAT_AUDIO_UPLOAD,
  IM_PC_CHAT_ATTACHMENT_UPLOAD,
];

/**
 * Map a chat attachment kind to the declared upload entry that carries its profile.
 *
 * The profile is chosen by content shape (`DRIVE_SPEC.md` section 18.2), so the kind-to-entry
 * mapping is the only lookup a call site needs.
 */
export function resolveImPcChatMediaUpload(
  kind: 'image' | 'file' | 'audio' | 'video' | 'voice' | 'document',
): ImPcUploadDeclarationEntry {
  switch (kind) {
    case 'image':
      return IM_PC_CHAT_IMAGE_UPLOAD;
    case 'video':
      return IM_PC_CHAT_VIDEO_UPLOAD;
    case 'audio':
    case 'voice':
      return IM_PC_CHAT_AUDIO_UPLOAD;
    default:
      return IM_PC_CHAT_ATTACHMENT_UPLOAD;
  }
}

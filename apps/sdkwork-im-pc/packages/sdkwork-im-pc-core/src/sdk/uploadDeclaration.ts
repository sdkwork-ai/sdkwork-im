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

export const IM_PC_CHAT_ATTACHMENT_UPLOAD = {
  appResourceIdKind: IM_PC_APP_RESOURCE_ID_KIND,
  appResourceType: 'im.conversation_message_media',
  purpose:
    'Media attached to an IM conversation message (image, video, voice, or file) uploaded from the desktop chat surface.',
  retention: IM_PC_RETENTION,
  scene: 'chat-message-media',
  source: IM_PC_UPLOAD_SOURCE,
  uploadProfileCode: 'attachment',
} as const satisfies ImPcUploadDeclarationEntry;

/** Every declared upload purpose for this application. */
export const IM_PC_UPLOAD_DECLARATIONS: readonly ImPcUploadDeclarationEntry[] = [
  IM_PC_CHAT_ATTACHMENT_UPLOAD,
];

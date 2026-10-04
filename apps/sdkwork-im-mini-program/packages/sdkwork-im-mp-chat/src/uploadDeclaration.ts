/**
 * Chat upload declaration for the IM mini program.
 *
 * Authority: `DRIVE_SPEC.md` section 18 (Application Upload Declaration
 * Contract). The declared values live in
 * `apps/sdkwork-im-mini-program/specs/upload.declaration.json`; this module
 * carries them into code so upload call sites reference a constant instead of
 * repeating literals. Call sites MUST NOT inline these values.
 *
 * `scene = "im"` is Drive's reserved scene (`DRIVE_SPEC.md` section 9.4); the
 * chat scene is `chat-message-media`, shared with the PC/H5/Flutter clients so
 * one `(appResourceType, scene, profile)` triple governs chat media on every
 * surface.
 */

export interface ImMpUploadDeclarationEntry {
  readonly appResourceIdKind: "application" | "entity" | "draft";
  readonly appResourceType: string;
  readonly purpose: string;
  readonly retention: "long_term" | "temporary";
  readonly scene: string;
  readonly source: string;
  readonly uploadProfileCode: string;
}

/** The single call-origin label for every upload from this application. */
export const IM_MP_UPLOAD_SOURCE = "sdkwork-im-mp" as const;

const IM_MP_APP_RESOURCE_ID_KIND = "entity" as const;
const IM_MP_RETENTION = "long_term" as const;
const CHAT_MEDIA_APP_RESOURCE_TYPE = "im.conversation_message_media" as const;
const CHAT_MEDIA_SCENE = "chat-message-media" as const;

/**
 * Conversation image upload.
 *
 * `DRIVE_SPEC.md` section 18.1 requires one entry per distinct
 * `(appResourceType, scene, uploadProfileCode)` triple; the mini program
 * ships images only, so one entry covers the composed image service.
 */
export const IM_MP_CHAT_IMAGE_UPLOAD = {
  appResourceIdKind: IM_MP_APP_RESOURCE_ID_KIND,
  appResourceType: CHAT_MEDIA_APP_RESOURCE_TYPE,
  purpose: "Image attached to an IM conversation message from the IM mini program surface.",
  retention: IM_MP_RETENTION,
  scene: CHAT_MEDIA_SCENE,
  source: IM_MP_UPLOAD_SOURCE,
  uploadProfileCode: "image",
} as const satisfies ImMpUploadDeclarationEntry;

/** Every declared upload purpose for this application. */
export const IM_MP_UPLOAD_DECLARATIONS: readonly ImMpUploadDeclarationEntry[] = [
  IM_MP_CHAT_IMAGE_UPLOAD,
];

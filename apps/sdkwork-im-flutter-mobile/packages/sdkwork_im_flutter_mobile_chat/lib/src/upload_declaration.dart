/// Application upload declaration constants (`DRIVE_SPEC.md` section 18).
///
/// Authority: `apps/sdkwork-im-flutter-mobile/specs/upload.declaration.json`.
/// Call sites MUST import these values instead of repeating literals; the
/// `im` scene is reserved by Drive (section 9.4) and MUST NOT be sent.
class ImFlutterChatImageUpload {
  static const String appResourceIdKind = 'entity';
  static const String appResourceType = 'im.conversation_message_media';
  static const String purpose =
      'Image attached to an IM conversation message from the flutter chat surface.';
  static const String retention = 'long_term';
  static const String scene = 'chat-message-media';
  static const String source = 'sdkwork-im-flutter-mobile';
  static const String uploadProfileCode = 'image';
}

/// The application's canonical appId, from `sdkwork.app.config.json`.
const String imFlutterAppId = 'sdkwork-im-flutter-mobile';

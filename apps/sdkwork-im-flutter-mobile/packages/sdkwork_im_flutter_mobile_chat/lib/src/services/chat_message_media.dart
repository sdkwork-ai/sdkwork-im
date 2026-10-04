import 'package:im_sdk_generated/im_sdk_generated.dart';

/// The Drive-backed attachment of one message, extracted for rendering.
class ChatMessageMedia {
  const ChatMessageMedia({
    required this.kind,
    required this.nodeId,
    this.fileName,
    this.mimeType,
    this.sizeBytes,
  });

  /// Resource kind as stored on the wire: `image`, `file`, `video`,
  /// `voice`, or `audio`.
  final String kind;
  final String nodeId;
  final String? fileName;
  final String? mimeType;

  /// int64-as-string per API_SPEC §13.6; never parsed into a JS-style
  /// number on the client.
  final String? sizeBytes;
}

/// Extracts the first Drive-backed media part of a message, or `null` for
/// text-only messages.
ChatMessageMedia? resolveChatMessageMedia(ConversationMessageEntry entry) {
  for (final part in entry.body.parts) {
    if (part is! MediaContentPart) {
      continue;
    }
    final nodeId = part.drive.nodeId;
    if (nodeId.isEmpty) {
      continue;
    }
    final resource = part.resource;
    final rawKind = resource.kind ?? resource.mediaKind ?? '';
    return ChatMessageMedia(
      kind: rawKind.isEmpty ? 'file' : rawKind,
      nodeId: nodeId,
      fileName: resource.fileName ?? resource.name,
      mimeType: resource.mimeType,
      sizeBytes: resource.sizeBytes ?? resource.size,
    );
  }
  return null;
}

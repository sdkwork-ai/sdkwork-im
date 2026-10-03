import 'package:drive_upload_image_composed/drive_upload_image_composed.dart';
import 'package:drive_uploader_composed/drive_uploader_composed.dart';
import 'package:flutter/foundation.dart';

import '../upload_declaration.dart';

/// Result of one chat media upload: the stable Drive identity plus the
/// metadata the message record carries. Presigned URLs never leave this type.
class ChatMediaUpload {
  const ChatMediaUpload({
    required this.driveUri,
    required this.spaceId,
    required this.nodeId,
    required this.fileName,
    required this.mimeType,
    required this.sizeBytes,
  });

  final String driveUri;
  final String spaceId;
  final String nodeId;
  final String fileName;
  final String mimeType;
  final int sizeBytes;
}

/// Composed Drive Uploader facade for chat media.
///
/// All bytes enter Drive through `DriveUploaderClient` (`DRIVE_SPEC.md`
/// sections 8.1 and 9). Only upload business intent from
/// [ImFlutterChatImageUpload] is sent; identity comes from the verified
/// authenticated runtime.
class ChatMediaUploadService {
  ChatMediaUploadService({DriveAppClient? driveClient})
      : _driveClientOverride = driveClient;

  final DriveAppClient? _driveClientOverride;
  DriveAppClient? _client;

  /// Resolves the composed Drive client. [applicationPublicHttpUrl] anchors
  /// the app API base; tokens come from the signed-in session and are synced
  /// on every call so token rotation keeps working.
  DriveAppClient _resolveClient({
    required String applicationPublicHttpUrl,
    required String accessToken,
    required String authToken,
  }) {
    final client = _driveClientOverride ?? (_client ??= DriveAppClient.withBaseUrl(
      baseUrl: _driveAppApiBaseUrl(applicationPublicHttpUrl),
    ));
    client.updateTokens(accessToken: accessToken, authToken: authToken);
    return client;
  }

  /// The Drive App API mounts under the gateway origin root; strip any app
  /// path so the generated client can append its `/app/v3/api` prefix.
  String _driveAppApiBaseUrl(String applicationPublicHttpUrl) {
    final normalized = Uri.parse(applicationPublicHttpUrl);
    final path = normalized.path;
    const appPrefix = '/app/v3/api';
    if (path.endsWith(appPrefix)) {
      return normalized.replace(path: path.substring(0, path.length - appPrefix.length)).toString();
    }
    return normalized.toString();
  }

  Future<ChatMediaUpload> uploadChatImage({
    required String applicationPublicHttpUrl,
    required Uint8List bytes,
    required String accessToken,
    required String authToken,
    required String conversationId,
    String? originalFileName,
    String? contentType,
  }) async {
    if (bytes.isEmpty) {
      throw ArgumentError('Chat media upload requires non-empty bytes.');
    }
    final fileName =
        (originalFileName ?? '').trim().isNotEmpty ? originalFileName!.trim() : 'chat-image-${DateTime.now().millisecondsSinceEpoch}.jpg';
    final resolvedContentType =
        (contentType ?? '').trim().isNotEmpty ? contentType!.trim() : 'image/jpeg';

    final client = _resolveClient(
      applicationPublicHttpUrl: applicationPublicHttpUrl,
      accessToken: accessToken,
      authToken: authToken,
    );
    // Image media enters Drive through the shared composed image-upload
    // service (`DRIVE_SPEC.md` section 18.3): the declared intent
    // ([ImFlutterChatImageUpload]) is bound with the composed uploader here
    // and the persist-safe value is mapped back onto [ChatMediaUpload] so
    // callers stay unchanged. `uploadByProfile('image')` is the same dispatch
    // the previous direct `uploadImage` call performed.
    final imageService = DriveUploaderImageService(
      uploader: client.uploader,
      declaration: DriveUploadImageDeclaration(
        appResourceType: ImFlutterChatImageUpload.appResourceType,
        appResourceIdKind: ImFlutterChatImageUpload.appResourceIdKind,
        scene: ImFlutterChatImageUpload.scene,
        source: ImFlutterChatImageUpload.source,
        uploadProfileCode: DriveUploadImageProfile.image,
        retention: ImFlutterChatImageUpload.retention,
        purpose: ImFlutterChatImageUpload.purpose,
      ),
    );
    final result = await imageService.upload(
      file: DriveUploadImageSource(
        bytes: bytes,
        fileName: fileName,
        contentType: resolvedContentType,
      ),
      appResourceId: conversationId,
    );
    final driveMetadata = result.driveMetadata ?? const <String, dynamic>{};
    return ChatMediaUpload(
      driveUri: result.uri,
      spaceId: driveMetadata['spaceId'] as String? ?? '',
      nodeId: driveMetadata['nodeId'] as String? ?? '',
      fileName: driveMetadata['originalFileName'] as String? ?? fileName,
      mimeType: driveMetadata['contentType'] as String? ?? resolvedContentType,
      sizeBytes:
          int.tryParse(driveMetadata['contentLength'] as String? ?? '') ??
              bytes.length,
    );
  }
}

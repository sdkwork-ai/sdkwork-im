import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';

import 'chat_message_history_utils.dart';

const int _defaultMessagePageSize = 50;
const int _maxMessagePageSize = 200;

int _normalizeMessagePageSize(int pageSize) {
  if (pageSize <= 0) {
    return _defaultMessagePageSize;
  }
  return pageSize > _maxMessagePageSize ? _maxMessagePageSize : pageSize;
}

/// Conversation read/send surface for the Flutter chat.
///
/// Media uploads go through `ChatMediaUploadService`, which enters Drive via
/// the composed `drive_uploader_composed` uploader (`DRIVE_SPEC.md` sections
/// 8.1 and 9); this service only sends the message that references the
/// uploaded Drive node.
class ChatConversationService {
  ChatConversationService(this._client);

  final SdkworkImClient _client;

  Future<ChatMessageHistoryResult> fetchMessageHistory(
    String conversationId, {
    int pageSize = _defaultMessagePageSize,
    String? cursor,
  }) async {
    final response = await _client.chat.conversationsMessagesList(
      conversationId,
      cursor,
      _normalizeMessagePageSize(pageSize),
    );
    return readMessageHistoryPageFromSdkResponse(response);
  }

  Future<ChatMessageHistoryResult> fetchMessageHistoryDelta(
    String conversationId, {
    int pageSize = _defaultMessagePageSize,
  }) {
    return fetchMessageHistory(
      conversationId,
      pageSize: pageSize,
    );
  }

  Future<PostMessageResult?> sendText(
    String conversationId,
    String text, {
    String? clientMsgId,
  }) async {
    final response = await _client.chat.conversationsMessagesCreate(
      conversationId,
      PostMessageRequest(
        text: text.trim(),
        clientMsgId: clientMsgId,
      ),
    );
    return readPostMessageResultFromSdkResponse(response);
  }

  Future<void> markConversationRead(
    String conversationId, {
    int readSeq = 0,
  }) async {
    if (readSeq > 0) {
      // int64 read cursors cross the wire as decimal strings (API_SPEC 13.6);
      // the internal parameter stays numeric.
      await _client.chat.conversationsReadCursorUpdate(
        conversationId,
        UpdateReadCursorRequest(readSeq: readSeq.toString()),
      );
    }
    await _client.chat.conversationsPreferencesUpdate(
      conversationId,
      UpdateConversationPreferencesRequest(isMarkedUnread: false),
    );
  }

  /// Recalls one message (sender or group admin, enforced server-side).
  ///
  /// The authoritative tombstone lands through the next history sync; this
  /// call only issues the mutation.
  Future<void> recallMessage(String messageId) async {
    final normalized = messageId.trim();
    if (normalized.isEmpty) {
      throw ArgumentError('A message id is required.');
    }
    await _client.chat.messagesRecall(normalized, RecallMessageRequest());
  }

  /// Edits one text message (sender-only, enforced server-side).
  Future<void> editMessage(String messageId, String text) async {
    final normalized = messageId.trim();
    final body = text.trim();
    if (normalized.isEmpty) {
      throw ArgumentError('A message id is required.');
    }
    if (body.isEmpty) {
      throw ArgumentError('An edited message must contain text.');
    }
    await _client.chat.messagesEdit(normalized, EditMessageRequest(text: body));
  }

  /// Sends an image message referencing an already-uploaded Drive node
  /// (business command carrying a Drive reference; the upload itself belongs
  /// to `ChatMediaUploadService` and the composed Drive Uploader).
  Future<PostMessageResult?> sendImageMessage({
    required String conversationId,
    required String driveUri,
    required String spaceId,
    required String nodeId,
    required String fileName,
    required String mimeType,
    required int sizeBytes,
  }) async {
    final response = await _client.chat.conversationsMessagesCreate(
      conversationId,
      PostMessageRequest(
        clientMsgId: newClientMessageId(),
        summary: fileName,
        parts: [
          MediaContentPart(
            kind: 'media',
            drive: DriveReference(
              driveUri: driveUri,
              spaceId: spaceId,
              nodeId: nodeId,
            ),
            resource: MediaResource(
              source: 'drive',
              uri: driveUri,
              fileName: fileName,
              mimeType: mimeType,
              sizeBytes: '$sizeBytes',
              kind: 'image',
            ),
            mediaRole: 'attachment',
          ),
        ],
      ),
    );
    return readPostMessageResultFromSdkResponse(response);
  }
}

ChatConversationService createChatConversationService(
    ImSdkClientBundle bundle) {
  return ChatConversationService(bundle.imSdk);
}

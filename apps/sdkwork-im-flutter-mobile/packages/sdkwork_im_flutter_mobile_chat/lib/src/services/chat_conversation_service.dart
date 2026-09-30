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
/// Send is text-only on purpose: the app has no media upload pipeline wired.
/// `DRIVE_SPEC.md` section 9 requires client media uploads to go through the
/// generated Drive app SDK uploader, which publishes no Flutter target yet, so
/// the previous hand-rolled Drive Uploader App API client was removed. Media
/// support belongs to the same `chat-media-upload` boundary the H5 client uses
/// and returns when a Dart `sdkwork-drive-app-sdk` target exists.
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
}

ChatConversationService createChatConversationService(
    ImSdkClientBundle bundle) {
  return ChatConversationService(bundle.imSdk);
}

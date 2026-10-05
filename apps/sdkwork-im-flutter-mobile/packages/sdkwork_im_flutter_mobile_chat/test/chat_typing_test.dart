import 'package:test/test.dart';
import 'package:sdkwork_im_flutter_mobile_chat/src/services/chat_realtime_service.dart';

void main() {
  group('extractTypingPeerUserId', () {
    test('reads the peer id from a conversation.typing event payload', () {
      final peerUserId = extractTypingPeerUserId(const {
        'eventType': 'conversation.typing',
        'scopeType': 'conversation',
        'scopeId': 'c_1',
        'payload': {
          'conversationId': 'c_1',
          'userId': '1108',
          'userKind': 'user',
          'occurredAt': '2026-10-05T01:23:45.678Z',
        },
      });

      expect(peerUserId, '1108');
    });

    test('falls back to the event body and snake_case fields', () {
      expect(
        extractTypingPeerUserId(const {
          'type': 'conversation.typing',
          'userId': 'u_9',
        }),
        'u_9',
      );
      expect(
        extractTypingPeerUserId(const {
          'eventType': 'conversation.typing',
          'payload': {'user_id': 'u_7'},
        }),
        'u_7',
      );
    });

    test('rejects other event types and events without a user id', () {
      expect(
        extractTypingPeerUserId(const {
          'eventType': 'message.posted',
          'payload': {'userId': 'u_1'},
        }),
        isNull,
      );
      expect(
        extractTypingPeerUserId(const {
          'eventType': 'conversation.typing',
          'payload': {'conversationId': 'c_1'},
        }),
        isNull,
      );
      expect(extractTypingPeerUserId(const {}), isNull);
    });
  });
}

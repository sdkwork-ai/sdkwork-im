import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';

void main() {
  test('parses large decimal int64 wire seqs exactly', () {
    // int64 wire seqs stay Dart ints on io platforms (never routed through
    // double) even past the 2^53 JavaScript safe range.
    expect(parseWireSeq('9223372036854775807'), 9223372036854775807);
    expect(parseWireSeq('1725493210001'), 1725493210001);
  });

  test('parses numeric realtime frame seqs', () {
    expect(parseWireSeq(41), 41);
    expect(parseWireSeq(9223372036854775807), 9223372036854775807);
  });

  test('returns null for missing or malformed seqs instead of fabricating 0',
      () {
    expect(parseWireSeq(null), isNull);
    expect(parseWireSeq(''), isNull);
    expect(parseWireSeq('not-a-seq'), isNull);
    expect(parseWireSeq('41.5'), isNull);
  });

  test('resolves the latest seq by skipping entries with unparseable seqs', () {
    final entries = [
      _message('100', index: 1),
      _message('not-a-seq', index: 2),
      _message('300', index: 3),
    ];
    expect(resolveLatestMessageSeq(entries), 300);
    expect(resolveLatestMessageSeq([_message('', index: 1)]), 0);
  });

  test('merges pages deterministically when a seq is unparseable', () {
    final invalidSeqEntry = _message('not-a-seq', index: 0);
    final page = mergeConversationMessagePage(
      const <ConversationMessageEntry>[],
      [invalidSeqEntry, _message('100', index: 1), _message('200', index: 2)],
      direction: MessageHistoryWindowDirection.newer,
    );

    expect(page.incomingPageRetained, isTrue);
    expect(page.items, hasLength(3));
    // Unparseable seqs sort ahead of sequenced entries and keep the merge
    // bounded-window behavior unchanged.
    expect(page.items.first.messageId, invalidSeqEntry.messageId);
    expect(
      page.items.skip(1).map((entry) => entry.messageSeq),
      ['100', '200'],
    );
  });
}

ConversationMessageEntry _message(String messageSeq, {required int index}) {
  return ConversationMessageEntry(
    tenantId: 'tenant-1',
    conversationId: 'conversation-1',
    messageId: 'message-$index',
    // int64 seqs cross the wire as decimal strings per API_SPEC 13.6.
    messageSeq: messageSeq,
    sender: Sender(id: 'user-1', kind: 'user', displayName: 'Ada'),
    body: MessageBody(text: 'message $index', parts: <ContentPart>[]),
    messageType: 'text',
    deliveryMode: 'normal',
    occurredAt: '2026-07-16T00:00:0${index}Z',
  );
}

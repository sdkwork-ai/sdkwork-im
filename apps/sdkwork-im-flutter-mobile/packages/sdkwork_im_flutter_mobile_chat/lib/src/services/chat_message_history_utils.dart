import 'package:flutter/foundation.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';

import 'chat_sdk_response_utils.dart';

/// Maximum message history entries retained in memory per conversation (aligned with H5).
const int maxMessageHistoryEntries = 500;

class ChatMessageHistoryResult {
  const ChatMessageHistoryResult({
    required this.items,
    required this.pagination,
  });

  final List<ConversationMessageEntry> items;
  final MessageHistoryPaginationState pagination;
}

class MessageHistoryPaginationState {
  const MessageHistoryPaginationState({
    required this.hasMore,
    required this.nextCursor,
  });

  final bool hasMore;
  final String? nextCursor;
}

enum MessageHistoryWindowDirection { older, newer }

class MessageHistoryPageMergeResult {
  const MessageHistoryPageMergeResult({
    required this.items,
    required this.incomingPageRetained,
  });

  final List<ConversationMessageEntry> items;
  final bool incomingPageRetained;
}

/// Parses an int64 wire sequence into the internal numeric domain.
///
/// REST responses deliver int64 seqs as decimal strings per API_SPEC 13.6
/// (realtime frames still deliver numbers), so accept both forms and keep
/// internal math numeric (Dart ints on io platforms hold the full int64
/// range; never route these through double). Returns null when the value is
/// missing or not a decimal integer — callers must skip the value with a
/// warning instead of fabricating a valid-looking 0, which would corrupt
/// ordering and read cursors.
int? parseWireSeq(Object? value) => int.tryParse(value?.toString() ?? '');

int resolveLatestMessageSeq(List<ConversationMessageEntry> entries) {
  var maxSeq = 0;
  for (final entry in entries) {
    final seq = parseWireSeq(entry.messageSeq);
    if (seq == null) {
      debugPrint(
        'sdkwork-im-flutter-mobile: skipping message ${entry.messageId} '
        'with unparseable seq "${entry.messageSeq}"',
      );
      continue;
    }
    if (seq > maxSeq) {
      maxSeq = seq;
    }
  }
  return maxSeq;
}

MessageHistoryPageMergeResult mergeConversationMessagePage(
  Iterable<ConversationMessageEntry> existing,
  Iterable<ConversationMessageEntry> incoming, {
  required MessageHistoryWindowDirection direction,
}) {
  final existingEntries = existing.toList(growable: false);
  final incomingEntries = incoming.toList(growable: false);
  final existingIds = existingEntries.map((entry) => entry.messageId).toSet();
  final byId = <String, ConversationMessageEntry>{};
  for (final entry in existingEntries) {
    byId[entry.messageId] = entry;
  }
  for (final entry in incomingEntries) {
    byId[entry.messageId] = entry;
  }
  final merged = byId.values.toList()
    ..sort((left, right) {
      // Entries without a parseable seq sort ahead of sequenced ones (0
      // precedes positive seqs) and stay deterministic via the occurredAt /
      // messageId fallbacks below; they never fabricate a usable seq value.
      final sequenceComparison = (parseWireSeq(left.messageSeq) ?? 0)
          .compareTo(parseWireSeq(right.messageSeq) ?? 0);
      if (sequenceComparison != 0) {
        return sequenceComparison;
      }
      final occurredAtComparison = left.occurredAt.compareTo(right.occurredAt);
      if (occurredAtComparison != 0) {
        return occurredAtComparison;
      }
      return left.messageId.compareTo(right.messageId);
    });
  final items = direction == MessageHistoryWindowDirection.older
      ? merged.take(maxMessageHistoryEntries).toList(growable: false)
      : merged.length <= maxMessageHistoryEntries
          ? merged
          : merged.sublist(merged.length - maxMessageHistoryEntries);
  final retainedIds = items.map((entry) => entry.messageId).toSet();
  final incomingPageRetained = incomingEntries.every(
    (entry) =>
        existingIds.contains(entry.messageId) ||
        retainedIds.contains(entry.messageId),
  );
  return MessageHistoryPageMergeResult(
    items: items,
    incomingPageRetained: incomingPageRetained,
  );
}

List<ConversationMessageEntry> mergeConversationMessageEntries(
  Iterable<ConversationMessageEntry> existing,
  Iterable<ConversationMessageEntry> incoming, {
  MessageHistoryWindowDirection direction = MessageHistoryWindowDirection.newer,
}) {
  return mergeConversationMessagePage(
    existing,
    incoming,
    direction: direction,
  ).items;
}

MessageHistoryPaginationState readCursorPageInfo(PageInfo? pageInfo) {
  final nextCursor = pageInfo?.nextCursor;
  final hasMore =
      pageInfo?.hasMore == true && nextCursor != null && nextCursor.isNotEmpty;
  return MessageHistoryPaginationState(
    hasMore: hasMore,
    nextCursor: hasMore ? nextCursor : null,
  );
}

MessageHistoryPaginationState pickMessageHistoryPagination(
  ChatMessageHistoryResult? response,
) {
  return response?.pagination ??
      const MessageHistoryPaginationState(hasMore: false, nextCursor: null);
}

ChatMessageHistoryResult readMessageHistoryPageFromSdkResponse(
  ConversationMessageListResponse? response,
) {
  final pageInfo = readPageInfoFromSdkData(response?.data);
  return ChatMessageHistoryResult(
    items: readItemsFromSdkData(
      response?.data,
      ConversationMessageEntry.fromJson,
    ),
    pagination: readCursorPageInfo(pageInfo),
  );
}

PostMessageResult? readPostMessageResultFromSdkResponse(
  ConversationsMessagesCreateResponse201? response,
) {
  return readItemFromSdkData(response?.data, PostMessageResult.fromJson);
}

import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';

ContactEntry _contact(String id, String name, {bool isBlocked = false}) {
  return ContactEntry(
    id: id,
    name: name,
    avatarUrl: '',
    relationshipState: 'friend',
    isBlocked: isBlocked,
  );
}

FriendRequest _request(String id, {String status = 'pending'}) {
  return FriendRequest(
    tenantId: 'tenant',
    friendRequestId: id,
    requesterUserId: 'requester-$id',
    targetUserId: 'target-$id',
    status: status,
    createdAt: '2026-09-17T00:00:00Z',
    updatedAt: '2026-09-17T00:00:00Z',
  );
}

void main() {
  group('groupContactsByInitial', () {
    test('buckets Latin initials and collapses the rest into #', () {
      final grouped = groupContactsByInitial([
        _contact('1', 'Bob'),
        _contact('2', 'alice'),
        _contact('3', '张三'),
        _contact('4', ''),
      ]);

      expect(grouped.keys.toList(), ['#', 'A', 'B']);
      expect(grouped['A']!.map((entry) => entry.id), ['2']);
      expect(grouped['B']!.map((entry) => entry.id), ['1']);
      expect(grouped['#']!.map((entry) => entry.id), ['3', '4']);
    });

    test('sorts entries inside a group case-insensitively', () {
      final grouped = groupContactsByInitial([
        _contact('1', 'bob'),
        _contact('2', 'Betty'),
        _contact('3', 'Alan'),
      ]);

      expect(grouped['B']!.map((entry) => entry.name), ['Betty', 'bob']);
      expect(grouped['A']!.map((entry) => entry.name), ['Alan']);
    });
  });

  group('filterContactEntries', () {
    test('returns the whole window for a blank query', () {
      final window = [_contact('1', 'Alice'), _contact('2', 'Bob')];

      expect(filterContactEntries(window, '   ').length, 2);
    });

    test('matches name and id case-insensitively', () {
      final window = [
        _contact('u-100', 'Alice'),
        _contact('bob-200', 'Bob'),
      ];

      expect(filterContactEntries(window, 'ALI').map((e) => e.id), ['u-100']);
      expect(filterContactEntries(window, '200').map((e) => e.id), ['bob-200']);
      expect(filterContactEntries(window, 'zzz'), isEmpty);
    });
  });

  group('mergeContactPage', () {
    test('keeps the fetched page when prepending older contacts', () {
      final result = mergeContactPage(
        [_contact('2', 'Bob')],
        [_contact('1', 'Alice')],
        direction: ContactWindowDirection.older,
      );

      expect(result.items.map((entry) => entry.id), ['2', '1']);
      expect(result.incomingPageRetained, isTrue);
    });

    test('puts refreshed contacts at the head for a newer merge', () {
      final result = mergeContactPage(
        [_contact('2', 'Bob'), _contact('3', 'Cara')],
        [_contact('1', 'Alice')],
        direction: ContactWindowDirection.newer,
      );

      expect(result.items.map((entry) => entry.id), ['1', '2', '3']);
      expect(result.incomingPageRetained, isTrue);
    });

    test('refreshed contact wins over the retained copy of the same id', () {
      final result = mergeContactPage(
        [_contact('1', 'Alice')],
        [_contact('1', 'Alice Updated')],
        direction: ContactWindowDirection.newer,
      );

      expect(result.items.length, 1);
      expect(result.items.single.name, 'Alice Updated');
    });

    test('reports an unretained page when the older merge overflows', () {
      final current = [
        for (var index = 0; index < maxContactEntries; index += 1)
          _contact('current-$index', 'Current $index'),
      ];
      final incoming = [
        for (var index = 0; index < maxContactEntries + 100; index += 1)
          _contact('incoming-$index', 'Incoming $index'),
      ];

      final result = mergeContactPage(
        current,
        incoming,
        direction: ContactWindowDirection.older,
      );

      expect(result.items.length, maxContactEntries);
      expect(result.incomingPageRetained, isFalse);
    });

    test('reports an unretained page when the newer merge overflows', () {
      final incoming = [
        for (var index = 0; index < maxContactEntries + 50; index += 1)
          _contact('incoming-$index', 'Incoming $index'),
      ];

      final result = mergeContactPage(
        const <ContactEntry>[],
        incoming,
        direction: ContactWindowDirection.newer,
      );

      expect(result.items.length, maxContactEntries);
      expect(result.incomingPageRetained, isFalse);
    });
  });

  group('mergeFriendRequestPage', () {
    test('deduplicates by friend request id', () {
      final result = mergeFriendRequestPage(
        [_request('a'), _request('b')],
        [_request('b', status: 'accepted'), _request('c')],
        direction: ContactWindowDirection.older,
      );

      expect(
        result.items.map((entry) => entry.friendRequestId),
        ['a', 'b', 'c'],
      );
      expect(result.items[1].status, 'accepted');
      expect(result.incomingPageRetained, isTrue);
    });
  });

  group('classifyFriendRequestSubmitError', () {
    test('classifies duplicate friendship failures as already a friend', () {
      expect(
        classifyFriendRequestSubmitError(
          Exception('HTTP 409: {"code":"friendship_pair_conflict"}'),
        ),
        FriendRequestSubmitConflict.alreadyFriend,
      );
    });

    test('classifies open request failures as pending', () {
      expect(
        classifyFriendRequestSubmitError(
          Exception('HTTP 409: {"detail":"an open friend request exists"}'),
        ),
        FriendRequestSubmitConflict.pending,
      );
    });

    test('classifies blocked failures as blocked', () {
      expect(
        classifyFriendRequestSubmitError(
          Exception('HTTP 403: {"code":"friend_request_blocked"}'),
        ),
        FriendRequestSubmitConflict.blocked,
      );
    });

    test('falls back to unknown for unclassified failures', () {
      expect(
        classifyFriendRequestSubmitError(Exception('HTTP 500: boom')),
        FriendRequestSubmitConflict.unknown,
      );
    });
  });
}

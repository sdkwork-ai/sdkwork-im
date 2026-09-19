import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';

/// Contacts page size sent to `social.contacts.list`.
const int contactsPageSize = 50;

/// Page size sent to `social.users.list`.
const int userSearchPageSize = 20;

/// Upper bound of the address book window held in memory.
const int maxContactEntries = 200;

/// Upper bound of pages walked when aggregating the address book window.
const int maxContactSyncPages = 10;

/// Safety cap for the friendship lookup loop (pages of contacts).
const int friendshipLookupMaxPages = 20;

/// Direction of a window merge against the currently retained list.
enum ContactWindowDirection { older, newer }

/// Contact projection consumed by the address book UI.
///
/// Mirrors the H5 contacts projection: the server `ContactView` carries the
/// display name in `remark` (owner-set) or `displayName` (profile), and the
/// direct conversation may arrive through any of three id fields.
class ContactEntry {
  const ContactEntry({
    required this.id,
    required this.name,
    required this.avatarUrl,
    required this.relationshipState,
    this.conversationId,
    this.friendshipId,
    this.isStarred = false,
    this.isBlocked = false,
  });

  factory ContactEntry.fromContactView(ContactView view) {
    final remark = view.remark?.trim();
    final displayName = view.displayName?.trim();
    final name = remark != null && remark.isNotEmpty
        ? remark
        : displayName != null && displayName.isNotEmpty
            ? displayName
            : view.targetUserId;
    return ContactEntry(
      id: view.targetUserId,
      name: name,
      avatarUrl: view.avatarUrl ?? '',
      relationshipState: view.relationshipState,
      conversationId: view.conversationId ?? view.directChatId ?? view.chatId,
      friendshipId: view.friendshipId,
      isStarred: view.isStarred,
      isBlocked: view.isBlocked,
    );
  }

  factory ContactEntry.fromJson(Map<String, dynamic> json) {
    return ContactEntry.fromContactView(ContactView.fromJson(json));
  }

  /// Target user id of the contact.
  final String id;

  /// Resolved display name (remark, then profile name, then the raw id).
  final String name;

  final String avatarUrl;

  /// Server relationship state (`friend`, `blocked`, ...).
  final String relationshipState;

  /// Direct conversation id when the server already resolved one.
  final String? conversationId;

  /// Friendship id required by `social.friendships.remove`.
  final String? friendshipId;

  final bool isStarred;
  final bool isBlocked;
}

/// One cursor page of contacts.
class ContactPage {
  const ContactPage({required this.items, required this.pageInfo});

  final List<ContactEntry> items;
  final PageInfo pageInfo;
}

/// Outcome of merging a fetched page into the retained address book window.
class ContactPageMergeResult {
  const ContactPageMergeResult({
    required this.items,
    required this.incomingPageRetained,
  });

  final List<ContactEntry> items;

  /// False when the bounded window had to drop part of the fetched page.
  final bool incomingPageRetained;
}

/// User search hit returned by `social.users.list`.
class ContactSearchResult {
  const ContactSearchResult({
    required this.id,
    required this.name,
    required this.chatId,
    required this.relationshipState,
    this.avatarUrl,
    this.email,
    this.phone,
  });

  factory ContactSearchResult.fromJson(Map<String, dynamic> json) {
    final result = SocialUserSearchResult.fromJson(json);
    return ContactSearchResult(
      id: result.userId,
      name: result.displayName,
      chatId: result.chatId,
      relationshipState: result.relationshipState,
      avatarUrl: result.avatarUrl,
      email: result.email,
      phone: result.phone,
    );
  }

  final String id;
  final String name;
  final String chatId;
  final String relationshipState;
  final String? avatarUrl;
  final String? email;
  final String? phone;
}

/// One cursor page of user search hits.
class ContactSearchPage {
  const ContactSearchPage({required this.items, required this.pageInfo});

  final List<ContactSearchResult> items;
  final PageInfo pageInfo;
}

/// Direction filter of `social.friendRequests.list`.
enum FriendRequestDirection { incoming, outgoing }

extension FriendRequestDirectionWire on FriendRequestDirection {
  /// Wire value of the `direction` query parameter.
  String get wireValue {
    switch (this) {
      case FriendRequestDirection.incoming:
        return 'incoming';
      case FriendRequestDirection.outgoing:
        return 'outgoing';
    }
  }
}

/// One cursor page of friend requests.
class FriendRequestPage {
  const FriendRequestPage({required this.items, required this.pageInfo});

  final List<FriendRequest> items;
  final PageInfo pageInfo;
}

/// Outcome of merging a fetched friend request page into the retained window.
class FriendRequestPageMergeResult {
  const FriendRequestPageMergeResult({
    required this.items,
    required this.incomingPageRetained,
  });

  final List<FriendRequest> items;
  final bool incomingPageRetained;
}

/// User-facing classification of `social.friendRequests.create` failures.
enum FriendRequestSubmitConflict { alreadyFriend, pending, blocked, unknown }

/// Classifies a friend request submission failure into a user-facing conflict.
///
/// The generated Flutter client surfaces failures as `Exception('HTTP <status>:
/// <problem body>')`, so the classifier matches the same ProblemDetail
/// vocabulary the H5 contacts service reads from `body.code` and
/// `body.detail`.
FriendRequestSubmitConflict classifyFriendRequestSubmitError(Object error) {
  final text = error.toString().toLowerCase();
  if (text.contains('friendship_pair') ||
      text.contains('already a friend') ||
      text.contains('already exists')) {
    return FriendRequestSubmitConflict.alreadyFriend;
  }
  if (text.contains('friend_request_pair') ||
      text.contains('friend_request_conflict') ||
      text.contains('already pending') ||
      text.contains('open friend request')) {
    return FriendRequestSubmitConflict.pending;
  }
  if (text.contains('friend_request_blocked') || text.contains('blocked')) {
    return FriendRequestSubmitConflict.blocked;
  }
  return FriendRequestSubmitConflict.unknown;
}

/// Merges a fetched contacts page into the retained address book window.
///
/// [direction] selects which edge of the window may be trimmed: `older` keeps
/// the tail after prepending newly fetched contacts, `newer` keeps the head
/// after a refresh.
ContactPageMergeResult mergeContactPage(
  Iterable<ContactEntry> current,
  Iterable<ContactEntry> incoming, {
  required ContactWindowDirection direction,
}) {
  final currentEntries = current.toList(growable: false);
  final incomingById = <String, ContactEntry>{
    for (final entry in incoming) entry.id: entry,
  };
  final incomingEntries = incomingById.values.toList(growable: false);
  final currentIds = currentEntries.map((entry) => entry.id).toSet();
  final merged = direction == ContactWindowDirection.older
      ? <ContactEntry>[
          for (final entry in currentEntries)
            incomingById[entry.id] ?? entry,
          for (final entry in incomingEntries)
            if (!currentIds.contains(entry.id)) entry,
        ]
      : <ContactEntry>[
          ...incomingEntries,
          for (final entry in currentEntries)
            if (!incomingById.containsKey(entry.id)) entry,
        ];
  final items = direction == ContactWindowDirection.older
      ? merged.length <= maxContactEntries
          ? merged
          : merged.sublist(merged.length - maxContactEntries)
      : merged.take(maxContactEntries).toList(growable: false);
  final retainedIds = items.map((entry) => entry.id).toSet();
  final incomingPageRetained = incomingEntries.every(
    (entry) =>
        currentIds.contains(entry.id) || retainedIds.contains(entry.id),
  );
  return ContactPageMergeResult(
    items: items,
    incomingPageRetained: incomingPageRetained,
  );
}

/// Merges a fetched friend request page into the retained list window.
FriendRequestPageMergeResult mergeFriendRequestPage(
  Iterable<FriendRequest> current,
  Iterable<FriendRequest> incoming, {
  required ContactWindowDirection direction,
}) {
  final currentEntries = current.toList(growable: false);
  final incomingById = <String, FriendRequest>{
    for (final entry in incoming) entry.friendRequestId: entry,
  };
  final incomingEntries = incomingById.values.toList(growable: false);
  final currentIds =
      currentEntries.map((entry) => entry.friendRequestId).toSet();
  final merged = direction == ContactWindowDirection.older
      ? <FriendRequest>[
          for (final entry in currentEntries)
            incomingById[entry.friendRequestId] ?? entry,
          for (final entry in incomingEntries)
            if (!currentIds.contains(entry.friendRequestId)) entry,
        ]
      : <FriendRequest>[
          ...incomingEntries,
          for (final entry in currentEntries)
            if (!incomingById.containsKey(entry.friendRequestId)) entry,
        ];
  final items = direction == ContactWindowDirection.older
      ? merged.length <= maxContactEntries
          ? merged
          : merged.sublist(merged.length - maxContactEntries)
      : merged.take(maxContactEntries).toList(growable: false);
  final retainedIds = items.map((entry) => entry.friendRequestId).toSet();
  final incomingPageRetained = incomingEntries.every(
    (entry) =>
        currentIds.contains(entry.friendRequestId) ||
        retainedIds.contains(entry.friendRequestId),
  );
  return FriendRequestPageMergeResult(
    items: items,
    incomingPageRetained: incomingPageRetained,
  );
}

/// Groups contacts by their A-Z initial, mirroring the H5 address book
/// grouping: non-Latin initials collapse into `#`, group keys are sorted, and
/// entries inside a group are sorted by name.
Map<String, List<ContactEntry>> groupContactsByInitial(
  Iterable<ContactEntry> contacts,
) {
  final grouped = <String, List<ContactEntry>>{};
  for (final contact in contacts) {
    final firstCharacter = contact.name.isEmpty
        ? '#'
        : contact.name.substring(0, 1).toUpperCase();
    final group = RegExp(r'^[A-Z]$').hasMatch(firstCharacter)
        ? firstCharacter
        : '#';
    grouped.putIfAbsent(group, () => <ContactEntry>[]).add(contact);
  }
  final result = <String, List<ContactEntry>>{};
  final groups = grouped.keys.toList(growable: false)..sort();
  for (final group in groups) {
    final items = grouped[group]!;
    items.sort((left, right) =>
        left.name.toLowerCase().compareTo(right.name.toLowerCase()));
    result[group] = items;
  }
  return result;
}

/// Filters the retained contact window locally.
///
/// `social.contacts.list` exposes no `q` parameter on this surface, so the
/// address book searches the window it already holds instead of inventing a
/// server-side search the contract does not offer.
List<ContactEntry> filterContactEntries(
  Iterable<ContactEntry> contacts,
  String query,
) {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) {
    return contacts.toList(growable: false);
  }
  return contacts
      .where((contact) =>
          contact.name.toLowerCase().contains(normalized) ||
          contact.id.toLowerCase().contains(normalized))
      .toList(growable: false);
}

class ContactService {
  ContactService(this._client);

  final SdkworkImClient _client;

  Future<ContactPage> fetchContactPage({
    int pageSize = contactsPageSize,
    String? cursor,
  }) async {
    final response = await _client.social.contactsList(
      _normalizePageSize(pageSize),
      cursor,
    );
    return ContactPage(
      items: readItemsFromSdkData(response?.data, ContactEntry.fromJson),
      pageInfo: readPageInfoFromSdkData(response?.data),
    );
  }

  /// Walks cursor pages until the bounded window is filled or the list ends.
  Future<List<ContactEntry>> fetchContactEntries({
    int pageSize = contactsPageSize,
    int maxPages = maxContactSyncPages,
  }) async {
    final items = <ContactEntry>[];
    String? cursor;
    for (var page = 0;
        page < maxPages && items.length < maxContactEntries;
        page += 1) {
      final remaining = maxContactEntries - items.length;
      final requestedPageSize = _normalizePageSize(pageSize);
      final response = await fetchContactPage(
        pageSize: requestedPageSize > remaining ? remaining : requestedPageSize,
        cursor: cursor,
      );
      final pageItems = response.items;
      if (pageItems.length > remaining) {
        throw StateError('Contacts page exceeds the remaining bounded window.');
      }
      items.addAll(pageItems);
      final pageInfo = response.pageInfo;
      final hasMore = pageInfo.hasMore ?? false;
      final nextCursor = pageInfo.nextCursor;
      if (!hasMore || nextCursor == null || nextCursor.isEmpty) {
        break;
      }
      cursor = nextCursor;
    }
    return List<ContactEntry>.unmodifiable(items);
  }

  Future<ContactPreferencesView?> fetchContactPreferences(
    String targetUserId,
  ) async {
    final response = await _client.social.contactsPreferencesRetrieve(
      _requireIdentifier(targetUserId, 'target user ID'),
    );
    return readItemFromSdkData(
      response?.data,
      ContactPreferencesView.fromJson,
    );
  }

  Future<ContactPreferencesView?> updateContactPreferences(
    String targetUserId,
    UpdateContactPreferencesRequest body,
  ) async {
    final response = await _client.social.contactsPreferencesUpdate(
      _requireIdentifier(targetUserId, 'target user ID'),
      body,
    );
    return readItemFromSdkData(
      response?.data,
      ContactPreferencesView.fromJson,
    );
  }

  /// Removes the friendship behind a contact.
  ///
  /// Pass the `friendshipId` already carried by the address book entry when
  /// available; otherwise the service walks the contact cursor pages until the
  /// friendship id is found, because the contact may sit beyond the first page.
  Future<void> removeFriend(String targetUserId, {String? friendshipId}) async {
    final normalized = _requireIdentifier(targetUserId, 'target user ID');
    final resolved = friendshipId ?? await _resolveFriendshipId(normalized);
    if (resolved == null || resolved.isEmpty) {
      throw StateError('Friendship not found for user: $normalized');
    }
    await _client.social.friendshipsRemove(resolved);
  }

  Future<ContactPreferencesView?> blockContact(String targetUserId) {
    return updateContactPreferences(
      targetUserId,
      UpdateContactPreferencesRequest(isBlocked: true),
    );
  }

  Future<ContactPreferencesView?> unblockContact(String targetUserId) {
    return updateContactPreferences(
      targetUserId,
      UpdateContactPreferencesRequest(isBlocked: false),
    );
  }

  /// Searches users by keyword through `social.users.list`.
  Future<ContactSearchPage> searchUsers(
    String query, {
    int pageSize = userSearchPageSize,
    String? cursor,
  }) async {
    final normalizedQuery = query.trim();
    if (normalizedQuery.isEmpty) {
      return ContactSearchPage(
        items: const <ContactSearchResult>[],
        pageInfo: emptyCursorPageInfo(),
      );
    }
    final response = await _client.social.usersList(
      normalizedQuery,
      _normalizePageSize(pageSize),
      cursor,
    );
    return ContactSearchPage(
      items: readItemsFromSdkData(response?.data, ContactSearchResult.fromJson),
      pageInfo: readPageInfoFromSdkData(response?.data),
    );
  }

  Future<FriendRequestPage> fetchFriendRequestPage(
    FriendRequestDirection direction, {
    int pageSize = contactsPageSize,
    String? cursor,
    String status = 'pending',
  }) async {
    final response = await _client.social.friendRequestsList(
      direction.wireValue,
      status,
      _normalizePageSize(pageSize),
      cursor,
    );
    return FriendRequestPage(
      items: readItemsFromSdkData(response?.data, FriendRequest.fromJson),
      pageInfo: readPageInfoFromSdkData(response?.data),
    );
  }

  Future<int> fetchPendingFriendRequestCount() async {
    final response =
        await _client.social.friendRequestsPendingCountRetrieve();
    final item = readItemFromSdkData(
      response?.data,
      SocialFriendRequestPendingCountResponse.fromJson,
    );
    return item?.count ?? 0;
  }

  Future<SocialFriendRequestAcceptanceResponse?> acceptFriendRequest(
    String requestId,
  ) async {
    final response = await _client.social.friendRequestsAccept(
      _requireIdentifier(requestId, 'request ID'),
    );
    return readItemFromSdkData(
      response?.data,
      SocialFriendRequestAcceptanceResponse.fromJson,
    );
  }

  Future<SocialFriendRequestMutationResponse?> declineFriendRequest(
    String requestId,
  ) async {
    final response = await _client.social.friendRequestsDecline(
      _requireIdentifier(requestId, 'request ID'),
    );
    return readItemFromSdkData(
      response?.data,
      SocialFriendRequestMutationResponse.fromJson,
    );
  }

  Future<SocialFriendRequestMutationResponse?> cancelFriendRequest(
    String requestId,
  ) async {
    final response = await _client.social.friendRequestsCancel(
      _requireIdentifier(requestId, 'request ID'),
    );
    return readItemFromSdkData(
      response?.data,
      SocialFriendRequestMutationResponse.fromJson,
    );
  }

  Future<SocialFriendRequestMutationResponse?> submitFriendRequest({
    required String targetUserId,
    String? requestMessage,
  }) async {
    final normalizedTargetUserId =
        _requireIdentifier(targetUserId, 'target user ID');
    final normalizedMessage = requestMessage?.trim();
    final response = await _client.social.friendRequestsCreate(
      SubmitFriendRequestRequest(
        targetUserId: normalizedTargetUserId,
        requestMessage: normalizedMessage == null || normalizedMessage.isEmpty
            ? null
            : normalizedMessage,
      ),
    );
    return readItemFromSdkData(
      response?.data,
      SocialFriendRequestMutationResponse.fromJson,
    );
  }

  /// Opens a direct conversation with a peer and returns its conversation id.
  ///
  /// Direct conversations accept a client-supplied id and attach members
  /// through the member endpoint; `memberUserIds` is a group-only field.
  Future<String> startDirectConversation(String targetUserId) async {
    final normalizedTargetUserId =
        _requireIdentifier(targetUserId, 'target user ID');
    final conversationId = newDirectConversationId();
    await _client.chat.conversationsCreate(
      CreateConversationRequest(
        conversationId: conversationId,
        conversationType: 'direct',
      ),
    );
    await _client.chat.conversationsMembersAdd(
      conversationId,
      AddConversationMemberRequest(
        principalId: normalizedTargetUserId,
        principalKind: 'user',
        role: 'member',
      ),
    );
    return conversationId;
  }

  Future<String?> _resolveFriendshipId(String targetUserId) async {
    String? cursor;
    for (var depth = 0; depth < friendshipLookupMaxPages; depth += 1) {
      final page = await fetchContactPage(cursor: cursor);
      for (final contact in page.items) {
        if (contact.id == targetUserId) {
          return contact.friendshipId;
        }
      }
      final pageInfo = page.pageInfo;
      final nextCursor = pageInfo.nextCursor;
      if (pageInfo.hasMore != true || nextCursor == null || nextCursor.isEmpty) {
        break;
      }
      cursor = nextCursor;
    }
    return null;
  }
}

int _normalizePageSize(int pageSize) {
  if (pageSize <= 0) {
    return contactsPageSize;
  }
  return pageSize > maxContactEntries ? maxContactEntries : pageSize;
}

String _requireIdentifier(String value, String label) {
  final normalized = value.trim();
  if (normalized.isEmpty) {
    throw ArgumentError('A $label is required.');
  }
  return normalized;
}

ContactService createContactService(ImSdkClientBundle bundle) {
  return ContactService(bundle.imSdk);
}

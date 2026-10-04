import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';

/// Members page size sent to `chat.conversations.members.list`.
const int groupMembersPageSize = 50;

/// Upper bound of the group member window held in memory.
const int maxGroupMembers = 200;

/// Upper bound of pages walked when aggregating the member window.
const int maxGroupMemberPages = 10;

/// Wire conversation type of a group conversation.
const String groupConversationType = 'group';

/// Principal kind used for human members on the member endpoints.
const String userPrincipalKind = 'user';

/// Default role assigned to members added through this client.
const String memberRole = 'member';

/// Outcome of `chat.conversations.create` for a group.
///
/// `deliveryStatus` distinguishes a fresh create (`applied`) from an idempotent
/// replay (`replayed`) of a previously accepted `clientRequestKey`.
class GroupCreateResult {
  const GroupCreateResult({
    required this.conversationId,
    required this.deliveryStatus,
    this.requestKey,
  });

  factory GroupCreateResult.fromSdkResponse(
    ConversationsCreateResponse201? response,
  ) {
    final item = readItemFromSdkData(response?.data, _CreateConversationItem.fromJson);
    final conversationId = item?.conversationId ?? '';
    if (conversationId.isEmpty) {
      throw StateError('Create conversation response carried no item.');
    }
    return GroupCreateResult(
      conversationId: conversationId,
      deliveryStatus: item?.deliveryStatus,
      requestKey: item?.requestKey,
    );
  }

  final String conversationId;
  final String? deliveryStatus;
  final String? requestKey;
}

/// Shape of `data.item` in the create-conversation response.
class _CreateConversationItem {
  const _CreateConversationItem({
    required this.conversationId,
    this.deliveryStatus,
    this.requestKey,
  });

  factory _CreateConversationItem.fromJson(Map<String, dynamic> json) {
    return _CreateConversationItem(
      conversationId: json['conversationId']?.toString() ?? '',
      deliveryStatus: json['deliveryStatus']?.toString(),
      requestKey: json['requestKey']?.toString(),
    );
  }

  final String conversationId;
  final String? deliveryStatus;
  final String? requestKey;
}

/// One cursor page of conversation members.
class GroupMemberPage {
  const GroupMemberPage({required this.items, required this.pageInfo});

  final List<ConversationMember> items;
  final PageInfo pageInfo;
}

/// Builds the group creation request payload.
///
/// Kept pure so tests can assert the wire shaping (conversation type, group
/// name, member ids, idempotency key) without a transport.
CreateConversationRequest buildCreateGroupRequest(
  String name,
  List<String> memberUserIds, {
  required String clientRequestKey,
}) {
  final normalizedIds = <String>{
    for (final id in memberUserIds) id.trim(),
  }..removeWhere((id) => id.isEmpty);
  return CreateConversationRequest(
    conversationType: groupConversationType,
    groupName: name.trim(),
    memberUserIds: normalizedIds.toList(growable: false),
    clientRequestKey: clientRequestKey,
  );
}

GroupMemberPage readGroupMembersPageFromSdkResponse(
  ConversationsMembersListResponse? response,
) {
  return GroupMemberPage(
    items: readItemsFromSdkData(
      response?.data,
      ConversationMember.fromJson,
    ),
    pageInfo: readPageInfoFromSdkData(response?.data),
  );
}

ConversationProfileView? readGroupProfileFromSdkResponse(
  ConversationsProfileRetrieveResponse? response,
) {
  return readItemFromSdkData(
    response?.data,
    ConversationProfileView.fromJson,
  );
}

ConversationProfileView? readGroupProfileUpdateFromSdkResponse(
  ConversationsProfileUpdateResponse? response,
) {
  return readItemFromSdkData(
    response?.data,
    ConversationProfileView.fromJson,
  );
}

/// Fresh idempotency key for one group-create attempt.
///
/// Same generator as the message `clientMsgId`: the wire vocabulary is the
/// replay-detection `clientRequestKey`, but uniqueness semantics are shared.
String newGroupCreateRequestKey() => newClientMessageId();

/// Group lifecycle surface over the generated IM chat API.
///
/// Every operation maps one-to-one onto an operation the generated
/// `SdkworkImClient.chat` already exposes: create, profile retrieve/update,
/// members list/add/remove/leave. Operations the SDK does not offer (for
/// example bulk member adds) are deliberately not invented here — callers add
/// members one at a time through [addMember].
class GroupService {
  GroupService(this._client);

  final SdkworkImClient _client;

  /// Creates a group conversation and returns the created conversation id.
  ///
  /// The create is idempotent through `clientRequestKey`; the caller may pin
  /// one key across retries of the same logical create.
  Future<GroupCreateResult> createGroup(
    String name,
    List<String> memberUserIds, {
    String? clientRequestKey,
  }) async {
    final normalized = name.trim();
    if (normalized.isEmpty) {
      throw ArgumentError('A group name is required.');
    }
    final response = await _client.chat.conversationsCreate(
      buildCreateGroupRequest(
        normalized,
        memberUserIds,
        clientRequestKey: clientRequestKey ?? newGroupCreateRequestKey(),
      ),
    );
    return GroupCreateResult.fromSdkResponse(response);
  }

  /// Loads the conversation profile (display name, notice, avatar).
  Future<ConversationProfileView?> loadGroupProfile(String conversationId) async {
    final response = await _client.chat.conversationsProfileRetrieve(
      _requireConversationId(conversationId),
    );
    return readGroupProfileFromSdkResponse(response);
  }

  /// Renames the group through the conversation profile update.
  Future<ConversationProfileView?> renameGroup(
    String conversationId,
    String name,
  ) async {
    final normalized = name.trim();
    if (normalized.isEmpty) {
      throw ArgumentError('A group name is required.');
    }
    final response = await _client.chat.conversationsProfileUpdate(
      _requireConversationId(conversationId),
      UpdateConversationProfileRequest(displayName: normalized),
    );
    return readGroupProfileUpdateFromSdkResponse(response);
  }

  /// Loads one cursor page of conversation members.
  Future<GroupMemberPage> fetchMemberPage(
    String conversationId, {
    int pageSize = groupMembersPageSize,
    String? cursor,
  }) async {
    final response = await _client.chat.conversationsMembersList(
      _requireConversationId(conversationId),
      _normalizeMemberPageSize(pageSize),
      cursor,
    );
    return readGroupMembersPageFromSdkResponse(response);
  }

  /// Walks member cursor pages until the bounded window is filled.
  Future<List<ConversationMember>> fetchMembers(String conversationId) async {
    final items = <ConversationMember>[];
    String? cursor;
    for (var page = 0;
        page < maxGroupMemberPages && items.length < maxGroupMembers;
        page += 1) {
      final memberPage = await fetchMemberPage(
        conversationId,
        cursor: cursor,
      );
      items.addAll(memberPage.items);
      final pageInfo = memberPage.pageInfo;
      final nextCursor = pageInfo.nextCursor;
      if (pageInfo.hasMore != true ||
          nextCursor == null ||
          nextCursor.isEmpty) {
        break;
      }
      cursor = nextCursor;
    }
    return List<ConversationMember>.unmodifiable(items);
  }

  /// Adds one user as a group member.
  ///
  /// The generated API adds a single principal per call, so multi-member adds
  /// loop over [addMember].
  Future<ConversationMember?> addMember(
    String conversationId,
    String userId,
  ) async {
    final normalizedUserId = userId.trim();
    if (normalizedUserId.isEmpty) {
      throw ArgumentError('A member user ID is required.');
    }
    final response = await _client.chat.conversationsMembersAdd(
      _requireConversationId(conversationId),
      AddConversationMemberRequest(
        principalId: normalizedUserId,
        principalKind: userPrincipalKind,
        role: memberRole,
      ),
    );
    return readItemFromSdkData(
      response?.data,
      ConversationMember.fromJson,
    );
  }

  /// Removes a member by its conversation membership id (`memberId`), not the
  /// user id — the wire contract keys removal on the membership record.
  Future<void> removeMember(String conversationId, String memberId) async {
    final normalizedMemberId = memberId.trim();
    if (normalizedMemberId.isEmpty) {
      throw ArgumentError('A member ID is required.');
    }
    await _client.chat.conversationsMembersRemove(
      _requireConversationId(conversationId),
      RemoveConversationMemberRequest(memberId: normalizedMemberId),
    );
  }

  /// Leaves the conversation as the current user.
  Future<void> leaveGroup(String conversationId) async {
    await _client.chat.conversationsMembersLeave(
      _requireConversationId(conversationId),
    );
  }
}

int _normalizeMemberPageSize(int pageSize) {
  if (pageSize <= 0) {
    return groupMembersPageSize;
  }
  return pageSize > maxGroupMembers ? maxGroupMembers : pageSize;
}

String _requireConversationId(String value) {
  final normalized = value.trim();
  if (normalized.isEmpty) {
    throw ArgumentError('A conversation ID is required.');
  }
  return normalized;
}

GroupService createGroupService(ImSdkClientBundle bundle) {
  return GroupService(bundle.imSdk);
}

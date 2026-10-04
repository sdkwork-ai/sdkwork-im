import 'package:flutter_test/flutter_test.dart';
import 'package:im_sdk_generated/im_sdk_generated.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';

void main() {
  group('buildCreateGroupRequest', () {
    test('shapes the group create payload for the wire', () {
      final request = buildCreateGroupRequest(
        '  Product Team  ',
        <String>['u_1', ' u_2 ', '', 'u_1'],
        clientRequestKey: 'grpcreq_test',
      );

      final payload = request.toJson();
      expect(payload['conversationType'], 'group');
      expect(payload['groupName'], 'Product Team');
      // Deduplicated, trimmed member ids; ids stay strings on the wire.
      expect(payload['memberUserIds'], <String>['u_1', 'u_2']);
      expect(payload['clientRequestKey'], 'grpcreq_test');
    });

    test('keeps the request keyed for idempotent retries', () {
      final first = buildCreateGroupRequest(
        'Team',
        <String>['u_1'],
        clientRequestKey: 'grpcreq_same',
      );
      final retry = buildCreateGroupRequest(
        'Team',
        <String>['u_1'],
        clientRequestKey: 'grpcreq_same',
      );

      expect(first.clientRequestKey, retry.clientRequestKey);
    });

    test('generates distinct request keys per create attempt', () {
      expect(newGroupCreateRequestKey(), isNot(newGroupCreateRequestKey()));
    });
  });

  group('GroupCreateResult.fromSdkResponse', () {
    test('reads the created conversation item from the response data', () {
      final response = ConversationsCreateResponse201(
        code: 0,
        data: <String, dynamic>{
          'item': <String, dynamic>{
            'conversationId': 'g_123',
            'eventId': 'evt_1',
            'requestKey': 'grpcreq_test',
            'deliveryStatus': 'applied',
          },
        },
        traceId: 'trace-create',
      );

      final result = GroupCreateResult.fromSdkResponse(response);

      expect(result.conversationId, 'g_123');
      expect(result.deliveryStatus, 'applied');
      expect(result.requestKey, 'grpcreq_test');
    });

    test('surfaces idempotent replays through deliveryStatus', () {
      final response = ConversationsCreateResponse201(
        code: 0,
        data: <String, dynamic>{
          'item': <String, dynamic>{
            'conversationId': 'g_123',
            'eventId': 'evt_1',
            'deliveryStatus': 'replayed',
          },
        },
        traceId: 'trace-create',
      );

      expect(
        GroupCreateResult.fromSdkResponse(response).deliveryStatus,
        'replayed',
      );
    });

    test('rejects a response without a conversation id', () {
      final response = ConversationsCreateResponse201(
        code: 0,
        data: <String, dynamic>{
          'item': <String, dynamic>{'eventId': 'evt_1'},
        },
        traceId: 'trace-create',
      );

      expect(
        () => GroupCreateResult.fromSdkResponse(response),
        throwsStateError,
      );
    });
  });

  test('reads member pages from the SDK members list response', () {
    final response = ConversationsMembersListResponse(
      code: 0,
      data: <String, dynamic>{
        'items': <Map<String, dynamic>>[
          _member('m_1', 'u_1', role: 'owner').toJson(),
          _member('m_2', 'u_2', role: 'member').toJson(),
        ],
        'pageInfo': PageInfo(
          mode: 'cursor',
          nextCursor: 'cursor-2',
          hasMore: true,
        ).toJson(),
      },
      traceId: 'trace-members',
    );

    final page = readGroupMembersPageFromSdkResponse(response);

    expect(page.items.map((member) => member.memberId), <String>['m_1', 'm_2']);
    expect(page.items.map((member) => member.principalId), <String>['u_1', 'u_2']);
    expect(page.pageInfo.hasMore, isTrue);
    expect(page.pageInfo.nextCursor, 'cursor-2');
  });

  test('reads the group profile from the SDK profile response', () {
    final response = ConversationsProfileRetrieveResponse(
      code: 0,
      data: <String, dynamic>{
        'item': ConversationProfileView(
          tenantId: 'tenant-1',
          conversationId: 'g_123',
          displayName: 'Product Team',
          avatarUrl: '',
          notice: '',
          updatedAt: '2026-10-04T00:00:00Z',
        ).toJson(),
      },
      traceId: 'trace-profile',
    );

    final profile = readGroupProfileFromSdkResponse(response);

    expect(profile?.displayName, 'Product Team');
    expect(profile?.conversationId, 'g_123');
  });

  test('createGroup sends the group payload and reads the created id', () async {
    final client = _RecordingImClient();
    client.chatApi.createResponse = ConversationsCreateResponse201(
      code: 0,
      data: <String, dynamic>{
        'item': <String, dynamic>{
          'conversationId': 'g_new',
          'eventId': 'evt_1',
          'deliveryStatus': 'applied',
        },
      },
      traceId: 'trace-create',
    );
    final service = GroupService(client);

    final result = await service.createGroup(
      'Product Team',
      <String>['u_1', 'u_2'],
      clientRequestKey: 'grpcreq_test',
    );

    final request = client.chatApi.lastCreateRequest;
    expect(request, isNotNull);
    expect(request!.conversationType, 'group');
    expect(request.groupName, 'Product Team');
    expect(request.memberUserIds, <String>['u_1', 'u_2']);
    expect(request.clientRequestKey, 'grpcreq_test');
    expect(result.conversationId, 'g_new');
  });

  test('renameGroup updates the profile display name', () async {
    final client = _RecordingImClient();
    client.chatApi.profileUpdateResponse = ConversationsProfileUpdateResponse(
      code: 0,
      data: <String, dynamic>{
        'item': ConversationProfileView(
          tenantId: 'tenant-1',
          conversationId: 'g_123',
          displayName: 'Renamed Team',
          avatarUrl: '',
          notice: '',
          updatedAt: '2026-10-04T00:00:00Z',
        ).toJson(),
      },
      traceId: 'trace-rename',
    );
    final service = GroupService(client);

    final profile = await service.renameGroup('g_123', 'Renamed Team');

    expect(
      client.chatApi.lastProfileUpdateRequest?.displayName,
      'Renamed Team',
    );
    expect(profile?.displayName, 'Renamed Team');
  });

  test('addMember posts a user principal with the member role', () async {
    final client = _RecordingImClient();
    client.chatApi.memberAddResponse = ConversationsMembersAddResponse(
      code: 0,
      data: <String, dynamic>{
        'item': _member('m_3', 'u_3', role: 'member').toJson(),
      },
      traceId: 'trace-add',
    );
    final service = GroupService(client);

    final member = await service.addMember('g_123', 'u_3');

    final request = client.chatApi.lastMemberAddRequest;
    expect(request, isNotNull);
    expect(request!.principalId, 'u_3');
    expect(request.principalKind, 'user');
    expect(request.role, 'member');
    expect(member?.memberId, 'm_3');
  });

  test('removeMember keys the request on the membership id', () async {
    final client = _RecordingImClient();
    final service = GroupService(client);

    await service.removeMember('g_123', 'm_2');

    expect(client.chatApi.lastRemoveMemberRequest?.memberId, 'm_2');
  });

  test('leaveGroup calls the leave endpoint for the conversation', () async {
    final client = _RecordingImClient();
    final service = GroupService(client);

    await service.leaveGroup('g_123');

    expect(client.chatApi.leaveConversationId, 'g_123');
  });
}

ConversationMember _member(
  String memberId,
  String principalId, {
  required String role,
}) {
  return ConversationMember(
    tenantId: 'tenant-1',
    conversationId: 'g_123',
    memberId: memberId,
    principalId: principalId,
    principalKind: 'user',
    role: role,
    state: 'active',
    joinedAt: '2026-10-04T00:00:00Z',
  );
}

class _RecordingChatApi implements ChatApi {
  CreateConversationRequest? lastCreateRequest;
  ConversationsCreateResponse201? createResponse;
  UpdateConversationProfileRequest? lastProfileUpdateRequest;
  ConversationsProfileUpdateResponse? profileUpdateResponse;
  AddConversationMemberRequest? lastMemberAddRequest;
  ConversationsMembersAddResponse? memberAddResponse;
  RemoveConversationMemberRequest? lastRemoveMemberRequest;
  String? leaveConversationId;

  @override
  Future<ConversationsCreateResponse201?> conversationsCreate(
    CreateConversationRequest body,
  ) async {
    lastCreateRequest = body;
    return createResponse;
  }

  @override
  Future<ConversationsProfileUpdateResponse?> conversationsProfileUpdate(
    String conversationId,
    UpdateConversationProfileRequest body,
  ) async {
    lastProfileUpdateRequest = body;
    return profileUpdateResponse;
  }

  @override
  Future<ConversationsMembersAddResponse?> conversationsMembersAdd(
    String conversationId,
    AddConversationMemberRequest body,
  ) async {
    lastMemberAddRequest = body;
    return memberAddResponse;
  }

  @override
  Future<ConversationsMembersRemoveResponse?> conversationsMembersRemove(
    String conversationId,
    RemoveConversationMemberRequest body,
  ) async {
    lastRemoveMemberRequest = body;
    return ConversationsMembersRemoveResponse(
      code: 0,
      data: const <String, dynamic>{},
      traceId: 'trace-remove',
    );
  }

  @override
  Future<ConversationsMembersLeaveResponse?> conversationsMembersLeave(
    String conversationId,
  ) async {
    leaveConversationId = conversationId;
    return ConversationsMembersLeaveResponse(
      code: 0,
      data: const <String, dynamic>{},
      traceId: 'trace-leave',
    );
  }

  @override
  dynamic noSuchMethod(Invocation invocation) => throw UnimplementedError();
}

class _RecordingImClient implements SdkworkImClient {
  final _RecordingChatApi _chatApi = _RecordingChatApi();

  _RecordingChatApi get chatApi => _chatApi;

  @override
  ChatApi get chat => _chatApi;

  @override
  dynamic noSuchMethod(Invocation invocation) => throw UnimplementedError();
}

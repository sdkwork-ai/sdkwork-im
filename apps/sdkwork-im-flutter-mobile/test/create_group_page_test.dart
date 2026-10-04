import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:im_sdk_generated/im_sdk_generated.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';

void main() {
  Future<void> pumpCreateGroupPage(
    WidgetTester tester, {
    required _StubContactService contactService,
    required _StubGroupService groupService,
    required ValueChanged<String> onCreated,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: CreateGroupPage(
          groupService: groupService,
          contactService: contactService,
          onCreated: onCreated,
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('lists contacts and creates the group from the selection',
      (WidgetTester tester) async {
    final contactService = _StubContactService(<ContactEntry>[
      _contact('u_1', 'Alice'),
      _contact('u_2', 'Bob'),
    ]);
    final groupService = _StubGroupService();
    final createdIds = <String>[];

    await pumpCreateGroupPage(
      tester,
      contactService: contactService,
      groupService: groupService,
      onCreated: createdIds.add,
    );

    expect(find.text('Alice'), findsOneWidget);
    expect(find.text('Bob'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'Product Team');
    await tester.tap(find.text('Alice'));
    await tester.tap(find.text('Bob'));
    await tester.tap(find.text('Create'));
    await tester.pumpAndSettle();

    expect(groupService.createdName, 'Product Team');
    expect(groupService.createdMemberIds, <String>['u_1', 'u_2']);
    expect(createdIds, <String>['g_new']);
  });

  testWidgets('requires a group name before creating',
      (WidgetTester tester) async {
    final contactService = _StubContactService(<ContactEntry>[
      _contact('u_1', 'Alice'),
    ]);
    final groupService = _StubGroupService();

    await pumpCreateGroupPage(
      tester,
      contactService: contactService,
      groupService: groupService,
      onCreated: (_) {},
    );

    await tester.tap(find.text('Alice'));
    await tester.tap(find.text('Create'));
    await tester.pump();

    expect(groupService.createdName, isNull);
    expect(find.text('Enter a group name.'), findsOneWidget);
  });

  testWidgets('requires at least one selected member',
      (WidgetTester tester) async {
    final contactService = _StubContactService(<ContactEntry>[
      _contact('u_1', 'Alice'),
    ]);
    final groupService = _StubGroupService();

    await pumpCreateGroupPage(
      tester,
      contactService: contactService,
      groupService: groupService,
      onCreated: (_) {},
    );

    await tester.enterText(find.byType(TextField), 'Product Team');
    await tester.tap(find.text('Create'));
    await tester.pump();

    expect(groupService.createdName, isNull);
    expect(find.text('Select at least one member.'), findsOneWidget);
  });

  testWidgets('shows the empty state when no contacts exist',
      (WidgetTester tester) async {
    final contactService = _StubContactService(<ContactEntry>[]);
    final groupService = _StubGroupService();

    await pumpCreateGroupPage(
      tester,
      contactService: contactService,
      groupService: groupService,
      onCreated: (_) {},
    );

    expect(find.text('No contacts to add yet.'), findsOneWidget);
  });
}

ContactEntry _contact(String id, String name) {
  return ContactEntry(
    id: id,
    name: name,
    avatarUrl: '',
    relationshipState: 'friend',
  );
}

class _StubContactService extends ContactService {
  _StubContactService(this.entries) : super(_offlineClient());

  final List<ContactEntry> entries;

  @override
  Future<List<ContactEntry>> fetchContactEntries({
    int pageSize = contactsPageSize,
    int maxPages = maxContactSyncPages,
  }) async {
    return List<ContactEntry>.unmodifiable(entries);
  }
}

class _StubGroupService extends GroupService {
  _StubGroupService() : super(_offlineClient());

  String? createdName;
  List<String>? createdMemberIds;

  @override
  Future<GroupCreateResult> createGroup(
    String name,
    List<String> memberUserIds, {
    String? clientRequestKey,
  }) async {
    createdName = name;
    createdMemberIds = memberUserIds;
    return const GroupCreateResult(
      conversationId: 'g_new',
      deliveryStatus: 'applied',
    );
  }
}

SdkworkImClient _offlineClient() {
  return SdkworkImClient.withBaseUrl(baseUrl: 'http://127.0.0.1:9');
}

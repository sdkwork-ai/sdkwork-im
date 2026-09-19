import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';

import '../bootstrap/sdk_clients.dart';

/// Hosts the contacts capability inside the Flutter mobile root.
///
/// The root owns every cross-capability navigation: it supplies the address
/// book's app bar entries and opens chat conversations, so the contacts package
/// stays free of route and chat-package dependencies.
class ContactsHome extends StatefulWidget {
  const ContactsHome({super.key, required this.session});

  final ImAppSession session;

  @override
  State<ContactsHome> createState() => _ContactsHomeState();
}

class _ContactsHomeState extends State<ContactsHome> {
  late final ImSdkClientBundle _clientBundle;
  late final ContactService _contactService;
  late final ChatRealtimeService _realtimeService;

  @override
  void initState() {
    super.initState();
    _clientBundle = getSdkClients().im;
    _contactService = createContactService(_clientBundle);
    _realtimeService = createChatRealtimeService(_clientBundle);
  }

  @override
  void dispose() {
    unawaited(_realtimeService.stop());
    super.dispose();
  }

  void _push(Widget page) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => page),
    );
  }

  void _openConversation(String conversationId) {
    _push(
      ChatConversationPage(
        conversationService: createChatConversationService(_clientBundle),
        realtimeService: _realtimeService,
        conversationId: conversationId,
        applicationPublicHttpUrl: getSdkClients().applicationPublicHttpUrl,
        session: widget.session,
        title: conversationId,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = ContactsLocalizations.of(context);
    return AddressBookPage(
      contactService: _contactService,
      onOpenConversation: _openConversation,
      actions: [
        IconButton(
          icon: const Icon(Icons.person_add_alt),
          tooltip: l10n.newFriendsTitle,
          onPressed: () => _push(
            NewFriendsPage(contactService: _contactService),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.group_add_outlined),
          tooltip: l10n.addFriendTitle,
          onPressed: () => _push(
            AddFriendPage(contactService: _contactService),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.account_tree_outlined),
          tooltip: l10n.organizationDirectoryTitle,
          onPressed: () => _push(const OrganizationDirectoryPage()),
        ),
      ],
    );
  }
}

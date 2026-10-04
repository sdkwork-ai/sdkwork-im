import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';
import 'package:sdkwork_im_flutter_mobile_shell/sdkwork_im_flutter_mobile_shell.dart';

import '../../l10n/generated/app_localizations.dart';
import '../services/group_service.dart';

/// Builds create-group copy at render time so stored errors stay localized.
typedef _ErrorMessageBuilder = String Function(AppLocalizations l10n);

/// Creates a group conversation from a name and a multi-select of contacts.
///
/// The page only shapes the create call; navigation belongs to the host root,
/// which receives the created conversation id through [onCreated] — the same
/// callback split the address book uses for opening conversations.
class CreateGroupPage extends StatefulWidget {
  const CreateGroupPage({
    super.key,
    required this.groupService,
    required this.contactService,
    required this.onCreated,
  });

  final GroupService groupService;
  final ContactService contactService;

  /// Invoked with the created conversation id; the host owns navigation.
  final void Function(String conversationId) onCreated;

  @override
  State<CreateGroupPage> createState() => _CreateGroupPageState();
}

class _CreateGroupPageState extends State<CreateGroupPage> {
  final _nameController = TextEditingController();
  final Set<String> _selectedUserIds = <String>{};
  List<ContactEntry> _contacts = const [];
  bool _loadingContacts = true;
  bool _creating = false;
  _ErrorMessageBuilder? _contactsLoadError;

  /// Pinned across retries of one logical create so the server replays the
  /// first accepted result instead of creating a duplicate group.
  String? _pendingCreateRequestKey;

  @override
  void initState() {
    super.initState();
    unawaited(_loadContacts());
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _loadContacts() async {
    setState(() {
      _loadingContacts = true;
      _contactsLoadError = null;
    });
    try {
      final entries = await widget.contactService.fetchContactEntries();
      if (!mounted) {
        return;
      }
      setState(() {
        _contacts = entries
            .where((entry) => !entry.isBlocked)
            .toList(growable: false);
        _loadingContacts = false;
      });
    } catch (_) {
      if (!mounted) {
        return;
      }
      setState(() {
        _loadingContacts = false;
        _contactsLoadError = (l10n) => l10n.groupContactsLoadFailed;
      });
    }
  }

  void _toggleSelected(String userId) {
    setState(() {
      if (!_selectedUserIds.add(userId)) {
        _selectedUserIds.remove(userId);
      }
    });
  }

  Future<void> _handleCreate() async {
    final l10n = AppLocalizations.of(context);
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(content: Text(l10n.createGroupNameEmpty)),
      );
      return;
    }
    if (_selectedUserIds.isEmpty) {
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(content: Text(l10n.createGroupMembersRequired)),
      );
      return;
    }
    if (_creating) {
      return;
    }
    final requestKey =
        _pendingCreateRequestKey ??= newClientMessageId();
    setState(() => _creating = true);
    try {
      final result = await widget.groupService.createGroup(
        name,
        _selectedUserIds.toList(growable: false),
        clientRequestKey: requestKey,
      );
      _pendingCreateRequestKey = null;
      if (!mounted) {
        return;
      }
      widget.onCreated(result.conversationId);
    } catch (error) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(
          content: Text(l10n.createGroupFailed('$error')),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _creating = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return ImAppScaffold(
      title: l10n.createGroupTitle,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: l10n.groupNameLabel,
                border: const OutlineInputBorder(),
                isDense: true,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                l10n.groupMembersHeader,
                style: Theme.of(context).textTheme.labelLarge,
              ),
            ),
          ),
          Expanded(child: _buildContactList(l10n)),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _creating ? null : _handleCreate,
                  child: Text(_creating ? l10n.createGroupCreating : l10n.createGroupCreate),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactList(AppLocalizations l10n) {
    if (_loadingContacts) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_contactsLoadError != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_contactsLoadError!(l10n)),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _loadingContacts ? null : _loadContacts,
              child: Text(l10n.retry),
            ),
          ],
        ),
      );
    }
    if (_contacts.isEmpty) {
      return Center(child: Text(l10n.createGroupContactsEmpty));
    }
    return ListView.builder(
      itemCount: _contacts.length,
      itemBuilder: (context, index) {
        final entry = _contacts[index];
        final selected = _selectedUserIds.contains(entry.id);
        return CheckboxListTile(
          value: selected,
          onChanged: (_) => _toggleSelected(entry.id),
          secondary: CircleAvatar(
            child: Text(
              entry.name.isEmpty ? '?' : entry.name.substring(0, 1).toUpperCase(),
            ),
          ),
          title: Text(entry.name.isEmpty ? entry.id : entry.name),
          subtitle: entry.name.isEmpty ? null : Text(entry.id),
        );
      },
    );
  }
}

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';
import 'package:sdkwork_im_flutter_mobile_shell/sdkwork_im_flutter_mobile_shell.dart';

import '../../l10n/generated/app_localizations.dart';
import '../services/group_service.dart';

/// Builds group profile copy at render time so stored errors stay localized.
typedef _ErrorMessageBuilder = String Function(AppLocalizations l10n);

/// Group management surface: profile (rename), members (add/remove), leave.
///
/// Reached from the conversation app bar for group conversations; the host
/// owns what happens after leaving through [onLeft] (the conversation screen
/// pops back to the inbox).
class GroupProfilePage extends StatefulWidget {
  const GroupProfilePage({
    super.key,
    required this.groupService,
    required this.contactService,
    required this.conversationId,
    required this.currentUserId,
    required this.onLeft,
    this.initialName,
  });

  final GroupService groupService;
  final ContactService contactService;
  final String conversationId;
  final String currentUserId;

  /// Invoked after the current user left the group; the host owns navigation.
  final void Function() onLeft;

  final String? initialName;

  @override
  State<GroupProfilePage> createState() => _GroupProfilePageState();
}

class _GroupProfilePageState extends State<GroupProfilePage> {
  List<ConversationMember> _members = const [];
  String? _groupName;
  bool _loading = true;
  bool _leaving = false;
  String? _pendingMemberKey;
  _ErrorMessageBuilder? _loadError;

  @override
  void initState() {
    super.initState();
    _groupName = widget.initialName;
    unawaited(_loadGroup());
  }

  String get _title {
    final name = _groupName?.trim();
    if (name != null && name.isNotEmpty) {
      return name;
    }
    return widget.conversationId;
  }

  Future<void> _loadGroup() async {
    setState(() {
      _loading = true;
      _loadError = null;
    });
    try {
      final profile = await widget.groupService.loadGroupProfile(
        widget.conversationId,
      );
      final members = await widget.groupService.fetchMembers(
        widget.conversationId,
      );
      if (!mounted) {
        return;
      }
      setState(() {
        final profileName = profile?.displayName.trim();
        if (profileName != null && profileName.isNotEmpty) {
          _groupName = profileName;
        }
        _members = members;
        _loading = false;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _loadError = (l10n) => l10n.groupLoadFailed('$error');
        _loading = false;
      });
    }
  }

  void _showActionError(_ErrorMessageBuilder builder) {
    final l10n = AppLocalizations.of(context);
    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
      SnackBar(content: Text(builder(l10n))),
    );
  }

  Future<void> _handleRename() async {
    final l10n = AppLocalizations.of(context);
    final controller = TextEditingController(text: _groupName ?? '');
    final confirmed = await showDialog<String>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(l10n.renameGroupAction),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: InputDecoration(labelText: l10n.groupNameLabel),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: Text(l10n.groupCancel),
          ),
          FilledButton(
            onPressed: () =>
                Navigator.of(dialogContext).pop(controller.text.trim()),
            child: Text(l10n.renameGroupSave),
          ),
        ],
      ),
    );
    if (confirmed == null || confirmed.isEmpty || !mounted) {
      return;
    }
    try {
      final profile = await widget.groupService.renameGroup(
        widget.conversationId,
        confirmed,
      );
      if (!mounted) {
        return;
      }
      setState(() {
        final name = profile?.displayName.trim();
        if (name != null && name.isNotEmpty) {
          _groupName = name;
        }
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showActionError((l10n) => l10n.renameGroupFailed('$error'));
    }
  }

  Future<void> _handleAddMembers() async {
    final l10n = AppLocalizations.of(context);
    final selected = await showGroupMemberPicker(
      context: context,
      contactService: widget.contactService,
      existingUserIds: _members.map((member) => member.principalId).toSet(),
      l10n: l10n,
    );
    if (selected == null || selected.isEmpty || !mounted) {
      return;
    }
    try {
      for (final userId in selected) {
        await widget.groupService.addMember(widget.conversationId, userId);
      }
      if (!mounted) {
        return;
      }
      await _loadGroup();
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showActionError((l10n) => l10n.groupAddMembersFailed('$error'));
    }
  }

  Future<void> _handleRemoveMember(ConversationMember member) async {
    final l10n = AppLocalizations.of(context);
    final memberName = _memberName(member, l10n);
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(l10n.groupRemoveMemberConfirmTitle),
        content: Text(l10n.groupRemoveMemberConfirmBody(memberName)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(l10n.groupCancel),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: Text(l10n.groupConfirm),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) {
      return;
    }
    setState(() => _pendingMemberKey = member.memberId);
    try {
      await widget.groupService.removeMember(
        widget.conversationId,
        member.memberId,
      );
      if (!mounted) {
        return;
      }
      await _loadGroup();
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showActionError((l10n) => l10n.groupRemoveMemberFailed('$error'));
    } finally {
      if (mounted) {
        setState(() => _pendingMemberKey = null);
      }
    }
  }

  Future<void> _handleLeave() async {
    final l10n = AppLocalizations.of(context);
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(l10n.leaveGroupConfirmTitle),
        content: Text(l10n.leaveGroupConfirmBody),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(l10n.groupCancel),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: Text(l10n.groupConfirm),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted || _leaving) {
      return;
    }
    setState(() => _leaving = true);
    try {
      await widget.groupService.leaveGroup(widget.conversationId);
      if (!mounted) {
        return;
      }
      widget.onLeft();
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showActionError((l10n) => l10n.leaveGroupFailed('$error'));
    } finally {
      if (mounted) {
        setState(() => _leaving = false);
      }
    }
  }

  String _memberName(ConversationMember member, AppLocalizations l10n) {
    if (member.principalId == widget.currentUserId) {
      return l10n.groupMemberYou;
    }
    return member.principalId;
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return ImAppScaffold(
      title: l10n.groupProfileTitle,
      actions: [
        IconButton(
          tooltip: l10n.groupAddMembers,
          onPressed: _loading ? null : _handleAddMembers,
          icon: const Icon(Icons.person_add_alt_1_outlined),
        ),
      ],
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _loadError != null
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(_loadError!(l10n), textAlign: TextAlign.center),
                      const SizedBox(height: 12),
                      FilledButton(
                        onPressed: _loadGroup,
                        child: Text(l10n.retry),
                      ),
                    ],
                  ),
                )
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    Card(
                      child: ListTile(
                        leading: const Icon(Icons.badge_outlined),
                        title: Text(l10n.groupNameLabel),
                        subtitle: Text(_title),
                        trailing: const Icon(Icons.edit_outlined, size: 18),
                        onTap: _handleRename,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      l10n.groupMemberCount(_members.length),
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                    const SizedBox(height: 8),
                    for (final member in _members)
                      _buildMemberTile(member, l10n),
                    const SizedBox(height: 16),
                    ListTile(
                      leading: Icon(
                        Icons.logout,
                        color: Theme.of(context).colorScheme.error,
                      ),
                      title: Text(
                        l10n.leaveGroup,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                      ),
                      enabled: !_leaving,
                      trailing: _leaving
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : null,
                      onTap: _handleLeave,
                    ),
                  ],
                ),
    );
  }

  Widget _buildMemberTile(ConversationMember member, AppLocalizations l10n) {
    final isSelf = member.principalId == widget.currentUserId;
    final isBusy = _pendingMemberKey == member.memberId;
    final initial = member.principalId.isEmpty
        ? '?'
        : member.principalId.substring(0, 1).toUpperCase();
    return ListTile(
      leading: CircleAvatar(child: Text(initial)),
      title: Text(_memberName(member, l10n)),
      subtitle: member.role.isEmpty ? null : Text(member.role),
      trailing: isBusy
          ? const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : isSelf
              ? null
              : IconButton(
                  tooltip: l10n.groupRemoveMember,
                  icon: const Icon(Icons.person_remove_outlined),
                  onPressed: () => unawaited(_handleRemoveMember(member)),
                ),
    );
  }
}

/// Multi-select contact picker used for adding group members.
///
/// Contacts already in the group stay visible but disabled so the picker is
/// honest about the current membership.
Future<List<String>?> showGroupMemberPicker({
  required BuildContext context,
  required ContactService contactService,
  required Set<String> existingUserIds,
  required AppLocalizations l10n,
}) {
  return showModalBottomSheet<List<String>>(
    context: context,
    isScrollControlled: true,
    builder: (sheetContext) => _GroupMemberPickerSheet(
      contactService: contactService,
      existingUserIds: existingUserIds,
      l10n: l10n,
    ),
  );
}

class _GroupMemberPickerSheet extends StatefulWidget {
  const _GroupMemberPickerSheet({
    required this.contactService,
    required this.existingUserIds,
    required this.l10n,
  });

  final ContactService contactService;
  final Set<String> existingUserIds;
  final AppLocalizations l10n;

  @override
  State<_GroupMemberPickerSheet> createState() =>
      _GroupMemberPickerSheetState();
}

class _GroupMemberPickerSheetState extends State<_GroupMemberPickerSheet> {
  final Set<String> _selected = <String>{};
  List<ContactEntry>? _contacts;
  bool _loadFailed = false;

  @override
  void initState() {
    super.initState();
    unawaited(_loadContacts());
  }

  Future<void> _loadContacts() async {
    try {
      final entries = await widget.contactService.fetchContactEntries();
      if (!mounted) {
        return;
      }
      setState(() {
        _contacts = entries
            .where((entry) => !entry.isBlocked)
            .toList(growable: false);
        _loadFailed = false;
      });
    } catch (_) {
      if (!mounted) {
        return;
      }
      setState(() => _loadFailed = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = widget.l10n;
    final contacts = _contacts;
    return SafeArea(
      child: SizedBox(
        height: MediaQuery.of(context).size.height * 0.7,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      l10n.groupAddMembers,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ),
                  TextButton(
                    onPressed: _selected.isEmpty
                        ? null
                        : () => Navigator.of(context).pop(_selected.toList()),
                    child: Text(l10n.groupAddMembersSave),
                  ),
                ],
              ),
            ),
            Expanded(
              child: contacts == null
                  ? Center(
                      child: _loadFailed
                          ? Text(l10n.groupContactsLoadFailed)
                          : const CircularProgressIndicator(),
                    )
                  : contacts.isEmpty
                      ? Center(child: Text(l10n.createGroupContactsEmpty))
                      : ListView.builder(
                          itemCount: contacts.length,
                          itemBuilder: (context, index) {
                            final entry = contacts[index];
                            final existing =
                                widget.existingUserIds.contains(entry.id);
                            return CheckboxListTile(
                              value: existing || _selected.contains(entry.id),
                              onChanged: existing
                                  ? null
                                  : (_) => setState(() {
                                        if (!_selected.add(entry.id)) {
                                          _selected.remove(entry.id);
                                        }
                                      }),
                              secondary: CircleAvatar(
                                child: Text(
                                  entry.name.isEmpty
                                      ? '?'
                                      : entry.name
                                          .substring(0, 1)
                                          .toUpperCase(),
                                ),
                              ),
                              title: Text(
                                entry.name.isEmpty ? entry.id : entry.name,
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

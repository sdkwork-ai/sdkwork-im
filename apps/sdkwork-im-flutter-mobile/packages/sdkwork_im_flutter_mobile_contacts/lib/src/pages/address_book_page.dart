import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_shell/sdkwork_im_flutter_mobile_shell.dart';

import '../../l10n/generated/contacts_localizations.dart';
import '../services/contact_service.dart';

/// Builds contacts copy at render time so stored errors stay localized.
typedef _ErrorMessageBuilder = String Function(ContactsLocalizations l10n);

enum _ContactMenuAction { sendMessage, toggleBlock, removeFriend }

/// Address book: the contacts window, local search, and per-contact actions.
///
/// The page never opens a conversation itself; opening one belongs to the chat
/// capability, so the host root passes [onOpenConversation] and owns the
/// navigation.
class AddressBookPage extends StatefulWidget {
  const AddressBookPage({
    super.key,
    required this.contactService,
    required this.onOpenConversation,
    this.actions,
  });

  final ContactService contactService;

  /// Opens the chat conversation screen for a resolved conversation id.
  final void Function(String conversationId) onOpenConversation;

  /// App bar actions supplied by the host root (new friends, add friend,
  /// organization). The capability package does not own those routes.
  final List<Widget>? actions;

  @override
  State<AddressBookPage> createState() => _AddressBookPageState();
}

class _AddressBookPageState extends State<AddressBookPage> {
  final List<ContactEntry> _entries = [];
  final TextEditingController _searchController = TextEditingController();
  String? _nextCursor;
  bool _hasMore = true;
  bool _loading = false;
  bool _initialLoadComplete = false;
  String _query = '';
  String? _pendingContactId;
  _ErrorMessageBuilder? _loadError;

  @override
  void initState() {
    super.initState();
    unawaited(_loadContactPage(reset: true));
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadContactPage({required bool reset}) async {
    if (_loading) {
      return;
    }
    final cursor = _nextCursor;
    if (!reset && (!_hasMore || cursor == null || cursor.isEmpty)) {
      return;
    }
    setState(() {
      _loading = true;
      if (reset) {
        _loadError = null;
      }
    });
    try {
      final response = await widget.contactService
          .fetchContactPage(cursor: reset ? null : cursor);
      if (!mounted) {
        return;
      }
      setState(() {
        final page = mergeContactPage(
          reset ? const <ContactEntry>[] : _entries,
          response.items,
          direction: reset
              ? ContactWindowDirection.newer
              : ContactWindowDirection.older,
        );
        if (!page.incomingPageRetained) {
          _loadError = (l10n) => l10n.contactsPageRetainError;
          _initialLoadComplete = true;
          return;
        }
        _entries
          ..clear()
          ..addAll(page.items);
        final pageInfo = response.pageInfo;
        final nextCursor = pageInfo.nextCursor;
        _hasMore = pageInfo.hasMore == true &&
            nextCursor != null &&
            nextCursor.isNotEmpty;
        _nextCursor = _hasMore ? nextCursor : null;
        _initialLoadComplete = true;
        _loadError = null;
      });
    } catch (_) {
      if (!mounted) {
        return;
      }
      setState(() {
        _loadError = (l10n) => l10n.contactsLoadError;
        _initialLoadComplete = true;
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  void _replaceEntry(String contactId, ContactEntry entry) {
    final index = _entries.indexWhere((item) => item.id == contactId);
    if (index >= 0) {
      _entries[index] = entry;
    }
  }

  void _showActionError(_ErrorMessageBuilder builder) {
    final l10n = ContactsLocalizations.of(context);
    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
      SnackBar(content: Text(builder(l10n))),
    );
  }

  Future<void> _openConversation(ContactEntry entry) async {
    final existing = entry.conversationId;
    if (existing != null && existing.isNotEmpty) {
      widget.onOpenConversation(existing);
      return;
    }
    setState(() => _pendingContactId = entry.id);
    try {
      final conversationId =
          await widget.contactService.startDirectConversation(entry.id);
      if (!mounted) {
        return;
      }
      widget.onOpenConversation(conversationId);
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showActionError((l10n) => l10n.conversationStartFailed('$error'));
    } finally {
      if (mounted) {
        setState(() => _pendingContactId = null);
      }
    }
  }

  Future<void> _toggleBlock(ContactEntry entry) async {
    setState(() => _pendingContactId = entry.id);
    try {
      final preferences = entry.isBlocked
          ? await widget.contactService.unblockContact(entry.id)
          : await widget.contactService.blockContact(entry.id);
      if (!mounted) {
        return;
      }
      final isBlocked = preferences?.isBlocked ?? !entry.isBlocked;
      _replaceEntry(
        entry.id,
        ContactEntry(
          id: entry.id,
          name: entry.name,
          avatarUrl: entry.avatarUrl,
          relationshipState: entry.relationshipState,
          conversationId: entry.conversationId,
          friendshipId: entry.friendshipId,
          isStarred: preferences?.isStarred ?? entry.isStarred,
          isBlocked: isBlocked,
        ),
      );
      setState(() {});
      _showActionError(
        (l10n) => isBlocked ? l10n.contactBlocked : l10n.contactUnblocked,
      );
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showActionError((l10n) => l10n.contactPreferencesFailed('$error'));
    } finally {
      if (mounted) {
        setState(() => _pendingContactId = null);
      }
    }
  }

  Future<void> _confirmRemoveFriend(ContactEntry entry) async {
    final l10n = ContactsLocalizations.of(context);
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(l10n.removeFriendConfirmTitle),
        content: Text(l10n.removeFriendConfirmBody(entry.name)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(l10n.cancel),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: Text(l10n.confirm),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) {
      return;
    }
    setState(() => _pendingContactId = entry.id);
    try {
      await widget.contactService.removeFriend(
        entry.id,
        friendshipId: entry.friendshipId,
      );
      if (!mounted) {
        return;
      }
      setState(() {
        _entries.removeWhere((item) => item.id == entry.id);
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showActionError((l10n) => l10n.removeFriendFailed('$error'));
    } finally {
      if (mounted) {
        setState(() => _pendingContactId = null);
      }
    }
  }

  Future<void> _handleMenuAction(
    _ContactMenuAction action,
    ContactEntry entry,
  ) async {
    switch (action) {
      case _ContactMenuAction.sendMessage:
        await _openConversation(entry);
      case _ContactMenuAction.toggleBlock:
        await _toggleBlock(entry);
      case _ContactMenuAction.removeFriend:
        await _confirmRemoveFriend(entry);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = ContactsLocalizations.of(context);
    return ImAppScaffold(
      title: l10n.addressBookTitle,
      actions: widget.actions,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search),
                hintText: l10n.contactSearchHint,
                border: const OutlineInputBorder(),
                isDense: true,
              ),
              onChanged: (value) => setState(() => _query = value),
            ),
          ),
          Expanded(child: _buildBody(l10n)),
        ],
      ),
    );
  }

  Widget _buildBody(ContactsLocalizations l10n) {
    if (!_initialLoadComplete && _loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_loadError != null && _entries.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_loadError!(l10n), textAlign: TextAlign.center),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _loading ? null : () => _loadContactPage(reset: true),
              child: Text(l10n.retry),
            ),
          ],
        ),
      );
    }
    if (_entries.isEmpty) {
      return Center(child: Text(l10n.contactsEmpty));
    }
    final visible = filterContactEntries(_entries, _query);
    if (visible.isEmpty) {
      return Center(child: Text(l10n.contactSearchEmpty));
    }
    final grouped = groupContactsByInitial(visible);
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: [
        for (final group in grouped.keys) ...[
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Text(
              group,
              style: Theme.of(context).textTheme.labelLarge,
            ),
          ),
          for (final entry in grouped[group]!)
            _buildContactTile(entry, l10n),
        ],
        if (_hasMore)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Center(
              child: TextButton(
                onPressed:
                    _loading ? null : () => _loadContactPage(reset: false),
                child: _loading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text(l10n.loadMore),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildContactTile(ContactEntry entry, ContactsLocalizations l10n) {
    final isBusy = _pendingContactId == entry.id;
    return ListTile(
      leading: CircleAvatar(
        child: Text(
          entry.name.isEmpty ? '?' : entry.name.substring(0, 1).toUpperCase(),
        ),
      ),
      title: Text(entry.name.isEmpty ? l10n.unknownContact : entry.name),
      subtitle: entry.isBlocked ? Text(l10n.blockContact) : null,
      enabled: !isBusy,
      trailing: isBusy
          ? const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : PopupMenuButton<_ContactMenuAction>(
              onSelected: (action) => unawaited(
                _handleMenuAction(action, entry),
              ),
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: _ContactMenuAction.sendMessage,
                  child: Text(l10n.sendMessage),
                ),
                PopupMenuItem(
                  value: _ContactMenuAction.toggleBlock,
                  child: Text(
                    entry.isBlocked ? l10n.unblockContact : l10n.blockContact,
                  ),
                ),
                PopupMenuItem(
                  value: _ContactMenuAction.removeFriend,
                  child: Text(l10n.removeFriend),
                ),
              ],
            ),
    );
  }
}

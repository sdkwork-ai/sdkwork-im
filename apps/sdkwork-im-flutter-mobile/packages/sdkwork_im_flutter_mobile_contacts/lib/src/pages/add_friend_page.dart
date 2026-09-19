import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_shell/sdkwork_im_flutter_mobile_shell.dart';

import '../../l10n/generated/contacts_localizations.dart';
import '../services/contact_service.dart';

/// Add friend: search users through the SDK, then submit a friend request.
///
/// The conflict vocabulary comes from [classifyFriendRequestSubmitError] so the
/// server's duplicate / pending / blocked failures stay actionable.
class AddFriendPage extends StatefulWidget {
  const AddFriendPage({super.key, required this.contactService});

  final ContactService contactService;

  @override
  State<AddFriendPage> createState() => _AddFriendPageState();
}

class _AddFriendPageState extends State<AddFriendPage> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();
  List<ContactSearchResult> _results = const <ContactSearchResult>[];
  ContactSearchResult? _selected;
  String _submittedQuery = '';
  bool _searching = false;
  bool _submitting = false;
  String? _searchError;

  @override
  void dispose() {
    _searchController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    final query = _searchController.text.trim();
    if (query.isEmpty) {
      setState(() {
        _results = const <ContactSearchResult>[];
        _submittedQuery = '';
        _searchError = null;
      });
      return;
    }
    setState(() {
      _searching = true;
      _searchError = null;
      _selected = null;
    });
    try {
      final page = await widget.contactService.searchUsers(query);
      if (!mounted) {
        return;
      }
      setState(() {
        _results = page.items;
        _submittedQuery = query;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() {
        _results = const <ContactSearchResult>[];
        _submittedQuery = query;
        _searchError = '$error';
      });
    } finally {
      if (mounted) {
        setState(() => _searching = false);
      }
    }
  }

  String _conflictMessage(
    ContactsLocalizations l10n,
    FriendRequestSubmitConflict conflict,
    String error,
  ) {
    switch (conflict) {
      case FriendRequestSubmitConflict.alreadyFriend:
        return l10n.friendRequestConflictAlreadyFriend;
      case FriendRequestSubmitConflict.pending:
        return l10n.friendRequestConflictPending;
      case FriendRequestSubmitConflict.blocked:
        return l10n.friendRequestConflictBlocked;
      case FriendRequestSubmitConflict.unknown:
        return l10n.friendRequestConflictUnknown(error);
    }
  }

  Future<void> _submit() async {
    final target = _selected;
    if (target == null) {
      return;
    }
    final l10n = ContactsLocalizations.of(context);
    setState(() => _submitting = true);
    try {
      await widget.contactService.submitFriendRequest(
        targetUserId: target.id,
        requestMessage: _messageController.text,
      );
      if (!mounted) {
        return;
      }
      _messageController.clear();
      setState(() => _selected = null);
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(content: Text(l10n.friendRequestSubmitted)),
      );
    } catch (error) {
      if (!mounted) {
        return;
      }
      final conflict = classifyFriendRequestSubmitError(error);
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        SnackBar(
          content: Text(_conflictMessage(l10n, conflict, '$error')),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _submitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = ContactsLocalizations.of(context);
    return ImAppScaffold(
      title: l10n.addFriendTitle,
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.search),
                      hintText: l10n.userSearchHint,
                      border: const OutlineInputBorder(),
                      isDense: true,
                    ),
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => unawaited(_search()),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: _searching ? null : () => unawaited(_search()),
                  child: _searching
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text(l10n.search),
                ),
              ],
            ),
          ),
          if (_searchError != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                l10n.userSearchFailed(_searchError!),
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ),
          if (_selected != null) _buildSubmitPanel(l10n, _selected!),
          Expanded(child: _buildResultList(l10n)),
        ],
      ),
    );
  }

  Widget _buildSubmitPanel(
    ContactsLocalizations l10n,
    ContactSearchResult target,
  ) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                target.name.isEmpty ? target.id : target.name,
                style: Theme.of(context).textTheme.titleSmall,
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _messageController,
                decoration: InputDecoration(
                  hintText: l10n.addFriendMessageHint,
                  border: const OutlineInputBorder(),
                  isDense: true,
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: FilledButton(
                  onPressed: _submitting ? null : () => unawaited(_submit()),
                  child: _submitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text(l10n.submitFriendRequest),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildResultList(ContactsLocalizations l10n) {
    if (_submittedQuery.isEmpty) {
      return Center(child: Text(l10n.userSearchPrompt));
    }
    if (_results.isEmpty && !_searching) {
      return Center(child: Text(l10n.userSearchEmpty));
    }
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _results.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final result = _results[index];
        return Card(
          child: ListTile(
            leading: CircleAvatar(
              child: Text(
                result.name.isEmpty
                    ? '?'
                    : result.name.substring(0, 1).toUpperCase(),
              ),
            ),
            title: Text(result.name.isEmpty ? result.id : result.name),
            subtitle: Text(result.id),
            selected: _selected?.id == result.id,
            onTap: () => setState(() => _selected = result),
          ),
        );
      },
    );
  }
}

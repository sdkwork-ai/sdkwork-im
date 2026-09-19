import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_commons/sdkwork_im_flutter_mobile_commons.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';
import 'package:sdkwork_im_flutter_mobile_shell/sdkwork_im_flutter_mobile_shell.dart';

import '../../l10n/generated/contacts_localizations.dart';
import '../services/contact_service.dart';

/// Builds friend request copy at render time so stored errors stay localized.
typedef _ErrorMessageBuilder = String Function(ContactsLocalizations l10n);

/// New friends screen: incoming and outgoing friend requests with their
/// accept / decline / cancel actions.
class NewFriendsPage extends StatelessWidget {
  const NewFriendsPage({super.key, required this.contactService});

  final ContactService contactService;

  @override
  Widget build(BuildContext context) {
    final l10n = ContactsLocalizations.of(context);
    return DefaultTabController(
      length: 2,
      child: ImAppScaffold(
        title: l10n.newFriendsTitle,
        body: Column(
          children: [
            TabBar(
              tabs: [
                Tab(text: l10n.incomingRequests),
                Tab(text: l10n.outgoingRequests),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _FriendRequestList(
                    contactService: contactService,
                    direction: FriendRequestDirection.incoming,
                  ),
                  _FriendRequestList(
                    contactService: contactService,
                    direction: FriendRequestDirection.outgoing,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FriendRequestList extends StatefulWidget {
  const _FriendRequestList({
    required this.contactService,
    required this.direction,
  });

  final ContactService contactService;
  final FriendRequestDirection direction;

  @override
  State<_FriendRequestList> createState() => _FriendRequestListState();
}

class _FriendRequestListState extends State<_FriendRequestList>
    with AutomaticKeepAliveClientMixin {
  final List<FriendRequest> _entries = [];
  String? _nextCursor;
  bool _hasMore = true;
  bool _loading = false;
  bool _initialLoadComplete = false;
  int? _pendingCount;
  String? _pendingRequestId;
  _ErrorMessageBuilder? _loadError;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    unawaited(_loadPage(reset: true));
    if (widget.direction == FriendRequestDirection.incoming) {
      unawaited(_loadPendingCount());
    }
  }

  Future<void> _loadPendingCount() async {
    try {
      final count =
          await widget.contactService.fetchPendingFriendRequestCount();
      if (!mounted) {
        return;
      }
      setState(() => _pendingCount = count);
    } catch (_) {
      // The badge is advisory; a failure keeps the last known count.
    }
  }

  Future<void> _loadPage({required bool reset}) async {
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
      final response = await widget.contactService.fetchFriendRequestPage(
        widget.direction,
        cursor: reset ? null : cursor,
      );
      if (!mounted) {
        return;
      }
      setState(() {
        final page = mergeFriendRequestPage(
          reset ? const <FriendRequest>[] : _entries,
          response.items,
          direction: reset
              ? ContactWindowDirection.newer
              : ContactWindowDirection.older,
        );
        if (!page.incomingPageRetained) {
          _loadError = (l10n) => l10n.friendRequestsPageRetainError;
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
        _loadError = (l10n) => l10n.friendRequestsLoadError;
        _initialLoadComplete = true;
      });
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  void _showMessage(_ErrorMessageBuilder builder) {
    final l10n = ContactsLocalizations.of(context);
    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
      SnackBar(content: Text(builder(l10n))),
    );
  }

  Future<void> _runAction(
    FriendRequest request,
    Future<Object?> Function() action,
    _ErrorMessageBuilder successBuilder,
  ) async {
    setState(() => _pendingRequestId = request.friendRequestId);
    try {
      await action();
      if (!mounted) {
        return;
      }
      setState(() {
        _entries
            .removeWhere((item) => item.friendRequestId == request.friendRequestId);
      });
      _showMessage(successBuilder);
      if (widget.direction == FriendRequestDirection.incoming) {
        unawaited(_loadPendingCount());
      }
    } catch (error) {
      if (!mounted) {
        return;
      }
      _showMessage((l10n) => l10n.friendRequestActionFailed('$error'));
    } finally {
      if (mounted) {
        setState(() => _pendingRequestId = null);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final l10n = ContactsLocalizations.of(context);
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
              onPressed: _loading ? null : () => _loadPage(reset: true),
              child: Text(l10n.retry),
            ),
          ],
        ),
      );
    }
    return Column(
      children: [
        if (widget.direction == FriendRequestDirection.incoming &&
            _pendingCount != null &&
            _pendingCount! > 0)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Chip(
                label: Text(l10n.pendingRequestCount(_pendingCount!)),
              ),
            ),
          ),
        Expanded(
          child: _entries.isEmpty
              ? Center(child: Text(l10n.friendRequestsEmpty))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _entries.length + (_hasMore ? 1 : 0),
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    if (index >= _entries.length) {
                      return TextButton(
                        onPressed:
                            _loading ? null : () => _loadPage(reset: false),
                        child: _loading
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child:
                                    CircularProgressIndicator(strokeWidth: 2),
                              )
                            : Text(l10n.loadMore),
                      );
                    }
                    return _buildRequestCard(_entries[index], l10n);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildRequestCard(FriendRequest request, ContactsLocalizations l10n) {
    final isBusy = _pendingRequestId == request.friendRequestId;
    final isIncoming = widget.direction == FriendRequestDirection.incoming;
    final peerId = isIncoming ? request.requesterUserId : request.targetUserId;
    final message = request.requestMessage?.trim();
    return Card(
      child: ListTile(
        title: Text(peerId),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (message != null && message.isNotEmpty) Text(message),
            Text(
              formatRelativeTime(request.createdAt),
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
        trailing: isBusy
            ? const SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: isIncoming
                    ? [
                        TextButton(
                          onPressed: () => unawaited(_runAction(
                            request,
                            () => widget.contactService
                                .acceptFriendRequest(request.friendRequestId),
                            (l10n) => l10n.friendRequestAccepted,
                          )),
                          child: Text(l10n.acceptRequest),
                        ),
                        TextButton(
                          onPressed: () => unawaited(_runAction(
                            request,
                            () => widget.contactService
                                .declineFriendRequest(request.friendRequestId),
                            (l10n) => l10n.friendRequestDeclined,
                          )),
                          child: Text(l10n.declineRequest),
                        ),
                      ]
                    : [
                        TextButton(
                          onPressed: () => unawaited(_runAction(
                            request,
                            () => widget.contactService
                                .cancelFriendRequest(request.friendRequestId),
                            (l10n) => l10n.friendRequestCanceled,
                          )),
                          child: Text(l10n.cancelRequest),
                        ),
                      ],
              ),
      ),
    );
  }
}

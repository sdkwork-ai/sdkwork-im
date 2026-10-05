import 'dart:async';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../l10n/generated/app_localizations.dart';
import '../services/chat_conversation_service.dart';
import '../services/chat_media_upload_service.dart';
import '../services/chat_message_history_utils.dart';
import '../services/chat_message_media.dart';
import '../services/chat_realtime_service.dart';
import '../services/group_service.dart';
import '../services/offline_send_queue.dart';
import 'group_profile_page.dart';

enum _MessageHistoryUpdateMode { replace, older, newer }

/// Builds conversation copy at render time so stored errors stay localized.
typedef _ErrorMessageBuilder = String Function(AppLocalizations l10n);

class ChatConversationPage extends StatefulWidget {
  const ChatConversationPage({
    super.key,
    required this.conversationService,
    required this.realtimeService,
    required this.conversationId,
    required this.applicationPublicHttpUrl,
    required this.session,
    this.title,
    this.conversationType,
    this.groupService,
    this.contactService,
    this.onGroupLeft,
  });

  final ChatConversationService conversationService;
  final ChatRealtimeService realtimeService;
  final String conversationId;
  final String applicationPublicHttpUrl;
  final ImAppSession session;
  final String? title;

  /// Wire conversation type (`direct` / `group`); gates the group profile
  /// entry in the app bar.
  final String? conversationType;

  /// Group management surface; required for group conversations.
  final GroupService? groupService;

  /// Contacts source for the group add-members picker.
  final ContactService? contactService;

  /// Invoked after the current user left the group from the profile page.
  final void Function()? onGroupLeft;

  bool get _isGroupConversation =>
      conversationType == groupConversationType &&
      groupService != null &&
      contactService != null;

  @override
  State<ChatConversationPage> createState() => _ChatConversationPageState();
}

class _ChatConversationPageState extends State<ChatConversationPage> {
  final _scrollController = ScrollController();
  final _composerController = TextEditingController();

  List<ConversationMessageEntry> _entries = const [];
  MessageHistoryPaginationState _pagination =
      const MessageHistoryPaginationState(
    hasMore: false,
    nextCursor: null,
  );

  bool _loading = true;
  bool _loadingOlder = false;
  bool _uploading = false;
  bool _sending = false;
  bool _liveConnected = false;
  bool _peerTyping = false;
  Timer? _peerTypingTimer;
  _ErrorMessageBuilder? _error;
  int _latestSeq = 0;
  bool _loadingOlderGuard = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_handleScroll);
    unawaited(_loadMessageHistory());
    unawaited(_startRealtime());
    unawaited(_flushPendingSends());
  }

  @override
  void dispose() {
    _scrollController.removeListener(_handleScroll);
    unawaited(widget.realtimeService.stopConversation());
    // The typing lease must not outlive the page, or the hub keeps the
    // conversation scope subscribed after the thread is closed.
    unawaited(widget.realtimeService.stopConversationTyping());
    _peerTypingTimer?.cancel();
    _scrollController.dispose();
    _composerController.dispose();
    super.dispose();
  }

  bool _applyConversationMessagePage(
    List<ConversationMessageEntry> items,
    MessageHistoryPaginationState pagination, {
    required _MessageHistoryUpdateMode mode,
  }) {
    final page = mergeConversationMessagePage(
      mode == _MessageHistoryUpdateMode.replace
          ? const <ConversationMessageEntry>[]
          : _entries,
      items,
      direction: mode == _MessageHistoryUpdateMode.older
          ? MessageHistoryWindowDirection.older
          : MessageHistoryWindowDirection.newer,
    );
    if (mode != _MessageHistoryUpdateMode.newer && !page.incomingPageRetained) {
      return false;
    }
    setState(() {
      _entries = page.items;
      if (mode != _MessageHistoryUpdateMode.newer) {
        _pagination = pagination;
      }
      _latestSeq = resolveLatestMessageSeq(_entries);
    });
    return true;
  }

  Future<void> _loadMessageHistory({bool silent = false}) async {
    if (!silent) {
      setState(() {
        _loading = true;
        _error = null;
      });
    }

    try {
      final response = await widget.conversationService.fetchMessageHistory(
        widget.conversationId,
      );
      if (!mounted) {
        return;
      }
      final applied = _applyConversationMessagePage(
        response.items,
        pickMessageHistoryPagination(response),
        mode: _MessageHistoryUpdateMode.replace,
      );
      if (!applied && mounted) {
        setState(() => _error = (l10n) => l10n.messagePageRetainError);
      }
    } catch (error) {
      if (mounted) {
        setState(
          () => _error = (l10n) => l10n.failedToLoadMessages(error.toString()),
        );
      }
    } finally {
      if (mounted && !silent) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _appendNewMessageEntries() async {
    if (_latestSeq <= 0) {
      return;
    }
    try {
      final response =
          await widget.conversationService.fetchMessageHistoryDelta(
        widget.conversationId,
      );
      final items = response.items;
      if (items.isEmpty || !mounted) {
        return;
      }
      _applyConversationMessagePage(
        items,
        pickMessageHistoryPagination(response),
        mode: _MessageHistoryUpdateMode.newer,
      );
    } catch (_) {
      // Keep existing message history visible when incremental sync fails.
    }
  }

  Future<void> _loadOlderMessages() async {
    final cursor = _pagination.nextCursor;
    if (_loadingOlderGuard ||
        !_pagination.hasMore ||
        cursor == null ||
        cursor.isEmpty) {
      return;
    }
    _loadingOlderGuard = true;
    setState(() => _loadingOlder = true);
    final previousHeight = _scrollController.position.maxScrollExtent;

    try {
      final response = await widget.conversationService.fetchMessageHistory(
        widget.conversationId,
        cursor: cursor,
        pageSize: 50,
      );
      if (!mounted) {
        return;
      }
      final applied = _applyConversationMessagePage(
        response.items,
        pickMessageHistoryPagination(response),
        mode: _MessageHistoryUpdateMode.older,
      );
      if (!applied) {
        setState(
          () => _error = (l10n) => l10n.earlierMessagePageRetainError,
        );
        return;
      }
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!_scrollController.hasClients) {
          return;
        }
        final nextHeight = _scrollController.position.maxScrollExtent;
        _scrollController.jumpTo(nextHeight - previousHeight);
      });
    } catch (error) {
      if (mounted) {
        setState(
          () => _error =
              (l10n) => l10n.failedToLoadEarlierMessages(error.toString()),
        );
      }
    } finally {
      _loadingOlderGuard = false;
      if (mounted) {
        setState(() => _loadingOlder = false);
      }
    }
  }

  void _handleScroll() {
    if (!_scrollController.hasClients ||
        _loadingOlderGuard ||
        !_pagination.hasMore ||
        _pagination.nextCursor == null ||
        _pagination.nextCursor!.isEmpty) {
      return;
    }
    if (_scrollController.position.pixels <= 48) {
      unawaited(_loadOlderMessages());
    }
  }

  Future<void> _startRealtime() async {
    try {
      await widget.realtimeService.startConversation(
        conversationId: widget.conversationId,
        onRefresh: _appendNewMessageEntries,
      );
      // Peer typing pushes ride the same connection; the marker auto-clears
      // after 5s of quiet (matching the server-side typing TTL).
      await widget.realtimeService.startConversationTyping(
        conversationId: widget.conversationId,
        onTyping: _handlePeerTyping,
      );
      if (mounted) {
        setState(() => _liveConnected = widget.realtimeService.isLiveConnected);
      }
    } catch (_) {
      if (mounted) {
        setState(() => _liveConnected = false);
      }
    }
  }

  void _handlePeerTyping(String peerUserId) {
    if (!mounted) {
      return;
    }
    setState(() => _peerTyping = true);
    _peerTypingTimer?.cancel();
    _peerTypingTimer = Timer(const Duration(seconds: 5), () {
      if (mounted) {
        setState(() => _peerTyping = false);
      }
    });
  }

  /// Throttled typing signal while the user drafts; empty input signals
  /// nothing (matching the PC and H5 composers).
  void _handleComposerChanged(String text) {
    if (text.trim().isNotEmpty) {
      widget.conversationService.signalTyping(widget.conversationId);
    }
  }

  Future<void> _flushPendingSends() async {
    final tenantId = widget.session.tenantId;
    await runPendingTextSendFlushForConversation(
      tenantId: tenantId,
      conversationId: widget.conversationId,
      flush: (pending) async {
        for (var index = 0; index < pending.length; index += 1) {
          final payload = pending[index];
          try {
            await widget.conversationService.sendText(
              widget.conversationId,
              payload.text,
              clientMsgId: payload.clientMsgId,
            );
            final acknowledged = await acknowledgePendingTextSend(
              tenantId: tenantId,
              clientMsgId: payload.clientMsgId,
              claimId: payload.claimId,
            );
            if (!acknowledged) {
              // The claim lease expired and another flush re-claimed this
              // record; stop so the current lease owner can finish it.
              break;
            }
          } catch (_) {
            // Retryable failure: release the failed record and the rest of
            // the claimed batch so they are re-claimable immediately instead
            // of waiting out the claim lease.
            for (final stalled in pending.skip(index)) {
              await releasePendingTextSendClaim(
                tenantId: tenantId,
                clientMsgId: stalled.clientMsgId,
                claimId: stalled.claimId,
              );
            }
            break;
          }
        }
        await _appendNewMessageEntries();
      },
    );
  }

  Future<void> _handleSend() async {
    final text = _composerController.text.trim();
    if (text.isEmpty || _sending) {
      return;
    }
    final clientMsgId = newClientMessageId();
    setState(() => _sending = true);
    try {
      await widget.conversationService.sendText(
        widget.conversationId,
        text,
        clientMsgId: clientMsgId,
      );
      await removePendingTextSend(
        tenantId: widget.session.tenantId,
        clientMsgId: clientMsgId,
      );
      _composerController.clear();
      await _appendNewMessageEntries();
    } catch (error) {
      if (isRetryableFlutterSendError(error)) {
        await enqueuePendingTextSend(
          tenantId: widget.session.tenantId,
          payload: PendingTextSendPayload(
            conversationId: widget.conversationId,
            text: text,
            clientMsgId: clientMsgId,
          ),
        );
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              AppLocalizations.of(context)
                  .failedToSendMessage(error.toString()),
            ),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _sending = false);
      }
    }
  }

  Future<void> _handleImageUpload() async {
    if (_uploading) {
      return;
    }

    final picked = await FilePicker.platform.pickFiles(
      type: FileType.image,
      withData: true,
    );
    final file = picked?.files.firstOrNull;
    final bytes = file?.bytes;
    if (bytes == null || bytes.isEmpty) {
      return;
    }

    setState(() => _uploading = true);
    try {
      // Bytes enter Drive through the composed Drive Uploader; only the
      // stable Drive reference travels in the message record.
      final upload = await _mediaService.uploadChatImage(
        applicationPublicHttpUrl: widget.applicationPublicHttpUrl,
        bytes: Uint8List.fromList(bytes),
        accessToken: widget.session.accessToken,
        authToken: widget.session.authToken,
        conversationId: widget.conversationId,
        originalFileName: file?.name,
        contentType: file?.extension == null
            ? 'image/jpeg'
            : 'image/${file!.extension}',
      );
      await widget.conversationService.sendImageMessage(
        conversationId: widget.conversationId,
        driveUri: upload.driveUri,
        spaceId: upload.spaceId,
        nodeId: upload.nodeId,
        fileName: upload.fileName,
        mimeType: upload.mimeType,
        sizeBytes: upload.sizeBytes,
      );
      await _appendNewMessageEntries();
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              AppLocalizations.of(context)
                  .failedToUploadImage(error.toString()),
            ),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _uploading = false);
      }
    }
  }

  bool _isOwnMessage(ConversationMessageEntry entry) {
    final senderId = entry.sender.id.trim();
    final currentUserId = widget.session.userId.trim();
    return senderId.isNotEmpty && senderId == currentUserId;
  }

  Future<void> _recallMessage(ConversationMessageEntry entry) async {
    try {
      await widget.conversationService.recallMessage(entry.messageId);
      if (!mounted) {
        return;
      }
      // A mutation can land on any position of the window: reload silently.
      await _loadMessageHistory(silent: true);
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context).messageActionFailed),
          ),
        );
      }
    }
  }

  Future<void> _editMessage(ConversationMessageEntry entry) async {
    final l10n = AppLocalizations.of(context);
    final controller = TextEditingController(text: _entryText(entry));
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(l10n.messageEditTitle),
        content: TextField(controller: controller, autofocus: true, maxLines: 4),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(MaterialLocalizations.of(dialogContext).cancelButtonLabel),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: Text(l10n.send),
          ),
        ],
      ),
    );
    if (confirmed != true) {
      return;
    }
    final body = controller.text.trim();
    if (body.isEmpty) {
      return;
    }
    try {
      await widget.conversationService.editMessage(entry.messageId, body);
      if (!mounted) {
        return;
      }
      await _loadMessageHistory(silent: true);
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context).messageActionFailed),
          ),
        );
      }
    }
  }

  void _showMessageActions(ConversationMessageEntry entry) {
    if (!_isOwnMessage(entry)) {
      return;
    }
    final l10n = AppLocalizations.of(context);
    final isText = resolveChatMessageMedia(entry) == null;
    showModalBottomSheet<void>(
      context: context,
      builder: (sheetContext) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.undo_outlined),
              title: Text(l10n.messageRecall),
              onTap: () {
                Navigator.of(sheetContext).pop();
                unawaited(_recallMessage(entry));
              },
            ),
            if (isText)
              ListTile(
                leading: const Icon(Icons.edit_outlined),
                title: Text(l10n.messageEdit),
                onTap: () {
                  Navigator.of(sheetContext).pop();
                  unawaited(_editMessage(entry));
                },
              ),
          ],
        ),
      ),
    );
  }

  String _entryLabel(ConversationMessageEntry entry) {
    return entry.sender.displayName ?? entry.sender.id;
  }

  String _entryText(ConversationMessageEntry entry) {
    return entry.body.text ?? entry.summary ?? '';
  }

  ChatMediaUploadService get _mediaService => _mediaServiceOverride ?? _ownedMediaService;
  final ChatMediaUploadService _ownedMediaService = ChatMediaUploadService();

  /// Overridable for tests; production code uses the per-State service whose
  /// composed Drive client is created lazily and reused.
  static ChatMediaUploadService? _mediaServiceOverride;

  Widget _entryBody(ConversationMessageEntry entry, AppLocalizations l10n) {
    final media = resolveChatMessageMedia(entry);
    if (media == null) {
      return Text(_entryText(entry));
    }
    switch (media.kind) {
      case 'image':
        return _ChatMessageImage(
          media: media,
          resolveUrl: () => _mediaService.resolveChatMediaUrl(
            applicationPublicHttpUrl: widget.applicationPublicHttpUrl,
            accessToken: widget.session.accessToken,
            authToken: widget.session.authToken,
            nodeId: media.nodeId,
          ),
          loadFailedLabel: l10n.mediaLoadFailed,
        );
      case 'file':
        return _ChatMessageFile(
          media: media,
          resolveUrl: () => _mediaService.resolveChatMediaUrl(
            applicationPublicHttpUrl: widget.applicationPublicHttpUrl,
            accessToken: widget.session.accessToken,
            authToken: widget.session.authToken,
            nodeId: media.nodeId,
          ),
          openFailedLabel: l10n.mediaOpenFailed,
        );
      default:
        return _ChatMessageUnsupported(media: media, l10n: l10n);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final heading =
        widget.title ?? l10n.conversationTitleFallback(widget.conversationId);

    return Scaffold(
      appBar: AppBar(
        title: Text(heading),
        actions: [
          if (_liveConnected)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Center(
                child: Text(
                  l10n.liveBadge,
                  style: const TextStyle(fontSize: 12),
                ),
              ),
            ),
          if (widget._isGroupConversation)
            IconButton(
              tooltip: l10n.groupProfileTitle,
              icon: const Icon(Icons.info_outline),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => GroupProfilePage(
                      groupService: widget.groupService!,
                      contactService: widget.contactService!,
                      conversationId: widget.conversationId,
                      currentUserId: widget.session.userId,
                      initialName: widget.title,
                      onLeft: () {
                        Navigator.of(context).pop();
                        widget.onGroupLeft?.call();
                      },
                    ),
                  ),
                );
              },
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(child: Text(_error!(l10n)))
                    : _entries.isEmpty
                        ? Center(child: Text(l10n.messagesEmpty))
                        : ListView.separated(
                            controller: _scrollController,
                            padding: const EdgeInsets.all(16),
                            itemCount:
                                _entries.length + (_loadingOlder ? 1 : 0),
                            separatorBuilder: (_, __) =>
                                const SizedBox(height: 8),
                            itemBuilder: (context, index) {
                              if (_loadingOlder && index == 0) {
                                return const Center(
                                  child: Padding(
                                    padding: EdgeInsets.symmetric(vertical: 8),
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2),
                                  ),
                                );
                              }
                              final entryIndex =
                                  _loadingOlder ? index - 1 : index;
                              final entry = _entries[entryIndex];
                              return Card(
                                child: ListTile(
                                  onLongPress: () => _showMessageActions(entry),
                                  title: Text(_entryLabel(entry)),
                                  subtitle: _entryBody(entry, l10n),
                                  trailing: Text(
                                    entry.occurredAt,
                                    style:
                                        Theme.of(context).textTheme.bodySmall,
                                  ),
                                ),
                              );
                            },
                          ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_peerTyping)
                    Padding(
                      padding: const EdgeInsets.only(left: 4, bottom: 4),
                      child: Text(
                        l10n.peerTyping,
                        key: const ValueKey('peer-typing'),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: _uploading ? null : _handleImageUpload,
                        icon: _uploading
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(strokeWidth: 2),
                              )
                            : const Icon(Icons.image_outlined),
                      ),
                      Expanded(
                        child: TextField(
                          controller: _composerController,
                          minLines: 1,
                          maxLines: 4,
                          decoration: InputDecoration(
                            hintText: l10n.composerHint,
                            border: const OutlineInputBorder(),
                          ),
                          onChanged: _handleComposerChanged,
                          onSubmitted: (_) => _handleSend(),
                        ),
                      ),
                      const SizedBox(width: 8),
                      FilledButton(
                        onPressed: _sending ? null : _handleSend,
                        child: Text(_sending ? l10n.sending : l10n.send),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Renders an image attachment by resolving a short-lived download grant for
/// its Drive node. The grant cache keeps rebuilt message lists from minting
/// repeated grants for already-rendered nodes.
class _ChatMessageImage extends StatelessWidget {
  const _ChatMessageImage({
    required this.media,
    required this.resolveUrl,
    required this.loadFailedLabel,
  });

  final ChatMessageMedia media;
  final Future<String> Function() resolveUrl;
  final String loadFailedLabel;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: resolveUrl(),
      builder: (context, snapshot) {
        final url = snapshot.data;
        if (snapshot.connectionState != ConnectionState.done || url == null) {
          if (snapshot.hasError) {
            return Text(
              loadFailedLabel,
              style: Theme.of(context).textTheme.bodySmall,
            );
          }
          return const SizedBox(
            width: 160,
            height: 120,
            child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
          );
        }
        return ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 240, maxHeight: 220),
            child: Image.network(
              url,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) =>
                  Text(loadFailedLabel),
              loadingBuilder: (context, child, loadingProgress) {
                if (loadingProgress == null) {
                  return child;
                }
                return const SizedBox(
                  width: 160,
                  height: 120,
                  child: Center(
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                );
              },
            ),
          ),
        );
      },
    );
  }
}

/// Renders a file attachment card; tapping opens the granted download URL
/// through the platform viewer.
class _ChatMessageFile extends StatelessWidget {
  const _ChatMessageFile({
    required this.media,
    required this.resolveUrl,
    required this.openFailedLabel,
  });

  final ChatMessageMedia media;
  final Future<String> Function() resolveUrl;
  final String openFailedLabel;

  Future<void> _open(BuildContext context) async {
    try {
      final url = Uri.parse(await resolveUrl());
      final launched = await launchUrl(
        url,
        mode: LaunchMode.externalApplication,
      );
      if (!launched && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(openFailedLabel)),
        );
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(openFailedLabel)),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => unawaited(_open(context)),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          border: Border.all(color: Theme.of(context).dividerColor),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.insert_drive_file_outlined),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                media.fileName ?? media.nodeId,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Voice/video/audio playback needs platform players this client does not
/// bundle yet; the card states the kind and file name instead of hiding the
/// message.
class _ChatMessageUnsupported extends StatelessWidget {
  const _ChatMessageUnsupported({required this.media, required this.l10n});

  final ChatMessageMedia media;
  final AppLocalizations l10n;

  @override
  Widget build(BuildContext context) {
    final kindLabel = switch (media.kind) {
      'video' => l10n.mediaKindVideo,
      'voice' => l10n.mediaKindVoice,
      'audio' => l10n.mediaKindAudio,
      _ => l10n.mediaKindFile,
    };
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.attach_file),
        const SizedBox(width: 8),
        Flexible(
          child: Text(
            l10n.mediaUnsupported(kindLabel) +
                (media.fileName == null ? '' : ' · ${media.fileName}'),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}

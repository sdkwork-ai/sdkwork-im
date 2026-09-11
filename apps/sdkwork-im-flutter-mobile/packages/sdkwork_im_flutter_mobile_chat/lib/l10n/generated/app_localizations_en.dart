// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get inboxTitle => 'Inbox';

  @override
  String get liveBadge => 'Live';

  @override
  String get conversationFallbackTitle => 'Conversation';

  @override
  String get inboxEmpty => 'No conversations yet.';

  @override
  String get inboxLoadError => 'Unable to load conversations.';

  @override
  String get inboxPageRetainError =>
      'Unable to retain the requested conversation page.';

  @override
  String get retry => 'Retry';

  @override
  String get loadMore => 'Load more';

  @override
  String conversationTitleFallback(String conversationId) {
    return 'Conversation $conversationId';
  }

  @override
  String get messagesEmpty => 'No messages yet.';

  @override
  String get messagePageRetainError =>
      'Unable to retain the requested message page.';

  @override
  String get earlierMessagePageRetainError =>
      'Unable to retain the earlier message page.';

  @override
  String failedToLoadMessages(String error) {
    return 'Failed to load messages: $error';
  }

  @override
  String failedToLoadEarlierMessages(String error) {
    return 'Failed to load earlier messages: $error';
  }

  @override
  String failedToSendMessage(String error) {
    return 'Failed to send message: $error';
  }

  @override
  String failedToUploadImage(String error) {
    return 'Failed to upload image: $error';
  }

  @override
  String get composerHint => 'Type a message';

  @override
  String get send => 'Send';

  @override
  String get sending => 'Sending…';
}

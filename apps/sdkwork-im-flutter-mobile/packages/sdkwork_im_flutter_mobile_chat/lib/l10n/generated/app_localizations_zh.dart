// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get inboxTitle => '收件箱';

  @override
  String get liveBadge => '实时';

  @override
  String get conversationFallbackTitle => '会话';

  @override
  String get inboxEmpty => '暂无会话。';

  @override
  String get inboxLoadError => '无法加载会话。';

  @override
  String get inboxPageRetainError => '无法保留所请求的会话页面。';

  @override
  String get retry => '重试';

  @override
  String get loadMore => '加载更多';

  @override
  String conversationTitleFallback(String conversationId) {
    return '会话 $conversationId';
  }

  @override
  String get messagesEmpty => '暂无消息。';

  @override
  String get messagePageRetainError => '无法保留所请求的消息页面。';

  @override
  String get earlierMessagePageRetainError => '无法保留更早的消息页面。';

  @override
  String failedToLoadMessages(String error) {
    return '加载消息失败：$error';
  }

  @override
  String failedToLoadEarlierMessages(String error) {
    return '加载更早的消息失败：$error';
  }

  @override
  String failedToSendMessage(String error) {
    return '发送消息失败：$error';
  }

  @override
  String failedToUploadImage(String error) {
    return '上传图片失败：$error';
  }

  @override
  String get composerHint => '输入消息';

  @override
  String get send => '发送';

  @override
  String get sending => '发送中…';
}

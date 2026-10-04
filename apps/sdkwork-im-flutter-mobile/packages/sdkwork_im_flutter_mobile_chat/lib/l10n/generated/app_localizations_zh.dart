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

  @override
  String get mediaLoadFailed => '媒体加载失败。';

  @override
  String mediaUnsupported(String kind) {
    return '$kind消息';
  }

  @override
  String get mediaOpenFailed => '无法打开该文件。';

  @override
  String get mediaKindFile => '文件';

  @override
  String get mediaKindVideo => '视频';

  @override
  String get mediaKindVoice => '语音';

  @override
  String get mediaKindAudio => '音频';

  @override
  String get createGroupAction => '新建群聊';

  @override
  String get createGroupTitle => '新建群聊';

  @override
  String get groupNameLabel => '群名称';

  @override
  String get createGroupNameEmpty => '请输入群名称。';

  @override
  String get createGroupMembersRequired => '请至少选择一名成员。';

  @override
  String get createGroupCreate => '创建';

  @override
  String get createGroupCreating => '创建中…';

  @override
  String createGroupFailed(String error) {
    return '创建群聊失败：$error';
  }

  @override
  String get createGroupContactsEmpty => '暂无可添加的联系人。';

  @override
  String get groupContactsLoadFailed => '无法加载联系人。';

  @override
  String get groupProfileTitle => '群聊信息';

  @override
  String get groupMembersHeader => '群成员';

  @override
  String groupMemberCount(int count) {
    return '$count 名成员';
  }

  @override
  String groupLoadFailed(String error) {
    return '群聊信息加载失败：$error';
  }

  @override
  String get groupAddMembers => '添加成员';

  @override
  String get groupAddMembersSave => '添加';

  @override
  String groupAddMembersFailed(String error) {
    return '添加成员失败：$error';
  }

  @override
  String get groupRemoveMember => '移除';

  @override
  String get groupRemoveMemberConfirmTitle => '移除成员';

  @override
  String groupRemoveMemberConfirmBody(String name) {
    return '确定将 $name 移出本群吗？';
  }

  @override
  String groupRemoveMemberFailed(String error) {
    return '移除成员失败：$error';
  }

  @override
  String get renameGroupAction => '修改群名称';

  @override
  String get renameGroupSave => '保存';

  @override
  String renameGroupFailed(String error) {
    return '群名称修改失败：$error';
  }

  @override
  String get leaveGroup => '退出群聊';

  @override
  String get leaveGroupConfirmTitle => '退出群聊';

  @override
  String get leaveGroupConfirmBody => '退出后将不再接收该群的消息。';

  @override
  String leaveGroupFailed(String error) {
    return '退出群聊失败：$error';
  }

  @override
  String get groupCancel => '取消';

  @override
  String get groupConfirm => '确认';

  @override
  String get groupMemberYou => '我';

  @override
  String get settingsTitle => '设置';

  @override
  String get settingsSectionAccount => '账号';

  @override
  String get settingsUserId => '用户 ID';

  @override
  String get settingsTenantId => '租户 ID';

  @override
  String get settingsOrganizationId => '组织 ID';

  @override
  String get settingsSectionAppearance => '外观';

  @override
  String get themeSystem => '跟随系统';

  @override
  String get themeLight => '浅色';

  @override
  String get themeDark => '深色';

  @override
  String get settingsSignOut => '退出登录';

  @override
  String groupAddMembersLoadFailed(String error) {
    return '联系人加载失败：$error';
  }

  @override
  String get groupAddMembersEmpty => '没有可添加的联系人。';

  @override
  String get messageRecall => '撤回';

  @override
  String get messageEdit => '编辑';

  @override
  String get messageEditTitle => '编辑消息';

  @override
  String get messageActionFailed => '操作失败';
}

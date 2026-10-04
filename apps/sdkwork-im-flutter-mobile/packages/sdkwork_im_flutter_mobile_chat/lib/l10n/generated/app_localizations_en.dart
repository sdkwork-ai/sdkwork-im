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

  @override
  String get mediaLoadFailed => 'Unable to load media.';

  @override
  String mediaUnsupported(String kind) {
    return '$kind message';
  }

  @override
  String get mediaOpenFailed => 'Unable to open the file.';

  @override
  String get mediaKindFile => 'File';

  @override
  String get mediaKindVideo => 'Video';

  @override
  String get mediaKindVoice => 'Voice';

  @override
  String get mediaKindAudio => 'Audio';

  @override
  String get createGroupAction => 'New group';

  @override
  String get createGroupTitle => 'New group';

  @override
  String get groupNameLabel => 'Group name';

  @override
  String get createGroupNameEmpty => 'Enter a group name.';

  @override
  String get createGroupMembersRequired => 'Select at least one member.';

  @override
  String get createGroupCreate => 'Create';

  @override
  String get createGroupCreating => 'Creating…';

  @override
  String createGroupFailed(String error) {
    return 'Failed to create group: $error';
  }

  @override
  String get createGroupContactsEmpty => 'No contacts to add yet.';

  @override
  String get groupContactsLoadFailed => 'Unable to load contacts.';

  @override
  String get groupProfileTitle => 'Group info';

  @override
  String get groupMembersHeader => 'Members';

  @override
  String groupMemberCount(int count) {
    return '$count members';
  }

  @override
  String groupLoadFailed(String error) {
    return 'Failed to load group info: $error';
  }

  @override
  String get groupAddMembers => 'Add members';

  @override
  String get groupAddMembersSave => 'Add';

  @override
  String groupAddMembersFailed(String error) {
    return 'Failed to add members: $error';
  }

  @override
  String get groupRemoveMember => 'Remove';

  @override
  String get groupRemoveMemberConfirmTitle => 'Remove member';

  @override
  String groupRemoveMemberConfirmBody(String name) {
    return 'Remove $name from this group?';
  }

  @override
  String groupRemoveMemberFailed(String error) {
    return 'Failed to remove member: $error';
  }

  @override
  String get renameGroupAction => 'Rename group';

  @override
  String get renameGroupSave => 'Save';

  @override
  String renameGroupFailed(String error) {
    return 'Failed to rename group: $error';
  }

  @override
  String get leaveGroup => 'Leave group';

  @override
  String get leaveGroupConfirmTitle => 'Leave group';

  @override
  String get leaveGroupConfirmBody =>
      'You will stop receiving messages from this group.';

  @override
  String leaveGroupFailed(String error) {
    return 'Failed to leave group: $error';
  }

  @override
  String get groupCancel => 'Cancel';

  @override
  String get groupConfirm => 'Confirm';

  @override
  String get groupMemberYou => 'You';

  @override
  String get settingsTitle => 'Settings';

  @override
  String get settingsSectionAccount => 'Account';

  @override
  String get settingsUserId => 'User ID';

  @override
  String get settingsTenantId => 'Tenant ID';

  @override
  String get settingsOrganizationId => 'Organization ID';

  @override
  String get settingsSectionAppearance => 'Appearance';

  @override
  String get themeSystem => 'System';

  @override
  String get themeLight => 'Light';

  @override
  String get themeDark => 'Dark';

  @override
  String get settingsSignOut => 'Sign out';

  @override
  String groupAddMembersLoadFailed(String error) {
    return 'Unable to load contacts: $error';
  }

  @override
  String get groupAddMembersEmpty => 'No contacts to add.';
}

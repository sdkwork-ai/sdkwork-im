import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('zh')
  ];

  /// Title of the chat inbox screen listing conversations.
  ///
  /// In en, this message translates to:
  /// **'Inbox'**
  String get inboxTitle;

  /// Badge shown in the app bar while the realtime connection is live.
  ///
  /// In en, this message translates to:
  /// **'Live'**
  String get liveBadge;

  /// Fallback title for an inbox conversation entry that has no display name.
  ///
  /// In en, this message translates to:
  /// **'Conversation'**
  String get conversationFallbackTitle;

  /// Empty-state text shown when the inbox has no conversations.
  ///
  /// In en, this message translates to:
  /// **'No conversations yet.'**
  String get inboxEmpty;

  /// Error shown when loading an inbox page fails.
  ///
  /// In en, this message translates to:
  /// **'Unable to load conversations.'**
  String get inboxLoadError;

  /// Error shown when a fetched conversation page cannot be merged into the inbox window.
  ///
  /// In en, this message translates to:
  /// **'Unable to retain the requested conversation page.'**
  String get inboxPageRetainError;

  /// Button label to retry a failed inbox load.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// Button label that loads the next page of inbox conversations.
  ///
  /// In en, this message translates to:
  /// **'Load more'**
  String get loadMore;

  /// Fallback app bar title for a conversation screen when no title is provided.
  ///
  /// In en, this message translates to:
  /// **'Conversation {conversationId}'**
  String conversationTitleFallback(String conversationId);

  /// Empty-state text shown when a conversation has no messages.
  ///
  /// In en, this message translates to:
  /// **'No messages yet.'**
  String get messagesEmpty;

  /// Error shown when a fetched message page cannot be merged into the history window.
  ///
  /// In en, this message translates to:
  /// **'Unable to retain the requested message page.'**
  String get messagePageRetainError;

  /// Error shown when an older message page cannot be merged into the history window.
  ///
  /// In en, this message translates to:
  /// **'Unable to retain the earlier message page.'**
  String get earlierMessagePageRetainError;

  /// Error shown when loading the message history fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to load messages: {error}'**
  String failedToLoadMessages(String error);

  /// Error shown when loading older message history fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to load earlier messages: {error}'**
  String failedToLoadEarlierMessages(String error);

  /// Snackbar text shown when sending a message fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to send message: {error}'**
  String failedToSendMessage(String error);

  /// Snackbar text shown when uploading an image fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to upload image: {error}'**
  String failedToUploadImage(String error);

  /// Hint text of the message composer input field.
  ///
  /// In en, this message translates to:
  /// **'Type a message'**
  String get composerHint;

  /// Label of the button that sends the composed message.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get send;

  /// Label of the send button while a message is being sent.
  ///
  /// In en, this message translates to:
  /// **'Sending…'**
  String get sending;

  /// Placeholder shown when a media message fails to resolve its download URL.
  ///
  /// In en, this message translates to:
  /// **'Unable to load media.'**
  String get mediaLoadFailed;

  /// Fallback label for media kinds this client cannot render yet.
  ///
  /// In en, this message translates to:
  /// **'{kind} message'**
  String mediaUnsupported(String kind);

  /// Snackbar text shown when opening a file attachment fails.
  ///
  /// In en, this message translates to:
  /// **'Unable to open the file.'**
  String get mediaOpenFailed;

  /// Display kind for file attachments.
  ///
  /// In en, this message translates to:
  /// **'File'**
  String get mediaKindFile;

  /// Display kind for video attachments.
  ///
  /// In en, this message translates to:
  /// **'Video'**
  String get mediaKindVideo;

  /// Display kind for voice attachments.
  ///
  /// In en, this message translates to:
  /// **'Voice'**
  String get mediaKindVoice;

  /// Display kind for audio attachments.
  ///
  /// In en, this message translates to:
  /// **'Audio'**
  String get mediaKindAudio;

  /// Tooltip of the inbox app bar action that opens group creation.
  ///
  /// In en, this message translates to:
  /// **'New group'**
  String get createGroupAction;

  /// Title of the create-group screen.
  ///
  /// In en, this message translates to:
  /// **'New group'**
  String get createGroupTitle;

  /// Label of the group name input field.
  ///
  /// In en, this message translates to:
  /// **'Group name'**
  String get groupNameLabel;

  /// Validation shown when the group name is blank.
  ///
  /// In en, this message translates to:
  /// **'Enter a group name.'**
  String get createGroupNameEmpty;

  /// Validation shown when no member is selected.
  ///
  /// In en, this message translates to:
  /// **'Select at least one member.'**
  String get createGroupMembersRequired;

  /// Label of the create-group submit button.
  ///
  /// In en, this message translates to:
  /// **'Create'**
  String get createGroupCreate;

  /// Label of the submit button while the group is being created.
  ///
  /// In en, this message translates to:
  /// **'Creating…'**
  String get createGroupCreating;

  /// Snackbar text shown when group creation fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to create group: {error}'**
  String createGroupFailed(String error);

  /// Empty-state text when there are no contacts to add.
  ///
  /// In en, this message translates to:
  /// **'No contacts to add yet.'**
  String get createGroupContactsEmpty;

  /// Error shown when loading contacts for group flows fails.
  ///
  /// In en, this message translates to:
  /// **'Unable to load contacts.'**
  String get groupContactsLoadFailed;

  /// Title of the group profile screen; also the conversation app bar tooltip.
  ///
  /// In en, this message translates to:
  /// **'Group info'**
  String get groupProfileTitle;

  /// Header above the member selection list.
  ///
  /// In en, this message translates to:
  /// **'Members'**
  String get groupMembersHeader;

  /// Member count header on the group profile screen.
  ///
  /// In en, this message translates to:
  /// **'{count} members'**
  String groupMemberCount(int count);

  /// Error shown when loading the group profile or members fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to load group info: {error}'**
  String groupLoadFailed(String error);

  /// Label for adding members from contacts.
  ///
  /// In en, this message translates to:
  /// **'Add members'**
  String get groupAddMembers;

  /// Button that confirms the selected members.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get groupAddMembersSave;

  /// Snackbar text shown when adding members fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to add members: {error}'**
  String groupAddMembersFailed(String error);

  /// Tooltip of the per-member remove action.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get groupRemoveMember;

  /// Title of the remove-member confirmation dialog.
  ///
  /// In en, this message translates to:
  /// **'Remove member'**
  String get groupRemoveMemberConfirmTitle;

  /// Body of the remove-member confirmation dialog; includes the member name.
  ///
  /// In en, this message translates to:
  /// **'Remove {name} from this group?'**
  String groupRemoveMemberConfirmBody(String name);

  /// Snackbar text shown when removing a member fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to remove member: {error}'**
  String groupRemoveMemberFailed(String error);

  /// Row and dialog title for renaming the group.
  ///
  /// In en, this message translates to:
  /// **'Rename group'**
  String get renameGroupAction;

  /// Button that confirms the rename.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get renameGroupSave;

  /// Snackbar text shown when renaming fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to rename group: {error}'**
  String renameGroupFailed(String error);

  /// Row label that leaves the group.
  ///
  /// In en, this message translates to:
  /// **'Leave group'**
  String get leaveGroup;

  /// Title of the leave-group confirmation dialog.
  ///
  /// In en, this message translates to:
  /// **'Leave group'**
  String get leaveGroupConfirmTitle;

  /// Body of the leave-group confirmation dialog.
  ///
  /// In en, this message translates to:
  /// **'You will stop receiving messages from this group.'**
  String get leaveGroupConfirmBody;

  /// Snackbar text shown when leaving fails; includes the failure detail.
  ///
  /// In en, this message translates to:
  /// **'Failed to leave group: {error}'**
  String leaveGroupFailed(String error);

  /// Generic cancel button in group dialogs.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get groupCancel;

  /// Generic confirm button in group dialogs.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get groupConfirm;

  /// Display name shown for the current user in the member list.
  ///
  /// In en, this message translates to:
  /// **'You'**
  String get groupMemberYou;

  /// Title of the settings screen.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsTitle;

  /// Header of the account identity section.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get settingsSectionAccount;

  /// Label of the current user id row.
  ///
  /// In en, this message translates to:
  /// **'User ID'**
  String get settingsUserId;

  /// Label of the current tenant id row.
  ///
  /// In en, this message translates to:
  /// **'Tenant ID'**
  String get settingsTenantId;

  /// Label of the current organization id row.
  ///
  /// In en, this message translates to:
  /// **'Organization ID'**
  String get settingsOrganizationId;

  /// Header of the appearance section.
  ///
  /// In en, this message translates to:
  /// **'Appearance'**
  String get settingsSectionAppearance;

  /// Theme mode choice following the system setting.
  ///
  /// In en, this message translates to:
  /// **'System'**
  String get themeSystem;

  /// Light theme mode choice.
  ///
  /// In en, this message translates to:
  /// **'Light'**
  String get themeLight;

  /// Dark theme mode choice.
  ///
  /// In en, this message translates to:
  /// **'Dark'**
  String get themeDark;

  /// Button label that signs the current user out.
  ///
  /// In en, this message translates to:
  /// **'Sign out'**
  String get settingsSignOut;

  /// Error shown when the add-members contact list fails to load.
  ///
  /// In en, this message translates to:
  /// **'Unable to load contacts: {error}'**
  String groupAddMembersLoadFailed(String error);

  /// Empty state for the add-members contact list.
  ///
  /// In en, this message translates to:
  /// **'No contacts to add.'**
  String get groupAddMembersEmpty;

  /// Action label that recalls one of the current user's messages.
  ///
  /// In en, this message translates to:
  /// **'Recall'**
  String get messageRecall;

  /// Action label that edits one of the current user's text messages.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get messageEdit;

  /// Dialog title for editing a sent text message.
  ///
  /// In en, this message translates to:
  /// **'Edit message'**
  String get messageEditTitle;

  /// Snackbar text when a recall or edit mutation fails.
  ///
  /// In en, this message translates to:
  /// **'Operation failed'**
  String get messageActionFailed;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'zh'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}

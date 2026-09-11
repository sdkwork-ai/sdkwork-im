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

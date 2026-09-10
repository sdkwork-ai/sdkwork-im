import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';

void main() {
  Future<void> pumpWithLocale(WidgetTester tester, Locale? locale) async {
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        locale: locale,
        home: Builder(
          builder: (context) => Scaffold(
            body: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(AppLocalizations.of(context).inboxTitle),
                Text(AppLocalizations.of(context).composerHint),
                Text(AppLocalizations.of(context).send),
                Text(
                  AppLocalizations.of(context).failedToLoadMessages('boom'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  testWidgets('falls back to English copy for unsupported locales',
      (WidgetTester tester) async {
    await pumpWithLocale(tester, const Locale('fr'));

    expect(find.text('Inbox'), findsOneWidget);
    expect(find.text('Type a message'), findsOneWidget);
    expect(find.text('Send'), findsOneWidget);
    expect(find.text('Failed to load messages: boom'), findsOneWidget);
  });

  testWidgets('renders Simplified Chinese copy for zh',
      (WidgetTester tester) async {
    await pumpWithLocale(tester, const Locale('zh'));

    expect(find.text('收件箱'), findsOneWidget);
    expect(find.text('输入消息'), findsOneWidget);
    expect(find.text('发送'), findsOneWidget);
    expect(find.text('加载消息失败：boom'), findsOneWidget);
  });
}

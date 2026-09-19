import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';

void main() {
  Future<void> pumpWithLocale(WidgetTester tester, Locale? locale) async {
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: ContactsLocalizations.localizationsDelegates,
        supportedLocales: ContactsLocalizations.supportedLocales,
        locale: locale,
        home: Builder(
          builder: (context) => Scaffold(
            body: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(ContactsLocalizations.of(context).addressBookTitle),
                Text(ContactsLocalizations.of(context).newFriendsTitle),
                Text(ContactsLocalizations.of(context).search),
                Text(
                  ContactsLocalizations.of(context)
                      .removeFriendConfirmBody('Alice'),
                ),
                Text(
                  ContactsLocalizations.of(context).pendingRequestCount(3),
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

    expect(find.text('Contacts'), findsOneWidget);
    expect(find.text('New Friends'), findsOneWidget);
    expect(find.text('Search'), findsOneWidget);
    expect(find.text('Remove Alice from your contacts?'), findsOneWidget);
    expect(find.text('3 pending'), findsOneWidget);
  });

  testWidgets('renders Simplified Chinese copy for zh',
      (WidgetTester tester) async {
    await pumpWithLocale(tester, const Locale('zh'));

    expect(find.text('通讯录'), findsOneWidget);
    expect(find.text('新的朋友'), findsOneWidget);
    expect(find.text('搜索'), findsOneWidget);
    expect(find.text('确定将 Alice 从通讯录中删除？'), findsOneWidget);
    expect(find.text('3 条待处理'), findsOneWidget);
  });
}

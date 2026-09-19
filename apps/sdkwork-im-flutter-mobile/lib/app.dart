import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';

import 'auth_gate.dart';

class ImApp extends StatelessWidget {
  const ImApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SDKWork IM',
      // Each capability package publishes its own delegate; the shared global
      // delegates are listed once because Localizations rejects duplicate
      // delegate types.
      localizationsDelegates: const <LocalizationsDelegate<dynamic>>[
        AppLocalizations.delegate,
        ContactsLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ],
      supportedLocales: AppLocalizations.supportedLocales,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF17202A),
        useMaterial3: true,
      ),
      home: const AuthGate(),
    );
  }
}

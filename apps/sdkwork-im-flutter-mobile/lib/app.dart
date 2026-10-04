import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';
import 'package:sdkwork_im_flutter_mobile_contacts/sdkwork_im_flutter_mobile_contacts.dart';

import 'auth_gate.dart';

class ImApp extends StatefulWidget {
  const ImApp({super.key});

  @override
  State<ImApp> createState() => _ImAppState();
}

class _ImAppState extends State<ImApp> {
  ThemeMode _themeMode = ThemeMode.system;

  @override
  void initState() {
    super.initState();
    appThemeModeNotifier.addListener(_handleThemeModeChanged);
    unawaited(_loadThemeMode());
  }

  @override
  void dispose() {
    appThemeModeNotifier.removeListener(_handleThemeModeChanged);
    super.dispose();
  }

  Future<void> _loadThemeMode() async {
    final mode = await loadAppThemeMode();
    if (mounted && appThemeModeNotifier.value != mode) {
      // Publish the persisted value without re-writing it to storage.
      appThemeModeNotifier.value = mode;
    }
  }

  void _handleThemeModeChanged() {
    if (mounted) {
      setState(() => _themeMode = appThemeModeNotifier.value);
    }
  }

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
      themeMode: _themeMode,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF17202A),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorSchemeSeed: const Color(0xFF17202A),
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      home: const AuthGate(),
    );
  }
}

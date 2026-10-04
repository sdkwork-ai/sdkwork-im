import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Storage key of the persisted theme mode.
const String themeModeStorageKey = 'sdkwork-im-flutter-mobile:theme-mode:v1';

/// Notifier the app root listens to for theme changes.
///
/// The settings page writes the persisted value through [saveAppThemeMode],
/// and the host `MaterialApp` rebuilds from this notifier without threading a
/// callback through every tab layer.
final ValueNotifier<ThemeMode> appThemeModeNotifier =
    ValueNotifier<ThemeMode>(ThemeMode.system);

/// Loads the persisted theme mode; defaults to following the system.
Future<ThemeMode> loadAppThemeMode() async {
  try {
    final preferences = await SharedPreferences.getInstance();
    return themeModeFromWire(preferences.getString(themeModeStorageKey));
  } catch (_) {
    return ThemeMode.system;
  }
}

/// Persists the theme mode and publishes it to [appThemeModeNotifier].
Future<void> saveAppThemeMode(ThemeMode mode) async {
  appThemeModeNotifier.value = mode;
  try {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(themeModeStorageKey, themeModeToWire(mode));
  } catch (_) {
    // Persistence is best-effort; the in-memory notifier keeps the value so
    // the current session still reflects the user's choice.
  }
}

/// Wire encoding of a theme mode.
String themeModeToWire(ThemeMode mode) {
  switch (mode) {
    case ThemeMode.light:
      return 'light';
    case ThemeMode.dark:
      return 'dark';
    case ThemeMode.system:
      return 'system';
  }
}

/// Parses a persisted theme mode; unknown values fall back to the system.
ThemeMode themeModeFromWire(String? value) {
  switch (value) {
    case 'light':
      return ThemeMode.light;
    case 'dark':
      return ThemeMode.dark;
    case 'system':
    default:
      return ThemeMode.system;
  }
}

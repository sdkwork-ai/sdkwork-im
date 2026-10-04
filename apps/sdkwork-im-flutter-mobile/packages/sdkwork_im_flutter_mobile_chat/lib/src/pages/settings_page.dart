import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';
import 'package:sdkwork_im_flutter_mobile_shell/sdkwork_im_flutter_mobile_shell.dart';

import '../../l10n/generated/app_localizations.dart';
import '../services/settings_preferences.dart';

/// Minimal settings surface: loaded account identity, theme mode, sign-out.
///
/// The page renders whatever identity the loaded session carries (ids only in
/// this client) and delegates the sign-out itself to the host root, which owns
/// session storage and SDK client lifecycles.
class SettingsPage extends StatefulWidget {
  const SettingsPage({
    super.key,
    required this.session,
    required this.onSignOut,
  });

  final ImAppSession session;

  /// Host-owned sign-out (clears the stored session and SDK clients).
  final Future<void> Function() onSignOut;

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  ThemeMode _themeMode = ThemeMode.system;
  bool _signingOut = false;

  @override
  void initState() {
    super.initState();
    _themeMode = appThemeModeNotifier.value;
    appThemeModeNotifier.addListener(_handleThemeModePublished);
    unawaited(_loadPersistedThemeMode());
  }

  @override
  void dispose() {
    appThemeModeNotifier.removeListener(_handleThemeModePublished);
    super.dispose();
  }

  Future<void> _loadPersistedThemeMode() async {
    final mode = await loadAppThemeMode();
    if (mounted) {
      setState(() => _themeMode = mode);
    }
  }

  void _handleThemeModePublished() {
    if (mounted) {
      setState(() => _themeMode = appThemeModeNotifier.value);
    }
  }

  Future<void> _handleThemeModeChanged(ThemeMode mode) async {
    setState(() => _themeMode = mode);
    await saveAppThemeMode(mode);
  }

  Future<void> _handleSignOut() async {
    if (_signingOut) {
      return;
    }
    setState(() => _signingOut = true);
    try {
      await widget.onSignOut();
    } finally {
      if (mounted) {
        setState(() => _signingOut = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return ImAppScaffold(
      title: l10n.settingsTitle,
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            l10n.settingsSectionAccount,
            style: Theme.of(context).textTheme.labelLarge,
          ),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    child: Text(
                      widget.session.userId.isEmpty
                          ? '?'
                          : widget.session.userId.substring(0, 1).toUpperCase(),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _IdentityLine(
                          label: l10n.settingsUserId,
                          value: widget.session.userId,
                        ),
                        _IdentityLine(
                          label: l10n.settingsTenantId,
                          value: widget.session.tenantId,
                        ),
                        _IdentityLine(
                          label: l10n.settingsOrganizationId,
                          value: widget.session.organizationId,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            l10n.settingsSectionAppearance,
            style: Theme.of(context).textTheme.labelLarge,
          ),
          const SizedBox(height: 8),
          Card(
            child: RadioGroup<ThemeMode>(
              groupValue: _themeMode,
              onChanged: (next) {
                if (next != null) {
                  unawaited(_handleThemeModeChanged(next));
                }
              },
              child: Column(
                children: [
                  for (final mode in ThemeMode.values)
                    RadioListTile<ThemeMode>(
                      value: mode,
                      title: Text(_themeModeLabel(mode, l10n)),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.tonal(
            onPressed: _signingOut ? null : _handleSignOut,
            child: _signingOut
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(l10n.settingsSignOut),
          ),
        ],
      ),
    );
  }

  String _themeModeLabel(ThemeMode mode, AppLocalizations l10n) {
    switch (mode) {
      case ThemeMode.light:
        return l10n.themeLight;
      case ThemeMode.dark:
        return l10n.themeDark;
      case ThemeMode.system:
        return l10n.themeSystem;
    }
  }
}

class _IdentityLine extends StatelessWidget {
  const _IdentityLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Text(
        '$label: ${value.isEmpty ? '-' : value}',
        style: Theme.of(context).textTheme.bodyMedium,
      ),
    );
  }
}

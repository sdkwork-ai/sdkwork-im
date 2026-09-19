import 'package:flutter/material.dart';
import 'package:sdkwork_im_flutter_mobile_shell/sdkwork_im_flutter_mobile_shell.dart';

import '../../l10n/generated/contacts_localizations.dart';

/// Placeholder for a contacts capability that this platform does not wire.
///
/// Mirrors the H5 `CapabilityUnavailablePage`: the route still resolves so the
/// host navigation stays uniform, and the screen states why the platform cannot
/// serve it instead of rendering an empty list.
class CapabilityUnavailablePage extends StatelessWidget {
  const CapabilityUnavailablePage({
    super.key,
    required this.title,
    required this.message,
  });

  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return ImAppScaffold(
      title: title,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.info_outline, size: 32),
              const SizedBox(height: 12),
              Text(
                ContactsLocalizations.of(context).capabilityUnavailableTitle,
                style: Theme.of(context).textTheme.titleSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(message, textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
}

/// Organization directory entry point.
///
/// The H5/PC roots read the organization tree through the IAM SDK
/// (`iam.organizations.list` / `iam.departments.list` /
/// `iam.departmentAssignments.list`). The Flutter mobile root bundles the IM
/// and Drive SDKs only, so this route degrades explicitly rather than
/// inventing a client-side organization model.
class OrganizationDirectoryPage extends StatelessWidget {
  const OrganizationDirectoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = ContactsLocalizations.of(context);
    return CapabilityUnavailablePage(
      title: l10n.organizationDirectoryTitle,
      message: l10n.organizationCapabilityUnavailable,
    );
  }
}

import '../generated/env_config.dart';

class ImEnvironment {
  final String applicationPublicHttpUrl;
  final String applicationPublicWebSocketUrl;
  final String appbaseLoginUrl;
  final String accessToken;

  const ImEnvironment({
    required this.applicationPublicHttpUrl,
    required this.applicationPublicWebSocketUrl,
    required this.appbaseLoginUrl,
    required this.accessToken,
  });
}

/// Resolves the selected profile from the build-generated [AppEnvConfig].
///
/// `APP_RUNTIME_ENV_SPEC.md` §3.1: runtime code reads the generated typed
/// `EnvConfig`, not raw JSON or per-key `String.fromEnvironment` calls. The
/// build regenerates `lib/generated/env_config.dart` for the selected profile.
ImEnvironment resolveEnvironment() {
  return ImEnvironment(
    applicationPublicHttpUrl: AppEnvConfig.applicationPublicHttpUrl,
    applicationPublicWebSocketUrl: AppEnvConfig.applicationPublicWebSocketUrl,
    appbaseLoginUrl: AppEnvConfig.iamAppApiBaseUrl,
    accessToken: AppEnvConfig.accessToken,
  );
}

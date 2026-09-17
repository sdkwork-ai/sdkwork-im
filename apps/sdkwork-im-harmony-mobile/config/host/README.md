# Host Config

HarmonyOS bundle id, module metadata, device types, permissions, app links,
push profile references, signing reference names, and AppGallery/private
distribution references belong here.

Rules:

- Safe checked-in templates only. Files use the `.example.json` suffix.
- Must not contain signing private keys, auth tokens, refresh tokens, API keys,
  database credentials, private service endpoints, SDK ownership, or business
  route constants.
- The bundle name in `harmony.*.example.json` must equal
  `AppScope/app.json5#app.bundleName` and
  `sdkwork.app.config.json#app.identifiers.packageName`; the static contract test
  asserts all three stay equal.

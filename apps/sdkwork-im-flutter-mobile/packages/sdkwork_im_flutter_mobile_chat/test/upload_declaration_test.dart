import 'dart:convert';
import 'dart:io';

import 'package:test/test.dart';

import 'package:sdkwork_im_flutter_mobile_chat/src/upload_declaration.dart';

/// Keeps the Dart declaration constants and
/// `apps/sdkwork-im-flutter-mobile/specs/upload.declaration.json` from
/// drifting (`DRIVE_SPEC.md` section 18: the declaration is the authority).
void main() {
  test('declaration constants mirror upload.declaration.json', () {
    final file = File('../../specs/upload.declaration.json');
    final declaration =
        jsonDecode(file.readAsStringSync()) as Map<String, dynamic>;

    expect(declaration['schemaVersion'], 1);
    expect(declaration['appId'], imFlutterAppId);

    final entries = declaration['declarations'] as List<dynamic>;
    expect(entries, hasLength(1));
    final entry = entries.single as Map<String, dynamic>;
    expect(entry['appResourceType'], ImFlutterChatImageUpload.appResourceType);
    expect(entry['scene'], ImFlutterChatImageUpload.scene);
    expect(entry['source'], ImFlutterChatImageUpload.source);
    expect(entry['uploadProfileCode'], ImFlutterChatImageUpload.uploadProfileCode);
    expect(entry['retention'], ImFlutterChatImageUpload.retention);
    expect(entry['appResourceIdKind'], ImFlutterChatImageUpload.appResourceIdKind);
  });

  test('chat media upload never sends the Drive-reserved im scene', () {
    expect(ImFlutterChatImageUpload.scene, isNot('im'));
  });
}

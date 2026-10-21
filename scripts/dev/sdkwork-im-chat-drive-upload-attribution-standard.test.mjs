#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (relative) => fs.readFileSync(path.join(repoRoot, relative), 'utf8');

// Authority: DRIVE_SPEC.md §18 Application Upload Declaration Contract. The
// declaration file is the single source of truth; every surface must consume
// its declared constants instead of re-declaring literal attribution values.
const declarationPath = 'apps/sdkwork-im-pc/specs/upload.declaration.json';
const declaration = JSON.parse(read(declarationPath));
assert.equal(declaration.schemaVersion, 1);
assert.equal(declaration.appId, 'sdkwork-im-pc');
assert.ok(Array.isArray(declaration.declarations) && declaration.declarations.length >= 4);
for (const entry of declaration.declarations) {
  assert.match(
    entry.appResourceType,
    /^[a-z0-9]+(?:\.[a-z0-9_]+)+$/u,
    'appResourceType must be a dotted <domain>.<resource> business type',
  );
  assert.equal(entry.scene, 'chat-message-media');
  assert.equal(entry.source, 'sdkwork-im-pc');
  assert.notEqual(entry.scene, 'im', 'scene=im is reserved by Drive');
  assert.equal(entry.appResourceIdKind, 'entity');
  assert.equal(entry.retention, 'long_term');
}

const surfaces = [
  {
    id: 'pc',
    path: 'apps/sdkwork-im-pc/packages/sdkwork-im-pc-chat/src/services/ChatService.ts',
    patterns: [
      /IM_PC_CHAT_IMAGE_UPLOAD/u,
      /declaration\.appResourceType/u,
      /declaration\.scene/u,
      /declaration\.source/u,
    ],
  },
  {
    id: 'h5',
    path: 'apps/sdkwork-im-h5/packages/sdkwork-im-h5-chat/src/services/chatMediaUploadService.ts',
    patterns: [
      /declared\.appResourceType/u,
      /declared\.scene/u,
      /declared\.source/u,
    ],
  },
  {
    id: 'flutter',
    path: 'apps/sdkwork-im-flutter-mobile/packages/sdkwork_im_flutter_mobile_chat/lib/src/services/chat_media_upload_service.dart',
    patterns: [
      /ImFlutterChatImageUpload\.appResourceType/u,
      /ImFlutterChatImageUpload\.scene/u,
      /ImFlutterChatImageUpload\.source/u,
    ],
  },
];

for (const surface of surfaces) {
  const source = read(surface.path);
  for (const pattern of surface.patterns) {
    assert.match(
      source,
      pattern,
      `${surface.id} chat media upload must consume the declared Drive attribution constants.`,
    );
  }
}

const h5Declaration = read('apps/sdkwork-im-h5/packages/sdkwork-im-h5-core/src/sdk/uploadDeclaration.ts');
assert.match(h5Declaration, /im\.conversation_message_media/u);
assert.match(h5Declaration, /chat-message-media/u);

process.stdout.write('sdkwork-im chat drive upload attribution standard passed\n');

/**
 * Application upload declaration conformance (`DRIVE_SPEC.md` §18).
 *
 * The declaration file is the authority; the constants module carries its
 * values into code so call sites do not repeat literals. This test keeps the
 * two from drifting: a change to one without the other fails here rather than
 * producing an upload whose declared value and sent value disagree.
 *
 * The constants module is TypeScript and this suite runs under `node --test`,
 * so the module is read and pattern-matched rather than imported. The
 * assertion target is the real file on disk, so a divergence still fails here;
 * a value that cannot be read back fails too, by design.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DECLARATION_PATH = path.join(appRoot, 'specs/upload.declaration.json');
const CONSTANTS_PATH = path.join(
  appRoot,
  'packages/sdkwork-im-mp-chat/src/uploadDeclaration.ts',
);

const declarationFile = JSON.parse(fs.readFileSync(DECLARATION_PATH, 'utf8'));
const constantsSource = fs.readFileSync(CONSTANTS_PATH, 'utf8');

/** Module-local `const NAME = "value"` table used to resolve references. */
function readModuleStringConstants() {
  const table = new Map();
  for (const match of constantsSource.matchAll(
    /(?:export )?const ([A-Z_]\w+) = "([^"]+)" as const;/gu,
  )) {
    table.set(match[1], match[2]);
  }
  return table;
}

const MODULE_CONSTANTS = readModuleStringConstants();

function readDeclaredConstantBodies() {
  // Every `export const IM_MP_*_UPLOAD = { ... } as const satisfies` block in
  // the constants module, parsed by value (names are intentionally free).
  const blocks = [...constantsSource.matchAll(
    /export const (IM_MP_\w+_UPLOAD) = \{([\s\S]*?)\} as const satisfies/gu,
  )];
  return blocks.map(([, name, body]) => {
    const read = (key) => {
      const literalMatch = body.match(new RegExp(`${key}: "([^"]+)"`, 'u'));
      if (literalMatch) {
        return literalMatch[1];
      }
      const referenceMatch = body.match(new RegExp(`${key}: ([A-Z_]\\w+)`, 'u'));
      assert.ok(referenceMatch, `${name}.${key} must be a literal or module constant`);
      const resolved = MODULE_CONSTANTS.get(referenceMatch[1]);
      assert.ok(resolved, `${name}.${key} references unknown module constant ${referenceMatch[1]}`);
      return resolved;
    };
    return {
      name,
      entry: {
        appResourceIdKind: read('appResourceIdKind'),
        appResourceType: read('appResourceType'),
        purpose: read('purpose'),
        retention: read('retention'),
        scene: read('scene'),
        source: read('source'),
        uploadProfileCode: read('uploadProfileCode'),
      },
    };
  });
}

test('every declared upload intent exists in the constants module', () => {
  const declared = declarationFile.declarations;
  assert.ok(Array.isArray(declared) && declared.length > 0, 'declaration file must list intents');
  const coded = readDeclaredConstantBodies();
  for (const entry of declared) {
    const match = coded.find((candidate) => candidate.entry.appResourceType === entry.appResourceType
      && candidate.entry.scene === entry.scene
      && candidate.entry.uploadProfileCode === entry.uploadProfileCode);
    assert.ok(match, `constants module must declare the (${entry.appResourceType}, ${entry.scene}, ${entry.uploadProfileCode}) intent`);
    assert.deepEqual(match.entry, {
      appResourceIdKind: entry.appResourceIdKind,
      appResourceType: entry.appResourceType,
      purpose: entry.purpose,
      retention: entry.retention,
      scene: entry.scene,
      source: entry.source,
      uploadProfileCode: entry.uploadProfileCode,
    });
  }
});

test('constants never declare intents the file does not authorize', () => {
  const declaredCount = declarationFile.declarations.length;
  const coded = readDeclaredConstantBodies();
  assert.equal(
    coded.length,
    declaredCount,
    'the constants module and the declaration file must cover the same intent set',
  );
});

test('the chat scene is application-owned, never the reserved scene', () => {
  for (const entry of declarationFile.declarations) {
    assert.notEqual(entry.scene, 'im', 'scene "im" is Drive-reserved (DRIVE_SPEC §9.4)');
    assert.match(entry.source, /^sdkwork-im-mp$/u, 'source is the stable call-origin label');
  }
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const selfPath = path.relative(repoRoot, fileURLToPath(import.meta.url)).replaceAll('\\', '/');

const forbiddenContracts = [
  ['legacy projection table prefix', /im_projection_/iu],
  ['runtime state snapshot table', /im_runtime_state_snapshots/iu],
  ['retired projection service', /projection-service/iu],
  ['retired timeline projection store', /TimelineProjectionStore/u],
  ['retired chat contacts path', /\/im\/v3\/api\/chat\/contacts/iu],
  ['retired chat contacts operation', /chat\.contacts\.list/iu],
];

const activeScanRoots = [
  '.env.postgres.example',
  '.github/workflows',
  'Cargo.toml',
  'package.json',
  'agent.app.config.json',
  'adapters',
  'apis',
  'apps',
  'crates',
  'database',
  'deployments',
  'etc',
  'scripts',
  'sdks',
  'services',
];

const canonicalDocs = [
  'README.md',
  'database/README.md',
  'docs/README.md',
  'docs/product/prd/PRD.md',
  'docs/architecture/tech/TECH_ARCHITECTURE.md',
  'docs/architecture/tech/TECH-api-reference.md',
  'docs/sites/architecture/module-map.md',
  'docs/sites/api-reference/im-api.md',
  'docs/sites/api-reference/app-api.md',
  'docs/sites/api-reference/backend-api.md',
];

const ignoredDirectoryNames = new Set([
  '.dart_tool',
  '.git',
  '.gradle',
  '.next',
  '.svelte-kit',
  '.turbo',
  '.vite',
  'DerivedData',
  'Pods',
  'coverage',
  'dist',
  'dist-embed',
  'node_modules',
  'obj',
  'playwright-report',
  'target',
  'test-results',
  'test_cache',
  'unit_test_assets',
]);

// Binary and build artifacts are never authored contract sources. Scanning
// them as UTF-8 was fatal: a single 71 MB Flutter `.dill` cache exhausted a
// 4 GB Node heap and the gate never completed.
const unscannableFileExtensions = new Set([
  '.7z', '.a', '.bin', '.bmp', '.class', '.db', '.dill', '.dll', '.dylib',
  '.eot', '.gif', '.gz', '.ico', '.jar', '.jpeg', '.jpg', '.lockb', '.mp3',
  '.mp4', '.otf', '.pdf', '.png', '.so', '.sqlite', '.sqlite3', '.tar',
  '.tgz', '.ttf', '.wasm', '.webp', '.woff', '.woff2', '.zip',
]);
const maxScannableFileBytes = 4 * 1024 * 1024;

function isScannableFile(absolutePath, stat) {
  if (stat.size > maxScannableFileBytes) {
    return false;
  }
  return !unscannableFileExtensions.has(path.extname(absolutePath).toLowerCase());
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, ...relativePath.split('/')), 'utf8');
}

function isIgnoredDirectoryName(name) {
  // `node_modules.__stale__donor_2`-style leftovers and junctioned dependency
  // trees must be skipped by name, before stat/realpath: on Windows a
  // directory junction reports isDirectory()=false on its Dirent.
  return ignoredDirectoryNames.has(name) || name.startsWith('node_modules');
}

const visitedDirectories = new Set();

function collectFiles(relativePath, files = [], depth = 0) {
  const absolutePath = path.join(repoRoot, ...relativePath.split('/'));
  if (!fs.existsSync(absolutePath)) {
    return files;
  }
  if (depth > 32 || isIgnoredDirectoryName(path.basename(absolutePath))) {
    return files;
  }
  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) {
    if (isScannableFile(absolutePath, stat)) {
      files.push(relativePath.replaceAll('\\', '/'));
    }
    return files;
  }
  // Flutter and pnpm workspaces use symlinked/junctioned directories. Walking
  // them without real-path deduplication can revisit the same tree forever on
  // Windows, so each physical directory is visited once.
  const realPath = fs.realpathSync.native(absolutePath);
  if (visitedDirectories.has(realPath)) {
    return files;
  }
  visitedDirectories.add(realPath);
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    if (isIgnoredDirectoryName(entry.name)) {
      continue;
    }
    collectFiles(path.join(relativePath, entry.name), files, depth + 1);
  }
  return files;
}

const activeFiles = new Set(activeScanRoots.flatMap((scanRoot) => collectFiles(scanRoot)));
for (const canonicalDoc of canonicalDocs) {
  assert.ok(fs.existsSync(path.join(repoRoot, canonicalDoc)), `missing canonical document ${canonicalDoc}`);
  activeFiles.add(canonicalDoc);
}

const violations = [];
for (const relativePath of [...activeFiles].sort()) {
  if (relativePath === selfPath) {
    continue;
  }
  let source;
  try {
    source = read(relativePath);
  } catch {
    continue;
  }
  if (source.includes('\0')) {
    continue;
  }
  for (const [label, pattern] of forbiddenContracts) {
    if (pattern.test(source)) {
      violations.push(`${relativePath}: ${label}`);
    }
  }
}

assert.deepEqual(
  violations,
  [],
  `retired projection or Contacts contracts remain active:\n${violations.join('\n')}`,
);

const postgresBaseline = read('database/ddl/baseline/postgres/0001_im_baseline.sql');
for (const tableName of [
  'im_conversations',
  'im_conversation_messages',
  'im_conversation_members',
  'im_conversation_read_cursors',
  'im_commit_journal',
  'im_outbox_events',
]) {
  assert.match(
    postgresBaseline,
    new RegExp(`CREATE TABLE IF NOT EXISTS ${tableName}\\b`, 'u'),
    `PostgreSQL baseline must own ${tableName}`,
  );
}

const persistence = read('adapters/postgres-journal/src/message_post_persistence.rs');
for (const symbol of [
  'persist_normalized_conversation_commit_txn',
  'persist_message_post_txn',
  'persist_message_mutation_txn',
  'enqueue_outbox_in_transaction',
]) {
  assert.ok(persistence.includes(symbol), `PostgreSQL adapter must implement ${symbol}`);
}

const runtimeSource = read('services/sdkwork-comms-conversation-service/src/runtime.rs');
const actorInboxSource = read(
  'services/sdkwork-comms-conversation-service/src/runtime/actor_inbox.rs',
);
const conversationStateSource = read(
  'services/sdkwork-comms-conversation-service/src/conversation_state/mod.rs',
);
for (const symbol of [
  'mod recovery;',
  'recover_from_journal',
  'reset_for_recovery',
  'apply_recovered_envelope',
  'rebuild_all_actor_inboxes',
]) {
  assert.ok(
    !runtimeSource.includes(symbol)
      && !actorInboxSource.includes(symbol)
      && !conversationStateSource.includes(symbol),
    `normalized Conversation state must not expose journal current-state recovery symbol ${symbol}`,
  );
}
assert.ok(
  !fs.existsSync(
    path.join(
      repoRoot,
      'services',
      'sdkwork-comms-conversation-service',
      'src',
      'runtime',
      'recovery.rs',
    ),
  ),
  'journal current-state recovery module must remain deleted',
);

const envExample = read('.env.postgres.example');
for (const key of [
  'SDKWORK_IM_CONVERSATION_STATE_CURSOR_HS256_SECRET=',
  'SDKWORK_IM_FRIEND_REQUEST_CURSOR_HS256_SECRET=',
  'SDKWORK_IM_MESSAGE_HISTORY_CURSOR_HS256_SECRET=',
]) {
  assert.ok(envExample.includes(key), `.env.postgres.example must document ${key}`);
}

const packageManifest = JSON.parse(read('package.json'));
assert.equal(
  packageManifest.scripts?.['test:normalized-im-authority-standard'],
  'node scripts/dev/sdkwork-im-normalized-authority-standard.test.mjs',
  'package.json must expose the normalized IM authority gate',
);
assert.ok(
  read('scripts/run-sdkwork-im-standards-verification.mjs')
    .includes("'test:normalized-im-authority-standard'"),
  'the repository verification chain must run the normalized IM authority gate',
);
assert.ok(
  read('.github/workflows/im-commercial-gates.yml')
    .includes('pnpm test:normalized-im-authority-standard'),
  'commercial CI must run the normalized IM authority gate',
);

process.stdout.write('sdkwork-im normalized authority standard passed\n');

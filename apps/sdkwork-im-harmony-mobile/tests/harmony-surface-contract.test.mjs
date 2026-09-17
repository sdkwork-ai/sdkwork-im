/**
 * Surface contract for the IM HarmonyOS mobile root.
 *
 * Authority: `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` sections 1, 3, 4, 5, 6, 8,
 * and `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 7.
 *
 * Why this test exists
 * --------------------
 * `sdkwork-specs/tools/lib/frontend-composition.mjs` scans only `.ts`, `.tsx`,
 * `.js`, and `.jsx` (`listSourceFiles`). Every ArkTS file in this root is `.ets`, so
 * the workspace gate's dependency-direction and raw-SDK-import rules do not reach
 * any of it. This suite applies those same rules to ArkTS, and adds the cross-client
 * route and locale alignment that section 7 and section 8 require.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, '..');
const APPS_ROOT = path.resolve(APP_ROOT, '..');
const REPO_ROOT = path.resolve(APPS_ROOT, '..');
const PACKAGES_DIR = path.join(APP_ROOT, 'packages');
const ENTRY_DIR = path.join(APP_ROOT, 'entry', 'src', 'main', 'ets');

const FAMILY_PACKAGES = [
  'sdkwork-im-harmony-mobile-core',
  'sdkwork-im-harmony-mobile-commons',
  'sdkwork-im-harmony-mobile-shell',
  'sdkwork-im-harmony-mobile-host',
  'sdkwork-im-harmony-mobile-chat',
];

/** `app-composition.mjs:29` — core subpaths the composition gate validates. */
const CORE_EXPORT_SUBPATHS = ['.', './sdk', './modules', './host', './session', './composition'];

/** `component-port-bindings.mjs` — allowed `contracts.layerRole` values. */
const ALLOWED_LAYER_ROLES = new Set([
  'contract',
  'frontend-core',
  'frontend-shell',
  'frontend-feature',
  'frontend-commons',
  'frontend-host',
  'backend-route',
  'backend-service',
  'backend-domain',
  'backend-repository',
  'backend-provider',
  'runtime-api-server',
  'runtime-service-host',
  'runtime-composition',
  'runtime-gateway',
  'runtime-native-host',
  'sdk-facade',
  'sdk-generated',
  'tooling',
]);

const BUSINESS_SDK_RE = /(?:^|\/|@sdkwork\/)[a-z0-9-]+-(?:app|backend)-sdk(?:$|\/)/u;

/** Canonical chat route ids as declared by the mini program capability. */
const CHAT_ROUTE_IDS = [
  'app.communication.chat.inbox',
  'app.communication.chat.conversation',
  'app.communication.chat.create-group',
];

/** Harmony-only chat keys, additive to the shared cross-client key set. */
const HARMONY_ONLY_CHAT_KEYS = [
  'chat.state.offline',
  'chat.state.permission_denied',
  'chat.state.unknown_error',
];

const H5_ROUTE_CATALOG = path.join(
  APPS_ROOT,
  'sdkwork-im-h5',
  'packages',
  'sdkwork-im-h5-shell',
  'src',
  'routeCatalog.ts',
);

const MINI_PROGRAM_CHAT_ROUTES = path.join(
  APPS_ROOT,
  'sdkwork-im-mini-program',
  'packages',
  'sdkwork-im-mp-chat',
  'src',
  'routes',
  'routeContributions.ts',
);

const MINI_PROGRAM_CHAT_I18N_DIR = path.join(
  APPS_ROOT,
  'sdkwork-im-mini-program',
  'packages',
  'sdkwork-im-mp-chat',
  'src',
  'i18n',
);

const MINI_PROGRAM_CHAT_ROOT = path.join(
  APPS_ROOT,
  'sdkwork-im-mini-program',
  'packages',
  'sdkwork-im-mp-chat',
  'src',
  'index.ts',
);

const HARMONY_CHAT_DIR = path.join(PACKAGES_DIR, 'sdkwork-im-harmony-mobile-chat', 'src', 'main', 'ets');

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

/** Recursively lists files under `dir`, skipping build output. */
function listFiles(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'oh_modules' || entry.name === 'build') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, filter, out);
      continue;
    }
    if (filter(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Extracts import specifiers from source text.
 *
 * Comments are stripped first: several modules legitimately name
 * `sdkwork-im-app-sdk` in prose to explain why they do not import it, and a naive
 * scan would flag the explanation as the violation.
 */
function extractImportSpecifiers(source) {
  const withoutBlockComments = source.replace(/\/\*[\s\S]*?\*\//gu, '');
  const withoutLineComments = withoutBlockComments.replace(/^\s*\/\/.*$/gmu, '');
  const specifiers = [];
  for (const match of withoutLineComments.matchAll(/\bfrom\s+['"]([^'"]+)['"]/gu)) {
    specifiers.push(match[1]);
  }
  for (const match of withoutLineComments.matchAll(/\bimport\s+['"]([^'"]+)['"]/gu)) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function collectQuotedKeys(source) {
  const keys = [];
  for (const match of source.matchAll(/^\s*['"]([a-zA-Z0-9_.]+)['"]\s*:/gmu)) {
    keys.push(match[1]);
  }
  return keys;
}

describe('harmony surface contract', () => {
  it('ships every family package with its authored surface', () => {
    for (const name of FAMILY_PACKAGES) {
      const packageDir = path.join(PACKAGES_DIR, name);
      assert.ok(fs.existsSync(packageDir), `${name}: package directory is missing`);
      for (const required of [
        'oh-package.json5',
        'package.json',
        'specs/component.spec.json',
        path.join('src', 'main', 'ets', 'Index.ets'),
      ]) {
        assert.ok(fs.existsSync(path.join(packageDir, required)), `${name}/${required} is missing`);
      }
    }
  });

  it('exposes the core composition subpaths the gate validates', () => {
    const packageJson = readJson(
      path.join(PACKAGES_DIR, 'sdkwork-im-harmony-mobile-core', 'package.json'),
    );
    assert.equal(typeof packageJson.exports, 'object', 'core must declare object-form exports');
    for (const subpath of CORE_EXPORT_SUBPATHS) {
      assert.ok(packageJson.exports[subpath], `core package.json exports is missing ${subpath}`);
    }
  });

  it('declares valid, self-consistent component contracts', () => {
    for (const name of FAMILY_PACKAGES) {
      const spec = readJson(path.join(PACKAGES_DIR, name, 'specs', 'component.spec.json'));
      const contracts = spec.contracts ?? {};
      const layerRole = contracts.layerRole;
      assert.ok(layerRole, `${name}: contracts.layerRole is required`);
      assert.ok(ALLOWED_LAYER_ROLES.has(layerRole), `${name}: layerRole ${layerRole} is not allowed`);
      for (const field of ['providedPorts', 'requiredPorts', 'sdkClients', 'sdkDependencies']) {
        assert.ok(Array.isArray(contracts[field]), `${name}: contracts.${field} must be an array`);
      }
      assert.ok(Array.isArray(contracts.publicExports), `${name}: publicExports must be an array`);
      for (const [index, port] of contracts.providedPorts.entries()) {
        assert.ok(
          contracts.publicExports.includes(port.export),
          `${name}: providedPorts[${index}].export ${port.export} must reference publicExports`,
        );
      }
      assert.equal(
        spec.component.generated,
        false,
        `${name}: an authored package must not be marked generated`,
      );
    }
  });

  it('respects the dependency direction of section 5', () => {
    const packages = FAMILY_PACKAGES.map((name) => ({
      name,
      deps: Object.keys(
        readJson(path.join(PACKAGES_DIR, name, 'oh-package.json5')).dependencies ?? {},
      ),
    }));
    const capabilityNames = new Set(
      packages.filter(({ name }) => !/-(?:core|commons|shell|host)$/u.test(name)).map(({ name }) => name),
    );
    assert.ok(capabilityNames.size > 0, 'the family must declare at least one capability package');

    for (const { name, deps } of packages) {
      for (const dep of deps) {
        assert.notEqual(dep, `@sdkwork/${name}`, `${name} must not depend on itself`);
        if (/-(?:core|commons)$/u.test(name)) {
          assert.ok(
            !capabilityNames.has(dep.replace('@sdkwork/', '')),
            `${name}: core/commons must not depend on capability package ${dep}`,
          );
        }
        if (/-host$/u.test(name)) {
          assert.ok(
            !BUSINESS_SDK_RE.test(dep),
            `${name}: host package must not depend on business SDK ${dep}`,
          );
        }
      }
    }

    // Cycles: section 5 forbids cyclic ohpm/hvigor dependencies.
    const graph = new Map(
      packages.map(({ name, deps }) => [
        `@sdkwork/${name}`,
        deps.filter((dep) => dep.startsWith('@sdkwork/')),
      ]),
    );
    const visiting = new Set();
    const visited = new Set();
    const visit = (node, trail) => {
      if (visited.has(node)) return;
      assert.ok(!visiting.has(node), `cyclic dependency: ${[...trail, node].join(' -> ')}`);
      visiting.add(node);
      for (const next of graph.get(node) ?? []) {
        if (graph.has(next)) visit(next, [...trail, node]);
      }
      visiting.delete(node);
      visited.add(node);
    };
    for (const node of graph.keys()) visit(node, []);
  });

  it('keeps generated business SDK imports out of every ArkTS package', () => {
    const hits = [];
    for (const file of listFiles(PACKAGES_DIR, (name) => name.endsWith('.ets'))) {
      for (const specifier of extractImportSpecifiers(readText(file))) {
        if (BUSINESS_SDK_RE.test(specifier)) {
          hits.push(`${path.relative(REPO_ROOT, file)}: ${specifier}`);
        }
      }
    }
    assert.deepEqual(
      hits,
      [],
      'ArkTS packages must reach the SDK through core public exports, not a generated SDK module',
    );
  });

  it('keeps the entry module free of business SDK imports', () => {
    const hits = [];
    for (const file of listFiles(ENTRY_DIR, (name) => name.endsWith('.ets'))) {
      for (const specifier of extractImportSpecifiers(readText(file))) {
        if (BUSINESS_SDK_RE.test(specifier)) {
          hits.push(`${path.relative(REPO_ROOT, file)}: ${specifier}`);
        }
      }
    }
    assert.deepEqual(hits, [], 'the entry module must only consume the generated clients through core');
  });

  it('exposes one routable page and keeps every screen in a package', () => {
    const mainPages = readJson(
      path.join(APP_ROOT, 'entry', 'src', 'main', 'resources', 'base', 'profile', 'main_pages.json'),
    );
    assert.deepEqual(mainPages.src, ['pages/Index'], 'entry must expose exactly the root page');
    assert.ok(
      fs.existsSync(path.join(ENTRY_DIR, 'pages', 'Index.ets')),
      'the root page must exist',
    );
    const screens = listFiles(path.join(PACKAGES_DIR, 'sdkwork-im-harmony-mobile-chat', 'src'), (name) =>
      name.endsWith('Page.ets'),
    );
    assert.equal(
      screens.length,
      3,
      'the chat capability must own its three route-level screens',
    );
  });

  it('aligns chat route ids and title keys across clients', () => {
    const harmonySource = readText(path.join(HARMONY_CHAT_DIR, 'routes', 'RouteContributions.ets'));
    const miniProgramSource = readText(MINI_PROGRAM_CHAT_ROUTES);
    const h5Source = readText(H5_ROUTE_CATALOG);

    const harmonyIds = uniqueSorted(
      [...harmonySource.matchAll(/'(app\.communication\.chat\.[a-z-]+)'/gu)].map((match) => match[1]),
    );
    assert.deepEqual(
      harmonyIds,
      uniqueSorted(CHAT_ROUTE_IDS),
      'harmony must declare exactly the three shared ids',
    );

    const miniProgramIds = uniqueSorted(
      [...miniProgramSource.matchAll(/"(app\.communication\.chat\.[a-z-]+)"/gu)].map((match) => match[1]),
    );
    assert.deepEqual(
      miniProgramIds,
      uniqueSorted(CHAT_ROUTE_IDS),
      'the mini program must declare the same ids',
    );

    const h5TitleKeys = [];
    for (const line of h5Source.split(/\r?\n/u)) {
      const match = /id:\s*"(app\.communication\.chat\.[a-z-]+)".*?titleKey:\s*"([^"]+)"/u.exec(line);
      if (match && CHAT_ROUTE_IDS.includes(match[1])) h5TitleKeys.push(match[2]);
    }
    assert.equal(h5TitleKeys.length, CHAT_ROUTE_IDS.length, 'the H5 catalog must declare all three ids');

    const harmonyTitleKeys = uniqueSorted(
      [...harmonySource.matchAll(/titleKey:\s*'([^']+)'/gu)].map((match) => match[1]),
    );
    assert.deepEqual(
      harmonyTitleKeys,
      uniqueSorted(h5TitleKeys),
      'title keys must match the H5 catalog for the same route ids',
    );
  });

  it('keeps the chat locale key set aligned with the mini program', () => {
    const harmonyZh = collectQuotedKeys(
      readText(path.join(HARMONY_CHAT_DIR, 'i18n', 'zh-CN', 'communication', 'chat', 'inbox.ets'))
      + readText(path.join(HARMONY_CHAT_DIR, 'i18n', 'zh-CN', 'communication', 'chat', 'conversation.ets'))
      + readText(path.join(HARMONY_CHAT_DIR, 'i18n', 'zh-CN', 'communication', 'chat', 'create-group.ets'))
      + readText(path.join(HARMONY_CHAT_DIR, 'i18n', 'zh-CN', 'communication', 'chat', 'state.ets')),
    );
    const miniProgramZh = collectQuotedKeys(
      readText(path.join(MINI_PROGRAM_CHAT_I18N_DIR, 'zh-CN', 'communication', 'chat', 'inbox.ts'))
      + readText(path.join(MINI_PROGRAM_CHAT_I18N_DIR, 'zh-CN', 'communication', 'chat', 'conversation.ts'))
      + readText(path.join(MINI_PROGRAM_CHAT_I18N_DIR, 'zh-CN', 'communication', 'chat', 'create-group.ts')),
    );

    const harmonySet = new Set(harmonyZh);
    const missing = uniqueSorted(miniProgramZh).filter((key) => !harmonySet.has(key));
    assert.deepEqual(missing, [], 'every shared chat key must exist in the harmony catalog');

    const extras = uniqueSorted(harmonyZh.filter((key) => !new Set(miniProgramZh).has(key)));
    assert.deepEqual(
      extras,
      HARMONY_ONLY_CHAT_KEYS,
      'the only harmony-only chat keys are the three documented screen-state keys',
    );

    for (const locale of ['zh-CN', 'en-US']) {
      const localeKeys = new Set(
        ['inbox', 'conversation', 'create-group', 'state'].flatMap((fragment) =>
          collectQuotedKeys(
            readText(
              path.join(HARMONY_CHAT_DIR, 'i18n', locale, 'communication', 'chat', `${fragment}.ets`),
            ),
          ),
        ),
      );
      assert.deepEqual(
        uniqueSorted([...localeKeys]),
        uniqueSorted([...harmonySet]),
        `${locale} must declare exactly the zh-CN key set`,
      );
    }
  });

  it('declares a route registry whose ids and page paths are unique', () => {
    const source = readText(path.join(HARMONY_CHAT_DIR, 'routes', 'RouteContributions.ets'));
    const pagePaths = uniqueSorted(
      [...source.matchAll(/'(pages\/chat\/[A-Za-z]+)'/gu)].map((match) => match[1]),
    );
    assert.equal(pagePaths.length, 3, 'the chat capability must declare three distinct page paths');
    for (const id of CHAT_ROUTE_IDS) {
      const segments = id.split('.');
      assert.equal(segments.length, 4, `${id}: route id must have four segments`);
    }
    for (const pagePath of pagePaths) {
      assert.match(pagePath, /^pages\/chat\/[A-Za-z]+$/u, `${pagePath}: unexpected page path shape`);
    }
  });

  it('declares the shell message catalog for both locales', () => {
    const shellI18n = path.join(PACKAGES_DIR, 'sdkwork-im-harmony-mobile-shell', 'src', 'main', 'ets', 'i18n');
    const zh = collectQuotedKeys(readText(path.join(shellI18n, 'zh-CN', 'communication', 'session', 'login.ets')));
    const en = collectQuotedKeys(readText(path.join(shellI18n, 'en-US', 'communication', 'session', 'login.ets')));
    assert.ok(zh.length > 0, 'the shell must author zh-CN session messages');
    assert.deepEqual(uniqueSorted(en), uniqueSorted(zh), 'shell locales must declare the same key set');
  });

  it('keeps the capability package declaration complete', () => {
    // The fleet's equivalent package declares `"dependencies": {}` while importing
    // commons from its page; an undeclared dependency only fails when the module
    // resolver decides it does.
    const packageJson = readJson(
      path.join(PACKAGES_DIR, 'sdkwork-im-harmony-mobile-chat', 'package.json'),
    );
    const ohPackage = readJson(
      path.join(PACKAGES_DIR, 'sdkwork-im-harmony-mobile-chat', 'oh-package.json5'),
    );
    const importedFrameworks = new Set();
    for (const file of listFiles(path.join(HARMONY_CHAT_DIR), (name) => name.endsWith('.ets'))) {
      for (const specifier of extractImportSpecifiers(readText(file))) {
        const framework = /^@sdkwork\/(sdkwork-im-harmony-mobile-[a-z]+)/u.exec(specifier);
        if (framework) importedFrameworks.add(`@sdkwork/${framework[1]}`);
      }
    }
    for (const framework of importedFrameworks) {
      assert.ok(
        ohPackage.dependencies[framework],
        `chat/oh-package.json5 must declare ${framework}`,
      );
      assert.ok(
        packageJson.dependencies[framework],
        `chat/package.json must declare ${framework}`,
      );
    }
    assert.ok(
      fs.existsSync(MINI_PROGRAM_CHAT_ROOT),
      'the mini program chat package must remain the alignment reference',
    );
  });

  it('keeps locale fragments under their authored path', () => {
    const expected = [
      'zh-CN/communication/chat/inbox.ets',
      'zh-CN/communication/chat/conversation.ets',
      'zh-CN/communication/chat/create-group.ets',
      'zh-CN/communication/chat/state.ets',
      'en-US/communication/chat/inbox.ets',
      'en-US/communication/chat/conversation.ets',
      'en-US/communication/chat/create-group.ets',
      'en-US/communication/chat/state.ets',
    ];
    const actual = listFiles(path.join(HARMONY_CHAT_DIR, 'i18n'), (name) => name.endsWith('.ets'))
      .map((file) => path.relative(path.join(HARMONY_CHAT_DIR, 'i18n'), file).split(path.sep).join('/'))
      .filter((relative) => !relative.startsWith('index.ets') && !relative.startsWith('StateMessages.ets'))
      .sort((a, b) => a.localeCompare(b));
    assert.deepEqual(
      actual,
      [...expected].sort((a, b) => a.localeCompare(b)),
      'I18N_SPEC section 6.1 fixes the fragment path shape',
    );
  });

  it('does not fork another client architecture into this root', () => {
    const allowedArchitectures = ['sdkwork-im-harmony-mobile'];
    const hits = [];
    for (const file of listFiles(PACKAGES_DIR, (name) => name.endsWith('.ets') || name.endsWith('.ts'))) {
      for (const specifier of extractImportSpecifiers(readText(file))) {
        const foreign = /^@sdkwork\/(sdkwork-im-(?:h5|pc|mp|flutter)[a-z-]*)/u.exec(specifier);
        if (foreign && !allowedArchitectures.includes(foreign[1])) {
          hits.push(`${path.relative(REPO_ROOT, file)}: ${specifier}`);
        }
      }
    }
    assert.deepEqual(
      hits,
      [],
      'section 3 forbids importing another architecture UI/runtime implementation',
    );
  });
});

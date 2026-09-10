#!/usr/bin/env node
/**
 * Generate consumer-owned declaration snapshots for SDKWork sibling packages.
 *
 * WHY THIS EXISTS
 * Sibling SDKWork packages publish their TypeScript sources directly
 * (`package.json` `exports`/`types` -> `./src/index.ts`) and ship no `dist/`
 * declaration output. A consumer that imports such a package therefore pulls
 * the sibling's whole source graph into its `tsc` program, and tsc reports the
 * sibling's own type debt (uninstalled sibling deps, implicit anys, duplicate
 * i18next majors) as consumer errors. `exclude` cannot fix this: excluded
 * files still enter the program when another program file imports them, and
 * `skipLibCheck` only skips `.d.ts` files.
 *
 * The mechanism sanctioned by PNPM_WORKSPACE_DEPENDENCY_SPEC ("consumers
 * typecheck their own program; sibling packages are consumed via their public
 * types") is to give the consumer real declaration files derived from the
 * sibling's actual sources: this script emits `.d.ts` trees for the selected
 * sibling packages into the consuming app's `types/siblings/` directory. The
 * app's `tsconfig.json` then scopes the `paths` entries for those packages to
 * the generated declarations, so the sibling sources leave the consumer
 * program while every import still resolves to real types. Vite keeps
 * resolving the real sources at build time (its aliases are unchanged), so
 * runtime behavior is unaffected.
 *
 * Regenerate (per app) with the command documented in the app's tsconfig.
 * Re-run it after a sibling's public surface changes; the snapshots are
 * consumer-owned artifacts and must be committed.
 *
 * Usage:
 *   node scripts/dev/gen-sibling-type-decls.mjs --app apps/sdkwork-im-h5 \
 *     --out types/siblings \
 *     --package @sdkwork/rtc-h5-call \
 *     --package @sdkwork/order-app-sdk \
 *     --root "@sdkwork/some-pkg:src/deep/extraEntry.ts"
 *
 * `--package <specifier>` resolves the package through the app's own
 * `node_modules` (workspace symlink), so the snapshot is always taken from the
 * checked-out sibling the app actually builds against. `--root <spec>:<rel>`
 * adds an extra entry file (for deep imports the app makes beyond the package
 * index). The script prints the `paths` snippet to paste into the app
 * tsconfig.
 */

import process from 'node:process';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

function fail(message) {
  process.stderr.write(`gen-sibling-type-decls: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    appRoot: '',
    out: 'types/siblings',
    packages: [],
    extraRoots: [],
    sources: {},
    deepPackages: new Set(),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index + 0];
    const value = argv[index + 1];
    if (arg === '--app' && value) {
      options.appRoot = path.resolve(value);
      index += 1;
    } else if (arg === '--out' && value) {
      options.out = value;
      index += 1;
    } else if (arg === '--package' && value) {
      options.packages.push(value);
      index += 1;
    } else if (arg === '--root' && value) {
      const separator = value.indexOf(':');
      if (separator <= 0) fail(`--root expects "<specifier>:<relative-entry>", got: ${value}`);
      options.extraRoots.push({
        specifier: value.slice(0, separator),
        relativeEntry: value.slice(separator + 1),
      });
      index += 1;
    } else if (arg === '--source' && value) {
      const separator = value.indexOf('=');
      if (separator <= 0) fail(`--source expects "<specifier>=<package-dir>", got: ${value}`);
      options.sources[value.slice(0, separator)] = value.slice(separator + 1);
      index += 1;
    } else if (arg === '--deep' && value) {
      // Emit declarations for every source file of the package, not only the
      // transitive closure of its index: needed when consumers (or sibling
      // packages) deep-import subpaths that the index never re-exports.
      options.deepPackages.add(value);
      index += 1;
    } else {
      fail(`unknown or incomplete argument: ${arg}`);
    }
  }
  if (!options.appRoot) fail('--app <appDir> is required');
  if (options.packages.length === 0) fail('at least one --package <specifier> is required');
  return options;
}

function listSourceFiles(rootDir) {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      if (/\.(ts|tsx)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) {
        files.push(entryPath);
      }
    }
  };
  walk(rootDir);
  return files;
}

function resolvePackageDir(appRoot, specifier) {
  // Package `exports` maps "." at the source entry and rarely exposes
  // "./package.json", and the workspace package manager links workspace deps
  // at the importing workspace-member's node_modules (not necessarily the app
  // root), so probe every plausible resolution root and walk up to the
  // manifest.
  const candidateRoots = [appRoot];
  const packagesDir = path.join(appRoot, 'packages');
  if (fs.existsSync(packagesDir)) {
    for (const member of fs.readdirSync(packagesDir, { withFileTypes: true })) {
      if (member.isDirectory()) candidateRoots.push(path.join(packagesDir, member.name));
    }
  }
  for (let ancestor = path.dirname(appRoot); ; ancestor = path.dirname(ancestor)) {
    candidateRoots.push(ancestor);
    if (ancestor === path.parse(ancestor).root) break;
  }
  for (const root of candidateRoots) {
    const packageDir = path.join(root, 'node_modules', specifier);
    if (!fs.existsSync(packageDir)) continue;
    let dir = fs.realpathSync(packageDir);
    while (!fs.existsSync(path.join(dir, 'package.json'))) {
      const parent = path.dirname(dir);
      if (parent === dir) fail(`no package.json above ${packageDir} for "${specifier}"`);
      dir = parent;
    }
    return dir;
  }
  fail(`cannot resolve "${specifier}" from ${appRoot} (no node_modules link in app, packages/*, or ancestors)`);
}

function resolvePackageEntry(packageDir, specifier) {
  const manifestPath = path.join(packageDir, 'package.json');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    fail(`cannot read ${manifestPath}: ${error.message}`);
  }
  const candidates = [
    manifest.types,
    manifest.typings,
    manifest.exports?.['.']?.types,
    manifest.exports?.['.']?.import,
    manifest.main,
    'src/index.ts',
  ].filter((candidate) => typeof candidate === 'string');
  for (const candidate of candidates) {
    const entryPath = path.resolve(packageDir, candidate.replace(/^\.\//, ''));
    if (fs.existsSync(entryPath)) return entryPath;
  }
  fail(`no readable entry (types/exports/main) for "${specifier}" under ${packageDir}`);
}

function resolveAppTypeScriptCli(appRoot) {
  const requireFromApp = createRequire(path.join(appRoot, 'package.json'));
  let typescriptMain;
  try {
    typescriptMain = requireFromApp.resolve('typescript');
  } catch (error) {
    fail(`cannot resolve "typescript" from ${appRoot}: ${error.message}`);
  }
  const cliPath = path.join(path.dirname(typescriptMain), 'tsc.js');
  if (!fs.existsSync(cliPath)) fail(`TypeScript CLI not found at ${cliPath}`);
  return cliPath;
}

function buildSynthesizedConfig({ appRoot, packageDir, outDir, entryFiles }) {
  const reactTypesDir = path.join(appRoot, 'node_modules', '@types');
  const config = {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'bundler',
      jsx: 'react-jsx',
      skipLibCheck: true,
      // Emit declarations without surfacing the sibling's own type debt as
      // errors; the consumer still consumes real emitted types. Bare imports
      // resolve naturally from each sibling's own node_modules, exactly like
      // they do when the consumer builds through Vite.
      noCheck: true,
      declaration: true,
      emitDeclarationOnly: true,
      allowImportingTsExtensions: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      types: ['node'],
      typeRoots: [reactTypesDir],
      rootDir: packageDir,
      outDir,
    },
    files: entryFiles,
  };
  const configPath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'sdkwork-sibling-decl-')),
    'tsconfig.gen.json',
  );
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  return configPath;
}

function runTypeScriptCli(cliPath, configPath) {
  const result = spawnSync(process.execPath, [cliPath, '-p', configPath, '--pretty', 'false'], {
    encoding: 'utf8',
  });
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
}

function collectSdkworkImports(dir, seen = new Set(), imports = new Set()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSdkworkImports(entryPath, seen, imports);
      continue;
    }
    if (!entry.name.endsWith('.d.ts') || seen.has(entryPath)) continue;
    seen.add(entryPath);
    const source = fs.readFileSync(entryPath, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\()\s*['"](@sdkwork\/[^'"]+)['"]/g)) {
      // Keep the package specifier only (strip any subpath).
      imports.add(match[1].split('/').slice(0, 2).join('/'));
    }
  }
  return imports;
}

const options = parseArgs(process.argv.slice(2));
const appRoot = fs.realpathSync(options.appRoot);
const outRoot = path.join(appRoot, options.out);
const tscCliPath = resolveAppTypeScriptCli(appRoot);
fs.mkdirSync(outRoot, { recursive: true });

const pathsSnippet = {};
const referencedSiblings = new Set();

for (const specifier of options.packages) {
  // `--source` supports packages with no node_modules link in the consuming
  // workspace (they enter the program only through a tsconfig paths mapping).
  const sourceOverride = options.sources[specifier];
  const packageDir = sourceOverride
    ? fs.realpathSync(path.resolve(sourceOverride))
    : resolvePackageDir(appRoot, specifier);
  const entryFiles = [resolvePackageEntry(packageDir, specifier)];
  if (options.deepPackages.has(specifier)) {
    const entryDir = path.dirname(entryFiles[0]);
    entryFiles.push(...listSourceFiles(entryDir).filter((file) => !entryFiles.includes(file)));
  }
  for (const extraRoot of options.extraRoots.filter((root) => root.specifier === specifier)) {
    const extraEntryPath = path.join(packageDir, extraRoot.relativeEntry);
    if (!fs.existsSync(extraEntryPath)) {
      fail(`extra root "${extraRoot.relativeEntry}" not found in ${packageDir}`);
    }
    entryFiles.push(extraEntryPath);
  }
  const outDir = path.join(outRoot, specifier);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const configPath = buildSynthesizedConfig({ appRoot, packageDir, outDir, entryFiles });
  const { status, output } = runTypeScriptCli(tscCliPath, configPath);
  const entryDecl = `${entryFiles[0].slice(packageDir.length + 1).replace(/\.tsx?$/, '.d.ts')}`;
  const entryDeclPath = path.join(outDir, entryDecl);
  if (!fs.existsSync(entryDeclPath)) {
    process.stderr.write(
      `declaration emit produced no entry for "${specifier}" (tsc exit ${status})\n${output}\n`,
    );
    process.exit(1);
  }
  if (output) {
    process.stdout.write(`[${specifier}] tsc notes (non-fatal, sibling-owned):\n${output}\n`);
  }
  const entryDirRelativeToPackage = path.dirname(entryFiles[0]).slice(packageDir.length + 1);
  const entryDirPrefix = entryDirRelativeToPackage === '.' ? '' : `${entryDirRelativeToPackage}/`;
  // Mapping target is the entry `.d.ts` snapshot. These paths are for tsc
  // only: `scripts/dev/run-tsx-cli.mjs` strips `types/siblings` scopes for
  // test runs so runtime keeps resolving the real workspace packages through
  // node_modules.
  pathsSnippet[specifier] = [`./${options.out}/${specifier}/${entryDirPrefix}index.d.ts`];
  pathsSnippet[`${specifier}/*`] = [`./${options.out}/${specifier}/${entryDirPrefix}*`];
  for (const referenced of collectSdkworkImports(path.dirname(entryDeclPath))) {
    if (referenced !== specifier) referencedSiblings.add(referenced);
  }
  process.stdout.write(`[${specifier}] declarations written to ${path.relative(appRoot, outDir)}\n`);
}

process.stdout.write(`\nPaste into the app tsconfig "paths":\n${JSON.stringify(pathsSnippet, null, 2)}\n`);
if (referencedSiblings.size > 0) {
  process.stdout.write(
    `\nGenerated declarations reference these sibling packages (resolve them from the app ` +
    `context; snapshot them too if the app cannot resolve them or their sources are type-dirty):\n` +
    `${[...referencedSiblings].sort().map((name) => `  - ${name}`).join('\n')}\n`,
  );
}

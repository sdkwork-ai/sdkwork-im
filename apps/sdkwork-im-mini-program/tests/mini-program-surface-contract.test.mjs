/**
 * Static architecture contract for the IM mini program root.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` and
 * `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 2. This asserts the
 * structural facts a reviewer would otherwise have to check by hand: the package
 * family is the one the architecture prescribes, the composition root exports the
 * six mandated subpaths, the platform-global boundary is intact, and the global
 * stylesheet still restates the design tokens instead of drifting from them.
 *
 * Nothing here needs the WeChat DevTools toolchain, so it runs in `pnpm test`.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  appRoot,
  findPlatformGlobalAccess,
  listFiles,
  loadRuntimeBundle,
  requireBundleExport,
} from "./lib/load-runtime-bundle.mjs";

/** The layer roles the architecture prescribes for a mini program capability surface. */
const EXPECTED_PACKAGE_ROLES = {
  "sdkwork-im-mp-core": "frontend-core",
  "sdkwork-im-mp-commons": "frontend-commons",
  "sdkwork-im-mp-shell": "frontend-shell",
  "sdkwork-im-mp-host": "frontend-host",
  "sdkwork-im-mp-chat": "frontend-feature",
};

/**
 * `component.type` is the PACKAGE kind, not the architecture role: the fleet's
 * mini program roots declare `typescript-package` (agents) or
 * `mini-program-package` (mail). The architecture role lives in
 * `contracts.layerRole`, which is what `EXPECTED_PACKAGE_ROLES` pins.
 */
const ACCEPTED_COMPONENT_TYPES = ["typescript-package", "mini-program-package"];

/** `CORE_EXPORT_SUBPATHS` in `sdkwork-specs/tools/lib/app-composition.mjs`. */
const CORE_EXPORT_SUBPATHS = [
  ".",
  "./sdk",
  "./modules",
  "./host",
  "./session",
  "./composition",
];

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

test("the root declares its application manifests", () => {
  for (const file of [
    "package.json",
    "sdkwork.app.config.json",
    "project.config.json",
    "tsconfig.json",
    "AGENTS.md",
    "specs/component.spec.json",
  ]) {
    assert.equal(existsSync(path.join(appRoot, file)), true, `${file} must exist`);
  }

  const appConfig = readJson(path.join(appRoot, "sdkwork.app.config.json"));
  assert.equal(appConfig.app.key, "sdkwork-im-mini-program");
  assert.equal(appConfig.runtime.family, "mini-program");
  assert.deepEqual(appConfig.runtime.clientArchitectures, ["mini-program"]);
  assert.equal(appConfig.runtime.runtimes.includes("MP_WEIXIN"), true);

  // `src/` is the WeChat `miniprogramRoot`; the devtools open the app root, so a
  // wrong root silently opens an empty project instead of failing.
  const projectConfig = readJson(path.join(appRoot, "project.config.json"));
  assert.equal(projectConfig.miniprogramRoot, "src/");
  assert.equal(projectConfig.compileType, "miniprogram");

  // The release workflow manifest lives at the repository root; this root
  // points at it rather than duplicating it (`metadata.releaseAuthority`).
  assert.equal(
    appConfig.metadata.releaseAuthority,
    "../../sdkwork.workflow.json",
    "release authority must stay the repository-root workflow manifest",
  );
});

test("the package family matches the architecture roles", () => {
  const packagesRoot = path.join(appRoot, "packages");
  const names = readdirSync(packagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(names, Object.keys(EXPECTED_PACKAGE_ROLES).sort());

  for (const [name, role] of Object.entries(EXPECTED_PACKAGE_ROLES)) {
    const packageRoot = path.join(packagesRoot, name);
    for (const file of ["package.json", "specs/component.spec.json", "README.md"]) {
      assert.equal(existsSync(path.join(packageRoot, file)), true, `${name}/${file} must exist`);
    }
    const spec = readJson(path.join(packageRoot, "specs/component.spec.json"));
    assert.equal(
      ACCEPTED_COMPONENT_TYPES.includes(spec.component.type),
      true,
      `${name} must declare a known component.type; received ${JSON.stringify(spec.component.type)}`,
    );
    assert.equal(
      spec.contracts.layerRole,
      role,
      `${name} must declare contracts.layerRole=${role}`,
    );
  }

  // A `-core` package carries the composition root, so `src/composition/` and
  // the six mandated export subpaths are structural, not optional.
  const coreSpec = readJson(
    path.join(packagesRoot, "sdkwork-im-mp-core", "specs", "component.spec.json"),
  );
  assert.deepEqual(
    [...coreSpec.contracts.publicExports].sort(),
    [...CORE_EXPORT_SUBPATHS].sort(),
  );
  assert.equal(
    statSync(path.join(packagesRoot, "sdkwork-im-mp-core", "src", "composition")).isDirectory(),
    true,
  );
});

test("only mp-host references platform globals", () => {
  const packagesRoot = path.join(appRoot, "packages");
  const violations = [];
  for (const file of listFiles(packagesRoot, ".ts")) {
    if (file.includes(`${path.sep}sdkwork-im-mp-host${path.sep}`)) {
      continue;
    }
    const found = findPlatformGlobalAccess(readFileSync(file, "utf8"));
    for (const { globalName } of found) {
      violations.push(`${path.relative(appRoot, file)} references ${globalName}.*`);
    }
  }
  assert.deepEqual(violations, [], "platform globals must stay inside sdkwork-im-mp-host");
});

test("the platform-global detector ignores prose but catches real access", () => {
  // A checker that only ever returns "clean" would make the test above vacuous,
  // so the detector is pinned against known inputs. Each "clean" case here is a
  // shape that has actually been misreported as a violation in this root.
  const clean = [
    ["line comment", "// wx.login() is called by the host\nconst a = 1;"],
    ["block comment", '/**\n * keeps mp-shell free of `wx.*` globals\n */\nconst a = 1;'],
    ["double-quoted string", 'throw new Error("wx.login() did not return a code");'],
    ["single-quoted string", "const key = 'my.setStorage';"],
    ["apostrophe in prose", "// the host's adapter is injected, never wx.*"],
    // Regression: a template with an interpolation used to desynchronize the
    // scanner, after which this doc comment was reported as a violation.
    [
      "template before a doc comment",
      "const m = `needs ${MIN} pages`;\n/**\n * injects so `mp-shell` avoids `wx.*`\n */\n",
    ],
  ];
  for (const [label, source] of clean) {
    assert.deepEqual(findPlatformGlobalAccess(source), [], `${label} must not be reported`);
  }

  const violations = [
    ["bare member access", "wx.login();"],
    ["member access after code", "const a = 1;\nmy.setStorage({});"],
    ["inside a template interpolation", "const x = `a${dd.foo()}b`;"],
  ];
  for (const [label, source] of violations) {
    assert.equal(findPlatformGlobalAccess(source).length > 0, true, `${label} must be reported`);
  }

  // The policed set is part of the contract, not an implementation detail of the
  // helper: the mini program platforms are exactly these three globals.
  assert.deepEqual(
    findPlatformGlobalAccess("wx.a(); my.b(); dd.c();").map((hit) => hit.globalName),
    ["wx", "my", "dd"],
  );
});

test("platform pages depend only on the runtime bundle", () => {
  const violations = [];
  for (const file of listFiles(path.join(appRoot, "src"), ".js")) {
    const relative = path.relative(appRoot, file).replaceAll("\\", "/");
    if (relative.startsWith("src/runtime/")) {
      continue;
    }
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/require\(\s*["']([^"']+)["']\s*\)/gu)) {
      const specifier = match[1];
      if (specifier.startsWith(".") || specifier.startsWith("node:")) {
        continue;
      }
      violations.push(`${relative} requires ${specifier}`);
    }
  }
  assert.deepEqual(
    violations,
    [],
    "src/app.js and the pages must require the runtime bundle, never a workspace package",
  );
});

test("the stylesheets restate the package design tokens", () => {
  const bundle = loadRuntimeBundle();
  const tokens = requireBundleExport(bundle, "imMpTokens");

  // `.wxss` cannot import TypeScript, so the values are restated. The restated
  // surface is every stylesheet in the root, not only `src/app.wxss`: the fleet
  // writes token values as literals in the rules that use them (no sibling mini
  // program declares CSS custom properties), so `colorDanger` legitimately
  // appears only in the page that renders a destructive action.
  //
  // This is the assertion the restatement promises: a token change that skips
  // the stylesheets fails here instead of shipping two different greys.
  const stylesheets = listFiles(path.join(appRoot, "src"), ".wxss");
  assert.equal(stylesheets.length > 0, true, "the root must ship at least one stylesheet");
  const restated = stylesheets.map((file) => readFileSync(file, "utf8")).join("\n");

  for (const [name, value] of Object.entries(tokens)) {
    assert.match(
      restated,
      new RegExp(value.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"),
      `no stylesheet under src/ restates ${name}=${value}`,
    );
  }
});

test("the runtime bundle exposes the platform surface", () => {
  const bundle = loadRuntimeBundle();
  for (const name of [
    "bootstrapImMpMiniProgram",
    "getImMpRuntime",
    "resolveImMpLaunchPagePath",
    "IM_MP_HOME_PAGE_PATH",
    "IM_MP_LOGIN_PAGE_PATH",
    "composeImMpRoutes",
    "projectImMpAppJson",
    "formatImMpTimestamp",
    "formatImMpBadgeCount",
    "IM_MP_CHAT_QUERY_PARAMS",
    "IM_MP_CHAT_ROUTE_IDS",
    "IM_MP_CHAT_SUBPACKAGE",
  ]) {
    assert.notEqual(requireBundleExport(bundle, name), undefined, `must export ${name}`);
  }

  // The pages read this exact key to find the login page; it must not drift from
  // the route contribution the projector emits into `app.json#pages`.
  const appJson = readJson(path.join(appRoot, "src", "app.json"));
  assert.equal(appJson.pages.includes(bundle.IM_MP_LOGIN_PAGE_PATH), true);
  assert.equal(appJson.pages.includes(bundle.IM_MP_HOME_PAGE_PATH), true);
});

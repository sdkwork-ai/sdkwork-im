/**
 * Builds the IM mini program runtime and the platform page manifest.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` sections 5 and 6.
 * Two artifacts are produced from one source of truth:
 *
 * 1. `src/runtime/im-app.js` — esbuild bundle of `src/bootstrap/runtimeBundle.ts`.
 *    The WeChat runtime loads plain CommonJS while the packages are TypeScript,
 *    so `src/app.js` and the pages require this bundle and never a workspace
 *    package. The bundle is committed (as in `sdkwork-mail-mini-program`) so the
 *    devtools can open the project without a build step, and so the checked-in
 *    test suite can assert against the same bytes that ship.
 * 2. `src/app.json` — the platform `pages` / `subPackages` / `preloadRule` are
 *    DERIVED from the route contributions, not authored. They are model
 *    boundaries in SDKWork terms: package placement lives in the route
 *    contributions, and the physical platform lists are projection targets.
 *    Rewriting them here is what makes drift impossible rather than merely
 *    detected.
 *
 * The bundle is loaded back through `new Function` instead of `require` because
 * the repository's root `package.json` declares `"type": "module"`, so Node would
 * parse a `.js` file containing CommonJS as ESM. The bundle is fully
 * self-contained (`bundle: true`, no externals), so no `require` shim is needed.
 *
 * Usage:
 *   node scripts/build-runtime.mjs
 *   node scripts/build-runtime.mjs --deployment-profile cloud --environment staging
 */

import * as esbuild from "esbuild";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";

const scriptsRoot = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptsRoot, "..");

/**
 * Reads and parses a JSON file, tolerating a UTF-8 BOM.
 *
 * `JSON.parse` rejects a leading BOM, and several manifests in this workspace
 * carry one, so a bare `JSON.parse(readFileSync(...))` would fail on a file that
 * is otherwise perfectly valid.
 */
function readJsonFile(file) {
  return JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

/** Must stay identical to `etc/sdkwork.deployment.config.json#profiles`. */
const DEPLOYMENT_PROFILES = ["standalone", "cloud"];
const ENVIRONMENTS = ["development", "test", "staging", "demo", "production"];

/** Must stay identical to `IM_MP_RUNTIME_TARGET` in `src/bootstrap/environment.ts`. */
const RUNTIME_TARGET = "mini-program";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    "deployment-profile": { type: "string", default: "standalone" },
    environment: { type: "string", default: "development" },
  },
  strict: true,
});

const deploymentProfile = values["deployment-profile"];
const environment = values.environment;
if (!DEPLOYMENT_PROFILES.includes(deploymentProfile)) {
  throw new Error(`--deployment-profile must be one of ${DEPLOYMENT_PROFILES.join(", ")}`);
}
if (!ENVIRONMENTS.includes(environment)) {
  throw new Error(`--environment must be one of ${ENVIRONMENTS.join(", ")}`);
}

const profileId = `${deploymentProfile}.${environment}`;
const runtimeConfigPath = path.join(
  appRoot,
  "config",
  "mini-program",
  `runtime-env.${profileId}.json`,
);
if (!existsSync(runtimeConfigPath)) {
  throw new Error(
    `Mini program runtime profile does not exist: ${runtimeConfigPath}. ` +
      "Run `pnpm workflow:materialize-client-env` from the repository root to materialize it.",
  );
}

/**
 * Reads the materialized profile and proves it is the profile we asked for.
 *
 * A bundle built from a stale or hand-edited profile is the one failure that
 * cannot be seen from the running app: the identity keys would still be
 * well-formed and the app would simply point at the wrong gateway.
 */
const runtimeConfig = JSON.parse(readFileSync(runtimeConfigPath, "utf8"));
for (const [key, expected] of Object.entries({
  SDKWORK_DEPLOYMENT_PROFILE: deploymentProfile,
  SDKWORK_ENVIRONMENT: environment,
  SDKWORK_PROFILE_ID: profileId,
  SDKWORK_RUNTIME_TARGET: RUNTIME_TARGET,
})) {
  if (runtimeConfig[key] !== expected) {
    throw new Error(
      `${runtimeConfigPath} must declare ${key}=${JSON.stringify(expected)}; ` +
        `received ${JSON.stringify(runtimeConfig[key] ?? null)}`,
    );
  }
}

const runtimeDir = path.join(appRoot, "src", "runtime");
mkdirSync(runtimeDir, { recursive: true });
const bundlePath = path.join(runtimeDir, "im-app.js");

await esbuild.build({
  entryPoints: [path.join(appRoot, "src", "bootstrap", "runtimeBundle.ts")],
  bundle: true,
  outfile: bundlePath,
  platform: "browser",
  format: "cjs",
  target: "es2019",
  legalComments: "none",
  logLevel: "info",
});

/**
 * Loads the bundle that was just written.
 *
 * Loading the built artifact (rather than importing the TypeScript sources a
 * second time) is deliberate: the page manifest is then derived from exactly the
 * code that ships, so a bundling failure cannot leave `app.json` describing a
 * route set the bundle does not contain.
 */
function loadRuntimeBundle(file) {
  const source = readFileSync(file, "utf8");
  if (source.length < 10_000) {
    throw new Error(`Runtime bundle looks truncated (${source.length} bytes): ${file}`);
  }
  const loaded = { exports: {} };
  const factory = new Function("module", "exports", "require", source);
  factory(loaded, loaded.exports, (specifier) => {
    throw new Error(
      `Runtime bundle must be self-contained but required ${JSON.stringify(specifier)}`,
    );
  });
  return loaded.exports;
}

const runtime = loadRuntimeBundle(bundlePath);
for (const exportName of [
  "composeImMpRoutes",
  "resolveImMpTabBarDeclaration",
  "IM_MP_HOME_PAGE_PATH",
]) {
  if (runtime[exportName] === undefined) {
    throw new Error(`Runtime bundle must export ${exportName}`);
  }
}

/** Throws when two route contributions collide; returns the projection. */
const composition = runtime.composeImMpRoutes();
const tabBarDeclaration = runtime.resolveImMpTabBarDeclaration(composition.tabBar);

/**
 * Projects the route contributions into `app.json`.
 *
 * `preloadRule` is derived from a single rule: a subpackage that asks to be
 * preloaded is preloaded from the home page. The platform needs a main-package
 * page as the trigger, and the home page is the only one guaranteed to exist
 * before any capability screen is reachable. The static keys (`window`, `style`,
 * `lazyCodeLoading`) are NOT derived — they are presentation settings the route
 * contributions do not own, so the checked-in file keeps them and this script
 * only replaces the three derived keys.
 */
const appJsonPath = path.join(appRoot, "src", "app.json");
if (!existsSync(appJsonPath)) {
  throw new Error(
    `src/app.json must exist: it pins the static window/style settings the route projection does not own (${appJsonPath})`,
  );
}
const appJson = JSON.parse(readFileSync(appJsonPath, "utf8"));

const preloadPackages = composition.appJson.subPackages
  .filter((subpackage) => subpackage.preloadRule === true)
  .map((subpackage) => subpackage.root);

const nextAppJson = {
  ...appJson,
  pages: composition.appJson.pages,
  subPackages: composition.appJson.subPackages.map((subpackage) => ({
    root: subpackage.root,
    pages: subpackage.pages,
  })),
};

if (preloadPackages.length > 0) {
  nextAppJson.preloadRule = {
    [runtime.IM_MP_HOME_PAGE_PATH]: { network: "all", packages: preloadPackages },
  };
} else {
  delete nextAppJson.preloadRule;
}

// The platform rejects a `tabBar` with fewer than two items, so the declaration
// and the projection must agree in both directions: a committed `tabBar` with no
// tab pages fails on device, and tab pages with no `tabBar` makes
// `wx.setTabBarItem` throw during bootstrap.
const declaresTabBar = appJson.tabBar !== undefined;
if (declaresTabBar !== tabBarDeclaration.enabled) {
  throw new Error(
    declaresTabBar
      ? "src/app.json declares a tabBar but the route projection yields no tab pages"
      : `the route projection yields ${composition.tabBar.length} tab page(s) but src/app.json declares no tabBar (${tabBarDeclaration.reason ?? "unknown reason"})`,
  );
}

writeFileSync(appJsonPath, `${JSON.stringify(nextAppJson, null, 2)}\n`, "utf8");

writeFileSync(
  path.join(runtimeDir, "runtime-env.js"),
  `module.exports = ${JSON.stringify(runtimeConfig, null, 2)};\n`,
  "utf8",
);

writeFileSync(
  path.join(runtimeDir, "build-manifest.json"),
  `${JSON.stringify(
    {
      appKey: "sdkwork-im-mini-program",
      deploymentProfile,
      environment,
      profileId,
      runtimeTarget: RUNTIME_TARGET,
      platform: "MP_WEIXIN",
      bundle: "src/runtime/im-app.js",
      appJson: {
        pages: nextAppJson.pages.length,
        subPackages: nextAppJson.subPackages.length,
        tabBar: declaresTabBar,
      },
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(
  `IM mini program built: ${profileId} (${nextAppJson.pages.length} main page(s), ` +
    `${nextAppJson.subPackages.length} subpackage(s), tabBar=${declaresTabBar ? "on" : "off"})`,
);

/**
 * Route contribution projection contract.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 5 and
 * `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md`. Route contributions are the
 * single source of truth for page placement; `src/app.json` is a PROJECTION
 * target. This test runs the projection against the bundle that ships and
 * compares it with the committed manifest, so a route added to a package but not
 * to `app.json` fails a gate instead of 404-ing on device.
 *
 * It also pins the cross-client contract that can actually be checked: every
 * route id and title key this surface SHARES with H5 must exist in the H5 route
 * catalog with the same values, and the screens H5 does not render (the session
 * screen) must instead be authored in this root. The PC client has no comparable
 * id catalog (its navigation is desktop-local), so this test does not claim PC
 * route parity — asserting it would need a catalog that does not exist.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  appRoot,
  appJsonPath,
  listFiles,
  loadRuntimeBundle,
  requireBundleExport,
} from "./lib/load-runtime-bundle.mjs";

const repositoryRoot = path.resolve(appRoot, "..", "..");
const h5RouteCatalogPath = path.join(
  repositoryRoot,
  "apps",
  "sdkwork-im-h5",
  "packages",
  "sdkwork-im-h5-shell",
  "src",
  "routeCatalog.ts",
);

/** `app.json#pages[0]` before the session is known; see `src/app.js`. */
const FIRST_PAGE_INVARIANT =
  "the login page must be the first entry of app.json#pages so the pre-session " +
  "frame cannot render protected data";

/**
 * Screens the H5 client also renders, so the route id and copy must be shared.
 *
 * The session screen is deliberately absent: H5 authenticates through the IAM H5
 * surface and declares no login route, so there is no H5 id to share.
 */
const H5_SHARED_SCREEN_IDS = new Set(["inbox", "conversation", "create-group"]);

function readAppJson() {
  return JSON.parse(readFileSync(appJsonPath, "utf8"));
}

/**
 * Extracts `id` -> `titleKey` from the H5 route catalog.
 *
 * The catalog is authored one `defineRoute({...})` per line, so a per-line regex
 * is exact rather than approximate; a reformat that breaks it also breaks this
 * assertion loudly, which is the safe direction.
 */
function readH5RouteTitleKeys() {
  const source = readFileSync(h5RouteCatalogPath, "utf8");
  const titleKeys = new Map();
  for (const match of source.matchAll(/id:\s*"([^"]+)"[^\n]*?titleKey:\s*"([^"]+)"/gu)) {
    titleKeys.set(match[1], match[2]);
  }
  return titleKeys;
}

test("the composed route set is valid and unique", () => {
  const bundle = loadRuntimeBundle();
  const compose = requireBundleExport(bundle, "composeImMpRoutes");
  const validate = requireBundleExport(bundle, "validateImMpComposedRoutes");

  const composition = compose();
  assert.deepEqual(validate(composition.routes), [], "composed route set must be valid");
  assert.equal(composition.routes.length, 4, "the default slice ships login + three chat screens");

  const ids = composition.routes.map((route) => route.id);
  assert.equal(new Set(ids).size, ids.length, "route ids must be unique");

  // `<surface>.<domain>.<capability>.<screen>` — four segments, lowercase.
  for (const route of composition.routes) {
    assert.match(
      route.id,
      /^[a-z][a-z0-9-]*(\.[a-z0-9-]+){3}$/u,
      `route id ${route.id} must be <surface>.<domain>.<capability>.<screen>`,
    );
    assert.equal(typeof route.titleKey, "string");
    assert.equal(route.titleKey.length > 0, true, `${route.id} must declare a titleKey`);
  }
});

test("app.json is the projection of the route contributions", () => {
  const bundle = loadRuntimeBundle();
  const composition = requireBundleExport(bundle, "composeImMpRoutes")();

  const appJson = readAppJson();
  assert.deepEqual(appJson.pages, composition.appJson.pages, "app.json#pages must be the projection");
  assert.deepEqual(
    appJson.subPackages.map(({ root, pages }) => ({ root, pages })),
    composition.appJson.subPackages.map(({ root, pages }) => ({ root, pages })),
    "app.json#subPackages must be the projection",
  );

  const preloadRoots = composition.appJson.subPackages
    .filter((subpackage) => subpackage.preloadRule === true)
    .map((subpackage) => subpackage.root);
  assert.deepEqual(
    appJson.preloadRule,
    { [bundle.IM_MP_HOME_PAGE_PATH]: { network: "all", packages: preloadRoots } },
    "app.json#preloadRule must be derived from the home page and the preloading subpackages",
  );

  assert.equal(appJson.pages[0], bundle.IM_MP_LOGIN_PAGE_PATH, FIRST_PAGE_INVARIANT);
});

test("the tab bar declaration matches the projection", () => {
  const bundle = loadRuntimeBundle();
  const composition = requireBundleExport(bundle, "composeImMpRoutes")();
  const declaration = requireBundleExport(bundle, "resolveImMpTabBarDeclaration")(composition.tabBar);

  const appJson = readAppJson();
  // WeChat rejects a tabBar with fewer than two items, and `setTabBarItem`
  // throws when app.json declares none — so the two must agree exactly.
  assert.equal(appJson.tabBar !== undefined, declaration.enabled);
  if (!declaration.enabled) {
    assert.equal(composition.tabBar.length < 2, true);
    assert.equal(typeof declaration.reason, "string");
  }
});

test("every projected page has its platform files", () => {
  const appJson = readAppJson();
  const pagePaths = [
    ...appJson.pages,
    ...appJson.subPackages.flatMap((subpackage) =>
      subpackage.pages.map((page) => `${subpackage.root}/${page}`),
    ),
  ];

  for (const pagePath of pagePaths) {
    for (const extension of ["js", "json", "wxml", "wxss"]) {
      const file = path.join(appRoot, "src", `${pagePath}.${extension}`);
      assert.equal(existsSync(file), true, `${pagePath}.${extension} must exist`);
    }
  }
});

test("subpackage contributions carry their subpackage prefix", () => {
  const bundle = loadRuntimeBundle();
  const routes = requireBundleExport(bundle, "listImMpRouteContributions")();
  const subpackage = requireBundleExport(bundle, "IM_MP_CHAT_SUBPACKAGE");

  for (const route of routes) {
    if (route.miniProgram.subpackage) {
      assert.equal(
        route.miniProgram.pagePath.startsWith(`${route.miniProgram.subpackage}/`),
        true,
        `${route.id} pagePath must start with its subpackage root`,
      );
      // A subpackage page cannot also be a root page, and vice versa.
      assert.notEqual(route.miniProgram.rootPackage, true, `${route.id} cannot be root and subpackage`);
    } else {
      assert.equal(
        route.miniProgram.rootPackage,
        true,
        `${route.id} must declare rootPackage or a subpackage`,
      );
    }
  }

  // The inbox is a tab target, so it must be a root page; the platform rejects
  // tab pages placed in a subpackage.
  const inbox = routes.find((route) => route.screen === "inbox");
  assert.notEqual(inbox, undefined);
  assert.equal(inbox.layoutGroup, "main");
  assert.equal(inbox.miniProgram.rootPackage, true);
  assert.equal(inbox.miniProgram.pagePath, bundle.IM_MP_HOME_PAGE_PATH);
  assert.equal(subpackage, "package-chat");
});

test("shared screens keep the H5 route id and title key", () => {
  const h5TitleKeys = readH5RouteTitleKeys();
  assert.equal(h5TitleKeys.size > 10, true, "the H5 route catalog must expose route ids");

  const bundle = loadRuntimeBundle();
  const routes = requireBundleExport(bundle, "listImMpRouteContributions")();

  // H5 is the id authority only for the screens H5 also renders. Its catalog
  // declares `app.communication.chat.{inbox,conversation,create-group}`, and
  // those ids and title keys must be reused verbatim so one screen keeps one id
  // across clients.
  const shared = routes.filter((route) => H5_SHARED_SCREEN_IDS.has(route.screen));
  assert.deepEqual(
    shared.map((route) => route.screen).sort(),
    [...H5_SHARED_SCREEN_IDS].sort(),
    "every H5-shared screen must be contributed by this root",
  );

  for (const route of shared) {
    const h5TitleKey = h5TitleKeys.get(route.id);
    assert.notEqual(
      h5TitleKey,
      undefined,
      `${route.id} must exist in the H5 route catalog so one screen keeps one id across clients`,
    );
    assert.equal(h5TitleKey, route.titleKey, `${route.id} must reuse the H5 title key`);
  }
});

test("the session screen is root-owned and authored here", () => {
  const h5TitleKeys = readH5RouteTitleKeys();
  const bundle = loadRuntimeBundle();
  const routes = requireBundleExport(bundle, "listImMpRouteContributions")();
  const login = routes.find((route) => route.screen === "login");
  assert.notEqual(login, undefined, "the root must contribute the session/login screen");

  // H5 renders no session screen — it authenticates through the IAM H5 surface —
  // so the H5 catalog has no id to share and this root owns the screen. Claiming
  // H5 membership for it would assert a catalog entry that does not exist.
  assert.equal(
    h5TitleKeys.has(login.id),
    false,
    `${login.id} must stay root-owned; H5 has no session screen to share an id with`,
  );

  // Root-owned still means authored: the copy must live in this root's shell
  // locale fragments, so the screen cannot ship a raw message key.
  for (const locale of ["zh-CN", "en-US"]) {
    const fragments = listFiles(
      path.join(appRoot, "packages", "sdkwork-im-mp-shell", "src", "i18n", locale),
      ".ts",
    );
    assert.equal(fragments.length > 0, true, `the shell must author ${locale} fragments`);
    const authored = fragments.map((file) => readFileSync(file, "utf8")).join("\n");
    assert.equal(
      authored.includes(`"${login.titleKey}"`),
      true,
      `the shell ${locale} fragments must author ${login.titleKey}`,
    );
  }
});

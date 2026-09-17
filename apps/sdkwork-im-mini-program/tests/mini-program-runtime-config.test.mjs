/**
 * Materialized runtime configuration contract.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 6 and
 * `ENVIRONMENT_SPEC.md`. The four identity keys are what makes a build
 * self-describing: without them a mini program that quietly points at a dev
 * gateway looks exactly like a correct one.
 *
 * Every assertion here reads the generated `config/mini-program/runtime-env.*.json`
 * files, so it also proves the materializer ran and that
 * `etc/client-env.materialization.json` still declares this surface — the files
 * exist only because that declaration does.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { appRoot, loadRuntimeBundle, requireBundleExport } from "./lib/load-runtime-bundle.mjs";

const DEPLOYMENT_PROFILES = ["standalone", "cloud"];
const ENVIRONMENTS = ["development", "test", "staging", "demo", "production"];
const EXPECTED_PROFILE_IDS = DEPLOYMENT_PROFILES.flatMap((deployment) =>
  ENVIRONMENTS.map((environment) => `${deployment}.${environment}`),
);

/** Keys that must never reach a client bundle. */
const SECRET_KEY_PATTERN = /(SECRET|PASSWORD|TOKEN|PRIVATE_KEY|DATABASE_URL|CREDENTIAL)/u;

const configDir = path.join(appRoot, "config", "mini-program");
const repositoryRoot = path.resolve(appRoot, "..", "..");

function readProfile(profileId) {
  const file = path.join(configDir, `runtime-env.${profileId}.json`);
  assert.equal(existsSync(file), true, `runtime-env.${profileId}.json must be materialized`);
  return JSON.parse(readFileSync(file, "utf8"));
}

function foldOrigin(value) {
  return String(value ?? "").split(";")[0].trim().replace(/\/+$/u, "");
}

test("the surface is declared for env materialization", () => {
  const config = JSON.parse(
    readFileSync(path.join(repositoryRoot, "etc", "client-env.materialization.json"), "utf8"),
  );
  const surface = config.surfaces.find((entry) => entry.id === "sdkwork-im-mini-program");
  assert.notEqual(surface, undefined, "etc/client-env.materialization.json must declare this surface");
  assert.equal(surface.format, "mini-program");
  assert.equal(surface.runtimeTarget, "mini-program");
  assert.equal(surface.root, "apps/sdkwork-im-mini-program");
  for (const key of [
    "SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL",
    "SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL",
    "SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL",
    "SDKWORK_IM_API_BASE_URL",
    "SDKWORK_IAM_APP_API_BASE_URL",
  ]) {
    assert.equal(
      Object.hasOwn(surface.bindings, key),
      true,
      `the surface must materialize ${key}`,
    );
  }
});

test("exactly the declared profiles are materialized", () => {
  const materialized = readdirSync(configDir)
    .map((name) => name.match(/^runtime-env\.(.+)\.json$/u)?.[1])
    .filter(Boolean)
    .sort();
  assert.deepEqual(materialized, [...EXPECTED_PROFILE_IDS].sort());

  // The root's own profile index must not drift from the repository index.
  const deployment = JSON.parse(
    readFileSync(path.join(appRoot, "etc", "sdkwork.deployment.config.json"), "utf8"),
  );
  assert.deepEqual(Object.keys(deployment.profiles).sort(), [...EXPECTED_PROFILE_IDS].sort());
});

test("every profile declares a consistent runtime identity", () => {
  for (const profileId of EXPECTED_PROFILE_IDS) {
    const [deploymentProfile, environment] = profileId.split(".");
    const values = readProfile(profileId);
    const label = `runtime-env.${profileId}.json`;

    // Both spellings are materialized (the shared `SDKWORK_*` and the
    // application-prefixed `SDKWORK_IM_*`); the runtime accepts either, so the
    // two must never disagree.
    for (const [key, expected] of [
      ["SDKWORK_DEPLOYMENT_PROFILE", deploymentProfile],
      ["SDKWORK_IM_DEPLOYMENT_PROFILE", deploymentProfile],
      ["SDKWORK_ENVIRONMENT", environment],
      ["SDKWORK_IM_ENVIRONMENT", environment],
      ["SDKWORK_PROFILE_ID", profileId],
      ["SDKWORK_IM_PROFILE_ID", profileId],
      ["SDKWORK_RUNTIME_TARGET", "mini-program"],
      ["SDKWORK_IM_RUNTIME_TARGET", "mini-program"],
    ]) {
      assert.equal(values[key], expected, `${label} must declare ${key}=${expected}`);
    }
  }
});

test("no profile carries a secret-bearing key", () => {
  for (const profileId of EXPECTED_PROFILE_IDS) {
    for (const key of Object.keys(readProfile(profileId))) {
      assert.doesNotMatch(
        key,
        SECRET_KEY_PATTERN,
        `runtime-env.${profileId}.json must not carry secret-bearing key ${key}`,
      );
    }
  }
});

test("every profile declares usable transport origins", () => {
  for (const profileId of EXPECTED_PROFILE_IDS) {
    const values = readProfile(profileId);
    const label = `runtime-env.${profileId}.json`;

    const apiBaseUrl = foldOrigin(values.SDKWORK_IM_API_BASE_URL);
    assert.match(apiBaseUrl, /^https?:\/\//u, `${label} SDKWORK_IM_API_BASE_URL must be absolute`);

    const gatewayUrl = foldOrigin(values.SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL);
    assert.match(gatewayUrl, /^https?:\/\//u, `${label} gateway URL must be absolute`);

    const iamUrl = foldOrigin(values.SDKWORK_IAM_APP_API_BASE_URL);
    assert.match(iamUrl, /^https?:\/\//u, `${label} SDKWORK_IAM_APP_API_BASE_URL must be absolute`);

    const websocketUrl = foldOrigin(values.SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL);
    assert.match(websocketUrl, /^wss?:\/\//u, `${label} websocket URL must be ws(s)://`);

    // Cloud deployments other than development must be deploy-safe: TLS origins
    // with no loopback host. `cloud.development` is the documented exception
    // (APP_RUNTIME_TOPOLOGY_SPEC section 4.2 binds non-vite dev surfaces to the
    // local gateway process).
    if (values.SDKWORK_DEPLOYMENT_PROFILE === "cloud" && values.SDKWORK_ENVIRONMENT !== "development") {
      for (const [key, value] of [
        ["SDKWORK_IM_API_BASE_URL", apiBaseUrl],
        ["SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL", gatewayUrl],
        ["SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL", websocketUrl],
      ]) {
        assert.match(value, /^https:|^wss:/u, `${label} ${key} must use TLS`);
        assert.doesNotMatch(
          value,
          /(?:127\.0\.0\.1|localhost|0\.0\.0\.0)/u,
          `${label} ${key} must not use a loopback host`,
        );
      }
    }
  }
});

test("the committed build artifacts match one materialized profile", () => {
  const manifest = JSON.parse(
    readFileSync(path.join(appRoot, "src", "runtime", "build-manifest.json"), "utf8"),
  );
  const profileId = `${manifest.deploymentProfile}.${manifest.environment}`;
  assert.equal(manifest.profileId, profileId);
  assert.equal(EXPECTED_PROFILE_IDS.includes(profileId), true, `${profileId} must be a declared profile`);
  assert.equal(manifest.runtimeTarget, "mini-program");
  assert.equal(manifest.platform, "MP_WEIXIN");

  // `src/runtime/runtime-env.js` is what the app actually loads; it must be the
  // profile the manifest names, not a leftover from the previous build.
  const runtimeEnvSource = readFileSync(
    path.join(appRoot, "src", "runtime", "runtime-env.js"),
    "utf8",
  );
  assert.match(runtimeEnvSource, new RegExp(`"SDKWORK_PROFILE_ID": "${profileId}"`, "u"));
});

test("the runtime rejects a profile whose identity keys disagree", () => {
  const bundle = loadRuntimeBundle();
  const validate = requireBundleExport(bundle, "validateImMpRuntimeIdentity");

  const valid = readProfile("standalone.development");
  assert.deepEqual(validate(valid), [], "a materialized profile must validate");

  // One mutated key that no other check depends on reports exactly one issue.
  assert.deepEqual(validate({ ...valid, SDKWORK_RUNTIME_TARGET: "browser" }), [
    'SDKWORK_RUNTIME_TARGET must be mini-program; received "browser"',
  ]);

  // `SDKWORK_PROFILE_ID` is checked against the resolved pair, so mutating it
  // alone is still a single issue.
  assert.deepEqual(validate({ ...valid, SDKWORK_PROFILE_ID: "cloud.production" }), [
    'SDKWORK_PROFILE_ID must be standalone.development; received "cloud.production"',
  ]);

  // An invalid environment cascades: it is rejected AND it stops matching the
  // profile id, so the count is two. Asserting the messages (not just 2) keeps
  // the cascade a documented contract instead of an incidental number.
  assert.deepEqual(validate({ ...valid, SDKWORK_ENVIRONMENT: "nope" }), [
    'SDKWORK_ENVIRONMENT must be one of development, test, staging, demo, production; received "nope"',
    'SDKWORK_PROFILE_ID must be standalone.nope; received "standalone.development"',
  ]);

  assert.equal(validate({}).length, 4, "an empty source must report all four identity keys");
});

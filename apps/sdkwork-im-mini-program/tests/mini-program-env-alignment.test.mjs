/**
 * Cross-client origin alignment.
 *
 * The user-facing goal of this root is a WeChat mini program that is *the same
 * product* as the H5 and PC clients. One checkable half of that is origin
 * agreement: for one deployment profile, every client must resolve the same
 * application API, IAM, and realtime WebSocket origins, or the clients are
 * silently talking to different backends.
 *
 * The comparison is against the H5 surface's materialized `.env.<profileId>`
 * because H5 is the browser surface whose behaviour on device is known, and
 * because both are produced by the same materializer from the same topology.
 *
 * `cloud.development` legitimately differs and is asserted by rule rather than
 * waived: the materializer binds NON-vite development surfaces (this one, and
 * Flutter) to the local gateway process while a vite surface gets the same
 * binding through dev-process env injection instead, and the vite surface
 * scheme-matches its plain-HTTP dev edge for WebSocket URLs while a non-vite
 * surface keeps the TLS edge the topology declares. Both rules are asserted
 * below, so a future change to either one fails here instead of being absorbed.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { appRoot } from "./lib/load-runtime-bundle.mjs";

const repositoryRoot = path.resolve(appRoot, "..", "..");
const miniProgramConfigDir = path.join(appRoot, "config", "mini-program");
const h5Root = path.join(repositoryRoot, "apps", "sdkwork-im-h5");

const DEPLOYMENT_PROFILES = ["standalone", "cloud"];
const ENVIRONMENTS = ["development", "test", "staging", "demo", "production"];
const PROFILE_IDS = DEPLOYMENT_PROFILES.flatMap((deployment) =>
  ENVIRONMENTS.map((environment) => `${deployment}.${environment}`),
);

/** The profile whose dev-local binding is a documented rule, not an exception. */
const DEV_LOCAL_PROFILE_ID = "cloud.development";

/** `[label, mini-program key, H5 key]` pairs that must resolve to one origin. */
const COMPARABLE_ORIGINS = [
  ["application API", "SDKWORK_IM_API_BASE_URL", "VITE_SDKWORK_IM_API_BASE_URL"],
  ["IAM API", "SDKWORK_IAM_APP_API_BASE_URL", "VITE_SDKWORK_IAM_API_BASE_URL"],
  [
    "realtime WebSocket",
    "SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL",
    "VITE_SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL",
  ],
  [
    "platform gateway",
    "SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL",
    "VITE_SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL",
  ],
];

function parseDotenv(source) {
  const values = {};
  for (const line of source.split(/\r?\n/u)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/u);
    if (match) {
      values[match[1]] = match[2].trim();
    }
  }
  return values;
}

/** Folds the cloud multi-origin list to its primary registered origin. */
function foldOrigin(value) {
  return String(value ?? "").split(";")[0].trim().replace(/\/+$/u, "");
}

function readMiniProgramProfile(profileId) {
  return JSON.parse(
    readFileSync(path.join(miniProgramConfigDir, `runtime-env.${profileId}.json`), "utf8"),
  );
}

function readH5Profile(profileId) {
  return parseDotenv(readFileSync(path.join(h5Root, `.env.${profileId}`), "utf8"));
}

test("both surfaces publish the same profile vocabulary", () => {
  for (const profileId of PROFILE_IDS) {
    assert.equal(
      existsSync(path.join(miniProgramConfigDir, `runtime-env.${profileId}.json`)),
      true,
      `mini program is missing ${profileId}`,
    );
    assert.equal(
      existsSync(path.join(h5Root, `.env.${profileId}`)),
      true,
      `H5 is missing ${profileId}; the two clients must ship the same environments`,
    );
  }
});

test("every client resolves the same origins outside cloud development", () => {
  for (const profileId of PROFILE_IDS) {
    if (profileId === DEV_LOCAL_PROFILE_ID) {
      continue;
    }
    const miniProgram = readMiniProgramProfile(profileId);
    const h5 = readH5Profile(profileId);
    for (const [label, miniProgramKey, h5Key] of COMPARABLE_ORIGINS) {
      assert.equal(
        foldOrigin(miniProgram[miniProgramKey]),
        foldOrigin(h5[h5Key]),
        `${profileId} ${label} origin must match the H5 client`,
      );
    }
  }
});

test("cloud development binds this surface to the local gateway by rule", () => {
  const topology = parseDotenv(
    readFileSync(
      path.join(repositoryRoot, "etc", "topology", `${DEV_LOCAL_PROFILE_ID}.env`),
      "utf8",
    ),
  );
  const localGateway = foldOrigin(topology.SDKWORK_LOCAL_PLATFORM_API_GATEWAY_HTTP_URL);
  assert.match(localGateway, /^https?:\/\//u, "the dev profile must declare a local gateway");

  const miniProgram = readMiniProgramProfile(DEV_LOCAL_PROFILE_ID);
  // APP_RUNTIME_TOPOLOGY_SPEC section 4.2: dev:cloud binds every non-vite
  // surface (this one and Flutter) to the local gateway process. The H5 surface
  // instead receives the same binding from the dev command's process env, which
  // is why its checked-in dotenv keeps the domain edge.
  for (const key of [
    "SDKWORK_IM_API_BASE_URL",
    "SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL",
    "SDKWORK_IAM_APP_API_BASE_URL",
  ]) {
    assert.equal(
      foldOrigin(miniProgram[key]),
      localGateway,
      `cloud.development ${key} must resolve to the local gateway`,
    );
  }

  // The topology declares the TLS api edge for realtime; a mini program has no
  // plain-HTTP dev edge of its own to scheme-match, so it keeps the declared
  // edge while the vite surface downgrades to `ws:`.
  const h5 = readH5Profile(DEV_LOCAL_PROFILE_ID);
  const miniProgramWebSocket = new URL(
    foldOrigin(miniProgram.SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL),
  );
  const h5WebSocket = new URL(
    foldOrigin(h5.VITE_SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL),
  );
  assert.equal(
    miniProgramWebSocket.host,
    h5WebSocket.host,
    "cloud.development realtime must ride the same host as the H5 client",
  );
  assert.deepEqual(
    [miniProgramWebSocket.protocol, h5WebSocket.protocol],
    ["wss:", "ws:"],
    "the mini program keeps the declared TLS edge; the vite surface scheme-matches its dev edge",
  );
});

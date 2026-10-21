#!/usr/bin/env node
/**
 * Deployment-to-runtime environment contract for the cloud profile.
 *
 * The Kubernetes manifests are the only deployable source for the cloud
 * topology, so every env name a process reads must exist in a checked-in
 * Secret/ConfigMap, every referenced Secret must be defined, and multi-replica
 * realtime must receive a unique node id and a shared cluster bus.
 *
 * This guard exists because three separate drifts shipped at once:
 * - the Secret exposed `REDIS_URL` while readiness reads `SDKWORK_IM_REDIS_URL`;
 * - every Deployment referenced a per-service Secret that was never defined;
 * - the 3-replica session-gateway had no node id or cluster-bus configuration.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseAllDocuments } from 'yaml';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const cloudRoot = path.join(repoRoot, 'deployments', 'kubernetes', 'cloud');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, ...relativePath.split('/')), 'utf8');
}

function parseDocuments(relativePath) {
  return parseAllDocuments(read(relativePath))
    .map((document) => document.toJS())
    .filter(Boolean);
}

function walkYaml(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkYaml(absolute));
    } else if (entry.name.endsWith('.yaml')) {
      files.push(absolute);
    }
  }
  return files;
}

const secretsBundlePath = 'deployments/kubernetes/cloud/configmaps-and-secrets.yaml';
const secretsBundleDocuments = parseDocuments(secretsBundlePath);
const secrets = new Map();
for (const document of secretsBundleDocuments) {
  if (document.kind === 'Secret') {
    secrets.set(document.metadata?.name, document);
  }
}

const sharedSecret = secrets.get('sdkwork-im-shared-secrets');
assert.ok(sharedSecret, 'sdkwork-im-shared-secrets must be defined');
const sharedKeys = new Set(Object.keys(sharedSecret.stringData ?? {}));

// Names are asserted against the runtime constants below, not restated from
// memory: each entry maps a manifest key to the source file that reads it.
const runtimeEnvContracts = [
  ['SDKWORK_DATABASE_URL', 'crates/sdkwork-im-service-readiness/src/lib.rs'],
  ['SDKWORK_IM_REDIS_URL', 'crates/sdkwork-im-service-readiness/src/lib.rs'],
  ['SDKWORK_IM_JWT_REPLAY_REDIS_URL', 'adapters/redis-cache/src/jwt_replay_store.rs'],
  ['SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET', 'crates/sdkwork-im-service-readiness/src/lib.rs'],
  ['SDKWORK_IM_APP_CONTEXT_JWT_SIGNING_SECRET', 'crates/im-app-context/src/lib.rs'],
  ['SDKWORK_IM_REALTIME_CLUSTER_BUS_URL', 'services/session-gateway/src/runtime_bootstrap.rs'],
  ['SDKWORK_IM_REALTIME_CLUSTER_BUS_SECRET', 'services/session-gateway/src/cluster_route_event_auth.rs'],
];
for (const [envName, sourcePath] of runtimeEnvContracts) {
  const source = read(sourcePath);
  assert.ok(
    source.includes(envName),
    `${sourcePath} must reference ${envName}; otherwise the manifest key is dead config`,
  );
  assert.ok(sharedKeys.has(envName), `shared Secret must provide ${envName}`);
}

for (const legacyKey of ['REDIS_URL', 'JWT_SIGNING_KEY']) {
  assert.ok(
    !sharedKeys.has(legacyKey),
    `shared Secret must not expose legacy key ${legacyKey}; IM reads the namespaced runtime keys`,
  );
}

const deploymentFiles = walkYaml(cloudRoot).filter((file) =>
  /(?:^|[\\/])deployment\.yaml$/u.test(file) || file.endsWith('additional-service-deployments.yaml'),
);

let deploymentCount = 0;
let sessionGatewayDeployment = null;
for (const file of deploymentFiles) {
  const relative = path
    .relative(repoRoot, file)
    .replaceAll('\\', '/');
  const documents = parseDocuments(relative);
  for (const deployment of documents.filter((document) => document?.kind === 'Deployment')) {
    deploymentCount += 1;
    const name = deployment.metadata?.name;
    const podSpec = deployment.spec?.template?.spec ?? {};
    const containers = podSpec.containers ?? [];
    assert.ok(containers.length > 0, `${name} must declare a container`);

    const secretRefs = new Set();
    for (const container of containers) {
      for (const envFrom of container.envFrom ?? []) {
        const secretName = envFrom?.secretRef?.name;
        if (secretName) {
          secretRefs.add(secretName);
        }
      }
    }
    for (const volume of podSpec.volumes ?? []) {
      if (volume?.secret?.secretName) {
        secretRefs.add(volume.secret.secretName);
      }
    }
    assert.ok(
      secretRefs.has('sdkwork-im-shared-secrets'),
      `${name} must mount sdkwork-im-shared-secrets for database/Redis/secret files`,
    );
    for (const secretName of secretRefs) {
      assert.ok(
        secrets.has(secretName),
        `${name} references Secret ${secretName} that is not defined in ${secretsBundlePath}`,
      );
    }

    const env = new Map(
      containers.flatMap((container) =>
        (container.env ?? []).map((entry) => [entry.name, entry]),
      ),
    );
    assert.equal(
      env.get('SDKWORK_IM_ENVIRONMENT')?.value,
      'production',
      `${name} must run with SDKWORK_IM_ENVIRONMENT=production`,
    );
    assert.equal(
      env.get('SDKWORK_IM_DEPLOYMENT_PROFILE')?.value,
      'cloud',
      `${name} must run with SDKWORK_IM_DEPLOYMENT_PROFILE=cloud`,
    );

    if (name === 'session-gateway') {
      sessionGatewayDeployment = { name, deployment, env, secretRefs };
    }
  }
}

assert.ok(deploymentCount >= 11, `expected at least 11 cloud Deployments, found ${deploymentCount}`);
assert.ok(sessionGatewayDeployment, 'session-gateway Deployment must exist');

const sessionGatewayReplicas = sessionGatewayDeployment.deployment.spec?.replicas ?? 1;
if (sessionGatewayReplicas > 1) {
  const nodeId = sessionGatewayDeployment.env.get('SDKWORK_IM_REALTIME_NODE_ID');
  assert.ok(nodeId, 'multi-replica session-gateway must set SDKWORK_IM_REALTIME_NODE_ID');
  assert.equal(
    nodeId.valueFrom?.fieldRef?.fieldPath,
    'metadata.name',
    'realtime node id must be the unique Pod name (Downward API fieldRef metadata.name)',
  );
  const runtimeBootstrap = read('services/session-gateway/src/runtime_bootstrap.rs');
  assert.match(
    runtimeBootstrap,
    /resolve_route_store_redis_url\(\)\.is_some\(\)/u,
    'cluster mode is enabled by a Redis route-store/cluster-bus URL; the shared Secret supplies it',
  );
}

process.stdout.write(
  `cloud runtime env contract passed (${deploymentCount} deployments, ${secrets.size} secrets)\n`,
);

#!/usr/bin/env node
/**
 * Deployment security posture guard.
 *
 * Two regressions shipped in the cloud manifests and are pinned here:
 * - the realtime NetworkPolicy accepted ingress from every namespace
 *   (`namespaceSelector: {}`), letting any Pod bypass the API gateway;
 * - nginx accepted 1100m request bodies while the media service caps request
 *   bodies at 1 MiB, so unauthenticated clients could buffer gigabytes to disk.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseAllDocuments } from 'yaml';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, ...relativePath.split('/')), 'utf8');
}

function parseDocuments(relativePath) {
  return parseAllDocuments(read(relativePath))
    .map((document) => document.toJS())
    .filter(Boolean);
}

const networkPolicyPath = 'deployments/kubernetes/cloud/network-policies.yaml';
const policies = parseDocuments(networkPolicyPath).filter(
  (document) => document.kind === 'NetworkPolicy',
);
assert.ok(policies.length > 0, `${networkPolicyPath} must define NetworkPolicies`);

for (const policy of policies) {
  for (const rule of policy.spec?.ingress ?? []) {
    for (const peer of rule.from ?? []) {
      if (!Object.hasOwn(peer, 'namespaceSelector')) {
        continue;
      }
      const selector = peer.namespaceSelector ?? {};
      assert.ok(
        selector.matchLabels && Object.keys(selector.matchLabels).length > 0,
        `${policy.metadata?.name} must not accept ingress from every namespace`,
      );
    }
  }
}

const sessionGatewayPolicy = policies.find(
  (policy) => policy.metadata?.name === 'session-gateway-ingress',
);
assert.ok(sessionGatewayPolicy, 'session-gateway-ingress NetworkPolicy must exist');
const hasEdgeIngressPeer = (sessionGatewayPolicy.spec?.ingress ?? []).some((rule) =>
  (rule.from ?? []).some(
    (peer) => peer.namespaceSelector?.matchLabels?.['sdkwork.im/edge-ingress'] === 'true',
  ),
);
assert.ok(
  hasEdgeIngressPeer,
  'session-gateway-ingress must only admit namespaces labeled sdkwork.im/edge-ingress=true',
);

const webserverToml = read('deployments/webserver/server.common.toml');
const bodyLimitMatch = webserverToml.match(/clientMaxBodySize\s*=\s*"(\d+)m"/u);
assert.ok(bodyLimitMatch, 'server.common.toml must declare clientMaxBodySize in MiB');
const bodyLimitMib = Number(bodyLimitMatch[1]);
const mediaServiceSource = read('services/media-service/src/lib.rs');
const mediaLimitMatch = mediaServiceSource.match(
  /MEDIA_MAX_REQUEST_BODY_BYTES_MAX:\s*usize\s*=\s*(\d+)(?:\s*\*\s*(\d+))?(?:\s*\*\s*(\d+))?/u,
);
assert.ok(mediaLimitMatch, 'media service must declare a bounded request body limit');
const mediaLimitBytes = mediaLimitMatch
  .slice(1)
  .filter(Boolean)
  .reduce((product, factor) => product * Number(factor), 1);
assert.ok(
  bodyLimitMib * 1024 * 1024 >= mediaLimitBytes,
  'nginx body limit must not be lower than the media service upload limit',
);
assert.ok(
  bodyLimitMib <= 16,
  `nginx body limit ${bodyLimitMib}m exceeds the 16m deployment ceiling`,
);

const generatedConfigs = fs
  .readdirSync(path.join(repoRoot, 'deployments', 'webserver'))
  .filter((name) => name.startsWith('nginx.') && name.endsWith('.conf'));
assert.ok(generatedConfigs.length > 0, 'generated nginx configs must exist');

const limitZoneMatch = webserverToml.match(/zone=(im_[a-z0-9_]+):/u);
assert.ok(limitZoneMatch, 'server.common.toml must declare an http limitReqZone for API ingress');
const limitZone = limitZoneMatch[1];

for (const configName of generatedConfigs) {
  const source = read(`deployments/webserver/${configName}`);
  assert.ok(
    source.includes(`client_max_body_size ${bodyLimitMib}m;`),
    `${configName} must match server.common.toml clientMaxBodySize=${bodyLimitMib}m`,
  );
  assert.ok(
    source.includes(`limit_req_zone $binary_remote_addr zone=${limitZone}:`),
    `${configName} must render the API limit_req_zone from server.common.toml`,
  );
}

for (const snippet of [
  'deployments/webserver/snippets/gateway-api-locations.production.conf',
  'deployments/webserver/snippets/gateway-api-locations.nonproduction.conf',
]) {
  const source = read(snippet);
  assert.ok(
    source.includes(`limit_req zone=${limitZone} burst=`),
    `${snippet} must apply the ${limitZone} request limit to /api/`,
  );
  assert.ok(
    source.includes('limit_req_status 429;'),
    `${snippet} must return 429 (not nginx default 503) when the request limit trips`,
  );
}

process.stdout.write(
  `deployment security posture passed (${policies.length} network policies, ${generatedConfigs.length} nginx configs, body=${bodyLimitMib}m, limit_zone=${limitZone})\n`,
);

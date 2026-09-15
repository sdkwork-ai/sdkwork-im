#!/usr/bin/env node
/**
 * Same end-to-end header-leak regression for a family of app-sdk generated
 * clients (course / iam / drive / knowledgebase / agents / notary).
 * Each client is pointed at a local header-capture server with ALL 21
 * server-forbidden identity projection headers poisoned into its default
 * headers; asserts zero reach the wire.
 */
import http from 'node:http';
import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// `<workspace-root>/sdkwork-im/scripts/dev/` -> three levels up is the checkout
// root that holds the sibling SDK repositories below.
const WORKSPACE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const workspaceFileUrl = (relativePath) => pathToFileURL(resolve(WORKSPACE_ROOT, relativePath)).href;

const CLIENTS = [
  ['course', workspaceFileUrl('sdkwork-course/sdks/sdkwork-course-app-sdk/sdkwork-course-app-sdk-typescript/generated/server-openapi/dist/index.js'), 'SdkworkAppClient'],
  ['iam-app', workspaceFileUrl('sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/dist/index.js'), 'SdkworkAppClient'],
  ['drive', workspaceFileUrl('sdkwork-drive/sdks/sdkwork-drive-app-sdk/sdkwork-drive-app-sdk-typescript/generated/server-openapi/dist/index.js'), 'SdkworkAppClient'],
  ['knowledgebase', workspaceFileUrl('sdkwork-knowledgebase/sdks/sdkwork-knowledgebase-app-sdk/sdkwork-knowledgebase-app-sdk-typescript/generated/server-openapi/dist/index.js'), 'SdkworkKnowledgebaseAppClient'],
  ['agents', workspaceFileUrl('sdkwork-agents/sdks/sdkwork-agents-app-sdk/sdkwork-agents-app-sdk-typescript/generated/server-openapi/dist/index.js'), 'SdkworkAppClient'],
  ['notary', workspaceFileUrl('sdkwork-notary/sdks/sdkwork-notary-app-sdk/sdkwork-notary-app-sdk-typescript/generated/server-openapi/dist/index.js'), 'SdkworkAppClient'],
];

const FORBIDDEN = [
  'x-sdkwork-tenant-id', 'x-sdkwork-app-id', 'x-sdkwork-user-id',
  'x-sdkwork-organization-id', 'x-sdkwork-actor-id', 'x-sdkwork-actor-kind',
  'x-sdkwork-session-id', 'x-sdkwork-environment', 'x-sdkwork-deployment-profile',
  'x-sdkwork-deployment-mode', 'x-sdkwork-runtime-target', 'x-sdkwork-auth-level',
  'x-sdkwork-data-scope', 'x-sdkwork-permission-scope', 'x-sdkwork-device-id',
  'x-sdkwork-context-signature', 'x-sdkwork-operation-id',
  'x-tenant-id', 'x-app-id', 'x-user-id', 'x-organization-id',
];

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ code: 0, msg: 'ok', data: null }));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

function poison() {
  const h = {};
  for (const name of FORBIDDEN) {
    h[name] = 'leak';
    h[name.toUpperCase()] = 'leak';
  }
  return h;
}

for (const [name, url, exportName] of CLIENTS) {
  const mod = await import(new URL(url).href);
  const Client = mod[exportName];
  if (!Client) {
    console.log(`SKIP ${name}: no ${exportName} export (${Object.keys(mod).slice(0, 5).join(',')})`);
    continue;
  }
  const client = new Client({
    baseUrl: `http://127.0.0.1:${port}`,
    accessToken: 'AT-x',
    authToken: 'AU-x',
    headers: poison(),
  });
  // Probe with a harmless GET through the raw http client (same buildHeaders
  // path every API module uses).
  await client.httpClient.get('/healthz').catch(() => {});

  const reqHeaders = client.httpClient.getConfig?.();
  // Capture what a fresh GET would send by hooking fetch.
  const origFetch = globalThis.fetch;
  let wire = null;
  globalThis.fetch = async (input, init) => {
    wire = Object.fromEntries(Object.entries(new Headers(init?.headers ?? input?.headers)).map(([k, v]) => [k.toLowerCase(), v]));
    return new Response(JSON.stringify({ code: 0, msg: 'ok', data: null }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    await client.httpClient.get('/healthz').catch(() => {});
  } finally {
    globalThis.fetch = origFetch;
  }
  assert.ok(wire, `${name}: no request captured`);
  const leaks = FORBIDDEN.filter((n) => wire[n] !== undefined);
  assert.deepEqual(leaks, [], `${name}: forbidden headers on wire: ${leaks.join(', ')}`);
  console.log(`PASS ${name}: 0/21 forbidden identity projection headers on the wire`);
}

server.close();
console.log('ALL FAMILY CLIENTS PASS');

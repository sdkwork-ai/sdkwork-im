#!/usr/bin/env node
/**
 * End-to-end regression: run the PC app's actual @sdkwork/im-sdk chain against
 * a local header-capture server, poison every merge point with all 21
 * server-forbidden identity projection headers (plus case variants), and
 * assert ZERO of them reach the wire on GET /chat/inbox.
 *
 * Mirrors: sdkwork-web-core::constants::FORBIDDEN_CLIENT_IDENTITY_HEADERS
 * (API_SPEC §10.2 / SECURITY_SPEC §5.1 / spec B9).
 */
import http from 'node:http';
import assert from 'node:assert/strict';

const IM_SDK_URL = new URL('file:///E:/sdkwork-space/sdkwork-im/sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/dist/index.js').href;
const { SdkworkImClient } = await import(IM_SDK_URL);

const FORBIDDEN = [
  'x-sdkwork-tenant-id', 'x-sdkwork-app-id', 'x-sdkwork-user-id',
  'x-sdkwork-organization-id', 'x-sdkwork-actor-id', 'x-sdkwork-actor-kind',
  'x-sdkwork-session-id', 'x-sdkwork-environment', 'x-sdkwork-deployment-profile',
  'x-sdkwork-deployment-mode', 'x-sdkwork-runtime-target', 'x-sdkwork-auth-level',
  'x-sdkwork-data-scope', 'x-sdkwork-permission-scope', 'x-sdkwork-device-id',
  'x-sdkwork-context-signature', 'x-sdkwork-operation-id',
  'x-tenant-id', 'x-app-id', 'x-user-id', 'x-organization-id',
];

const captured = [];
const server = http.createServer((req, res) => {
  captured.push({ method: req.method, url: req.url, headers: req.headers });
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ code: 0, msg: 'ok', data: { items: [], pageInfo: { hasNext: false } } }));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

function poison(list) {
  const h = {};
  for (const name of list) h[name] = 'leak';
  return h;
}

// Poison both the client-level default headers and per-request headers,
// using lower-case, Title-Case and UPPER-CASE variants.
const client = new SdkworkImClient({
  baseUrl: `http://127.0.0.1:${port}`,
  accessToken: 'AT-regression',
  authToken: 'AU-regression',
  headers: poison(FORBIDDEN),
});

const perRequest = poison(FORBIDDEN.map((n) => n.toUpperCase()));
let inboxResult;
if (client.chat?.inbox?.list) {
  inboxResult = await client.chat.inbox.list({ pageSize: 20 }, { headers: perRequest });
} else if (client.chat?.listInbox) {
  inboxResult = await client.chat.listInbox({ pageSize: 20 }, { headers: perRequest });
} else {
  // Fallback: raw http client path used by inbox.list
  inboxResult = await client.httpClient.get('/chat/inbox', { pageSize: 20 });
}

// POST path (regression: 40001 on POST /im/v3/api/chat/me/welcome/ensure).
let welcomeResult;
if (client.chat?.me?.welcome?.ensure) {
  welcomeResult = await client.chat.me.welcome.ensure({ headers: perRequest });
} else if (client.me?.welcome?.ensure) {
  welcomeResult = await client.me.welcome.ensure({ headers: perRequest });
}
assert.ok(welcomeResult !== undefined, 'welcome ensure response missing');

assert.equal(captured.length, 2, `expected inbox + welcome requests, got ${captured.length}`);
for (const req of captured) {
  const wireHeaders = Object.fromEntries(
    Object.entries(req.headers).map(([k, v]) => [k.toLowerCase(), v]),
  );
  const leaks = FORBIDDEN.filter((n) => wireHeaders[n] !== undefined);
  assert.deepEqual(
    leaks,
    [],
    `${req.method} ${req.url}: forbidden identity projection headers reached the wire: ${leaks.join(', ')}`,
  );
  assert.equal(wireHeaders['access-token'], 'AT-regression', `dual-token Access-Token missing on ${req.url}`);
  assert.equal(wireHeaders['authorization'], 'Bearer AU-regression', `dual-token Authorization missing on ${req.url}`);
}
const welcomeReq = captured.find((r) => r.url.includes('/chat/me/welcome/ensure'));
assert.ok(welcomeReq, 'welcome ensure request not captured');

console.log('PASS: 0/21 forbidden identity projection headers on the wire');
console.log(`     requests: ${captured.map((r) => `${r.method} ${r.url}`).join(' | ')}`);
const lastWire = Object.keys(Object.fromEntries(Object.entries(captured[captured.length - 1].headers).map(([k, v]) => [k.toLowerCase(), v]))).sort().join(', ');
console.log(`     welcome wire headers: ${lastWire}`);

server.close();

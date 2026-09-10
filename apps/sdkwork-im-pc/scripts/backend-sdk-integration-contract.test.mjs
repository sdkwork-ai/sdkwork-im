import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '..', '..');

function read(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

const backendSdkWrapperSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-admin-core/src/sdk/backendSdkClient.ts',
);
const adminSdkCompatShimSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-pc-admin-sdk/src/backendSdkClient.ts',
);
const coreIndexSource = read('apps/sdkwork-im-pc/packages/sdkwork-im-pc-core/src/index.ts');
const adminCoreSdkIndexSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-admin-core/src/sdk/index.ts',
);
const adminDashboardServiceSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-admin-dashboard/src/services/AdminDashboardService.ts',
);
const infraStatusServiceSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-admin-infrastructure/src/services/InfraStatusService.ts',
);
const adminBillingServiceSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-admin-infrastructure/src/services/AdminBillingService.ts',
);
const adminComplianceServiceSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-admin-operations/src/services/AdminComplianceService.ts',
);
const messageAuditServiceSource = read(
  'apps/sdkwork-im-pc/packages/sdkwork-im-console-communications/src/services/MessageAuditService.ts',
);

assert.match(
  backendSdkWrapperSource,
  /from ['"]@sdkwork\/im-backend-sdk['"]/u,
  'Admin SDK facade must import the generated IM backend SDK package.',
);
assert.match(
  backendSdkWrapperSource,
  /SdkworkImBackendClient/u,
  'Admin SDK facade must expose the product-scoped SdkworkImBackendClient.',
);
assert.match(
  backendSdkWrapperSource,
  /getSdkworkChatGlobalTokenManager/u,
  'Admin backend SDK wrapper must share the runtime global TokenManager.',
);
assert.match(
  backendSdkWrapperSource,
  /createSdkworkChatRequestContextInterceptors/u,
  'Admin backend SDK wrapper must attach dynamic SDKWork AppContext request interceptors.',
);
assert.match(
  backendSdkWrapperSource,
  /VITE_SDKWORK_IM_BACKEND_API_BASE_URL/u,
  'Admin backend SDK wrapper must resolve a backend API base URL surface explicitly.',
);
assert.doesNotMatch(
  backendSdkWrapperSource,
  /\bfetch\s*\(|\b(Authorization|Access-Token|X-API-Key)\b/u,
  'Admin backend SDK wrapper must not use raw HTTP or assemble auth headers manually.',
);
assert.match(
  adminSdkCompatShimSource,
  /export \* from ['"]@sdkwork\/im-admin-core\/sdk['"]/u,
  'The im-pc-admin-sdk backendSdkClient subpath must delegate to the admin-core SDK wrapper.',
);
assert.doesNotMatch(
  coreIndexSource,
  /backendSdkClient/u,
  'PC core package must not export backend SDK wrappers; backend SDK exports belong to im-pc-admin-sdk.',
);
assert.match(
  adminCoreSdkIndexSource,
  /export \* from ['"]\.\/backendSdkClient['"]/u,
  'Admin core sdk subpath must keep a compatibility export for the product backend SDK wrapper.',
);

for (const [label, source] of [
  ['admin dashboard service', adminDashboardServiceSource],
  ['infrastructure status service', infraStatusServiceSource],
  ['admin compliance service', adminComplianceServiceSource],
]) {
  assert.match(
    source,
    /@sdkwork\/im-pc-admin-sdk[\s\S]*getBackendSdkClientWithSession/u,
    `${label} must receive backend/operator data through the im-pc-admin-sdk generated IM backend SDK wrapper.`,
  );
  assert.doesNotMatch(
    source,
    /mock|setTimeout|new Promise\s*\(|\bfetch\s*\(|\b(Authorization|Access-Token|X-API-Key)\b/u,
    `${label} must not keep mock data, fake delay, raw HTTP, or manual auth header logic.`,
  );
}

assert.doesNotMatch(
  adminBillingServiceSource,
  /getBackendSdkClientWithSession|\.admin\.billing\.|mock|setTimeout|new Promise\s*\(|\bfetch\s*\(|\b(Authorization|Access-Token|X-API-Key)\b/u,
  'The admin billing plane was pruned from the backend SDK contract; the billing service must fail closed without issuing requests.',
);
assert.match(
  adminBillingServiceSource,
  /AdminCapabilityUnavailableError/u,
  'The admin billing service must surface the pruned capability as a typed AdminCapabilityUnavailableError.',
);

assert.doesNotMatch(
  messageAuditServiceSource,
  /getBackendSdkClientWithSession|\.audit\.records\.list\s*\(/u,
  'User-facing console message audit service must not consume backend audit records; move audit workflows to admin or add an app-api console contract.',
);

assert.match(adminDashboardServiceSource, /\.ops\.health\.retrieve\s*\(/u);
assert.match(adminDashboardServiceSource, /\.ops\.cluster\.retrieve\s*\(/u);
assert.match(adminDashboardServiceSource, /\.ops\.diagnostics\.retrieve\s*\(/u);
assert.doesNotMatch(
  adminDashboardServiceSource,
  /\.audit\.records\./u,
  'The audit-records capability was pruned from the backend SDK contract; the dashboard anomaly feed must fail closed instead of requesting it.',
);
assert.match(infraStatusServiceSource, /\.ops\.health\.retrieve\s*\(/u);
assert.match(infraStatusServiceSource, /\.ops\.cluster\.retrieve\s*\(/u);
assert.match(infraStatusServiceSource, /\.ops\.diagnostics\.retrieve\s*\(/u);
assert.match(adminComplianceServiceSource, /\.ops\.health\.retrieve\s*\(/u);
assert.doesNotMatch(
  adminComplianceServiceSource,
  /\.audit\.records\./u,
  'The audit-records capability was pruned from the backend SDK contract; the compliance audit log must fail closed instead of requesting it.',
);

console.log('sdkwork im pc backend SDK integration contract passed.');

# Audit

<p class="api-page-intro">
  The audit endpoint verifies the hash chain of the current tenant's audit ledger.
</p>

<div class="api-link-list">
  <a href="/api-reference/backend/ops"><code>Backend Ops</code> Runtime diagnostics and cluster views are documented separately</a>
  <a href="/sdk/backend-sdk"><code>Backend SDK</code> Audit flows belong to <code>sdkwork-im-backend-sdk</code></a>
</div>

<a id="verify-audit-chain"></a>
<section class="api-op">

## `GET /backend/v3/api/audit/verify`

<div class="api-op-header">
  <span class="endpoint-tag endpoint-get">GET</span>
  <code>/backend/v3/api/audit/verify</code>
  <span class="api-op-id">operationId: verify.retrieve</span>
</div>

Verifies the hash chain of the current tenant's audit ledger and returns the chain head and validity result.

<div class="api-meta-grid">
  <div class="api-meta-card"><strong>Security</strong><span>SDKWork dual token + resolved request context</span></div>
  <div class="api-meta-card"><strong>SDK</strong><span>`sdkwork-im-backend-sdk` / audit</span></div>
  <div class="api-meta-card"><strong>Permission</strong><span>`audit.read`</span></div>
  <div class="api-meta-card"><strong>Success</strong><span>`200 AuditChainVerification`</span></div>
</div>

### Response `200`

<ApiSchemaTable schema="AuditChainVerification" />


### Error Responses

| HTTP | `code` | Description |
| --- | --- | --- |
| `401` | `40101` | SDKWork authentication or request-context resolution failed. |
| `403` | `40301` | The caller lacks `audit.read`. |

</section>

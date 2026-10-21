# SDKWork IM Technical Architecture

Status: active
Owner: `im-platform`
Updated: 2026-09-09
Specs: `DOMAIN_SPEC.md`, `API_SPEC.md`, `SDK_SPEC.md`, `DATABASE_SPEC.md`, `SECURITY_SPEC.md`,
`APP_COMPOSITION_SPEC.md`, `DEPLOYMENT_SPEC.md`, `DOCUMENTATION_SPEC.md`,
`ARCHITECTURE_DECISION_SPEC.md`

## 1. Architecture Overview

SDKWork IM is a contract-first, multi-surface communication application. PostgreSQL normalized
state is the only durable business authority. The immutable commit journal records audit and
integration evidence, while transactional outbox/inbox records deliver events. Current state is
never reconstructed from the journal and query correctness never depends on a second persisted model.

```text
PC / H5 / Flutter / integrations
  -> generated IM Open, App, or Backend SDK
  -> standalone gateway or cloud application ingress
  -> sdkwork-web-framework authentication and request context
  -> domain route -> service -> repository
  -> normalized PostgreSQL state + journal evidence + outbox (one transaction)
  -> bounded realtime and integration relays
```

Core principles:

- One domain fact has one write owner and one durable authority.
- IM vocabulary is `Conversation -> Message -> Member -> ReadCursor`.
- All public HTTP behavior is authored in OpenAPI before SDK materialization.
- Lists are tenant-scoped, bounded, and keyset-paged in the data store.
- Cross-domain integrations use public generated SDKs, RPC SDKs, or approved facades.
- Process memory, Redis, browser storage, and device caches are disposable accelerators or bounded
  offline delivery aids, never server business authorities.

## 2. System Boundaries

| Capability | Owner | SDKWork IM responsibility |
| --- | --- | --- |
| Human and channel communication | `sdkwork-im` | Conversation lifecycle, membership, visible Messages, read state, social relationships, delivery, and signaling |
| Identity and access | `sdkwork-iam` / `sdkwork-appbase` | Consume verified identity and permission context; never issue login Sessions or tokens |
| Agent execution | `sdkwork-agents` | Store assignment/dispatch correlation and visible IM Messages only |
| Agent runtime execution | `sdkwork-kernel` through Agents | No direct IM dependency or execution state |
| Files and media objects | `sdkwork-drive` | Store typed Drive references and communication attribution |
| RTC media runtime | `sdkwork-rtc` | Own call signaling and issue scoped handoff credentials |
| Group knowledge content | `sdkwork-knowledgebase` | Own membership authorization and opaque launch-ticket issuance only |

The enforced Agent dependency direction is:

```text
sdkwork-im -> sdkwork-agents -> sdkwork-kernel
```

Agents and Kernel do not import, call, query, or link IM. IM never creates or writes an
`ai_agent_*` table.

## 3. Runtime Modules

| Module | Responsibility |
| --- | --- |
| `sdkwork-api-im-assembly` | Host-neutral composition of IM-owned HTTP routes and approved dependency adapters |
| `sdkwork-api-im-standalone-gateway` | Standalone listener, ingress protection, OpenAPI aggregation, and application routing |
| `session-gateway` | WebSocket lifecycle, authenticated presence, subscriptions, routing, catch-up, and acknowledgements |
| `sdkwork-comms-conversation-service` | Conversation commands and normalized queries for Messages, Members, read state, and personalization |
| `social-service` | Friend, contact, block, external collaboration, and direct-chat relationship state |
| `space-service` | Space, group, channel, membership, invitation, ban, and access-rule state |
| `im-calls-service` | RTC call signaling and scoped credential handoff to `sdkwork-rtc` |
| `streaming-service` | Ordered application-data streams with PostgreSQL compare-and-set state |
| `audit-service` | Immutable compliance evidence and verification/export operations |
| `notification-service` | Durable notification request state; provider delivery requires an authoritative provider worker |
| `automation-service` | Bounded application workflow adapter; Agent execution delegates to `sdkwork-agents` |
| `ops-service` | Health, cluster, operational lag, runtime inspection, diagnostics, and readiness evidence |

Service crates own application behavior. Route crates adapt HTTP. Repositories own bounded database
access. Gateway hosts own listeners and infrastructure, not domain rules.

## 4. Authentication And Request Context

Protected public operations require the SDKWork dual-token model:

```text
Authorization: Bearer <auth-token>
Access-Token: <access-token>
```

`sdkwork-web-framework` validates credentials and resolves a typed `AppContext` containing tenant,
organization, principal, Session, application, device, data scope, and permission scope. Public
clients do not supply identity context headers. Private trusted-edge context is accepted only after
credential validation, signature verification, and removal of client-supplied identity values.
`jti` replay protection and session revocation checks are mandatory in production; startup fails
closed when their configuration is absent.

Every repository predicate and uniqueness boundary includes tenant and organization where the data
is scoped. Resource membership and role checks run before Conversation-bound reads and writes.
Agents, Drive, RTC, and Knowledgebase identifiers are opaque references and are not authorization evidence.

## 5. API And SDK Ownership

| Surface | Prefix | Authored authority | Generated SDK family |
| --- | --- | --- | --- |
| Open API | `/im/v3/api` | `apis/open-api/im/sdkwork-im-im.openapi.yaml` | `sdkwork-im-sdk` |
| App API | `/app/v3/api` | `apis/app-api/communication/sdkwork-im-app-api.openapi.yaml` | `sdkwork-im-app-sdk` |
| Backend API | `/backend/v3/api` | `apis/backend-api/communication/sdkwork-im-backend-api.openapi.yaml` | `sdkwork-im-backend-sdk` |

The [generated HTTP API inventory](../../api-reference.md) is the complete method, path, and
`operationId` catalog. It excludes sibling APIs mounted by a gateway. Authored `apis/` documents are
the review authority; `sdks/*/openapi/` documents and language transports are generated materializations.

Consumers use:

```text
UI -> application service/port -> injected generated SDK client
```

Raw HTTP, manual auth headers, generated transport edits, local SDK forks, and duplicated DTO
authorities are forbidden. Success responses use `SdkWorkApiResponse`; failures use RFC 9457
`ProblemDetail` carrying the standard RFC 9457 fields plus numeric `code`, `traceId`, optional
`i18nKey` and `locale`, and a bounded `errors[]` field-error list.

### 5.1 H5 client composition

The H5 bootstrap constructs one shared IM SDK client and one global IAM `TokenManager`; feature
services obtain those clients from `sdkwork-im-h5-core` or receive a typed port in tests. The mounted
application routes are Chat inbox, Conversation, Workspace Notary, and the Notary workflow routes
declared in `apps/sdkwork-im-h5/src/bootstrap/routes.ts`. The route registry and `ImApp` must change
together.

Chat realtime subscriptions hold reference-counted connection leases. A shared connection is released
only after the last inbox, Conversation, or scope consumer unsubscribes; late connection completion is
generation-fenced. HTTP and realtime display snapshots remain bounded. Contacts and social user search
use cursor pages from `@sdkwork/im-sdk`; direct Conversation creation and friend requests use stable
server identifiers and UUID request keys. Notary uses the approved Notary composed facade and uploads
attachments sequentially within explicit count and size limits.

Feature packages are not release evidence. An unmounted package or a capability without an owner SDK
must not fabricate data or success. The current H5 Organization, Agent lifecycle, QR scanner, legacy
Chat RTC media UI, Message-history search, exact legacy Conversation lookup, clear-history, and favorite
lookup paths are intentionally fail-closed. AI Image/Video/Writing/Music, Voice Synthesis, and Voice
Summary, Calendar, Approval, Attendance, Reports, Cloud Drive, Meeting, Channels, Hardware, Recruitment,
local Knowledge CRUD, Shopping, Checkout, Orders, Payments, Vouchers, Refunds, Fulfillment, Community,
Courses, and Enterprise routes are also fail-closed until their owner SDK clients, permission inheritance,
and route-level end-to-end evidence are composed. The H5 Knowledge package owns no durable Knowledgebase
state and cannot bypass the independent Knowledgebase process or its opaque launch-ticket boundary. H5
transaction packages own no browser-side product, inventory, cart, address, order, payment, voucher,
refund, or fulfillment authority.

Legacy User profile, settings, Moments, Characters, Works, voice, billing, and life-service surfaces share
one unavailable-page boundary and typed service errors; they own no browser business state or synthetic
remote records. The separate legacy User Auth service and page are not part of the release composition and
remain blocked pending IAM security review. Root authentication uses the approved appbase IAM runtime.

## 6. Data Architecture

### 6.1 Normalized authority

The canonical communication chain is:

```text
Conversation
  -> Member
  -> Message (strict message_seq per Conversation)
  -> ReadCursor
```

Typed tables own preferences, visibility, reactions, pins, social relationships, routing,
idempotency, signaling, streams, and delivery state. There is no second Message timeline, generic
JSON business-state snapshot, compatibility view, dual write, or separate persisted query authority.

The [generated database inventory](../../database-design.md) lists every IM-owned table from
`database/contract/table-registry.json`. Field, constraint, index, retention, and migration details
remain authoritative in registry-linked DDL and migration sources.

### 6.2 Mutation transaction

```text
authorize command
  -> lock/read scoped current row
  -> validate idempotency, lifecycle, and version
  -> mutate normalized state
  -> append immutable journal/audit evidence
  -> enqueue required outbox event
  -> commit one PostgreSQL transaction
  -> relay outbox in bounded claimed batches
```

Relay failure cannot roll back committed business state. Outbox claims use bounded batches and
database fencing. Published outbox rows carry a `retention_until` timestamp set at publish time and
are purged by the retention scheduler alongside the journal; rows never published exhaust bounded
retries and terminate in a failed state for operator replay. Startup reads current normalized state
directly and may repopulate disposable caches lazily.

### 6.3 Query and index contract

- Message history orders by `message_seq`, not timestamp.
- Public and interactive pages contain at most 200 items; repositories may fetch one extra row to
  determine continuation.
- Cursor order and tie-break fields are backed by tenant-leading indexes.
- Membership and read-state authorization are bounded indexed lookups.
- Contact results use bounded joins over canonical social state rather than persisted contact copies.
- No repository loads an unbounded result and slices it in a process or client.

### 6.4 Cross-domain data

Cross-domain resources are stored as stable opaque IDs without physical foreign keys to sibling
databases. IM stores no Agent transcript, Drive object metadata authority, RTC provider state, or
Knowledgebase content. Each owner enforces its own lifecycle and deletion policy.

## 7. Realtime And Delivery

The Session Gateway authenticates a WebSocket `auth.init` frame, binds device and Session identity,
and authorizes user or Conversation scopes. Query-string credentials are rejected in production.

Realtime delivery uses ordered sequence windows, bounded catch-up pages, acknowledgements, and
session-scoped disconnect fencing. Redis supports cluster routing, ephemeral presence, and rate
coordination; PostgreSQL remains durable. Conversation message sequence batches are a Redis
accelerator seeded from the PostgreSQL message high-watermark: when a counter is missing (flush,
failover, eviction) it resumes above durable history instead of reissuing sequence numbers.
Redis loss may reduce availability but cannot redefine
Conversation or Message truth. A scope event published on one gateway node discovers subscribed
devices from the shared subscription store and forwards the event over signed per-node cluster-bus
channels to nodes holding the target device routes; devices without a live route recover through
durable device events and history pull.

Client offline stores are principal-scoped and bounded. They may retain a delivery queue or recent
display window but never replace PostgreSQL or merge data across authenticated principals.

## 8. Reliability And Performance

- Idempotent commands bind a stable key to a request hash and reject conflicting reuse.
- Critical lifecycle transitions use unique constraints, row locks, compare-and-set versions, or leases.
- Background workers use fixed batch sizes, lease expiry, bounded retries, dead-letter evidence, and
  low-cardinality telemetry.
- Readiness fails when a required database, migration, schema state, credential validator, or mandatory
  dependency is unavailable.
- Gateway protection applies edge IP and post-auth tenant limits, bounded circuit breakers, request-size
  limits, trusted-proxy validation, and a pre-composed OpenAPI document exposed by the standalone
  gateway; edge aggregation and caching belong to the external platform ingress.
- Million-row operational work must be resumable and database-paged; all-row in-process traversal is
  not a commercially supported path.

### 8.1 Infrastructure probes

Every IM HTTP listener exposes the framework-owned infrastructure surface exactly once:

| Path | Meaning |
| --- | --- |
| `/healthz` | Process liveness only |
| `/livez` | Kubernetes-compatible liveness alias |
| `/readyz` | Traffic admission after every required dependency check passes |
| `/metrics` | Prometheus exposition from the process registry |

The standalone gateway readiness check composes IM database connectivity, configured Redis
dependencies, embedded Agents state, IM Agent dispatch worker health, and realtime plane health.
It also validates the IM schema migration head and, in production-like profiles, the credential
material used to sign and verify IM traffic: the app-context signature secret and JWT signing
secret must be configured, at least 32 characters, and distinct from development fallbacks.
Any required failure returns `503`; dependency URLs, credentials, SQL/provider errors, and internal
topology details are logged only on the server and never returned in the readiness body. No legacy
probe aliases are mounted.

## 9. Security, Privacy, And Observability

- Dual-token validation, token identifier reuse prevention, key rotation, and fail-closed production secrets.
- Tenant, organization, principal-kind, principal-id, membership, role, and permission checks at every boundary.
- Parameterized SQL and typed request decoding; no concatenated user input.
- Prompt, credential, token, private Message, provider failure, and sensitive object data redaction.
- Restricted Kubernetes security context, default-deny network policy, immutable image references, and
  signed release artifacts with checksum, SBOM, and provenance.
- Structured logs, trace propagation, bounded diagnostic windows, readiness, and metrics without tenant,
  principal, Conversation, Message, Session, or provider IDs in metric labels.

## 10. Deployment And Runtime Topology

`sdkwork.app.config.json` declares application identity and release state. `etc/` declares concrete
environment, topology, public origin, bind, and upstream configuration.

- `standalone`: one application ingress assembles IM APIs and approved embedded dependency routes.
- `cloud`: application ingress routes to independently deployed service and dependency authorities.
- Both profiles expose identical IM-owned paths, methods, operation IDs, schemas, auth, and errors.
- PostgreSQL is required for durable production IM state. Redis is required where the selected HA
  topology declares clustered routing or distributed coordination.
- SQLite is not a supported server persistence profile and is not claimed as PostgreSQL-compatible.
  Browser storage is not a substitute for either server persistence or an owner SDK.

The current app publication state is draft. Production claims require direct staging, capacity,
security, HA, recovery, migration, and supply-chain evidence for the exact release artifacts.

## 11. Architecture Decisions

- [Normalized IM authority](../decisions/ADR-20260722-normalized-im-authority.md)
- [IM-to-Agents integration](../decisions/ADR-20260719-im-agents-dispatch.md)
- [Group Knowledgebase authentication boundary](../decisions/ADR-20260716-group-knowledgebase-authentication-boundary.md)
- [Auth context capability composition](../decisions/ADR-20260715-auth-context-capability-composition.md)
- [Communication service naming](../decisions/ADR-20260617-comms-service-naming-boundaries.md)
- [RPC discovery deferral](../decisions/ADR-20260619-im-rpc-discovery-integration-deferred.md)

Historical design files do not override this Canon. A new boundary change requires a new requirement
and ADR with explicit supersession.

## 12. Verification

```bash
node docs/sites/scripts/generate-contract-inventories.mjs --check
pnpm test:normalized-im-authority-standard
pnpm test:database-naming-standard
pnpm test:database-framework-standard
pnpm test:apis-authority-standard
pnpm test:sdkwork-im-open-api-route-coverage
pnpm test:web-framework-standard
pnpm test:iam-auth-integration
pnpm test:rtc-signaling-boundary
pnpm test:rpc-contract
pnpm --dir docs/sites run docs:verify
```

## Shard Index

Every TECH-* shard in this directory:

- [TECH-00-implementation-overview](./TECH-00-implementation-overview.md)
- [TECH-01-implementation](./TECH-01-implementation.md)
- [TECH-02-architecture-standard](./TECH-02-architecture-standard.md)
- [TECH-03-workspace-crate](./TECH-03-workspace-crate.md)
- [TECH-04-link-route-plane](./TECH-04-link-route-plane.md)
- [TECH-06-gateway-api](./TECH-06-gateway-api.md)
- [TECH-06-rtc-boundary](./TECH-06-rtc-boundary.md)
- [TECH-06b-conversation-domain](./TECH-06b-conversation-domain.md)
- [TECH-07-governance](./TECH-07-governance.md)
- [TECH-07a-provider](./TECH-07a-provider.md)
- [TECH-07c-provider-ops](./TECH-07c-provider-ops.md)
- [TECH-07c10-provider-policy](./TECH-07c10-provider-policy.md)
- [TECH-07c11-provider-policy-diff](./TECH-07c11-provider-policy-diff.md)
- [TECH-07c12-provider-policy](./TECH-07c12-provider-policy.md)
- [TECH-07c13-provider](./TECH-07c13-provider.md)
- [TECH-07c14-provider-policy](./TECH-07c14-provider-policy.md)
- [TECH-07c15-provider](./TECH-07c15-provider.md)
- [TECH-07c2-provider](./TECH-07c2-provider.md)
- [TECH-07c3-provider-policy-audit](./TECH-07c3-provider-policy-audit.md)
- [TECH-07c4-provider-policy](./TECH-07c4-provider-policy.md)
- [TECH-07c5-provider-policy](./TECH-07c5-provider-policy.md)
- [TECH-07c6-provider-policy](./TECH-07c6-provider-policy.md)
- [TECH-07c7-provider-policy](./TECH-07c7-provider-policy.md)
- [TECH-07c8-provider-policy](./TECH-07c8-provider-policy.md)
- [TECH-07c9-provider-policy-noop](./TECH-07c9-provider-policy-noop.md)
- [TECH-08-security-saas](./TECH-08-security-saas.md)
- [TECH-09-implementation](./TECH-09-implementation.md)
- [TECH-09a1-implementation-sdk-release-boundaries](./TECH-09a1-implementation-sdk-release-boundaries.md)
- [TECH-09a2-implementation-sdk](./TECH-09a2-implementation-sdk.md)
- [TECH-09a3-implementation-sdk-readme](./TECH-09a3-implementation-sdk-readme.md)
- [TECH-09a4-implementation-sdk-readme](./TECH-09a4-implementation-sdk-readme.md)
- [TECH-09a5-pre-release-capacity-tier-gates](./TECH-09a5-pre-release-capacity-tier-gates.md)
- [TECH-09a6-chat-cli-token-only-contract](./TECH-09a6-chat-cli-token-only-contract.md)
- [TECH-09a7-chat-cli-bearer-normalization](./TECH-09a7-chat-cli-bearer-normalization.md)
- [TECH-09a8-chat-cli-token-claims-boundary](./TECH-09a8-chat-cli-token-claims-boundary.md)
- [TECH-09a9-chat-cli-help-pass-through](./TECH-09a9-chat-cli-help-pass-through.md)
- [TECH-09b1-open-chat-test-gnu-flag](./TECH-09b1-open-chat-test-gnu-flag.md)
- [TECH-09b2-chat-window-gnu-flag](./TECH-09b2-chat-window-gnu-flag.md)
- [TECH-09b3-open-chat-test-special-char](./TECH-09b3-open-chat-test-special-char.md)
- [TECH-09b4-chat-window-special-char](./TECH-09b4-chat-window-special-char.md)
- [TECH-09b5-chat-window-help-gnu](./TECH-09b5-chat-window-help-gnu.md)
- [TECH-09bb-open-chat-test-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09](./TECH-09bb-open-chat-test-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09.md)
- [TECH-09bc-chat-window-gui-cmd-help-gnu-surface-contract-implementation-plan-2026-04-0](./TECH-09bc-chat-window-gui-cmd-help-gnu-surface-contract-implementation-plan-2026-04-0.md)
- [TECH-09bd-chat-window-gui-cmd-label-special-char-contract-implementation-plan-2026-04](./TECH-09bd-chat-window-gui-cmd-label-special-char-contract-implementation-plan-2026-04.md)
- [TECH-09be-chat-window-gui-cmd-gnu-flag-contract-implementation-plan-2026-04-09](./TECH-09be-chat-window-gui-cmd-gnu-flag-contract-implementation-plan-2026-04-09.md)
- [TECH-09bg-status-local-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09](./TECH-09bg-status-local-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09.md)
- [TECH-09bh-principal-profile-runtime-provider-selection-implementation-plan-2026-04-09](./TECH-09bh-principal-profile-runtime-provider-selection-implementation-plan-2026-04-09.md)
- [TECH-09bi-install-deploy-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09](./TECH-09bi-install-deploy-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09.md)
- [TECH-09bj-principal-profile-external-catalog-missing-catalog-unavailable-contract-imp](./TECH-09bj-principal-profile-external-catalog-missing-catalog-unavailable-contract-imp.md)
- [TECH-09bk-principal-profile-provider-health-http-surface-implementation-plan-2026-04](./TECH-09bk-principal-profile-provider-health-http-surface-implementation-plan-2026-04.md)
- [TECH-09bn-step11-tier-gate-doc-state-alignment-implementation-plan-2026-04-09](./TECH-09bn-step11-tier-gate-doc-state-alignment-implementation-plan-2026-04-09.md)
- [TECH-09bo-step11-tier-artifact-root-materialization-implementation-plan-2026-04-09](./TECH-09bo-step11-tier-artifact-root-materialization-implementation-plan-2026-04-09.md)
- [TECH-09bp-step11-tier-machine-readable-evidence-index-implementation-plan-2026-04-09](./TECH-09bp-step11-tier-machine-readable-evidence-index-implementation-plan-2026-04-09.md)
- [TECH-09bq-step11-pre-release-failover-collected-evidence-implementation-plan-2026-04](./TECH-09bq-step11-pre-release-failover-collected-evidence-implementation-plan-2026-04.md)
- [TECH-09br-step11-pre-release-restore-recovery-collected-evidence-implementation-plan](./TECH-09br-step11-pre-release-restore-recovery-collected-evidence-implementation-plan.md)
- [TECH-09bs-step11-pre-release-drain-rebalance-collected-evidence-implementation-plan-2](./TECH-09bs-step11-pre-release-drain-rebalance-collected-evidence-implementation-plan-2.md)
- [TECH-09bt-step11-pre-release-upgrade-rollback-collected-evidence-implementation-plan](./TECH-09bt-step11-pre-release-upgrade-rollback-collected-evidence-implementation-plan.md)
- [TECH-09bu-step11-pre-release-connection-metrics-collected-evidence-implementation-pla](./TECH-09bu-step11-pre-release-connection-metrics-collected-evidence-implementation-pla.md)
- [TECH-09bv-step11-closure-claim-supersession-implementation-plan-2026-04-09](./TECH-09bv-step11-closure-claim-supersession-implementation-plan-2026-04-09.md)
- [TECH-09bw-step11-pre-release-message-metrics-collected-evidence-implementation-plan-2](./TECH-09bw-step11-pre-release-message-metrics-collected-evidence-implementation-plan-2.md)
- [TECH-09bx-step11-pre-release-stream-metrics-collected-evidence-implementation-plan-20](./TECH-09bx-step11-pre-release-stream-metrics-collected-evidence-implementation-plan-20.md)
- [TECH-09by-step11-tier-artifact-root-current-state-assertion-alignment-implementation](./TECH-09by-step11-tier-artifact-root-current-state-assertion-alignment-implementation.md)
- [TECH-09bz-step11-public-index-state-separation-alignment-implementation-plan-2026-04](./TECH-09bz-step11-public-index-state-separation-alignment-implementation-plan-2026-04.md)
- [TECH-09ca-shell-process-identity-portability-implementation-plan-2026-04-09](./TECH-09ca-shell-process-identity-portability-implementation-plan-2026-04-09.md)
- [TECH-09cb-runtime-lifecycle-profile-selection-implementation-plan-2026-04-09](./TECH-09cb-runtime-lifecycle-profile-selection-implementation-plan-2026-04-09.md)
- [TECH-09cc-lifecycle-profile-doc-contract-alignment-implementation-plan-2026-04-09](./TECH-09cc-lifecycle-profile-doc-contract-alignment-implementation-plan-2026-04-09.md)
- [TECH-09ce-restore-runtime-cmd-expected-preview-fingerprint-implementation-plan-2026-0](./TECH-09ce-restore-runtime-cmd-expected-preview-fingerprint-implementation-plan-2026-0.md)
- [TECH-09cf-inspect-runtime-cmd-help-gnu-surface-contract-implementation-plan-2026-04-0](./TECH-09cf-inspect-runtime-cmd-help-gnu-surface-contract-implementation-plan-2026-04-0.md)
- [TECH-09ch-repair-runtime-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09](./TECH-09ch-repair-runtime-cmd-help-gnu-surface-contract-implementation-plan-2026-04-09.md)
- [TECH-09ci-open-chat-test-detached-gui-start-process-fallback-implementation-plan-2026](./TECH-09ci-open-chat-test-detached-gui-start-process-fallback-implementation-plan-2026.md)
- [TECH-09cj-im-social-space-conversation-ddd-implementation-plan-2026-04-09](./TECH-09cj-im-social-space-conversation-ddd-implementation-plan-2026-04-09.md)
- [TECH-10-deployment-releasegovernance](./TECH-10-deployment-releasegovernance.md)
- [TECH-10-implementation-2026-04-05](./TECH-10-implementation-2026-04-05.md)
- [TECH-10-integration-adapter-register](./TECH-10-integration-adapter-register.md)
- [TECH-11-cp11-1a-failover-2026-04-08](./TECH-11-cp11-1a-failover-2026-04-08.md)
- [TECH-11-design](./TECH-11-design.md)
- [TECH-11-optimization-roadmap](./TECH-11-optimization-roadmap.md)
- [TECH-11-performance](./TECH-11-performance.md)
- [TECH-12-cp12-4a-close-error-registry-2026-04-08](./TECH-12-cp12-4a-close-error-registry-2026-04-08.md)
- [TECH-12-optimization-summary](./TECH-12-optimization-summary.md)
- [TECH-12-rtc-design](./TECH-12-rtc-design.md)
- [TECH-12-sdk-cli](./TECH-12-sdk-cli.md)
- [TECH-13-cp13-1a-sdkrelease-2026-04-08](./TECH-13-cp13-1a-sdkrelease-2026-04-08.md)
- [TECH-13-cp13-1b-sdkrelease-schema-2026-04-08](./TECH-13-cp13-1b-sdkrelease-schema-2026-04-08.md)
- [TECH-13-cp13-1c-sdk-readmereleaseboundaries-2026-04-08](./TECH-13-cp13-1c-sdk-readmereleaseboundaries-2026-04-08.md)
- [TECH-13-cp13-1d-sdk-2026-04-08](./TECH-13-cp13-1d-sdk-2026-04-08.md)
- [TECH-13-cp13-1e-sdk-readme-2026-04-08](./TECH-13-cp13-1e-sdk-readme-2026-04-08.md)
- [TECH-13-cp13-1f-sdk-readme-2026-04-08](./TECH-13-cp13-1f-sdk-readme-2026-04-08.md)
- [TECH-13-cp13-1g-sdk-readmereleaseboundaries-2026-04-08](./TECH-13-cp13-1g-sdk-readmereleaseboundaries-2026-04-08.md)
- [TECH-13-cp13-1h-sdk-2026-04-08](./TECH-13-cp13-1h-sdk-2026-04-08.md)
- [TECH-13-cp13-1i-sdk-readme-2026-04-08](./TECH-13-cp13-1i-sdk-readme-2026-04-08.md)
- [TECH-13-cp13-1j-sdk-readme-2026-04-08](./TECH-13-cp13-1j-sdk-readme-2026-04-08.md)
- [TECH-13-pagination-debt-register](./TECH-13-pagination-debt-register.md)
- [TECH-13-release](./TECH-13-release.md)
- [TECH-13-standard](./TECH-13-standard.md)
- [TECH-14-rpc-availability](./TECH-14-rpc-availability.md)
- [TECH-14-standard](./TECH-14-standard.md)
- [TECH-15-standard](./TECH-15-standard.md)
- [TECH-150aa-sdk-container-readme-release-boundarydesign-2026-04-08](./TECH-150aa-sdk-container-readme-release-boundarydesign-2026-04-08.md)
- [TECH-150ab-sdk-release-version-decision-sourcedesign-2026-04-08](./TECH-150ab-sdk-release-version-decision-sourcedesign-2026-04-08.md)
- [TECH-150ac-sdk-leaf-readme-version-decision-sourcedesign-2026-04-08](./TECH-150ac-sdk-leaf-readme-version-decision-sourcedesign-2026-04-08.md)
- [TECH-150ad-sdk-container-readme-version-decision-sourcedesign-2026-04-08](./TECH-150ad-sdk-container-readme-version-decision-sourcedesign-2026-04-08.md)
- [TECH-150ar-pre-release-capacity-tier-gates-design-2026-04-09](./TECH-150ar-pre-release-capacity-tier-gates-design-2026-04-09.md)
- [TECH-150as-chat-cli-token-only-contract-design-2026-04-09](./TECH-150as-chat-cli-token-only-contract-design-2026-04-09.md)
- [TECH-150at-chat-cli-lowercase-bearer-normalization-contract-design-2026-04-09](./TECH-150at-chat-cli-lowercase-bearer-normalization-contract-design-2026-04-09.md)
- [TECH-150au-chat-cli-provided-token-claims-boundary-design-2026-04-09](./TECH-150au-chat-cli-provided-token-claims-boundary-design-2026-04-09.md)
- [TECH-150av-chat-cli-cmd-help-pass-through-contract-design-2026-04-09](./TECH-150av-chat-cli-cmd-help-pass-through-contract-design-2026-04-09.md)
- [TECH-150aw-open-chat-test-cmd-gnu-flag-contract-design-2026-04-09](./TECH-150aw-open-chat-test-cmd-gnu-flag-contract-design-2026-04-09.md)
- [TECH-150ax-chat-window-cmd-gnu-flag-contract-design-2026-04-09](./TECH-150ax-chat-window-cmd-gnu-flag-contract-design-2026-04-09.md)
- [TECH-150ay-open-chat-test-cmd-validation-message-special-char-contract-design-2026-04](./TECH-150ay-open-chat-test-cmd-validation-message-special-char-contract-design-2026-04.md)
- [TECH-150az-chat-window-cmd-message-prefix-special-char-contract-design-2026-04-09](./TECH-150az-chat-window-cmd-message-prefix-special-char-contract-design-2026-04-09.md)
- [TECH-150ba-chat-window-cmd-help-gnu-surface-contract-design-2026-04-09](./TECH-150ba-chat-window-cmd-help-gnu-surface-contract-design-2026-04-09.md)
- [TECH-150bb-open-chat-test-cmd-help-gnu-surface-contract-design-2026-04-09](./TECH-150bb-open-chat-test-cmd-help-gnu-surface-contract-design-2026-04-09.md)
- [TECH-150bc-chat-window-gui-cmd-help-gnu-surface-contract-design-2026-04-09](./TECH-150bc-chat-window-gui-cmd-help-gnu-surface-contract-design-2026-04-09.md)
- [TECH-150bd-chat-window-gui-cmd-label-special-char-contract-design-2026-04-09](./TECH-150bd-chat-window-gui-cmd-label-special-char-contract-design-2026-04-09.md)
- [TECH-150be-chat-window-gui-cmd-gnu-flag-contract-design-2026-04-09](./TECH-150be-chat-window-gui-cmd-gnu-flag-contract-design-2026-04-09.md)
- [TECH-150bg-status-local-cmd-help-gnu-surface-contract-design-2026-04-09](./TECH-150bg-status-local-cmd-help-gnu-surface-contract-design-2026-04-09.md)
- [TECH-150bh-principal-profile-runtime-provider-selection-design-2026-04-09](./TECH-150bh-principal-profile-runtime-provider-selection-design-2026-04-09.md)
- [TECH-150bi-install-deploy-cmd-help-gnu-surface-contract-design-2026-04-09](./TECH-150bi-install-deploy-cmd-help-gnu-surface-contract-design-2026-04-09.md)
- [TECH-150bj-principal-profile-external-catalog-missing-catalog-unavailable-contract-de](./TECH-150bj-principal-profile-external-catalog-missing-catalog-unavailable-contract-de.md)
- [TECH-150bk-principal-profile-provider-health-http-surface-design-2026-04-09](./TECH-150bk-principal-profile-provider-health-http-surface-design-2026-04-09.md)
- [TECH-150bn-step11-tier-gate-doc-state-alignment-design-2026-04-09](./TECH-150bn-step11-tier-gate-doc-state-alignment-design-2026-04-09.md)
- [TECH-150bo-step11-tier-artifact-root-materialization-design-2026-04-09](./TECH-150bo-step11-tier-artifact-root-materialization-design-2026-04-09.md)
- [TECH-150bp-step11-tier-machine-readable-evidence-index-design-2026-04-09](./TECH-150bp-step11-tier-machine-readable-evidence-index-design-2026-04-09.md)
- [TECH-150bq-step11-pre-release-failover-collected-evidence-design-2026-04-09](./TECH-150bq-step11-pre-release-failover-collected-evidence-design-2026-04-09.md)
- [TECH-150br-step11-pre-release-restore-recovery-collected-evidence-design-2026-04-09](./TECH-150br-step11-pre-release-restore-recovery-collected-evidence-design-2026-04-09.md)
- [TECH-150bs-step11-pre-release-drain-rebalance-collected-evidence-design-2026-04-09](./TECH-150bs-step11-pre-release-drain-rebalance-collected-evidence-design-2026-04-09.md)
- [TECH-150bt-step11-pre-release-upgrade-rollback-collected-evidence-design-2026-04-09](./TECH-150bt-step11-pre-release-upgrade-rollback-collected-evidence-design-2026-04-09.md)
- [TECH-150bu-step11-pre-release-connection-metrics-collected-evidence-design-2026-04-09](./TECH-150bu-step11-pre-release-connection-metrics-collected-evidence-design-2026-04-09.md)
- [TECH-150bv-step11-closure-claim-supersession-design-2026-04-09](./TECH-150bv-step11-closure-claim-supersession-design-2026-04-09.md)
- [TECH-150bw-step11-pre-release-message-metrics-collected-evidence-design-2026-04-09](./TECH-150bw-step11-pre-release-message-metrics-collected-evidence-design-2026-04-09.md)
- [TECH-150bx-step11-pre-release-stream-metrics-collected-evidence-design-2026-04-09](./TECH-150bx-step11-pre-release-stream-metrics-collected-evidence-design-2026-04-09.md)
- [TECH-150by-step11-tier-artifact-root-current-state-assertion-alignment-design-2026-04](./TECH-150by-step11-tier-artifact-root-current-state-assertion-alignment-design-2026-04.md)
- [TECH-150bz-step11-public-index-state-separation-alignment-design-2026-04-09](./TECH-150bz-step11-public-index-state-separation-alignment-design-2026-04-09.md)
- [TECH-150ca-shell-process-identity-portability-design-2026-04-09](./TECH-150ca-shell-process-identity-portability-design-2026-04-09.md)
- [TECH-150cb-runtime-lifecycle-profile-selection-design-2026-04-09](./TECH-150cb-runtime-lifecycle-profile-selection-design-2026-04-09.md)
- [TECH-150cc-lifecycle-profile-doc-contract-alignment-design-2026-04-09](./TECH-150cc-lifecycle-profile-doc-contract-alignment-design-2026-04-09.md)
- [TECH-150ce-restore-runtime-cmd-expected-preview-fingerprint-design-2026-04-09](./TECH-150ce-restore-runtime-cmd-expected-preview-fingerprint-design-2026-04-09.md)
- [TECH-150cf-inspect-runtime-cmd-help-gnu-surface-contract-design-2026-04-09](./TECH-150cf-inspect-runtime-cmd-help-gnu-surface-contract-design-2026-04-09.md)
- [TECH-150ch-repair-runtime-cmd-help-gnu-surface-contract-design-2026-04-09](./TECH-150ch-repair-runtime-cmd-help-gnu-surface-contract-design-2026-04-09.md)
- [TECH-150ci-open-chat-test-detached-gui-start-process-fallback-design-2026-04-09](./TECH-150ci-open-chat-test-detached-gui-start-process-fallback-design-2026-04-09.md)
- [TECH-150cj-im-social-space-conversation-ddd-design-2026-04-09](./TECH-150cj-im-social-space-conversation-ddd-design-2026-04-09.md)
- [TECH-151cj-im-benchmark-model-alignment-2026-04-09](./TECH-151cj-im-benchmark-model-alignment-2026-04-09.md)
- [TECH-152cj-current-architecture-as-built-alignment-2026-04-09](./TECH-152cj-current-architecture-as-built-alignment-2026-04-09.md)
- [TECH-152cj-loop14-2026-04-10](./TECH-152cj-loop14-2026-04-10.md)
- [TECH-152cj-loop16-2026-04-10](./TECH-152cj-loop16-2026-04-10.md)
- [TECH-152cj-loop17-2026-04-10](./TECH-152cj-loop17-2026-04-10.md)
- [TECH-152cj-loop18-2026-04-10](./TECH-152cj-loop18-2026-04-10.md)
- [TECH-152cj-loop19-2026-04-10](./TECH-152cj-loop19-2026-04-10.md)
- [TECH-152cj-loop20-2026-04-10](./TECH-152cj-loop20-2026-04-10.md)
- [TECH-152cj-loop21-2026-04-10](./TECH-152cj-loop21-2026-04-10.md)
- [TECH-152cj-loop22-2026-04-10](./TECH-152cj-loop22-2026-04-10.md)
- [TECH-152cj-loop23-2026-04-10](./TECH-152cj-loop23-2026-04-10.md)
- [TECH-152cj-loop26-2026-04-10](./TECH-152cj-loop26-2026-04-10.md)
- [TECH-152cj-loop27-2026-04-10](./TECH-152cj-loop27-2026-04-10.md)
- [TECH-152cj-loop28-2026-04-10](./TECH-152cj-loop28-2026-04-10.md)
- [TECH-152cj-loop29-2026-04-10](./TECH-152cj-loop29-2026-04-10.md)
- [TECH-152cj-loop30-2026-04-10](./TECH-152cj-loop30-2026-04-10.md)
- [TECH-152cj-loop31-2026-04-10](./TECH-152cj-loop31-2026-04-10.md)
- [TECH-152cj-loop32-2026-04-10](./TECH-152cj-loop32-2026-04-10.md)
- [TECH-152cj-loop33-2026-04-10](./TECH-152cj-loop33-2026-04-10.md)
- [TECH-152cj-loop34-2026-04-10](./TECH-152cj-loop34-2026-04-10.md)
- [TECH-152cj-loop35-2026-04-10](./TECH-152cj-loop35-2026-04-10.md)
- [TECH-152cj-loop36-2026-04-10](./TECH-152cj-loop36-2026-04-10.md)
- [TECH-152cj-loop37-2026-04-10](./TECH-152cj-loop37-2026-04-10.md)
- [TECH-152cj-loop38-2026-04-11](./TECH-152cj-loop38-2026-04-11.md)
- [TECH-152cj-loop39-2026-04-11](./TECH-152cj-loop39-2026-04-11.md)
- [TECH-152cj-loop40-2026-04-11](./TECH-152cj-loop40-2026-04-11.md)
- [TECH-152cj-loop41-2026-04-11](./TECH-152cj-loop41-2026-04-11.md)
- [TECH-152cj-loop42-2026-04-11](./TECH-152cj-loop42-2026-04-11.md)
- [TECH-152cj-loop43-2026-04-11](./TECH-152cj-loop43-2026-04-11.md)
- [TECH-152cj-loop44-2026-04-11](./TECH-152cj-loop44-2026-04-11.md)
- [TECH-152cj-loop45-2026-04-11](./TECH-152cj-loop45-2026-04-11.md)
- [TECH-152cj-loop46-2026-04-11](./TECH-152cj-loop46-2026-04-11.md)
- [TECH-152cj-loop47-2026-04-11](./TECH-152cj-loop47-2026-04-11.md)
- [TECH-152cj-loop48-2026-04-11](./TECH-152cj-loop48-2026-04-11.md)
- [TECH-152cj-loop49-2026-04-11](./TECH-152cj-loop49-2026-04-11.md)
- [TECH-152cj-loop50-2026-04-11](./TECH-152cj-loop50-2026-04-11.md)
- [TECH-152cj-loop51-2026-04-11](./TECH-152cj-loop51-2026-04-11.md)
- [TECH-152cj-loop52-2026-04-11](./TECH-152cj-loop52-2026-04-11.md)
- [TECH-152cj-loop53-2026-04-11](./TECH-152cj-loop53-2026-04-11.md)
- [TECH-152cj-loop54-2026-04-11](./TECH-152cj-loop54-2026-04-11.md)
- [TECH-152cj-loop55-2026-04-11](./TECH-152cj-loop55-2026-04-11.md)
- [TECH-152cj-loop56-2026-04-11](./TECH-152cj-loop56-2026-04-11.md)
- [TECH-152cj-loop57-2026-04-11](./TECH-152cj-loop57-2026-04-11.md)
- [TECH-152cj-loop58-2026-04-11](./TECH-152cj-loop58-2026-04-11.md)
- [TECH-152cj-loop59-2026-04-11](./TECH-152cj-loop59-2026-04-11.md)
- [TECH-152cj-loop60-2026-04-11](./TECH-152cj-loop60-2026-04-11.md)
- [TECH-152cj-loop61-2026-04-11](./TECH-152cj-loop61-2026-04-11.md)
- [TECH-152cj-loop62-2026-04-11](./TECH-152cj-loop62-2026-04-11.md)
- [TECH-152cj-loop63-2026-04-11](./TECH-152cj-loop63-2026-04-11.md)
- [TECH-152cj-loop64-2026-04-11](./TECH-152cj-loop64-2026-04-11.md)
- [TECH-152cj-loop65-2026-04-11](./TECH-152cj-loop65-2026-04-11.md)
- [TECH-152cj-loop66-2026-04-11](./TECH-152cj-loop66-2026-04-11.md)
- [TECH-152cj-loop67-2026-04-11](./TECH-152cj-loop67-2026-04-11.md)
- [TECH-152cj-loop68-2026-04-11](./TECH-152cj-loop68-2026-04-11.md)
- [TECH-152cj-loop69-2026-04-11](./TECH-152cj-loop69-2026-04-11.md)
- [TECH-152cj-loop70-2026-04-11](./TECH-152cj-loop70-2026-04-11.md)
- [TECH-152cj-loop71-2026-04-11](./TECH-152cj-loop71-2026-04-11.md)
- [TECH-152cj-loop72-2026-04-11](./TECH-152cj-loop72-2026-04-11.md)
- [TECH-152cj-loop73-2026-04-11](./TECH-152cj-loop73-2026-04-11.md)
- [TECH-152cj-loop74-2026-04-11](./TECH-152cj-loop74-2026-04-11.md)
- [TECH-152cj-loop75-2026-04-11](./TECH-152cj-loop75-2026-04-11.md)
- [TECH-152cj-loop76-2026-04-11](./TECH-152cj-loop76-2026-04-11.md)
- [TECH-152cj-loop77-2026-04-11](./TECH-152cj-loop77-2026-04-11.md)
- [TECH-152cj-loop78-2026-04-11](./TECH-152cj-loop78-2026-04-11.md)
- [TECH-152cj-loop79-2026-04-11](./TECH-152cj-loop79-2026-04-11.md)
- [TECH-152cj-loop80-2026-04-11](./TECH-152cj-loop80-2026-04-11.md)
- [TECH-152cj-loop81-2026-04-11](./TECH-152cj-loop81-2026-04-11.md)
- [TECH-152cj-loop82-2026-04-12](./TECH-152cj-loop82-2026-04-12.md)
- [TECH-152cj-loop83-2026-04-12](./TECH-152cj-loop83-2026-04-12.md)
- [TECH-152cj-loop84-2026-04-12](./TECH-152cj-loop84-2026-04-12.md)
- [TECH-152cj-loop85-2026-04-12](./TECH-152cj-loop85-2026-04-12.md)
- [TECH-152cj-loop86-2026-04-12](./TECH-152cj-loop86-2026-04-12.md)
- [TECH-16-standard](./TECH-16-standard.md)
- [TECH-17-standard](./TECH-17-standard.md)
- [TECH-18-standard](./TECH-18-standard.md)
- [TECH-19-standard](./TECH-19-standard.md)
- [TECH-20-websocket-standard](./TECH-20-websocket-standard.md)
- [TECH-2026-04-05-im-review-and-deployment-hardening](./TECH-2026-04-05-im-review-and-deployment-hardening.md)
- [TECH-2026-04-05-public-bearer-auth-hardening](./TECH-2026-04-05-public-bearer-auth-hardening.md)
- [TECH-2026-04-06-agent-dialog-dedicated-create-review-cycle](./TECH-2026-04-06-agent-dialog-dedicated-create-review-cycle.md)
- [TECH-2026-04-06-agent-handoff-closed-capability-gate-review-cycle](./TECH-2026-04-06-agent-handoff-closed-capability-gate-review-cycle.md)
- [TECH-2026-04-06-agent-handoff-dedicated-create-review-cycle](./TECH-2026-04-06-agent-handoff-dedicated-create-review-cycle.md)
- [TECH-2026-04-06-audit-actor-kind-review-cycle](./TECH-2026-04-06-audit-actor-kind-review-cycle.md)
- [TECH-2026-04-06-chat-cli-wrapper-direct-binary-review-cycle](./TECH-2026-04-06-chat-cli-wrapper-direct-binary-review-cycle.md)
- [TECH-2026-04-06-chat-window-gui-polling-stability-review-cycle](./TECH-2026-04-06-chat-window-gui-polling-stability-review-cycle.md)
- [TECH-2026-04-06-chat-window-gui-utf8-json-review-cycle](./TECH-2026-04-06-chat-window-gui-utf8-json-review-cycle.md)
- [TECH-2026-04-06-conversation-bound-write-capability-actor-kind-review-cycle](./TECH-2026-04-06-conversation-bound-write-capability-actor-kind-review-cycle.md)
- [TECH-2026-04-06-direct-route-rebind-runtime-handoff-review-cycle](./TECH-2026-04-06-direct-route-rebind-runtime-handoff-review-cycle.md)
- [TECH-2026-04-06-disconnect-fence-store-recovery-review-cycle](./TECH-2026-04-06-disconnect-fence-store-recovery-review-cycle.md)
- [TECH-2026-04-06-disconnect-websocket-close-contract-review-cycle](./TECH-2026-04-06-disconnect-websocket-close-contract-review-cycle.md)
- [TECH-2026-04-06-disconnect-websocket-close-review-cycle](./TECH-2026-04-06-disconnect-websocket-close-review-cycle.md)
- [TECH-2026-04-06-duplicate-disconnect-idempotency-review-cycle](./TECH-2026-04-06-duplicate-disconnect-idempotency-review-cycle.md)
- [TECH-2026-04-06-governance-runtime-actor-kind-guard-review-cycle](./TECH-2026-04-06-governance-runtime-actor-kind-guard-review-cycle.md)
- [TECH-2026-04-06-left-rejoin-review-cycle](./TECH-2026-04-06-left-rejoin-review-cycle.md)
- [TECH-2026-04-06-local-chat-cli-multi-terminal-validation-implementation-plan](./TECH-2026-04-06-local-chat-cli-multi-terminal-validation-implementation-plan.md)
- [TECH-2026-04-06-local-chat-cli-multi-terminal-validation-review-cycle](./TECH-2026-04-06-local-chat-cli-multi-terminal-validation-review-cycle.md)
- [TECH-2026-04-06-local-chat-window-launcher-review-cycle](./TECH-2026-04-06-local-chat-window-launcher-review-cycle.md)
- [TECH-2026-04-06-media-idempotency-conflict-review-cycle](./TECH-2026-04-06-media-idempotency-conflict-review-cycle.md)
- [TECH-2026-04-06-member-governance-realtime-fanout-review-cycle](./TECH-2026-04-06-member-governance-realtime-fanout-review-cycle.md)
- [TECH-2026-04-06-message-mutation-actor-kind-guard-review-cycle](./TECH-2026-04-06-message-mutation-actor-kind-guard-review-cycle.md)
- [TECH-2026-04-06-opaque-payload-conversation-id-audit-review-cycle](./TECH-2026-04-06-opaque-payload-conversation-id-audit-review-cycle.md)
- [TECH-2026-04-06-owner-transfer-review-cycle](./TECH-2026-04-06-owner-transfer-review-cycle.md)
- [TECH-2026-04-06-promote-demote-review-cycle](./TECH-2026-04-06-promote-demote-review-cycle.md)
- [TECH-2026-04-06-read-cursor-runtime-actor-kind-guard-review-cycle](./TECH-2026-04-06-read-cursor-runtime-actor-kind-guard-review-cycle.md)
- [TECH-2026-04-06-review-cycle](./TECH-2026-04-06-review-cycle.md)
- [TECH-2026-04-06-special-conversation-creation-review-cycle](./TECH-2026-04-06-special-conversation-creation-review-cycle.md)
- [TECH-2026-04-06-special-conversation-generic-create-freeze-review-cycle](./TECH-2026-04-06-special-conversation-generic-create-freeze-review-cycle.md)
- [TECH-2026-04-06-special-conversation-lifecycle-review-cycle](./TECH-2026-04-06-special-conversation-lifecycle-review-cycle.md)
- [TECH-2026-04-06-stale-route-missing-runtime-takeover-review-cycle](./TECH-2026-04-06-stale-route-missing-runtime-takeover-review-cycle.md)
- [TECH-2026-04-06-standalone-conversation-bound-service-gateway-review-cycle](./TECH-2026-04-06-standalone-conversation-bound-service-gateway-review-cycle.md)
- [TECH-2026-04-06-system-channel-cross-capability-write-gate-review-cycle](./TECH-2026-04-06-system-channel-cross-capability-write-gate-review-cycle.md)
- [TECH-2026-04-06-system-channel-dedicated-create-review-cycle](./TECH-2026-04-06-system-channel-dedicated-create-review-cycle.md)
- [TECH-2026-04-06-system-channel-dedicated-publish-contract-review-cycle](./TECH-2026-04-06-system-channel-dedicated-publish-contract-review-cycle.md)
- [TECH-2026-04-06-windows-visible-chat-gui-review-cycle](./TECH-2026-04-06-windows-visible-chat-gui-review-cycle.md)
- [TECH-2026-04-06](./TECH-2026-04-06.md)
- [TECH-2026-04-08-step11-cp11-1-scenario-catalog](./TECH-2026-04-08-step11-cp11-1-scenario-catalog.md)
- [TECH-2026-04-08-step11-cp11-2-local-quant-baseline](./TECH-2026-04-08-step11-cp11-2-local-quant-baseline.md)
- [TECH-2026-04-08-step11-cp11-3-local-drill-baseline](./TECH-2026-04-08-step11-cp11-3-local-drill-baseline.md)
- [TECH-2026-04-09-craw-chat-admin-design](./TECH-2026-04-09-craw-chat-admin-design.md)
- [TECH-2026-04-09-craw-chat-admin-implementation](./TECH-2026-04-09-craw-chat-admin-implementation.md)
- [TECH-2026-04-09-craw-chat-open-source-docs-site-design](./TECH-2026-04-09-craw-chat-open-source-docs-site-design.md)
- [TECH-2026-04-09-craw-chat-sdk-generation-design](./TECH-2026-04-09-craw-chat-sdk-generation-design.md)
- [TECH-2026-04-09-craw-chat-sdk-generation](./TECH-2026-04-09-craw-chat-sdk-generation.md)
- [TECH-2026-04-10-craw-chat-admin-overview-authenticity](./TECH-2026-04-10-craw-chat-admin-overview-authenticity.md)
- [TECH-2026-04-10-v0-0-1-loop-01](./TECH-2026-04-10-v0-0-1-loop-01.md)
- [TECH-2026-04-10-v0-0-10-loop-10](./TECH-2026-04-10-v0-0-10-loop-10.md)
- [TECH-2026-04-10-v0-0-11-loop-11](./TECH-2026-04-10-v0-0-11-loop-11.md)
- [TECH-2026-04-10-v0-0-12-loop-12](./TECH-2026-04-10-v0-0-12-loop-12.md)
- [TECH-2026-04-10-v0-0-13-loop-13](./TECH-2026-04-10-v0-0-13-loop-13.md)
- [TECH-2026-04-10-v0-0-14-loop-14](./TECH-2026-04-10-v0-0-14-loop-14.md)
- [TECH-2026-04-10-v0-0-16-loop-16](./TECH-2026-04-10-v0-0-16-loop-16.md)
- [TECH-2026-04-10-v0-0-17-loop-17](./TECH-2026-04-10-v0-0-17-loop-17.md)
- [TECH-2026-04-10-v0-0-18-loop-18](./TECH-2026-04-10-v0-0-18-loop-18.md)
- [TECH-2026-04-10-v0-0-19-loop-19](./TECH-2026-04-10-v0-0-19-loop-19.md)
- [TECH-2026-04-10-v0-0-2-loop-02](./TECH-2026-04-10-v0-0-2-loop-02.md)
- [TECH-2026-04-10-v0-0-20-loop-20](./TECH-2026-04-10-v0-0-20-loop-20.md)
- [TECH-2026-04-10-v0-0-21-loop-21](./TECH-2026-04-10-v0-0-21-loop-21.md)
- [TECH-2026-04-10-v0-0-22-loop-22](./TECH-2026-04-10-v0-0-22-loop-22.md)
- [TECH-2026-04-10-v0-0-23-loop-23](./TECH-2026-04-10-v0-0-23-loop-23.md)
- [TECH-2026-04-10-v0-0-26-loop-26](./TECH-2026-04-10-v0-0-26-loop-26.md)
- [TECH-2026-04-10-v0-0-27-loop-27](./TECH-2026-04-10-v0-0-27-loop-27.md)
- [TECH-2026-04-10-v0-0-28-loop-28](./TECH-2026-04-10-v0-0-28-loop-28.md)
- [TECH-2026-04-10-v0-0-29-loop-29](./TECH-2026-04-10-v0-0-29-loop-29.md)
- [TECH-2026-04-10-v0-0-3-loop-03](./TECH-2026-04-10-v0-0-3-loop-03.md)
- [TECH-2026-04-10-v0-0-30-loop-30](./TECH-2026-04-10-v0-0-30-loop-30.md)
- [TECH-2026-04-10-v0-0-31-loop-31](./TECH-2026-04-10-v0-0-31-loop-31.md)
- [TECH-2026-04-10-v0-0-32-loop-32](./TECH-2026-04-10-v0-0-32-loop-32.md)
- [TECH-2026-04-10-v0-0-33-loop-33](./TECH-2026-04-10-v0-0-33-loop-33.md)
- [TECH-2026-04-10-v0-0-34-loop-34](./TECH-2026-04-10-v0-0-34-loop-34.md)
- [TECH-2026-04-10-v0-0-35-loop-35](./TECH-2026-04-10-v0-0-35-loop-35.md)
- [TECH-2026-04-10-v0-0-36-loop-36](./TECH-2026-04-10-v0-0-36-loop-36.md)
- [TECH-2026-04-10-v0-0-37-loop-37](./TECH-2026-04-10-v0-0-37-loop-37.md)
- [TECH-2026-04-10-v0-0-4-loop-04](./TECH-2026-04-10-v0-0-4-loop-04.md)
- [TECH-2026-04-10-v0-0-5-loop-05](./TECH-2026-04-10-v0-0-5-loop-05.md)
- [TECH-2026-04-10-v0-0-6-loop-06](./TECH-2026-04-10-v0-0-6-loop-06.md)
- [TECH-2026-04-10-v0-0-7-loop-07](./TECH-2026-04-10-v0-0-7-loop-07.md)
- [TECH-2026-04-10-v0-0-8-loop-08](./TECH-2026-04-10-v0-0-8-loop-08.md)
- [TECH-2026-04-10-v0-0-9-loop-09](./TECH-2026-04-10-v0-0-9-loop-09.md)
- [TECH-2026-04-11-s05-loop44-closure-and-s07-next-mainline](./TECH-2026-04-11-s05-loop44-closure-and-s07-next-mainline.md)
- [TECH-2026-04-11-v0-0-38-loop-38](./TECH-2026-04-11-v0-0-38-loop-38.md)
- [TECH-2026-04-11-v0-0-39-loop-39](./TECH-2026-04-11-v0-0-39-loop-39.md)
- [TECH-2026-04-11-v0-0-40-loop-40](./TECH-2026-04-11-v0-0-40-loop-40.md)
- [TECH-2026-04-11-v0-0-41-loop-41](./TECH-2026-04-11-v0-0-41-loop-41.md)
- [TECH-2026-04-11-v0-0-42-loop-42](./TECH-2026-04-11-v0-0-42-loop-42.md)
- [TECH-2026-04-11-v0-0-43-loop-43](./TECH-2026-04-11-v0-0-43-loop-43.md)
- [TECH-2026-04-11-v0-0-44-loop-44](./TECH-2026-04-11-v0-0-44-loop-44.md)
- [TECH-2026-04-11-v0-0-45-loop-45](./TECH-2026-04-11-v0-0-45-loop-45.md)
- [TECH-2026-04-11-v0-0-46-loop-46](./TECH-2026-04-11-v0-0-46-loop-46.md)
- [TECH-2026-04-11-v0-0-47-loop-47](./TECH-2026-04-11-v0-0-47-loop-47.md)
- [TECH-2026-04-11-v0-0-48-loop-48](./TECH-2026-04-11-v0-0-48-loop-48.md)
- [TECH-2026-04-11-v0-0-49-loop-49](./TECH-2026-04-11-v0-0-49-loop-49.md)
- [TECH-2026-04-11-v0-0-50-loop-50](./TECH-2026-04-11-v0-0-50-loop-50.md)
- [TECH-2026-04-11-v0-0-51-loop-51](./TECH-2026-04-11-v0-0-51-loop-51.md)
- [TECH-2026-04-11-v0-0-52-loop-52](./TECH-2026-04-11-v0-0-52-loop-52.md)
- [TECH-2026-04-11-v0-0-53-loop-53](./TECH-2026-04-11-v0-0-53-loop-53.md)
- [TECH-2026-04-11-v0-0-54-loop-54](./TECH-2026-04-11-v0-0-54-loop-54.md)
- [TECH-2026-04-11-v0-0-55-loop-55](./TECH-2026-04-11-v0-0-55-loop-55.md)
- [TECH-2026-04-11-v0-0-56-loop-56](./TECH-2026-04-11-v0-0-56-loop-56.md)
- [TECH-2026-04-11-v0-0-57-loop-57](./TECH-2026-04-11-v0-0-57-loop-57.md)
- [TECH-2026-04-11-v0-0-58-loop-58](./TECH-2026-04-11-v0-0-58-loop-58.md)
- [TECH-2026-04-11-v0-0-59-loop-59](./TECH-2026-04-11-v0-0-59-loop-59.md)
- [TECH-2026-04-11-v0-0-60-loop-60](./TECH-2026-04-11-v0-0-60-loop-60.md)
- [TECH-2026-04-11-v0-0-61-loop-61](./TECH-2026-04-11-v0-0-61-loop-61.md)
- [TECH-2026-04-11-v0-0-62-loop-62](./TECH-2026-04-11-v0-0-62-loop-62.md)
- [TECH-2026-04-11-v0-0-63-loop-63](./TECH-2026-04-11-v0-0-63-loop-63.md)
- [TECH-2026-04-11-v0-0-64-loop-64](./TECH-2026-04-11-v0-0-64-loop-64.md)
- [TECH-2026-04-11-v0-0-65-loop-65](./TECH-2026-04-11-v0-0-65-loop-65.md)
- [TECH-2026-04-11-v0-0-66-loop-66](./TECH-2026-04-11-v0-0-66-loop-66.md)
- [TECH-2026-04-11-v0-0-67-loop-67](./TECH-2026-04-11-v0-0-67-loop-67.md)
- [TECH-2026-04-11-v0-0-68-loop-68](./TECH-2026-04-11-v0-0-68-loop-68.md)
- [TECH-2026-04-11-v0-0-69-loop-69](./TECH-2026-04-11-v0-0-69-loop-69.md)
- [TECH-2026-04-11-v0-0-70-loop-70](./TECH-2026-04-11-v0-0-70-loop-70.md)
- [TECH-2026-04-11-v0-0-71-loop-71](./TECH-2026-04-11-v0-0-71-loop-71.md)
- [TECH-2026-04-11-v0-0-72-loop-72](./TECH-2026-04-11-v0-0-72-loop-72.md)
- [TECH-2026-04-11-v0-0-73-loop-73](./TECH-2026-04-11-v0-0-73-loop-73.md)
- [TECH-2026-04-11-v0-0-74-loop-74](./TECH-2026-04-11-v0-0-74-loop-74.md)
- [TECH-2026-04-11-v0-0-75-loop-75](./TECH-2026-04-11-v0-0-75-loop-75.md)
- [TECH-2026-04-11-v0-0-76-loop-76](./TECH-2026-04-11-v0-0-76-loop-76.md)
- [TECH-2026-04-11-v0-0-77-loop-77](./TECH-2026-04-11-v0-0-77-loop-77.md)
- [TECH-2026-04-11-v0-0-78-loop-78](./TECH-2026-04-11-v0-0-78-loop-78.md)
- [TECH-2026-04-11-v0-0-79-loop-79](./TECH-2026-04-11-v0-0-79-loop-79.md)
- [TECH-2026-04-11-v0-0-80-loop-80](./TECH-2026-04-11-v0-0-80-loop-80.md)
- [TECH-2026-04-11-v0-0-81-loop-81](./TECH-2026-04-11-v0-0-81-loop-81.md)
- [TECH-2026-04-12-v0-0-82-loop-82](./TECH-2026-04-12-v0-0-82-loop-82.md)
- [TECH-2026-04-12-v0-0-83-loop-83](./TECH-2026-04-12-v0-0-83-loop-83.md)
- [TECH-2026-04-12-v0-0-84-loop-84](./TECH-2026-04-12-v0-0-84-loop-84.md)
- [TECH-2026-04-12-v0-0-85-loop-85](./TECH-2026-04-12-v0-0-85-loop-85.md)
- [TECH-2026-04-12-v0-0-86-loop-86](./TECH-2026-04-12-v0-0-86-loop-86.md)
- [TECH-2026-04-14-chat-window-real-login-rtc-gui-design](./TECH-2026-04-14-chat-window-real-login-rtc-gui-design.md)
- [TECH-2026-04-14-chat-window-real-login-rtc-gui](./TECH-2026-04-14-chat-window-real-login-rtc-gui.md)
- [TECH-2026-04-14-craw-chat-sdk-multilanguage-expansion-design](./TECH-2026-04-14-craw-chat-sdk-multilanguage-expansion-design.md)
- [TECH-2026-04-14-craw-chat-sdk-multilanguage-expansion](./TECH-2026-04-14-craw-chat-sdk-multilanguage-expansion.md)
- [TECH-2026-04-14-local-disk-persistence-recovery-design](./TECH-2026-04-14-local-disk-persistence-recovery-design.md)
- [TECH-2026-04-14-local-disk-persistence-recovery](./TECH-2026-04-14-local-disk-persistence-recovery.md)
- [TECH-2026-04-14-real-auth-local-im-design](./TECH-2026-04-14-real-auth-local-im-design.md)
- [TECH-2026-04-14-real-auth-local-im](./TECH-2026-04-14-real-auth-local-im.md)
- [TECH-2026-04-15-craw-chat-docs-sdk-polish](./TECH-2026-04-15-craw-chat-docs-sdk-polish.md)
- [TECH-2026-04-15-craw-chat-next-generation-sdk-standard-design](./TECH-2026-04-15-craw-chat-next-generation-sdk-standard-design.md)
- [TECH-2026-04-15-craw-chat-typescript-sdk-next-gen-refactor](./TECH-2026-04-15-craw-chat-typescript-sdk-next-gen-refactor.md)
- [TECH-2026-04-15-typescript-generated-package-install-safety](./TECH-2026-04-15-typescript-generated-package-install-safety.md)
- [TECH-2026-04-16-craw-chat-admin-sdk-standardization-design](./TECH-2026-04-16-craw-chat-admin-sdk-standardization-design.md)
- [TECH-2026-04-16-craw-chat-admin-sdk-standardization](./TECH-2026-04-16-craw-chat-admin-sdk-standardization.md)
- [TECH-2026-04-16-craw-chat-multilanguage-sdk-generator-design](./TECH-2026-04-16-craw-chat-multilanguage-sdk-generator-design.md)
- [TECH-2026-04-16-craw-chat-multilanguage-sdk-generator](./TECH-2026-04-16-craw-chat-multilanguage-sdk-generator.md)
- [TECH-2026-04-16-storage-management-design](./TECH-2026-04-16-storage-management-design.md)
- [TECH-2026-04-16-storage-management-generic-addendum-2](./TECH-2026-04-16-storage-management-generic-addendum-2.md)
- [TECH-2026-04-16-storage-management-generic-addendum](./TECH-2026-04-16-storage-management-generic-addendum.md)
- [TECH-2026-04-16-storage-management](./TECH-2026-04-16-storage-management.md)
- [TECH-2026-04-17-craw-chat-server-installation-and-deployment-design](./TECH-2026-04-17-craw-chat-server-installation-and-deployment-design.md)
- [TECH-2026-04-17-craw-chat-server-installation-and-deployment](./TECH-2026-04-17-craw-chat-server-installation-and-deployment.md)
- [TECH-2026-04-17-craw-chat-unified-api-gateway-design](./TECH-2026-04-17-craw-chat-unified-api-gateway-design.md)
- [TECH-2026-04-17-craw-chat-unified-api-gateway](./TECH-2026-04-17-craw-chat-unified-api-gateway.md)
- [TECH-2026-04-18-sdkwork-rtc-sdk-jdbc-style-standard-design](./TECH-2026-04-18-sdkwork-rtc-sdk-jdbc-style-standard-design.md)
- [TECH-2026-04-18-sdkwork-rtc-sdk-standard-implementation](./TECH-2026-04-18-sdkwork-rtc-sdk-standard-implementation.md)
- [TECH-2026-05-30-craw-chat-openapi-sdk-boundary-redesign-design](./TECH-2026-05-30-craw-chat-openapi-sdk-boundary-redesign-design.md)
- [TECH-2026-06-03-sdkwork-chat-pc-desktop-iam](./TECH-2026-06-03-sdkwork-chat-pc-desktop-iam.md)
- [TECH-2026-06-12-sdkwork-specs-structure-alignment-design](./TECH-2026-06-12-sdkwork-specs-structure-alignment-design.md)
- [TECH-2026-06-12-sdkwork-specs-structure-alignment](./TECH-2026-06-12-sdkwork-specs-structure-alignment.md)
- [TECH-2026-06-14-craw-chat-unified-api-ingress-plan](./TECH-2026-06-14-craw-chat-unified-api-ingress-plan.md)
- [TECH-2026-06-14-craw-chat-unified-web-ingress-design](./TECH-2026-06-14-craw-chat-unified-web-ingress-design.md)
- [TECH-2026-06-15-control-plane-api-split-plan](./TECH-2026-06-15-control-plane-api-split-plan.md)
- [TECH-2026-06-16-im-phase0-approach-a-design](./TECH-2026-06-16-im-phase0-approach-a-design.md)
- [TECH-24-standard](./TECH-24-standard.md)
- [TECH-25-review-2026-04-05](./TECH-25-review-2026-04-05.md)
- [TECH-26-standard-2026-04-05](./TECH-26-standard-2026-04-05.md)
- [TECH-27-trusted-identityboundariesstandard-2026-04-05](./TECH-27-trusted-identityboundariesstandard-2026-04-05.md)
- [TECH-28-2026-04-05](./TECH-28-2026-04-05.md)
- [TECH-29-public-builder-2026-04-05](./TECH-29-public-builder-2026-04-05.md)
- [TECH-30-audit-standard-2026-04-05](./TECH-30-audit-standard-2026-04-05.md)
- [TECH-31-standard-2026-04-05](./TECH-31-standard-2026-04-05.md)
- [TECH-32-standard-2026-04-05](./TECH-32-standard-2026-04-05.md)
- [TECH-33-standard-2026-04-05](./TECH-33-standard-2026-04-05.md)
- [TECH-34-standard-2026-04-05](./TECH-34-standard-2026-04-05.md)
- [TECH-35-standard-2026-04-05](./TECH-35-standard-2026-04-05.md)
- [TECH-36-standard-2026-04-05](./TECH-36-standard-2026-04-05.md)
- [TECH-37-standard-2026-04-05](./TECH-37-standard-2026-04-05.md)
- [TECH-38-rtc-standard-2026-04-05](./TECH-38-rtc-standard-2026-04-05.md)
- [TECH-39-standard-2026-04-05](./TECH-39-standard-2026-04-05.md)
- [TECH-40-standard-2026-04-05](./TECH-40-standard-2026-04-05.md)
- [TECH-41-draining-standard-2026-04-05](./TECH-41-draining-standard-2026-04-05.md)
- [TECH-42-standard-2026-04-05](./TECH-42-standard-2026-04-05.md)
- [TECH-43-checkpoint-standard-2026-04-05](./TECH-43-checkpoint-standard-2026-04-05.md)
- [TECH-44-boundariesstandard-2026-04-05](./TECH-44-boundariesstandard-2026-04-05.md)
- [TECH-45-checkpointstandard-2026-04-05](./TECH-45-checkpointstandard-2026-04-05.md)
- [TECH-46-release-standard-2026-04-05](./TECH-46-release-standard-2026-04-05.md)
- [TECH-47-checkpoint-standard-2026-04-05](./TECH-47-checkpoint-standard-2026-04-05.md)
- [TECH-48-bearer-standard-2026-04-05](./TECH-48-bearer-standard-2026-04-05.md)
- [TECH-49-standard-2026-04-05](./TECH-49-standard-2026-04-05.md)
- [TECH-50-standard-2026-04-05](./TECH-50-standard-2026-04-05.md)
- [TECH-52-rtc-invite-standard-2026-04-06](./TECH-52-rtc-invite-standard-2026-04-06.md)
- [TECH-53-rtc-standard-2026-04-06](./TECH-53-rtc-standard-2026-04-06.md)
- [TECH-54-stream-standard-2026-04-06](./TECH-54-stream-standard-2026-04-06.md)
- [TECH-55-governancedirect-boundariesstandard-2026-04-06](./TECH-55-governancedirect-boundariesstandard-2026-04-06.md)
- [TECH-56-left-standard-2026-04-06](./TECH-56-left-standard-2026-04-06.md)
- [TECH-57-group-owner-transferstandard-2026-04-06](./TECH-57-group-owner-transferstandard-2026-04-06.md)
- [TECH-58-left-rejoin-membership-episodestandard-2026-04-06](./TECH-58-left-rejoin-membership-episodestandard-2026-04-06.md)
- [TECH-59-group-member-role-changestandard-2026-04-06](./TECH-59-group-member-role-changestandard-2026-04-06.md)
- [TECH-60-standard-2026-04-06](./TECH-60-standard-2026-04-06.md)
- [TECH-61-agent-dialog-standard-2026-04-06](./TECH-61-agent-dialog-standard-2026-04-06.md)
- [TECH-62-audit-actor-kind-hardening-standard-2026-04-06](./TECH-62-audit-actor-kind-hardening-standard-2026-04-06.md)
- [TECH-63-system-channel-release-standard-2026-04-06](./TECH-63-system-channel-release-standard-2026-04-06.md)
- [TECH-64-agent-handoff-standard-2026-04-06](./TECH-64-agent-handoff-standard-2026-04-06.md)
- [TECH-65-agent-handoff-standard-2026-04-06](./TECH-65-agent-handoff-standard-2026-04-06.md)
- [TECH-66-agent-handoff-standard-2026-04-06](./TECH-66-agent-handoff-standard-2026-04-06.md)
- [TECH-68-member-governance-realtime-fanout-standard-2026-04-06](./TECH-68-member-governance-realtime-fanout-standard-2026-04-06.md)
- [TECH-69-room-live-chat-game-capability-standard-2026-06-23](./TECH-69-room-live-chat-game-capability-standard-2026-06-23.md)
- [TECH-71-agent-handoff-closed-capability-gate-standard-2026-04-06](./TECH-71-agent-handoff-closed-capability-gate-standard-2026-04-06.md)
- [TECH-72-system-channel-cross-capability-write-gate-standard-2026-04-06](./TECH-72-system-channel-cross-capability-write-gate-standard-2026-04-06.md)
- [TECH-73-system-channel-dedicated-publish-contract-standard-2026-04-06](./TECH-73-system-channel-dedicated-publish-contract-standard-2026-04-06.md)
- [TECH-74-message-mutation-actor-kind-guard-standard-2026-04-06](./TECH-74-message-mutation-actor-kind-guard-standard-2026-04-06.md)
- [TECH-75-local-profile-governance-side-effect-actor-kind-standard-2026-04-06](./TECH-75-local-profile-governance-side-effect-actor-kind-standard-2026-04-06.md)
- [TECH-76-governance-runtime-actor-kind-guard-standard-2026-04-06](./TECH-76-governance-runtime-actor-kind-guard-standard-2026-04-06.md)
- [TECH-77-read-cursor-runtime-actor-kind-guard-standard-2026-04-06](./TECH-77-read-cursor-runtime-actor-kind-guard-standard-2026-04-06.md)
- [TECH-78-conversation-bound-write-capability-actor-kind-standard-2026-04-06](./TECH-78-conversation-bound-write-capability-actor-kind-standard-2026-04-06.md)
- [TECH-79-standalone-conversation-bound-service-gateway-standard-2026-04-06](./TECH-79-standalone-conversation-bound-service-gateway-standard-2026-04-06.md)
- [TECH-80-opaque-business-payload-vs-conversation-binding-standard-2026-04-06](./TECH-80-opaque-business-payload-vs-conversation-binding-standard-2026-04-06.md)
- [TECH-81-media-upload-idempotency-conflict-standard-2026-04-06](./TECH-81-media-upload-idempotency-conflict-standard-2026-04-06.md)
- [TECH-82-direct-route-rebind-runtime-handoff-standard-2026-04-06](./TECH-82-direct-route-rebind-runtime-handoff-standard-2026-04-06.md)
- [TECH-83-stale-route-missing-runtime-takeover-standard-2026-04-06](./TECH-83-stale-route-missing-runtime-takeover-standard-2026-04-06.md)
- [TECH-84-current-session-route-fencing-standard-2026-04-06](./TECH-84-current-session-route-fencing-standard-2026-04-06.md)
- [TECH-90-architecture-step](./TECH-90-architecture-step.md)
- [TECH-91-step-audit](./TECH-91-step-audit.md)
- [TECH-92-step](./TECH-92-step.md)
- [TECH-94-step](./TECH-94-step.md)
- [TECH-95-architecture-standard](./TECH-95-architecture-standard.md)
- [TECH-96-step](./TECH-96-step.md)
- [TECH-97-step-architecture](./TECH-97-step-architecture.md)
- [TECH-98-step-integration-standard](./TECH-98-step-integration-standard.md)
- [TECH-99-step-loop-execution-and-closure-protocol-2026-04-09](./TECH-99-step-loop-execution-and-closure-protocol-2026-04-09.md)
- [TECH-abort-stream](./TECH-abort-stream.md)
- [TECH-accept-agent-handoff](./TECH-accept-agent-handoff.md)
- [TECH-accept-call-session](./TECH-accept-call-session.md)
- [TECH-ack-realtime-events](./TECH-ack-realtime-events.md)
- [TECH-activate-friendship](./TECH-activate-friendship.md)
- [TECH-activate-node](./TECH-activate-node.md)
- [TECH-add-member](./TECH-add-member.md)
- [TECH-admin-storage-contract](./TECH-admin-storage-contract.md)
- [TECH-api-reference](./TECH-api-reference.md)
- [TECH-app-api](./TECH-app-api.md)
- [TECH-app-sdk](./TECH-app-sdk.md)
- [TECH-append-agent-response-frame](./TECH-append-agent-response-frame.md)
- [TECH-append-stream-frame](./TECH-append-stream-frame.md)
- [TECH-apply-shared-channel-policy](./TECH-apply-shared-channel-policy.md)
- [TECH-architecturedesign-2026-04-06](./TECH-architecturedesign-2026-04-06.md)
- [TECH-audit-2](./TECH-audit-2.md)
- [TECH-audit](./TECH-audit.md)
- [TECH-auth-and-client-init](./TECH-auth-and-client-init.md)
- [TECH-auth-and-errors](./TECH-auth-and-errors.md)
- [TECH-automation](./TECH-automation.md)
- [TECH-backend-api](./TECH-backend-api.md)
- [TECH-backend-sdk](./TECH-backend-sdk.md)
- [TECH-bind-direct-chat](./TECH-bind-direct-chat.md)
- [TECH-bind-external-member-link](./TECH-bind-external-member-link.md)
- [TECH-block-user](./TECH-block-user.md)
- [TECH-calls-2](./TECH-calls-2.md)
- [TECH-calls](./TECH-calls.md)
- [TECH-capabilities](./TECH-capabilities.md)
- [TECH-ccp-design-2026-04-06](./TECH-ccp-design-2026-04-06.md)
- [TECH-ccp-releasegovernancedesign-2026-04-06](./TECH-ccp-releasegovernancedesign-2026-04-06.md)
- [TECH-cell-region-design-2026-04-06](./TECH-cell-region-design-2026-04-06.md)
- [TECH-change-member-role](./TECH-change-member-role.md)
- [TECH-changelog](./TECH-changelog.md)
- [TECH-chat-cli-direct-binary-wrapper-standard-2026-04-06](./TECH-chat-cli-direct-binary-wrapper-standard-2026-04-06.md)
- [TECH-chat-window-gui-polling-validation-standard-2026-04-06](./TECH-chat-window-gui-polling-validation-standard-2026-04-06.md)
- [TECH-chat-window-gui-utf8-cli-json-standard-2026-04-06](./TECH-chat-window-gui-utf8-cli-json-standard-2026-04-06.md)
- [TECH-checkpoint-stream](./TECH-checkpoint-stream.md)
- [TECH-claim-pending-shared-channel-sync-targeted](./TECH-claim-pending-shared-channel-sync-targeted.md)
- [TECH-cli-and-scripts](./TECH-cli-and-scripts.md)
- [TECH-cli](./TECH-cli.md)
- [TECH-close-agent-handoff](./TECH-close-agent-handoff.md)
- [TECH-close-error-registry-detailed-recovery-vocabularydesign-2026-04-08](./TECH-close-error-registry-detailed-recovery-vocabularydesign-2026-04-08.md)
- [TECH-complete-agent-response](./TECH-complete-agent-response.md)
- [TECH-complete-agent-tool-call](./TECH-complete-agent-tool-call.md)
- [TECH-complete-stream](./TECH-complete-stream.md)
- [TECH-continuous-optimization-artifact-file-list-contract-2026-04-08](./TECH-continuous-optimization-artifact-file-list-contract-2026-04-08.md)
- [TECH-continuous-optimization-chat-cli-cmd-help-pass-through-contract-2026-04-09-2](./TECH-continuous-optimization-chat-cli-cmd-help-pass-through-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-chat-cli-cmd-help-pass-through-contract-2026-04-09](./TECH-continuous-optimization-chat-cli-cmd-help-pass-through-contract-2026-04-09.md)
- [TECH-continuous-optimization-chat-cli-lowercase-bearer-normalization-contract-2026-04-2](./TECH-continuous-optimization-chat-cli-lowercase-bearer-normalization-contract-2026-04-2.md)
- [TECH-continuous-optimization-chat-cli-lowercase-bearer-normalization-contract-2026-04](./TECH-continuous-optimization-chat-cli-lowercase-bearer-normalization-contract-2026-04.md)
- [TECH-continuous-optimization-chat-cli-provided-token-claims-boundary-2026-04-09-2](./TECH-continuous-optimization-chat-cli-provided-token-claims-boundary-2026-04-09-2.md)
- [TECH-continuous-optimization-chat-cli-provided-token-claims-boundary-2026-04-09](./TECH-continuous-optimization-chat-cli-provided-token-claims-boundary-2026-04-09.md)
- [TECH-continuous-optimization-chat-cli-token-only-contract-2026-04-09-2](./TECH-continuous-optimization-chat-cli-token-only-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-chat-cli-token-only-contract-2026-04-09](./TECH-continuous-optimization-chat-cli-token-only-contract-2026-04-09.md)
- [TECH-continuous-optimization-chat-window-cmd-gnu-flag-contract-2026-04-09-2](./TECH-continuous-optimization-chat-window-cmd-gnu-flag-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-chat-window-cmd-gnu-flag-contract-2026-04-09](./TECH-continuous-optimization-chat-window-cmd-gnu-flag-contract-2026-04-09.md)
- [TECH-continuous-optimization-chat-window-cmd-help-gnu-surface-contract-2026-04-09-2](./TECH-continuous-optimization-chat-window-cmd-help-gnu-surface-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-chat-window-cmd-help-gnu-surface-contract-2026-04-09](./TECH-continuous-optimization-chat-window-cmd-help-gnu-surface-contract-2026-04-09.md)
- [TECH-continuous-optimization-chat-window-cmd-message-prefix-special-char-contract-202-2](./TECH-continuous-optimization-chat-window-cmd-message-prefix-special-char-contract-202-2.md)
- [TECH-continuous-optimization-chat-window-cmd-message-prefix-special-char-contract-202](./TECH-continuous-optimization-chat-window-cmd-message-prefix-special-char-contract-202.md)
- [TECH-continuous-optimization-chat-window-gui-cmd-gnu-flag-contract-2026-04-09-2](./TECH-continuous-optimization-chat-window-gui-cmd-gnu-flag-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-chat-window-gui-cmd-gnu-flag-contract-2026-04-09](./TECH-continuous-optimization-chat-window-gui-cmd-gnu-flag-contract-2026-04-09.md)
- [TECH-continuous-optimization-chat-window-gui-cmd-help-gnu-surface-contract-2026-04-09-2](./TECH-continuous-optimization-chat-window-gui-cmd-help-gnu-surface-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-chat-window-gui-cmd-help-gnu-surface-contract-2026-04-09](./TECH-continuous-optimization-chat-window-gui-cmd-help-gnu-surface-contract-2026-04-09.md)
- [TECH-continuous-optimization-chat-window-gui-cmd-label-special-char-contract-2026-04-2](./TECH-continuous-optimization-chat-window-gui-cmd-label-special-char-contract-2026-04-2.md)
- [TECH-continuous-optimization-chat-window-gui-cmd-label-special-char-contract-2026-04](./TECH-continuous-optimization-chat-window-gui-cmd-label-special-char-contract-2026-04.md)
- [TECH-continuous-optimization-checksum-manifest-contract-2026-04-08](./TECH-continuous-optimization-checksum-manifest-contract-2026-04-08.md)
- [TECH-continuous-optimization-collection-summary-contract-2026-04-08](./TECH-continuous-optimization-collection-summary-contract-2026-04-08.md)
- [TECH-continuous-optimization-collection-summary-slot-consistency-contract-2026-04-08](./TECH-continuous-optimization-collection-summary-slot-consistency-contract-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-bindings-2026-04-08](./TECH-continuous-optimization-control-plane-provider-bindings-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-policy-commit-response-2026-04-08](./TECH-continuous-optimization-control-plane-provider-policy-commit-response-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-policy-diff-2026-04-08](./TECH-continuous-optimization-control-plane-provider-policy-diff-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-policy-error-status-2026-04-08](./TECH-continuous-optimization-control-plane-provider-policy-error-status-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-policy-error-vocabulary-2026-04-0](./TECH-continuous-optimization-control-plane-provider-policy-error-vocabulary-2026-04-0.md)
- [TECH-continuous-optimization-control-plane-provider-policy-history-diff-rollback-stat](./TECH-continuous-optimization-control-plane-provider-policy-history-diff-rollback-stat.md)
- [TECH-continuous-optimization-control-plane-provider-policy-noop-2026-04-08](./TECH-continuous-optimization-control-plane-provider-policy-noop-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-policy-preview-2026-04-08](./TECH-continuous-optimization-control-plane-provider-policy-preview-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-policy-preview-confirmation-2026](./TECH-continuous-optimization-control-plane-provider-policy-preview-confirmation-2026.md)
- [TECH-continuous-optimization-control-plane-provider-policy-status-2026-04-08](./TECH-continuous-optimization-control-plane-provider-policy-status-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-policy-version-and-rollback-2026](./TECH-continuous-optimization-control-plane-provider-policy-version-and-rollback-2026.md)
- [TECH-continuous-optimization-control-plane-provider-policy-write-and-audit-2026-04-08](./TECH-continuous-optimization-control-plane-provider-policy-write-and-audit-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-snapshot-status-2026-04-08](./TECH-continuous-optimization-control-plane-provider-snapshot-status-2026-04-08.md)
- [TECH-continuous-optimization-control-plane-provider-status-matrix-2026-04-08](./TECH-continuous-optimization-control-plane-provider-status-matrix-2026-04-08.md)
- [TECH-continuous-optimization-detailed-recovery-registry-baseline-2026-04-08](./TECH-continuous-optimization-detailed-recovery-registry-baseline-2026-04-08.md)
- [TECH-continuous-optimization-evidence-artifact-root-contract-2026-04-08](./TECH-continuous-optimization-evidence-artifact-root-contract-2026-04-08.md)
- [TECH-continuous-optimization-evidence-slot-metadata-contract-2026-04-08](./TECH-continuous-optimization-evidence-slot-metadata-contract-2026-04-08.md)
- [TECH-continuous-optimization-evidence-slot-size-bytes-contract-2026-04-08](./TECH-continuous-optimization-evidence-slot-size-bytes-contract-2026-04-08.md)
- [TECH-continuous-optimization-evidence-slot-suggested-path-contract-2026-04-08](./TECH-continuous-optimization-evidence-slot-suggested-path-contract-2026-04-08.md)
- [TECH-continuous-optimization-inspect-runtime-cmd-help-gnu-surface-contract-2026-04-09-2](./TECH-continuous-optimization-inspect-runtime-cmd-help-gnu-surface-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-inspect-runtime-cmd-help-gnu-surface-contract-2026-04-09](./TECH-continuous-optimization-inspect-runtime-cmd-help-gnu-surface-contract-2026-04-09.md)
- [TECH-continuous-optimization-install-deploy-cmd-help-gnu-surface-contract-2026-04-09-2](./TECH-continuous-optimization-install-deploy-cmd-help-gnu-surface-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-install-deploy-cmd-help-gnu-surface-contract-2026-04-09](./TECH-continuous-optimization-install-deploy-cmd-help-gnu-surface-contract-2026-04-09.md)
- [TECH-continuous-optimization-lifecycle-profile-doc-contract-alignment-2026-04-09-2](./TECH-continuous-optimization-lifecycle-profile-doc-contract-alignment-2026-04-09-2.md)
- [TECH-continuous-optimization-lifecycle-profile-doc-contract-alignment-2026-04-09](./TECH-continuous-optimization-lifecycle-profile-doc-contract-alignment-2026-04-09.md)
- [TECH-continuous-optimization-open-chat-test-cmd-gnu-flag-contract-2026-04-09-2](./TECH-continuous-optimization-open-chat-test-cmd-gnu-flag-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-open-chat-test-cmd-gnu-flag-contract-2026-04-09](./TECH-continuous-optimization-open-chat-test-cmd-gnu-flag-contract-2026-04-09.md)
- [TECH-continuous-optimization-open-chat-test-cmd-help-gnu-surface-contract-2026-04-09-2](./TECH-continuous-optimization-open-chat-test-cmd-help-gnu-surface-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-open-chat-test-cmd-help-gnu-surface-contract-2026-04-09](./TECH-continuous-optimization-open-chat-test-cmd-help-gnu-surface-contract-2026-04-09.md)
- [TECH-continuous-optimization-open-chat-test-cmd-validation-message-special-char-contr-2](./TECH-continuous-optimization-open-chat-test-cmd-validation-message-special-char-contr-2.md)
- [TECH-continuous-optimization-open-chat-test-cmd-validation-message-special-char-contr](./TECH-continuous-optimization-open-chat-test-cmd-validation-message-special-char-contr.md)
- [TECH-continuous-optimization-open-chat-test-detached-gui-start-process-fallback-2026-2](./TECH-continuous-optimization-open-chat-test-detached-gui-start-process-fallback-2026-2.md)
- [TECH-continuous-optimization-open-chat-test-detached-gui-start-process-fallback-2026](./TECH-continuous-optimization-open-chat-test-detached-gui-start-process-fallback-2026.md)
- [TECH-continuous-optimization-operator-recovery-and-bash-scripted-validation-2026-04-0](./TECH-continuous-optimization-operator-recovery-and-bash-scripted-validation-2026-04-0.md)
- [TECH-continuous-optimization-ops-provider-binding-drift-2026-04-08](./TECH-continuous-optimization-ops-provider-binding-drift-2026-04-08.md)
- [TECH-continuous-optimization-ops-provider-bindings-runtime-consumption-2026-04-08](./TECH-continuous-optimization-ops-provider-bindings-runtime-consumption-2026-04-08.md)
- [TECH-continuous-optimization-pre-release-capacity-tier-gates-2026-04-09-2](./TECH-continuous-optimization-pre-release-capacity-tier-gates-2026-04-09-2.md)
- [TECH-continuous-optimization-pre-release-capacity-tier-gates-2026-04-09](./TECH-continuous-optimization-pre-release-capacity-tier-gates-2026-04-09.md)
- [TECH-continuous-optimization-principal-profile-external-catalog-missing-catalog-unava-2](./TECH-continuous-optimization-principal-profile-external-catalog-missing-catalog-unava-2.md)
- [TECH-continuous-optimization-principal-profile-external-catalog-missing-catalog-unava](./TECH-continuous-optimization-principal-profile-external-catalog-missing-catalog-unava.md)
- [TECH-continuous-optimization-principal-profile-provider-health-http-surface-2026-04-0-2](./TECH-continuous-optimization-principal-profile-provider-health-http-surface-2026-04-0-2.md)
- [TECH-continuous-optimization-principal-profile-provider-health-http-surface-2026-04-0](./TECH-continuous-optimization-principal-profile-provider-health-http-surface-2026-04-0.md)
- [TECH-continuous-optimization-principal-profile-runtime-provider-selection-2026-04-09-2](./TECH-continuous-optimization-principal-profile-runtime-provider-selection-2026-04-09-2.md)
- [TECH-continuous-optimization-principal-profile-runtime-provider-selection-2026-04-09](./TECH-continuous-optimization-principal-profile-runtime-provider-selection-2026-04-09.md)
- [TECH-continuous-optimization-release-bundle-archive-convention-2026-04-08](./TECH-continuous-optimization-release-bundle-archive-convention-2026-04-08.md)
- [TECH-continuous-optimization-release-bundle-evidence-index-schema-2026-04-08](./TECH-continuous-optimization-release-bundle-evidence-index-schema-2026-04-08.md)
- [TECH-continuous-optimization-repair-runtime-cmd-help-gnu-surface-contract-2026-04-09-2](./TECH-continuous-optimization-repair-runtime-cmd-help-gnu-surface-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-repair-runtime-cmd-help-gnu-surface-contract-2026-04-09](./TECH-continuous-optimization-repair-runtime-cmd-help-gnu-surface-contract-2026-04-09.md)
- [TECH-continuous-optimization-restore-runtime-cmd-expected-preview-fingerprint-2026-04-2](./TECH-continuous-optimization-restore-runtime-cmd-expected-preview-fingerprint-2026-04-2.md)
- [TECH-continuous-optimization-restore-runtime-cmd-expected-preview-fingerprint-2026-04](./TECH-continuous-optimization-restore-runtime-cmd-expected-preview-fingerprint-2026-04.md)
- [TECH-continuous-optimization-rtc-aliyun-tencent-adapters-2026-04-08](./TECH-continuous-optimization-rtc-aliyun-tencent-adapters-2026-04-08.md)
- [TECH-continuous-optimization-rtc-provider-callback-artifact-surface-2026-04-08](./TECH-continuous-optimization-rtc-provider-callback-artifact-surface-2026-04-08.md)
- [TECH-continuous-optimization-rtc-provider-http-surface-2026-04-08](./TECH-continuous-optimization-rtc-provider-http-surface-2026-04-08.md)
- [TECH-continuous-optimization-runtime-lifecycle-profile-selection-2026-04-09-2](./TECH-continuous-optimization-runtime-lifecycle-profile-selection-2026-04-09-2.md)
- [TECH-continuous-optimization-runtime-lifecycle-profile-selection-2026-04-09](./TECH-continuous-optimization-runtime-lifecycle-profile-selection-2026-04-09.md)
- [TECH-continuous-optimization-runtime-ops-status-profile-and-ps1-smoke-2026-04-08](./TECH-continuous-optimization-runtime-ops-status-profile-and-ps1-smoke-2026-04-08.md)
- [TECH-continuous-optimization-sdk-container-readmes-release-boundary-2026-04-08](./TECH-continuous-optimization-sdk-container-readmes-release-boundary-2026-04-08.md)
- [TECH-continuous-optimization-sdk-container-readmes-version-decision-source-2026-04-08](./TECH-continuous-optimization-sdk-container-readmes-version-decision-source-2026-04-08.md)
- [TECH-continuous-optimization-sdk-container-readmes-version-placeholder-2026-04-08](./TECH-continuous-optimization-sdk-container-readmes-version-placeholder-2026-04-08.md)
- [TECH-continuous-optimization-sdk-leaf-readmes-release-boundary-2026-04-08](./TECH-continuous-optimization-sdk-leaf-readmes-release-boundary-2026-04-08.md)
- [TECH-continuous-optimization-sdk-leaf-readmes-version-decision-source-2026-04-08](./TECH-continuous-optimization-sdk-leaf-readmes-version-decision-source-2026-04-08.md)
- [TECH-continuous-optimization-sdk-leaf-readmes-version-placeholder-2026-04-08](./TECH-continuous-optimization-sdk-leaf-readmes-version-placeholder-2026-04-08.md)
- [TECH-continuous-optimization-sdk-release-catalog-2026-04-08](./TECH-continuous-optimization-sdk-release-catalog-2026-04-08.md)
- [TECH-continuous-optimization-sdk-release-catalog-schema-2026-04-08](./TECH-continuous-optimization-sdk-release-catalog-schema-2026-04-08.md)
- [TECH-continuous-optimization-sdk-release-version-decision-source-2026-04-08](./TECH-continuous-optimization-sdk-release-version-decision-source-2026-04-08.md)
- [TECH-continuous-optimization-sdk-release-version-placeholder-2026-04-08](./TECH-continuous-optimization-sdk-release-version-placeholder-2026-04-08.md)
- [TECH-continuous-optimization-shell-process-identity-portability-2026-04-09-2](./TECH-continuous-optimization-shell-process-identity-portability-2026-04-09-2.md)
- [TECH-continuous-optimization-shell-process-identity-portability-2026-04-09](./TECH-continuous-optimization-shell-process-identity-portability-2026-04-09.md)
- [TECH-continuous-optimization-single-validation-index-2026-04-08](./TECH-continuous-optimization-single-validation-index-2026-04-08.md)
- [TECH-continuous-optimization-status-local-cmd-help-gnu-surface-contract-2026-04-09-2](./TECH-continuous-optimization-status-local-cmd-help-gnu-surface-contract-2026-04-09-2.md)
- [TECH-continuous-optimization-status-local-cmd-help-gnu-surface-contract-2026-04-09](./TECH-continuous-optimization-status-local-cmd-help-gnu-surface-contract-2026-04-09.md)
- [TECH-continuous-optimization-step11-closure-claim-supersession-2026-04-09-2](./TECH-continuous-optimization-step11-closure-claim-supersession-2026-04-09-2.md)
- [TECH-continuous-optimization-step11-closure-claim-supersession-2026-04-09](./TECH-continuous-optimization-step11-closure-claim-supersession-2026-04-09.md)
- [TECH-continuous-optimization-step11-failover-scenario-catalog-2026-04-08](./TECH-continuous-optimization-step11-failover-scenario-catalog-2026-04-08.md)
- [TECH-continuous-optimization-step11-pre-release-connection-metrics-collected-evidence-2](./TECH-continuous-optimization-step11-pre-release-connection-metrics-collected-evidence-2.md)
- [TECH-continuous-optimization-step11-pre-release-connection-metrics-collected-evidence](./TECH-continuous-optimization-step11-pre-release-connection-metrics-collected-evidence.md)
- [TECH-continuous-optimization-step11-pre-release-drain-rebalance-collected-evidence-20-2](./TECH-continuous-optimization-step11-pre-release-drain-rebalance-collected-evidence-20-2.md)
- [TECH-continuous-optimization-step11-pre-release-drain-rebalance-collected-evidence-20](./TECH-continuous-optimization-step11-pre-release-drain-rebalance-collected-evidence-20.md)
- [TECH-continuous-optimization-step11-pre-release-failover-collected-evidence-2026-04-0-2](./TECH-continuous-optimization-step11-pre-release-failover-collected-evidence-2026-04-0-2.md)
- [TECH-continuous-optimization-step11-pre-release-failover-collected-evidence-2026-04-0](./TECH-continuous-optimization-step11-pre-release-failover-collected-evidence-2026-04-0.md)
- [TECH-continuous-optimization-step11-pre-release-message-metrics-collected-evidence-20-2](./TECH-continuous-optimization-step11-pre-release-message-metrics-collected-evidence-20-2.md)
- [TECH-continuous-optimization-step11-pre-release-message-metrics-collected-evidence-20](./TECH-continuous-optimization-step11-pre-release-message-metrics-collected-evidence-20.md)
- [TECH-continuous-optimization-step11-pre-release-restore-recovery-collected-evidence-2-2](./TECH-continuous-optimization-step11-pre-release-restore-recovery-collected-evidence-2-2.md)
- [TECH-continuous-optimization-step11-pre-release-restore-recovery-collected-evidence-2](./TECH-continuous-optimization-step11-pre-release-restore-recovery-collected-evidence-2.md)
- [TECH-continuous-optimization-step11-pre-release-stream-metrics-collected-evidence-202-2](./TECH-continuous-optimization-step11-pre-release-stream-metrics-collected-evidence-202-2.md)
- [TECH-continuous-optimization-step11-pre-release-stream-metrics-collected-evidence-202](./TECH-continuous-optimization-step11-pre-release-stream-metrics-collected-evidence-202.md)
- [TECH-continuous-optimization-step11-pre-release-upgrade-rollback-collected-evidence-2-2](./TECH-continuous-optimization-step11-pre-release-upgrade-rollback-collected-evidence-2-2.md)
- [TECH-continuous-optimization-step11-pre-release-upgrade-rollback-collected-evidence-2](./TECH-continuous-optimization-step11-pre-release-upgrade-rollback-collected-evidence-2.md)
- [TECH-continuous-optimization-step11-public-index-state-separation-alignment-2026-04-0-2](./TECH-continuous-optimization-step11-public-index-state-separation-alignment-2026-04-0-2.md)
- [TECH-continuous-optimization-step11-public-index-state-separation-alignment-2026-04-0](./TECH-continuous-optimization-step11-public-index-state-separation-alignment-2026-04-0.md)
- [TECH-continuous-optimization-step11-tier-artifact-root-current-state-assertion-alignm-2](./TECH-continuous-optimization-step11-tier-artifact-root-current-state-assertion-alignm-2.md)
- [TECH-continuous-optimization-step11-tier-artifact-root-current-state-assertion-alignm](./TECH-continuous-optimization-step11-tier-artifact-root-current-state-assertion-alignm.md)
- [TECH-continuous-optimization-step11-tier-artifact-root-materialization-2026-04-09-2](./TECH-continuous-optimization-step11-tier-artifact-root-materialization-2026-04-09-2.md)
- [TECH-continuous-optimization-step11-tier-artifact-root-materialization-2026-04-09](./TECH-continuous-optimization-step11-tier-artifact-root-materialization-2026-04-09.md)
- [TECH-continuous-optimization-step11-tier-gate-doc-state-alignment-2026-04-09-2](./TECH-continuous-optimization-step11-tier-gate-doc-state-alignment-2026-04-09-2.md)
- [TECH-continuous-optimization-step11-tier-gate-doc-state-alignment-2026-04-09](./TECH-continuous-optimization-step11-tier-gate-doc-state-alignment-2026-04-09.md)
- [TECH-continuous-optimization-step11-tier-machine-readable-evidence-index-2026-04-09-2](./TECH-continuous-optimization-step11-tier-machine-readable-evidence-index-2026-04-09-2.md)
- [TECH-continuous-optimization-step11-tier-machine-readable-evidence-index-2026-04-09](./TECH-continuous-optimization-step11-tier-machine-readable-evidence-index-2026-04-09.md)
- [TECH-control-plane-api](./TECH-control-plane-api.md)
- [TECH-control-plane-provider-policy-auditdesign-2026-04-08](./TECH-control-plane-provider-policy-auditdesign-2026-04-08.md)
- [TECH-control-plane-provider-policy-design-2026-04-08-2](./TECH-control-plane-provider-policy-design-2026-04-08-2.md)
- [TECH-control-plane-provider-policy-design-2026-04-08-3](./TECH-control-plane-provider-policy-design-2026-04-08-3.md)
- [TECH-control-plane-provider-policy-design-2026-04-08-4](./TECH-control-plane-provider-policy-design-2026-04-08-4.md)
- [TECH-control-plane-provider-policy-design-2026-04-08-5](./TECH-control-plane-provider-policy-design-2026-04-08-5.md)
- [TECH-control-plane-provider-policy-design-2026-04-08-6](./TECH-control-plane-provider-policy-design-2026-04-08-6.md)
- [TECH-control-plane-provider-policy-design-2026-04-08](./TECH-control-plane-provider-policy-design-2026-04-08.md)
- [TECH-control-plane-provider-policy-error-statusdesign-2026-04-08](./TECH-control-plane-provider-policy-error-statusdesign-2026-04-08.md)
- [TECH-control-plane-provider-policy-error-vocabularydesign-2026-04-08](./TECH-control-plane-provider-policy-error-vocabularydesign-2026-04-08.md)
- [TECH-control-plane-provider-policy-history-diff-rollback-statusdesign-2026-04-08](./TECH-control-plane-provider-policy-history-diff-rollback-statusdesign-2026-04-08.md)
- [TECH-control-plane-provider-policy-noopdesign-2026-04-08](./TECH-control-plane-provider-policy-noopdesign-2026-04-08.md)
- [TECH-control-plane-provider-snapshot-statusdesign-2026-04-08](./TECH-control-plane-provider-snapshot-statusdesign-2026-04-08.md)
- [TECH-control-plane-provider-status-matrixdesign-2026-04-08](./TECH-control-plane-provider-status-matrixdesign-2026-04-08.md)
- [TECH-conversation-workflow](./TECH-conversation-workflow.md)
- [TECH-conversations-2](./TECH-conversations-2.md)
- [TECH-conversations](./TECH-conversations.md)
- [TECH-craw-chat-spec-compliance-audit-2026-06-01](./TECH-craw-chat-spec-compliance-audit-2026-06-01.md)
- [TECH-create-agent-dialog](./TECH-create-agent-dialog.md)
- [TECH-create-agent-handoff](./TECH-create-agent-handoff.md)
- [TECH-create-call-session](./TECH-create-call-session.md)
- [TECH-create-conversation](./TECH-create-conversation.md)
- [TECH-create-room](./TECH-create-room.md)
- [TECH-create-system-channel](./TECH-create-system-channel.md)
- [TECH-csharp-sdk](./TECH-csharp-sdk.md)
- [TECH-database-design](./TECH-database-design.md)
- [TECH-database-table-naming-standard](./TECH-database-table-naming-standard.md)
- [TECH-ddd-im-implementation-2026-04-09](./TECH-ddd-im-implementation-2026-04-09.md)
- [TECH-deployment](./TECH-deployment.md)
- [TECH-design-2026-04-08](./TECH-design-2026-04-08.md)
- [TECH-docker](./TECH-docker.md)
- [TECH-drain-node](./TECH-drain-node.md)
- [TECH-edit-message](./TECH-edit-message.md)
- [TECH-end-call-session](./TECH-end-call-session.md)
- [TECH-enter-room](./TECH-enter-room.md)
- [TECH-establish-external-connection](./TECH-establish-external-connection.md)
- [TECH-export-audit-bundle](./TECH-export-audit-bundle.md)
- [TECH-flutter-quick-start](./TECH-flutter-quick-start.md)
- [TECH-flutter-sdk](./TECH-flutter-sdk.md)
- [TECH-gateway-openapi](./TECH-gateway-openapi.md)
- [TECH-generation-and-ownership](./TECH-generation-and-ownership.md)
- [TECH-generator-boundary](./TECH-generator-boundary.md)
- [TECH-get-access](./TECH-get-access.md)
- [TECH-get-agent-handoff-state](./TECH-get-agent-handoff-state.md)
- [TECH-get-automation-execution](./TECH-get-automation-execution.md)
- [TECH-get-automation](./TECH-get-automation.md)
- [TECH-get-control-healthz](./TECH-get-control-healthz.md)
- [TECH-get-conversation-summary](./TECH-get-conversation-summary.md)
- [TECH-get-conversations](./TECH-get-conversations.md)
- [TECH-get-dashboard](./TECH-get-dashboard.md)
- [TECH-get-dead-letter-shared-channel-sync-inventory](./TECH-get-dead-letter-shared-channel-sync-inventory.md)
- [TECH-get-delivered-shared-channel-sync-inventory](./TECH-get-delivered-shared-channel-sync-inventory.md)
- [TECH-get-delivery-state-shared-channel-sync-inventory](./TECH-get-delivery-state-shared-channel-sync-inventory.md)
- [TECH-get-direct-chat-snapshot](./TECH-get-direct-chat-snapshot.md)
- [TECH-get-external-connection-snapshot](./TECH-get-external-connection-snapshot.md)
- [TECH-get-external-member-link-snapshot](./TECH-get-external-member-link-snapshot.md)
- [TECH-get-friend-request-snapshot](./TECH-get-friend-request-snapshot.md)
- [TECH-get-friendship-snapshot](./TECH-get-friendship-snapshot.md)
- [TECH-get-governance](./TECH-get-governance.md)
- [TECH-get-healthz](./TECH-get-healthz.md)
- [TECH-get-home](./TECH-get-home.md)
- [TECH-get-inbox](./TECH-get-inbox.md)
- [TECH-get-media-provider-health](./TECH-get-media-provider-health.md)
- [TECH-get-media](./TECH-get-media.md)
- [TECH-get-notification](./TECH-get-notification.md)
- [TECH-get-ops-cluster](./TECH-get-ops-cluster.md)
- [TECH-get-ops-diagnostics](./TECH-get-ops-diagnostics.md)
- [TECH-get-ops-health](./TECH-get-ops-health.md)
- [TECH-get-ops-lag](./TECH-get-ops-lag.md)
- [TECH-get-ops-provider-binding-drift](./TECH-get-ops-provider-binding-drift.md)
- [TECH-get-ops-provider-bindings](./TECH-get-ops-provider-bindings.md)
- [TECH-get-ops-replay-status](./TECH-get-ops-replay-status.md)
- [TECH-get-ops-runtime-dir](./TECH-get-ops-runtime-dir.md)
- [TECH-get-pending-shared-channel-sync-inventory](./TECH-get-pending-shared-channel-sync-inventory.md)
- [TECH-get-presence-me](./TECH-get-presence-me.md)
- [TECH-get-principal-profile-provider-health](./TECH-get-principal-profile-provider-health.md)
- [TECH-get-protocol-governance](./TECH-get-protocol-governance.md)
- [TECH-get-protocol-registry](./TECH-get-protocol-registry.md)
- [TECH-get-provider-bindings](./TECH-get-provider-bindings.md)
- [TECH-get-provider-policy-diff](./TECH-get-provider-policy-diff.md)
- [TECH-get-provider-policy-history](./TECH-get-provider-policy-history.md)
- [TECH-get-provider-registry](./TECH-get-provider-registry.md)
- [TECH-get-read-cursor](./TECH-get-read-cursor.md)
- [TECH-get-readyz](./TECH-get-readyz.md)
- [TECH-get-realtime](./TECH-get-realtime.md)
- [TECH-get-room](./TECH-get-room.md)
- [TECH-get-shared-channel-policy-snapshot](./TECH-get-shared-channel-policy-snapshot.md)
- [TECH-get-user-block-snapshot](./TECH-get-user-block-snapshot.md)
- [TECH-get-workspace](./TECH-get-workspace.md)
- [TECH-go-sdk](./TECH-go-sdk.md)
- [TECH-governancecrate-standard-2026-04-06](./TECH-governancecrate-standard-2026-04-06.md)
- [TECH-governancedesign-2026-04-06](./TECH-governancedesign-2026-04-06.md)
- [TECH-heartbeat-presence](./TECH-heartbeat-presence.md)
- [TECH-im-api](./TECH-im-api.md)
- [TECH-im-server-db-security-performance-report-2026-06-01](./TECH-im-server-db-security-performance-report-2026-06-01.md)
- [TECH-im-social-open-api-alignment](./TECH-im-social-open-api-alignment.md)
- [TECH-im-space-open-api-alignment](./TECH-im-space-open-api-alignment.md)
- [TECH-im-web-domain-routing](./TECH-im-web-domain-routing.md)
- [TECH-implementation-close-error-registry-2026-04-08](./TECH-implementation-close-error-registry-2026-04-08.md)
- [TECH-implementation-ops-provider-binding-2026-04-08-2](./TECH-implementation-ops-provider-binding-2026-04-08-2.md)
- [TECH-implementation-ops-provider-binding-2026-04-08](./TECH-implementation-ops-provider-binding-2026-04-08.md)
- [TECH-implementation-provider-2026-04-08-2](./TECH-implementation-provider-2026-04-08-2.md)
- [TECH-implementation-provider-2026-04-08](./TECH-implementation-provider-2026-04-08.md)
- [TECH-implementation-provider-governance-2026-04-08](./TECH-implementation-provider-governance-2026-04-08.md)
- [TECH-implementation-provider-policy-2026-04-08-2](./TECH-implementation-provider-policy-2026-04-08-2.md)
- [TECH-implementation-provider-policy-2026-04-08-3](./TECH-implementation-provider-policy-2026-04-08-3.md)
- [TECH-implementation-provider-policy-2026-04-08-4](./TECH-implementation-provider-policy-2026-04-08-4.md)
- [TECH-implementation-provider-policy-2026-04-08-5](./TECH-implementation-provider-policy-2026-04-08-5.md)
- [TECH-implementation-provider-policy-2026-04-08-6](./TECH-implementation-provider-policy-2026-04-08-6.md)
- [TECH-implementation-provider-policy-2026-04-08-7](./TECH-implementation-provider-policy-2026-04-08-7.md)
- [TECH-implementation-provider-policy-2026-04-08-8](./TECH-implementation-provider-policy-2026-04-08-8.md)
- [TECH-implementation-provider-policy-2026-04-08](./TECH-implementation-provider-policy-2026-04-08.md)
- [TECH-implementation-provider-policy-audit-2026-04-08](./TECH-implementation-provider-policy-audit-2026-04-08.md)
- [TECH-implementation-provider-policy-diff-2026-04-08](./TECH-implementation-provider-policy-diff-2026-04-08.md)
- [TECH-implementation-provider-policy-noop-2026-04-08](./TECH-implementation-provider-policy-noop-2026-04-08.md)
- [TECH-implementation-rtc-2026-04-08](./TECH-implementation-rtc-2026-04-08.md)
- [TECH-implementation-sdk-2026-04-08](./TECH-implementation-sdk-2026-04-08.md)
- [TECH-implementation-sdk-readme-2026-04-08-2](./TECH-implementation-sdk-readme-2026-04-08-2.md)
- [TECH-implementation-sdk-readme-2026-04-08](./TECH-implementation-sdk-readme-2026-04-08.md)
- [TECH-implementation-sdk-readmereleaseboundaries-2026-04-08](./TECH-implementation-sdk-readmereleaseboundaries-2026-04-08.md)
- [TECH-implementation-sdkrelease-2026-04-08](./TECH-implementation-sdkrelease-2026-04-08.md)
- [TECH-implementation-sdkrelease-schema-2026-04-08](./TECH-implementation-sdkrelease-schema-2026-04-08.md)
- [TECH-implementation-step11-failover-2026-04-08](./TECH-implementation-step11-failover-2026-04-08.md)
- [TECH-index-2](./TECH-index-2.md)
- [TECH-index-3](./TECH-index-3.md)
- [TECH-index-4](./TECH-index-4.md)
- [TECH-index-5](./TECH-index-5.md)
- [TECH-index-6](./TECH-index-6.md)
- [TECH-index](./TECH-index.md)
- [TECH-invite-call-session](./TECH-invite-call-session.md)
- [TECH-issue-call-credential](./TECH-issue-call-credential.md)
- [TECH-java-sdk](./TECH-java-sdk.md)
- [TECH-kotlin-sdk](./TECH-kotlin-sdk.md)
- [TECH-language-support](./TECH-language-support.md)
- [TECH-leave-conversation](./TECH-leave-conversation.md)
- [TECH-leave-room](./TECH-leave-room.md)
- [TECH-legacy-05](./TECH-legacy-05.md)
- [TECH-legacy-93](./TECH-legacy-93.md)
- [TECH-list-audit-records](./TECH-list-audit-records.md)
- [TECH-list-members](./TECH-list-members.md)
- [TECH-list-messages](./TECH-list-messages.md)
- [TECH-list-notifications](./TECH-list-notifications.md)
- [TECH-list-realtime-events](./TECH-list-realtime-events.md)
- [TECH-list-stream-frames](./TECH-list-stream-frames.md)
- [TECH-local-binary](./TECH-local-binary.md)
- [TECH-local-chat-cli-multi-terminal-validation-standard-2026-04-06](./TECH-local-chat-cli-multi-terminal-validation-standard-2026-04-06.md)
- [TECH-local-chat-window-launcher-standard-2026-04-06](./TECH-local-chat-window-launcher-standard-2026-04-06.md)
- [TECH-media-2](./TECH-media-2.md)
- [TECH-media](./TECH-media.md)
- [TECH-membership-and-read-state](./TECH-membership-and-read-state.md)
- [TECH-message-and-media](./TECH-message-and-media.md)
- [TECH-messages-2](./TECH-messages-2.md)
- [TECH-messages](./TECH-messages.md)
- [TECH-migrate-node-routes](./TECH-migrate-node-routes.md)
- [TECH-module-map-2](./TECH-module-map-2.md)
- [TECH-module-map](./TECH-module-map.md)
- [TECH-nodes](./TECH-nodes.md)
- [TECH-notifications](./TECH-notifications.md)
- [TECH-open-stream](./TECH-open-stream.md)
- [TECH-ops-provider-binding-design-2026-04-08-2](./TECH-ops-provider-binding-design-2026-04-08-2.md)
- [TECH-ops-provider-binding-design-2026-04-08](./TECH-ops-provider-binding-design-2026-04-08.md)
- [TECH-ops](./TECH-ops.md)
- [TECH-overview](./TECH-overview.md)
- [TECH-performance-fixes](./TECH-performance-fixes.md)
- [TECH-performance](./TECH-performance.md)
- [TECH-platform-api](./TECH-platform-api.md)
- [TECH-portal-access](./TECH-portal-access.md)
- [TECH-post-call-signal](./TECH-post-call-signal.md)
- [TECH-post-message](./TECH-post-message.md)
- [TECH-postgresql-2](./TECH-postgresql-2.md)
- [TECH-postgresql-database-configuration](./TECH-postgresql-database-configuration.md)
- [TECH-postgresql](./TECH-postgresql.md)
- [TECH-preview-provider-policy](./TECH-preview-provider-policy.md)
- [TECH-production-domain-binding](./TECH-production-domain-binding.md)
- [TECH-profiles-and-env](./TECH-profiles-and-env.md)
- [TECH-protocol](./TECH-protocol.md)
- [TECH-provider-governancedesign-2026-04-08](./TECH-provider-governancedesign-2026-04-08.md)
- [TECH-provider-health](./TECH-provider-health.md)
- [TECH-providers](./TECH-providers.md)
- [TECH-publish-system-channel-message](./TECH-publish-system-channel-message.md)
- [TECH-python-sdk](./TECH-python-sdk.md)
- [TECH-quick-start](./TECH-quick-start.md)
- [TECH-realtime-websocket](./TECH-realtime-websocket.md)
- [TECH-realtime](./TECH-realtime.md)
- [TECH-recall-message](./TECH-recall-message.md)
- [TECH-reclaim-stale-pending-shared-channel-sync](./TECH-reclaim-stale-pending-shared-channel-sync.md)
- [TECH-record-audit-anchor](./TECH-record-audit-anchor.md)
- [TECH-reject-call-session](./TECH-reject-call-session.md)
- [TECH-release-pending-shared-channel-sync-targeted](./TECH-release-pending-shared-channel-sync-targeted.md)
- [TECH-remove-member](./TECH-remove-member.md)
- [TECH-repair-shared-channel-sync](./TECH-repair-shared-channel-sync.md)
- [TECH-repair-social-runtime-snapshot](./TECH-repair-social-runtime-snapshot.md)
- [TECH-republish-pending-shared-channel-sync-targeted](./TECH-republish-pending-shared-channel-sync-targeted.md)
- [TECH-request-agent-tool-call](./TECH-request-agent-tool-call.md)
- [TECH-request-automation-execution](./TECH-request-automation-execution.md)
- [TECH-request-notification](./TECH-request-notification.md)
- [TECH-requeue-dead-letter-shared-channel-sync-targeted](./TECH-requeue-dead-letter-shared-channel-sync-targeted.md)
- [TECH-requeue-dead-letter-shared-channel-sync](./TECH-requeue-dead-letter-shared-channel-sync.md)
- [TECH-resolve-agent-handoff](./TECH-resolve-agent-handoff.md)
- [TECH-retrieve-call-session](./TECH-retrieve-call-session.md)
- [TECH-rollback-provider-policy](./TECH-rollback-provider-policy.md)
- [TECH-rooms-2](./TECH-rooms-2.md)
- [TECH-rooms](./TECH-rooms.md)
- [TECH-rtc-design-2026-04-08](./TECH-rtc-design-2026-04-08.md)
- [TECH-rtc-sdk](./TECH-rtc-sdk.md)
- [TECH-runtime-directory](./TECH-runtime-directory.md)
- [TECH-runtime-operations](./TECH-runtime-operations.md)
- [TECH-runtime-topology](./TECH-runtime-topology.md)
- [TECH-rust-quick-start](./TECH-rust-quick-start.md)
- [TECH-rust-sdk](./TECH-rust-sdk.md)
- [TECH-s00-s14-2026-04-10](./TECH-s00-s14-2026-04-10.md)
- [TECH-s05-2026-04-10](./TECH-s05-2026-04-10.md)
- [TECH-s05-architecture-2026-04-10](./TECH-s05-architecture-2026-04-10.md)
- [TECH-s05-audit-2026-04-10](./TECH-s05-audit-2026-04-10.md)
- [TECH-s05-durable-social-truth-loop31-current-checkpoint-2026-04-10](./TECH-s05-durable-social-truth-loop31-current-checkpoint-2026-04-10.md)
- [TECH-s05-loop29-2026-04-10](./TECH-s05-loop29-2026-04-10.md)
- [TECH-s05-loop30-2026-04-10](./TECH-s05-loop30-2026-04-10.md)
- [TECH-s05-loop31-2026-04-10](./TECH-s05-loop31-2026-04-10.md)
- [TECH-s05-loop32-2026-04-10](./TECH-s05-loop32-2026-04-10.md)
- [TECH-s05-loop33-2026-04-10](./TECH-s05-loop33-2026-04-10.md)
- [TECH-s05-loop34-2026-04-10](./TECH-s05-loop34-2026-04-10.md)
- [TECH-s05-loop35-2026-04-10](./TECH-s05-loop35-2026-04-10.md)
- [TECH-s05-loop36-2026-04-10](./TECH-s05-loop36-2026-04-10.md)
- [TECH-s05-loop37-2026-04-10](./TECH-s05-loop37-2026-04-10.md)
- [TECH-s05-loop38-2026-04-11](./TECH-s05-loop38-2026-04-11.md)
- [TECH-s05-loop39-2026-04-11](./TECH-s05-loop39-2026-04-11.md)
- [TECH-s05-loop40-2026-04-11](./TECH-s05-loop40-2026-04-11.md)
- [TECH-s05-loop41-2026-04-11](./TECH-s05-loop41-2026-04-11.md)
- [TECH-s05-loop42-2026-04-11](./TECH-s05-loop42-2026-04-11.md)
- [TECH-s05-loop43-2026-04-11](./TECH-s05-loop43-2026-04-11.md)
- [TECH-s05-loop44-2026-04-11](./TECH-s05-loop44-2026-04-11.md)
- [TECH-s05-main-architecture-backwrite-loop32-current-checkpoint-2026-04-10](./TECH-s05-main-architecture-backwrite-loop32-current-checkpoint-2026-04-10.md)
- [TECH-s05-social-commit-ack-loop38-current-checkpoint-2026-04-11](./TECH-s05-social-commit-ack-loop38-current-checkpoint-2026-04-11.md)
- [TECH-s05-social-crash-consistency-loop34-current-checkpoint-2026-04-10](./TECH-s05-social-crash-consistency-loop34-current-checkpoint-2026-04-10.md)
- [TECH-s05-social-event-idempotency-loop36-current-checkpoint-2026-04-10](./TECH-s05-social-event-idempotency-loop36-current-checkpoint-2026-04-10.md)
- [TECH-s05-social-failpoint-repair-loop37-current-checkpoint-2026-04-10](./TECH-s05-social-failpoint-repair-loop37-current-checkpoint-2026-04-10.md)
- [TECH-s05-social-journal-repair-loop39-current-checkpoint-2026-04-11](./TECH-s05-social-journal-repair-loop39-current-checkpoint-2026-04-11.md)
- [TECH-s05-social-journal-replay-loop33-current-checkpoint-2026-04-10](./TECH-s05-social-journal-replay-loop33-current-checkpoint-2026-04-10.md)
- [TECH-s05-social-live-state-after-snapshot-failure-loop35-current-checkpoint-2026-04-1](./TECH-s05-social-live-state-after-snapshot-failure-loop35-current-checkpoint-2026-04-1.md)
- [TECH-s05-social-repair-marker-operator-surface-loop43-current-checkpoint-2026-04-11](./TECH-s05-social-repair-marker-operator-surface-loop43-current-checkpoint-2026-04-11.md)
- [TECH-s05-social-repair-wrapper-unification-loop41-current-checkpoint-2026-04-11](./TECH-s05-social-repair-wrapper-unification-loop41-current-checkpoint-2026-04-11.md)
- [TECH-s05-social-standalone-repair-loop40-current-checkpoint-2026-04-11](./TECH-s05-social-standalone-repair-loop40-current-checkpoint-2026-04-11.md)
- [TECH-s05-social-transaction-marker-loop42-current-checkpoint-2026-04-11](./TECH-s05-social-transaction-marker-loop42-current-checkpoint-2026-04-11.md)
- [TECH-s05-step-closure-loop44-current-checkpoint-2026-04-11](./TECH-s05-step-closure-loop44-current-checkpoint-2026-04-11.md)
- [TECH-s07-2026-04-10](./TECH-s07-2026-04-10.md)
- [TECH-s07-architecture-2026-04-10](./TECH-s07-architecture-2026-04-10.md)
- [TECH-s07-audit-2026-04-10](./TECH-s07-audit-2026-04-10.md)
- [TECH-s07-control-plane-auto-sync-trigger-loop52-current-checkpoint-2026-04-11](./TECH-s07-control-plane-auto-sync-trigger-loop52-current-checkpoint-2026-04-11.md)
- [TECH-s07-invited-history-visibility-loop46-current-checkpoint-2026-04-11](./TECH-s07-invited-history-visibility-loop46-current-checkpoint-2026-04-11.md)
- [TECH-s07-loop29-2026-04-10](./TECH-s07-loop29-2026-04-10.md)
- [TECH-s07-loop30-2026-04-10](./TECH-s07-loop30-2026-04-10.md)
- [TECH-s07-loop45-2026-04-11](./TECH-s07-loop45-2026-04-11.md)
- [TECH-s07-loop46-2026-04-11](./TECH-s07-loop46-2026-04-11.md)
- [TECH-s07-loop47-2026-04-11](./TECH-s07-loop47-2026-04-11.md)
- [TECH-s07-loop48-2026-04-11](./TECH-s07-loop48-2026-04-11.md)
- [TECH-s07-loop49-2026-04-11](./TECH-s07-loop49-2026-04-11.md)
- [TECH-s07-loop50-2026-04-11](./TECH-s07-loop50-2026-04-11.md)
- [TECH-s07-loop51-2026-04-11](./TECH-s07-loop51-2026-04-11.md)
- [TECH-s07-loop52-2026-04-11](./TECH-s07-loop52-2026-04-11.md)
- [TECH-s07-loop53-2026-04-11](./TECH-s07-loop53-2026-04-11.md)
- [TECH-s07-loop54-2026-04-11](./TECH-s07-loop54-2026-04-11.md)
- [TECH-s07-loop55-2026-04-11](./TECH-s07-loop55-2026-04-11.md)
- [TECH-s07-loop56-2026-04-11](./TECH-s07-loop56-2026-04-11.md)
- [TECH-s07-loop57-2026-04-11](./TECH-s07-loop57-2026-04-11.md)
- [TECH-s07-loop58-2026-04-11](./TECH-s07-loop58-2026-04-11.md)
- [TECH-s07-loop59-2026-04-11](./TECH-s07-loop59-2026-04-11.md)
- [TECH-s07-loop60-2026-04-11](./TECH-s07-loop60-2026-04-11.md)
- [TECH-s07-loop61-2026-04-11](./TECH-s07-loop61-2026-04-11.md)
- [TECH-s07-loop62-2026-04-11](./TECH-s07-loop62-2026-04-11.md)
- [TECH-s07-loop63-2026-04-11](./TECH-s07-loop63-2026-04-11.md)
- [TECH-s07-loop64-2026-04-11](./TECH-s07-loop64-2026-04-11.md)
- [TECH-s07-loop65-2026-04-11](./TECH-s07-loop65-2026-04-11.md)
- [TECH-s07-loop66-2026-04-11](./TECH-s07-loop66-2026-04-11.md)
- [TECH-s07-loop67-2026-04-11](./TECH-s07-loop67-2026-04-11.md)
- [TECH-s07-loop68-2026-04-11](./TECH-s07-loop68-2026-04-11.md)
- [TECH-s07-loop69-2026-04-11](./TECH-s07-loop69-2026-04-11.md)
- [TECH-s07-loop70-2026-04-11](./TECH-s07-loop70-2026-04-11.md)
- [TECH-s07-loop71-2026-04-11](./TECH-s07-loop71-2026-04-11.md)
- [TECH-s07-loop72-2026-04-11](./TECH-s07-loop72-2026-04-11.md)
- [TECH-s07-loop73-2026-04-11](./TECH-s07-loop73-2026-04-11.md)
- [TECH-s07-loop74-2026-04-11](./TECH-s07-loop74-2026-04-11.md)
- [TECH-s07-loop75-2026-04-11](./TECH-s07-loop75-2026-04-11.md)
- [TECH-s07-loop76-2026-04-11](./TECH-s07-loop76-2026-04-11.md)
- [TECH-s07-loop77-2026-04-11](./TECH-s07-loop77-2026-04-11.md)
- [TECH-s07-loop78-2026-04-11](./TECH-s07-loop78-2026-04-11.md)
- [TECH-s07-loop79-2026-04-11](./TECH-s07-loop79-2026-04-11.md)
- [TECH-s07-loop80-2026-04-11](./TECH-s07-loop80-2026-04-11.md)
- [TECH-s07-loop81-2026-04-11](./TECH-s07-loop81-2026-04-11.md)
- [TECH-s07-loop82-2026-04-12](./TECH-s07-loop82-2026-04-12.md)
- [TECH-s07-loop83-2026-04-12](./TECH-s07-loop83-2026-04-12.md)
- [TECH-s07-loop84-2026-04-12](./TECH-s07-loop84-2026-04-12.md)
- [TECH-s07-loop85-2026-04-12](./TECH-s07-loop85-2026-04-12.md)
- [TECH-s07-loop86-2026-04-12](./TECH-s07-loop86-2026-04-12.md)
- [TECH-s07-retention-enforcement-runtime-truth-loop48-current-checkpoint-2026-04-11](./TECH-s07-retention-enforcement-runtime-truth-loop48-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-channel-policy-durable-sync-loop51-current-checkpoint-2026-04-11](./TECH-s07-shared-channel-policy-durable-sync-loop51-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-channel-sync-claim-conflict-items-loop73-current-checkpoint-2026-04-1](./TECH-s07-shared-channel-sync-claim-conflict-items-loop73-current-checkpoint-2026-04-1.md)
- [TECH-s07-shared-channel-sync-conflict-suggested-action-loop75-current-checkpoint-2026](./TECH-s07-shared-channel-sync-conflict-suggested-action-loop75-current-checkpoint-2026.md)
- [TECH-s07-shared-channel-sync-dead-letter-loop57-current-checkpoint-2026-04-11](./TECH-s07-shared-channel-sync-dead-letter-loop57-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-channel-sync-dead-letter-metadata-parity-loop74-current-checkpoint-20](./TECH-s07-shared-channel-sync-dead-letter-metadata-parity-loop74-current-checkpoint-20.md)
- [TECH-s07-shared-channel-sync-dead-letter-owner-metadata-reclaim-loop81-current-checkp](./TECH-s07-shared-channel-sync-dead-letter-owner-metadata-reclaim-loop81-current-checkp.md)
- [TECH-s07-shared-channel-sync-dead-letter-rearm-loop59-current-checkpoint-2026-04-11](./TECH-s07-shared-channel-sync-dead-letter-rearm-loop59-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-channel-sync-dead-letter-requeue-loop58-current-checkpoint-2026-04-11](./TECH-s07-shared-channel-sync-dead-letter-requeue-loop58-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-channel-sync-dead-letter-requeue-stale-metadata-reclaim-loop80-curren](./TECH-s07-shared-channel-sync-dead-letter-requeue-stale-metadata-reclaim-loop80-curren.md)
- [TECH-s07-shared-channel-sync-dead-letter-targeted-requeue-loop60-current-checkpoint-2](./TECH-s07-shared-channel-sync-dead-letter-targeted-requeue-loop60-current-checkpoint-2.md)
- [TECH-s07-shared-channel-sync-lease-status-visibility-loop68-current-checkpoint-2026-0](./TECH-s07-shared-channel-sync-lease-status-visibility-loop68-current-checkpoint-2026-0.md)
- [TECH-s07-shared-channel-sync-legacy-untracked-takeover-override-loop70-current-checkp](./TECH-s07-shared-channel-sync-legacy-untracked-takeover-override-loop70-current-checkp.md)
- [TECH-s07-shared-channel-sync-next-write-auto-retry-loop56-current-checkpoint-2026-04](./TECH-s07-shared-channel-sync-next-write-auto-retry-loop56-current-checkpoint-2026-04.md)
- [TECH-s07-shared-channel-sync-next-write-claim-ownership-loop77-current-checkpoint-202](./TECH-s07-shared-channel-sync-next-write-claim-ownership-loop77-current-checkpoint-202.md)
- [TECH-s07-shared-channel-sync-next-write-proactive-stale-claim-reclaim-loop86-current](./TECH-s07-shared-channel-sync-next-write-proactive-stale-claim-reclaim-loop86-current.md)
- [TECH-s07-shared-channel-sync-next-write-stale-metadata-reclaim-loop78-current-checkpo](./TECH-s07-shared-channel-sync-next-write-stale-metadata-reclaim-loop78-current-checkpo.md)
- [TECH-s07-shared-channel-sync-owner-conflict-details-parity-loop72-current-checkpoint](./TECH-s07-shared-channel-sync-owner-conflict-details-parity-loop72-current-checkpoint.md)
- [TECH-s07-shared-channel-sync-pending-claim-ownership-loop62-current-checkpoint-2026-0](./TECH-s07-shared-channel-sync-pending-claim-ownership-loop62-current-checkpoint-2026-0.md)
- [TECH-s07-shared-channel-sync-pending-claimed-at-visibility-loop64-current-checkpoint](./TECH-s07-shared-channel-sync-pending-claimed-at-visibility-loop64-current-checkpoint.md)
- [TECH-s07-shared-channel-sync-pending-lease-expires-at-visibility-loop66-current-check](./TECH-s07-shared-channel-sync-pending-lease-expires-at-visibility-loop66-current-check.md)
- [TECH-s07-shared-channel-sync-pending-release-lifecycle-loop63-current-checkpoint-2026](./TECH-s07-shared-channel-sync-pending-release-lifecycle-loop63-current-checkpoint-2026.md)
- [TECH-s07-shared-channel-sync-pending-repair-loop55-current-checkpoint-2026-04-11](./TECH-s07-shared-channel-sync-pending-repair-loop55-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-channel-sync-pending-takeover-loop65-current-checkpoint-2026-04-11](./TECH-s07-shared-channel-sync-pending-takeover-loop65-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-channel-sync-pending-targeted-republish-loop61-current-checkpoint-202](./TECH-s07-shared-channel-sync-pending-targeted-republish-loop61-current-checkpoint-202.md)
- [TECH-s07-shared-channel-sync-same-owner-stale-claim-lease-renew-loop83-current-checkp](./TECH-s07-shared-channel-sync-same-owner-stale-claim-lease-renew-loop83-current-checkp.md)
- [TECH-s07-shared-channel-sync-same-owner-stale-republish-lease-renew-loop84-current-ch](./TECH-s07-shared-channel-sync-same-owner-stale-republish-lease-renew-loop84-current-ch.md)
- [TECH-s07-shared-channel-sync-stale-claim-reclaim-surface-loop79-current-checkpoint-20](./TECH-s07-shared-channel-sync-stale-claim-reclaim-surface-loop79-current-checkpoint-20.md)
- [TECH-s07-shared-channel-sync-stale-claim-repair-reclaim-loop76-current-checkpoint-202](./TECH-s07-shared-channel-sync-stale-claim-repair-reclaim-loop76-current-checkpoint-202.md)
- [TECH-s07-shared-channel-sync-stale-lease-takeover-guard-loop67-current-checkpoint-202](./TECH-s07-shared-channel-sync-stale-lease-takeover-guard-loop67-current-checkpoint-202.md)
- [TECH-s07-shared-channel-sync-takeover-conflict-details-loop71-current-checkpoint-2026](./TECH-s07-shared-channel-sync-takeover-conflict-details-loop71-current-checkpoint-2026.md)
- [TECH-s07-shared-channel-sync-takeover-eligibility-visibility-loop69-current-checkpoin](./TECH-s07-shared-channel-sync-takeover-eligibility-visibility-loop69-current-checkpoin.md)
- [TECH-s07-shared-channel-sync-unconfigured-repair-stale-reclaim-loop82-current-checkpo](./TECH-s07-shared-channel-sync-unconfigured-repair-stale-reclaim-loop82-current-checkpo.md)
- [TECH-s07-shared-channel-sync-unconfigured-same-owner-stale-republish-lease-renew-loop](./TECH-s07-shared-channel-sync-unconfigured-same-owner-stale-republish-lease-renew-loop.md)
- [TECH-s07-shared-external-history-runtime-truth-loop47-current-checkpoint-2026-04-11](./TECH-s07-shared-external-history-runtime-truth-loop47-current-checkpoint-2026-04-11.md)
- [TECH-s07-shared-fanout-rebuild-runtime-truth-loop50-current-checkpoint-2026-04-11](./TECH-s07-shared-fanout-rebuild-runtime-truth-loop50-current-checkpoint-2026-04-11.md)
- [TECH-s07-standalone-control-plane-public-http-consumer-loop54-current-checkpoint-2026](./TECH-s07-standalone-control-plane-public-http-consumer-loop54-current-checkpoint-2026.md)
- [TECH-s07-thread-runtime-truth-loop45-current-checkpoint-2026-04-11](./TECH-s07-thread-runtime-truth-loop45-current-checkpoint-2026-04-11.md)
- [TECH-s07-thread-subscription-notification-runtime-truth-loop49-current-checkpoint-202](./TECH-s07-thread-subscription-notification-runtime-truth-loop49-current-checkpoint-202.md)
- [TECH-s08-2026-04-10](./TECH-s08-2026-04-10.md)
- [TECH-s08-architecture-2026-04-10](./TECH-s08-architecture-2026-04-10.md)
- [TECH-s08-audit-2026-04-10](./TECH-s08-audit-2026-04-10.md)
- [TECH-s08-loop14-2026-04-10](./TECH-s08-loop14-2026-04-10.md)
- [TECH-s08-loop15-2026-04-10](./TECH-s08-loop15-2026-04-10.md)
- [TECH-s09-2026-04-10](./TECH-s09-2026-04-10.md)
- [TECH-s09-architecture-2026-04-10](./TECH-s09-architecture-2026-04-10.md)
- [TECH-s09-audit-2026-04-10](./TECH-s09-audit-2026-04-10.md)
- [TECH-s09-loop16-2026-04-10](./TECH-s09-loop16-2026-04-10.md)
- [TECH-s09-loop17-2026-04-10](./TECH-s09-loop17-2026-04-10.md)
- [TECH-s09-loop18-2026-04-10](./TECH-s09-loop18-2026-04-10.md)
- [TECH-s09-loop19-2026-04-10](./TECH-s09-loop19-2026-04-10.md)
- [TECH-s10-2026-04-10-2](./TECH-s10-2026-04-10-2.md)
- [TECH-s10-2026-04-10](./TECH-s10-2026-04-10.md)
- [TECH-s10-architecture-2026-04-10](./TECH-s10-architecture-2026-04-10.md)
- [TECH-s10-audit-2026-04-10](./TECH-s10-audit-2026-04-10.md)
- [TECH-s10-loop14-2026-04-10](./TECH-s10-loop14-2026-04-10.md)
- [TECH-s10-loop15-2026-04-10](./TECH-s10-loop15-2026-04-10.md)
- [TECH-s11-loop21-2026-04-10](./TECH-s11-loop21-2026-04-10.md)
- [TECH-s11-loop22-2026-04-10](./TECH-s11-loop22-2026-04-10.md)
- [TECH-s12-loop23-2026-04-10](./TECH-s12-loop23-2026-04-10.md)
- [TECH-s13-2026-04-10](./TECH-s13-2026-04-10.md)
- [TECH-s13-loop26-2026-04-10](./TECH-s13-loop26-2026-04-10.md)
- [TECH-s14-2026-04-10](./TECH-s14-2026-04-10.md)
- [TECH-s14-loop27-2026-04-10](./TECH-s14-loop27-2026-04-10.md)
- [TECH-sdk-cli-operator](./TECH-sdk-cli-operator.md)
- [TECH-sdk-container-readme-version-placeholderdesign-2026-04-08](./TECH-sdk-container-readme-version-placeholderdesign-2026-04-08.md)
- [TECH-sdk-leaf-readme-release-boundarydesign-2026-04-08](./TECH-sdk-leaf-readme-release-boundarydesign-2026-04-08.md)
- [TECH-sdk-leaf-readme-version-placeholderdesign-2026-04-08](./TECH-sdk-leaf-readme-version-placeholderdesign-2026-04-08.md)
- [TECH-sdk-release-catalog-schemadesign-2026-04-08](./TECH-sdk-release-catalog-schemadesign-2026-04-08.md)
- [TECH-sdk-release-catalogdesign-2026-04-08](./TECH-sdk-release-catalogdesign-2026-04-08.md)
- [TECH-sdk-release-version-placeholderdesign-2026-04-08](./TECH-sdk-release-version-placeholderdesign-2026-04-08.md)
- [TECH-sdkwork-im-rtc-complete-integration-guide](./TECH-sdkwork-im-rtc-complete-integration-guide.md)
- [TECH-server-installation](./TECH-server-installation.md)
- [TECH-server-lifecycle](./TECH-server-lifecycle.md)
- [TECH-server-postgresql](./TECH-server-postgresql.md)
- [TECH-server-service-standard](./TECH-server-service-standard.md)
- [TECH-session-and-presence](./TECH-session-and-presence.md)
- [TECH-session-and-realtime](./TECH-session-and-realtime.md)
- [TECH-session-bootstrap](./TECH-session-bootstrap.md)
- [TECH-slogovernancedesign-2026-04-06](./TECH-slogovernancedesign-2026-04-06.md)
- [TECH-social-runtime](./TECH-social-runtime.md)
- [TECH-social](./TECH-social.md)
- [TECH-start-agent-response](./TECH-start-agent-response.md)
- [TECH-step-00-2026-04-07](./TECH-step-00-2026-04-07.md)
- [TECH-step-00-architecture-2026-04-07](./TECH-step-00-architecture-2026-04-07.md)
- [TECH-step-00-audit-2026-04-07](./TECH-step-00-audit-2026-04-07.md)
- [TECH-step-01-2026-04-07](./TECH-step-01-2026-04-07.md)
- [TECH-step-01-architecture-2026-04-07](./TECH-step-01-architecture-2026-04-07.md)
- [TECH-step-01-audit-2026-04-07-2](./TECH-step-01-audit-2026-04-07-2.md)
- [TECH-step-01-audit-2026-04-07](./TECH-step-01-audit-2026-04-07.md)
- [TECH-step-02-2026-04-07](./TECH-step-02-2026-04-07.md)
- [TECH-step-02-architecture-2026-04-07](./TECH-step-02-architecture-2026-04-07.md)
- [TECH-step-02-audit-2026-04-07](./TECH-step-02-audit-2026-04-07.md)
- [TECH-step-02-workspace-crate-2026-04-07](./TECH-step-02-workspace-crate-2026-04-07.md)
- [TECH-step-04-architecture-2026-04-07](./TECH-step-04-architecture-2026-04-07.md)
- [TECH-step-04-audit-2026-04-07](./TECH-step-04-audit-2026-04-07.md)
- [TECH-step-05-cp05-1-message-locator-2026-04-07](./TECH-step-05-cp05-1-message-locator-2026-04-07.md)
- [TECH-step-05-cp05-1-message-locator-architecture-2026-04-07](./TECH-step-05-cp05-1-message-locator-architecture-2026-04-07.md)
- [TECH-step-05-cp05-1-message-locator-audit-2026-04-07](./TECH-step-05-cp05-1-message-locator-audit-2026-04-07.md)
- [TECH-step-05-cp05-2-auth-context-sender-2026-04-07](./TECH-step-05-cp05-2-auth-context-sender-2026-04-07.md)
- [TECH-step-05-cp05-2-auth-context-sender-architecture-2026-04-07](./TECH-step-05-cp05-2-auth-context-sender-architecture-2026-04-07.md)
- [TECH-step-05-cp05-2-auth-context-sender-audit-2026-04-07](./TECH-step-05-cp05-2-auth-context-sender-audit-2026-04-07.md)
- [TECH-step-05-cp05-2-downstream-authority-consumer-auth-context-architecture-2026-04-0](./TECH-step-05-cp05-2-downstream-authority-consumer-auth-context-architecture-2026-04-0.md)
- [TECH-step-05-cp05-2-downstream-authority-consumer-auth-context-audit-2026-04-07](./TECH-step-05-cp05-2-downstream-authority-consumer-auth-context-audit-2026-04-07.md)
- [TECH-step-05-cp05-2-non-message-command-auth-context-2026-04-07](./TECH-step-05-cp05-2-non-message-command-auth-context-2026-04-07.md)
- [TECH-step-05-cp05-2-non-message-command-auth-context-architecture-2026-04-07](./TECH-step-05-cp05-2-non-message-command-auth-context-architecture-2026-04-07.md)
- [TECH-step-05-cp05-2-non-message-command-auth-context-audit-2026-04-07](./TECH-step-05-cp05-2-non-message-command-auth-context-audit-2026-04-07.md)
- [TECH-step-05-cp05-2-projection-auth-context-entrypoints-architecture-2026-04-07](./TECH-step-05-cp05-2-projection-auth-context-entrypoints-architecture-2026-04-07.md)
- [TECH-step-05-cp05-2-projection-auth-context-entrypoints-audit-2026-04-07](./TECH-step-05-cp05-2-projection-auth-context-entrypoints-audit-2026-04-07.md)
- [TECH-step-05-cp05-2-read-query-auth-context-entrypoints-2026-04-07](./TECH-step-05-cp05-2-read-query-auth-context-entrypoints-2026-04-07.md)
- [TECH-step-05-cp05-2-read-query-auth-context-entrypoints-architecture-2026-04-07](./TECH-step-05-cp05-2-read-query-auth-context-entrypoints-architecture-2026-04-07.md)
- [TECH-step-05-cp05-2-read-query-auth-context-entrypoints-audit-2026-04-07](./TECH-step-05-cp05-2-read-query-auth-context-entrypoints-audit-2026-04-07.md)
- [TECH-step-05-cp05-2-runtime-auth-context-entrypoints-2026-04-07](./TECH-step-05-cp05-2-runtime-auth-context-entrypoints-2026-04-07.md)
- [TECH-step-05-cp05-2-runtime-auth-context-entrypoints-architecture-2026-04-07](./TECH-step-05-cp05-2-runtime-auth-context-entrypoints-architecture-2026-04-07.md)
- [TECH-step-05-cp05-2-runtime-auth-context-entrypoints-audit-2026-04-07](./TECH-step-05-cp05-2-runtime-auth-context-entrypoints-audit-2026-04-07.md)
- [TECH-step-05-cp05-3-direct-group-channel-mainline-scenario-owner-2026-04-07](./TECH-step-05-cp05-3-direct-group-channel-mainline-scenario-owner-2026-04-07.md)
- [TECH-step-05-cp05-3-direct-group-channel-mainline-scenario-owner-architecture-2026-04](./TECH-step-05-cp05-3-direct-group-channel-mainline-scenario-owner-architecture-2026-04.md)
- [TECH-step-05-cp05-3-direct-group-channel-mainline-scenario-owner-audit-2026-04-07](./TECH-step-05-cp05-3-direct-group-channel-mainline-scenario-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-automation-result-notification-owner-2026-04-07](./TECH-step-05-cp05-4-automation-result-notification-owner-2026-04-07.md)
- [TECH-step-05-cp05-4-automation-result-notification-owner-architecture-2026-04-07](./TECH-step-05-cp05-4-automation-result-notification-owner-architecture-2026-04-07.md)
- [TECH-step-05-cp05-4-message-notification-fanout-owner-2026-04-07](./TECH-step-05-cp05-4-message-notification-fanout-owner-2026-04-07.md)
- [TECH-step-05-cp05-4-message-notification-fanout-owner-architecture-2026-04-07](./TECH-step-05-cp05-4-message-notification-fanout-owner-architecture-2026-04-07.md)
- [TECH-step-05-cp05-4-message-notification-fanout-owner-audit-2026-04-07](./TECH-step-05-cp05-4-message-notification-fanout-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-message-posted-notification-request-owner-architecture-2026-04-07](./TECH-step-05-cp05-4-message-posted-notification-request-owner-architecture-2026-04-07.md)
- [TECH-step-05-cp05-4-message-posted-notification-request-owner-audit-2026-04-07](./TECH-step-05-cp05-4-message-posted-notification-request-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-message-posted-projection-recipient-owner-architecture-2026-04-07](./TECH-step-05-cp05-4-message-posted-projection-recipient-owner-architecture-2026-04-07.md)
- [TECH-step-05-cp05-4-message-posted-projection-recipient-owner-audit-2026-04-07](./TECH-step-05-cp05-4-message-posted-projection-recipient-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-notification-public-access-owner-2026-04-07](./TECH-step-05-cp05-4-notification-public-access-owner-2026-04-07.md)
- [TECH-step-05-cp05-4-notification-public-access-owner-architecture-2026-04-07](./TECH-step-05-cp05-4-notification-public-access-owner-architecture-2026-04-07.md)
- [TECH-step-05-cp05-4-notification-public-access-owner-audit-2026-04-07](./TECH-step-05-cp05-4-notification-public-access-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-projection-active-principal-auth-context-owner-2026-04-07](./TECH-step-05-cp05-4-projection-active-principal-auth-context-owner-2026-04-07.md)
- [TECH-step-05-cp05-4-projection-active-principal-auth-context-owner-architecture-2026](./TECH-step-05-cp05-4-projection-active-principal-auth-context-owner-architecture-2026.md)
- [TECH-step-05-cp05-4-projection-active-principal-auth-context-owner-audit-2026-04-07](./TECH-step-05-cp05-4-projection-active-principal-auth-context-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-projection-realtime-fanout-auth-context-owner-2026-04-07](./TECH-step-05-cp05-4-projection-realtime-fanout-auth-context-owner-2026-04-07.md)
- [TECH-step-05-cp05-4-projection-realtime-fanout-auth-context-owner-architecture-2026-0](./TECH-step-05-cp05-4-projection-realtime-fanout-auth-context-owner-architecture-2026-0.md)
- [TECH-step-05-cp05-4-projection-realtime-fanout-auth-context-owner-audit-2026-04-07](./TECH-step-05-cp05-4-projection-realtime-fanout-auth-context-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-projection-realtime-fanout-target-owner-2026-04-07](./TECH-step-05-cp05-4-projection-realtime-fanout-target-owner-2026-04-07.md)
- [TECH-step-05-cp05-4-projection-realtime-fanout-target-owner-architecture-2026-04-07](./TECH-step-05-cp05-4-projection-realtime-fanout-target-owner-architecture-2026-04-07.md)
- [TECH-step-05-cp05-4-projection-realtime-fanout-target-owner-audit-2026-04-07](./TECH-step-05-cp05-4-projection-realtime-fanout-target-owner-audit-2026-04-07.md)
- [TECH-step-05-cp05-4-session-gateway-sync-state-store-owner-architecture-2026-04-07](./TECH-step-05-cp05-4-session-gateway-sync-state-store-owner-architecture-2026-04-07.md)
- [TECH-step-06-2026-04-07](./TECH-step-06-2026-04-07.md)
- [TECH-step-06-architecture-2026-04-07](./TECH-step-06-architecture-2026-04-07.md)
- [TECH-step-06-audit-2026-04-07](./TECH-step-06-audit-2026-04-07.md)
- [TECH-step-07-2026-04-07](./TECH-step-07-2026-04-07.md)
- [TECH-step-07-architecture-2026-04-07](./TECH-step-07-architecture-2026-04-07.md)
- [TECH-step-07-audit-2026-04-07](./TECH-step-07-audit-2026-04-07.md)
- [TECH-step-07-cp07-2-2026-04-07](./TECH-step-07-cp07-2-2026-04-07.md)
- [TECH-step-07-cp07-2-architecture-2026-04-07](./TECH-step-07-cp07-2-architecture-2026-04-07.md)
- [TECH-step-07-cp07-2-audit-2026-04-07](./TECH-step-07-cp07-2-audit-2026-04-07.md)
- [TECH-step-07-cp07-3-2026-04-07](./TECH-step-07-cp07-3-2026-04-07.md)
- [TECH-step-07-cp07-3-architecture-2026-04-07](./TECH-step-07-cp07-3-architecture-2026-04-07.md)
- [TECH-step-07-cp07-3-audit-2026-04-07](./TECH-step-07-cp07-3-audit-2026-04-07.md)
- [TECH-step-07-cp07-4-2026-04-07](./TECH-step-07-cp07-4-2026-04-07.md)
- [TECH-step-07-cp07-4-architecture-2026-04-07](./TECH-step-07-cp07-4-architecture-2026-04-07.md)
- [TECH-step-07-cp07-4-audit-2026-04-07](./TECH-step-07-cp07-4-audit-2026-04-07.md)
- [TECH-step-08-architecture-2026-04-08](./TECH-step-08-architecture-2026-04-08.md)
- [TECH-step-08-cp08-2-architecture-2026-04-07](./TECH-step-08-cp08-2-architecture-2026-04-07.md)
- [TECH-step-08-cp08-2-audit-2026-04-07](./TECH-step-08-cp08-2-audit-2026-04-07.md)
- [TECH-step-09-architecture-2026-04-08](./TECH-step-09-architecture-2026-04-08.md)
- [TECH-step-09-cp09-1-local-disk-storage-port-2026-04-08](./TECH-step-09-cp09-1-local-disk-storage-port-2026-04-08.md)
- [TECH-step-09-cp09-1-local-disk-storage-port-architecture-2026-04-08](./TECH-step-09-cp09-1-local-disk-storage-port-architecture-2026-04-08.md)
- [TECH-step-09-cp09-1-local-disk-storage-port-audit-2026-04-08](./TECH-step-09-cp09-1-local-disk-storage-port-audit-2026-04-08.md)
- [TECH-step-09-cp09-2-projection-snapshot-rebuild-2026-04-08](./TECH-step-09-cp09-2-projection-snapshot-rebuild-2026-04-08.md)
- [TECH-step-09-cp09-2-projection-snapshot-rebuild-architecture-2026-04-08](./TECH-step-09-cp09-2-projection-snapshot-rebuild-architecture-2026-04-08.md)
- [TECH-step-09-cp09-2-projection-snapshot-rebuild-audit-2026-04-08](./TECH-step-09-cp09-2-projection-snapshot-rebuild-audit-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-live-lag-observability-2026-04-08](./TECH-step-09-cp09-3-projection-live-lag-observability-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-live-lag-observability-architecture-2026-04-08](./TECH-step-09-cp09-3-projection-live-lag-observability-architecture-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-live-lag-observability-audit-2026-04-08](./TECH-step-09-cp09-3-projection-live-lag-observability-audit-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-plane-observability-architecture-2026-04-08](./TECH-step-09-cp09-3-projection-plane-observability-architecture-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-rebuild-duration-observability-2026-04-08](./TECH-step-09-cp09-3-projection-rebuild-duration-observability-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-rebuild-duration-observability-architecture-2026-04-08](./TECH-step-09-cp09-3-projection-rebuild-duration-observability-architecture-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-rebuild-duration-observability-audit-2026-04-08](./TECH-step-09-cp09-3-projection-rebuild-duration-observability-audit-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-replay-lag-observability-architecture-2026-04-08](./TECH-step-09-cp09-3-projection-replay-lag-observability-architecture-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-replay-status-throughput-2026-04-08](./TECH-step-09-cp09-3-projection-replay-status-throughput-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-replay-status-throughput-architecture-2026-04-08](./TECH-step-09-cp09-3-projection-replay-status-throughput-architecture-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-replay-status-throughput-audit-2026-04-08](./TECH-step-09-cp09-3-projection-replay-status-throughput-audit-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-update-delay-observability-2026-04-08](./TECH-step-09-cp09-3-projection-update-delay-observability-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-update-delay-observability-architecture-2026-04-08](./TECH-step-09-cp09-3-projection-update-delay-observability-architecture-2026-04-08.md)
- [TECH-step-09-cp09-3-projection-update-delay-observability-audit-2026-04-08](./TECH-step-09-cp09-3-projection-update-delay-observability-audit-2026-04-08.md)
- [TECH-step-09-cp09-4-runtime-backup-archive-path-2026-04-08](./TECH-step-09-cp09-4-runtime-backup-archive-path-2026-04-08.md)
- [TECH-step-09-cp09-4-runtime-backup-archive-path-architecture-2026-04-08](./TECH-step-09-cp09-4-runtime-backup-archive-path-architecture-2026-04-08.md)
- [TECH-step-09-cp09-4-runtime-backup-archive-path-audit-2026-04-08](./TECH-step-09-cp09-4-runtime-backup-archive-path-audit-2026-04-08.md)
- [TECH-step-09-cp09-4-runtime-backup-archive-retention-lifecycle-2026-04-08](./TECH-step-09-cp09-4-runtime-backup-archive-retention-lifecycle-2026-04-08.md)
- [TECH-step-09-cp09-4-runtime-backup-archive-retention-lifecycle-architecture-2026-04-0](./TECH-step-09-cp09-4-runtime-backup-archive-retention-lifecycle-architecture-2026-04-0.md)
- [TECH-step-09-cp09-4-runtime-backup-archive-retention-lifecycle-audit-2026-04-08](./TECH-step-09-cp09-4-runtime-backup-archive-retention-lifecycle-audit-2026-04-08.md)
- [TECH-step-10-2026-04-08](./TECH-step-10-2026-04-08.md)
- [TECH-step-10-architecture-2026-04-08](./TECH-step-10-architecture-2026-04-08.md)
- [TECH-step-10-audit-2026-04-08](./TECH-step-10-audit-2026-04-08.md)
- [TECH-step-10-cp10-1-bin-command-surface-freeze-2026-04-08](./TECH-step-10-cp10-1-bin-command-surface-freeze-2026-04-08.md)
- [TECH-step-10-cp10-1-bin-command-surface-freeze-architecture-2026-04-08](./TECH-step-10-cp10-1-bin-command-surface-freeze-architecture-2026-04-08.md)
- [TECH-step-10-cp10-1-bin-command-surface-freeze-audit-2026-04-08](./TECH-step-10-cp10-1-bin-command-surface-freeze-audit-2026-04-08.md)
- [TECH-step-10-cp10-2-multi-profile-template-contract-2026-04-08](./TECH-step-10-cp10-2-multi-profile-template-contract-2026-04-08.md)
- [TECH-step-10-cp10-2-multi-profile-template-contract-architecture-2026-04-08](./TECH-step-10-cp10-2-multi-profile-template-contract-architecture-2026-04-08.md)
- [TECH-step-10-cp10-2-multi-profile-template-contract-audit-2026-04-08](./TECH-step-10-cp10-2-multi-profile-template-contract-audit-2026-04-08.md)
- [TECH-step-10-cp10-3-public-smoke-signed-bearer-contract-2026-04-08](./TECH-step-10-cp10-3-public-smoke-signed-bearer-contract-2026-04-08.md)
- [TECH-step-10-cp10-3-public-smoke-signed-bearer-contract-architecture-2026-04-08](./TECH-step-10-cp10-3-public-smoke-signed-bearer-contract-architecture-2026-04-08.md)
- [TECH-step-10-cp10-3-public-smoke-signed-bearer-contract-audit-2026-04-08](./TECH-step-10-cp10-3-public-smoke-signed-bearer-contract-audit-2026-04-08.md)
- [TECH-step-10-cp10-3-smoke-base-url-contract-2026-04-08](./TECH-step-10-cp10-3-smoke-base-url-contract-2026-04-08.md)
- [TECH-step-10-cp10-3-smoke-base-url-contract-architecture-2026-04-08](./TECH-step-10-cp10-3-smoke-base-url-contract-architecture-2026-04-08.md)
- [TECH-step-10-cp10-3-smoke-base-url-contract-audit-2026-04-08](./TECH-step-10-cp10-3-smoke-base-url-contract-audit-2026-04-08.md)
- [TECH-step-10-cp10-4-runtime-ops-profile-contract-2026-04-08](./TECH-step-10-cp10-4-runtime-ops-profile-contract-2026-04-08.md)
- [TECH-step-10-cp10-4-runtime-ops-profile-contract-architecture-2026-04-08](./TECH-step-10-cp10-4-runtime-ops-profile-contract-architecture-2026-04-08.md)
- [TECH-step-10-cp10-4-runtime-ops-profile-contract-audit-2026-04-08](./TECH-step-10-cp10-4-runtime-ops-profile-contract-audit-2026-04-08.md)
- [TECH-step-11-2026-04-08-2](./TECH-step-11-2026-04-08-2.md)
- [TECH-step-11-2026-04-08-3](./TECH-step-11-2026-04-08-3.md)
- [TECH-step-11-2026-04-08](./TECH-step-11-2026-04-08.md)
- [TECH-step-11-architecture-2026-04-08-2](./TECH-step-11-architecture-2026-04-08-2.md)
- [TECH-step-11-architecture-2026-04-08](./TECH-step-11-architecture-2026-04-08.md)
- [TECH-step-11-cp11-1-performance-2026-04-08](./TECH-step-11-cp11-1-performance-2026-04-08.md)
- [TECH-step-11-cp11-1-performance-architecture-2026-04-08](./TECH-step-11-cp11-1-performance-architecture-2026-04-08.md)
- [TECH-step-11-cp11-1-performance-audit-2026-04-08](./TECH-step-11-cp11-1-performance-audit-2026-04-08.md)
- [TECH-step-11-cp11-2-2026-04-08](./TECH-step-11-cp11-2-2026-04-08.md)
- [TECH-step-11-cp11-2-architecture-2026-04-08](./TECH-step-11-cp11-2-architecture-2026-04-08.md)
- [TECH-step-11-cp11-2-audit-2026-04-08](./TECH-step-11-cp11-2-audit-2026-04-08.md)
- [TECH-step-11-cp11-3-2026-04-08](./TECH-step-11-cp11-3-2026-04-08.md)
- [TECH-step-11-cp11-3-architecture-2026-04-08](./TECH-step-11-cp11-3-architecture-2026-04-08.md)
- [TECH-step-11-cp11-3-audit-2026-04-08](./TECH-step-11-cp11-3-audit-2026-04-08.md)
- [TECH-step-11-cp11-4-2026-04-08](./TECH-step-11-cp11-4-2026-04-08.md)
- [TECH-step-11-cp11-4-architecture-2026-04-08](./TECH-step-11-cp11-4-architecture-2026-04-08.md)
- [TECH-step-11-cp11-4-audit-2026-04-08](./TECH-step-11-cp11-4-audit-2026-04-08.md)
- [TECH-step-11-performance-ha-dr-2026-04-08](./TECH-step-11-performance-ha-dr-2026-04-08.md)
- [TECH-step-12-2026-04-08](./TECH-step-12-2026-04-08.md)
- [TECH-step-12-architecture-2026-04-08-2](./TECH-step-12-architecture-2026-04-08-2.md)
- [TECH-step-12-architecture-2026-04-08](./TECH-step-12-architecture-2026-04-08.md)
- [TECH-step-12-cp12-1-cli-2026-04-08](./TECH-step-12-cp12-1-cli-2026-04-08.md)
- [TECH-step-12-cp12-1-cli-architecture-2026-04-08](./TECH-step-12-cp12-1-cli-architecture-2026-04-08.md)
- [TECH-step-12-cp12-1-cli-audit-2026-04-08](./TECH-step-12-cp12-1-cli-audit-2026-04-08.md)
- [TECH-step-12-cp12-2-sdk-readmefacadeboundaries-2026-04-08](./TECH-step-12-cp12-2-sdk-readmefacadeboundaries-2026-04-08.md)
- [TECH-step-12-cp12-2-sdk-readmefacadeboundaries-architecture-2026-04-08](./TECH-step-12-cp12-2-sdk-readmefacadeboundaries-architecture-2026-04-08.md)
- [TECH-step-12-cp12-2-sdk-readmefacadeboundaries-audit-2026-04-08](./TECH-step-12-cp12-2-sdk-readmefacadeboundaries-audit-2026-04-08.md)
- [TECH-step-12-cp12-3-testing-2026-04-08](./TECH-step-12-cp12-3-testing-2026-04-08.md)
- [TECH-step-12-cp12-3-testing-architecture-2026-04-08](./TECH-step-12-cp12-3-testing-architecture-2026-04-08.md)
- [TECH-step-12-cp12-3-testing-audit-2026-04-08](./TECH-step-12-cp12-3-testing-audit-2026-04-08.md)
- [TECH-step-12-cp12-4-2026-04-08](./TECH-step-12-cp12-4-2026-04-08.md)
- [TECH-step-12-cp12-4-architecture-2026-04-08](./TECH-step-12-cp12-4-architecture-2026-04-08.md)
- [TECH-step-12-cp12-4-audit-2026-04-08](./TECH-step-12-cp12-4-audit-2026-04-08.md)
- [TECH-step-13-architecture-2026-04-08-2](./TECH-step-13-architecture-2026-04-08-2.md)
- [TECH-step-13-architecture-2026-04-08](./TECH-step-13-architecture-2026-04-08.md)
- [TECH-step-13-go-no-go-2026-04-08](./TECH-step-13-go-no-go-2026-04-08.md)
- [TECH-step-13-next-wave-backlog-2026-04-08](./TECH-step-13-next-wave-backlog-2026-04-08.md)
- [TECH-step-13-release-readiness-2026-04-08](./TECH-step-13-release-readiness-2026-04-08.md)
- [TECH-step-2026-04-10](./TECH-step-2026-04-10.md)
- [TECH-step](./TECH-step.md)
- [TECH-step11-failover-scenario-catalogdesign-2026-04-08](./TECH-step11-failover-scenario-catalogdesign-2026-04-08.md)
- [TECH-storage-management](./TECH-storage-management.md)
- [TECH-stream-and-rtc](./TECH-stream-and-rtc.md)
- [TECH-streams-2](./TECH-streams-2.md)
- [TECH-streams](./TECH-streams.md)
- [TECH-submit-friend-request](./TECH-submit-friend-request.md)
- [TECH-swift-sdk](./TECH-swift-sdk.md)
- [TECH-sync-realtime-subscriptions](./TECH-sync-realtime-subscriptions.md)
- [TECH-takeover-pending-shared-channel-sync-targeted](./TECH-takeover-pending-shared-channel-sync-targeted.md)
- [TECH-topology-greenfield](./TECH-topology-greenfield.md)
- [TECH-topology-standard](./TECH-topology-standard.md)
- [TECH-transfer-owner](./TECH-transfer-owner.md)
- [TECH-typescript-quick-start](./TECH-typescript-quick-start.md)
- [TECH-typescript-sdk](./TECH-typescript-sdk.md)
- [TECH-ubuntuwsl-postgresql](./TECH-ubuntuwsl-postgresql.md)
- [TECH-update-read-cursor](./TECH-update-read-cursor.md)
- [TECH-upsert-provider-binding-policy](./TECH-upsert-provider-binding-policy.md)
- [TECH-verify-audit-chain](./TECH-verify-audit-chain.md)
- [TECH-wave-b-93-2026-04-07](./TECH-wave-b-93-2026-04-07.md)
- [TECH-wave-c-93-2026-04-08](./TECH-wave-c-93-2026-04-08.md)
- [TECH-wave-d-93-2026-04-08](./TECH-wave-d-93-2026-04-08.md)
- [TECH-windows-visible-chat-gui-validation-standard-2026-04-06](./TECH-windows-visible-chat-gui-validation-standard-2026-04-06.md)

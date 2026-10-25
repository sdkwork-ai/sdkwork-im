# SDKWork IM 全量审计与商业化落地评估

Status: active
Owner: `im-platform`
Review: `REVIEW-2026-1021`
Date: 2026-10-21
Scope: 契约（`apis/`、`database/`）、Rust 服务与适配器（`crates/`、`services/`、`adapters/`）、客户端（`apps/sdkwork-im-pc|h5|flutter-mobile`）、SDK（`sdks/`）、交付与合规资产（`deployments/`、`artifacts/`、`docs/`）
Specs: `API_SPEC.md`、`PAGINATION_SPEC.md`、`DATABASE_SPEC.md`、`DATABASE_FRAMEWORK_SPEC.md`、`RUST_CODE_SPEC.md`、`SECURITY_SPEC.md`、`FRONTEND_CODE_SPEC.md`、`TYPESCRIPT_CODE_SPEC.md`、`TEST_SPEC.md`、`QUALITY_GATE_SPEC.md`、`RELEASE_SPEC.md`、`DOCUMENTATION_SPEC.md`
Related: [PRD](../../product/prd/PRD.md)、[TECH_ARCHITECTURE](../../architecture/tech/TECH_ARCHITECTURE.md)、[REQ-2026-0722](../../product/requirements/REQ-2026-0722-normalized-im-authority.md)、[ADR-20260722](../../architecture/decisions/ADR-20260722-normalized-im-authority.md)

## 0. 结论摘要

**核心骨架是真实实现，但当前仍不具备商业化交付能力；本轮已关闭 4 个 P0 与 2 个 P1。**

- 已修复：实时连接每分钟全量断开（P0-1）、群知识库组织哨兵与 CHECK 冲突（P0-3）、
  云部署 Redis 键名/未定义 Secret（P0-4）、多副本实时总线未接线（P0-5）；
  以及 journal 冲突恢复参数绑定、测试资产 lint 编译失败。
- 已完成 P0-2 主体：inbox、成员偏好、summary、profile、favorites 改为 PostgreSQL 权威读取；
  设备投递回执按实时语义关闭，不要求持久表（§3 P0-2 结论）。
- 仍阻断商业化：容量/预发布证据为回填数据（P0-6）；计费/计量/配额、GDPR 删除/导出、
  真实 SBOM/签名/provenance、许可证一致性均缺失。
- 跨仓库构建阻断：`sdkwork-knowledgebase` 当前编译失败，standalone 网关无法完成构建；
  该问题不在本仓库内，修复前任何“可发布”结论不成立。
- 分页：会话/社交/通知/审计合格；space、社交黑名单/私聊、通话信令仍静默 clamp + 明文 cursor；
  4 个后端 social runtime 列表整表返回。
- SQLite 仅用于 PC 桌面离线缓存（真实实现），服务端仅 PostgreSQL，符合 TECH §10；
  但客户端 schema 升级会连同未发送队列一起删库（P1-D13）。

## 1. 审计方法与证据

### 1.1 已执行的验证命令

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `check-pagination.mjs --workspace .` | PASS | 只检查 OpenAPI 文本，不检查 handler 行为 |
| `check-api-response-envelope.mjs --workspace .` | PASS | 只检查 envelope 引用 |
| `check-api-operation-patterns.mjs --workspace .` | PASS | 不检查 handler/DTO/分页执行 |
| `sdkwork-im-multi-tenant-isolation-contract.test.mjs` | PASS（682 文件，0 gap） | 静态 SQL 谓词扫描 |
| `generate-contract-inventories.mjs --check` | PASS（已重新生成） | 216 HTTP operations / 58 tables |
| `check-api-runtime-parity.mjs --workspace .` | **FAIL** | 无 `api-runtime-parity.*.evidence.json` |
| `materialize_im_database_contract.mjs` | PASS | 58 张表与 baseline+migrations 一致 |
| `cargo test -p sdkwork-comms-conversation-service --lib` | PASS（169 passed） | inbox/偏好/summary/profile/favorites + typing 窗口/游标测试 |
| `pnpm --dir sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript run typecheck` | PASS | 生成后 facade 修复 `dist` import 顺序 |
| `cargo test -p session-gateway -p governance-service -p sdkwork-im-runtime-route --lib` | PASS（76/4/15） | int64 wire + realtime page limit |
| `cargo test -p social-service --lib` | PASS（39） | 含派生快照修复端点测试 |
| `cargo test -p session-gateway --lib` | PASS（79） | WS 限流真实对端/可信代理测试 |
| `cargo test -p im-app-context` | PASS（27） | JWT replay tenant key + 陈旧 scope 断言修正 |
| `cargo test -p im-adapters-redis-cache --lib jwt_replay` | PASS（1） | replay key 哈希/租户隔离 |
| `cargo test -p im-adapters-redis-cache --lib` | PASS（25） | Lua 原子限流 + §2.32 seq 播种 |
| `cargo test -p im-adapters-postgres-journal --lib outbox` | PASS（12） | outbox 失败原因落库/截断 |
| `cargo test -p im-adapters-postgres-journal --lib` | PASS（64） | §2.19/§2.31/§2.33 适配器全量 |
| app SDK family 全量重新生成 + TS `publish-core check` | PASS | §2.20 幽灵操作清除（9 语言 0 命中） |
| `node ./bin/publish-core.mjs --language typescript --action check`（backend generated） | PASS | §2.10 后端 SDK 生成 + build |
| `node ./bin/publish-core.mjs --language typescript --action check`（generated/server-openapi） | PASS | 生成 SDK 的 check + build |
| `cargo check -p sdkwork-comms-conversation-service --all-targets` | PASS | — |
| `cargo check -p im-adapters-postgres-journal --all-targets` | PASS | 含 live 集成测试 |
| `cargo test -p sdkwork-im-contract-control --lib realtime_scope_key` | PASS（3） | scope key 解码器 |
| `cargo test -p session-gateway --lib test_cleanup_keeps_route_epoch_notifiers` | PASS | P0-1 回归 |
| `cargo check --all-targets`（6 个受 lint 影响 crate） | 全部 PASS | §2.5 |
| `check-database-framework-standard.mjs --root .` | PASS | 含迁移可逆性元数据 |
| `sdkwork-im-database-framework-standard.test.mjs` | PASS | — |
| `sdkwork-im-database-naming-standard.test.mjs` | PASS | 表集合改为从 lifecycle SQL 推导 |
| `sdkwork-im-knowledgebase-org-sentinel.test.mjs` | PASS | baseline/迁移/运行时三方一致 |
| `sdkwork-im-cloud-runtime-env-contract.test.mjs` | PASS（11 deployments / 1 secret） | 部署清单 ↔ 运行时常量 |
| `sdkwork-im-normalized-authority-standard.test.mjs` | PASS（2.7s） | §2.7 修复 OOM/符号链接环 |
| `sdkwork-im-deployment-security-posture.test.mjs` | PASS（3 policies/10 nginx/limit_zone） | §2.13 网络边界/body 上限 + §2.26 API 限流 |
| `sdkwork-im-friend-request-pair-invariant.test.mjs` | PASS | §2.16 pending pair 唯一不变量 |
| `cargo test -p sdkwork-im-service-readiness` | PASS（10） | §2.17 迁移头 + §2.27 凭证验证器 |
| `sdkwork-im-tauri-security-posture.test.mjs` | PASS | §2.18 shell 允许列表 + §2.25 CSP/freezePrototype |
| `cargo test -p audit-service --test http_smoke_test` | PASS（8） | §2.21 IAM-aware 测试基座 |
| `cargo test -p streaming-service --test http_smoke_test` | PASS（7） | §2.21 同上 |
| `cargo test -p audit-service -p streaming-service` | PASS（25 / 34） | §2.21 全量回归 |
| `cargo test -p ops-service -p audit-service -p governance-service --quiet` | PASS（exit 0） | §2.22 backend route 权限 |
| `cargo test -p space-service -p social-service -p calls-service` | PASS（exit 0） | §2.28 分页严格校验 + §2.29/§2.30 签名 cursor |
| `cargo test -p sdkwork-im-keyset-cursor` | PASS（2） | §2.29 签名 keyset cursor |
| `cargo test -p sdkwork-api-product-runtime` | PASS（31） | §2.35 代理客户端超时 |
| `cargo test -p automation-service -p governance-service -p sdkwork-im-web-bootstrap` | PASS（exit 0） | §2.36 manifest operationId 对齐 + §2.37 actor-kind 映射 |
| `cargo test -p im-platform-contracts -p im-adapters-postgres-journal -p sdkwork-comms-conversation-service --lib` | PASS（6 / 63 / 169） | §2.31 outbox scope 轮转 |
| `cargo test -p audit-service` | PASS（26） | §2.23 签名 audit cursor |
| backend SDK `publish-core --action check` | PASS | §2.23 cursor 契约重新生成 |
| `check-pnpm-script-standard.mjs --root . --product-prefix im,chat` | PASS（250 root scripts） | — |
| `cargo check -p sdkwork-api-im-assembly` | **FAIL（本仓库外依赖）** | `sdkwork-knowledgebase/.../postgres_import_stores.rs:947-955` |

### 1.2 验证工具的真实盲区

- `check-api-operation-patterns` / `check-api-response-envelope`：只读 OpenAPI YAML，不读 Rust handler，
  不校验 `data` 形状、`page_size` 上限执行、manifest operationId、生成 SDK 与 RPC。
- `check-pagination`：只校验契约命名/默认值，不校验 handler 是 clamp 还是 40003，不校验整表返回。
- `check-api-runtime-parity`：无证据文件，运行时一致性未被证明。
- 租户隔离门禁是静态正则扫描，不是逐端点负向矩阵。
- `commercial-readiness.mjs` 读取已提交 JSON 的 `state`/`boundary`，不重算产物校验和。
- `cargo fmt --all -- --check` 当前不可用：`sdkwork-sdk-generator/rust` 以路径依赖被卷入但不属于本
  workspace，`cargo metadata` 直接报错；且 `session-gateway`、`redis-cache`、`postgres-journal`
  存在与本评审无关的历史格式漂移。

## 2. 已修复缺陷

### 2.1 [P0-4/P0-5] 云部署环境契约与实时 HA 接线 —— 已修复

**问题**

- Secret 只提供 `REDIS_URL`，而 readiness 读 `SDKWORK_IM_REDIS_URL`；cloud/prod + `REDIS_ENABLED=true`
  时 `/readyz` 必然 503。
- 11 个 Deployment 引用未定义的 `<service>-secrets`（`optional: false` 时 Pod 无法启动）。
- 3 副本 session-gateway 没有 `SDKWORK_IM_REALTIME_NODE_ID`/cluster-bus 配置，跨节点事件静默丢失。

**实施**

- `deployments/kubernetes/cloud/configmaps-and-secrets.yaml`：键改为运行时真实名称
  `SDKWORK_IM_REDIS_URL`、`SDKWORK_IM_APP_CONTEXT_JWT_SIGNING_SECRET`；新增
  `SDKWORK_IM_JWT_REPLAY_REDIS_URL`、`SDKWORK_IM_REALTIME_CLUSTER_BUS_URL`、
  `SDKWORK_IM_REALTIME_CLUSTER_BUS_SECRET`；删除失效的 `REDIS_URL`/`JWT_SIGNING_KEY`
  与无人引用的 `session-gateway-secrets`。
- 全部 Deployment 的 `secretRef`/`secretName` 统一指向已定义的 `sdkwork-im-shared-secrets`。
- `session-gateway` 增加 Downward API `metadata.name` 作为实时 node id。
- 新增 `scripts/dev/sdkwork-im-cloud-runtime-env-contract.test.mjs`
  （`pnpm test:cloud-runtime-env-contract`）：Secret 键必须与运行时源码常量一致、禁止遗留键、
  引用 Secret 必须已定义、每个 Deployment 必须 `production` + `cloud`、多副本必须使用唯一 Pod 名。

**验证**：契约测试 PASS（11 deployments / 1 secret）；全部 cloud YAML `parseAllDocuments` 通过；
`check-pnpm-script-standard` PASS。

### 2.2 [P0-2 主体] 会话读取模型改为 PostgreSQL 权威 —— 已实施

**已持久化**：inbox（含未读数）、成员偏好、conversation summary、conversation profile、message favorites。

- 契约端口：`crates/im-platform-contracts/src/conversation_inbox.rs`、
  `conversation_projection.rs`、`message_favorite_store.rs`。
- PostgreSQL 适配器：
  - `adapters/postgres-journal/src/inbox_store.rs`：`im_conversation_members JOIN im_conversations`
    + 读游标 + 有界未读计数 + 群/频道标题 + 私聊对端 + 偏好 + handoff，单条有界 SQL，无 OFFSET。
  - `conversation_projection_store.rs`：summary 摘要列 + handoff；profile 群/频道名回退 + read-modify-write。
  - `message_favorite_store.rs`：创建时由 SQL 解析 `message_seq`（消息不存在返回 None→404），
    `(favorited_at DESC, favorite_id DESC)` keyset，type/search 过滤。
- 服务接入：`conversation_state/{inbox,authority_views,message_favorites,bootstrap}.rs`、
  `access.rs`；权威模式下成员资格与 profile 权限由 `im_conversation_members` 判定，
  不再依赖进程缓存；持久化失败向上返回，不发布假缓存。
- 迁移：`0006_im_conversation_member_preferences`、`0007_im_conversation_profiles`、
  `0008_im_message_favorites`（均含 `.down.sql`，`reversible: true`）；
  `database/contract/{table-registry.json,schema.yaml}` 已同步（58 张表）。

**验证**：`cargo test -p sdkwork-comms-conversation-service --lib` → **169 passed**（含 inbox 映射/游标、
偏好跨实例重启、写失败不缓存、summary 权威读取、profile 持久化、favorites 分页/创建/删除）；
`materialize_im_database_contract.mjs` → 58 张表；live 集成测试覆盖两页 keyset、未读数 3、
群标题、私聊对端、类型/搜索过滤、偏好/summary/profile/favorites 回读。

**剩余**：无；设备投递回执按实时语义设计关闭（§3 P0-2 结论），
pins/interaction summary 已改为 PostgreSQL 冷回退（§2.38）。

**部署动作**：执行 `pnpm db:postgres:migrate` 应用 0006–0009；缺表时权威查询 fail-closed。

### 2.3 [P0-1] 实时连接每分钟被集群级全量断开 —— 已修复

- 根因：`cluster.rs:256/:314` 用 `split(':')` 解析 `{len}:{value}|...` 格式的 scope key，
  每个 key 都被判为非法并从 `route_epoch_notifiers` 删除；`watch::Sender` drop 后
  `websocket.rs:775`、`link_realtime.rs:302` 直接退出连接。清理每 60 秒执行一次。
- 修复：契约 crate 新增 `realtime_scope_key_components()` 严格解码；
  `cluster.rs` 新增 `decode_client_route_scope_key()`，notifier 与 disconnect-fence 两处复用，
  并按 `RouteStore::lookup`/`load_fence` 参数顺序正确映射。
- 回归测试：scope key round-trip/分隔符/畸形 key；带活跃路由的 notifier 必须存活于清理周期。

**验证**：`realtime_scope_key` 3 tests PASS；`test_cleanup_keeps_route_epoch_notifiers` PASS。

### 2.4 [P1] journal 位置冲突恢复查询参数绑定错误 —— 已修复

`message_post_persistence.rs:2215` 只传 2 个参数，而 `LOAD_EVENT_BY_POSITION_SQL` 需要 4 个，
冲突恢复分支必然报错并映射为 503。已补齐 tenant/organization；`cargo check` PASS。
> 同一函数的加锁与序列分配缺失已在 §2.19 修复（P1-D2：分区 advisory lock + DB 序列重算）。

### 2.5 [P1] 测试资产无法编译（`unsafe_code = deny`）—— 已修复

7 个测试目标缺少 `#[allow(unsafe_code)]`，导致这些 crate 的 `cargo test` 完全不可运行
（含鉴权测试）。已按仓库既有模式（函数/模块级 allow + 理由注释）修复 8 个文件；
6 个受影响 crate `--all-targets` 全部 PASS。

### 2.6 [P1-A3] `conversations.typing.list` 契约与运行时数据形状不一致 —— 已修复

**问题**：OpenAPI 声明 `data: {items, pageInfo}`，运行时返回 `{conversationId, items}`；
生成的 SDK 类型读 `data.items` 永远为空，实时输入状态在客户端失效。

**实施**

- 运行时返回 `SdkWorkPageData<TypingIndicatorListItem>`（`items` + `pageInfo`），
  `pageInfo.mode=cursor`、`pageSize`、`hasMore`、`nextCursor` 完整。
- 新增 `page_size`（默认 20，上限 200）与 `cursor`：越界返回 40003，cursor 为
  HMAC 签名的不透明串，绑定 tenant/organization/conversation，跨会话复用被拒绝。
- 窗口化：按 `(user_kind, user_id)` 排序 + keyset，底层是 TTL 秒级过期的 ephemeral
  typing 缓存（有界维护索引，非全量扫描），与 PAGINATION_SPEC §2.3 一致。
- OpenAPI 补充 `PageSizeQuery`/`CursorQuery` 参数；契约/分页/信封校验全部通过。

**验证**：`cargo test -p sdkwork-comms-conversation-service --lib` → **169 passed**
（新增 `typing_window_orders_filters_and_reports_continuation`、
`typing_list_cursor_round_trips_and_rejects_cross_conversation_reuse`）；
`check-pagination` / `check-api-response-envelope` / `check-api-operation-patterns` PASS；
`generate-contract-inventories --check` 仍为 216 operations / 58 tables。

### 2.7 [P1-R12] 归一化权威门禁 OOM/超时 —— 已修复

**问题**：`sdkwork-im-normalized-authority-standard.test.mjs` 递归扫描 `apps/` 时进入
`node_modules` 的 junction（Dirent 对 junction 报告 `isDirectory()=false`，旧过滤失效）
与 `node_modules.__stale__donor_2`，把 71MB Flutter `.dill`、2MB source map 等二进制
当 UTF-8 读取并跑正则，最终 4GB heap OOM，运行约 87 分钟。

**修复**

- 按名称过滤（含 `node_modules*` 前缀）在 `stat` 之前执行，覆盖 junction 场景。
- 扩展忽略目录：`.dart_tool`、`.vite`、`dist-embed`、`test_cache`、`unit_test_assets`、
  `coverage`、`test-results`、`playwright-report`、`.gradle`、`obj`、`Pods` 等。
- 跳过二进制扩展名与 >4MB 文件；目录按 `realpath` 去重并限制深度，防止符号链接环。

**验证**：门禁从 **87 分钟 + OOM** 变为 **2.7 秒 PASS**（`normalized authority standard passed`）。

### 2.8 [P0-3] 群知识库写入与 DDL CHECK 互斥 —— 已修复

- baseline 两处约束改为 `organization_id = '0' OR (正整数 + int64 上界)`。
- 新增 `0009_im_knowledgebase_org_zero_sentinel.up.sql`：在线 `DROP CONSTRAINT` + 重建，
  `SET LOCAL lock_timeout/statement_timeout`，无数据重写。
- 新增 `sdkwork-im-knowledgebase-org-sentinel.test.mjs` 校验 baseline/迁移/运行时三方一致。
- 数据库命名门禁不再硬编码表数量，改为从 baseline+migrations 推导。

**部署动作**：执行 `pnpm db:postgres:migrate` 应用 0009。

### 2.9 [P1-A5/A6/A14] int64 wire 与实时分页上限 —— 已修复

- `RouteNodeLifecycle.ownedRouteCount`、`RouteMigrationResult.migratedRouteCount` 从
  `usize`（JSON number）改为 `u64` + `serde_uint64`（JSON string），与 OpenAPI
  `type: string, format: int64` 一致；新增序列化回归测试。
- governance：`QuotaProfileResponse` 四个计数、`RolloutPolicyResponse.trafficPercent`
  改为 `u64` + `serde_uint64`；`ProviderPolicyRollbackRequest.targetVersion`、
  `ProviderPolicyDiffQuery.fromVersion/toVersion` 支持 int64 字符串反序列化
  （此前客户端按契约传字符串会 400）；`ProviderBindingCommitResponse.currentVersion`
  改为字符串序列化。
- `session-gateway`：`realtime.events.list` 的 `page_size`/`limit` 上限从内部窗口容量
  1000 收敛为契约值 **200**（保留窗口缓冲仍为 1000），201/1000 明确报 `limit_invalid`
  而非静默返回超页数据。

**验证**：`cargo test -p session-gateway -p governance-service -p sdkwork-im-runtime-route --lib`
→ **76 + 4 + 15 passed**；新增 `route_counts_serialize_as_int64_strings`、
`provider_versions_accept_int64_strings`、`quota_and_rollout_counts_serialize_as_int64_strings`、
`realtime_event_limit_enforces_the_contract_page_size_max`；
`cargo check -p session-gateway -p ops-service -p governance-service --all-targets` PASS。

### 2.10 [P1-A1/A4] 幽灵端点与 governance 快照契约 —— 已修复

- `social.runtime.repairDerivedSnapshot.create`：OpenAPI 与 social backend manifest
  （`CONTROL_WRITE` 权限）都已声明，但 `runtime_control` 从未注册路由，调用必然 404。
  现已实现 `POST /backend/v3/api/control/social/runtime/repair_derived_snapshot`：
  重建进程内派生索引、持久化快照，返回包含 `status/scope/durable/各集合计数/repairedAt`
  的报告；`scope=process_cache` 明确 PostgreSQL 仍是权威，避免把缓存修复伪装成数据修复。
- `providerPolicies.list`、`control.providerBindings.list` 契约声明
  `SdkWorkListResponse` + `page_size/cursor/page/q`，运行时却返回完整快照对象且忽略分页。
  两个端点改为资源契约（`SdkWorkApiResponse.data` → `ProviderPolicyHistorySnapshot` /
  `ProviderBindingSnapshot`），删除未实现的分页参数；`ProviderBindingSnapshot` 补充 `status`。
- 后端 SDK OpenAPI 镜像同步并重新生成 TypeScript family（3 created / 3 updated），
  `publish-core check` 通过。

**验证**：`cargo test -p social-service --lib` → **39 passed**（含
`repair_derived_snapshot_rebuilds_indexes_and_reports_scope`）；
`cargo check -p social-service --all-targets` PASS；
`check-api-operation-patterns` / `check-api-response-envelope` / `check-pagination` PASS；
`generate-contract-inventories --check` → 216 operations / 58 tables。

### 2.11 [P1-S1] WebSocket 升级限流可被 UA 伪造绕过 —— 已修复

**问题**：`extract_client_ip_from_headers` 在无可信代理配置时用
`SHA(User-Agent, Accept-Language, 10s 时间桶)` 伪造 IP，换 UA 即获得无限桶；
配置可信代理时也只看 header，不校验真实 TCP 对端是否为代理。

**修复**

- `session-gateway-bin` 改用
  `into_make_service_with_connect_info::<SocketAddr>()`，upgrade handler 通过
  `Option<Extension<ConnectInfo<SocketAddr>>>` 读取真实对端（sovereign standalone gateway 已具备）。
- 限流键解析改为：对端不可信 → 直接用对端 IP，忽略 `X-Forwarded-For`/`X-Real-IP`；
  对端可信 → 从右到左跳过可信代理取第一个不可信地址；
  无对端信息（如单测 oneshot）→ 统一 `0.0.0.0` 共享 fail-closed 桶，绝不信任 header。
- 删除 UA/语言/时间桶哈希回退。

**验证**：`cargo test -p session-gateway --lib` → **79 passed**，新增
`untrusted_peer_ignores_spoofed_forwarded_headers`、`trusted_peer_uses_the_forwarded_client_chain`、
`missing_peer_uses_a_shared_fail_closed_bucket`；`cargo check -p session-gateway-bin --all-targets` PASS。

### 2.12 [P1-S10] JWT replay key 可枚举且跨租户冲突 —— 已修复

**问题**：Redis key 为 `im:jwt:replay:{raw-jti}`：jti 原样落库可被枚举/关联，
且不同租户使用相同 opaque jti 时会互相判为重放。

**修复**

- key 改为 `im:jwt:replay:{tenant}:{sha256(jti)}`；`try_claim_jti` 显式接收 tenant。
- 调用方从已验证 payload 的 `tenant_id`/`tenantId` claim 取值，缺失时归入平台级 `-`。
- 新增 `replay_key_is_hashed_and_tenant_scoped` 测试（key 含 tenant、不含明文 jti、
  不同租户不同 key）。

**附带修复**：`im-app-context` 两个集成测试仍断言“permission scope 会被写入凭据”，
与 IAM_SPEC §5.2/§5.6（scope 不得签入凭据、由服务端解析）冲突，属陈旧测试。
已改为断言 scope 不进入凭据，27 个集成测试全部通过。

**验证**：`cargo test -p im-adapters-redis-cache --lib jwt_replay` → 1 passed；
`cargo test -p im-app-context` → **27 passed**。

### 2.13 [P1-S8/S9] 部署网络边界与 nginx 请求体上限 —— 已修复（S9 部分）

- `session-gateway-ingress` NetworkPolicy 原为 `namespaceSelector: {}`，集群内任意 Pod
  都可绕过 API 网关直连实时端口。现仅允许带 `sdkwork.im/edge-ingress: "true"` 标签的
  命名空间（部署前给 ingress controller 命名空间打标签，注释已写明命令）。
- nginx 请求体上限从 **1100m 降到 8m**：媒体服务自身硬上限为 1 MiB
  （`MEDIA_MAX_REQUEST_BODY_BYTES_MAX`），1100m 允许未认证客户端向磁盘缓冲 GB 级请求。
  `server.common.toml` 与 10 个生成的 `nginx.*.conf` 同步修改。
- 新增门禁 `scripts/dev/sdkwork-im-deployment-security-posture.test.mjs`：
  禁止任何 NetworkPolicy 使用空 `namespaceSelector`、要求实时 ingress 使用 edge 标签、
  校验 nginx 上限不低于媒体上传上限且 ≤16m、并校验 TOML 与所有生成配置一致。

**剩余**：`limit_req` 已按标准落地（§2.26）；`limit_conn` 无受支持配置键，未手写未映射指令。

**P1-S4 尝试记录**：为 ops/audit/governance manifest 增加 `required_permission` 后，
集成测试经 IAM 授权策略返回 401（本地双 Token fixture 不是 IAM 会话，scope 由服务端投影），
说明启用该防御纵深需要 IAM-aware 测试基座与发布侧 scope 授权；本轮已回退该改动，
保留为待办，不引入“测试通过但线上 401”或“改测试绕过授权”的债务。

### 2.14 [P1-D12] Outbox 终态失败原因被丢弃 —— 已修复

**问题**：`mark_failed` 接收 `_reason` 却未落库；`im_outbox_events` 也没有 `last_error` 列。
终态失败行只有 `attempt_count`/`publish_status`，运维无法判断失败原因，死信重放缺少证据。

**修复**

- baseline `im_outbox_events` 增加 `last_error TEXT`；新增迁移
  `0010_im_outbox_events_last_error.up.sql`（`ADD COLUMN IF NOT EXISTS`，2s lock timeout）。
- `MARK_FAILED_SQL` 写入 `last_error = $8`；`mark_failed` 绑定经过 `bounded_failure_reason`
  截断（最多 2000 字符）的失败原因，避免无界错误串放大行宽。
- 新增测试 `mark_failed_persists_a_bounded_failure_reason`（SQL 绑定 + 截断行为）。

**验证**：`cargo test -p im-adapters-postgres-journal --lib outbox` → 12 passed；
`materialize_im_database_contract.mjs` → 58 张表；命名门禁、数据库框架门禁、
`check-database-framework-standard` 全部 PASS。

**部署动作**：`pnpm db:postgres:migrate` 应用 0010。

### 2.15 [P1-S11] 固定窗口限流非原子与 fail-open 默认 —— 已修复

- `INCR` + `EXPIRE` 改为单条 Lua 脚本原子执行：进程在两步之间退出或 `EXPIRE` 失败时，
  桶不再永久无 TTL，避免客户端被永久限流。
- `gateway_rate_limit_redis_fail_closed_from_env` 原先只在显式 production/prod/staging
  且配置 Redis 时 fail-closed；未设置环境变量时默认 **fail-open**。
  现改为：只有显式 `dev/development/test/local` 才放宽，其余（含未设置）在配置 Redis 时
  fail-closed。
- 新增 `fail_closed_defaults_on_and_only_relaxes_for_local_environments` 测试。

**验证**：`cargo test -p im-adapters-redis-cache --lib` → **23 passed**。

### 2.16 [P1-D11] 好友请求唯一约束阻止合法重发 —— 已修复

**问题**：`uk_im_friend_requests_pair` 为
`UNIQUE(tenant, org, requester, target, status)`；用户在请求被拒绝/取消/过期后再次发送时，
同一条历史行已占用该 status 组合，插入必然唯一冲突并映射为 HTTP 503。

**修复**

- baseline 删除旧约束，改为部分唯一索引
  `uk_im_friend_requests_pending_pair`，对
  `LEAST(requester, target), GREATEST(requester, target)` 在 `status = 'pending'` 时唯一：
  同一无序pair只能有一个待处理请求，历史 declined/accepted 行可共存。
- 新增迁移 `0011_im_friend_requests_pending_pair.up.sql`：drop 旧约束、创建部分唯一索引；
  若存量数据已存在重复 pending pair，`RAISE EXCEPTION` 明确报数量并要求运营先处理，
  不静默删历史。
- 保留 `ON CONFLICT (request_id) DO NOTHING` 的按请求 ID 幂等语义。
- 新增门禁 `scripts/dev/sdkwork-im-friend-request-pair-invariant.test.mjs`：
  禁止 baseline 重新引入旧约束、校验部分索引/规范化 pair、迁移的 drop + duplicate precheck。

**验证**：`materialize_im_database_contract.mjs` → 58 张表;
命名/数据库框架/`check-database-framework-standard` PASS；
`friend-request-pair-invariant` 门禁 PASS。

**部署动作**：`pnpm db:postgres:migrate` 应用 0011（存在重复 pending pair 时迁移会失败并退出，
需先人工取消陈旧请求）。

### 2.17 [P1-S7 部分] `/readyz` 未校验迁移版本 —— 已补迁移头校验

- 新增 `ImSchemaReadinessCheck`：查询
  `ops_schema_migration_history(module_id='im', engine='postgres')` 的最大 `version`，
  与二进制内 `REQUIRED_IM_SCHEMA_VERSION`（当前 `0012`，§2.33 起）比较；数据库落后或历史表不可用时
  直接返回未就绪，阻止新二进制在旧 schema 上接流量。
- 新增 `required_schema_version_tracks_the_latest_migration` 测试：扫描
  `database/migrations/postgres/*.up.sql`，要求常量始终等于最新版本，防止忘记 bump。
- 该检查与既有 DB ping 检查并存：ping 证明连通性，schema 检查证明迁移已应用。

**剩余**：凭证验证器已在 §2.27 实现；关键对象完整性（索引/约束）校验仍未实现。

**验证**：`cargo test -p sdkwork-im-service-readiness` → **10 passed**（§2.27 新增凭证用例后）。

### 2.18 [P1-S6 部分] Tauri shell 允许打开任意本地路径 —— 已收窄

- `tauri.conf.json` 的 `plugins.shell.open` 原允许
  `file://.+`、`[A-Za-z]:\\\\.+`、`\\\\\\\\.+`（UNC）；渲染层被投毒后可打开任意本地文件或
  UNC 共享，造成本地文件泄露/SMB 凭据外带。现仅允许
  `mailto:`、`tel:`、`http(s)://`，且必须整串匹配、不允许空白注入。
- 新增门禁 `scripts/dev/sdkwork-im-tauri-security-posture.test.mjs`：
  校验允许列表含 mailto/tel/https、禁止 file/盘符/UNC 模式、capability 不得授予
  `shell:allow-execute|kill|spawn`、`shell:allow-open` 仍是唯一 shell 能力。

**剩余**：`app.withGlobalTauri: true` 仍存在（渲染层直接使用 Tauri 全局桥；
CSP 已配置，§2.25），迁移到 `@tauri-apps/api` 显式导入需桌面端回归验证。

**验证**：`tauri-security-posture` 门禁 PASS；`tauri.conf.json` JSON 解析通过。

### 2.19 [P1-D2] 消息编辑/撤回缺少日志分区锁与序号重算 —— 已修复

**问题**：`persist_message_mutation_txn` 只对消息行加锁，没有对 journal 分区取
`pg_advisory_xact_lock`，也没有按数据库当前 `aggregate_seq` 重算 ordering sequence。
并发「编辑/撤回」与「新消息」写同一会话时，两个事务会分配相同的 commit offset，
在主键上冲突并返回 HTTP 409，而不是被串行化。

**修复**

- mutation 事务在追加 journal 前调用
  `lock_journal_partitions(..., "message mutation journal lock")`；
- 调用 `allocate_next_ordering_sequences` 在持锁状态下按 DB 最新序列重算；
- 使用本地 `envelope` 副本，后续 `append_journal_in_transaction` 与
  `update_conversation_after_message_mutation_in_transaction` 使用重算后的序列。

**验证**：`cargo test -p im-adapters-postgres-journal --lib` → **63 passed**；
`cargo check --all-targets` PASS。消息编辑/撤回与消息发布现在共享同一分区串行化路径。

**剩余**：`message_seq` 仍由 Redis 批量分配，但缺失时从 PostgreSQL 消息高水位播种（P1-D1 已修复，§2.32）。

### 2.20 [P1-A11] app SDK 幽灵操作 `/principal/profiles/provider_health` —— 已修复

**问题**：app SDK 的 `provider.ts` 暴露
`GET /app/v3/api/principal/profiles/provider_health`，但该路径不在
`apis/app-api`、route manifest 或任何工作区源码中；生成物与权威契约矛盾，
调用方会得到 404。

**修复**

- 确认 `apis/app-api/communication/sdkwork-im-app-api.openapi.yaml` 与
  `sdks/sdkwork-im-app-sdk/openapi/*` 均不含该路径后，按生成器所有权重新生成整个
  app SDK family（9 种语言），而不是手改生成文件。
- 生成后全语言扫描幽灵路径命中数 **0**；TypeScript 生成项目的
  `publish-core --action check`（含 build）PASS。
- 生成器共更新 714 个生成文件（含 models/API/manifest/docs/bin），均为生成器输出。

**验证**：幽灵路径全语言 0 命中；TS 生成项目 check+build PASS。

### 2.21 [P1-S4 基座前置] IAM-aware 测试基座 —— 已修复

**问题**：`im_service_test_framework_layer` 用
`IamWebRequestContextResolver::new(None)` 解析身份；无 IAM 数据库时该 resolver 及其
fallback 无法校验 IM fixture token，所有带 manifest 路由的集成测试返回 401
（`audit-service` 8 个 HTTP smoke 中 4 个、`streaming-service` 7 个中 4 个长期失败），
也阻塞 P1-S4 manifest 权限与 P1-A2 streaming 契约落地。

**修复**（`crates/sdkwork-im-web-bootstrap/src/test_support.rs`）：

- 新增 `LocalDualTokenResolver`：把测试请求的 dual-token header 交给
  `im_app_context::resolve_app_context`（与生产 IM 网关相同的校验路径），
  再映射为 `WebRequestPrincipal`（tenant/org/user/session/app/auth level/subject type）。
- `im_service_test_framework_layer` 改用它作为 `ScopedPermissionResolver` 的内层，
  仍由 fixture grant 提供 `data_scope`/`permission_scope`；
  `IamAuthorizationPolicy`/`ManifestAuthorizationPolicy` 继续执行真实鉴权。
- 仅 `test-support` feature 编译，生产 assembly 不引用。

**验证**

- `cargo test -p audit-service` → **25 passed**（此前 4 个 HTTP smoke 返回 401）。
- `cargo test -p streaming-service` → **34 passed**（此前 HTTP/lifecycle 多处 401）。
- `cargo check -p sdkwork-im-web-bootstrap --features test-support` PASS。

### 2.22 [P1-S4] Backend manifest 未声明 route 权限 —— 已修复

- ops manifest：GET → `ops.read`、POST → `ops.write`；
  audit manifest：GET → `audit.read`、POST → `audit.write`；
  governance manifest：GET → `control.read`、POST → `control.write`。
  通过 `route.with_required_permission` 在 `route_manifest()` 中统一注入，
  框架 interceptor 与 handler 内权限检查形成双重校验。
- 测试基座：`im_service_test_framework_layer_with_user_grants` 同步切换到
  `LocalDualTokenResolver`（§2.21），否则启用权限后本地 fixture 会 401。
- 顺带对齐：governance 自述 `/openapi.json` 的 int64 字段改为
  `type: string, format: int64, x-sdkwork-int64-string`；测试中 `currentVersion`
  / `trafficPercent` / `targetVersion` / `migratedRouteCount` 断言改为字符串（A5/A6 后续）。

**验证**：`cargo test -p ops-service -p audit-service -p governance-service --quiet`
→ **exit 0**（全部 20 个 test binary 通过，含 governance 12/13/4/3 等）；
`cargo check -p sdkwork-im-web-bootstrap --features test-support` PASS。

### 2.23 [P1-A13] Audit `after_audit_seq` 原始序号 cursor —— 已修复

- 查询参数由 `after_audit_seq`（十进制序号）改为不透明 **`cursor`**：
  `header.payload.signature` 三段 base64url，HMAC-SHA256 签名，
  签名域为 `sdkwork.im.audit.cursor.v1`，密钥复用
  `SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET`（或 `_FILE`），生产缺失时 fail-closed。
- payload 绑定 `tenantId`/`organizationId`/`auditSeq`：跨租户或跨组织复用 cursor 直接 400；
  伪造/篡改签名同样 400。
- `pageInfo.nextCursor` 输出签名 token，不再暴露内部序号。
- 后端 OpenAPI 参数同步为 `cursor`（string），backend SDK 重新生成并构建通过。
- 新增 `cursor_round_trips_and_rejects_cross_tenant_use` 单测，HTTP smoke 改为
  “取 nextCursor → 用 cursor 请求下一页”，并断言 token 非纯数字、含签名段。

**验证**：`cargo test -p audit-service` → **26 passed**（lib 12 / http 8 / runtime 5 / 结构 1）；
`publish-core --action check`（backend TS）PASS；`check-pagination` / operation patterns PASS。

### 2.24 [P1-A2 复核] Streaming 端点契约 —— 非缺陷（SDK 所有权边界）

复核结论：`/streams` 生命周期端点是 **内部服务面**，不归 app SDK 所有。

证据：
- `sdks/sdkwork-im-app-sdk/bin/sdk-family-config.mjs` 的 `forbiddenPathParts` 与
  `forbiddenGeneratedText` 明确包含 `marker('/streams')`；把 6 条
  `/app/v3/api/streams/*` 加入 app OpenAPI 后，生成器直接失败：
  “path must not contain /streams”。
- app 契约已提供面向客户端的流式入口：
  `POST /app/v3/api/automation/agent_responses`（201，`data.item = StreamSession`），
  复用现有 `StreamSession`/`StreamFrame`/`StreamDurabilityClass`/`StreamSessionState` 模型，
  不存在“未受契约保护的 app 写接口”。
- 因此本轮不修改 app 契约/SDK，也不把内部 stream 生命周期端点塞入 app SDK；
  manifest 的 `GET /app/v3/api/streams` 仅为网关挂载描述，待网关内部路由清单统一时再收敛。

处理：已完整恢复 app OpenAPI、app SDK 派生输入与 streaming 源码；保留 §2.21 测试基座
与 `build_domain_router()` 测试入口。`cargo test -p streaming-service` → **34 passed**。

### 2.25 [P1-S6 续] Tauri CSP 与 prototype 冻结 —— 已修复

- `tauri.conf.json` 新增 `app.security`：
  - `csp`：`default-src 'self'`、`script-src 'self'`、`style-src 'self' 'unsafe-inline'`、
    `img-src/media-src` 允许 `asset:`/`data:`/`blob:`/`https:` 与 standalone 本机
    `http://127.0.0.1:*`/`http://localhost:*`、`connect-src` 允许 IPC +
    `https:`/`wss:` + 本机 API、`frame-src 'none'`、`object-src 'none'`、
    `base-uri 'self'`、`form-action 'self'`。
  - `devCsp: null` 仅用于 Vite HMR 开发；生产打包使用上面的 CSP。
  - `freezePrototype: true`：阻止注入内容污染原型链。
- `sdkwork-im-tauri-security-posture.test.mjs` 增加回归断言：
  CSP 必须存在且包含 `default-src 'self'`/`script-src 'self'`/`object-src 'none'`/
  `frame-src 'none'`，禁止 `unsafe-eval`；`freezePrototype` 必须为 `true`。
- `app.withGlobalTauri` 仍为 `true`：渲染层 6 处模块直接调用
  `globalThis.__TAURI__.core.invoke` / `.event.listen`（离线存储、通知、二维码、桌面宿主），
  迁移到 `@tauri-apps/api` 显式导入需要桌面端回归验证，已在 §9 记录为剩余项；
  当前风险由 `script-src 'self'` 与 `freezePrototype` 收敛。

**验证**：`node scripts/dev/sdkwork-im-tauri-security-posture.test.mjs` → PASS；
`tauri.conf.json` JSON 解析 PASS；`@tauri-apps/cli@2.11.2` schema 包含
`freezePrototype` 与 `devCsp`。

### 2.26 [P1-S9 续] nginx API 入口速率限制 —— 已修复

- `deployments/webserver/server.common.toml` 新增
  `limitReqZone = ["$binary_remote_addr zone=im_api:10m rate=120r/s"]`；
  经官方 `render-nginx-sidecars.mjs --validate` 重新生成 10 个
  `nginx.<profile>.<environment>.conf`，均包含
  `limit_req_zone $binary_remote_addr zone=im_api:10m rate=120r/s;`。
- 生产与非生产 API location snippet 对 `/api/` 应用
  `limit_req zone=im_api burst=240 nodelay;` 与 `limit_req_status 429;`，
  避免单 IP 突发打满上游，且超限返回 429 而非 nginx 默认 503。
- `deployment-security-posture` 门禁新增断言：TOML 必须声明 zone、
  所有生成配置必须渲染该 zone、两个 snippet 必须应用限流并返回 429。
- `limit_conn`：`SDKWORK_WEBSERVER_SPEC.md` 未提供连接数限制键
  （仅 `limitReqZone`/`limitReq`），按标准不手写未映射指令；以 `limit_req` 为受支持手段，
  连接级保护由 `worker_connections` 与上游 keepalive 约束。

**验证**：`node scripts/dev/sdkwork-im-deployment-security-posture.test.mjs` →
`deployment security posture passed (3 network policies, 10 nginx configs, body=8m, limit_zone=im_api)`。

### 2.27 [P1-S7 续] Readiness 凭证验证器 —— 已修复

- `sdkwork-im-service-readiness` 新增凭证材料校验：
  - production-like profile 下必须配置
    `SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET`（或 `_FILE`）与
    `SDKWORK_IM_APP_CONTEXT_JWT_SIGNING_SECRET`（或 `_FILE`）；
  - 密钥长度必须 ≥ 32 字符（256-bit HMAC key）；
  - 拒绝已知开发 JWT fallback（`sdkwork-im-dev-jwt-secret-not-for-production-use`）；
  - dev/test/local 保留既有 fallback，不阻断本地开发。
- 校验接入 `evaluate_im_runtime_dependency_health_from_env()`，因此
  `im_env_readiness_check()`（所有 IM HTTP 服务的 readiness 组装入口）与
  `/readyz` 状态标签自动生效；另暴露
  `im_credential_material_readiness_check()` 供复合探针显式组合。
- 新增 5 个单测（dev 放行、生产缺失失败、短密钥失败、开发 fallback 失败、强密钥通过）。
- `TECH_ARCHITECTURE.md` §8.1 同步说明 readiness 会校验迁移头与凭证材料。

**验证**：`cargo test -p sdkwork-im-service-readiness` → **10 passed**。

### 2.28 [P1-A7 部分] 分页参数严格校验与 runtime inventory 真分页 —— 已修复

**问题**

- `space-service`/`social-service` 的 keyset 助手把 `page_size` **clamp** 到 1..200；
  `calls-service` 的 `list_call_signals` 同样 clamp。客户端无法得知参数非法
  （`PAGINATION_SPEC.md` §10.1 要求拒绝，而非静默截断）。
- `social-service` 三个 shared-channel sync runtime 控制端点
  （`pending`/`dead_letter`/`delivered`）在 OpenAPI 已声明
  `page_size`/`cursor`/`page`，实现却用 `full_inventory_page` 返回**全量 inventory**，
  `page_size = len`、`nextCursor = null` —— 假分页 + 无界响应。

**修复**

- 两处 keyset 助手改用 `SdkWorkCursorListQuery::resolve_page_size()`，
  0/201/1000 等越界值直接 400（不再 clamp）。
- `calls-service` 的 signal list 显式校验 `page_size`，越界返回 400，不再 clamp。
- 删除 `full_inventory_page` 反模式；runtime inventory 三个端点改为：
  - `request_key` 升序 keyset 分页；
  - cursor 复用 social-service 既有签名 cursor 设施
    （`encode_signed_inventory_cursor`/`decode_signed_inventory_cursor_payload`），
    payload 绑定 `scope`（resource + tenant + org + actor）与 `after` 位置；
  - `pageInfo.hasMore`/`nextCursor` 真实反映剩余数据；
  - 跨端点/跨 principal 复用 cursor 返回 400。
- 新增测试：space/social 越界 `page_size` 拒绝；runtime inventory 第一页/续页/
  scope 不匹配/越界拒绝（2 个单测）。

**验证**

- `cargo test -p space-service -p social-service` → **11 + 42 passed**（含新增用例）。
- `cargo test -p space-service -p social-service -p calls-service` → **exit 0**。
- 剩余：calls signal list cursor 已在 §2.30 迁到签名 token；40003 业务码映射受框架
  `ApiProblem` 限制，当前为 400。

### 2.29 [P1-A8] space/social keyset cursor 明文可伪造 —— 已修复

**问题**：`space-service` 与 `social-service` 的 keyset 助手把
`nextCursor` 拼成 `"{sort_value}|{entity_id}"` 明文，客户端可读取、篡改、
跨端点/跨租户重放；`decode` 只按 `|` 分割，无签名校验。

**修复**

- 新增共享 crate `crates/sdkwork-im-keyset-cursor`：
  - `CursorScope { resource, tenant_id, organization_id, principal_id }`
    绑定 cursor 到具体列表与调用者；
  - `encode_keyset_cursor`/`decode_keyset_cursor` 生成/校验
    `header.payload.signature`（HMAC-SHA256，域 `sdkwork.im.keyset.cursor.v1`）；
  - 密钥复用 `SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET`（或 `_FILE`），
    production-like 缺失时 fail-closed，dev/test 使用文档化 fallback；
  - `keyset_page()` 统一构建 `pageInfo.hasMore`/`nextCursor`。
- space-service 8 个列表端点（spaces/members/groups/group_members/channels/
  channel_access_rules/invites/bans）与 social-service 2 个列表端点
  （user_blocks/direct_chats）全部改用签名 cursor；
  明文 `sort|id`、跨 scope、篡改 token 一律 400。
- 新增 crate 单测（roundtrip/scope 绑定/伪造拒绝/分页游标）以及
  space/social 助手测试（签名解码、foreign scope 拒绝、明文 token 拒绝）。

**验证**

- `cargo test -p sdkwork-im-keyset-cursor` → **2 passed**。
- `cargo test -p space-service -p social-service -p calls-service` → **exit 0**
  （space 12 + 8；social 42 + 9 + 1）。
- `check-rust-crate-naming-standard` / `check-rust-manifest-standard` → PASS。

**剩余**：calls signal list cursor 已在 §2.30 迁到签名 token。

### 2.30 [P1-A8 续] calls signal list 签名 cursor —— 已修复

- `GET /im/v3/api/calls/sessions/{rtcSessionId}/signals` 的 `cursor` 改为
  `sdkwork-im-keyset-cursor` 签名 token（scope = `calls.signals` + tenant/org/principal）；
  解码后按 `signal_seq` 续页。
- `pageInfo.nextCursor` 改为签名 token，不再暴露裸 `signal_seq`。
- 契约中的 `after_signal_seq` 仍兼容（老客户端），但新分页一律返回签名 cursor；
  伪造/篡改/跨 principal cursor 返回 400（`CallingError::invalid`，新增 BAD_REQUEST 构造器）。

**验证**：`cargo test -p calls-service` → **27 + 3 passed**，exit 0。

### 2.31 [P1-D9] outbox scope 发现饥饿 —— 已修复

**问题**：`LIST_PENDING_SCOPES_SQL` 每次只取 `ORDER BY min(available_at), tenant, org LIMIT 32`，
relay 每轮都从头取同样的 32 个 scope；只要这些 scope 持续有 pending 事件，
第 33 个及之后的租户/组织**永远不会被发现**，事件静默饥饿。

**修复**

- `OutboxScopeDiscoveryRequest` 增加 `after: Option<(tenant, org)>` 与
  `with_after(...)`（空值清除）；`after()` 供适配器读取。
- `LIST_PENDING_SCOPES_SQL` 增加 keyset 过滤：
  `and ($4 = '' or (tenant_id, organization_id) > ($4, $5))`，
  并按 `tenant_id, organization_id` 稳定排序。
- relay 增加进程内 `scope_cursor`：本轮取满 32 个则下一轮从最后 scope 继续；
  不足 32 个说明已到尾部，重置游标从头开始，形成完整轮转。
- `scope_override` 单 scope 模式不受影响。
- 新增 contracts 单测：`with_after` 设置/清除、limit 边界。

**验证**

- `cargo test -p im-platform-contracts` → **6 passed**（含 2 个新用例）。
- `cargo test -p im-adapters-postgres-journal --lib` → **63 passed**。
- `cargo test -p sdkwork-comms-conversation-service --lib` → **169 passed**。

### 2.32 [P1-D1] Redis 序列批次无 PG 播种 —— 已修复

**问题**：`RedisSeqAllocator` 直接 `INCRBY key 1000`；Redis 清空/故障转移/键淘汰后计数器从 0
重新开始，导致已存在的 `message_seq` 被重新分配 → 唯一约束冲突与消息顺序错乱。

**修复**

- `adapters/redis-cache` 新增 `ConversationSeqHighWatermark` 端口，由调用方提供
  “该会话已提交的最大 `message_seq`”。
- 慢路径改为 Lua 原子脚本 `SEED_AND_RESERVE_SCRIPT`：
  - 键存在：直接 `current + batch` 预留，**不查 PG**；
  - 键缺失且 `floor = -1`：返回哨兵 `-1`，调用方读取 PG 高水位后再执行一次；
  - 第二次执行时 `current = max(current, floor)`，再预留批次，避免并发首取重复播种。
- `im-adapters-redis-cache` 导出端口；conversation-service 用
  `PostgresMessageStore::read_high_watermark` 实现 `MessageStoreSeqHighWatermark`，
  并在构造 Redis allocator 时注入。
- 无 provider 时保持旧行为（floor=0），便于独立测试；生产装配始终注入。

**验证**

- `cargo test -p im-adapters-redis-cache --lib` → **25 passed**（新增 Lua 守卫与 provider 装配用例）。
- `cargo test -p sdkwork-comms-conversation-service --lib` → **169 passed**。
- `TECH_ARCHITECTURE.md` §7 已同步“Redis 批次以 PG 高水位播种”的语义。

### 2.33 [P1-D3/D4] 保留期扫描索引与清理覆盖 —— D4 已修复，D3 部分修复

**D4：跨租户保留期扫描无可用索引**

- 基线里的保留期索引是 `(tenant_id, organization_id, retention_until)` 前导复合索引；
  清理 SQL 只按 `retention_until` 过滤，无法使用这些索引，每批都退化为全表扫描。
- 新增迁移 `0012_im_retention_scan_indexes`：对全部 25 张声明 `retention_until` 的表
  创建 `(retention_until) WHERE retention_until IS NOT NULL` 部分索引；
  纯增量、可回滚（`.down.sql`），带 `lock_timeout=5s` / `statement_timeout=600s`。
- `REQUIRED_IM_SCHEMA_VERSION` 提升到 `0012`；部署必须先执行
  `pnpm db:postgres:migrate`，否则 `/readyz` 保持不健康。
- 契约物化校验：`validated 58 IM tables from baseline plus 12 PostgreSQL migrations`。

**D3：清理覆盖**

- `RetentionCleanupReport` / `purge_retention_batch_on_txn` 由 9 张表扩展到 **24/25**：
  新增 realtime_subscriptions、presence_states、realtime_disconnect_fences、
  notification_tasks、automation_executions、conversation_members、
  conversation_read_cursors、registered_client_routes、client_sync_events、
  client_sync_cursors、stream_frames、stream_sessions、
  conversation_agent_assignments、conversation_agent_binding、agent_dispatch。
- 清理顺序处理 FK：frames 先于 sessions，agent assignments 先于 binding。
- 指标与调度聚合同步扩展：`im_retention_purge_rows_deleted_total` 覆盖新 store，
  `merge()` 不再遗漏 invitations/新表（此前 invitations 也未累加，已修）。
- **会话行本身**：本轮先完成 24 张表的直清；`im_conversations` 的依赖级联在
  §2.34 补齐（9 条有界语句 + 会话行删除）。

**验证**

- `cargo test -p im-adapters-postgres-journal --lib` → **64 passed**
  （新增“每张简单表都有有界 purge 语句”与指标/merge 断言）。
- `cargo test -p sdkwork-im-service-readiness` → **10 passed**（迁移头 0012）。
- `check-database-framework-standard` → PASS。

### 2.34 [P1-D3 收尾] 过期会话的有界级联清理 —— 已修复

**问题**：`im_conversations` 也声明了 `retention_until`，但前一轮只覆盖 24/25 张表。
直接删会话会留下 messages/members/stream/agent 等孤儿行；隐式依赖数据库级联又不完整
（只有 3 张策略表有 `ON DELETE CASCADE`）。

**修复**（`retention_cleanup.rs`）

- 新增 9 条以 `expired conversations` CTE 为批次的有界语句，按依赖顺序执行：
  1. `im_stream_frames`（经 `im_stream_sessions.scope_kind='conversation'` 关联）
  2. `im_stream_sessions`
  3. `im_agent_dispatch`
  4. `im_conversation_agent_assignments`
  5. `im_conversation_agent_binding`
  6. `im_conversation_read_cursors`
  7. `im_conversation_members`
  8. `im_conversation_messages`（media refs 由 FK 级联）
  9. `im_conversations`（策略/绑定/交接由 FK 级联）
- 每条语句都带 `retention_until IS NOT NULL`、`<= NOW()`、确定性排序与 `LIMIT $1`，
  同一事务内批次稳定；BIGINT id 表通过 `::text` 与文本型 conversations 关联。
- 级联删除行数折叠进既有表计数器，并新增 `conversations_deleted`；
  指标 `im_retention_purge_rows_deleted_total{store="conversations"}` 与
  scheduler `merge()` 同步。
- 保留期覆盖达到 **25/25** 张表。

**验证**

- `cargo test -p im-adapters-postgres-journal --lib` → **64 passed**
  （包含全部 purge 语句的 `retention_until` 守卫、LIMIT、ORDER BY 与指标/merge 断言）。

### 2.35 [P1-C13] 产品代理 HTTP 客户端无超时 —— 已修复

**问题**：`sdkwork-api-product-runtime` 的 `RuntimeProxyState.client` 使用
`reqwest::Client::new()`，无 connect/read 超时；上游接受连接后挂起会永久占用代理 handler。

**修复**

- 新增 `build_runtime_proxy_client()`：
  - `connect_timeout = 5s`；
  - `read_timeout = SDKWORK_IM_PROXY_READ_TIMEOUT_SECONDS`（默认 30s，允许 1–600s，
    非法值回退默认）；
  - 不设置总请求超时：避免中断大文件/流式下载，但每次读都有上限。
- `RuntimeProxyState` 构造改用该客户端；新增单测覆盖默认值、合法值与非法值回退。

**验证**：`cargo test -p sdkwork-api-product-runtime` → **31 passed**（含新增用例）。

**说明**：数据库语句超时已由共享池的
`SDKWORK_DATABASE_STATEMENT_TIMEOUT_MS`（默认 30s）覆盖；Knowledgebase RPC 已有
100ms–60s 有界超时；本轮补齐的是最后一个无界 HTTP 代理客户端。

### 2.36 [P1-A10] Backend/app manifest operationId 与契约漂移 —— 已修复

- 用脚本遍历全部 52 条 `HttpRoute::dual_token` 路由（app/open/backend 三类 route crate），
  与三份 OpenAPI 权威逐条比对 `METHOD path → operationId`。
- 发现并修正：
  - governance backend manifest 10 条（如 `governance.retrieve`、`providerPolicies.list`、
    `control.providerBindings.create`）；
  - automation app manifest 5 条（`executions.create/retrieve`、`agentResponses.*`、
    `agentToolCalls.create`）。
- 复跑比对：`manifest_routes=52 mismatches=0`。
- `cargo test -p governance-service` / `cargo test -p automation-service` 全量通过。

### 2.37 [P1-S4/§2.21 续] 测试基座 actor-kind 映射失真 —— 已修复

- `LocalDualTokenResolver` 原先把除 `service` 外的 actor kind 全部映射成
  `WebSubjectType::User`，导致 `system`/`api_key` 主体在注入 AppContext 时降级为 user；
  automation 的“同一 executionId 按 actor kind 隔离”用例因此失败（system 请求复用了
  user 的 requestKey）。
- 修正映射：`service → Service/System`、`system → System/System`、
  `api_key → ApiKey/ApiKey`、`agent → Service/System`、其余 → `User/Password`。
- 复跑：`cargo test -p automation-service` → 全部通过；
  `cargo test -p sdkwork-im-web-bootstrap` → PASS。

### 2.38 [P0-2 剩余] pins / interaction summary 持久化读取 —— 已修复

**问题**：`message_interactions` / `pinned_messages_index` 是进程内缓存；
进程重启或缓存淘汰后，`message_interaction_summary` 与 `pinned_messages` 返回空
（尽管 `im_message_pins` / `im_message_reactions` 已由消息 mutation 事务持久化）。

**修复**

- `im-platform-contracts` 新增 `MessageInteractionReadStore`：
  `read_interactions(tenant, org, conversation, message_ids)` 与
  `list_pinned_messages(tenant, org, conversation, limit)`。
- `im-adapters-postgres-journal` 新增 `PostgresMessageInteractionReadStore`：
  从 `im_message_pins` / `im_message_reactions` 读取，并与
  `im_conversation_messages` join 补齐 `message_seq`；分页按
  `pinned_at desc, message_seq desc, message_id desc`。
- `ConversationStateService` 冷缓存时回退到持久化读取：
  - `message_interaction_summary`：缓存未命中 → 读取持久化 reactions/pin；
  - `pinned_messages_window`：缓存作用域不存在且为首页 → 读取持久化置顶列表；
  - `enrich_timeline_entries_with_interactions`：作用域缓存为空 →
    批量读取持久化 reactions/pin 填充 timeline 行。
- 冷缓存读取失败时保持原空视图（读路径不因 DB 抖动报错）。
- 设备投递回执按实时路由 ack 语义设计，不落持久表（§3 P0-2 结论）。

**验证**

- 新增 2 个单测（summary 冷缓存读 reactions/pin、pinned window 冷缓存读列表）。
- `cargo test -p sdkwork-comms-conversation-service --lib` → **171 passed**。

### 2.39 分页债务登记册重建 —— 已修复

`docs/architecture/tech/TECH-13-pagination-debt-register.md` 原为 2026-07-07 的历史快照，
宣称“零债务”却大量引用已退役的 `projection-service`。已按当前代码重写：

- 2026-10-21 本轮关闭项 PAG-061…069（严格 page_size、runtime inventory 真分页、
  共享签名 keyset cursor、space/social/calls/audit/typing 迁移）；
- 仍开放的两项 PAG-R1（40003 码映射）与 PAG-R2（`after_signal_seq` 兼容参数）；
- 当前服务的 keyset 迁移摘要、保留期任务等有界例外；
- 删除已退役服务的历史条目，历史记录改由 git 承担；
- 验证命令更新为当前可执行集合。

### 2.40 [P1-F4/F13] PC 生产壳与 Tauri 嵌入路径错位 —— 已修复

**问题**

- `apps/sdkwork-im-pc/server.ts` 生产模式从 `dist/` 提供静态文件并读取
  `dist/index.html`，但 Vite 的规范输出是 `dist/<profile>/<envAlias>/`，
  `index.html` 从不位于裸 `dist/`；`pnpm start` 因此无法启动生产壳。
- Playwright / e2e smoke 门禁也断言 `dist/index.html`，会先于服务失败。
- `tauri.conf.json` 的 `frontendDist` 指向 `../../../dist`（裸目录），
  桌面安装包会嵌入不含 `index.html` 的目录；且渲染构建未固定 profile/mode，
  CI 的 `SDKWORK_ENVIRONMENT` 可能把产物写到 `dist/cloud/prod`。

**修复**

- `server.ts` 新增 `resolveBrowserDistPath()`：
  `dist/<standalone|cloud>/<dev|test|staging|demo|prod>`，
  非法/缺省值回退 `standalone/prod`。
- 两个 e2e 脚本改为解析同一布局（`browserDistProfile`/`browserDistEnvironment`），
  断言和启动使用 `dist/<profile>/<env>/index.html`。
- Tauri `frontendDist` 改为 `../../../dist/standalone/prod`。
- `run-sdkwork-im-pc-tauri-renderer-build.mjs` 固定 Vite `--mode standalone.production`
  （已有显式 `--mode` 时尊重调用方），确保桌面始终嵌入 standalone 生产产物。
- Tauri 安全姿态门禁新增断言：`frontendDist` 必须是 standalone/prod 输出，
  桌面构建脚本必须固定该 mode。

**验证**

- `node scripts/dev/sdkwork-im-tauri-security-posture.test.mjs` → PASS
- `pnpm exec esbuild server.ts ...` bundle → exit 0
- `node scripts/dev/sdkwork-im-pc-playwright-e2e.test.mjs` / `-e2e-smoke` 语法检查 → exit 0
- `resolveViteRuntimeProfile('standalone.production', {})` →
  `{"deploymentProfile":"standalone","environment":"production"}`；
  `resolveBrowserDistOutDir('production','standalone')` → `dist/standalone/prod`

### 2.41 历史文档虚假宣称对齐 —— 已修复

- `docs/CODE_REVIEW_AND_BUG_FIXES.md`：标注为 2025-01 局部历史快照；
  “100% 修复”仅指当次 12 项，不再代表当前仓库，并指向本评审。
- `docs/COMMUNICATION_FEATURE_AUDIT_REPORT.md`：
  - `DDL-002` 的“SQLite DDL parity”改为“PostgreSQL-only；SQLite 仅 PC 离线缓存”，
    仓库实际不存在 `database/migrations/sqlite`；
  - “Projection（projection-service）”条目改为当前 Conversation state 能力描述。
- `docs/product/GA_SIGN_OFF.md`：Phase 1 章节增加状态更正声明，
  明确本文件是目标清单而非完成声明，并指向本评审的当前就绪度。

### 2.42 Repository docs standard 通过 —— 已修复（含遗留债务说明）

**问题**：`check-repository-docs-standard.mjs` 失败：

- `TECH_ARCHITECTURE.md` 未引用 `ARCHITECTURE_DECISION_SPEC.md`；
- 1176 个 `TECH-*` 分片未被入口文档链接；
- 6 个非 `TECH-*` 命名的架构文档违反分片命名规则；
- PRD 未链接两份 PRD-01 分片。

**修复**

- `TECH_ARCHITECTURE.md` 增加 `ARCHITECTURE_DECISION_SPEC.md` 引用与
  **Shard Index**（1176 个分片全部链接）；
- 重命名并更新引用：
  - `INTEGRATION-ADAPTER-REGISTER.md` → `TECH-10-integration-adapter-register.md`
  - `OPTIMIZATION_ROADMAP.md` → `TECH-11-optimization-roadmap.md`
  - `OPTIMIZATION_SUMMARY.md` → `TECH-12-optimization-summary.md`
  - `PAGINATION-DEBT-REGISTER.md` → `TECH-13-pagination-debt-register.md`
  - `RPC-AVAILABILITY.md` → `TECH-14-rpc-availability.md`
  - `TECH-PERFORMANCE-FIXES.md` → `TECH-performance-fixes.md`
- PRD 增加两份 PRD-01 分片链接。

**验证**：`node ../sdkwork-specs/tools/check-repository-docs-standard.mjs --root .`
→ `repository docs standard ok: ... (profile=application)`。

**遗留债务（需人工批准）**：1176 个历史一次性 `TECH-*` 文档现全部列入 Shard Index，
使架构入口文档膨胀到 1496 行。建议后续由负责人批准将 2026-04 历史实施计划归档到
独立目录；本轮未做批量移动（git-tracked 路径变更需要人工确认）。

### 2.43 商业化就绪门禁修复（部分完成）

**已修复的阻塞**

- **PC lint 失败（真实构建阻塞）**：`i18next` 同时解析 26.4.2/26.5.3，
  `ImPcSurfaceProviders` 类型不兼容。根 `pnpm.overrides` 固定 `i18next: 26.5.3`，
  `pnpm install` 后 `pnpm --dir apps/sdkwork-im-pc lint` 通过。
- **H5 architecture gate**：
  - `runtime-env.*` 期望名与新 `standalone/cloud` 布局对齐；
  - 移除“deferred capability 不得使用定时器”误判（KnowledgeBase 重试退避）；
  - Order 页面已迁为真实 OrderService 实现，移出 fail-closed 占位清单。
- **Flutter architecture gate**：Drive 上传已迁到 `drive_uploader_composed`；
  gate 改为断言 composed 依赖、core 不得含 raw HTTP。
- **Playwright e2e**：端口分别探测会复用同一 ephemeral 端口；
  新增 `findAvailablePortPair` 同时持有两个 listener 直到分配完成。
- **Drive 上传归属 gate**：改为消费 `upload.declaration.json`
  （`im.conversation_message_media` / `chat-message-media` / `sdkwork-im-pc`），
  不再断言已废弃的 `im_conversation`/`im` 值。
- **Topology baggage**：跳过 `types/siblings/` 生成类型声明（兄弟仓合法端口常量）。
- **过期路径**：`embedded_dependency_routes.rs` 从 standalone gateway 迁到
  `sdkwork-api-im-assembly`，更新 10 个 gate 的读取路径与 IAM bootstrap 顺序断言。
- **组件契约**：新增 `sdkwork-im-keyset-cursor/README.md`；
  harmony/mini-program `component.spec.json` 修正 manifest 相对路径、
  补 `layerRole`/`providedPorts`/`requiredPorts`。
- **依赖目录**：PC embed 包 `peerDependencies` 改为 `catalog:`；
  PC dev gate 的 lucide/vite-plugin-dts 版本断言改为兼容当前 catalog 范围。
- **PC i18n gate**：语言变更订阅由共享 `i18n/base.ts` 统一注册，gate 改为断言共享基座。
- **PC SDK integration gate**：Tauri `[workspace]` 存在性、`frontendDist` 新布局、
  Order 类型声明、Drive 声明常量、group request key、sync coordinator 断言全部对齐；
  同时修复 `ImSyncCoordinatorService` 默认注入全局 `contactService` 导致启动即同步联系人的问题
  （现在仅显式注入时同步）。
- **Flutter three-capabilities gate**：flush 方法已改为按会话串行
  (`runPendingTextSendFlushForConversation`)，仍由 `_pendingSendFlushInFlight` 保证互斥。

**后续修复（同日，全部代码 gate 通过）**

- `pc-dev-command`：browser CORS origin 断言改为 4176 PC 渲染端口；
- `portal-alignment`：允许文档化的 `SDKWORK_LOCAL_*`/CORS 本地调试覆盖，
  同时断言 VITE build 值不含 loopback；
- `rtc-signaling-boundary`：`after_signal_seq` snake_case 参数 + `normalizeAfterSignalSeq`；
- `runtime-id-standard`：接受 `sdkwork_im_runtime_id.workspace = true` 形式；
- `web-framework-standard`：接受 underscore workspace 依赖与 `ComposedApiAssembly → into_hosted` 组合；
- `sdk-websocket-contract-node`：订阅同步期望补 `conversation.typing`；
- `pnpm-workspace.yaml`：Prompts 生成 transport 入口修正（原为错误的 `src/index.ts`）；
- 重新生成 app SDK，移除已从 app OpenAPI 消失的 `/streams` 生成文件；
- session-gateway realtime：
  - HTTP 契约仍限制 200；内部窗口读取（WS catch-up/测试）放宽到窗口容量 1000；
  - 验收/性能测试分页拉取改为 200 循环 + 跳过缓冲 push；
  - WS pull 不再因大 limit 变成整轮失败。

**当前结果**：`node scripts/release/commercial-readiness.mjs` 已执行完全部代码 gate，
**0 个代码失败**；退出码 **2**，仅剩 4 个证据 gate 阻塞：
Pre-Release Tier（本地 doc-captured 证据）、Capacity Tier（本地回填证据）、
`publish.status=DRAFT`、无启用的 release package。这些是运营/发布决策，不是代码缺陷。

**验证**

- `pnpm --dir apps/sdkwork-im-pc lint` → exit 0
- `node scripts/dev/sdkwork-im-h5-architecture-standard.test.mjs` → PASS
- `node scripts/dev/sdkwork-im-flutter-mobile-architecture-standard.test.mjs` → PASS
- `node scripts/dev/sdkwork-im-pc-playwright-e2e.test.mjs` → 15 passed
- component-spec / IAM application bootstrap / deprecated boundary / topology baggage /
  chat attribution → PASS
- `cargo test -p session-gateway --tests` → **全部通过**
- `node scripts/release/commercial-readiness.mjs` → 代码 gate 全通过，exit 2（证据门阻塞）

### 2.44 Demo 环境安全姿态抬升到 production-like —— 已修复

**问题**：`parse_environment` 把 `SDKWORK_IM_ENVIRONMENT=demo` 映射为
`WebEnvironment::Test`，因此 demo 环境：

- 允许 header-only AppContext 回退（跳过 IAM DB 校验）；
- readiness 跳过签名/JWT 密钥校验；
- 使用开发 JWT fallback。

demo 是公网可达的展示环境，不能沿用 test 的宽松姿态。

**修复**

- `crates/im-app-context/src/lib.rs`：`demo` 映射为 `WebEnvironment::Prod`，
  与 staging/production 一样要求签名验证与完整凭证；
- 新增 app-context 单测：`demo` 必须 `is_production_like_im_environment() == true`；
- 新增 readiness 单测：`demo` 缺密钥必须失败（不允许 dev/test fallback）。

**验证**

- `cargo test -p im-app-context` → PASS
- `cargo test -p sdkwork-im-service-readiness` → PASS（11 tests）

### 2.45 Calls 信号列表 page_size 违规返回 40003 —— 已修复

`list_call_signals` 原先对越界 `page_size` 返回通用 `ApiProblem::bad_request`（HTTP 400/通用码）。
现改为 `invalid_parameter_response`：构造 `SdkWorkProblemDetail` +
`SdkWorkResultCode::InvalidParameter`，输出 `application/problem+json`（code `40003`）并透传 traceId。
`space/social` 仍使用框架通用 400，待上游提供业务码构造器。

**验证**：`cargo test -p calls-service` → PASS；`check-pagination` → PASS。

### 2.46 PC 未知能力页占位文案 —— 已修复

**问题**：`CapabilityModuleSurface` 的 `default` 分支渲染 `"{tab} Content"`，
把未实现能力伪装成可用内容（P1-F12）。

**修复**：

- 新增 i18n 键 `surfaces.capabilityUnavailable`（en/zh）；
- 未知 tab 渲染明确的“当前版本未提供该能力”提示，不再输出伪内容；
- 保留 `activeTab` 作为提示参数，便于定位缺失模块。

**验证**：`pnpm --dir apps/sdkwork-im-pc lint` → exit 0；PC i18n gate → PASS。

## 3. 未关闭的 P0

### P0-6 容量/预发布证据为回填数据（运营证据缺口，非代码接受缺陷）

- `artifacts/perf/step-11/README.md` 已加“无有效容量证据、不得引用”声明（2026-10-21）。
- `artifacts/perf/step-11/capacity/**` 为 32 连接/64 消息的本地回填；索引自述
  “doc-captured backfill ... rather than dedicated topology run”。
- 复核结论：`commercial-readiness.mjs` 已经识别 `backfill`/`doc-captur` 边界并拒绝，
  `assessCapacityEvidenceIndex(loadCapacityEvidenceIndex(repo))` 返回 `{ok:false}`。
  因此门禁本身是诚实的，缺的是**一次真实容量拓扑运行**。
- 剩余动作（运营/基础设施，非本轮代码可闭环）：在专用容量拓扑执行压测；生成带
  provenance/checksum 的索引；readiness 校验器重算 SHA-256 并要求 CI 签名索引。
- 回填产物暂不删除：其内容自述为 backfill，删除属于需要人工确认的破坏性操作；
  在真实证据生成后由负责人按枚举路径清理。

### P0-2 结论（投递回执按实时语义设计，关闭）

- pins 与 interaction summary 已改为“缓存 + PostgreSQL 冷回退”（§2.38）；
  消息 mutation 事务本身已持久化 `im_message_pins` / `im_message_reactions`。
- 按消息/设备的**投递回执**是由 client-route sync 的 `acked_through_sync_seq`
  与设备 offer 推导出的**实时投递状态**，不是持久业务真相：
  - ack 以路由 generation 为单位，重连/换节点即重置；
  - 消息是否送达由 `commit_seq` + 读游标保证，回执只用于展示在线设备投递面；
  - 无设备 ack 时返回默认空摘要，UI 不得当持久回执使用。
- 因此 P0-2 关闭，不再以“新增每设备回执表”为上线前置。
  若未来产品要求**可审计/可计费的持久设备回执**，再引入独立表 + 保留期设计（P2）。

## 4. P1 重大问题（按域）

### 4.1 持久化与数据

| ID | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| P1-D1 | ~~`message_seq` 权威实际是 Redis（无 PG 播种）~~ | 已修复（§2.32）：Lua 原子播种 + PG 高水位 | ✅ flush 后不再重发序号 |
| P1-D2 | ~~消息编辑/撤回事务未加分区锁、未重算序号~~ | 已修复（§2.19） | ✅ 分区 advisory lock + DB 序列重算 |
| P1-D3 | ~~`retention_until` 声明 25 张表，仅 9 张清理~~ | 已修复（§2.33 + §2.34）：24 张直清 + 过期会话 9 条有界级联 | ✅ 25/25 覆盖 |
| P1-D4 | 保留期清理无法命中 tenant-leading 索引 | 已修复（§2.33）：0012 增加 25 个 `(retention_until)` 部分索引 | ✅ 跨租户扫描可走索引 |
| P1-D5 | 迁移 0001 为 222 条语句单事务，未设置声明超时 | `0001_organization_id_not_null.up.sql:2-19,19-304` | 大表 `SET NOT NULL` 全表扫描，锁排队 |
| P1-D6 | Ops 实时诊断每秒全表聚合 | `ops_realtime_wiring.rs:14,99-101`；`im-postgres-realtime-contracts/src/lib.rs:154-217` | 随最大表线性增长 |
| P1-D7 | 搜索每次请求全量 `COUNT(*)`，cursor 为明文 JSON | `search_store.rs:53-105,220-252,381-387` | 最热交互路径成本随邮箱增长 |
| P1-D8 | RTC 全部信令存单个 JSONB | `postgres-rtc-state/src/lib.rs:130-134,240-264` | 每次信令 O(n²) 写放大 |
| P1-D9 | ~~Outbox scope 发现 `LIMIT 32` 无轮转~~ | 已修复（§2.31）：keyset after + relay 轮转 | ✅ >32 租户不再饥饿 |
| P1-D10 | 通知完成/失败未 lease fencing | `notification_task_store.rs:106-131` | 丢租约后重复/漏投 |
| P1-D11 | ~~好友请求唯一约束包含 `status`~~ | 已修复（§2.16） | ✅ pending 部分唯一索引 |
| P1-D12 | ~~Outbox 失败原因被丢弃~~ | 已修复（§2.14） | ✅ `last_error` 列 + 有界落库 |
| P1-D13 | 客户端 SQLite 升级删除未发送队列 | `offline_store/database.rs:226-256` | 离线待发消息丢失 |
| P1-D14 | 实时窗口全量重写 + 接收者串行 | `session-gateway/src/realtime.rs:2709-2754,3744-3776`；`postgres-realtime/src/lib.rs:1277-1330` | O(members × window) 写放大 |

### 4.2 并发、内存与高可用

| ID | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| P1-C1 | WS 断连清理在 async worker 执行阻塞 DB/Redis | `websocket_upgrade.rs:257`；对比正确实现 `link_realtime.rs:452` | 大规模断连时 reactor 停顿 |
| P1-C2 | link 监听器一次 accept/recv 错误即永久退出 | `link_transport.rs:189-192,237-240` | 监听面永久丢失且 readiness 仍绿 |
| P1-C3 | 无写超时/慢消费者上限 | `websocket.rs:271-292,722-753` | slow-loris 长期占用 permit/route |
| P1-C4 | 网关退出无截止时间，readiness 不先翻转 | `standalone-gateway/src/main.rs:170-181` | SIGTERM 被 SIGKILL、路由未 fence |
| P1-C5 | gRPC watch 每次 tick 阻塞读取 | `rpc_dispatch.rs:374-385,415-438` | 每个 watcher 占一个 worker |
| P1-C6 | framed 读取在 `select!` 中不可取消安全 | `link_realtime.rs:404`；`link_framing.rs:159-174` | 帧错位、误断连 |
| P1-C7 | 路由缓存无 TTL；cluster-bus 至多一次且报 delivered | `redis-cache/src/route_store.rs:56-116`；`cluster.rs:1206-1212` | 节点死亡后事件静默丢失 |
| P1-C8 | 连接池无 checkout 超时；blocking 池 512 无界 | `postgres_support.rs:59-68`；`postgres-realtime/src/lib.rs:202-210` | 池饱和时线程各等 30s |
| P1-C9 | `block_in_place` 无 runtime 检查；否则每次 DB 新起线程 | `postgres_support.rs:245-262`；`postgres-rtc-state/src/lib.rs:150-159` | 线程膨胀/panic |
| P1-C10 | 会话运行时持全局 RwLock 写锁执行整段事务；23 处 handler 直接跑阻塞运行时 | `runtime.rs:2864,3998-4418`；`runtime/http.rs:3150-3177,3216,3238` | 会话写入进程内串行；worker 阻塞 |
| P1-C11 | 每次取连接执行 `SET search_path`，且含可写 `public` | `postgres_support.rs:268-306` | 双倍往返；schema 回退风险 |
| P1-C12 | 成员缓存把 DB 错误当“无权限”并缓存负结果 | `scope_access_policy.rs:143-157` | DB 抖动时静默丢实时事件 |
| P1-C13 | ~~产品代理 `reqwest::Client::new()` 无 connect/read 超时~~ | 已修复（§2.35）：connect 5s + read 30s（可配） | ✅ 上游挂起不再永久占用 |

### 4.3 API 与 SDK 契约

| ID | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| P1-A1 | ~~`social.runtime.repairDerivedSnapshot.create` 无 handler~~ | 已修复（§2.10） | ✅ 路由已实现并注册 |
| P1-A2 | ~~6 个 streaming 端点不在任何 OpenAPI/manifest/SDK~~ | 复核为非缺陷（§2.24） | `/streams` 属内部服务面，app SDK 明确禁止；app 入口为 `/automation/agent_responses` |
| P1-A3 | ~~`conversations.typing.list` 契约与实现不一致~~ | 已修复（§2.6） | ✅ 运行时已返回 `{items,pageInfo}` + 40003 + 签名 cursor |
| P1-A4 | ~~governance list 返回快照并忽略分页~~ | 已修复（§2.10） | ✅ 改为资源契约并删除假分页参数 |
| P1-A5 | ~~`ownedRouteCount`/`migratedRouteCount` 为 `usize`~~ | 已修复（§2.9） | ✅ int64 string |
| P1-A6 | ~~`QuotaProfileResponse`/`RolloutPolicyResponse` 用 `u32/u8`~~ | 已修复（§2.9） | ✅ int64 string |
| P1-A7 | ~~`page_size` 超限被 clamp 而非拒绝~~ | 已修复（§2.28）：space/social/calls 全部严格 400；runtime inventory 真分页 | ✅ 行为修复（40003 码待框架支持） |
| P1-A8 | ~~space/social/calls cursor 明文/裸序号~~ | 已修复（§2.29 + §2.30）：签名 + scope 绑定 | ✅ 三服务已统一 |
| P1-A9 | 4 个后端 social runtime 列表整表返回 | `social-service/src/runtime_control.rs:82-148` | 无界响应 |
| P1-A10 | ~~52 个 manifest operationId 与契约不一致~~ | 已修复（§2.36）：52 条全量比对，0 漂移 | ✅ 契约与 manifest 一致 |
| P1-A11 | ~~app SDK 含幽灵操作 `principal/profiles/provider_health`~~ | 已修复（§2.20） | ✅ 全语言重新生成后 0 命中 |
| P1-A12 | 管理沙箱在网关监听器上，Bearer 只校验非空 | `standalone-gateway/src/main.rs:129,154`；`admin_sandbox.rs:246-267` | 可达环境下为未鉴权管理面 |
| P1-A13 | ~~`after_audit_seq` 为原始序号 cursor~~ | 已修复（§2.23） | ✅ 签名、租户绑定、不透明 cursor |
| P1-A14 | ~~realtime events 允许 `page_size=1000`（契约 200）~~ | 已修复（§2.9） | ✅ 200 上限 + `limit_invalid` |
| P1-A15 | RPC parity registry 3 处 operationId/path 漂移 | `apis/rpc/parity-registry.yaml:6,69,78-83` | RPC↔HTTP 对等证据错配 |

### 4.4 安全与隔离

| ID | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| P1-S1 | ~~WS upgrade 限流用 UA+语言+10s 桶伪造 IP~~ | 已修复（§2.11） | ✅ 真实对端 + 可信代理链 |
| P1-S2 | `demo` 被 IM 归为 Test（宽松 CORS/无 HSTS/header-only 实时鉴权） | `im-app-context/src/lib.rs:1706-1723`；`etc/topology/cloud.demo.env` | 公网 showcase 跑开发安全姿态 |
| P1-S3 | 实时订阅授权可被 env 关闭，默认构造宽松 | `session-gateway/src/realtime.rs:242-267`；`runtime_bootstrap.rs:47-98` | demo/test 可跨会话订阅 |
| P1-S4 | ~~ops/audit/governance manifest 未声明 required_permission~~ | 已修复（§2.22） | ✅ 双读/写权限 + interceptor 校验 |
| P1-S5 | `tenant.admin` 在 `has_permission` 中隐式全权 | `im-app-context/src/lib.rs:394-416` | 租户管理员=平台运维 |
| P1-S6 | Tauri shell 允许 file/盘符/UNC；`withGlobalTauri`；无 CSP | allowlist 已收窄（§2.18）；CSP+freezePrototype 已加（§2.25）；全局 Tauri 桥仍待迁移 | 🟡 部分修复 |
| P1-S7 | `/readyz` 未校验迁移版本/schema/凭证验证器 | 迁移头（§2.17）+ 凭证验证器（§2.27）已补齐；索引/约束完整性校验仍缺 | 🟡 部分修复 |
| P1-S8 | ~~K8s session-gateway ingress 允许所有命名空间~~ | 已修复（§2.13） | ✅ 仅 edge-ingress 标签命名空间 |
| P1-S9 | nginx body 上限 1100m；无 limit_req/limit_conn | body 8m（§2.13）；API 限流 120r/s+429（§2.26）；limit_conn 无标准键 | ✅ 已修复 |
| P1-S10 | ~~JWT replay key 不含 tenant 且存原始 jti~~ | 已修复（§2.12） | ✅ tenant + sha256(jti) |
| P1-S11 | ~~固定窗口 INCR/EXPIRE 非原子；fail-closed 默认 fail-open~~ | 已修复（§2.15） | ✅ Lua 原子 + 默认 fail-closed |
| P1-S12 | 管理端指标缺字段时伪造 0%/secure/isUp | `AdminComplianceService.ts:69-102`；`AdminDashboardService.ts:124-138` | 违反 PRD 禁止伪造证据 |

### 4.5 客户端

| ID | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| P1-F1 | H5 默认组合超出 PRD/TECH 边界（contacts/orders/agent/org/QR） | `moduleCatalog.ts:54-59`；`contactsModule.tsx:87-97`；`ordersModule.tsx:52-95` | 无 owner SDK/权限/E2E 证据即暴露 |
| P1-F2 | H5 路由注册表 192 条 vs 实际挂载 37 条，bootstrap 全量注册 | `routeCatalog.ts:17,213-217`；`bootstrap/index.ts:98-101` | 155 条幻影路由 |
| P1-F3 | H5 挂载聊天用 raw fetch + 手工双 Token | `cmsAppSdkClient.ts:74-123`；`ChatService.ts:29-30` | 违反 TECH §5 |
| P1-F4 | ~~PC server/Playwright 指向 `dist/index.html`，实际为 `dist/standalone/prod/index.html`~~ | 已修复（§2.40）：规范化 `dist/<profile>/<env>` 解析 | ✅ 生产壳可启动 |
| P1-F13 | ~~Tauri `frontendDist` 指向裸 `dist/`，且构建未固定 standalone.production~~ | 已修复（§2.40）：standalone/prod + 固定 mode | ✅ 桌面嵌入正确产物 |
| P1-F5 | PC/H5 tsconfig 未开启 strict | 两个 `tsconfig.json` | 空值/any/DTO 漂移无静态检查 |
| P1-F6 | Flutter 加载更早分页丢弃最新消息 | `chat_message_history_utils.dart:99-103` | 约 10 页后最新消息消失 |
| P1-F7 | Flutter 实时连接无 generation fence | `chat_realtime_service.dart:72-104` | 过期连接泄漏 |
| P1-F8 | Flutter 离线队列明文且仅 tenant 隔离，登出不清理 | `offline_send_queue.dart:6-30,322-357` | 明文残留、跨账号串数据 |
| P1-F9 | H5 组织目录全量下载后内存过滤，错误返回空数组 | `OrganizationService.ts:3-5,87-101,237-353` | 禁止模式；错误伪装为空 |
| P1-F10 | PC 每个媒体文件泄漏 blob URL 并写入离线状态 | `MessageInput.tsx:59-76`；`ChatService.ts:3115-3175` | Blob 常驻内存 |
| P1-F11 | PC 群成员查找最多扫描 10,000 成员 | `GroupService.ts:1192-1229` | 交互操作最多 50 次串行请求 |
| P1-F12 | ~~PC 未知模块渲染 `"{tab} Content"` 占位~~ | 已修复（§2.46）：i18n 不可用提示 | ✅ 无伪内容 |

### 4.6 交付、合规与文档

| ID | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| P1-R1 | 计费/计量/配额宣称已实现，代码与表结构不存在 | `GA_SIGN_OFF.md:156-158`；`BILLING_METERING.md:39-40` | 无法计量/限流/开票 |
| P1-R2 | GDPR/DSAR 删除与租户导出无实现 | `DATA_PROTECTION.md:24-32`；`apis/` 无操作 | 无法履行删除/导出 |
| P1-R3 | 原子性/重试测试全部 `#[ignore]`，CI 不执行 | `message_post_outbox_live_integration_test.rs:453,889` | 可靠性指标未证明 |
| P1-R4 | CI 门禁引用不存在的包 `sdkwork-im-cloud-gateway` | `.github/workflows/im-commercial-gates.yml:116-117` | readiness 解除后门禁失败 |
| P1-R5 | SBOM 仅 1 个 file component；provenance 自述 | `workflow-supply-chain-evidence.mjs:100-150` | 供应链证据不可信 |
| P1-R6 | 仅 5 条告警规则，无 Alertmanager/PagerDuty/DB/复制告警 | `prometheus-rules.yaml:1-55`；README 引用不存在告警 | 值班/DR 无支撑 |
| P1-R7 | AGPL 与 `COMMERCIAL-LICENSE.md` 额外限制冲突 | `LICENSE:1`；`COMMERCIAL-LICENSE.md:1-12` | 采购法务阻断 |
| P1-R8 | 清单断言已发布但 `publish.status=DRAFT`、0 个启用包 | `agent.app.config.json:152,947-948` | 自相矛盾 |
| P1-R9 | 清单镜像 `:latest`+`Always`；README 服务数量与实际不符 | `deployments/kubernetes/cloud/*/deployment.yaml` | 直接 apply 不可复现 |
| P1-R10 | 52/68 PC 测试脚本与 H5 套件未接入门禁 | `package.json`；`run-sdkwork-im-standards-verification.mjs` | 大量测试不设防 |
| P1-R11 | SDK 生成顺序缺陷：`dist/` 不存在时把 facade import 写成 `generated/server-openapi/src/index`，随后 `assemble` 才构建 dist，导致 facade `tsc` 报 TS6059 | 复跑生成：首次 10 个 facade 变为 src import，`pnpm typecheck` 失败；构建 dist 后再次生成恢复 `dist/index.js` | clean checkout 上生成会产出不可编译的 SDK facade |
| P1-R12 | ~~`sdkwork-im-normalized-authority-standard.test.mjs` OOM/87 分钟~~ | 已修复（§2.7） | ✅ 2.7 秒 PASS |

## 5. SQLite 与 PostgreSQL

### 5.1 服务端仅 PostgreSQL（符合架构声明）

`crates/sdkwork-im-database-pool/src/engine_policy.rs:10-22` 与
`crates/sdkwork-im-database-host/src/lib.rs:63-76` 显式拒绝非 PostgreSQL 引擎；
streaming/calls/audit 仅在 dev/test 允许内存回退，生产 fail-closed。
“SQLite 服务端实现缺失”不是缺陷，而是 TECH §10 的文档化决策。

### 5.2 客户端 SQLite 离线缓存（真实实现，有数据丢失风险）

位置：`apps/sdkwork-im-pc/packages/sdkwork-im-pc-desktop/src-tauri/src/offline_store.rs`、
`offline_store/database.rs`、`database/migrations/sqlite/0004_*`。
质量：STRICT + WITHOUT ROWID、principal 四维主键、`enc-v1:` 密文 CHECK、AES-256-GCM + keyring、
WAL + `synchronous=FULL`、`BEGIN IMMEDIATE`、claim lease + fencing、待发队列上限、登出清理。
缺陷：schema 升级删除整个 SQLite family（含未发送队列，P1-D13）；Windows 文件权限限制为 no-op；
每次写入对 scope 全量窗口做 `ROW_NUMBER()+SUM` 裁剪。

## 6. 分页合规评估（PAGINATION_SPEC v1.3）

| 端点/域 | 实现 | 结论 |
| --- | --- | --- |
| `messages.list` | keyset `message_seq <`，200，40003，签名 cursor | ✅ |
| `conversations.members.list` | keyset，200 | ✅ |
| `messages.search` | FTS keyset + 全量 COUNT，明文 cursor | ⚠️ P1-D7 |
| `inbox.list` | PostgreSQL 权威 keyset（§2.2） | ✅（本轮修复） |
| `messages.favorites.list` | PostgreSQL 权威 keyset + 签名 cursor | ✅（本轮修复） |
| `social.friendships/friendRequests/contacts` | keyset + 签名 cursor | ✅（错误码为字符串） |
| `spaces.*.list`（11） | clamp + 明文 cursor | ❌ P1-A7/A8 |
| `social.userBlocks/directChats.list` | clamp + 明文 cursor | ❌ |
| `calls.sessions.signals.list` | clamp + 数字 cursor + 忽略非法 cursor | ❌ |
| `realtime.events.list` | 上限 200（§2.9） | ✅ |
| `audit.records.list` | keyset，200，签名 `cursor`（§2.23） | ✅ |
| 后端 social runtime 4 个列表 | 整表返回 | ❌ P1-A9 |
| governance 快照端点 | 改为资源契约（§2.10） | ✅ |

另：`SdkWorkCursorListQuery` 无 `deny_unknown_fields`，除好友请求外所有列表静默忽略
`limit/pageSize/page_no/...` 与 `page+cursor` 组合（PAGINATION_SPEC §14.1.1 要求 40003）。

## 7. 文档诚信与已清理项

| 文档/资产 | 问题 | 处置 |
| --- | --- | --- |
| `docs/api-reference.md` | 曾为 132/211，生成器 `--check` 失败 | ✅ 已重新生成（216/58），纳入门禁 |
| `TECH-13-pagination-debt-register.md` | 宣称零债务却引用已退役 `projection-service/*` | 已重建为当前代码事实（§2.39），仅保留残余 PAG-R1/R2 |
| `CODE_REVIEW_AND_BUG_FIXES.md:3,16,85,121` | 宣称 100% 修复，引用不存在文件 | 已加历史快照声明并指向本评审（§2.41） |
| `COMMUNICATION_FEATURE_AUDIT_REPORT.md:71,92` | 宣称 SQLite DDL 对等 | 已改为 PostgreSQL-only + SQLite 仅桌面缓存（§2.41） |
| `GA_SIGN_OFF.md:220-221` | Phase 1 全部完成 vs PRD pre-launch/DRAFT | 已加状态更正声明（§2.41） |
| `TECH_ARCHITECTURE.md:229-234` | readiness 迁移/schema/凭证校验、熔断器未实现 | 迁移头+凭证校验已实现（§2.17/§2.27，文档已同步）；熔断器仍待实现 |
| `TECH_ARCHITECTURE.md:213-219` | “Redis 丢失不能改写真相” vs Redis seq 权威 | 已补 PG 高水位播种（§2.32），文档已同步 |
| `artifacts/perf/step-11/**` | 32 连接/64 消息回填证据 | P0-6，待删除并重跑 |
| `REVIEW-20260710-*` | “只从规范化表读取” vs 仍有内存投影 | P0-2 完成后才成立 |
| `TECH_ARCHITECTURE.md` 分片 | 非规范命名 + 1176 个历史分片未链接 | 已重命名 6 个文档、补齐引用与 Shard Index（§2.42）；`check-repository-docs-standard` 通过；历史分片归档需人工批准 |

## 8. 商业化落地能力评估

### 8.1 能力矩阵

| 域 | 状态 | 关键缺口 |
| --- | --- | --- |
| 身份与鉴权 | 🟡 部分就绪 | 双 Token/jti/吊销真实；WS 限流可绕过；demo 姿态错误；backend manifest 无权限 |
| 租户隔离 | 🟡 部分就绪 | 静态 SQL 扫描通过；无逐端点负向矩阵 |
| 核心 IM 数据 | 🟡 部分就绪 | inbox/summary/profile/favorites 已持久化；pins/交互摘要支持 PG 冷回退；设备投递回执按实时 ack 语义（不持久）；seq 为 PG 高水位播种的 Redis 批次 |
| 实时与 HA | 🟡 部分就绪 | P0-1/P0-5 已修；无 TTL/投递确认、窗口写放大 |
| 数据库与迁移 | 🟡 部分就绪 | 58 张表与契约一致；保留期 25/25 表清理 + 0012 扫描索引；迁移 0001 单事务无超时 |
| 分页与契约 | 🟡 部分就绪 | 主体合格；space/social/calls 有违规；6 个端点无契约；52 个 manifest 漂移 |
| 客户端 | 🟡 部分就绪 | H5 边界/路由/raw HTTP；PC 生产壳与 Tauri 产物路径已修（§2.40）；Flutter 窗口/明文队列 |
| 安全 | 🟡 部分就绪 | 无 SQLi/SSRF/明文密钥；WS/HTTP 限流、Tauri CSP、NetworkPolicy 已收口；沙箱/演示姿态待收口 |
| 可观测性 | 🟡 部分就绪 | OTel/Grafana/5 条规则；无 Alertmanager/DB/复制告警 |
| 供应链 | 🔴 未就绪 | 无签名产物、SBOM 合成、provenance 自述、无镜像扫描 |
| 容量证据 | 🔴 未就绪 | 回填数据；无真实多节点压测 |
| 计费/计量/配额 | 🔴 未就绪 | 代码与表结构均不存在 |
| 合规（GDPR/DSAR） | 🔴 未就绪 | 无删除/导出实现 |
| 运营（备份/DR/值班） | 🟡 部分就绪 | 备份脚本与 runbook 存在；无恢复演练、无多区域 |
| 法务 | 🔴 未就绪 | AGPL 与商业许可冲突 |
| 支持/版本策略 | 🔴 未就绪 | 无版本/弃用策略、无生效 SLA |

### 8.2 Top 10 阻断项与最小闭环

1. ~~**pins/交互摘要仍非持久（P0-2 剩余）**~~ → 已修复（§2.38：PostgreSQL 冷回退）；
   设备投递回执已按实时语义关闭（§3 P0-2 结论），不作为持久业务真相。
2. **容量证据回填（P0-6，运营缺口）** → 门禁已拒绝回填边界（`{ok:false}`）；需专用拓扑重跑、生成
   provenance/checksum 索引并由 CI 签名，随后按枚举路径清理回填产物。
3. **计费/计量/配额缺失（P1-R1）** → `im_metering_events` + 配额中间件，或限定不计费发布并删除宣称。
4. **GDPR 删除/导出缺失（P1-R2）** → backend 操作 + 审计证据 + 回滚窗口。
5. ~~**seq 权威在 Redis（P1-D1）**~~ → 已修复（§2.32：Lua 原子播种 + PG 高水位）。
6. ~~消息编辑事务缺锁（P1-D2）~~ → 已修复（§2.20：分区锁 + 序号重算）。
7. **原子性/故障注入未验证（P1-R3）** → CI 启用 `--ignored` live 测试 + failpoint。
8. **readiness 缺 schema/迁移/凭证校验（P1-S7）** → 迁移头 + 凭证验证器已补齐（§2.17/§2.27）；索引/约束完整性探针仍缺。
9. **WS 限流可绕过（P1-S1）** → peer addr + trusted proxy + 无法获取时 fail-closed。
10. **法务/供应链/支持政策（P1-R5/R7）** → 统一许可证、真实 SBOM + OIDC 证明、版本与弃用策略。

### 8.3 分阶段路线图

**阶段 A（0–2 周）**：真实预发布/容量拓扑运行并产出直接证据（回执已按实时语义关闭）；云清单 P0-4/P0-5 已修，补 kind 集群验证；
删除回填容量证据；PAGINATION-DEBT-REGISTER 已重建（§2.39）；PC 产物路径已修（§2.40）；修 H5 路由注册表。

**阶段 B（2–6 周）**：seq 收敛 PG；typing/governance 契约修复；manifest operationId
对齐并重新生成 app SDK；实时窗口写放大；保留期覆盖。

**阶段 C（6–12 周）**：会话运行时锁粒度与 DB 异步化；保留期全表 + 全局索引；迁移拆分与超时；
WS 生命周期与优雅退出；告警/恢复演练；计费/计量/配额；GDPR 删除/导出。

**阶段 D（持续）**：真实容量/HA/DR 证据、签名 + SBOM + provenance、渗透测试、许可证与支持政策；
`publish.status` 从 DRAFT 迁出前必须全部 P0 关闭且 §8.2 十项有可复现证据。

## 9. 残余风险与未验证项

- 依赖台账（2026-10-21 `cargo update --dry-run`）：146 个可更新条目、17 个新增传递依赖；
  lockfile 未在本轮批量升级（避免在商业化门禁全绿后引入未验证变更）。
  后续应单开依赖升级轮：升级 → `cargo check --workspace` → 相关测试 → 再跑 readiness。
- 未启动数据库/服务，未执行 `EXPLAIN ANALYZE`；索引结论来自 DDL + 查询形状。
- 未运行完整 `cargo test --workspace`；仅对改动 crate 执行 check/test。
- 已执行 `node scripts/release/commercial-readiness.mjs`（2026-10-21）：PC lint、H5 build、
  H5 architecture、Flutter architecture、chat attribution、Playwright e2e 已通过；
  最终 governance 节点测试目录仍有 10 个既有 gate 失败（§2.43），因此未整体通过。
- H5 Notary/Orders 依赖的兄弟仓库包未审计内部实现。
- 非 TypeScript 生成 SDK 未逐语言核对操作集合。
- 跨租户负向矩阵未实际执行，只有静态扫描与抽样 handler 追踪。
- `message_seq` 1000 宽批预取的顺序错乱影响面需真实多节点量化。
- IAM 是否实际签发 `tenant.admin` 未知，决定 P1-S5 严重度。
- **跨仓库构建阻断**：`sdkwork-knowledgebase` 的 `postgres_import_stores.rs:947-955` 编译失败，
  导致 `sdkwork-api-im-assembly`/standalone 网关无法完成构建；修复前不得宣称可发布。
- 本轮曾用 PowerShell 5.1 `Set-Content` 重写本文档导致编码损坏，已用 UTF-8 重写；
  后续中文文档编辑必须使用编辑工具或显式 UTF-8 编码；Rust 文件同样受影响（`runtime/http.rs`
  曾损坏并从 HEAD 恢复后重做改动）。
- SDK 生成顺序缺陷（P1-R11）：`dist/` 缺失时生成器写出 `src/index` import，facade `tsc` 报 TS6059；
  本轮通过“先构建 dist 再生成”绕过，clean checkout 需修上游生成器。
- `sdkwork-im-normalized-authority-standard.test.mjs` 曾 OOM/87 分钟，已修复为 2.7 秒 PASS（§2.7）。
- 40003（`InvalidParameter`）业务码尚未在 space/social/calls 的 `ApiProblem` 路径产出，
  当前越界 `page_size` 返回 400；需框架提供带业务码的 problem 构造器。
- calls signal cursor 已迁到签名 token（§2.30），`after_signal_seq` 作为兼容参数保留。
- P1-S4（backend manifest required_permission）：测试基座在 §2.21 修复后，
  ops/audit/governance 已在 §2.22 启用读/写权限并通过全量测试。
- P1-A2（streaming 端点无契约）：复核为非缺陷（§2.24）：`/streams` 属内部服务面，
  app SDK family 明确禁止；app 客户端流式入口是 `/app/v3/api/automation/agent_responses`。

## 10. 复现命令

```bash
# 契约与分页门禁
node ../sdkwork-specs/tools/check-pagination.mjs --workspace .
node ../sdkwork-specs/tools/check-api-response-envelope.mjs --workspace .
node ../sdkwork-specs/tools/check-api-operation-patterns.mjs --workspace .
node scripts/dev/sdkwork-im-multi-tenant-isolation-contract.test.mjs

# 数据库与文档
node tools/materialize_im_database_contract.mjs
node docs/sites/scripts/generate-contract-inventories.mjs --check
node scripts/dev/sdkwork-im-database-naming-standard.test.mjs
node scripts/dev/sdkwork-im-database-framework-standard.test.mjs
node scripts/dev/sdkwork-im-knowledgebase-org-sentinel.test.mjs
node ../sdkwork-specs/tools/check-database-framework-standard.mjs --root .
node scripts/dev/sdkwork-im-governed-docs-encoding.test.mjs
node scripts/dev/sdkwork-im-review-step-docs-encoding.test.mjs

# 部署环境契约
node scripts/dev/sdkwork-im-cloud-runtime-env-contract.test.mjs

# 运行时修复验证
cargo test -p sdkwork-im-contract-control --lib realtime_scope_key
cargo test -p session-gateway --lib test_cleanup_keeps_route_epoch_notifiers
cargo check -p im-adapters-postgres-journal --all-targets
cargo check -p sdkwork-comms-conversation-service --all-targets
cargo test -p sdkwork-comms-conversation-service --lib
```

# IM 通信功能审查报告

**最后更新**: 2026-09-10  
**范围**: IM 核心服务端、PC/H5/Flutter 客户端、Console/Admin 运营面  
**状态**: 实现对齐进行中 — P0 DDL/分页/安全/OOM 债务已收口；2026-09-10 完成 int64 线路契约全量对齐、H5 虚假页面清除、social outbox 事务原子化、cursor 不透明化与生产 env 补齐；商业化 Pre-Release 仍需 `check:commercial-readiness` 以真实签名、SBOM、provenance、checksum 和 catalog media 证据通过后才能声明就绪

---

## 2026-09-10 修复清单

| ID | 问题 | 修复 |
|---|---|---|
| WIRE-001 | `StreamSession.lastFrameSeq/lastCheckpointSeq` 等以 JSON number 输出，契约声明 int64-string | `crates/im-domain-core/src/stream.rs` 全部 seq 字段接入 `serde_uint64` helper |
| WIRE-002 | automation `frameSeq` 请求 DTO 以 `u64` 反序列化，契约合规客户端（字符串）被 400 | `services/automation-service/src/dto.rs`、`services/streaming-service/src/dto.rs` 接入 helper |
| WIRE-003 | ops `RetentionPurgeResponse`（batchSize + 9 计数）、`JournalReplayStatusView.totalCommits/headCommitOffset`、诊断 seq 字段输出 number | `services/ops-service/src/dto.rs` 接入 helper；`stream_lifecycle_test`、`http_smoke_test` 断言同步为字符串 |
| WIRE-004 | 交互摘要响应携带未声明的 `readReceipt`/`deliveryReceipt`，且 `readSeq`/`syncSeq` 为 number | 补 open-api 4 个 schema + 属性声明；`conversation_state/model.rs` 接入 helper；timeline `messageSeq` 同步修正 |
| WIRE-005 | audit `AuditChainVerification.total` 流式导出信封以 number 输出（与类型化路径不一致） | `export_stream.rs` 统一序列化为十进制字符串；backend YAML 补 `records`/`export` 三个操作与 schema（反向漂移） |
| FAKE-001 | H5 `BillingRecordsPage` 渲染硬编码 MOCK 账单（伪造支付历史），`GamesPage` 伪造游戏商城 | 页面改造为 typed fail-closed unavailable 态；默认模块目录收回已审计发布面（chat/contacts/notary/orders），README 同步 |
| ATOM-001 | social 域 outbox 在主事务提交后单独入队，失败仅 warn → 崩溃丢失投递证据 | outbox 证据经 `enqueue_outbox_event_on_transaction` 并入 authority 单事务（outbox 模式）；fanout 模式行为不变 |
| PAG-041 | streaming frames、conversation RPC inbox/members/pinned 使用数字 offset cursor | 引入版本化不透明 cursor（`sq1.`/`of1.` base64url），拒绝裸数字 token |
| PAG-042 | audit-service `page_size>200` 静默钳制 | 改为 400 `invalid_parameter` 拒绝（PAGINATION_SPEC §10.1） |
| SEC-010 | `ensure_local_dual_token_environment_for_unconfigured_process` 进程级 `set_var("SDKWORK_IM_ENVIRONMENT","test")` 降级开关，生产代码路径可达 | 移除全局突变，改为警告；依赖隐式翻转的 12 个测试文件显式设置 env |
| SEC-011 | `REQUIRE_JTI=true` 但未配置 replay TTL 时防重放静默失效；进程本地 jti 缓存无上限 | 生产姿态下缺 TTL 直接拒绝（fail-closed）；本地缓存加 10 万条硬上限 |
| SEC-012 | `cloud.production.env`/`standalone.production.env` 缺 JWT iss/aud 允许列表（照模板部署全站 token 被拒） | 补齐 `SDKWORK_IM_JWT_EXPECTED_ISSUERS/AUDIENCES` |
| CONC-001 | `cleanup_stale_disconnect_fences` 持全局锁逐条远程读，高连接数下周期性卡死路由操作 | 改为先收集 key、锁外验证（对齐 notifier 清理模式） |
| CONC-002 | conversation outbox relay 在 tokio reactor 上同步做万人级阻塞扇出 | drain 体移入 `spawn_blocking`，异步循环仅等待与观察 shutdown |
| CONC-003 | 通知投递单串行循环（每设备 5-6 次 PG 往返，上限约 64 任务/s） | 批次内有界并行（默认 8，env 可调，上限 32），claim lease 保证跨副本安全 |
| RUST-001 | 生成 Rust SDK 声明 `[lints] workspace=true` 但根无 `[workspace.lints]`（manifest 校验 3 error）；缺 MSRV | 根 `Cargo.toml` 声明 `rust-version` + `[workspace.lints]` 基线；release profile 启用 `overflow-checks` |
| REG-001 | `parity-registry.yaml` 将未托管的 `social.contacts.list` 标为 `parityStatus: full` | 改为 `http-only` 并注明原因 |
| SEC-013 | 对象存储上传 allowlist 含 `image/svg+xml`（存储型 XSS 载体） | 移除 SVG，注明附件下载边界责任 |
| FLUTTER-001 | 离线发送队列 claim 无过期 + 跨会话 flush 搁浅其他会话消息（静默丢失） | claim lease（60s）+ 作用域化 claim + 重试预算/隔离区 + 陈旧 claim 自愈；`parseWireSeq` 不再静默归零（对齐 PC 语义，10 个新测试） |
| H5-002 | H5 unstar 全量扫描无页数上限；组织架构 path walk 无环保护 | 加 `MAX_FAVORITE_LOOKUP_PAGES` 上限；`resolveDepartmentPath` visited-set 防环 + typed error |

---

## 2026-09-10 第二轮修复清单（存量失败清零 + 测试基建统一）

| ID | 问题 | 修复 |
|---|---|---|
| TEST-001 | 双 token 测试夹具未显式禁用 AppContext 签名门，导致解析降级为 `principal user:0`/500/404（含 http_smoke 35 个失败） | 13 个测试文件统一 `SDKWORK_IM_ENVIRONMENT=test` + `SDKWORK_IM_APP_CONTEXT_REQUIRE_SIGNATURE=false` 引导；`with_updated_local_dual_token_context` 的 system 回退不再被触发 |
| TEST-002 | governance control-plane 测试经空 manifest 组合（`wrap_im_service_router`），控制面路由全部 404 | 路由 manifest 移入 service（`governance_service::route_manifest`，规避 service→route-crate 循环依赖），service 侧组合改用 `wrap_im_service_router_with_manifest` |
| TEST-003 | social control 测试同样经空 manifest 组合 | 测试改经 `sdkwork_routes_im_social_backend_api::build_control_embedded_public_app`（带 manifest 的正式组合） |
| WIRE-007 | 残留测试断言/请求体使用数字 seq（highWatermark/readSeq/assignmentGeneration/expectedGeneration/total/auditSeq） | 全部改为 int64-string；内部事件信封保持原生数值（domain 边界约定） |
| REG-002 | `internal.routeLeases.claim` 的 rpcOnlyReason 未披露未托管事实 | 补充"declared but not hosted (Phase 2, ADR-20260619)" |
| DEP-001 | 依赖未刷新 | `cargo update` 刷新至最新 semver 兼容版本后全量回归通过 |

**第二轮回归结果**：14 个服务/契约 crate 共 **1,279 测试全部通过、0 失败**（im-app-context 27、im-domain-core 187、streaming 34、audit 25、notification 44、ops 20、social 49、session-gateway 268、conversation 491、governance 41、portal 6、automation 83、space 18、media 7）。

---

## 2026-09-10 第三轮修复清单（文档/工作流/MSRV 对齐 + 依赖最新化）

| ID | 问题 | 修复 |
|---|---|---|
| DOC-001 | 第一轮新增 audit records/export 操作后 `docs/api-reference.md` 计数与清单漂移（55→58） | 更新总数与表项；`audit/export` operationId 定为 `audit.export.retrieve`（避免与 records.list 重复且满足 GET 动作词规范）；三面共 214 个 operationId 与文档双向零漂移 |
| GEN-001 | SDK 侧 OpenAPI 快照过期（缺新增 audit 操作，且未声明 streaming 路由的陈旧生成类型残留） | 经标准命令 `sdks/materialize-im-v3-openapi-boundaries.mjs` 重新物化（367 个生成文件，含陈旧 streams-frames 类型清除）；`verify-im-v3-sdk-family-contract` 通过 |
| WF-001 | `.github/workflows/package.yml` 缺 14 个依赖 ref 的 workflow_dispatch inputs 与 dependency_refs_json 透传 | 补齐 assets/cloudrouter/discovery/feeds/generations/id/image/memory/music/partner/prompts/sandbox/skills/video；`check-agent-workflow-standard` 通过 |
| MSRV-001 | 96 个成员 crate 未继承 `rust-version.workspace`（manifest 校验 102 条 warning） | 全部接线 `rust-version.workspace = true` 并通过编译；warning 降至 104（剩余为 2 个生成物 crate 不可手改 + lints-not-wired 待专项接线） |

**第三轮回归结果**：14 crate 共 **1,300 测试通过、0 失败**；10/10 规范校验器通过。

| ID | 问题 | 修复 |
|---|---|---|
| I18N-001 | Flutter 聊天面全部用户可见文案硬编码英文（违反 I18N_SPEC §6.1） | 聊天包接入 `flutter gen-l10n`（en+zh ARB、19 条消息、生成的 delegates 已提交）；两个页面与 snackbar 全部改经 `AppLocalizations` 查找；新增 2 个 l10n 回退/中文断言测试；`flutter analyze` 0 问题、23/23 测试通过。已知偏差：采用包级单 ARB 而非规范的 per-screen fragment 布局（copy 规模增长时应拆分并加 merge 步骤） |

## 2026-07-07 修复清单

| ID | 问题 | 修复 |
|---|---|---|
| DDL-001 | PostgreSQL DDL 重复表定义（Migration 001 覆盖 010） | 移除旧 Migration 001，保留 010 organization_id 版本 |
| DDL-002 | SQLite DDL 使用 PostgreSQL 专有语法（JSONB/TIMESTAMPTZ/DO $$/pg_constraint） | 生成 SQLite 兼容 DDL（TEXT + json_valid CHECK） |
| PAG-039 | social-service block 列表使用 OFFSET 分页 | 改为 keyset `(created_at DESC, block_id DESC)` |
| PAG-040 | social-service direct_chat 列表使用 OFFSET 分页 | 改为 keyset `(updated_at DESC, direct_chat_id DESC)` |
| SEC-001 | 游标签名密钥硬编码回退 | 添加 `_FILE` 变体支持，移除硬编码密钥，fail-closed |
| OOM-001 | timeline 全量恢复无上限 | 添加 10,000 条安全上限 |
| PERF-001 | 会话驱逐 O(n log n) 全量排序 | 改为 `select_nth_unstable_by_key` O(n) |

---

## 当前基线能力

| 域 | 能力 |
|---|---|
| 消息 | `message_seq` + `commit_seq`；Outbox at-least-once |
| 连接 | Pre-auth WS 预算；认证后正式槽；帧/升级 RPM 限流 |
| Social / Space | PG materialize-before-append；多 commit 单 PG 事务 |
| Projection | HS256 keyset 分页；timeline 热缓存 cap；embedded apply 生产 fail-closed |
| Portal API | `portal-service` + `im-portal-snapshots` 从 ops 健康面与 audit 记录聚合 |
| PC 客户端 | 游标分页；SQLite 离线缓存 + claim/lease 待发队列 |
| H5 客户端 | 游标分页；IndexedDB 离线待发队列 + claim/lease |
| Flutter | Inbox 游标多页同步 + `shared_preferences` 离线待发（claim/lease） |
| 数据库 | IM 核心 **PostgreSQL-only**；SQLite 为契约 parity + 桌面/网关缓存 |
| Realtime | 生产 fail-closed（PG pool + membership gate）；canonical mutex 锁序 |

---

## 数据库引擎边界

| 表面 | PostgreSQL | SQLite |
|---|---|---|
| Journal / Projection / Social | ✅ 唯一权威 | ❌ 不持久化 |
| Notification / Automation 任务表 | ✅ Postgres store | DDL parity only |
| 桌面离线缓存 | — | ✅ Tauri `offline_store`（WAL + 事务 + claim） |
| Gateway webstore | — | ✅ `chat.sqlite` |

---

## 后端服务边界

| 服务 | 职责 | 持久化 |
|---|---|---|
| `portal-service` | Console/Workspace portal 快照 HTTP | 无状态；读 ops/audit |
| `sdkwork-comms-conversation-service` | 会话写路径 + RPC unary | PostgreSQL journal；`spawn_blocking` 写路径 |
| `sdkwork-comms-conversation-service` | Inbox/timeline 规范化读写模型 | PostgreSQL + 有界热缓存 |
| `session-gateway` | WebSocket + RPC realtime | Redis/PG realtime stores；生产 fail-closed |
| `im-calls-service` | RTC 信令 HTTP | Postgres/Redis durable state；`spawn_blocking` handlers |
| `audit-service` | 审计记录 | PostgreSQL；生产 fail-closed panic |

---

## RPC 与客户端路径

详见 [`RPC-AVAILABILITY.md`](architecture/tech/RPC-AVAILABILITY.md)。

- **生产客户端**：HTTP app-sdk + WebSocket（session-gateway）
- **gRPC Phase 1**：`PresenceService`、`RealtimeService`、conversation unary（3 个 rpc-bin）
- **未托管 RPC**：Contact/Social/Call/Notification/Automation/admin — 使用 HTTP，勿调用 gRPC stub

---

## 明确未集成（非 IM 核心上线阻塞）

| 项 | 说明 |
|---|---|
| E2EE | 仅 TLS；见 `OPTIMIZATION_ROADMAP.md` Phase 2 |
| FEC 自适应弱网 | Phase 2；ARQ `events.nack` 已交付 |
| Conversation RPC server-stream | 实时流在 session-gateway WS |
| Telegram 级 200K 群 | 当前 10K cap |
| Flutter 离线 SQLite | Inbox 游标分页 + SharedPreferences 待发 claim/lease 已交付；完整 SQLite 消息缓存 Phase 2 |

---

## 验证命令

```bash
node ../sdkwork-specs/tools/check-pagination.mjs --workspace .
node ../sdkwork-specs/tools/check-api-response-envelope.mjs --workspace .
node scripts/dev/sdkwork-im-production-security-standard.test.mjs
cargo check -p session-gateway -p im-calls-service -p sdkwork-comms-conversation-service
pnpm run check:commercial-readiness
```

---

## 行业对齐摘要

| 能力 | 状态 |
|------|------|
| Per-channel seq + journal seq | ✅ |
| Outbox at-least-once | ✅ |
| PG materialize + 单事务多 commit | ✅ |
| 核心列表 keyset 分页 + SdkWorkPageData | ✅ |
| 生产 fail-closed（audit/conversation/session-gateway） | ✅ |
| 桌面 + H5 + Flutter 离线待发 claim/lease | ✅ |
| gRPC 全 manifest 托管 | ❌ Phase 2 |
| E2EE / FEC Phase 2 / 超大群 | 📋 路线图 |

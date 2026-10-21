# Pagination Debt Register

Authority: `sdkwork-specs/PAGINATION_SPEC.md` (§12 Pre-Launch Zero-Debt Rule).

**Status (2026-10-21):** Interactive list APIs use keyset pagination with bounded `page_size`
validation and signed, scope-bound opaque cursors. Two residuals remain and are listed below;
everything else in this register is closed on the current codebase. Pre-2026-10 history lives in
git history and is intentionally not restated here (retired `projection-service` entries are not
current debt).

## Closed in 2026-10-21 audit remediation pass

| ID | Resolution |
| --- | --- |
| PAG-061 | `space-service` / `social-service` / `calls-service` — out-of-range `page_size` rejected (400) instead of clamped; helpers use `SdkWorkCursorListQuery::resolve_page_size()` |
| PAG-062 | `social-service` shared-channel-sync runtime inventory (`pending`/`dead_letter`/`delivered`) — replaced `full_inventory_page` full dump with keyset pages + signed scope-bound cursors |
| PAG-063 | Removed the `full_inventory_page` helper that returned an entire inventory with `nextCursor = null` |
| PAG-064 | `crates/sdkwork-im-keyset-cursor` — shared HMAC-SHA256 keyset cursor codec bound to resource + tenant + org + principal |
| PAG-065 | `space-service` 8 list endpoints — plaintext `sort|id` cursor → signed opaque cursor; plaintext/foreign/tampered cursors rejected |
| PAG-066 | `social-service` `user_blocks` / `direct_chats` — plaintext cursor → signed opaque cursor |
| PAG-067 | `calls-service` signal list — numeric `signal_seq` cursor → signed opaque cursor (`after_signal_seq` remains contract-compatible) |
| PAG-068 | `audit-service` record list — numeric `after_audit_seq` → signed opaque `cursor` bound to tenant/org/audit_seq |
| PAG-069 | `conversation-service` typing-indicator list — `{items,pageInfo}` + signed scope-bound cursor + 40003 on invalid `page_size` |

## Open residual pagination items

| ID | Item | Status |
| --- | --- | --- |
| PAG-R1 | `space/social` invalid `page_size` returns HTTP 400 with the framework's generic problem code instead of `40003` | `calls-service` now emits `40003` via a local ProblemDetail helper; space/social mapping pending upstream framework support |
| PAG-R2 | `calls` signal list still accepts the contract-defined `after_signal_seq` alongside the signed `cursor` | Compatibility parameter documented in OpenAPI; signed cursor is always emitted for continuation |

## Closed keyset migrations (current services)

| ID | Resolution |
| --- | --- |
| PAG-039 | `social-service/block.rs` — keyset `(created_at DESC, block_id DESC)` |
| PAG-040 | `social-service/direct_chat.rs` — keyset `(updated_at DESC, direct_chat_id DESC)` |
| PAG-043..050 | `space-service` bans/channels/access-rules/groups/group-members/invitations/spaces/members — keyset `(sort_value, entity_id)` |
| PAG-051/052 | Removed deprecated offset helpers from `space-service` (`resolve_list_page`, `sql_fetch_offset`, `limited_list_page`, bounded SQL list pages) |
| PAG-053/054 | Space/social store traits + PostgreSQL implementations take keyset predicates |
| PAG-058/059 | OpenAPI + generated SDK family serialize HTTP query `page_size`; aliases (`pageSize`, `limit`, `page_no`, `pageNo`, `per_page`, `size`) rejected with `40003` where the projection layer owned validation |
| PAG-060 | `social-service/contact_open_api_backend.rs` — keyset range bounds fixed for `Reverse<String>` tag lists |

## Documented bounded exceptions (per PAGINATION_SPEC.md §2.5 and §11, not debt)

| Area | Justification |
| --- | --- |
| Maintenance sweeps (`session-gateway/presence.rs`, `calls-service` expiration) | Batch jobs with early `take(batch_limit)` over sorted iterators; bounded background work is permitted. |
| Organization directory bulk sync | Bounded `forEachCursorPage` startup hydration; bounded batch reconciliation during startup is permitted. |
| Retention purge | Privileged cross-organization maintenance job, bounded by `LIMIT $1` per statement and a partial `(retention_until)` scan index. |

## Zero-debt verification

- ✅ No `page_size` clamping in interactive list APIs (out-of-range values are rejected).
- ✅ No numeric offset strings or plaintext `sort|id` tokens as interactive `cursor`.
- ✅ No `OFFSET` pagination on interactive list APIs.
- ✅ All interactive list responses include `PageInfo.mode`, `hasMore`, and a cursor-mode `nextCursor`.
- ✅ Signed cursors are bound to the list resource plus tenant/org/principal; foreign or tampered tokens are rejected.
- ⚠️ `40003` business code for `space/social/calls` page-size errors pending framework support (`PAG-R1`).

## Verification

```bash
pnpm run check:pagination
node ../sdkwork-specs/tools/check-pagination.mjs --workspace .
node ../sdkwork-specs/tools/check-api-response-envelope.mjs --workspace .
node ../sdkwork-specs/tools/check-api-operation-patterns.mjs --workspace .
cargo test -p sdkwork-im-keyset-cursor
cargo test -p space-service
cargo test -p social-service
cargo test -p calls-service
cargo test -p audit-service
cargo test -p sdkwork-comms-conversation-service --lib
```

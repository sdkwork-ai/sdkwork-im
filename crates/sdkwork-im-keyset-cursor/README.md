# sdkwork-im-keyset-cursor

Shared signed keyset-cursor codec for IM list APIs.

The crate encodes opaque cursors as `base64url(payload).base64url(hmac)` with a
domain-separated HMAC-SHA256 signature. A cursor is bound to the list resource
plus tenant, organization, and principal so a cursor minted for one scope cannot
be replayed against another.

## Usage

- `CursorScope::new(resource, tenant_id, organization_id, principal_id)`
- `encode_keyset_cursor(&scope, &position)` — returns the opaque `cursor` value.
- `decode_keyset_cursor(&scope, cursor)` — verifies signature and scope; returns
  the position or a typed error that callers map to `40003 INVALID_PARAMETER`.
- `keyset_page(...)` — shared has-more/next-cursor helper.

The signing secret comes from `SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET`; a
development-only fallback is used when the environment is explicitly `dev` or
`test`. Production readiness rejects the fallback (see
`sdkwork-im-service-readiness`).

## Verification

```bash
cargo test -p sdkwork-im-keyset-cursor
```

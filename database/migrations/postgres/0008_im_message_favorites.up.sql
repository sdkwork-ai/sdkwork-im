-- sdkwork:migration
-- id: 0008_im_message_favorites
-- engine: postgres
-- module: sdkwork-im
-- purpose: Persist principal Message favorites. Favorites were process-memory
--   only, so the favorites list disappeared on restart and differed per
--   replica. Rows are principal-scoped, keyed by a deterministic favorite id,
--   and survive Message recall (no FK to messages).
-- reversible: true
-- rollback: down-migration
-- transactional: true
-- lock: lightweight
-- lock_timeout: 2s
-- statement_timeout: 30s

BEGIN;

CREATE TABLE IF NOT EXISTS im_message_favorites (
    tenant_id            TEXT NOT NULL,
    organization_id      TEXT NOT NULL DEFAULT '0',
    principal_kind       TEXT NOT NULL,
    principal_id         TEXT NOT NULL,
    favorite_id          TEXT NOT NULL,
    favorite_type        TEXT NOT NULL,
    conversation_id      TEXT NOT NULL,
    message_id           BIGINT NOT NULL,
    message_seq          BIGINT NOT NULL CHECK (message_seq > 0),
    title                TEXT NOT NULL DEFAULT '',
    content_preview      TEXT NOT NULL DEFAULT '',
    source_display_name  TEXT NOT NULL DEFAULT '',
    favorited_at         TIMESTAMPTZ NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_im_message_favorites PRIMARY KEY (
        tenant_id, organization_id, principal_kind, principal_id, favorite_id
    )
);

CREATE INDEX IF NOT EXISTS idx_im_message_favorites_page
    ON im_message_favorites (
        tenant_id, organization_id, principal_kind, principal_id,
        favorited_at DESC, favorite_id DESC
    );

CREATE INDEX IF NOT EXISTS idx_im_message_favorites_type_page
    ON im_message_favorites (
        tenant_id, organization_id, principal_kind, principal_id,
        favorite_type, favorited_at DESC, favorite_id DESC
    );

COMMIT;

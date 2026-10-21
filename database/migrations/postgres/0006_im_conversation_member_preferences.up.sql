-- sdkwork:migration
-- id: 0006_im_conversation_member_preferences
-- engine: postgres
-- module: sdkwork-im
-- purpose: Persist per-member Conversation preferences (pin, mute, mark-unread,
--   hide). These were process-memory-only, so a restart lost personalization and
--   the Conversation inbox could not be served from normalized state. The table
--   is member-scoped (principal_kind + principal_id) and cascades with the
--   Conversation membership row.
-- reversible: true
-- rollback: down-migration
-- transactional: true
-- lock: lightweight
-- lock_timeout: 2s
-- statement_timeout: 30s

BEGIN;

CREATE TABLE IF NOT EXISTS im_conversation_member_preferences (
    tenant_id          TEXT NOT NULL,
    organization_id    TEXT NOT NULL DEFAULT '0',
    conversation_id    TEXT NOT NULL,
    principal_kind     TEXT NOT NULL,
    principal_id       TEXT NOT NULL,
    is_pinned          BOOLEAN NOT NULL DEFAULT FALSE,
    is_muted           BOOLEAN NOT NULL DEFAULT FALSE,
    is_marked_unread   BOOLEAN NOT NULL DEFAULT FALSE,
    is_hidden          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_im_conversation_member_preferences PRIMARY KEY (
        tenant_id, organization_id, conversation_id, principal_kind, principal_id
    ),
    CONSTRAINT fk_im_conversation_member_preferences_member FOREIGN KEY (
        tenant_id, organization_id, conversation_id, principal_kind, principal_id
    ) REFERENCES im_conversation_members (
        tenant_id, organization_id, conversation_id, principal_kind, principal_id
    ) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_im_conversation_member_preferences_principal
    ON im_conversation_member_preferences (
        tenant_id, organization_id, principal_kind, principal_id, conversation_id
    );

CREATE INDEX IF NOT EXISTS idx_im_conversation_member_preferences_updated
    ON im_conversation_member_preferences (
        tenant_id, organization_id, principal_kind, principal_id, updated_at DESC
    );

COMMIT;

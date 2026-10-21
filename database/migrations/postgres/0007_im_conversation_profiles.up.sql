-- sdkwork:migration
-- id: 0007_im_conversation_profiles
-- engine: postgres
-- module: sdkwork-im
-- purpose: Persist the Conversation profile (custom display name, avatar, notice)
--   so a restart or a second replica serves the same group/channel identity.
--   Previously the profile only lived in the process-local projection cache.
-- reversible: true
-- rollback: down-migration
-- transactional: true
-- lock: lightweight
-- lock_timeout: 2s
-- statement_timeout: 30s

BEGIN;

CREATE TABLE IF NOT EXISTS im_conversation_profiles (
    tenant_id                    TEXT NOT NULL,
    organization_id              TEXT NOT NULL DEFAULT '0',
    conversation_id              TEXT NOT NULL,
    display_name                 TEXT NOT NULL DEFAULT '',
    avatar_url                   TEXT NOT NULL DEFAULT '',
    notice                       TEXT NOT NULL DEFAULT '',
    updated_by_principal_kind    TEXT,
    updated_by_principal_id      TEXT,
    created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_im_conversation_profiles PRIMARY KEY (
        tenant_id, organization_id, conversation_id
    ),
    CONSTRAINT fk_im_conversation_profiles_conversation FOREIGN KEY (
        tenant_id, organization_id, conversation_id
    ) REFERENCES im_conversations (tenant_id, organization_id, conversation_id)
      ON DELETE CASCADE
);

COMMIT;

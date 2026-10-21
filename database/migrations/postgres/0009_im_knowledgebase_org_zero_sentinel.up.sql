-- sdkwork:migration
-- id: 0009_im_knowledgebase_org_zero_sentinel
-- engine: postgres
-- module: sdkwork-im
-- purpose: Align the group Knowledgebase constraints with the IM-wide
--   organization scope contract. Tenant sessions use the canonical `0` sentinel
--   (see im_conversations.organization_id DEFAULT '0' and
--   runtime/knowledgebase.rs), but both Knowledgebase CHECK constraints only
--   accepted positive numeric ids, so Owner initialization and launch-ticket
--   issuance failed at the database for every tenant-scoped session.
--   This migration accepts `0` and keeps the signed-int64 bound for real
--   organization ids.
-- reversible: false
-- rollback: forward-fix (constraint widening only; no data rewrite)
-- transactional: true
-- lock: lightweight
-- lock_timeout: 2s
-- statement_timeout: 30s

BEGIN;

SET LOCAL lock_timeout = '2s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE im_conversation_knowledge_space_link
    DROP CONSTRAINT IF EXISTS chk_im_conversation_knowledge_space_link_organization_id;

ALTER TABLE im_conversation_knowledge_space_link
    ADD CONSTRAINT chk_im_conversation_knowledge_space_link_organization_id CHECK (
        organization_id = '0'
        OR (
            organization_id ~ '^[1-9][0-9]*$'
            AND (
                char_length(organization_id) < 19
                OR (
                    char_length(organization_id) = 19
                    AND organization_id <= '9223372036854775807'
                )
            )
        )
    );

ALTER TABLE im_group_knowledge_launch_tickets
    DROP CONSTRAINT IF EXISTS chk_im_group_knowledge_launch_tickets_organization_id;

ALTER TABLE im_group_knowledge_launch_tickets
    ADD CONSTRAINT chk_im_group_knowledge_launch_tickets_organization_id CHECK (
        organization_id = '0'
        OR (
            organization_id ~ '^[1-9][0-9]*$'
            AND (
                char_length(organization_id) < 19
                OR (
                    char_length(organization_id) = 19
                    AND organization_id <= '9223372036854775807'
                )
            )
        )
    );

COMMIT;

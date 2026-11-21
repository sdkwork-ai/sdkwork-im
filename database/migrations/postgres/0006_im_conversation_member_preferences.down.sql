-- sdkwork:migration-down
-- id: 0006_im_conversation_member_preferences
-- engine: postgres
-- module: sdkwork-im
-- reversible: true
-- rollback: down-migration
-- purpose: Roll back the per-member Conversation preference table.
--   Forward-fix is the supported recovery path; this down migration exists for
--   schema rollback drills and removes only additive objects.

BEGIN;

DROP TABLE IF EXISTS im_conversation_member_preferences;

COMMIT;

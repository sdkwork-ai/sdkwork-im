-- sdkwork:migration-down
-- id: 0007_im_conversation_profiles
-- engine: postgres
-- module: sdkwork-im
-- reversible: true
-- rollback: down-migration
-- purpose: Roll back the durable Conversation profile table. Forward-fix is the
--   supported recovery path; this down migration exists for schema rollback
--   drills and removes only additive objects.

BEGIN;

DROP TABLE IF EXISTS im_conversation_profiles;

COMMIT;

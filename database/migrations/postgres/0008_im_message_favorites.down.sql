-- sdkwork:migration-down
-- id: 0008_im_message_favorites
-- engine: postgres
-- module: sdkwork-im
-- reversible: true
-- rollback: down-migration
-- purpose: Roll back the principal Message favorite table. Forward-fix is the
--   supported recovery path; this down migration exists for schema rollback
--   drills and removes only additive objects.

BEGIN;

DROP TABLE IF EXISTS im_message_favorites;

COMMIT;

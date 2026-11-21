-- sdkwork:migration
-- id: 0010_im_outbox_events_last_error
-- engine: postgres
-- module: sdkwork-im
-- purpose: Persist the bounded failure reason on outbox relay attempts so
--   terminal failures are diagnosable and dead-letter replays carry evidence.
--   The relay already increments attempt_count and parks terminal rows, but the
--   reason was discarded, leaving operators with no cause for a failed event.
-- reversible: false
-- rollback: forward-fix (additive nullable column; dropping it would discard evidence)
-- transactional: true
-- lock: lightweight
-- lock_timeout: 2s
-- statement_timeout: 30s

BEGIN;

SET LOCAL lock_timeout = '2s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE im_outbox_events
    ADD COLUMN IF NOT EXISTS last_error TEXT;

COMMIT;

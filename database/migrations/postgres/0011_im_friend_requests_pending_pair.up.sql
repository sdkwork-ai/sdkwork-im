-- sdkwork:migration
-- id: 0011_im_friend_requests_pending_pair
-- engine: postgres
-- module: sdkwork-im
-- purpose: Replace the (requester, target, status) unique constraint with a
--   partial unique index over the canonical unordered pair while status is
--   pending. The old constraint rejected a second request after a decline,
--   cancel, or expiry, so a legitimate retry failed with a unique violation
--   and surfaced as HTTP 503.
-- reversible: false
-- rollback: forward-fix (recreate the old constraint only after resolving duplicate pending pairs)
-- transactional: true
-- lock: table scan to validate the unique index
-- lock_timeout: 5s
-- statement_timeout: 120s

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '120s';

ALTER TABLE im_friend_requests
    DROP CONSTRAINT IF EXISTS uk_im_friend_requests_pair;

-- Fail loudly instead of silently dropping history: duplicate pending pairs
-- must be resolved by an operator (decline/cancel the stale request) before the
-- unique invariant can be enforced.
DO $$
DECLARE
    duplicate_pairs bigint;
BEGIN
    SELECT COUNT(*) INTO duplicate_pairs
    FROM (
        SELECT tenant_id, organization_id,
               LEAST(requester_user_id, target_user_id) AS low_user_id,
               GREATEST(requester_user_id, target_user_id) AS high_user_id
        FROM im_friend_requests
        WHERE status = 'pending'
        GROUP BY tenant_id, organization_id, low_user_id, high_user_id
        HAVING COUNT(*) > 1
    ) duplicates;

    IF duplicate_pairs > 0 THEN
        RAISE EXCEPTION
            'im_friend_requests has % duplicate pending pair(s); decline or cancel the stale requests before applying 0011',
            duplicate_pairs;
    END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS uk_im_friend_requests_pending_pair
    ON im_friend_requests (
        tenant_id,
        organization_id,
        LEAST(requester_user_id, target_user_id),
        GREATEST(requester_user_id, target_user_id)
    )
    WHERE status = 'pending';

COMMIT;

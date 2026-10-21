//! Live PostgreSQL coverage for the durable Conversation inbox and per-member
//! preferences.
//!
//! Run with
//! `SDKWORK_DATABASE_URL=postgresql://... cargo test -p
//! im-adapters-postgres-journal --test conversation_inbox_live_integration_test
//! -- --ignored --nocapture`.

use std::time::{SystemTime, UNIX_EPOCH};

use chrono::{Duration, Utc};
use im_adapters_postgres_journal::{
    PostgresConversationInboxAuthority, PostgresConversationMemberPreferencesStore,
    PostgresConversationProjectionStore, PostgresJournalConfig, PostgresMessageFavoriteStore,
};
use im_platform_contracts::{
    ConversationInboxAuthority, ConversationInboxPageCursor, ConversationMemberPreferencesRecord,
    ConversationMemberPreferencesStore, ConversationProfileStore, ConversationSummaryAuthority,
    MessageFavoriteRecord, MessageFavoriteStore,
};

fn test_suffix() -> String {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system time must be after the Unix epoch")
        .as_nanos()
        .to_string()
}

#[tokio::test(flavor = "multi_thread")]
#[ignore = "requires live PostgreSQL via SDKWORK_DATABASE_URL"]
async fn inbox_and_preferences_are_served_from_normalized_tables() {
    let database_url = std::env::var("SDKWORK_DATABASE_URL")
        .expect("SDKWORK_DATABASE_URL must be set for live integration test");
    sdkwork_im_database_pool::bootstrap_im_process_database_pools_from_env()
        .await
        .expect("shared IM database pools should bootstrap");
    let pool = PostgresJournalConfig::new(database_url)
        .connect_pool()
        .expect("postgres journal pool should connect");

    let suffix = test_suffix();
    let tenant_id = format!("inbox-live-{suffix}");
    let group_conversation = format!("c_live_group_{suffix}");
    let direct_conversation = format!("c_live_direct_{suffix}");
    let group_id: i64 = 7_700_000 + suffix.parse::<i64>().unwrap_or(0) % 100_000;
    let now = Utc::now();
    let group_activity = now - Duration::minutes(1);
    let direct_activity = now - Duration::minutes(2);

    {
        let mut client = pool.get().expect("pooled connection");
        let mut tx = client.transaction().expect("transaction");
        for (conversation_id, conversation_type, activity, summary, message_count, last_seq) in [
            (
                group_conversation.as_str(),
                "group",
                group_activity,
                "team update",
                4_i64,
                4_i64,
            ),
            (
                direct_conversation.as_str(),
                "direct",
                direct_activity,
                "hi there",
                1_i64,
                1_i64,
            ),
        ] {
            tx.execute(
                "insert into im_conversations (
                     tenant_id, organization_id, conversation_id, conversation_type,
                     lifecycle_state, commit_seq, commit_fingerprint, member_epoch,
                     message_count, last_message_id, last_message_seq, last_sender_kind,
                     last_sender_id, last_summary, last_message_at, last_activity_at,
                     payload_json, payload_hash, created_at, updated_at
                 ) values (
                     $1, '0', $2, $3, 'active', 1, 'fingerprint', 1,
                     $4, $5, $6, 'user', '2', $7, $8, $8, '{}'::jsonb, 'payload-hash', $8, $8
                 )",
                &[
                    &tenant_id,
                    &conversation_id,
                    &conversation_type,
                    &message_count,
                    &(9_000_i64 + last_seq),
                    &last_seq,
                    &summary,
                    &activity,
                ],
            )
            .expect("conversation seed");
        }
        tx.execute(
            "insert into im_chat_groups (
                 tenant_id, organization_id, group_id, group_name, owner_user_id,
                 conversation_id, created_at, updated_at
             ) values ($1, '0', $2, 'Live Team', '1', $3, $4, $4)",
            &[&tenant_id, &group_id, &group_conversation, &now],
        )
        .expect("group seed");
        for (conversation_id, principal_id, member_id) in [
            (group_conversation.as_str(), "1", 1_001_i64),
            (group_conversation.as_str(), "2", 1_002_i64),
            (direct_conversation.as_str(), "1", 1_003_i64),
            (direct_conversation.as_str(), "2", 1_004_i64),
        ] {
            tx.execute(
                "insert into im_conversation_members (
                     tenant_id, organization_id, conversation_id, principal_kind,
                     principal_id, member_id, membership_role, membership_state,
                     joined_at, attributes_json, payload_json, payload_hash, created_at, updated_at
                 ) values ($1, '0', $2, 'user', $3, $4, 'member', 'joined',
                     $5, '{}'::jsonb, '{}'::jsonb, 'hash', $5, $5)",
                &[
                    &tenant_id,
                    &conversation_id,
                    &principal_id,
                    &member_id,
                    &now,
                ],
            )
            .expect("member seed");
        }
        tx.execute(
            "insert into im_conversation_read_cursors (
                 tenant_id, organization_id, conversation_id, member_id, device_id,
                 principal_kind, principal_id, read_seq, payload_json, payload_hash,
                 created_at, updated_at
             ) values ($1, '0', $2, 1001, '', 'user', '1', 1, '{}'::jsonb, 'hash', $3, $3)",
            &[&tenant_id, &group_conversation, &now],
        )
        .expect("read cursor seed");
        for (seq, sender) in [(2_i64, "2"), (3_i64, "2"), (4_i64, "2")] {
            tx.execute(
                "insert into im_conversation_messages (
                     tenant_id, organization_id, conversation_id, message_id, message_seq,
                     sender_principal_kind, sender_principal_id, client_msg_id, message_type,
                     payload_json, payload_hash, created_at, updated_at
                 ) values ($1, '0', $2, $3, $4, 'user', $5, $6, 'standard',
                     '{\"text\":\"message\"}'::jsonb, 'hash', $7, $7)",
                &[
                    &tenant_id,
                    &group_conversation,
                    &(9_000_i64 + seq),
                    &seq,
                    &sender,
                    &format!("client_{seq}"),
                    &now,
                ],
            )
            .expect("message seed");
        }
        tx.execute(
            "insert into im_user_profiles (
                 tenant_id, organization_id, user_id, im_nickname, created_at, updated_at
             ) values ($1, '0', '2', 'Peer Live', $2, $2)",
            &[&tenant_id, &now],
        )
        .expect("profile seed");
        tx.commit().expect("seed commit");
    }

    let inbox = PostgresConversationInboxAuthority::from_pool(pool.clone());
    let first_page = inbox
        .list_inbox_page(&tenant_id, "0", "user", "1", None, 1, None, None)
        .expect("first inbox page");
    assert_eq!(first_page.items.len(), 1);
    assert!(first_page.has_more);
    let group = &first_page.items[0];
    assert_eq!(group.conversation_id, group_conversation);
    assert_eq!(group.conversation_title.as_deref(), Some("Live Team"));
    assert_eq!(group.unread_count, 3, "seq 2..4 with read_seq 1");
    assert_eq!(group.message_count, 4);
    let cursor: ConversationInboxPageCursor = first_page.next_cursor.clone().expect("next cursor");

    let second_page = inbox
        .list_inbox_page(&tenant_id, "0", "user", "1", Some(&cursor), 1, None, None)
        .expect("second inbox page");
    assert_eq!(second_page.items.len(), 1);
    assert!(!second_page.has_more);
    let direct = &second_page.items[0];
    assert_eq!(direct.conversation_id, direct_conversation);
    assert_eq!(direct.peer_display_name.as_deref(), Some("Peer Live"));

    let filtered = inbox
        .list_inbox_page(
            &tenant_id,
            "0",
            "user",
            "1",
            None,
            20,
            Some("group"),
            Some("team"),
        )
        .expect("filtered inbox page");
    assert_eq!(filtered.items.len(), 1);
    assert_eq!(filtered.items[0].conversation_id, group_conversation);

    let preferences = PostgresConversationMemberPreferencesStore::from_pool(pool.clone());
    assert!(
        preferences
            .is_active_member(&tenant_id, "0", &group_conversation, "user", "1")
            .expect("membership check")
    );
    preferences
        .save_preferences(ConversationMemberPreferencesRecord {
            tenant_id: tenant_id.clone(),
            organization_id: "0".into(),
            conversation_id: group_conversation.clone(),
            principal_kind: "user".into(),
            principal_id: "1".into(),
            is_pinned: true,
            is_muted: true,
            is_marked_unread: false,
            is_hidden: false,
            updated_at: Utc::now().to_rfc3339(),
        })
        .expect("preference save");
    let reloaded = inbox
        .list_inbox_page(&tenant_id, "0", "user", "1", None, 1, Some("group"), None)
        .expect("inbox page with preferences")
        .items
        .into_iter()
        .next()
        .expect("group inbox row");
    assert!(reloaded.preferences.is_pinned);
    assert!(reloaded.preferences.is_muted);
    let stored = preferences
        .load_preferences(&tenant_id, "0", &group_conversation, "user", "1")
        .expect("preference load")
        .expect("stored preference row");
    assert!(stored.is_pinned);

    let projection = PostgresConversationProjectionStore::from_pool(pool.clone());
    let summary = projection
        .load_conversation_summary(&tenant_id, "0", &group_conversation)
        .expect("summary load")
        .expect("summary row");
    assert_eq!(summary.message_count, 4);
    assert_eq!(summary.last_summary.as_deref(), Some("team update"));
    assert_eq!(summary.last_message_seq, 4);

    let fallback_profile = projection
        .load_profile(&tenant_id, "0", &group_conversation)
        .expect("profile fallback load")
        .expect("profile row from conversation fallback");
    assert_eq!(fallback_profile.display_name, "Live Team");

    projection
        .save_profile(im_platform_contracts::ConversationProfileRecord {
            tenant_id: tenant_id.clone(),
            organization_id: "0".into(),
            conversation_id: group_conversation.clone(),
            display_name: "Live Team Renamed".into(),
            avatar_url: String::new(),
            notice: "renamed".into(),
            updated_at: Utc::now().to_rfc3339(),
            updated_by_principal_kind: Some("user".into()),
            updated_by_principal_id: Some("1".into()),
        })
        .expect("profile save");
    let stored_profile = projection
        .load_profile(&tenant_id, "0", &group_conversation)
        .expect("profile load")
        .expect("stored profile row");
    assert_eq!(stored_profile.display_name, "Live Team Renamed");
    assert_eq!(stored_profile.notice, "renamed");

    let favorites = PostgresMessageFavoriteStore::from_pool(pool.clone());
    let favorite = favorites
        .create_favorite(MessageFavoriteRecord {
            tenant_id: tenant_id.clone(),
            organization_id: "0".into(),
            principal_kind: "user".into(),
            principal_id: "1".into(),
            favorite_id: "fav_1_9002".into(),
            favorite_type: "message".into(),
            conversation_id: group_conversation.clone(),
            message_id: "9002".into(),
            message_seq: 0,
            title: "Favorite title".into(),
            content_preview: "Favorite preview".into(),
            source_display_name: "Live Team".into(),
            favorited_at: Utc::now().to_rfc3339(),
        })
        .expect("favorite create")
        .expect("favorite created from an existing message");
    assert_eq!(
        favorite.message_seq, 2,
        "message_seq resolved from message truth"
    );

    let page = favorites
        .list_favorites(
            &tenant_id,
            "0",
            "user",
            "1",
            None,
            20,
            Some("message"),
            Some("favorite"),
        )
        .expect("favorite list");
    assert_eq!(page.items.len(), 1);
    assert_eq!(page.items[0].favorite_id, "fav_1_9002");

    let missing = favorites
        .create_favorite(MessageFavoriteRecord {
            tenant_id: tenant_id.clone(),
            organization_id: "0".into(),
            principal_kind: "user".into(),
            principal_id: "1".into(),
            favorite_id: "fav_1_missing".into(),
            favorite_type: "message".into(),
            conversation_id: group_conversation.clone(),
            message_id: "123456789".into(),
            message_seq: 0,
            title: String::new(),
            content_preview: String::new(),
            source_display_name: String::new(),
            favorited_at: Utc::now().to_rfc3339(),
        })
        .expect("favorite create for missing message");
    assert!(
        missing.is_none(),
        "missing message must not create a favorite"
    );

    assert!(
        favorites
            .delete_favorite(&tenant_id, "0", "user", "1", "fav_1_9002")
            .expect("favorite delete")
    );
    assert!(
        favorites
            .list_favorites(&tenant_id, "0", "user", "1", None, 20, None, None)
            .expect("favorite list after delete")
            .items
            .is_empty()
    );

    let cleanup_pool = pool.clone();
    let cleanup_tenant_id = tenant_id.clone();
    tokio::task::spawn_blocking(move || {
        let mut client = cleanup_pool.get().expect("cleanup connection");
        for statement in [
            "delete from im_conversation_messages where tenant_id = $1",
            "delete from im_message_favorites where tenant_id = $1",
            "delete from im_conversation_read_cursors where tenant_id = $1",
            "delete from im_conversation_member_preferences where tenant_id = $1",
            "delete from im_conversation_profiles where tenant_id = $1",
            "delete from im_conversation_members where tenant_id = $1",
            "delete from im_conversations where tenant_id = $1",
            "delete from im_chat_groups where tenant_id = $1",
            "delete from im_user_profiles where tenant_id = $1",
        ] {
            client
                .execute(statement, &[&cleanup_tenant_id])
                .expect("cleanup statement");
        }
    })
    .await
    .expect("cleanup task");
}

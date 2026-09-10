use im_domain_events::{AggregateType, CommitEnvelope, EventActor};

#[test]
fn test_commit_envelope_normalizes_organization_id() {
    let envelope = CommitEnvelope::minimal(
        "evt_demo",
        "100001",
        "message.posted",
        "conversation",
        "c_demo",
        1,
    )
    .with_organization_id("org_a");
    assert_eq!(envelope.normalized_organization_id(), "org_a");
    assert_eq!(
        CommitEnvelope::minimal(
            "evt_demo",
            "100001",
            "message.posted",
            "conversation",
            "c_demo",
            1
        )
        .with_organization_id("")
        .normalized_organization_id(),
        "0"
    );
}

#[test]
fn test_commit_envelope_builds_stable_ordering_key() {
    let envelope = CommitEnvelope {
        event_id: "evt_demo".into(),
        tenant_id: "100001".into(),
        organization_id: "0".into(),
        event_type: "message.posted".into(),
        event_version: 1,
        aggregate_type: AggregateType::Conversation,
        aggregate_id: "c_demo".into(),
        scope_type: "conversation".into(),
        scope_id: "c_demo".into(),
        ordering_key: CommitEnvelope::ordering_key("100001", "c_demo"),
        ordering_seq: 1,
        causation_id: Some("cmd_demo".into()),
        correlation_id: Some("corr_demo".into()),
        idempotency_key: Some("ik_demo".into()),
        actor: EventActor {
            actor_id: "1".into(),
            actor_kind: "user".into(),
            actor_session_id: Some("s_demo".into()),
        },
        occurred_at: "2026-04-05T10:00:00Z".into(),
        committed_at: "2026-04-05T10:00:01Z".into(),
        payload_schema: Some("message.posted.v1".into()),
        payload: "{}".into(),
        retention_class: "standard".into(),
        audit_class: "default".into(),
    };

    assert_eq!(envelope.aggregate_type.as_wire_value(), "conversation");
    assert_eq!(envelope.ordering_key, "6#1000016#c_demo");
}

#[test]
fn test_commit_envelope_ordering_key_is_segment_safe() {
    assert_eq!(
        CommitEnvelope::ordering_key("tenant:a", "b"),
        "8#tenant:a1#b"
    );
    assert_eq!(
        CommitEnvelope::ordering_key("tenant", "a:b"),
        "6#tenant3#a:b"
    );
    assert_ne!(
        CommitEnvelope::ordering_key("tenant:a", "b"),
        CommitEnvelope::ordering_key("tenant", "a:b"),
        "ordering keys must not collide when tenant or scope ids contain delimiter characters"
    );
}

#[test]
fn test_aggregate_types_do_not_include_app_local_media_asset_lifecycle() {
    let source = include_str!("../src/lib.rs");

    assert!(
        !source.contains("MediaAsset"),
        "domain events must not model app-local MediaAsset lifecycle aggregates"
    );
    assert!(
        !source.contains("media_asset"),
        "domain events must not expose legacy media_asset aggregate wire value"
    );
}

#[test]
fn test_space_governance_event_types_follow_the_space_namespace() {
    use im_domain_events::space::{SpaceEventType, SpaceInvitationCreatedPayload};

    assert_eq!(
        SpaceEventType::SpaceBanCreated.as_wire_value(),
        "space.ban.created"
    );
    assert_eq!(
        SpaceEventType::SpaceBanLifted.as_wire_value(),
        "space.ban.lifted"
    );
    assert_eq!(
        SpaceEventType::SpaceInvitationCreated.as_wire_value(),
        "space.invitation.created"
    );
    assert_eq!(
        SpaceEventType::SpaceBanCreated.payload_schema(),
        "space.space_ban.created.v1"
    );
    assert_eq!(
        SpaceEventType::SpaceBanLifted.payload_schema(),
        "space.space_ban.lifted.v1"
    );
    assert_eq!(
        SpaceEventType::SpaceInvitationCreated.payload_schema(),
        "space.space_invitation.created.v1"
    );

    // The journal payload drives the normalized state write, so contact
    // fields must round-trip through the payload contract (camelCase wire).
    let payload = SpaceInvitationCreatedPayload {
        space_id: "42".into(),
        invitation_id: "9".into(),
        target_type: "space".into(),
        target_id: "42".into(),
        inviter_user_id: "user-1".into(),
        invitee_user_id: Some("user-2".into()),
        invitee_email: Some("invitee@example.com".into()),
        invitee_phone: None,
        role: "member".into(),
        status: "pending".into(),
        message: None,
        expires_at: None,
        created_at: "2026-09-09T00:00:00.000Z".into(),
        updated_at: "2026-09-09T00:00:00.000Z".into(),
        retention_until: Some("2027-09-09T00:00:00.000Z".into()),
    };
    let serialized = serde_json::to_string(&payload).expect("payload must serialize");
    assert!(serialized.contains("\"inviteeEmail\""));
    let deserialized: SpaceInvitationCreatedPayload =
        serde_json::from_str(&serialized).expect("payload must round-trip");
    assert_eq!(deserialized, payload);
}

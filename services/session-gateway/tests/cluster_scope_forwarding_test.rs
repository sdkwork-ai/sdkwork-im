//! End-to-end cross-instance scope-event forwarding acceptance test.
//!
//! Proves the P0 cluster fix: an event published on node A (with no local
//! match) is discovered from the shared durable subscription store and
//! forwarded over the cluster bus to the node that owns the device route,
//! where the remote runtime delivers it into the route's ordered window.
//!
//! Topology mirrors a real cluster: each node is its own bridge process,
//! and both bridges share one route directory (Redis/Postgres in
//! production) plus one bus.

use std::sync::{Arc, Mutex as StdMutex};

use im_adapters_local_memory::{
    MemoryRealtimeCheckpointStore, MemoryRealtimeDisconnectFenceStore,
    MemoryRealtimeSubscriptionStore,
};
use im_platform_contracts::ClusterEventBus;
use sdkwork_im_runtime_route::RouteDirectory;
use session_gateway::{
    RealtimeClusterBridge, RealtimeDeliveryRuntime, RealtimeEventWindowQuery,
    RealtimeSubscriptionItemInput,
};

#[derive(Default)]
struct RecordingClusterBus {
    published: StdMutex<Vec<(String, String)>>,
}

impl ClusterEventBus for RecordingClusterBus {
    fn publish_route_event(&self, target_node_id: &str, event_json: &str) -> Result<(), String> {
        self.published
            .lock()
            .expect("bus publish mutex")
            .push((target_node_id.to_owned(), event_json.to_owned()));
        Ok(())
    }
}

struct TwoNodeCluster {
    bus: Arc<RecordingClusterBus>,
    bridge_a: Arc<RealtimeClusterBridge>,
    runtime_a: Arc<RealtimeDeliveryRuntime>,
    bridge_b: Arc<RealtimeClusterBridge>,
    runtime_b: Arc<RealtimeDeliveryRuntime>,
}

fn build_two_node_cluster() -> TwoNodeCluster {
    let bus = Arc::new(RecordingClusterBus::default());
    let route_store: Arc<RouteDirectory> = Arc::new(RouteDirectory::default());
    let fence_store = Arc::new(MemoryRealtimeDisconnectFenceStore::default());
    // Both nodes share one durable subscription store, mirroring the shared
    // PostgreSQL subscription authority used by a real cluster.
    let shared_subscriptions = Arc::new(MemoryRealtimeSubscriptionStore::default());

    let make_runtime = || {
        Arc::new(RealtimeDeliveryRuntime::with_stores_permissive_for_tests(
            Arc::new(MemoryRealtimeCheckpointStore::default()),
            shared_subscriptions.clone(),
        ))
    };
    let runtime_a = make_runtime();
    let runtime_b = make_runtime();

    let bridge_a = Arc::new(
        RealtimeClusterBridge::with_disconnect_fence_store_and_route_store(
            fence_store.clone(),
            route_store.clone(),
        )
        .with_cluster_bus(bus.clone() as Arc<dyn ClusterEventBus>)
        .with_cluster_bus_auth("forwarding-test-secret"),
    );
    let bridge_b = Arc::new(
        RealtimeClusterBridge::with_disconnect_fence_store_and_route_store(
            fence_store,
            route_store,
        )
        .with_cluster_bus(bus.clone() as Arc<dyn ClusterEventBus>)
        .with_cluster_bus_auth("forwarding-test-secret"),
    );
    bridge_a.bind_node_runtime("node_a", runtime_a.clone());
    bridge_b.bind_node_runtime("node_b", runtime_b.clone());

    TwoNodeCluster {
        bus,
        bridge_a,
        runtime_a,
        bridge_b,
        runtime_b,
    }
}

#[test]
fn test_scope_event_published_on_origin_node_reaches_device_route_on_remote_node() {
    let cluster = build_two_node_cluster();

    // Device d_pad subscribes on node B: durable record + live route there.
    cluster
        .runtime_b
        .sync_subscriptions_for_principal_kind(
            "100001",
            "default",
            "1",
            "user",
            "d_pad",
            vec![RealtimeSubscriptionItemInput {
                scope_type: "conversation".into(),
                scope_id: "c_demo".into(),
                event_types: vec!["message.posted".into()],
            }],
        )
        .expect("subscription sync on node b");
    cluster
        .bridge_b
        .bind_client_route_for_principal_kind(
            "100001", "default", "1", "user", "d_pad", "node_b", None, "websocket",
        )
        .expect("route bind to node b");

    // Publish on node A with no route hints. Nothing matches locally, so
    // without the cluster forwarder this event would be silently dropped
    // and never reach the device connected to node B.
    let delivered = cluster
        .runtime_a
        .publish_scope_event_for_principal_kind(
            "100001",
            "default",
            "1",
            "user",
            "conversation",
            "c_demo",
            "message.posted",
            r#"{"messageId":"msg_cross_node"}"#.to_string(),
            Vec::new(),
        )
        .expect("publish on node a");
    assert_eq!(delivered, 0, "origin node has no local route for d_pad");

    let snapshot = cluster.bus.published.lock().expect("bus publish mutex");
    assert_eq!(snapshot.len(), 1, "exactly one bus event forwarded");
    let (target_node_id, event_json) = snapshot[0].clone();
    assert_eq!(target_node_id, "node_b");
    assert!(
        event_json.contains("d_pad")
            && event_json.contains("msg_cross_node")
            && event_json.contains("100001"),
        "forwarded event carries routing identity and payload: {event_json}"
    );
    drop(snapshot);

    // The remote node ingests the forwarded event and delivers locally.
    let ingress = cluster
        .bridge_b
        .ingest_cluster_route_event_for_node("node_b", event_json.as_str())
        .expect("ingest on node b");
    assert_eq!(ingress.delivered, 1);

    let owner_window = cluster
        .runtime_b
        .list_events_for_principal_kind(RealtimeEventWindowQuery {
            tenant_id: "100001",
            organization_id: "default",
            principal_id: "1",
            principal_kind: "user",
            device_id: "d_pad",
            after_seq: 0,
            limit: 10,
        })
        .expect("node b window");
    assert_eq!(owner_window.items.len(), 1);
    assert_eq!(owner_window.items[0].event_type, "message.posted");

    // The origin node must not have materialized state for the device.
    let origin_window = cluster
        .runtime_a
        .list_events_for_principal_kind(RealtimeEventWindowQuery {
            tenant_id: "100001",
            organization_id: "default",
            principal_id: "1",
            principal_kind: "user",
            device_id: "d_pad",
            after_seq: 0,
            limit: 10,
        })
        .expect("node a window");
    assert_eq!(origin_window.items.len(), 0);
}

#[test]
fn test_forwarding_skips_devices_without_live_route() {
    let cluster = build_two_node_cluster();

    // d_offline subscribes (durable) but holds no live route anywhere.
    cluster
        .runtime_b
        .sync_subscriptions_for_principal_kind(
            "100001",
            "default",
            "1",
            "user",
            "d_offline",
            vec![RealtimeSubscriptionItemInput {
                scope_type: "conversation".into(),
                scope_id: "c_demo".into(),
                event_types: vec!["message.posted".into()],
            }],
        )
        .expect("subscription sync for offline device");

    cluster
        .runtime_a
        .publish_scope_event_for_principal_kind(
            "100001",
            "default",
            "1",
            "user",
            "conversation",
            "c_demo",
            "message.posted",
            r#"{"messageId":"msg_offline"}"#.to_string(),
            Vec::new(),
        )
        .expect("publish on node a");

    let snapshot = cluster.bus.published.lock().expect("bus publish mutex");
    assert!(
        snapshot.is_empty(),
        "offline devices must not be forwarded; got {snapshot:?}"
    );
}

#[test]
fn test_ingest_rejects_events_signed_with_wrong_secret() {
    let bus = Arc::new(RecordingClusterBus::default());
    let route_store: Arc<RouteDirectory> = Arc::new(RouteDirectory::default());
    let fence_store = Arc::new(MemoryRealtimeDisconnectFenceStore::default());
    let shared_subscriptions = Arc::new(MemoryRealtimeSubscriptionStore::default());
    let runtime_b = Arc::new(RealtimeDeliveryRuntime::with_stores_permissive_for_tests(
        Arc::new(MemoryRealtimeCheckpointStore::default()),
        shared_subscriptions,
    ));
    let bridge_b = Arc::new(
        RealtimeClusterBridge::with_disconnect_fence_store_and_route_store(
            fence_store,
            route_store,
        )
        .with_cluster_bus(bus as Arc<dyn ClusterEventBus>)
        .with_cluster_bus_auth("correct-secret"),
    );
    bridge_b.bind_node_runtime("node_b", runtime_b);

    let result = bridge_b.ingest_cluster_route_event_for_node(
        "node_b",
        r#"{"tenant_id":"100001","organization_id":"default","principal_id":"1","principal_kind":"user","device_id":"d_pad","scope_type":"conversation","scope_id":"c_demo","event_type":"message.posted","payload":"{}","delivery_class":"durable"}"#,
    );
    assert!(result.is_err(), "unsigned events must fail verification");
}

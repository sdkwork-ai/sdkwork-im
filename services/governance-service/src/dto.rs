use im_platform_contracts::{
    EffectiveProviderBinding, ProviderDomain, ProviderPolicyDiff, ProviderPolicyHistory,
    ProviderPolicyResultStatus, ProviderRegistrySnapshot,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct MigrateRoutesRequest {
    pub(crate) target_node_id: String,
}

#[derive(Debug, Default, Deserialize)]
pub(crate) struct ProviderBindingsQuery {
    pub(crate) tenant_id: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct UpsertProviderBindingPolicyRequest {
    pub(crate) tenant_id: Option<String>,
    pub(crate) domain: ProviderDomain,
    pub(crate) plugin_id: String,
    pub(crate) expected_base_version: Option<u64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProviderPolicyRollbackRequest {
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) target_version: u64,
}

#[derive(Debug, Deserialize)]
pub(crate) struct ProviderPolicyDiffQuery {
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) from_version: u64,
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) to_version: u64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProtocolRegistryResponse {
    pub(crate) protocol_version: String,
    pub(crate) bindings: Vec<String>,
    pub(crate) codecs: Vec<String>,
    pub(crate) schemas: Vec<ProtocolSchemaResponse>,
    pub(crate) compatibility_matrix: Vec<ClientCompatibilityResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProtocolGovernanceResponse {
    pub(crate) capability_profile: CapabilityProfileResponse,
    pub(crate) quota_profile: QuotaProfileResponse,
    pub(crate) rollout_policy: RolloutPolicyResponse,
    pub(crate) kill_switch: KillSwitchResponse,
    pub(crate) effective_snapshot: EffectiveProtocolSnapshotResponse,
    pub(crate) business_policy_vocabulary: BusinessPolicyVocabularyResponse,
    pub(crate) sdk_compatibility_baseline: SdkCompatibilityBaselineResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProtocolSchemaResponse {
    pub(crate) schema: String,
    pub(crate) kind: String,
    pub(crate) stage: String,
    pub(crate) binding_protocols: Vec<String>,
    pub(crate) required_capabilities: Vec<String>,
    pub(crate) supported_consumers: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ClientCompatibilityResponse {
    pub(crate) client_type: String,
    pub(crate) minimum_protocol_version: String,
    pub(crate) supported_bindings: Vec<String>,
    pub(crate) supported_codecs: Vec<String>,
    pub(crate) supported_capabilities: Vec<String>,
    pub(crate) blocked_experimental_capabilities: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct CapabilityProfileResponse {
    pub(crate) profile_id: String,
    pub(crate) release_channel: String,
    pub(crate) enabled_capabilities: Vec<String>,
    pub(crate) experimental_capabilities: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct QuotaProfileResponse {
    pub(crate) profile_id: String,
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) max_concurrent_sessions_per_tenant: u64,
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) max_subscriptions_per_session: u64,
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) max_inflight_messages: u64,
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) max_payload_bytes: u64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct RolloutPolicyResponse {
    pub(crate) policy_id: String,
    pub(crate) release_channel: String,
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) traffic_percent: u64,
    pub(crate) cell_selector: String,
    pub(crate) region_selector: String,
    pub(crate) operator_override: bool,
    pub(crate) tenant_allowlist: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct KillSwitchResponse {
    pub(crate) rule_id: String,
    pub(crate) active: bool,
    pub(crate) reason: String,
    pub(crate) disabled_capabilities: Vec<String>,
    pub(crate) disabled_bindings: Vec<String>,
    pub(crate) disabled_codecs: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct EffectiveProtocolSnapshotResponse {
    pub(crate) protocol_version: String,
    pub(crate) release_channel: String,
    pub(crate) enabled_capabilities: Vec<String>,
    pub(crate) allowed_bindings: Vec<String>,
    pub(crate) allowed_codecs: Vec<String>,
    pub(crate) quota_profile_id: String,
    pub(crate) kill_switch_active: bool,
    pub(crate) precedence: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct BusinessPolicyVocabularyResponse {
    pub(crate) policy_version_field: String,
    pub(crate) capability_flags_field: String,
    pub(crate) history_visibility_field: String,
    pub(crate) history_visibility_modes: Vec<String>,
    pub(crate) retention_policy_ref_field: String,
    pub(crate) retention_policy_scopes: Vec<String>,
    pub(crate) retention_classes: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct SdkCompatibilityBaselineResponse {
    pub(crate) im_sdk_family: &'static str,
    pub(crate) app_sdk_family: &'static str,
    pub(crate) backend_sdk_family: &'static str,
    pub(crate) rtc_sdk_family: &'static str,
    pub(crate) matrix_client_types: Vec<String>,
    pub(crate) protocol_registry_path: &'static str,
    pub(crate) protocol_governance_path: &'static str,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProviderBindingsResponse {
    pub(crate) status: ProviderSurfaceReadStatus,
    pub(crate) interface_version: String,
    pub(crate) tenant_id: Option<String>,
    pub(crate) effective_bindings: Vec<EffectiveProviderBinding>,
    pub(crate) precedence: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProviderBindingCommitResponse {
    pub(crate) status: ProviderPolicyResultStatus,
    pub(crate) applied: bool,
    pub(crate) interface_version: String,
    pub(crate) tenant_id: Option<String>,
    #[serde(with = "sdkwork_utils_rust::serde_uint64")]
    pub(crate) current_version: u64,
    pub(crate) committed_binding: EffectiveProviderBinding,
    pub(crate) diff: ProviderPolicyDiff,
    pub(crate) effective_bindings: Vec<EffectiveProviderBinding>,
    pub(crate) precedence: Vec<String>,
}

#[derive(Clone, Copy, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub(crate) enum ProviderSurfaceReadStatus {
    Registry,
    Bindings,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProviderRegistrySnapshotResponse {
    pub(crate) status: ProviderSurfaceReadStatus,
    #[serde(flatten)]
    pub(crate) snapshot: ProviderRegistrySnapshot,
}

#[derive(Clone, Copy, Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub(crate) enum ProviderPolicyReadStatus {
    History,
    Diff,
    RolledBack,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProviderPolicyHistoryResponse {
    pub(crate) status: ProviderPolicyReadStatus,
    #[serde(flatten)]
    pub(crate) history: ProviderPolicyHistory,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct ProviderPolicyDiffResponse {
    pub(crate) status: ProviderPolicyReadStatus,
    #[serde(flatten)]
    pub(crate) diff: ProviderPolicyDiff,
}

#[cfg(test)]
mod tests {
    use super::{ProviderPolicyRollbackRequest, QuotaProfileResponse, RolloutPolicyResponse};

    #[test]
    fn provider_versions_accept_int64_strings() {
        let request: ProviderPolicyRollbackRequest =
            serde_json::from_str(r#"{"targetVersion":"12"}"#).expect("string target version");
        assert_eq!(request.target_version, 12);
    }

    #[test]
    fn quota_and_rollout_counts_serialize_as_int64_strings() {
        let quota = QuotaProfileResponse {
            profile_id: "quota-default".into(),
            max_concurrent_sessions_per_tenant: 10,
            max_subscriptions_per_session: 20,
            max_inflight_messages: 30,
            max_payload_bytes: 4096,
        };
        let value = serde_json::to_value(&quota).expect("serialize quota profile");
        assert_eq!(
            value["maxConcurrentSessionsPerTenant"],
            serde_json::json!("10")
        );
        assert_eq!(value["maxSubscriptionsPerSession"], serde_json::json!("20"));
        assert_eq!(value["maxInflightMessages"], serde_json::json!("30"));
        assert_eq!(value["maxPayloadBytes"], serde_json::json!("4096"));

        let rollout = RolloutPolicyResponse {
            policy_id: "rollout-default".into(),
            release_channel: "stable".into(),
            traffic_percent: 25,
            cell_selector: "cell-a".into(),
            region_selector: "region-a".into(),
            operator_override: false,
            tenant_allowlist: Vec::new(),
        };
        let value = serde_json::to_value(&rollout).expect("serialize rollout policy");
        assert_eq!(value["trafficPercent"], serde_json::json!("25"));
    }
}

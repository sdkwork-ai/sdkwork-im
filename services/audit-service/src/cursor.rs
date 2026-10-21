//! Signed, scope-bound pagination cursor for audit record windows.

use im_app_context::is_production_like_im_environment;
use sdkwork_utils_rust::{
    base64url_decode, base64url_encode, hmac_sha256_base64url, verify_hmac_sha256_base64url,
};
use serde_json::Value;

const CURSOR_VERSION: u32 = 1;
const SIGNATURE_SECRET_ENV: &str = "SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET";
const SIGNATURE_SECRET_FILE_ENV: &str = "SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET_FILE";
const DEV_CURSOR_SECRET: &str = "sdkwork-im-audit-cursor-dev-secret-not-for-production";
const CURSOR_DOMAIN: &str = "sdkwork.im.audit.cursor.v1";

fn resolve_cursor_secret() -> Result<String, String> {
    if let Some(path) = std::env::var(SIGNATURE_SECRET_FILE_ENV)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
    {
        let secret = std::fs::read_to_string(path.as_str())
            .map_err(|error| format!("failed to read {SIGNATURE_SECRET_FILE_ENV}: {error}"))?;
        let secret = secret.trim().to_owned();
        if secret.is_empty() {
            return Err(format!("{SIGNATURE_SECRET_FILE_ENV} contains an empty secret"));
        }
        return Ok(secret);
    }
    if let Some(secret) = std::env::var(SIGNATURE_SECRET_ENV)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
    {
        return Ok(secret);
    }
    if is_production_like_im_environment() {
        return Err(format!(
            "{SIGNATURE_SECRET_ENV} (or {SIGNATURE_SECRET_FILE_ENV}) is required in production-like IM environments for audit cursors"
        ));
    }
    Ok(DEV_CURSOR_SECRET.to_owned())
}

fn signing_input(header_segment: &str, payload_segment: &str) -> String {
    format!("{CURSOR_DOMAIN}.{header_segment}.{payload_segment}")
}

pub fn encode_audit_cursor(tenant_id: &str, organization_id: &str, audit_seq: u64) -> String {
    let secret = match resolve_cursor_secret() {
        Ok(secret) => secret,
        Err(error) => {
            tracing::error!(error = %error, "audit cursor signing secret unavailable");
            return String::new();
        }
    };
    let header = serde_json::json!({"alg": "HS256", "typ": "cursor", "v": CURSOR_VERSION});
    let payload = serde_json::json!({
        "tenantId": tenant_id,
        "organizationId": organization_id,
        "auditSeq": audit_seq.to_string(),
    });
    let Ok(header_bytes) = serde_json::to_vec(&header) else {
        return String::new();
    };
    let Ok(payload_bytes) = serde_json::to_vec(&payload) else {
        return String::new();
    };
    let header_segment = base64url_encode(&header_bytes);
    let payload_segment = base64url_encode(&payload_bytes);
    let input = signing_input(header_segment.as_str(), payload_segment.as_str());
    let signature = hmac_sha256_base64url(input.as_bytes(), secret.as_bytes());
    format!("{header_segment}.{payload_segment}.{signature}")
}

pub fn decode_audit_cursor(
    cursor: &str,
    tenant_id: &str,
    organization_id: &str,
) -> Result<u64, String> {
    let mut parts = cursor.split('.');
    let header_segment = parts.next().filter(|part| !part.is_empty());
    let payload_segment = parts.next().filter(|part| !part.is_empty());
    let signature_segment = parts.next().filter(|part| !part.is_empty());
    if header_segment.is_none() || payload_segment.is_none() || signature_segment.is_none()
        || parts.next().is_some()
    {
        return Err("audit cursor must contain exactly three non-empty segments".into());
    }
    let (Some(header_segment), Some(payload_segment), Some(signature_segment)) =
        (header_segment, payload_segment, signature_segment)
    else {
        return Err("audit cursor must contain exactly three non-empty segments".into());
    };
    let secret = resolve_cursor_secret()?;
    let input = signing_input(header_segment, payload_segment);
    let signature = base64url_decode(signature_segment)
        .ok_or_else(|| "audit cursor signature encoding is invalid".to_string())?;
    if !verify_hmac_sha256_base64url(input.as_bytes(), secret.as_bytes(), signature.as_slice()) {
        return Err("audit cursor signature is invalid".into());
    }
    let header_bytes = base64url_decode(header_segment)
        .ok_or_else(|| "audit cursor header encoding is invalid".to_string())?;
    let header: Value = serde_json::from_slice(&header_bytes)
        .map_err(|_| "audit cursor header is invalid".to_string())?;
    if header.get("v").and_then(Value::as_u64) != Some(u64::from(CURSOR_VERSION)) {
        return Err("audit cursor version is unsupported".into());
    }
    let payload_bytes = base64url_decode(payload_segment)
        .ok_or_else(|| "audit cursor payload encoding is invalid".to_string())?;
    let payload: Value = serde_json::from_slice(&payload_bytes)
        .map_err(|_| "audit cursor payload is invalid".to_string())?;
    if payload.get("tenantId").and_then(Value::as_str) != Some(tenant_id)
        || payload.get("organizationId").and_then(Value::as_str) != Some(organization_id)
    {
        return Err("audit cursor scope does not match the request".into());
    }
    payload
        .get("auditSeq")
        .and_then(Value::as_str)
        .ok_or_else(|| "audit cursor sequence is missing".to_string())?
        .parse::<u64>()
        .map_err(|_| "audit cursor sequence is invalid".to_string())
}

#[cfg(test)]
mod tests {
    use super::{decode_audit_cursor, encode_audit_cursor};

    struct DevEnvironmentGuard {
        previous: Option<String>,
    }

    impl DevEnvironmentGuard {
        fn set() -> Self {
            let previous = std::env::var("SDKWORK_IM_ENVIRONMENT").ok();
            #[allow(unsafe_code)]
            unsafe {
                std::env::set_var("SDKWORK_IM_ENVIRONMENT", "dev");
            }
            Self { previous }
        }
    }

    impl Drop for DevEnvironmentGuard {
        fn drop(&mut self) {
            #[allow(unsafe_code)]
            unsafe {
                match &self.previous {
                    Some(value) => std::env::set_var("SDKWORK_IM_ENVIRONMENT", value),
                    None => std::env::remove_var("SDKWORK_IM_ENVIRONMENT"),
                }
            }
        }
    }

    #[test]
    fn cursor_round_trips_and_rejects_cross_tenant_use() {
        let _environment = DevEnvironmentGuard::set();
        let cursor = encode_audit_cursor("100001", "100001", 7);
        assert!(!cursor.is_empty());
        assert_eq!(
            decode_audit_cursor(cursor.as_str(), "100001", "100001"),
            Ok(7)
        );
        assert!(decode_audit_cursor(cursor.as_str(), "100002", "100001").is_err());
        assert!(decode_audit_cursor("forged.cursor.value", "100001", "100001").is_err());
    }
}

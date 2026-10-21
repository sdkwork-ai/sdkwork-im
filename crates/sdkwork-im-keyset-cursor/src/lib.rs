//! Signed, scope-bound keyset cursors for IM list endpoints.
//!
//! `PAGINATION_SPEC.md` requires opaque cursors: a client must not be able to
//! read, forge, or replay a `sort|id` position. This crate encodes the position
//! as a signed `header.payload.signature` token whose payload is bound to the
//! list resource and the caller's tenant/organization/principal scope.
//!
//! The HMAC key reuses the IM app-context signature secret with a dedicated
//! signing domain (`sdkwork.im.keyset.cursor.v1`); deployments already provide
//! that secret to every service.

use im_app_context::is_production_like_im_environment;
use sdkwork_utils_rust::{
    SdkWorkPageData, base64url_decode, base64url_encode, cursor_list_page_data,
    hmac_sha256_base64url, verify_hmac_sha256_base64url,
};
use thiserror::Error;

const CURSOR_VERSION: u32 = 1;
const CURSOR_DOMAIN: &str = "sdkwork.im.keyset.cursor.v1";
const SECRET_ENV: &str = "SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET";
const SECRET_FILE_ENV: &str = "SDKWORK_IM_APP_CONTEXT_SIGNATURE_SECRET_FILE";
const DEV_CURSOR_SECRET: &str = "sdkwork-im-dev-keyset-cursor-secret-not-for-production";
const MAX_CURSOR_BYTES: usize = 2048;

/// Outcome of a keyset cursor operation.
#[derive(Debug, Error)]
pub enum KeysetCursorError {
    #[error("keyset cursor signing secret is unavailable: {0}")]
    SecretUnavailable(String),
    #[error("keyset cursor is invalid: {0}")]
    Invalid(String),
}

/// List identity a cursor is bound to.
///
/// A cursor minted for one resource/tenant/principal is rejected by every
/// other list, which prevents horizontal cursor replay.
#[derive(Clone, Copy, Debug)]
pub struct CursorScope<'a> {
    pub resource: &'a str,
    pub tenant_id: &'a str,
    pub organization_id: &'a str,
    pub principal_id: &'a str,
}

impl CursorScope<'_> {
    fn key(&self) -> String {
        format!(
            "{}:{}:{}:{}",
            self.resource, self.tenant_id, self.organization_id, self.principal_id
        )
    }
}

/// Decoded keyset position.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct KeysetPosition {
    pub sort_value: String,
    pub entity_id: String,
}

fn resolve_cursor_secret() -> Result<String, KeysetCursorError> {
    if let Some(path) = std::env::var(SECRET_FILE_ENV)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
    {
        let secret = std::fs::read_to_string(path.as_str()).map_err(|error| {
            KeysetCursorError::SecretUnavailable(format!(
                "failed to read {SECRET_FILE_ENV}: {error}"
            ))
        })?;
        let secret = secret.trim().to_owned();
        if secret.is_empty() {
            return Err(KeysetCursorError::SecretUnavailable(format!(
                "{SECRET_FILE_ENV} contains an empty secret"
            )));
        }
        return Ok(secret);
    }
    if let Some(secret) = std::env::var(SECRET_ENV)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
    {
        return Ok(secret);
    }
    if is_production_like_im_environment() {
        return Err(KeysetCursorError::SecretUnavailable(format!(
            "{SECRET_ENV} (or {SECRET_FILE_ENV}) is required in production-like IM environments"
        )));
    }
    Ok(DEV_CURSOR_SECRET.to_owned())
}

fn signing_input(header: &str, payload: &str) -> String {
    format!("{CURSOR_DOMAIN}.{header}.{payload}")
}

/// Encodes one keyset position for the given list scope.
pub fn encode_keyset_cursor(
    scope: &CursorScope<'_>,
    position: &KeysetPosition,
) -> Result<String, KeysetCursorError> {
    if position.sort_value.is_empty() || position.entity_id.is_empty() {
        return Err(KeysetCursorError::Invalid(
            "keyset position must have non-empty sort value and entity id".into(),
        ));
    }
    let secret = resolve_cursor_secret()?;
    let header = serde_json::json!({"v": CURSOR_VERSION, "typ": "cursor"});
    let payload = serde_json::json!({
        "scope": scope.key(),
        "sort": position.sort_value,
        "id": position.entity_id,
    });
    let header_bytes = serde_json::to_vec(&header)
        .map_err(|error| KeysetCursorError::Invalid(format!("cursor header encode failed: {error}")))?;
    let payload_bytes = serde_json::to_vec(&payload).map_err(|error| {
        KeysetCursorError::Invalid(format!("cursor payload encode failed: {error}"))
    })?;
    let header_segment = base64url_encode(&header_bytes);
    let payload_segment = base64url_encode(&payload_bytes);
    let signature = hmac_sha256_base64url(
        signing_input(header_segment.as_str(), payload_segment.as_str()).as_bytes(),
        secret.as_bytes(),
    );
    Ok(format!("{header_segment}.{payload_segment}.{signature}"))
}

/// Decodes and validates a cursor for the exact list scope.
pub fn decode_keyset_cursor(
    scope: &CursorScope<'_>,
    cursor: &str,
) -> Result<KeysetPosition, KeysetCursorError> {
    if cursor.is_empty() || cursor.len() > MAX_CURSOR_BYTES {
        return Err(KeysetCursorError::Invalid("cursor length is invalid".into()));
    }
    let mut segments = cursor.split('.');
    let (Some(header), Some(payload), Some(signature)) =
        (segments.next(), segments.next(), segments.next())
    else {
        return Err(KeysetCursorError::Invalid(
            "cursor must have three segments".into(),
        ));
    };
    if segments.next().is_some() || header.is_empty() || payload.is_empty() || signature.is_empty() {
        return Err(KeysetCursorError::Invalid(
            "cursor must have three non-empty segments".into(),
        ));
    }
    let secret = resolve_cursor_secret()?;
    let signature = base64url_decode(signature)
        .ok_or_else(|| KeysetCursorError::Invalid("cursor signature encoding is invalid".into()))?;
    if !verify_hmac_sha256_base64url(
        signing_input(header, payload).as_bytes(),
        secret.as_bytes(),
        signature.as_slice(),
    ) {
        return Err(KeysetCursorError::Invalid(
            "cursor signature is invalid".into(),
        ));
    }
    let header_bytes = base64url_decode(header)
        .ok_or_else(|| KeysetCursorError::Invalid("cursor header encoding is invalid".into()))?;
    let header_value: serde_json::Value = serde_json::from_slice(&header_bytes)
        .map_err(|_| KeysetCursorError::Invalid("cursor header is invalid".into()))?;
    if header_value.get("v").and_then(serde_json::Value::as_u64) != Some(u64::from(CURSOR_VERSION)) {
        return Err(KeysetCursorError::Invalid(
            "cursor version is unsupported".into(),
        ));
    }
    let payload_bytes = base64url_decode(payload)
        .ok_or_else(|| KeysetCursorError::Invalid("cursor payload encoding is invalid".into()))?;
    let payload_value: serde_json::Value = serde_json::from_slice(&payload_bytes)
        .map_err(|_| KeysetCursorError::Invalid("cursor payload is invalid".into()))?;
    if payload_value.get("scope").and_then(serde_json::Value::as_str)
        != Some(scope.key().as_str())
    {
        return Err(KeysetCursorError::Invalid(
            "cursor scope does not match the request".into(),
        ));
    }
    let sort_value = payload_value
        .get("sort")
        .and_then(serde_json::Value::as_str)
        .filter(|value| !value.is_empty())
        .ok_or_else(|| KeysetCursorError::Invalid("cursor sort value is missing".into()))?;
    let entity_id = payload_value
        .get("id")
        .and_then(serde_json::Value::as_str)
        .filter(|value| !value.is_empty())
        .ok_or_else(|| KeysetCursorError::Invalid("cursor entity id is missing".into()))?;
    Ok(KeysetPosition {
        sort_value: sort_value.to_owned(),
        entity_id: entity_id.to_owned(),
    })
}

/// Builds a cursor page from `LIMIT page_size + 1` records and mints the signed
/// continuation cursor for the last returned item.
pub fn keyset_page<T, F>(
    records: Vec<T>,
    page_size: usize,
    scope: &CursorScope<'_>,
    position_of: F,
) -> Result<SdkWorkPageData<T>, KeysetCursorError>
where
    F: Fn(&T) -> KeysetPosition,
{
    let has_more = records.len() > page_size;
    let mut items = records;
    if has_more {
        items.truncate(page_size);
    }
    let next_cursor = if has_more {
        items
            .last()
            .map(|item| encode_keyset_cursor(scope, &position_of(item)))
            .transpose()?
    } else {
        None
    };
    Ok(cursor_list_page_data(items, page_size, next_cursor, has_more))
}

#[cfg(test)]
mod tests {
    use super::{
        CursorScope, KeysetCursorError, KeysetPosition, decode_keyset_cursor, encode_keyset_cursor,
        keyset_page,
    };

    struct Row(&'static str, &'static str);

    static ENV_LOCK: std::sync::Mutex<()> = std::sync::Mutex::new(());

    struct TestEnvironment {
        previous: Option<String>,
        _guard: std::sync::MutexGuard<'static, ()>,
    }

    impl TestEnvironment {
        fn new() -> Self {
            let guard = ENV_LOCK.lock().expect("keyset cursor env lock");
            let previous = std::env::var("SDKWORK_IM_ENVIRONMENT").ok();
            #[allow(unsafe_code)]
            // SAFETY: ENV_LOCK serializes mutations in this module.
            unsafe {
                std::env::set_var("SDKWORK_IM_ENVIRONMENT", "test");
            }
            Self {
                previous,
                _guard: guard,
            }
        }
    }

    impl Drop for TestEnvironment {
        fn drop(&mut self) {
            #[allow(unsafe_code)]
            // SAFETY: ENV_LOCK is still held.
            unsafe {
                match &self.previous {
                    Some(value) => std::env::set_var("SDKWORK_IM_ENVIRONMENT", value),
                    None => std::env::remove_var("SDKWORK_IM_ENVIRONMENT"),
                }
            }
        }
    }

    fn scope() -> CursorScope<'static> {
        CursorScope {
            resource: "space.spaces",
            tenant_id: "100001",
            organization_id: "100001",
            principal_id: "42",
        }
    }

    #[test]
    fn cursor_round_trips_and_is_scope_bound() {
        let _environment = TestEnvironment::new();
        let position = KeysetPosition {
            sort_value: "2026-10-21T00:00:00Z".into(),
            entity_id: "330339707122622464".into(),
        };
        let cursor = encode_keyset_cursor(&scope(), &position).expect("encode cursor");
        assert!(!cursor.contains("330339707122622464"));
        assert_eq!(
            decode_keyset_cursor(&scope(), cursor.as_str()).expect("decode cursor"),
            position
        );

        let foreign = CursorScope {
            resource: "social.user_blocks",
            ..scope()
        };
        assert!(matches!(
            decode_keyset_cursor(&foreign, cursor.as_str()),
            Err(KeysetCursorError::Invalid(_))
        ));
        assert!(decode_keyset_cursor(&scope(), "forged.cursor.value").is_err());
    }

    #[test]
    fn page_mints_cursor_only_when_more_records_exist() {
        let _environment = TestEnvironment::new();
        let rows = vec![Row("a", "1"), Row("b", "2"), Row("c", "3")];
        let page = keyset_page(rows, 2, &scope(), |row| KeysetPosition {
            sort_value: row.0.into(),
            entity_id: row.1.into(),
        })
        .expect("first page");
        assert_eq!(page.items.len(), 2);
        assert_eq!(page.page_info.has_more, Some(true));
        let cursor = page.page_info.next_cursor.expect("cursor");
        assert_eq!(
            decode_keyset_cursor(&scope(), cursor.as_str())
                .expect("decode cursor")
                .entity_id,
            "2"
        );

        let final_page = keyset_page(vec![Row("c", "3")], 2, &scope(), |row| KeysetPosition {
            sort_value: row.0.into(),
            entity_id: row.1.into(),
        })
        .expect("final page");
        assert_eq!(final_page.page_info.has_more, Some(false));
        assert!(final_page.page_info.next_cursor.is_none());
    }
}

use sdkwork_utils_rust::{
    base64url_decode, base64url_encode, hmac_sha256_base64url, verify_hmac_sha256_base64url,
};
use serde::{Serialize, de::DeserializeOwned};

const SIGNED_CURSOR_MAX_BYTES: usize = 4 * 1024;

#[derive(Clone, Debug, Eq, PartialEq)]
pub(super) enum SignedCursorError {
    Invalid,
    Serialization(String),
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct SignedCursorHeader {
    alg: String,
    typ: String,
    v: u8,
}

pub(super) fn encode_signed_cursor<T: Serialize>(
    cursor_type: &str,
    version: u8,
    payload: &T,
    secret: &str,
) -> Result<String, SignedCursorError> {
    let header = SignedCursorHeader {
        alg: "HS256".to_owned(),
        typ: cursor_type.to_owned(),
        v: version,
    };
    let header_bytes = serde_json::to_vec(&header)
        .map_err(|error| SignedCursorError::Serialization(error.to_string()))?;
    let payload_bytes = serde_json::to_vec(payload)
        .map_err(|error| SignedCursorError::Serialization(error.to_string()))?;
    let header_segment = base64url_encode(header_bytes.as_slice());
    let payload_segment = base64url_encode(payload_bytes.as_slice());
    let signing_input = format!("{header_segment}.{payload_segment}");
    let signature = hmac_sha256_base64url(signing_input.as_bytes(), secret.as_bytes());
    Ok(format!("{signing_input}.{signature}"))
}

pub(super) fn decode_signed_cursor<T: DeserializeOwned>(
    cursor: &str,
    expected_type: &str,
    expected_version: u8,
    secret: &str,
) -> Result<T, SignedCursorError> {
    let cursor = cursor.trim();
    if cursor.is_empty() || cursor.len() > SIGNED_CURSOR_MAX_BYTES {
        return Err(SignedCursorError::Invalid);
    }
    let mut segments = cursor.split('.');
    let Some(header_segment) = segments.next() else {
        return Err(SignedCursorError::Invalid);
    };
    let Some(payload_segment) = segments.next() else {
        return Err(SignedCursorError::Invalid);
    };
    let Some(signature_segment) = segments.next() else {
        return Err(SignedCursorError::Invalid);
    };
    if segments.next().is_some() {
        return Err(SignedCursorError::Invalid);
    }

    let signing_input = format!("{header_segment}.{payload_segment}");
    let signature = base64url_decode(signature_segment).ok_or(SignedCursorError::Invalid)?;
    if !verify_hmac_sha256_base64url(
        signing_input.as_bytes(),
        secret.as_bytes(),
        signature.as_slice(),
    ) {
        return Err(SignedCursorError::Invalid);
    }

    let header_bytes = base64url_decode(header_segment).ok_or(SignedCursorError::Invalid)?;
    let header: SignedCursorHeader =
        serde_json::from_slice(header_bytes.as_slice()).map_err(|_| SignedCursorError::Invalid)?;
    if header.alg != "HS256" || header.typ != expected_type || header.v != expected_version {
        return Err(SignedCursorError::Invalid);
    }

    let payload_bytes = base64url_decode(payload_segment).ok_or(SignedCursorError::Invalid)?;
    serde_json::from_slice(payload_bytes.as_slice()).map_err(|_| SignedCursorError::Invalid)
}

/// Versioned opaque offset cursor (`of1.<base64url(offset)>`).
///
/// PAGINATION_SPEC §2.4/§3: cursor tokens MUST be opaque — RPC list methods
/// that page an incrementally maintained in-memory index through
/// `offset_limit_page_from_iter` must not hand raw numeric offset strings to
/// clients. Clients echo the token verbatim; tampering only yields a decode
/// failure because authorization never depends on cursor contents.
const OPAQUE_OFFSET_CURSOR_PREFIX: &str = "of1.";

pub(super) fn encode_opaque_offset_cursor(offset: usize) -> String {
    format!(
        "{OPAQUE_OFFSET_CURSOR_PREFIX}{}",
        base64url_encode(offset.to_string().as_bytes())
    )
}

pub(super) fn decode_opaque_offset_cursor(raw: &str) -> Option<usize> {
    let encoded = raw.trim().strip_prefix(OPAQUE_OFFSET_CURSOR_PREFIX)?;
    let decoded = base64url_decode(encoded)?;
    let text = String::from_utf8(decoded).ok()?;
    text.parse::<usize>().ok()
}

//! Edge client-IP rate limiting applied after IM, IAM, and embedded dependency
//! routers are merged.
//!
//! Token-bucket per client IP with bounded key cardinality:
//! - `SDKWORK_IM_GATEWAY_RATE_LIMIT_RPM` (default `600`): sustained requests
//!   per minute per client IP.
//! - `SDKWORK_IM_GATEWAY_RATE_LIMIT_BURST` (default `50`): burst capacity.
//! - `SDKWORK_IM_GATEWAY_RATE_LIMIT_MAX_ENTRIES` (default `5000`): max tracked
//!   client IPs before eviction.
//!
//! Client IP resolution matches the session-gateway WebSocket upgrade limiter
//! (`services/session-gateway/src/websocket_upgrade_rate_limit.rs`): when
//! `SDKWORK_IM_GATEWAY_TRUSTED_PROXIES` (comma-separated IPs or CIDR networks)
//! is configured and the immediate TCP peer is one of those trusted proxies,
//! the client IP is the first untrusted `X-Forwarded-For` hop (falling back to
//! the chain head and `X-Real-IP`). Without trusted proxies the raw TCP peer
//! IP is used and forwarded headers are ignored, so clients can never spoof a
//! fresh bucket. Behind nginx this keeps individual clients in individual
//! buckets instead of a collective lockout on the proxy address.
//!
//! Canonical infrastructure probes (`/healthz`, `/livez`, `/readyz`,
//! `/metrics`) and the `/openapi` documentation surface are exempt so
//! readiness and contract discovery never trip the edge limiter.
//!
//! This is the pre-auth edge layer; authenticated request throttling remains
//! the framework tier/tenant rate limit policy (Redis-backed when
//! `SDKWORK_IM_GATEWAY_RATE_LIMIT_REDIS_URL` / `SDKWORK_IM_REDIS_URL` is
//! configured, see `wire_redis_http_stores`).

use std::net::{IpAddr, SocketAddr};
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::extract::{ConnectInfo, Request, State};
use axum::http::{HeaderMap, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use im_domain_core::rate_limiter::DomainRateLimiter;
use sdkwork_utils_rust::trusted_proxy::{TrustedProxyConfig, extract_client_ip};

const RATE_LIMIT_RPM_ENV: &str = "SDKWORK_IM_GATEWAY_RATE_LIMIT_RPM";
const RATE_LIMIT_BURST_ENV: &str = "SDKWORK_IM_GATEWAY_RATE_LIMIT_BURST";
const RATE_LIMIT_MAX_ENTRIES_ENV: &str = "SDKWORK_IM_GATEWAY_RATE_LIMIT_MAX_ENTRIES";

const DEFAULT_RATE_LIMIT_RPM: u32 = 600;
const DEFAULT_RATE_LIMIT_BURST: u32 = 50;
const DEFAULT_RATE_LIMIT_MAX_ENTRIES: usize = 5_000;

const RATE_LIMIT_EXEMPT_PREFIXES: [&str; 5] =
    ["/healthz", "/livez", "/readyz", "/metrics", "/openapi"];

#[derive(Clone)]
pub struct EdgeIpRateLimiter {
    inner: Arc<Mutex<DomainRateLimiter>>,
    // Captured once at construction (see `from_env`); the trusted-proxy
    // allowlist is deployment topology and never changes per request.
    trusted_proxies: TrustedProxyConfig,
}

impl EdgeIpRateLimiter {
    pub fn from_env() -> Self {
        let rpm = read_u32_env(RATE_LIMIT_RPM_ENV, DEFAULT_RATE_LIMIT_RPM).max(1);
        let burst = read_u32_env(RATE_LIMIT_BURST_ENV, DEFAULT_RATE_LIMIT_BURST).max(1);
        let max_entries =
            read_usize_env(RATE_LIMIT_MAX_ENTRIES_ENV, DEFAULT_RATE_LIMIT_MAX_ENTRIES).max(1);
        // Sustained tokens refill per second; a 1-request minimum keeps the
        // bucket moving even for very low RPM configurations.
        let refill_per_sec = (rpm / 60).max(1);
        Self {
            inner: Arc::new(Mutex::new(DomainRateLimiter::with_burst_and_capacity(
                rpm,
                refill_per_sec,
                burst,
                max_entries,
            ))),
            trusted_proxies: TrustedProxyConfig::from_env(),
        }
    }

    /// Consumes one token for the client IP. Returns `false` when the IP
    /// exceeds its window (or when the poisoned lock cannot be recovered).
    fn check(&self, client_ip: &str) -> bool {
        match self.inner.lock() {
            Ok(mut limiter) => limiter.check_rate(client_ip, "edge").is_ok(),
            Err(poisoned) => {
                tracing::warn!("recovering poisoned edge IP rate limiter lock");
                poisoned.into_inner().check_rate(client_ip, "edge").is_ok()
            }
        }
    }
}

/// Resolve the rate-limit client IP from the TCP peer and request headers.
///
/// Shared semantics with the session gateway: forwarded headers are honoured
/// only when the immediate peer is a configured trusted proxy.
fn resolve_edge_client_ip(
    peer: IpAddr,
    headers: &HeaderMap,
    config: &TrustedProxyConfig,
) -> IpAddr {
    extract_client_ip(
        Some(peer),
        |name| {
            headers.iter().find_map(|(header_name, value)| {
                (header_name.as_str().eq_ignore_ascii_case(name))
                    .then(|| value.to_str().ok())
                    .flatten()
                    .map(str::to_owned)
            })
        },
        config,
    )
}

pub async fn edge_ip_rate_limit(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(limiter): State<EdgeIpRateLimiter>,
    request: Request<Body>,
    next: Next,
) -> Response {
    let path = request.uri().path();
    if RATE_LIMIT_EXEMPT_PREFIXES
        .iter()
        .any(|prefix| path.starts_with(prefix))
    {
        return next.run(request).await;
    }
    let client_ip = resolve_edge_client_ip(addr.ip(), request.headers(), &limiter.trusted_proxies);
    if !limiter.check(&client_ip.to_string()) {
        return (
            StatusCode::TOO_MANY_REQUESTS,
            [(axum::http::header::CONTENT_TYPE, "application/problem+json")],
            r#"{"type":"about:blank","title":"Too Many Requests","status":429,"code":"gateway_rate_limited","detail":"edge request rate limit exceeded"}"#,
        )
            .into_response();
    }
    next.run(request).await
}

fn read_u32_env(name: &str, default: u32) -> u32 {
    std::env::var(name)
        .ok()
        .and_then(|value| value.trim().parse::<u32>().ok())
        .unwrap_or(default)
}

fn read_usize_env(name: &str, default: usize) -> usize {
    std::env::var(name)
        .ok()
        .and_then(|value| value.trim().parse::<usize>().ok())
        .unwrap_or(default)
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::HeaderValue;

    fn test_limiter(trusted_proxies: TrustedProxyConfig) -> EdgeIpRateLimiter {
        EdgeIpRateLimiter {
            inner: Arc::new(Mutex::new(DomainRateLimiter::with_burst_and_capacity(
                60, 1, 3, 16,
            ))),
            trusted_proxies,
        }
    }

    #[test]
    fn edge_ip_limiter_tracks_ips_independently() {
        let limiter = test_limiter(TrustedProxyConfig::default());
        assert!(limiter.check("203.0.113.7"));
        assert!(limiter.check("203.0.113.7"));
        assert!(limiter.check("203.0.113.7"));
        // Exhausted for this IP only.
        assert!(!limiter.check("203.0.113.7"));
        assert!(limiter.check("203.0.113.8"));
    }

    #[test]
    fn edge_ip_limiter_recovers_after_refill() {
        let limiter = EdgeIpRateLimiter {
            inner: Arc::new(Mutex::new(DomainRateLimiter::with_burst_and_capacity(
                60, 10, 3, 16,
            ))),
            trusted_proxies: TrustedProxyConfig::default(),
        };
        assert!(limiter.check("203.0.113.9"));
        assert!(limiter.check("203.0.113.9"));
        assert!(limiter.check("203.0.113.9"));
        assert!(!limiter.check("203.0.113.9"));
        // Refill is 10 tokens/second; one refill tick restores capacity.
        std::thread::sleep(std::time::Duration::from_millis(1100));
        assert!(limiter.check("203.0.113.9"));
    }

    #[test]
    fn exempt_prefixes_cover_infrastructure_probes() {
        for prefix in RATE_LIMIT_EXEMPT_PREFIXES {
            assert!(
                prefix.starts_with('/'),
                "exempt prefix must start with '/': {prefix}"
            );
        }
        assert!(RATE_LIMIT_EXEMPT_PREFIXES.contains(&"/healthz"));
        assert!(RATE_LIMIT_EXEMPT_PREFIXES.contains(&"/metrics"));
    }

    #[test]
    fn edge_client_ip_uses_tcp_peer_without_trusted_proxies() {
        // Without SDKWORK_IM_GATEWAY_TRUSTED_PROXIES, forwarded headers are
        // ignored so clients cannot spoof a fresh rate-limit bucket.
        let config = TrustedProxyConfig::default();
        let mut headers = HeaderMap::new();
        headers.insert(
            "x-forwarded-for",
            HeaderValue::from_static("198.51.100.20"),
        );
        let peer: IpAddr = "203.0.113.10".parse().expect("peer ip");
        assert_eq!(resolve_edge_client_ip(peer, &headers, &config), peer);
    }

    #[test]
    fn edge_client_ip_uses_first_untrusted_forwarded_hop_behind_trusted_proxy() {
        let config = TrustedProxyConfig::from_cidrs(["10.0.0.0/8"]);
        let mut headers = HeaderMap::new();
        headers.insert(
            "x-forwarded-for",
            HeaderValue::from_static("198.51.100.20, 10.1.2.3"),
        );
        let peer: IpAddr = "10.1.2.3".parse().expect("peer ip");
        assert_eq!(
            resolve_edge_client_ip(peer, &headers, &config).to_string(),
            "198.51.100.20"
        );
    }

    #[test]
    fn edge_client_ip_falls_back_to_peer_when_proxy_sends_no_forwarded_headers() {
        let config = TrustedProxyConfig::from_cidrs(["10.0.0.0/8"]);
        let headers = HeaderMap::new();
        let peer: IpAddr = "10.1.2.3".parse().expect("peer ip");
        assert_eq!(resolve_edge_client_ip(peer, &headers, &config), peer);
    }

    #[test]
    fn edge_client_ip_ignores_forwarded_headers_from_untrusted_peer() {
        let config = TrustedProxyConfig::from_cidrs(["10.0.0.0/8"]);
        let mut headers = HeaderMap::new();
        headers.insert(
            "x-forwarded-for",
            HeaderValue::from_static("198.51.100.20"),
        );
        let peer: IpAddr = "203.0.113.10".parse().expect("peer ip");
        assert_eq!(resolve_edge_client_ip(peer, &headers, &config), peer);
    }

    #[test]
    fn edge_ip_limiter_keeps_distinct_proxy_clients_independent() {
        // The regression behind the trusted-proxy port: behind nginx every
        // client shared the proxy peer IP, so one abusive client locked out
        // everyone. Distinct forwarded hops must get distinct buckets.
        let limiter = test_limiter(TrustedProxyConfig::from_cidrs(["127.0.0.1"]));
        let peer: IpAddr = "127.0.0.1".parse().expect("proxy peer ip");
        let client_a = {
            let mut headers = HeaderMap::new();
            headers.insert(
                "x-forwarded-for",
                HeaderValue::from_static("198.51.100.20"),
            );
            resolve_edge_client_ip(peer, &headers, &limiter.trusted_proxies)
        };
        let client_b = {
            let mut headers = HeaderMap::new();
            headers.insert(
                "x-forwarded-for",
                HeaderValue::from_static("198.51.100.21"),
            );
            resolve_edge_client_ip(peer, &headers, &limiter.trusted_proxies)
        };

        assert_ne!(client_a, client_b);
        let all_allowed = (0..3).all(|_| limiter.check(&client_a.to_string()));
        assert!(all_allowed, "client a should pass until its burst is spent");
        // Client b is unaffected by client a's exhausted bucket.
        assert!(
            limiter.check(&client_b.to_string()),
            "client b must not share client a's collective lockout"
        );
    }
}

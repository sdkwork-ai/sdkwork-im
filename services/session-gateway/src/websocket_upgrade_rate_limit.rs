//! Per-IP WebSocket upgrade rate limiting with optional Redis fixed-window backend.

use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::sync::{Arc, Mutex};

use axum::http::HeaderMap;
use im_adapters_redis_cache::{
    RedisFixedWindowRateLimiter, gateway_rate_limit_redis_fail_closed_from_env,
    resolve_gateway_rate_limit_redis_url_from_env,
};
use im_domain_core::rate_limiter::DomainRateLimiter;
use sdkwork_utils_rust::trusted_proxy::TrustedProxyConfig;

use crate::ApiError;
use crate::http_limits::{
    resolve_websocket_rate_max_buckets, resolve_websocket_upgrade_rate_burst,
    resolve_websocket_upgrade_rate_rpm,
};

const WS_UPGRADE_RATE_SCOPE: &str = "session.ws_upgrade";
const WS_UPGRADE_RATE_WINDOW_SECS: u64 = 60;
const WS_UPGRADE_REDIS_KEY_PREFIX: &str = "session:ws_upgrade:";

#[derive(Clone)]
pub struct WebsocketUpgradeRateLimiter {
    rpm: u32,
    local: Arc<Mutex<DomainRateLimiter>>,
    redis: Option<RedisFixedWindowRateLimiter>,
    redis_fail_closed: bool,
}

impl WebsocketUpgradeRateLimiter {
    pub fn from_env() -> Self {
        let rpm = resolve_websocket_upgrade_rate_rpm();
        let burst = resolve_websocket_upgrade_rate_burst();
        let refill_per_sec = (rpm / 60).max(1);
        let redis = resolve_gateway_rate_limit_redis_url_from_env().and_then(|url| {
            RedisFixedWindowRateLimiter::try_from_url(url.as_str(), WS_UPGRADE_REDIS_KEY_PREFIX)
        });
        Self {
            rpm,
            local: Arc::new(Mutex::new(DomainRateLimiter::with_burst_and_capacity(
                rpm,
                refill_per_sec,
                burst,
                resolve_websocket_rate_max_buckets(),
            ))),
            redis,
            redis_fail_closed: gateway_rate_limit_redis_fail_closed_from_env(),
        }
    }

    pub fn check_upgrade(&self, client_ip: IpAddr) -> Result<(), ApiError> {
        if let Some(redis) = &self.redis {
            let bucket = format!("{WS_UPGRADE_RATE_SCOPE}:{client_ip}");
            match redis.allow(bucket.as_str(), self.rpm, WS_UPGRADE_RATE_WINDOW_SECS) {
                Ok(true) => return Ok(()),
                Ok(false) => {
                    return Err(ApiError {
                        status: axum::http::StatusCode::TOO_MANY_REQUESTS,
                        code: "websocket_upgrade_rate_limited",
                        message: "websocket upgrade rate limit exceeded, please retry later"
                            .to_owned(),
                    });
                }
                Err(error) => {
                    tracing::warn!(
                        target: "sdkwork.im.session_gateway",
                        event = "im.session_gateway.ws_upgrade_rate_redis_unavailable",
                        ?error,
                        client_ip = %client_ip,
                        fail_closed = self.redis_fail_closed,
                        "redis websocket upgrade rate limit unavailable"
                    );
                    if self.redis_fail_closed {
                        return Err(ApiError {
                            status: axum::http::StatusCode::TOO_MANY_REQUESTS,
                            code: "websocket_upgrade_rate_limited",
                            message: "websocket upgrade rate limit backend unavailable".to_owned(),
                        });
                    }
                }
            }
        }

        let mut limiter = self.local.lock().map_err(|_| ApiError {
            status: axum::http::StatusCode::SERVICE_UNAVAILABLE,
            code: "websocket_rate_limiter_unavailable",
            message: "websocket upgrade rate limiter lock poisoned".to_owned(),
        })?;
        limiter
            .check_rate(client_ip.to_string().as_str(), "websocket.upgrade")
            .map_err(|_| ApiError {
                status: axum::http::StatusCode::TOO_MANY_REQUESTS,
                code: "websocket_upgrade_rate_limited",
                message: "websocket upgrade rate limit exceeded, please retry later".to_owned(),
            })
    }
}

/// Resolve the rate-limit key from the real peer address.
///
/// Forwarded headers are honoured only when the TCP peer is a configured
/// trusted proxy. Without peer information the caller shares a single
/// fail-closed bucket instead of a spoofable header-derived key.
pub fn resolve_client_ip(peer: Option<SocketAddr>, headers: &HeaderMap) -> IpAddr {
    resolve_client_ip_with_config(peer, headers, &TrustedProxyConfig::from_env())
}

fn resolve_client_ip_with_config(
    peer: Option<SocketAddr>,
    headers: &HeaderMap,
    config: &TrustedProxyConfig,
) -> IpAddr {
    let Some(peer_ip) = peer.map(|address| address.ip()) else {
        // Without a TCP peer we cannot verify a trusted proxy, so forwarded
        // headers are untrusted by definition. All such requests share one
        // fail-closed bucket.
        return IpAddr::V4(Ipv4Addr::UNSPECIFIED);
    };
    if config.is_empty() || !config.is_trusted(&peer_ip) {
        return peer_ip;
    }
    forwarded_client_ip(headers, config).unwrap_or(peer_ip)
}

fn forwarded_client_ip(headers: &HeaderMap, config: &TrustedProxyConfig) -> Option<IpAddr> {
    if let Some(raw) = header_value(headers, "x-forwarded-for") {
        let chain = raw
            .split(',')
            .map(str::trim)
            .filter(|segment| !segment.is_empty())
            .filter_map(|segment| segment.parse::<IpAddr>().ok())
            .collect::<Vec<_>>();
        for entry in chain.iter().rev() {
            if !config.is_trusted(entry) {
                return Some(*entry);
            }
        }
        if let Some(entry) = chain.first() {
            return Some(*entry);
        }
    }
    header_value(headers, "x-real-ip")
        .and_then(|raw| raw.trim().parse::<IpAddr>().ok())
        .filter(|ip| !config.is_trusted(ip))
}

fn header_value(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .iter()
        .find(|(header_name, _)| header_name.as_str().eq_ignore_ascii_case(name))
        .and_then(|(_, value)| value.to_str().ok().map(str::to_owned))
}

#[cfg(test)]
mod client_ip_tests {
    use std::net::SocketAddr;

    use axum::http::HeaderMap;
    use sdkwork_utils_rust::trusted_proxy::TrustedProxyConfig;

    use super::resolve_client_ip_with_config;

    fn headers(pairs: &[(&'static str, &'static str)]) -> HeaderMap {
        let mut headers = HeaderMap::new();
        for (name, value) in pairs {
            headers.insert(*name, value.parse().expect("header value"));
        }
        headers
    }

    #[test]
    fn untrusted_peer_ignores_spoofed_forwarded_headers() {
        let config = TrustedProxyConfig::from_cidrs(["10.0.0.0/8"]);
        let peer: SocketAddr = "198.51.100.7:43110".parse().expect("peer addr");
        let forwarded = headers(&[("x-forwarded-for", "203.0.113.9")]);
        assert_eq!(
            resolve_client_ip_with_config(Some(peer), &forwarded, &config).to_string(),
            "198.51.100.7"
        );
    }

    #[test]
    fn trusted_peer_uses_the_forwarded_client_chain() {
        let config = TrustedProxyConfig::from_cidrs(["10.0.0.0/8"]);
        let peer: SocketAddr = "10.0.0.2:443".parse().expect("peer addr");
        let forwarded = headers(&[("x-forwarded-for", "198.51.100.7, 10.0.0.5")]);
        assert_eq!(
            resolve_client_ip_with_config(Some(peer), &forwarded, &config).to_string(),
            "198.51.100.7"
        );
    }

    #[test]
    fn missing_peer_uses_a_shared_fail_closed_bucket() {
        let config = TrustedProxyConfig::from_cidrs(["10.0.0.0/8"]);
        let spoofed = headers(&[
            ("user-agent", "rotating-ua"),
            ("x-forwarded-for", "203.0.113.9"),
        ]);
        assert_eq!(
            resolve_client_ip_with_config(None, &spoofed, &config).to_string(),
            "0.0.0.0"
        );
    }
}

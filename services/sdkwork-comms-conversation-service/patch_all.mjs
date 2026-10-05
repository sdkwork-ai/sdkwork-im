import fs from 'node:fs';

// runtime.rs
const rp = 'services/sdkwork-comms-conversation-service/src/runtime.rs';
let r = fs.readFileSync(rp, 'utf8');
const sig = 'pub fn with_message_store(mut self, store: Arc<dyn MessageStore>) -> Self {';
if (!r.includes(sig)) { console.error('rt sig missing'); process.exit(1); }
r = r.replace(sig, `    /// 注入正在输入指示缓存，启用 typing signal/list 路由。
    pub fn with_typing_cache(mut self, cache: Arc<dyn TypingCache>) -> Self {
        self.typing_cache = Some(cache);
        self
    }

    ${sig}`);
const modA = 'pub mod http;';
if (!r.includes(modA)) { console.error('rt mod missing'); process.exit(1); }
r = r.replace(modA, 'pub mod http;\nmod typing;\n\npub use typing::SignalTypingResult;');
r = r.replace(
  'use sdkwork_im_contract_core::ContractError;',
  'use im_adapters_redis_cache::TypingCache;\nuse sdkwork_im_contract_core::ContractError;',
);
// field + ctor init
const fieldA = '    realtime_publisher: Option<Arc<dyn RealtimeEventPublisher>>,';
if (!r.includes(fieldA)) { console.error('rt field missing'); process.exit(1); }
r = r.replace(fieldA, fieldA + '\n    /// 可选的正在输入指示缓存（Redis TTL）。\n    typing_cache: Option<Arc<dyn TypingCache>>,');
const ctorA = '            realtime_publisher: None,';
if (!r.includes(ctorA)) { console.error('rt ctor missing'); process.exit(1); }
r = r.replace(ctorA, ctorA + '\n            typing_cache: None,');
fs.writeFileSync(rp, r);
console.log('runtime.rs wired');

// http.rs
const hp = 'services/sdkwork-comms-conversation-service/src/runtime/http.rs';
let h = fs.readFileSync(hp, 'utf8');
const impOld = 'use im_domain_core::message::{ContentPart, Message, MessageBody, MessageType, Sender};';
if (!h.includes(impOld)) { console.error('http imp missing'); process.exit(1); }
h = h.replace(impOld, impOld + '\nuse im_domain_core::typing::TypingIndicatorList;');
const routeOld = `            "/im/v3/api/chat/conversations/{conversation_id}/read_cursor",
            get(get_read_cursor).patch(update_read_cursor),
        )`;
if (!h.includes(routeOld)) { console.error('http route missing'); process.exit(1); }
h = h.replace(routeOld, routeOld + `
        .route(
            "/im/v3/api/chat/conversations/{conversation_id}/typing",
            get(list_typing_indicators).post(signal_typing),
        )`);
const fnA = 'async fn get_read_cursor(';
if (!h.includes(fnA)) { console.error('http fn missing'); process.exit(1); }
h = h.replace(fnA, `async fn signal_typing(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Path(conversation_id): Path<String>,
) -> Response {
    ensure_active_http_auth_principal(&state, &auth)?;
    let result: ApiResult<SignalTypingResult> = state
        .runtime
        .signal_typing_from_auth_context(&auth, conversation_id.as_str())
        .await
        .map_err(ApiError::from);
    resource_response(&ctx, result)
}

async fn list_typing_indicators(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Path(conversation_id): Path<String>,
) -> Response {
    ensure_active_http_auth_principal(&state, &auth)?;
    let result: ApiResult<TypingIndicatorList> = state
        .runtime
        .list_typing_indicators_from_auth_context(&auth, conversation_id.as_str())
        .await
        .map_err(ApiError::from);
    resource_response(&ctx, result)
}

${fnA}`);
fs.writeFileSync(hp, h);
console.log('http.rs wired');

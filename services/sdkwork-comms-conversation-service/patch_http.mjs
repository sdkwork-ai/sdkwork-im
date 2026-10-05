import fs from 'node:fs';

const p = 'services/sdkwork-comms-conversation-service/src/runtime/http.rs';
let raw = fs.readFileSync(p, 'utf8');

// 1. import the result type.
const impOld = 'use im_domain_core::message::{ContentPart, Message, MessageBody, MessageType, Sender};';
const impNew = `${impOld}
use im_domain_core::typing::TypingIndicatorList;`;
if (!raw.includes(impOld)) {
  console.error('import anchor missing');
  process.exit(1);
}
raw = raw.replace(impOld, impNew);

// 2. route next to read_cursor.
const routeOld = `            "/im/v3/api/chat/conversations/{conversation_id}/read_cursor",
            get(get_read_cursor).patch(update_read_cursor),
        )`;
const routeNew = `${routeOld}
        .route(
            "/im/v3/api/chat/conversations/{conversation_id}/typing",
            get(list_typing_indicators).post(signal_typing),
        )`;
if (!raw.includes(routeOld)) {
  console.error('route anchor missing');
  process.exit(1);
}
raw = raw.replace(routeOld, routeNew);

// 3. handlers after get_read_cursor (CRLF-tolerant: anchor on the fn tail).
const handlerAnchor = `async fn get_read_cursor(
    Extension(ctx): Extension<WebRequestContext>,
    Extension(auth): Extension<AppContext>,
    State(state): State<AppState>,
    Path(conversation_id): Path<String>,
) -> Response {`;
if (!raw.includes(handlerAnchor)) {
  console.error('get_read_cursor anchor missing');
  process.exit(1);
}
const handlers = `async fn signal_typing(
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

${handlerAnchor}`;
raw = raw.replace(handlerAnchor, handlers);

fs.writeFileSync(p, raw);
console.log('http.rs wired: import + route + handlers');

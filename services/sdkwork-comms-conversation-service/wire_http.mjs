import fs from 'node:fs';

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

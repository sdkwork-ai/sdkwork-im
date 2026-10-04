import fs from 'node:fs';

// Conversation page: thread conversationType through to a group entry.
const page = 'src/package-chat/pages/conversation/index.js';
let raw = fs.readFileSync(page, 'utf8');

const dataOld = `    imageUrls: {},
    uploadingImage: false,
    texts: {},`;
const dataNew = `    imageUrls: {},
    uploadingImage: false,
    isGroup: false,
    texts: {},`;
if (!raw.includes(dataOld)) {
  console.error('data pattern missing');
  process.exit(1);
}
raw = raw.replace(dataOld, dataNew);

const loadOld = `    const fallbackTitle = options[IM_MP_CHAT_QUERY_PARAMS.conversationTitle];`;
const loadNew = `    const fallbackTitle = options[IM_MP_CHAT_QUERY_PARAMS.conversationTitle];
    const conversationType = options ? options[IM_MP_CHAT_QUERY_PARAMS.conversationType] : "";
    this.setData({ isGroup: conversationType === "group" });`;
if (!raw.includes(loadOld)) {
  console.error('load type pattern missing');
  process.exit(1);
}
raw = raw.replace(loadOld, loadNew);

const textsOld = `      actionFailed: t("chat.conversation.action_failed"),`;
const textsNew = `      actionFailed: t("chat.conversation.action_failed"),
      groupProfile: t("chat.group_profile.title"),`;
if (!raw.includes(textsOld)) {
  console.error('texts pattern missing');
  process.exit(1);
}
raw = raw.replace(textsOld, textsNew);

const handlerAnchor = `  onMessageLongPress(event) {`;
const handlerNew = `  onOpenGroupProfile() {
    const runtime = getImMpRuntime();
    if (!this.data.isGroup) {
      return;
    }
    runtime.navigation.navigateTo(
      runtime.routePagePath(IM_MP_CHAT_ROUTE_IDS.groupProfile),
      { [IM_MP_CHAT_QUERY_PARAMS.conversationId]: this.store.getState().conversationId },
    );
  },

  onMessageLongPress(event) {`;
if (!raw.includes(handlerAnchor)) {
  console.error('handler anchor missing');
  process.exit(1);
}
raw = raw.replace(handlerAnchor, handlerNew);
fs.writeFileSync(page, raw);
console.log('conversation page updated');

// Inbox: pass conversationType to the conversation page.
const inbox = 'src/pages/inbox/index.js';
let iraw = fs.readFileSync(inbox, 'utf8');
const navOld = `      runtime.navigation.navigateTo(
        runtime.routePagePath(IM_MP_CHAT_ROUTE_IDS.conversation),
        {
          [IM_MP_CHAT_QUERY_PARAMS.conversationId]: conversationId,
          ...(item ? { [IM_MP_CHAT_QUERY_PARAMS.conversationTitle]: item.displayName } : {}),
        },
      );`;
if (!iraw.includes(navOld)) {
  console.error('inbox nav pattern missing');
  process.exit(1);
}
const navNew = `      runtime.navigation.navigateTo(
        runtime.routePagePath(IM_MP_CHAT_ROUTE_IDS.conversation),
        {
          [IM_MP_CHAT_QUERY_PARAMS.conversationId]: conversationId,
          ...(item ? { [IM_MP_CHAT_QUERY_PARAMS.conversationTitle]: item.displayName } : {}),
          ...(item ? { [IM_MP_CHAT_QUERY_PARAMS.conversationType]: item.conversationType } : {}),
        },
      );`;
iraw = iraw.replace(navOld, navNew);
// conversationType must be declared as a query param constant.
const paramsOld = `export const IM_MP_CHAT_QUERY_PARAMS = {} as const;`;
if (iraw.includes(paramsOld)) {
  // not the real shape; skip silently (constant lives in the TS package)
}
fs.writeFileSync(inbox, iraw);
console.log('inbox updated');

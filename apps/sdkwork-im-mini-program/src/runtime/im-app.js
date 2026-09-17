"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// (disabled):node:net
var require_node_net = __commonJS({
  "(disabled):node:net"() {
  }
});

// (disabled):node:dgram
var require_node_dgram = __commonJS({
  "(disabled):node:dgram"() {
  }
});

// src/bootstrap/runtimeBundle.ts
var runtimeBundle_exports = {};
__export(runtimeBundle_exports, {
  IM_MP_CHAT_PAGE_SIZE: () => IM_MP_CHAT_PAGE_SIZE,
  IM_MP_CHAT_QUERY_PARAMS: () => IM_MP_CHAT_QUERY_PARAMS,
  IM_MP_CHAT_ROUTE_IDS: () => IM_MP_CHAT_ROUTE_IDS,
  IM_MP_CHAT_SUBPACKAGE: () => IM_MP_CHAT_SUBPACKAGE,
  IM_MP_DEPLOYMENT_PROFILES: () => IM_MP_DEPLOYMENT_PROFILES,
  IM_MP_ENVIRONMENTS: () => IM_MP_ENVIRONMENTS,
  IM_MP_GROUP_CONVERSATION_TYPE: () => IM_MP_GROUP_CONVERSATION_TYPE,
  IM_MP_HOME_PAGE_PATH: () => IM_MP_HOME_PAGE_PATH,
  IM_MP_LOGIN_PAGE_PATH: () => IM_MP_LOGIN_PAGE_PATH,
  IM_MP_RUNTIME_TARGET: () => IM_MP_RUNTIME_TARGET,
  IM_MP_TAB_BAR_MIN_ITEMS: () => IM_MP_TAB_BAR_MIN_ITEMS,
  assertImMpCursorPage: () => assertImMpCursorPage,
  bootstrapImMpMiniProgram: () => bootstrapImMpMiniProgram,
  clearImMpSessionForRuntime: () => clearImMpSessionForRuntime,
  commitImMpSessionForRuntime: () => commitImMpSessionForRuntime,
  composeImMpRoutes: () => composeImMpRoutes,
  createImMpChatConversationService: () => createImMpChatConversationService,
  createImMpChatConversationStore: () => createImMpChatConversationStore,
  createImMpChatInboxService: () => createImMpChatInboxService,
  createImMpChatInboxStore: () => createImMpChatInboxStore,
  evaluateImMpAuthGate: () => evaluateImMpAuthGate,
  formatImMpBadgeCount: () => formatImMpBadgeCount,
  formatImMpChatMessage: () => formatImMpChatMessage,
  formatImMpTimestamp: () => formatImMpTimestamp,
  getImMpAuthRuntime: () => getImMpAuthRuntime,
  getImMpHostAdapters: () => getImMpHostAdapters,
  getImMpRuntime: () => getImMpRuntime,
  getImMpRuntimeEnvironment: () => getImMpRuntimeEnvironment,
  imMpChatRouteContributions: () => imMpChatRouteContributions,
  imMpTokens: () => imMpTokens,
  isImMpAuthenticated: () => isImMpAuthenticated,
  isImMpRuntimeBootstrapped: () => isImMpRuntimeBootstrapped,
  listImMpChatMessageKeys: () => listImMpChatMessageKeys,
  listImMpRouteContributions: () => listImMpRouteContributions,
  mergeImMpChatInboxPages: () => mergeImMpChatInboxPages,
  normalizeImMpLocale: () => normalizeImMpLocale,
  prependImMpChatMessages: () => prependImMpChatMessages,
  projectImMpAppJson: () => projectImMpAppJson,
  projectImMpPages: () => projectImMpPages,
  projectImMpSubPackages: () => projectImMpSubPackages,
  projectImMpTabBar: () => projectImMpTabBar,
  readImMpCurrentSession: () => readImMpCurrentSession,
  resolveImMpChatMessage: () => resolveImMpChatMessage,
  resolveImMpErrorMessage: () => resolveImMpErrorMessage,
  resolveImMpLaunchPagePath: () => resolveImMpLaunchPagePath,
  resolveImMpScreenStatus: () => resolveImMpScreenStatus,
  resolveImMpShellMessage: () => resolveImMpShellMessage,
  resolveImMpTabBarDeclaration: () => resolveImMpTabBarDeclaration,
  restoreImMpSession: () => restoreImMpSession,
  toImMpChatConversationSummary: () => toImMpChatConversationSummary,
  toImMpChatInboxItem: () => toImMpChatInboxItem,
  toImMpChatMessageItem: () => toImMpChatMessageItem,
  validateImMpComposedRoutes: () => validateImMpComposedRoutes,
  validateImMpRouteContributions: () => validateImMpRouteContributions,
  validateImMpRuntimeIdentity: () => validateImMpRuntimeIdentity
});
module.exports = __toCommonJS(runtimeBundle_exports);

// packages/sdkwork-im-mp-shell/src/navigation/routeContribution.ts
function validateImMpRouteContributions(routes) {
  const issues = [];
  const seenIds = /* @__PURE__ */ new Set();
  const seenPagePaths = /* @__PURE__ */ new Set();
  for (const route of routes) {
    if (route.surface !== "app") {
      issues.push(`${route.id}: mini program route surface must be "app"`);
    }
    const segments = route.id.split(".");
    if (segments.length !== 4 || segments.some((segment) => segment.trim().length === 0)) {
      issues.push(`${route.id}: route id must follow <surface>.<domain>.<capability>.<screen>`);
    }
    if (seenIds.has(route.id)) {
      issues.push(`${route.id}: duplicate route id`);
    }
    seenIds.add(route.id);
    if (!route.titleKey.trim()) {
      issues.push(`${route.id}: titleKey is required`);
    }
    if (!route.miniProgram.pagePath.trim()) {
      issues.push(`${route.id}: miniProgram.pagePath is required`);
    }
    if (seenPagePaths.has(route.miniProgram.pagePath)) {
      issues.push(`${route.id}: duplicate pagePath ${route.miniProgram.pagePath}`);
    }
    seenPagePaths.add(route.miniProgram.pagePath);
    if (route.miniProgram.subpackage && route.miniProgram.rootPackage === true) {
      issues.push(`${route.id}: a route cannot be both a root page and a subpackage page`);
    }
    if (!route.miniProgram.rootPackage && !route.miniProgram.subpackage) {
      issues.push(`${route.id}: pagePath must declare rootPackage or subpackage placement`);
    }
  }
  return issues;
}

// packages/sdkwork-im-mp-shell/src/navigation/routePlacement.ts
function projectImMpPages(routes) {
  return routes.map((route) => ({
    routeId: route.id,
    pagePath: route.miniProgram.pagePath,
    rootPackage: route.miniProgram.rootPackage === true,
    ...route.miniProgram.subpackage ? { subpackage: route.miniProgram.subpackage } : {}
  }));
}
function listImMpRootPages(routes) {
  return projectImMpPages(routes).filter((entry) => entry.rootPackage).map((entry) => entry.pagePath);
}
function projectImMpSubPackages(routes) {
  var _a;
  const grouped = /* @__PURE__ */ new Map();
  for (const route of routes) {
    const subpackage = route.miniProgram.subpackage;
    if (!subpackage) {
      continue;
    }
    const bucket = (_a = grouped.get(subpackage)) != null ? _a : { pages: [], preload: false };
    bucket.pages.push(stripSubpackagePrefix(route.miniProgram.pagePath, subpackage));
    bucket.preload = bucket.preload || route.miniProgram.preload === true;
    grouped.set(subpackage, bucket);
  }
  return [...grouped.entries()].map(([root, bucket]) => ({
    root,
    pages: bucket.pages,
    ...bucket.preload ? { preloadRule: true } : {}
  }));
}
function projectImMpAppJson(routes) {
  return {
    pages: listImMpRootPages(routes),
    subPackages: projectImMpSubPackages(routes)
  };
}
function stripSubpackagePrefix(pagePath, subpackage) {
  const prefix = `${subpackage}/`;
  return pagePath.startsWith(prefix) ? pagePath.slice(prefix.length) : pagePath;
}

// packages/sdkwork-im-mp-shell/src/navigation/shellRoutes.ts
var IM_MP_LOGIN_PAGE_PATH = "pages/login/index";
var IM_MP_HOME_PAGE_PATH = "pages/inbox/index";
var imMpShellRouteContributions = [
  {
    id: "app.communication.session.login",
    surface: "app",
    moduleId: "session",
    domain: "communication",
    capability: "session",
    screen: "login",
    titleKey: "common.session.login_title",
    auth: "public",
    layoutGroup: "stack",
    miniProgram: { rootPackage: true, pagePath: IM_MP_LOGIN_PAGE_PATH }
  }
];

// packages/sdkwork-im-mp-shell/src/navigation/tabBarProjection.ts
var IM_MP_TAB_BAR_MIN_ITEMS = 2;
function resolveImMpTabBarDeclaration(entries) {
  if (entries.length < IM_MP_TAB_BAR_MIN_ITEMS) {
    return {
      enabled: false,
      reason: `tab bar requires at least ${IM_MP_TAB_BAR_MIN_ITEMS} main pages; this build declares ${entries.length}`
    };
  }
  return { enabled: true };
}
function projectImMpTabBar(routes, options = {}) {
  var _a;
  const resolveTitle = (_a = options.resolveTitle) != null ? _a : ((titleKey) => titleKey);
  return routes.filter((route) => route.layoutGroup === "main" && route.miniProgram.rootPackage === true).map((route) => ({
    pagePath: route.miniProgram.pagePath,
    titleKey: route.titleKey,
    text: resolveTitle(route.titleKey)
  }));
}
function applyImMpTabBar(entries, setTabBarItem) {
  entries.forEach((entry, index) => {
    setTabBarItem(index, { text: entry.text });
  });
  return entries.length;
}

// packages/sdkwork-im-mp-shell/src/auth/authGate.ts
function evaluateImMpAuthGate(auth, isAuthenticated, loginPagePath = IM_MP_LOGIN_PAGE_PATH) {
  if (auth === "public") {
    return { allowed: true, reason: "public-route" };
  }
  if (isAuthenticated) {
    return { allowed: true, reason: "authenticated" };
  }
  return {
    allowed: false,
    reason: "authentication-required",
    redirectPagePath: loginPagePath
  };
}
function resolveImMpLaunchPagePath(isAuthenticated, homePagePath) {
  return isAuthenticated ? homePagePath : IM_MP_LOGIN_PAGE_PATH;
}

// packages/sdkwork-im-mp-commons/src/components/screenStates.ts
function resolveImMpScreenStatus(itemCount, loading, errorMessage) {
  if (loading) {
    return "loading";
  }
  if (typeof errorMessage === "string" && errorMessage.length > 0) {
    return "error";
  }
  return itemCount === 0 ? "empty" : "ready";
}

// packages/sdkwork-im-mp-commons/src/state/observableStore.ts
function defaultEquals(left, right) {
  return Object.is(left, right);
}
function createImMpObservableStore(initialState, options = {}) {
  var _a;
  const equals = (_a = options.equals) != null ? _a : defaultEquals;
  let state = initialState;
  const listeners = /* @__PURE__ */ new Set();
  const notify = (previous) => {
    for (const listener of [...listeners]) {
      listener(state, previous);
    }
  };
  return {
    getState() {
      return state;
    },
    setState(patch) {
      const previous = state;
      let changed = false;
      for (const key of Object.keys(patch)) {
        const next = patch[key];
        if (next === void 0) {
          continue;
        }
        if (!Object.is(previous[key], next)) {
          changed = true;
          break;
        }
      }
      if (!changed) {
        return false;
      }
      state = { ...previous, ...patch };
      notify(previous);
      return true;
    },
    replaceState(next) {
      const previous = state;
      state = next;
      notify(previous);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    select(selector, listener) {
      let selected = selector(state);
      return this.subscribe((next) => {
        const nextSelected = selector(next);
        if (equals(nextSelected, selected)) {
          return;
        }
        const previousSelected = selected;
        selected = nextSelected;
        listener(nextSelected, previousSelected);
      });
    }
  };
}

// packages/sdkwork-im-mp-commons/src/format/timestamp.ts
function pad(value) {
  return value < 10 ? `0${value}` : String(value);
}
function formatImMpTimestamp(iso, now = /* @__PURE__ */ new Date()) {
  const value = typeof iso === "string" ? iso.trim() : "";
  if (!value) {
    return "";
  }
  const date = new Date(value);
  const time = date.getTime();
  if (!Number.isFinite(time)) {
    return "";
  }
  const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const sameDay = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  if (sameDay) {
    return clock;
  }
  const monthDay = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (date.getFullYear() === now.getFullYear()) {
    return monthDay;
  }
  return `${date.getFullYear()}-${monthDay}`;
}
function formatImMpBadgeCount(count, cap = 99) {
  if (!Number.isFinite(count) || count <= 0) {
    return "";
  }
  return count > cap ? `${cap}+` : String(count);
}

// packages/sdkwork-im-mp-commons/src/theme/designTokens.ts
var imMpTokens = {
  colorPrimary: "#0f766e",
  colorBackground: "#f5f5f5",
  colorSurface: "#ffffff",
  colorText: "#181818",
  colorTextMuted: "#888888",
  colorDanger: "#fa5151",
  colorDivider: "#ededed",
  spacingXs: "8rpx",
  spacingSm: "16rpx",
  spacingMd: "24rpx",
  spacingLg: "32rpx",
  radiusMd: "16rpx"
};

// packages/sdkwork-im-mp-commons/src/i18n/locale.ts
function normalizeImMpLocale(value) {
  return value.trim().toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
}
function pickImMpMessage(fragment, key, fallback) {
  const value = fragment[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}
function mergeImMpFragments(fragments) {
  return fragments.reduce(
    (merged, fragment) => Object.assign(merged, fragment),
    {}
  );
}

// packages/sdkwork-im-mp-shell/src/i18n/zh-CN/communication/session/login.ts
var imMpSessionLoginMessages = {
  "common.session.login_title": "\u767B\u5F55",
  "common.session.login_description": "\u4F7F\u7528\u5FAE\u4FE1\u767B\u5F55\u540E\u5373\u53EF\u540C\u6B65\u4F1A\u8BDD\u4E0E\u6D88\u606F\u3002",
  "common.session.login_action": "\u5FAE\u4FE1\u4E00\u952E\u767B\u5F55",
  "common.session.login_pending": "\u6B63\u5728\u767B\u5F55\u2026",
  "common.session.login_failed": "\u767B\u5F55\u5931\u8D25",
  "common.session.login_code_failed": "\u672A\u83B7\u53D6\u5230\u5FAE\u4FE1\u767B\u5F55\u51ED\u8BC1\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "common.session.runtime_unavailable": "\u8FD0\u884C\u73AF\u5883\u672A\u5C31\u7EEA\uFF0C\u6682\u65F6\u65E0\u6CD5\u767B\u5F55\u3002",
  "common.session.logout_action": "\u9000\u51FA\u767B\u5F55"
};

// packages/sdkwork-im-mp-shell/src/i18n/en-US/communication/session/login.ts
var imMpSessionLoginMessages2 = {
  "common.session.login_title": "Sign in",
  "common.session.login_description": "Sign in with WeChat to sync your conversations and messages.",
  "common.session.login_action": "Sign in with WeChat",
  "common.session.login_pending": "Signing in\u2026",
  "common.session.login_failed": "Sign-in failed",
  "common.session.login_code_failed": "Could not obtain a WeChat login code. Please retry.",
  "common.session.runtime_unavailable": "The runtime is not ready, so sign-in is unavailable.",
  "common.session.logout_action": "Sign out"
};

// packages/sdkwork-im-mp-shell/src/i18n/index.ts
var imMpShellMessages = {
  "zh-CN": mergeImMpFragments([imMpSessionLoginMessages]),
  "en-US": mergeImMpFragments([imMpSessionLoginMessages2])
};
function resolveImMpShellMessage(locale, key, fallback = key) {
  return pickImMpMessage(imMpShellMessages[normalizeImMpLocale(locale)], key, fallback);
}

// packages/sdkwork-im-mp-chat/src/types/chatTypes.ts
var IM_MP_CHAT_PAGE_SIZE = 50;
var IM_MP_MAX_LIST_PAGE_SIZE = 100;
function assertImMpCursorPage(pageInfo, resource) {
  if (pageInfo.mode !== "cursor") {
    throw new Error(`${resource} must use cursor pagination.`);
  }
  if (pageInfo.hasMore && !pageInfo.nextCursor) {
    throw new Error(`${resource} returned hasMore without nextCursor.`);
  }
}
function resolveImMpPageSize(requested = IM_MP_CHAT_PAGE_SIZE) {
  if (!Number.isFinite(requested) || requested <= 0) {
    return IM_MP_CHAT_PAGE_SIZE;
  }
  return Math.min(Math.trunc(requested), IM_MP_MAX_LIST_PAGE_SIZE);
}
function normalizeString(value) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : void 0;
}
function toImMpChatInboxItem(entry) {
  var _a, _b, _c, _d, _e;
  const displayName = (_c = (_b = normalizeString(entry.displayName)) != null ? _b : normalizeString((_a = entry.peer) == null ? void 0 : _a.displayName)) != null ? _c : entry.conversationId;
  const avatarUrl = (_e = normalizeString(entry.avatarUrl)) != null ? _e : normalizeString((_d = entry.peer) == null ? void 0 : _d.avatarUrl);
  const lastSummary = normalizeString(entry.lastSummary);
  return {
    conversationId: entry.conversationId,
    conversationType: entry.conversationType,
    displayName,
    ...avatarUrl ? { avatarUrl } : {},
    ...lastSummary ? { lastSummary } : {},
    lastActivityAt: entry.lastActivityAt,
    unreadCount: typeof entry.unreadCount === "number" ? entry.unreadCount : 0,
    lastMessageSeq: entry.lastMessageSeq
  };
}
function toImMpChatMessageItem(entry) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const text = (_e = (_d = (_c = normalizeString((_a = entry.body) == null ? void 0 : _a.text)) != null ? _c : normalizeString((_b = entry.body) == null ? void 0 : _b.summary)) != null ? _d : normalizeString(entry.summary)) != null ? _e : "";
  const senderDisplayName = normalizeString((_f = entry.sender) == null ? void 0 : _f.displayName);
  return {
    messageId: entry.messageId,
    senderId: (_h = (_g = entry.sender) == null ? void 0 : _g.id) != null ? _h : "",
    ...senderDisplayName ? { senderDisplayName } : {},
    text,
    occurredAt: entry.occurredAt,
    messageSeq: entry.messageSeq
  };
}
function toImMpChatConversationSummary(summary) {
  const lastSummary = normalizeString(summary.lastSummary);
  const lastMessageAt = normalizeString(summary.lastMessageAt);
  return {
    conversationId: summary.conversationId,
    messageCount: typeof summary.messageCount === "number" ? summary.messageCount : 0,
    lastMessageSeq: summary.lastMessageSeq,
    ...lastSummary ? { lastSummary } : {},
    ...lastMessageAt ? { lastMessageAt } : {}
  };
}

// packages/sdkwork-im-mp-chat/src/services/chatInboxService.ts
function createImMpChatInboxService(resolveClient) {
  const listPage = async (options = {}) => {
    var _a;
    const q = (_a = options.q) == null ? void 0 : _a.trim();
    const page = await resolveClient().conversations.list({
      pageSize: resolveImMpPageSize(options.pageSize),
      ...options.cursor ? { cursor: options.cursor } : {},
      ...q ? { q } : {},
      ...options.conversationType ? { conversationType: options.conversationType } : {}
    });
    assertImMpCursorPage(page.pageInfo, "IM inbox");
    return {
      items: page.items.map(toImMpChatInboxItem),
      hasMore: page.pageInfo.hasMore === true,
      ...page.pageInfo.nextCursor ? { nextCursor: page.pageInfo.nextCursor } : {}
    };
  };
  return {
    listPage,
    async loadMore(current) {
      if (!current.hasMore || !current.nextCursor) {
        return current;
      }
      const next = await listPage({ cursor: current.nextCursor });
      return {
        items: mergeImMpChatInboxPages(current.items, next.items),
        hasMore: next.hasMore,
        ...next.nextCursor ? { nextCursor: next.nextCursor } : {}
      };
    }
  };
}
function mergeImMpChatInboxPages(existing, incoming) {
  const seen = new Set(existing.map((item) => item.conversationId));
  const merged = [...existing];
  for (const item of incoming) {
    if (seen.has(item.conversationId)) {
      continue;
    }
    seen.add(item.conversationId);
    merged.push(item);
  }
  return merged;
}

// packages/sdkwork-im-mp-chat/src/services/chatConversationService.ts
function createImMpChatConversationService(resolveClient) {
  return {
    async loadSummary(conversationId) {
      requireImMpConversationId(conversationId);
      const summary = await resolveClient().conversations.getSummary(conversationId);
      return toImMpChatConversationSummary(summary);
    },
    async listMessages(conversationId, options = {}) {
      requireImMpConversationId(conversationId);
      const page = await resolveClient().conversations.listMessages(conversationId, {
        pageSize: resolveImMpPageSize(options.pageSize),
        ...options.cursor ? { cursor: options.cursor } : {}
      });
      assertImMpCursorPage(page.pageInfo, "IM message history");
      return {
        items: page.items.map(toImMpChatMessageItem).reverse(),
        hasMore: page.pageInfo.hasMore === true,
        ...page.pageInfo.nextCursor ? { nextCursor: page.pageInfo.nextCursor } : {},
        highWatermark: page.highWatermark
      };
    },
    async sendText(conversationId, text) {
      requireImMpConversationId(conversationId);
      const body = text.trim();
      if (!body) {
        throw new Error("A chat message must contain text.");
      }
      const result = await resolveClient().conversations.postText(conversationId, body);
      return {
        messageId: result.messageId,
        messageSeq: result.messageSeq,
        deliveryStatus: result.deliveryStatus
      };
    },
    async createGroup(input) {
      var _a;
      const groupName = input.groupName.trim();
      if (!groupName) {
        throw new Error("A group conversation requires a group name.");
      }
      const memberUserIds = ((_a = input.memberUserIds) != null ? _a : []).map((id) => id.trim()).filter((id) => id.length > 0);
      const created = await resolveClient().conversations.create({
        conversationType: IM_MP_GROUP_CONVERSATION_TYPE,
        groupName,
        ...memberUserIds.length > 0 ? { memberUserIds } : {},
        ...input.initializeKnowledgebase === true ? { initializeKnowledgebase: true } : {}
      });
      return {
        conversationId: created.conversationId,
        eventId: created.eventId,
        ...created.deliveryStatus ? { deliveryStatus: created.deliveryStatus } : {},
        ...created.knowledgebaseInitialization ? { knowledgebaseInitialization: created.knowledgebaseInitialization } : {}
      };
    }
  };
}
var IM_MP_GROUP_CONVERSATION_TYPE = "group";
function requireImMpConversationId(conversationId) {
  if (!conversationId.trim()) {
    throw new Error("A conversation id is required.");
  }
}
function prependImMpChatMessages(existing, older) {
  const seen = new Set(existing.map((item) => item.messageId));
  const prefix = older.filter((item) => !seen.has(item.messageId));
  return prefix.length > 0 ? [...prefix, ...existing] : existing;
}

// packages/sdkwork-im-mp-chat/src/state/chatInboxStore.ts
var initialImMpChatInboxState = {
  status: "loading",
  items: [],
  hasMore: false,
  loadingMore: false
};
function createImMpChatInboxStore(service) {
  const store = createImMpObservableStore(initialImMpChatInboxState);
  return {
    ...store,
    async refresh(options = {}) {
      store.setState({ status: "loading", errorMessage: void 0 });
      try {
        const page = await service.listPage({ q: options.q });
        store.replaceState({
          status: resolveImMpScreenStatus(page.items.length, false),
          items: page.items,
          hasMore: page.hasMore,
          ...page.nextCursor ? { nextCursor: page.nextCursor } : {},
          loadingMore: false
        });
      } catch (error) {
        store.replaceState({
          status: "error",
          items: [],
          hasMore: false,
          loadingMore: false,
          errorMessage: resolveImMpErrorMessage(error)
        });
      }
    },
    async loadMore() {
      const state = store.getState();
      if (state.loadingMore || !state.hasMore || !state.nextCursor) {
        return;
      }
      store.setState({ loadingMore: true });
      try {
        const page = await service.listPage({ cursor: state.nextCursor });
        const items = mergeImMpChatInboxPages(state.items, page.items);
        store.replaceState({
          status: resolveImMpScreenStatus(items.length, false),
          items,
          hasMore: page.hasMore,
          ...page.nextCursor ? { nextCursor: page.nextCursor } : {},
          loadingMore: false
        });
      } catch (error) {
        store.setState({ loadingMore: false, errorMessage: resolveImMpErrorMessage(error) });
      }
    },
    reset() {
      store.replaceState(initialImMpChatInboxState);
    }
  };
}
function resolveImMpErrorMessage(error) {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  const text = typeof error === "string" ? error.trim() : "";
  return text || "unknown-error";
}

// packages/sdkwork-im-mp-chat/src/state/chatConversationStore.ts
var initialImMpChatConversationState = {
  status: "loading",
  conversationId: "",
  title: "",
  messages: [],
  hasMore: false,
  loadingEarlier: false,
  sending: false
};
function createImMpChatConversationStore(service, resolveCachedTitle) {
  const store = createImMpObservableStore(
    initialImMpChatConversationState
  );
  const resolveTitle = (conversationId, fallback) => {
    var _a, _b;
    return (_b = (_a = resolveCachedTitle == null ? void 0 : resolveCachedTitle(conversationId)) != null ? _a : fallback == null ? void 0 : fallback.trim()) != null ? _b : conversationId;
  };
  return {
    ...store,
    async load(input) {
      const conversationId = input.conversationId.trim();
      if (!conversationId) {
        throw new Error("A conversation id is required.");
      }
      store.replaceState({
        ...initialImMpChatConversationState,
        conversationId,
        title: resolveTitle(conversationId, input.fallbackTitle)
      });
      try {
        const [summary, page] = await Promise.all([
          service.loadSummary(conversationId),
          service.listMessages(conversationId)
        ]);
        store.replaceState({
          status: resolveImMpScreenStatus(page.items.length, false),
          conversationId,
          title: resolveTitle(conversationId, input.fallbackTitle),
          summary,
          messages: page.items,
          hasMore: page.hasMore,
          ...page.nextCursor ? { nextCursor: page.nextCursor } : {},
          highWatermark: page.highWatermark,
          loadingEarlier: false,
          sending: false
        });
      } catch (error) {
        store.replaceState({
          status: "error",
          conversationId,
          title: resolveTitle(conversationId, input.fallbackTitle),
          messages: [],
          hasMore: false,
          loadingEarlier: false,
          sending: false,
          errorMessage: resolveImMpErrorMessage(error)
        });
      }
    },
    async loadEarlier() {
      const state = store.getState();
      if (state.loadingEarlier || !state.hasMore || !state.nextCursor) {
        return;
      }
      store.setState({ loadingEarlier: true });
      try {
        const page = await service.listMessages(state.conversationId, {
          cursor: state.nextCursor
        });
        const messages = prependImMpChatMessages(state.messages, page.items);
        store.replaceState({
          ...state,
          status: resolveImMpScreenStatus(messages.length, false),
          messages,
          hasMore: page.hasMore,
          ...page.nextCursor ? { nextCursor: page.nextCursor } : {},
          highWatermark: page.highWatermark,
          loadingEarlier: false
        });
      } catch (error) {
        store.setState({
          loadingEarlier: false,
          errorMessage: resolveImMpErrorMessage(error)
        });
      }
    },
    async sendText(text) {
      const body = text.trim();
      if (!body) {
        return;
      }
      const state = store.getState();
      store.setState({ sending: true });
      try {
        const result = await service.sendText(state.conversationId, body);
        const current = store.getState();
        const alreadyPresent = current.messages.some(
          (message) => message.messageId === result.messageId
        );
        store.replaceState({
          ...current,
          sending: false,
          messages: alreadyPresent ? current.messages : [
            ...current.messages,
            {
              messageId: result.messageId,
              senderId: "",
              text: body,
              occurredAt: (/* @__PURE__ */ new Date()).toISOString(),
              messageSeq: result.messageSeq
            }
          ]
        });
      } catch (error) {
        store.setState({ sending: false, errorMessage: resolveImMpErrorMessage(error) });
        throw error;
      }
    },
    reset() {
      store.replaceState(initialImMpChatConversationState);
    }
  };
}

// packages/sdkwork-im-mp-chat/src/routes/routeContributions.ts
var IM_MP_CHAT_SUBPACKAGE = "package-chat";
var IM_MP_CHAT_ROUTE_IDS = {
  inbox: "app.communication.chat.inbox",
  conversation: "app.communication.chat.conversation",
  createGroup: "app.communication.chat.create-group"
};
var imMpChatRouteContributions = [
  {
    id: IM_MP_CHAT_ROUTE_IDS.inbox,
    surface: "app",
    moduleId: "chat",
    domain: "communication",
    capability: "chat",
    screen: "inbox",
    titleKey: "common.tabs.chat",
    auth: "required",
    layoutGroup: "main",
    miniProgram: { rootPackage: true, pagePath: "pages/inbox/index" }
  },
  {
    id: IM_MP_CHAT_ROUTE_IDS.conversation,
    surface: "app",
    moduleId: "chat",
    domain: "communication",
    capability: "chat",
    screen: "conversation",
    titleKey: "chat.conversation.title",
    auth: "required",
    layoutGroup: "stack",
    miniProgram: {
      subpackage: IM_MP_CHAT_SUBPACKAGE,
      pagePath: `${IM_MP_CHAT_SUBPACKAGE}/pages/conversation/index`,
      preload: true
    }
  },
  {
    id: IM_MP_CHAT_ROUTE_IDS.createGroup,
    surface: "app",
    moduleId: "chat",
    domain: "communication",
    capability: "chat",
    screen: "create-group",
    titleKey: "chat.create_group.title",
    auth: "required",
    layoutGroup: "stack",
    miniProgram: {
      subpackage: IM_MP_CHAT_SUBPACKAGE,
      pagePath: `${IM_MP_CHAT_SUBPACKAGE}/pages/create-group/index`
    }
  }
];
var IM_MP_CHAT_QUERY_PARAMS = {
  conversationId: "conversationId",
  conversationTitle: "title"
};

// packages/sdkwork-im-mp-chat/src/i18n/zh-CN/communication/chat/inbox.ts
var imMpChatInboxMessages = {
  "common.tabs.chat": "\u6D88\u606F",
  "chat.inbox.title": "\u6D88\u606F",
  "chat.inbox.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "chat.inbox.empty": "\u6682\u65E0\u4F1A\u8BDD",
  "chat.inbox.load_failed": "\u52A0\u8F7D\u5931\u8D25",
  "chat.inbox.retry": "\u91CD\u8BD5",
  "chat.inbox.load_more": "\u52A0\u8F7D\u66F4\u591A",
  "chat.inbox.loading_more": "\u6B63\u5728\u52A0\u8F7D\u2026",
  "chat.inbox.no_more": "\u6CA1\u6709\u66F4\u591A\u4F1A\u8BDD\u4E86",
  "chat.inbox.unread_badge": "{{count}}",
  "chat.inbox.create_group": "\u53D1\u8D77\u7FA4\u804A"
};

// packages/sdkwork-im-mp-chat/src/i18n/zh-CN/communication/chat/conversation.ts
var imMpChatConversationMessages = {
  "chat.conversation.title": "\u804A\u5929",
  "chat.conversation.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "chat.conversation.empty": "\u8FD8\u6CA1\u6709\u6D88\u606F",
  "chat.conversation.load_failed": "\u52A0\u8F7D\u5931\u8D25",
  "chat.conversation.retry": "\u91CD\u8BD5",
  "chat.conversation.load_earlier": "\u52A0\u8F7D\u66F4\u65E9\u7684\u6D88\u606F",
  "chat.conversation.no_more": "\u6CA1\u6709\u66F4\u65E9\u7684\u6D88\u606F\u4E86",
  "chat.conversation.input_placeholder": "\u8F93\u5165\u6D88\u606F",
  "chat.conversation.send": "\u53D1\u9001",
  "chat.conversation.sending": "\u53D1\u9001\u4E2D\u2026",
  "chat.conversation.send_failed": "\u53D1\u9001\u5931\u8D25",
  "chat.conversation.empty_input": "\u8BF7\u8F93\u5165\u6D88\u606F\u5185\u5BB9"
};

// packages/sdkwork-im-mp-chat/src/i18n/zh-CN/communication/chat/create-group.ts
var imMpChatCreateGroupMessages = {
  "chat.create_group.title": "\u53D1\u8D77\u7FA4\u804A",
  "chat.create_group.name_label": "\u7FA4\u540D\u79F0",
  "chat.create_group.name_placeholder": "\u8BF7\u8F93\u5165\u7FA4\u540D\u79F0",
  "chat.create_group.members_label": "\u7FA4\u6210\u5458",
  "chat.create_group.members_placeholder": "\u8BF7\u8F93\u5165\u6210\u5458\u7528\u6237 ID\uFF0C\u9017\u53F7\u5206\u9694",
  "chat.create_group.submit": "\u521B\u5EFA",
  "chat.create_group.submitting": "\u521B\u5EFA\u4E2D\u2026",
  "chat.create_group.name_required": "\u8BF7\u8F93\u5165\u7FA4\u540D\u79F0",
  "chat.create_group.failed": "\u521B\u5EFA\u5931\u8D25"
};

// packages/sdkwork-im-mp-chat/src/i18n/en-US/communication/chat/inbox.ts
var imMpChatInboxMessages2 = {
  "common.tabs.chat": "Chats",
  "chat.inbox.title": "Chats",
  "chat.inbox.loading": "Loading\u2026",
  "chat.inbox.empty": "No conversations yet",
  "chat.inbox.load_failed": "Failed to load",
  "chat.inbox.retry": "Retry",
  "chat.inbox.load_more": "Load more",
  "chat.inbox.loading_more": "Loading\u2026",
  "chat.inbox.no_more": "No more conversations",
  "chat.inbox.unread_badge": "{{count}}",
  "chat.inbox.create_group": "New group chat"
};

// packages/sdkwork-im-mp-chat/src/i18n/en-US/communication/chat/conversation.ts
var imMpChatConversationMessages2 = {
  "chat.conversation.title": "Chat",
  "chat.conversation.loading": "Loading\u2026",
  "chat.conversation.empty": "No messages yet",
  "chat.conversation.load_failed": "Failed to load",
  "chat.conversation.retry": "Retry",
  "chat.conversation.load_earlier": "Load earlier messages",
  "chat.conversation.no_more": "No earlier messages",
  "chat.conversation.input_placeholder": "Type a message",
  "chat.conversation.send": "Send",
  "chat.conversation.sending": "Sending\u2026",
  "chat.conversation.send_failed": "Failed to send",
  "chat.conversation.empty_input": "Enter a message first"
};

// packages/sdkwork-im-mp-chat/src/i18n/en-US/communication/chat/create-group.ts
var imMpChatCreateGroupMessages2 = {
  "chat.create_group.title": "New group chat",
  "chat.create_group.name_label": "Group name",
  "chat.create_group.name_placeholder": "Enter a group name",
  "chat.create_group.members_label": "Members",
  "chat.create_group.members_placeholder": "Comma-separated member user ids",
  "chat.create_group.submit": "Create",
  "chat.create_group.submitting": "Creating\u2026",
  "chat.create_group.name_required": "Enter a group name",
  "chat.create_group.failed": "Failed to create"
};

// packages/sdkwork-im-mp-chat/src/i18n/index.ts
var imMpChatMessages = {
  "zh-CN": mergeImMpFragments([
    imMpChatInboxMessages,
    imMpChatConversationMessages,
    imMpChatCreateGroupMessages
  ]),
  "en-US": mergeImMpFragments([
    imMpChatInboxMessages2,
    imMpChatConversationMessages2,
    imMpChatCreateGroupMessages2
  ])
};
function listImMpChatMessageKeys(locale) {
  return Object.keys(imMpChatMessages[locale]).sort();
}
function resolveImMpChatMessage(locale, key, fallback = key) {
  return pickImMpMessage(imMpChatMessages[normalizeImMpLocale(locale)], key, fallback);
}
function formatImMpChatMessage(template, params = {}) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/gu, (match, name) => {
    const value = params[name];
    return value === void 0 ? match : String(value);
  });
}

// src/bootstrap/environment.ts
var IM_MP_DEPLOYMENT_PROFILES = [
  "standalone",
  "cloud"
];
var IM_MP_ENVIRONMENTS = [
  "development",
  "test",
  "staging",
  "demo",
  "production"
];
var IM_MP_RUNTIME_TARGET = "mini-program";
var DEFAULT_APP_KEY = "sdkwork-im-mini-program";
var DEFAULT_LOCALE = "zh-CN";
var envSource = null;
var hostLanguage;
var cachedEnvironment = null;
function configureImMpRuntimeEnvSource(source, options = {}) {
  var _a;
  envSource = source;
  hostLanguage = ((_a = options.hostLanguage) == null ? void 0 : _a.trim()) || void 0;
  cachedEnvironment = null;
}
function readEnv(key) {
  const value = envSource == null ? void 0 : envSource[key];
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : void 0;
}
function readIdentity(sharedKey, prefixedKey) {
  var _a;
  return (_a = readEnv(sharedKey)) != null ? _a : readEnv(prefixedKey);
}
function validateImMpRuntimeIdentity(source = envSource != null ? envSource : {}) {
  var _a, _b, _c, _d;
  const issues = [];
  const profile = (_a = source.SDKWORK_DEPLOYMENT_PROFILE) != null ? _a : source.SDKWORK_IM_DEPLOYMENT_PROFILE;
  const environment = (_b = source.SDKWORK_ENVIRONMENT) != null ? _b : source.SDKWORK_IM_ENVIRONMENT;
  const profileId = (_c = source.SDKWORK_PROFILE_ID) != null ? _c : source.SDKWORK_IM_PROFILE_ID;
  const runtimeTarget = (_d = source.SDKWORK_RUNTIME_TARGET) != null ? _d : source.SDKWORK_IM_RUNTIME_TARGET;
  if (!profile || !IM_MP_DEPLOYMENT_PROFILES.includes(profile)) {
    issues.push(
      `SDKWORK_DEPLOYMENT_PROFILE must be one of ${IM_MP_DEPLOYMENT_PROFILES.join(", ")}; received ${JSON.stringify(profile != null ? profile : null)}`
    );
  }
  if (!environment || !IM_MP_ENVIRONMENTS.includes(environment)) {
    issues.push(
      `SDKWORK_ENVIRONMENT must be one of ${IM_MP_ENVIRONMENTS.join(", ")}; received ${JSON.stringify(environment != null ? environment : null)}`
    );
  }
  if (!profileId) {
    issues.push("SDKWORK_PROFILE_ID is required");
  } else if (profile && environment && profileId !== `${profile}.${environment}`) {
    issues.push(
      `SDKWORK_PROFILE_ID must be ${profile}.${environment}; received ${JSON.stringify(profileId)}`
    );
  }
  if (runtimeTarget !== IM_MP_RUNTIME_TARGET) {
    issues.push(
      `SDKWORK_RUNTIME_TARGET must be ${IM_MP_RUNTIME_TARGET}; received ${JSON.stringify(runtimeTarget != null ? runtimeTarget : null)}`
    );
  }
  return issues;
}
function requireUrl(value, key) {
  var _a, _b, _c;
  const raw = (_a = value == null ? void 0 : value.trim()) != null ? _a : "";
  const primary = (_c = (_b = raw.split(/[;,]/u)[0]) == null ? void 0 : _b.trim().replace(/\/+$/u, "")) != null ? _c : "";
  if (!/^https?:\/\//u.test(primary)) {
    throw new Error(`${key} must be an absolute http(s) URL; received ${JSON.stringify(value != null ? value : null)}`);
  }
  return primary;
}
function resolveImMpRuntimeEnvironment() {
  var _a, _b, _c, _d;
  if (cachedEnvironment) {
    return cachedEnvironment;
  }
  const issues = validateImMpRuntimeIdentity();
  if (issues.length > 0) {
    throw new Error(`IM mini program runtime identity is invalid: ${issues.join("; ")}`);
  }
  const deploymentProfile = readIdentity(
    "SDKWORK_DEPLOYMENT_PROFILE",
    "SDKWORK_IM_DEPLOYMENT_PROFILE"
  );
  const environment = readIdentity(
    "SDKWORK_ENVIRONMENT",
    "SDKWORK_IM_ENVIRONMENT"
  );
  const profileId = readIdentity("SDKWORK_PROFILE_ID", "SDKWORK_IM_PROFILE_ID");
  const platformGatewayApiBaseUrl = readEnv("SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL");
  const imApiBaseUrl = requireUrl(
    readIdentity("SDKWORK_IM_API_BASE_URL", "SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL"),
    "SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL"
  );
  if (deploymentProfile === "cloud" && !platformGatewayApiBaseUrl) {
    throw new Error(
      "Cloud mini program requires SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL for dependency App SDK routing"
    );
  }
  const surfaceCode = readEnv("SDKWORK_IM_IAM_MINI_PROGRAM_SURFACE_CODE");
  cachedEnvironment = {
    appKey: (_a = readEnv("SDKWORK_APP_KEY")) != null ? _a : DEFAULT_APP_KEY,
    deploymentProfile,
    environment,
    profileId,
    runtimeTarget: IM_MP_RUNTIME_TARGET,
    imApiBaseUrl,
    imWebsocketBaseUrl: (_b = readEnv("SDKWORK_IM_APPLICATION_PUBLIC_WEBSOCKET_URL")) != null ? _b : imApiBaseUrl.replace(/^http/u, "ws"),
    platformGatewayApiBaseUrl: platformGatewayApiBaseUrl ? requireUrl(platformGatewayApiBaseUrl, "SDKWORK_IM_PLATFORM_API_GATEWAY_HTTP_URL") : imApiBaseUrl,
    iamApiBaseUrl: requireUrl(
      (_d = (_c = readEnv("SDKWORK_IAM_APP_API_BASE_URL")) != null ? _c : platformGatewayApiBaseUrl) != null ? _d : imApiBaseUrl,
      "SDKWORK_IAM_APP_API_BASE_URL"
    ),
    ...surfaceCode ? { iamMiniProgramSurfaceCode: surfaceCode } : {},
    ...hostLanguage ? { hostLanguage } : {},
    defaultLocale: DEFAULT_LOCALE
  };
  return cachedEnvironment;
}
function getImMpRuntimeEnvironment() {
  return cachedEnvironment != null ? cachedEnvironment : resolveImMpRuntimeEnvironment();
}

// packages/sdkwork-im-mp-host/src/weixin/storage.ts
function readWeixinStorageApi() {
  const candidate = globalThis.wx;
  if (!candidate || typeof candidate.getStorageSync !== "function" || typeof candidate.setStorageSync !== "function" || typeof candidate.removeStorageSync !== "function") {
    throw new Error("WeChat mini program synchronous storage is unavailable");
  }
  return candidate;
}
function createWeixinSessionStorage(storage) {
  return {
    read(key) {
      try {
        const value = storage.getStorageSync(key);
        return typeof value === "string" && value.length > 0 ? value : null;
      } catch {
        return null;
      }
    },
    write(key, value) {
      storage.setStorageSync(key, value);
    },
    remove(key) {
      try {
        storage.removeStorageSync(key);
      } catch {
      }
    }
  };
}
function createWeixinSessionStorageFromGlobal() {
  return createWeixinSessionStorage(readWeixinStorageApi());
}

// packages/sdkwork-im-mp-host/src/weixin/fetch.ts
function normalizeHeaders(headers) {
  if (!headers) {
    return {};
  }
  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    const normalized = {};
    headers.forEach((value, key) => {
      normalized[key] = value;
    });
    return normalized;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return { ...headers };
}
function createFetchResponse(statusCode, data, header) {
  const headerMap = new Map(
    Object.entries(header).map(([key, value]) => [key.toLowerCase(), value])
  );
  const response = {
    ok: statusCode >= 200 && statusCode < 300,
    status: statusCode,
    headers: {
      get(name) {
        var _a;
        return (_a = headerMap.get(name.toLowerCase())) != null ? _a : null;
      }
    },
    async json() {
      return typeof data === "string" ? JSON.parse(data) : data;
    },
    async text() {
      return typeof data === "string" ? data : JSON.stringify(data);
    }
  };
  return response;
}
function normalizeWxRequestBody(body) {
  if (body === null || body === void 0) {
    return void 0;
  }
  return body;
}
function createWeixinFetch(request) {
  return (async (input, init = {}) => {
    var _a, _b;
    const url = typeof input === "string" ? input : String(input);
    const method = ((_a = init.method) != null ? _a : "GET").toUpperCase();
    const headers = normalizeHeaders(init.headers);
    const data = normalizeWxRequestBody((_b = init.body) != null ? _b : null);
    if (data !== void 0 && !headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
    return await new Promise((resolve2, reject) => {
      const task = request({
        url,
        method,
        header: headers,
        data,
        success(result) {
          var _a2;
          resolve2(createFetchResponse(result.statusCode, result.data, (_a2 = result.header) != null ? _a2 : {}));
        },
        fail(result) {
          var _a2;
          reject(new Error((_a2 = result.errMsg) != null ? _a2 : "wx.request failed"));
        }
      });
      const signal = init.signal;
      if (!signal) {
        return;
      }
      if (signal.aborted) {
        task.abort();
        reject(new Error("Request was cancelled"));
        return;
      }
      signal.addEventListener(
        "abort",
        () => {
          task.abort();
          reject(new Error("Request was cancelled"));
        },
        { once: true }
      );
    });
  });
}
function readWeixinRequestApi() {
  const candidate = globalThis.wx;
  if (!candidate || typeof candidate.request !== "function") {
    throw new Error("WeChat wx.request is unavailable");
  }
  return candidate;
}
function installWeixinFetch() {
  if (typeof globalThis.fetch === "function") {
    return false;
  }
  const request = readWeixinRequestApi();
  globalThis.fetch = createWeixinFetch(request.request);
  return true;
}

// packages/sdkwork-im-mp-host/src/weixin/socket.ts
var SOCKET_CONNECTING = 0;
var SOCKET_OPEN = 1;
var SOCKET_CLOSING = 2;
var SOCKET_CLOSED = 3;
function createWeixinSocketAdapter(task, diagnostics) {
  const openHandlers = /* @__PURE__ */ new Set();
  const closeHandlers = /* @__PURE__ */ new Set();
  const errorHandlers = /* @__PURE__ */ new Set();
  const messageHandlers = /* @__PURE__ */ new Set();
  let readyState = SOCKET_CONNECTING;
  let closeDispatched = false;
  task.onOpen(() => {
    readyState = SOCKET_OPEN;
    for (const handler of [...openHandlers]) {
      handler({ type: "open" });
    }
  });
  task.onMessage((result) => {
    if (readyState !== SOCKET_OPEN) {
      return;
    }
    for (const handler of [...messageHandlers]) {
      handler({ data: result.data });
    }
  });
  task.onError((result) => {
    const message = result.errMsg || "wx.connectSocket failed";
    if (diagnostics) {
      diagnostics.lastError = message;
    }
    for (const handler of [...errorHandlers]) {
      handler(new Error(message));
    }
  });
  task.onClose((result) => {
    readyState = SOCKET_CLOSED;
    if (closeDispatched) {
      return;
    }
    closeDispatched = true;
    for (const handler of [...closeHandlers]) {
      handler({
        code: result.code,
        reason: result.reason,
        wasClean: result.code === 1e3
      });
    }
  });
  return {
    get readyState() {
      return readyState;
    },
    addEventListener(type, handler) {
      if (type === "open") {
        openHandlers.add(handler);
        if (readyState === SOCKET_OPEN) {
          handler({ type: "open" });
        }
        return;
      }
      if (type === "message") {
        messageHandlers.add(handler);
        return;
      }
      if (type === "error") {
        errorHandlers.add(handler);
        return;
      }
      closeHandlers.add(handler);
      if (readyState === SOCKET_CLOSED) {
        handler({ code: 1e3, reason: "socket_already_closed", wasClean: true });
      }
    },
    close(code, reason) {
      if (readyState === SOCKET_CLOSED || readyState === SOCKET_CLOSING) {
        return;
      }
      readyState = SOCKET_CLOSING;
      const options = {};
      if (typeof code === "number") {
        options.code = code;
      }
      if (typeof reason === "string") {
        options.reason = reason;
      }
      task.close(Object.keys(options).length > 0 ? options : void 0);
    },
    send(value) {
      if (readyState !== SOCKET_OPEN) {
        throw new Error("Cannot send on a WeChat socket that is not open");
      }
      task.send({ data: value });
    }
  };
}
function createWeixinSocketFactory(socket, diagnostics = { opened: 0 }) {
  return (url, options) => {
    const connectOptions = { url };
    if (Object.keys(options.headers).length > 0) {
      connectOptions.header = options.headers;
    }
    if (options.protocols.length > 0) {
      connectOptions.protocols = options.protocols;
    }
    const task = socket.connectSocket(connectOptions);
    diagnostics.opened += 1;
    return createWeixinSocketAdapter(task, diagnostics);
  };
}
function readWeixinSocketApi() {
  const candidate = globalThis.wx;
  if (!candidate || typeof candidate.connectSocket !== "function") {
    throw new Error("WeChat wx.connectSocket is unavailable");
  }
  return candidate;
}

// packages/sdkwork-im-mp-host/src/weixin/navigation.ts
var DEFAULT_TOAST_DURATION_MS = 2e3;
function createWeixinNavigationAdapter(navigation, feedback = {}) {
  return {
    navigateTo: (pagePath, query) => navigation.navigateTo({ url: toNavigationUrl(pagePath, query) }),
    redirectTo: (pagePath, query) => navigation.redirectTo({ url: toNavigationUrl(pagePath, query) }),
    switchTab: (pagePath) => navigation.switchTab({ url: toNavigationUrl(pagePath) }),
    reLaunch: (pagePath, query) => navigation.reLaunch({ url: toNavigationUrl(pagePath, query) }),
    setTabBarItem: (index, item) => navigation.setTabBarItem({ index, text: item.text }),
    setNavigationBarTitle: (title) => navigation.setNavigationBarTitle({ title }),
    showToast: (title, icon = "none") => {
      var _a;
      (_a = feedback.showToast) == null ? void 0 : _a.call(feedback, { title, icon, duration: DEFAULT_TOAST_DURATION_MS });
    }
  };
}
function readWeixinNavigationApi() {
  const candidate = globalThis.wx;
  if (!candidate || typeof candidate.navigateTo !== "function") {
    throw new Error("WeChat navigation API is unavailable");
  }
  return candidate;
}
function createWeixinNavigationAdapterFromGlobal() {
  var _a;
  return createWeixinNavigationAdapter(
    readWeixinNavigationApi(),
    (_a = globalThis.wx) != null ? _a : {}
  );
}
function toNavigationUrl(pagePath, query) {
  const normalized = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  if (!query) {
    return normalized;
  }
  const params = Object.entries(query).filter(([, value]) => typeof value === "string" && value.length > 0).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  return params.length > 0 ? `${normalized}?${params.join("&")}` : normalized;
}
function readWeixinLanguage(locale) {
  var _a, _b;
  const fromAppBaseInfo = (_a = locale.getAppBaseInfo) == null ? void 0 : _a.call(locale).language;
  if (typeof fromAppBaseInfo === "string" && fromAppBaseInfo.trim().length > 0) {
    return fromAppBaseInfo.trim();
  }
  const fromSystemInfo = (_b = locale.getSystemInfoSync) == null ? void 0 : _b.call(locale).language;
  if (typeof fromSystemInfo === "string" && fromSystemInfo.trim().length > 0) {
    return fromSystemInfo.trim();
  }
  return void 0;
}
function readWeixinLanguageFromGlobal() {
  var _a;
  return readWeixinLanguage((_a = globalThis.wx) != null ? _a : {});
}

// packages/sdkwork-im-mp-host/src/weixin/login.ts
var DEFAULT_LOGIN_TIMEOUT_MS = 1e4;
function createWeixinLoginCodeProvider(login, timeoutMs = DEFAULT_LOGIN_TIMEOUT_MS) {
  return {
    async requestLoginCode() {
      return await new Promise((resolve2, reject) => {
        login({
          timeout: timeoutMs,
          success(result) {
            var _a;
            const code = typeof result.code === "string" ? result.code.trim() : "";
            if (code) {
              resolve2(code);
              return;
            }
            reject(new Error((_a = result.errMsg) != null ? _a : "wx.login returned no code"));
          },
          fail(result) {
            var _a;
            reject(new Error((_a = result.errMsg) != null ? _a : "wx.login failed"));
          }
        });
      });
    }
  };
}
function readWeixinLoginApi() {
  const candidate = globalThis.wx;
  if (!candidate || typeof candidate.login !== "function") {
    throw new Error("WeChat wx.login is unavailable");
  }
  return candidate;
}
function createWeixinLoginCodeProviderFromGlobal() {
  return createWeixinLoginCodeProvider(readWeixinLoginApi().login);
}

// packages/sdkwork-im-mp-core/src/session/session.ts
var IM_MP_SESSION_KEY = "sdkwork-im-mp:session:v1";
var currentSession = null;
var injectedStorage = null;
function configureImMpSessionStorage(storage) {
  injectedStorage = storage;
}
function normalizeOptionalString(value) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeImMpSession(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const record = value;
  const accessToken = normalizeOptionalString(record.accessToken);
  const authToken = normalizeOptionalString(record.authToken);
  if (!accessToken || !authToken) {
    return null;
  }
  const refreshToken = normalizeOptionalString(record.refreshToken);
  const expiresAt = normalizeOptionalString(record.expiresAt);
  const sessionId = normalizeOptionalString(record.sessionId);
  const tenantId = normalizeOptionalString(record.tenantId);
  const organizationId = normalizeOptionalString(record.organizationId);
  const user = record.user && typeof record.user === "object" && !Array.isArray(record.user) ? record.user : void 0;
  return {
    accessToken,
    authToken,
    ...refreshToken ? { refreshToken } : {},
    ...expiresAt ? { expiresAt } : {},
    ...sessionId ? { sessionId } : {},
    ...tenantId ? { tenantId } : {},
    ...organizationId ? { organizationId } : {},
    ...user ? { user } : {}
  };
}
function isImMpSessionComplete(session) {
  return Boolean(
    normalizeOptionalString(session == null ? void 0 : session.accessToken) && normalizeOptionalString(session == null ? void 0 : session.authToken)
  );
}
function readImMpSession() {
  if (currentSession) {
    return currentSession;
  }
  if (!injectedStorage) {
    return null;
  }
  let raw = null;
  try {
    raw = injectedStorage.read(IM_MP_SESSION_KEY);
  } catch {
    return null;
  }
  if (!raw) {
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const session = normalizeImMpSession(parsed);
  if (session) {
    currentSession = session;
  }
  return session;
}
function writeImMpSession(session) {
  currentSession = session;
  if (!injectedStorage) {
    return;
  }
  try {
    if (!session) {
      injectedStorage.remove(IM_MP_SESSION_KEY);
      return;
    }
    injectedStorage.write(IM_MP_SESSION_KEY, JSON.stringify(session));
  } catch {
  }
}
function commitImMpSession(value) {
  const session = normalizeImMpSession(value);
  if (!session) {
    throw new Error("A complete IAM dual-token session is required.");
  }
  writeImMpSession(session);
  return session;
}
function clearImMpSession() {
  writeImMpSession(null);
}
function resolveImMpAccessToken(session) {
  return normalizeOptionalString(session == null ? void 0 : session.accessToken);
}
function resolveImMpAuthToken(session) {
  return normalizeOptionalString(session == null ? void 0 : session.authToken);
}

// src/bootstrap/hostAdapters.ts
var registered = null;
function registerImMpHostAdapters() {
  if (registered) {
    return registered;
  }
  const fetchInstalled = installWeixinFetch();
  configureImMpSessionStorage(createWeixinSessionStorageFromGlobal());
  const socketDiagnostics = { opened: 0 };
  const socketFactory = createWeixinSocketFactory(readWeixinSocketApi(), socketDiagnostics);
  const hostLanguage2 = readWeixinLanguageFromGlobal();
  registered = {
    navigation: createWeixinNavigationAdapterFromGlobal(),
    socketFactory,
    socketDiagnostics,
    fetchInstalled,
    ...hostLanguage2 ? { hostLanguage: hostLanguage2 } : {}
  };
  return registered;
}
function getImMpHostAdapters() {
  if (!registered) {
    throw new Error("Mini program host adapters must be registered before use");
  }
  return registered;
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/core/types.js
var DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1e3,
  retryBackoff: "exponential",
  maxRetryDelay: 3e4
};
var DEFAULT_CACHE_CONFIG = {
  enabled: false,
  ttl: 3e5,
  maxSize: 100
};
var SUCCESS_CODES = [
  0,
  200,
  2e3,
  "0",
  "200",
  "2000"
];
var HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};
var MIME_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
  OCTET_STREAM: "application/octet-stream",
  TEXT_PLAIN: "text/plain",
  TEXT_HTML: "text/html"
};

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/auth/token-manager.js
var DefaultAuthTokenManager = class {
  constructor(initialTokens, events) {
    __publicField(this, "tokens", {});
    __publicField(this, "events");
    if (initialTokens) {
      this.tokens = { ...initialTokens };
      if (initialTokens.expiresIn && !initialTokens.expiresAt) this.tokens.expiresAt = Date.now() + initialTokens.expiresIn * 1e3;
    }
    this.events = events;
  }
  getAccessToken() {
    return this.tokens.accessToken;
  }
  getAuthToken() {
    return this.tokens.authToken;
  }
  getRefreshToken() {
    return this.tokens.refreshToken;
  }
  getTokens() {
    return { ...this.tokens };
  }
  setTokens(tokens) {
    var _a, _b;
    this.tokens = { ...tokens };
    if (tokens.expiresIn && !tokens.expiresAt) this.tokens.expiresAt = Date.now() + tokens.expiresIn * 1e3;
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenSet) == null ? void 0 : _b.call(_a, this.tokens);
  }
  setAccessToken(token) {
    var _a, _b;
    this.tokens.accessToken = token;
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenSet) == null ? void 0 : _b.call(_a, this.tokens);
  }
  setAuthToken(token) {
    var _a, _b;
    this.tokens.authToken = token;
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenSet) == null ? void 0 : _b.call(_a, this.tokens);
  }
  setRefreshToken(token) {
    this.tokens.refreshToken = token;
  }
  clearTokens() {
    var _a, _b;
    this.tokens = {};
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenCleared) == null ? void 0 : _b.call(_a);
  }
  clearAuthToken() {
    delete this.tokens.authToken;
  }
  clearAccessToken() {
    delete this.tokens.accessToken;
  }
  isExpired() {
    var _a, _b;
    if (!this.tokens.expiresAt) return false;
    const expired = Date.now() >= this.tokens.expiresAt;
    if (expired) (_b = (_a = this.events) == null ? void 0 : _a.onTokenExpired) == null ? void 0 : _b.call(_a);
    return expired;
  }
  isValid() {
    return this.hasToken() && !this.isExpired();
  }
  hasToken() {
    return !!(this.tokens.accessToken || this.tokens.authToken);
  }
  hasAuthToken() {
    return !!this.tokens.authToken;
  }
  hasAccessToken() {
    return !!this.tokens.accessToken;
  }
  willExpireIn(seconds) {
    if (!this.tokens.expiresAt) return false;
    return Date.now() + seconds * 1e3 >= this.tokens.expiresAt;
  }
};
function createTokenManager(tokens, events) {
  return new DefaultAuthTokenManager(tokens, events);
}
function buildAuthHeaders(authMode, apiKey, tokenManager) {
  const headers = {};
  if (authMode === "apikey") {
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  } else if (authMode === "dual-token") {
    if (tokenManager) {
      const accessToken = tokenManager.getAccessToken();
      const authToken = tokenManager.getAuthToken();
      if (accessToken) headers["Access-Token"] = accessToken;
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    }
  }
  return headers;
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/utils/logger.js
var LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};
var ConsoleLogger = class {
  constructor(config = {}) {
    __publicField(this, "level");
    __publicField(this, "prefix");
    __publicField(this, "timestamp");
    __publicField(this, "colors");
    var _a, _b, _c, _d;
    this.level = (_a = config.level) != null ? _a : "info";
    this.prefix = (_b = config.prefix) != null ? _b : "[SDK]";
    this.timestamp = (_c = config.timestamp) != null ? _c : true;
    this.colors = (_d = config.colors) != null ? _d : true;
  }
  formatMessage(level, message) {
    const parts = [];
    if (this.timestamp) parts.push((/* @__PURE__ */ new Date()).toISOString());
    parts.push(this.prefix);
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);
    return parts.join(" ");
  }
  getColorCode(level) {
    if (!this.colors) return "";
    return {
      debug: "\x1B[36m",
      info: "\x1B[32m",
      warn: "\x1B[33m",
      error: "\x1B[31m",
      silent: ""
    }[level];
  }
  getResetCode() {
    return this.colors ? "\x1B[0m" : "";
  }
  log(level, message, ...args) {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) return;
    const formattedMessage = this.formatMessage(level, message);
    const output = `${this.getColorCode(level)}${formattedMessage}${this.getResetCode()}`;
    switch (level) {
      case "debug":
        console.debug(output, ...args);
        break;
      case "info":
        console.info(output, ...args);
        break;
      case "warn":
        console.warn(output, ...args);
        break;
      case "error":
        console.error(output, ...args);
    }
  }
  debug(message, ...args) {
    this.log("debug", message, ...args);
  }
  info(message, ...args) {
    this.log("info", message, ...args);
  }
  warn(message, ...args) {
    this.log("warn", message, ...args);
  }
  error(message, ...args) {
    this.log("error", message, ...args);
  }
  setLevel(level) {
    this.level = level;
  }
};
var noopLogger = {
  debug: () => {
  },
  info: () => {
  },
  warn: () => {
  },
  error: () => {
  },
  log: () => {
  },
  setLevel: () => {
  }
};
function createLogger(config) {
  if ((config == null ? void 0 : config.level) === "silent") return noopLogger;
  return new ConsoleLogger(config);
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/utils/cache.js
var MemoryCacheStore = class {
  constructor(config = {}) {
    __publicField(this, "cache", /* @__PURE__ */ new Map());
    __publicField(this, "maxSize");
    __publicField(this, "defaultTtl");
    var _a, _b;
    this.maxSize = (_a = config.maxSize) != null ? _a : DEFAULT_CACHE_CONFIG.maxSize;
    this.defaultTtl = (_b = config.ttl) != null ? _b : DEFAULT_CACHE_CONFIG.ttl;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }
  set(key, value, ttl) {
    if (this.cache.size >= this.maxSize) this.evictOldest();
    const expiresAt = Date.now() + (ttl != null ? ttl : this.defaultTtl);
    this.cache.set(key, {
      value,
      expiresAt
    });
  }
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Infinity;
    for (const [key, entry] of this.cache) if (entry.expiresAt < oldestTime) {
      oldestTime = entry.expiresAt;
      oldestKey = key;
    }
    if (oldestKey) this.cache.delete(oldestKey);
  }
};
function createCacheStore(config) {
  return new MemoryCacheStore(config);
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/errors.js
var SdkError = class extends Error {
  constructor(message, code = "UNKNOWN", httpStatus, options) {
    var _a, _b;
    super(message, { cause: options == null ? void 0 : options.cause });
    __publicField(this, "code");
    __publicField(this, "httpStatus");
    __publicField(this, "details");
    __publicField(this, "timestamp");
    __publicField(this, "traceId");
    __publicField(this, "problem");
    __publicField(this, "metadata");
    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = options == null ? void 0 : options.details;
    this.timestamp = Date.now();
    this.traceId = (_b = options == null ? void 0 : options.traceId) != null ? _b : (_a = options == null ? void 0 : options.problem) == null ? void 0 : _a.traceId;
    this.problem = options == null ? void 0 : options.problem;
    this.metadata = options == null ? void 0 : options.metadata;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  static fromApiResult(result, httpStatus) {
    const code = String(result.code);
    const message = result.msg || result.message || "Unknown error";
    switch (code) {
      case "400":
      case "4000":
        return new ValidationError(message);
      case "401":
      case "4010":
        return new AuthenticationError(message);
      case "403":
      case "4030":
        return new ForbiddenError(message);
      case "404":
      case "4040":
        return new NotFoundError(message);
      case "409":
      case "4090":
        return new ConflictError(message);
      case "429":
      case "4290":
        return new RateLimitError(message);
      default:
        if (code.startsWith("5")) return new ServerError(message, httpStatus != null ? httpStatus : HTTP_STATUS.INTERNAL_SERVER_ERROR);
        return new BusinessError(message, result.code, result.data);
    }
  }
  static fromHttpStatus(status, message, options) {
    const defaultMessage = message != null ? message : `HTTP Error ${status}`;
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return new ValidationError(defaultMessage, void 0, options);
      case HTTP_STATUS.UNAUTHORIZED:
        return new AuthenticationError(defaultMessage, options);
      case HTTP_STATUS.FORBIDDEN:
        return new ForbiddenError(defaultMessage, options);
      case HTTP_STATUS.NOT_FOUND:
        return new NotFoundError(defaultMessage, options);
      case HTTP_STATUS.METHOD_NOT_ALLOWED:
        return new ValidationError(defaultMessage, void 0, options);
      case HTTP_STATUS.CONFLICT:
        return new ConflictError(defaultMessage, options);
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return new RateLimitError(defaultMessage, void 0, options);
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return new ServerError(defaultMessage, status, options);
      case HTTP_STATUS.BAD_GATEWAY:
        return new BadGatewayError(defaultMessage, options);
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return new ServiceUnavailableError(defaultMessage, options);
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        return new GatewayTimeoutError(defaultMessage, options);
      default:
        if (status >= 500) return new ServerError(defaultMessage, status, options);
        return new NetworkError(defaultMessage, options);
    }
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      httpStatus: this.httpStatus,
      details: this.details,
      timestamp: this.timestamp,
      traceId: this.traceId,
      problem: this.problem,
      metadata: this.metadata
    };
  }
  toString() {
    return `${this.name}: ${this.message} (code: ${this.code})`;
  }
  isRetryable() {
    return isRetryableError(this);
  }
  isAuthError() {
    return this.code === "UNAUTHORIZED" || this.code === "TOKEN_EXPIRED" || this.code === "TOKEN_INVALID";
  }
  isNetworkError() {
    return this.code === "NETWORK_ERROR" || this.code === "TIMEOUT";
  }
  isClientError() {
    return this.httpStatus !== void 0 && this.httpStatus >= 400 && this.httpStatus < 500;
  }
  isServerError() {
    return this.httpStatus !== void 0 && this.httpStatus >= 500;
  }
};
var NetworkError = class extends SdkError {
  constructor(message = "Network error", options) {
    super(message, "NETWORK_ERROR", void 0, options);
  }
};
var TimeoutError = class extends SdkError {
  constructor(message = "Request timeout", timeout, options) {
    super(message, "TIMEOUT", void 0, options);
    __publicField(this, "timeout");
    this.timeout = timeout;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      timeout: this.timeout
    };
  }
};
var CancelledError = class extends SdkError {
  constructor(message = "Request cancelled", options) {
    super(message, "CANCELLED", void 0, options);
  }
};
var AuthenticationError = class extends SdkError {
  constructor(message = "Authentication failed", options) {
    super(message, "UNAUTHORIZED", HTTP_STATUS.UNAUTHORIZED, options);
  }
};
var ForbiddenError = class extends SdkError {
  constructor(message = "Access forbidden", options) {
    super(message, "FORBIDDEN", HTTP_STATUS.FORBIDDEN, options);
  }
};
var NotFoundError = class extends SdkError {
  constructor(message = "Resource not found", options) {
    super(message, "NOT_FOUND", HTTP_STATUS.NOT_FOUND, options);
  }
};
var ValidationError = class extends SdkError {
  constructor(message = "Validation error", details, options) {
    super(message, "VALIDATION_ERROR", HTTP_STATUS.BAD_REQUEST, details === void 0 ? options : {
      ...options,
      details
    });
  }
};
var ConflictError = class extends SdkError {
  constructor(message = "Resource conflict", options) {
    super(message, "CONFLICT", HTTP_STATUS.CONFLICT, options);
  }
};
var RateLimitError = class extends SdkError {
  constructor(message = "Rate limit exceeded", retryAfter, options) {
    super(message, "RATE_LIMIT", HTTP_STATUS.TOO_MANY_REQUESTS, options);
    __publicField(this, "retryAfter");
    this.retryAfter = retryAfter;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter
    };
  }
};
var ServerError = class extends SdkError {
  constructor(message = "Server error", httpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR, options) {
    super(message, "SERVER_ERROR", httpStatus, options);
  }
};
var BadGatewayError = class extends ServerError {
  constructor(message = "Bad gateway", options) {
    super(message, HTTP_STATUS.BAD_GATEWAY, options);
    this.code = "BAD_GATEWAY";
  }
};
var ServiceUnavailableError = class extends ServerError {
  constructor(message = "Service unavailable", options) {
    super(message, HTTP_STATUS.SERVICE_UNAVAILABLE, options);
    this.code = "SERVICE_UNAVAILABLE";
  }
};
var GatewayTimeoutError = class extends ServerError {
  constructor(message = "Gateway timeout", options) {
    super(message, HTTP_STATUS.GATEWAY_TIMEOUT, options);
    this.code = "GATEWAY_TIMEOUT";
  }
};
var BusinessError = class extends SdkError {
  constructor(message, code, data, options) {
    super(message, "BUSINESS_ERROR", void 0, options);
    __publicField(this, "businessCode");
    __publicField(this, "data");
    this.businessCode = code;
    this.data = data;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      businessCode: this.businessCode,
      data: this.data
    };
  }
};
function isRetryableError(error) {
  if (!(error instanceof SdkError)) return false;
  return error instanceof NetworkError || error instanceof TimeoutError || error instanceof ServerError || error instanceof RateLimitError || error instanceof BadGatewayError || error instanceof ServiceUnavailableError || error instanceof GatewayTimeoutError;
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/utils/retry.js
function sleep(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function calculateDelay(attempt, baseDelay, backoff, maxDelay) {
  let delay;
  switch (backoff) {
    case "fixed":
      delay = baseDelay;
      break;
    case "linear":
      delay = baseDelay * attempt;
      break;
    case "exponential":
      delay = baseDelay * Math.pow(2, attempt - 1);
      break;
    default:
      delay = baseDelay;
  }
  return Math.min(delay, maxDelay);
}
function shouldRetry(error, attempt, config) {
  if (attempt >= config.maxRetries) return false;
  if (config.retryCondition) return config.retryCondition(error, attempt);
  return isRetryableError(error);
}
async function withRetry(fn, config = {}) {
  const fullConfig = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  };
  let lastError;
  let attempt = 0;
  while (attempt <= fullConfig.maxRetries) try {
    return await fn();
  } catch (error) {
    lastError = error;
    attempt++;
    if (!shouldRetry(lastError, attempt, fullConfig)) throw lastError;
    await sleep(calculateDelay(attempt, fullConfig.retryDelay, fullConfig.retryBackoff, fullConfig.maxRetryDelay));
  }
  throw lastError;
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/utils/url.js
var DEFAULT_BASE_URL_ENV_KEY = "SDKWORK_API_BASE_URL";
var DEPLOYMENT_MODE_ENV_KEYS = [
  "SDKWORK_DEPLOY_MODE",
  "SDKWORK_DEPLOYMENT_PROFILE",
  "VITE_SDKWORK_DEPLOY_MODE",
  "VITE_SDKWORK_DEPLOYMENT_PROFILE"
];
var ENV_SUFFIXES = [
  {
    label: "dev",
    suffix: "-dev"
  },
  {
    label: "test",
    suffix: "-test"
  },
  {
    label: "staging",
    suffix: "-staging"
  }
];
function readRuntimeEnv(key) {
  var _a, _b, _c, _d;
  const viteValue = (_b = (_a = globalThis["import.meta"]) == null ? void 0 : _a.env) == null ? void 0 : _b[key];
  if (typeof viteValue === "string" && viteValue.length > 0) return viteValue;
  const processValue = (_d = (_c = globalThis["process"]) == null ? void 0 : _c.env) == null ? void 0 : _d[key];
  if (typeof processValue === "string" && processValue.length > 0) return processValue;
}
function splitBaseUrls(value) {
  return (typeof value === "string" ? value : value.join(",")).split(/[,;]/).map((item) => item.trim()).filter((item) => item.length > 0);
}
function getEnvironmentLabel(hostname) {
  const host = (hostname || "").toLowerCase();
  if (!host) return "development";
  if (isLocalhost(host) || isIpAddress(host)) return "development";
  for (const { label, suffix } of ENV_SUFFIXES) if (host.includes(suffix + ".")) return label;
  return "production";
}
function getBrand(hostname) {
  const host = (hostname || "").toLowerCase();
  const parts = host.split(".").filter((p) => p.length > 0);
  if (parts.length < 2) return host || "";
  return parts.slice(-2).join(".");
}
function getApiHostForEnvironment(environmentLabel, brand) {
  const env = environmentLabel.toLowerCase();
  return `${env === "production" ? "api." : `api-${env}.`}${brand.toLowerCase().replace(/^\.+|\.+$/g, "")}`;
}
function normalizeDeploymentMode(value) {
  const normalized = (value != null ? value : "").trim().toLowerCase();
  if (normalized === "cloud" || normalized === "standalone") return normalized;
}
function resolveDeploymentMode(options = {}) {
  var _a, _b;
  const explicit = normalizeDeploymentMode(options.mode);
  if (explicit) return explicit;
  const readEnv2 = (_a = options.readEnv) != null ? _a : readRuntimeEnv;
  for (const key of (_b = options.modeEnvKeys) != null ? _b : DEPLOYMENT_MODE_ENV_KEYS) {
    const fromEnv = normalizeDeploymentMode(readEnv2(key));
    if (fromEnv) return fromEnv;
  }
  return "cloud";
}
function resolveApiHost(options) {
  var _a, _b, _c;
  const hostname = ((_a = options.hostname) != null ? _a : "").trim().toLowerCase();
  if (!hostname) return "";
  const environment = ((_b = options.environment) != null ? _b : getEnvironmentLabel(hostname)).toLowerCase();
  if (environment === "development") return hostname;
  if (((_c = options.mode) != null ? _c : "cloud") === "standalone") return hostname;
  return getApiHostForEnvironment(environment, getBrand(hostname));
}
function resolveApiPort(options) {
  var _a, _b, _c, _d, _e;
  const hostname = ((_a = options.hostname) != null ? _a : "").trim().toLowerCase();
  if (!hostname) return "";
  if (((_b = options.environment) != null ? _b : getEnvironmentLabel(hostname)).toLowerCase() !== "development") return "";
  if (((_c = options.mode) != null ? _c : "cloud") === "standalone") return ((_d = options.currentPort) != null ? _d : "").trim();
  return ((_e = options.devPort) != null ? _e : "3910").trim();
}
function resolveBaseUrl(options = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const readEnv2 = (_a = options.readEnv) != null ? _a : readRuntimeEnv;
  const candidates = options.baseUrls ? splitBaseUrls(options.baseUrls) : splitBaseUrls((_c = readEnv2((_b = options.envKey) != null ? _b : DEFAULT_BASE_URL_ENV_KEY)) != null ? _c : "");
  const currentHost = ((_d = options.hostname) != null ? _d : getCurrentHostname()).trim().toLowerCase();
  const currentProtocol = ((_e = options.protocol) != null ? _e : getCurrentProtocol()).trim().toLowerCase() || "https";
  const currentPort = ((_f = options.port) != null ? _f : getCurrentPort()).trim();
  const mode = resolveDeploymentMode({
    mode: options.mode,
    modeEnvKeys: options.modeEnvKeys,
    readEnv: readEnv2
  });
  const environmentLabel = getEnvironmentLabel(currentHost);
  const devPort = ((_h = (_g = options.devPort) != null ? _g : readEnv2("SDKWORK_API_DEV_PORT")) != null ? _h : "3910").trim();
  const normalizeCandidate = options.preservePath ? removeTrailingSlash : toBaseOrigin;
  const targetHost = resolveApiHost({
    hostname: currentHost,
    mode,
    environment: environmentLabel,
    devPort
  });
  const targetPort = resolveApiPort({
    hostname: currentHost,
    mode,
    environment: environmentLabel,
    currentPort,
    devPort
  });
  const derivedUrl = targetHost ? `${currentProtocol}://${targetHost}${targetPort ? `:${targetPort}` : ""}` : "";
  const result = (url, reason) => ({
    url,
    reason,
    mode,
    environment: environmentLabel,
    host: targetHost
  });
  if (candidates.length === 0) return derivedUrl ? result(derivedUrl, "derived-from-host") : result("", "empty");
  const parts = candidates.map((candidate) => ({
    candidate,
    ...candidateParts(candidate)
  }));
  const exact = parts.find((item) => item.host === targetHost && item.port === targetPort && item.protocol.toLowerCase() === currentProtocol);
  if (exact) return result(normalizeCandidate(exact.candidate), "current-host-match");
  const sameHostPort = parts.find((item) => item.host === targetHost && item.port === targetPort);
  if (sameHostPort) return result(normalizeCandidate(alignCandidateProtocol(sameHostPort.candidate, currentProtocol)), "current-host-match");
  const sameHost = parts.find((item) => item.host === targetHost && (!item.port || !targetPort));
  if (sameHost) return result(normalizeCandidate(alignCandidateProtocol(sameHost.candidate, currentProtocol)), "current-host-match");
  if (environmentLabel === "development") {
    const localCandidate = parts.find((item) => item.host.length > 0 && (isLocalhost(item.host) || isIpAddress(item.host)));
    if (localCandidate) return result(normalizeCandidate(localCandidate.candidate), "development-local-candidate");
  }
  if (derivedUrl) return result(derivedUrl, "derived-from-host");
  return result(normalizeCandidate((_i = candidates[0]) != null ? _i : ""), "fallback-first");
}
function alignCandidateProtocol(candidate, currentProtocol) {
  const parts = candidateParts(candidate);
  if (!parts.host || !parts.protocol || parts.protocol === currentProtocol) return candidate;
  const rewritable = (scheme) => scheme === "http" || scheme === "https";
  if (!rewritable(parts.protocol) || !rewritable(currentProtocol)) return candidate;
  return setProtocol(candidate, currentProtocol);
}
function candidateParts(candidate) {
  if (!isAbsolute(candidate)) return {
    protocol: "",
    host: "",
    port: ""
  };
  try {
    const parsed = new URL(candidate);
    return {
      protocol: parsed.protocol.replace(":", "").toLowerCase(),
      host: parsed.hostname.toLowerCase(),
      port: parsed.port
    };
  } catch {
    return {
      protocol: "",
      host: "",
      port: ""
    };
  }
}
function toBaseOrigin(url) {
  try {
    const parsed = new URL(url);
    parsed.pathname = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.origin;
  } catch {
    return url.replace(/\/+$/, "");
  }
}
function getCurrentHostname() {
  if (typeof window !== "undefined" && window.location) return window.location.hostname;
  return "";
}
function getCurrentProtocol() {
  if (typeof window !== "undefined" && window.location) return window.location.protocol.replace(":", "");
  return "https";
}
function getCurrentPort() {
  var _a;
  if (typeof window !== "undefined" && window.location) return (_a = window.location.port) != null ? _a : "";
  return "";
}
function isAbsolute(url) {
  return /^[a-z][a-z\d+\-.]*:\/\//i.test(url);
}
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
function setProtocol(url, protocol) {
  try {
    const parsed = new URL(url);
    parsed.protocol = protocol.endsWith(":") ? protocol : `${protocol}:`;
    return parsed.href;
  } catch {
    return url;
  }
}
function isLocalhost(url) {
  const hostname = hostnameOf(url).toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname.startsWith("192.168.") || hostname.startsWith("10.") || hostname.startsWith("172.");
}
function isIpAddress(url) {
  const hostname = hostnameOf(url);
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || /^\[?([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\]?$/.test(hostname);
}
function hostnameOf(url) {
  if (isAbsolute(url)) return getHostname(url);
  return url;
}
function removeTrailingSlash(url) {
  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return parsed.href;
  } catch {
    return url.replace(/\/+$/, "") || "/";
  }
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/node_modules/.pnpm/@sdkwork_utils@0.11.0/node_modules/@sdkwork/utils/dist/runtime/random.js
function getCrypto() {
  const crypto = globalThis.crypto;
  if (!(crypto == null ? void 0 : crypto.getRandomValues)) throw new Error("Web Crypto API is not available in this environment.");
  return crypto;
}
function randomBytes(length) {
  const bytes = new Uint8Array(length);
  getCrypto().getRandomValues(bytes);
  return bytes;
}
function randomUuid() {
  const crypto = getCrypto();
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = randomBytes(16);
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/node_modules/.pnpm/@sdkwork_utils@0.11.0/node_modules/@sdkwork/utils/dist/id.js
function uuid() {
  return randomUuid();
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/utils/string.js
var StringUtils;
(function(_StringUtils) {
  function isEmpty(value) {
    return value === null || value === void 0 || value === "";
  }
  _StringUtils.isEmpty = isEmpty;
  function isNotEmpty(value) {
    return !isEmpty(value);
  }
  _StringUtils.isNotEmpty = isNotEmpty;
  function isBlank4(value) {
    if (isEmpty(value)) return true;
    if (typeof value !== "string") return false;
    return value.trim().length === 0;
  }
  _StringUtils.isBlank = isBlank4;
  function isNotBlank(value) {
    return !isBlank4(value);
  }
  _StringUtils.isNotBlank = isNotBlank;
  function trim4(value) {
    var _a;
    return (_a = value == null ? void 0 : value.trim()) != null ? _a : "";
  }
  _StringUtils.trim = trim4;
  function trimStart(value) {
    var _a;
    return (_a = value == null ? void 0 : value.trimStart()) != null ? _a : "";
  }
  _StringUtils.trimStart = trimStart;
  function trimEnd(value) {
    var _a;
    return (_a = value == null ? void 0 : value.trimEnd()) != null ? _a : "";
  }
  _StringUtils.trimEnd = trimEnd;
  function toLowerCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.toLowerCase()) != null ? _a : "";
  }
  _StringUtils.toLowerCase = toLowerCase;
  function toUpperCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.toUpperCase()) != null ? _a : "";
  }
  _StringUtils.toUpperCase = toUpperCase;
  function capitalize(value) {
    if (isEmpty(value)) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  _StringUtils.capitalize = capitalize;
  function capitalizeWords(value) {
    if (isEmpty(value)) return "";
    return value.split(/\s+/).map(capitalize).join(" ");
  }
  _StringUtils.capitalizeWords = capitalizeWords;
  function camelCase(value) {
    if (isEmpty(value)) return "";
    return value.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "").replace(/^(.)/, (char) => char.toLowerCase());
  }
  _StringUtils.camelCase = camelCase;
  function pascalCase(value) {
    if (isEmpty(value)) return "";
    const camel = camelCase(value);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }
  _StringUtils.pascalCase = pascalCase;
  function kebabCase(value) {
    if (isEmpty(value)) return "";
    return value.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
  }
  _StringUtils.kebabCase = kebabCase;
  function snakeCase(value) {
    if (isEmpty(value)) return "";
    return value.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s-]+/g, "_").toLowerCase();
  }
  _StringUtils.snakeCase = snakeCase;
  function constantCase(value) {
    return snakeCase(value).toUpperCase();
  }
  _StringUtils.constantCase = constantCase;
  function truncate(value, length, suffix = "...") {
    if (isEmpty(value) || value.length <= length) return value != null ? value : "";
    return value.slice(0, length - suffix.length) + suffix;
  }
  _StringUtils.truncate = truncate;
  function truncateWords(value, wordCount2, suffix = "...") {
    if (isEmpty(value)) return "";
    const words2 = value.split(/\s+/);
    if (words2.length <= wordCount2) return value;
    return words2.slice(0, wordCount2).join(" ") + suffix;
  }
  _StringUtils.truncateWords = truncateWords;
  function padStart(value, length, padChar = " ") {
    var _a;
    return (_a = value == null ? void 0 : value.padStart(length, padChar)) != null ? _a : "";
  }
  _StringUtils.padStart = padStart;
  function padEnd(value, length, padChar = " ") {
    var _a;
    return (_a = value == null ? void 0 : value.padEnd(length, padChar)) != null ? _a : "";
  }
  _StringUtils.padEnd = padEnd;
  function repeat(value, count) {
    if (isEmpty(value) || count <= 0) return "";
    return value.repeat(count);
  }
  _StringUtils.repeat = repeat;
  function reverse(value) {
    if (isEmpty(value)) return "";
    return value.split("").reverse().join("");
  }
  _StringUtils.reverse = reverse;
  function startsWith(value, prefix) {
    var _a;
    return (_a = value == null ? void 0 : value.startsWith(prefix)) != null ? _a : false;
  }
  _StringUtils.startsWith = startsWith;
  function endsWith(value, suffix) {
    var _a;
    return (_a = value == null ? void 0 : value.endsWith(suffix)) != null ? _a : false;
  }
  _StringUtils.endsWith = endsWith;
  function contains(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.includes(search)) != null ? _a : false;
  }
  _StringUtils.contains = contains;
  function containsIgnoreCase(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.toLowerCase().includes(search.toLowerCase())) != null ? _a : false;
  }
  _StringUtils.containsIgnoreCase = containsIgnoreCase;
  function indexOf(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.indexOf(search)) != null ? _a : -1;
  }
  _StringUtils.indexOf = indexOf;
  function lastIndexOf(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.lastIndexOf(search)) != null ? _a : -1;
  }
  _StringUtils.lastIndexOf = lastIndexOf;
  function substring(value, start, end) {
    if (isEmpty(value)) return "";
    return end !== void 0 ? value.slice(start, end) : value.slice(start);
  }
  _StringUtils.substring = substring;
  function slice(value, start, end) {
    return substring(value, start, end);
  }
  _StringUtils.slice = slice;
  function split(value, separator, limit) {
    if (isEmpty(value)) return [];
    return value.split(separator, limit);
  }
  _StringUtils.split = split;
  function join2(values, separator = "") {
    var _a;
    return (_a = values == null ? void 0 : values.join(separator)) != null ? _a : "";
  }
  _StringUtils.join = join2;
  function replace2(value, search, replacement) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(search, replacement)) != null ? _a : "";
  }
  _StringUtils.replace = replace2;
  function replaceAll(value, search, replacement) {
    var _a;
    return (_a = value == null ? void 0 : value.replaceAll(search, replacement)) != null ? _a : "";
  }
  _StringUtils.replaceAll = replaceAll;
  function remove(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(search, "")) != null ? _a : "";
  }
  _StringUtils.remove = remove;
  function removeAll(value, search) {
    var _a;
    const regex = typeof search === "string" ? new RegExp(search, "g") : new RegExp(search.source, `${search.flags}g`);
    return (_a = value == null ? void 0 : value.replace(regex, "")) != null ? _a : "";
  }
  _StringUtils.removeAll = removeAll;
  function countOccurrences(value, search) {
    if (isEmpty(value) || isEmpty(search)) return 0;
    return (value.match(new RegExp(escapeRegex(search), "g")) || []).length;
  }
  _StringUtils.countOccurrences = countOccurrences;
  function escapeHtml(value) {
    var _a;
    const htmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return (_a = value == null ? void 0 : value.replace(/[&<>"']/g, (char) => htmlEntities[char] || char)) != null ? _a : "";
  }
  _StringUtils.escapeHtml = escapeHtml;
  function unescapeHtml(value) {
    var _a;
    const htmlEntities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#x27;": "'",
      "&apos;": "'"
    };
    return (_a = value == null ? void 0 : value.replace(/&(?:amp|lt|gt|quot|#39|#x27|apos);/g, (entity) => htmlEntities[entity] || entity)) != null ? _a : "";
  }
  _StringUtils.unescapeHtml = unescapeHtml;
  function escapeRegex(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) != null ? _a : "";
  }
  _StringUtils.escapeRegex = escapeRegex;
  function isNumeric(value) {
    if (isEmpty(value)) return false;
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }
  _StringUtils.isNumeric = isNumeric;
  function isAlpha(value) {
    if (isEmpty(value)) return false;
    return /^[a-zA-Z]+$/.test(value);
  }
  _StringUtils.isAlpha = isAlpha;
  function isAlphanumeric(value) {
    if (isEmpty(value)) return false;
    return /^[a-zA-Z0-9]+$/.test(value);
  }
  _StringUtils.isAlphanumeric = isAlphanumeric;
  function isHex(value) {
    if (isEmpty(value)) return false;
    return /^[0-9a-fA-F]+$/.test(value);
  }
  _StringUtils.isHex = isHex;
  function isUuid(value) {
    if (isEmpty(value)) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
  _StringUtils.isUuid = isUuid;
  function isEmail(value) {
    if (isEmpty(value)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  _StringUtils.isEmail = isEmail;
  function isUrl(value) {
    if (isEmpty(value)) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
  _StringUtils.isUrl = isUrl;
  function isPhoneNumber(value) {
    if (isEmpty(value)) return false;
    return /^\+?[\d\s-()]{10,}$/.test(value);
  }
  _StringUtils.isPhoneNumber = isPhoneNumber;
  function mask(value, start, end, maskChar = "*") {
    if (isEmpty(value)) return "";
    const actualStart = Math.max(0, start);
    const actualEnd = Math.min(value.length, end);
    if (actualStart >= actualEnd) return value;
    const masked = maskChar.repeat(actualEnd - actualStart);
    return value.slice(0, actualStart) + masked + value.slice(actualEnd);
  }
  _StringUtils.mask = mask;
  function maskEmail(value) {
    if (!isEmail(value)) return value;
    const parts = value.split("@");
    const localPart = parts[0];
    const domain = parts[1];
    if (!localPart || !domain) return value;
    return `${mask(localPart, 2, localPart.length - 2)}@${domain}`;
  }
  _StringUtils.maskEmail = maskEmail;
  function maskPhone(value) {
    if (isEmpty(value)) return value;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7) return value;
    return mask(digits, 3, digits.length - 4);
  }
  _StringUtils.maskPhone = maskPhone;
  function maskCreditCard(value) {
    if (isEmpty(value)) return value;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 8) return value;
    return mask(digits, 4, digits.length - 4);
  }
  _StringUtils.maskCreditCard = maskCreditCard;
  function formatNumber(value, options) {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "";
    return num.toLocaleString(void 0, options);
  }
  _StringUtils.formatNumber = formatNumber;
  function formatCurrency(value, currency = "USD", locale) {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "";
    return num.toLocaleString(locale, {
      style: "currency",
      currency
    });
  }
  _StringUtils.formatCurrency = formatCurrency;
  function formatPercentage(value, decimals = 0) {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "";
    return `${(num * 100).toFixed(decimals)}%`;
  }
  _StringUtils.formatPercentage = formatPercentage;
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = [
      "Bytes",
      "KB",
      "MB",
      "GB",
      "TB",
      "PB"
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }
  _StringUtils.formatBytes = formatBytes;
  function random(length = 16, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
    let result = "";
    for (let i = 0; i < length; i++) result += charset.charAt(Math.floor(Math.random() * charset.length));
    return result;
  }
  _StringUtils.random = random;
  function uuid$1() {
    return uuid();
  }
  _StringUtils.uuid = uuid$1;
  function slugify(value) {
    var _a;
    return (_a = value == null ? void 0 : value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "")) != null ? _a : "";
  }
  _StringUtils.slugify = slugify;
  function unslugify(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())) != null ? _a : "";
  }
  _StringUtils.unslugify = unslugify;
  function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) if (matrix[0]) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) for (let j = 1; j <= a.length; j++) if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
    else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    return matrix[b.length][a.length];
  }
  _StringUtils.levenshteinDistance = levenshteinDistance;
  function similarity(a, b) {
    if (isEmpty(a) && isEmpty(b)) return 1;
    if (isEmpty(a) || isEmpty(b)) return 0;
    return 1 - levenshteinDistance(a, b) / Math.max(a.length, b.length);
  }
  _StringUtils.similarity = similarity;
  function fuzzyMatch(text, pattern, threshold = 0.6) {
    return similarity(text, pattern) >= threshold;
  }
  _StringUtils.fuzzyMatch = fuzzyMatch;
  function equals(a, b, ignoreCase = false) {
    if (ignoreCase) return (a == null ? void 0 : a.toLowerCase()) === (b == null ? void 0 : b.toLowerCase());
    return a === b;
  }
  _StringUtils.equals = equals;
  function equalsIgnoreCase(a, b) {
    return equals(a, b, true);
  }
  _StringUtils.equalsIgnoreCase = equalsIgnoreCase;
  function wordCount(value) {
    if (isEmpty(value)) return 0;
    return value.trim().split(/\s+/).filter(Boolean).length;
  }
  _StringUtils.wordCount = wordCount;
  function characterCount(value, includeSpaces = true) {
    if (isEmpty(value)) return 0;
    return includeSpaces ? value.length : value.replace(/\s/g, "").length;
  }
  _StringUtils.characterCount = characterCount;
  function lineCount(value) {
    if (isEmpty(value)) return 0;
    return value.split(/\r?\n/).length;
  }
  _StringUtils.lineCount = lineCount;
  function splitLines(value) {
    if (isEmpty(value)) return [];
    return value.split(/\r?\n/);
  }
  _StringUtils.splitLines = splitLines;
  function words(value) {
    if (isEmpty(value)) return [];
    return value.trim().split(/\s+/).filter(Boolean);
  }
  _StringUtils.words = words;
  function charAt(value, index) {
    var _a;
    return (_a = value == null ? void 0 : value.charAt(index)) != null ? _a : "";
  }
  _StringUtils.charAt = charAt;
  function charCodeAt(value, index) {
    var _a;
    return (_a = value == null ? void 0 : value.charCodeAt(index)) != null ? _a : NaN;
  }
  _StringUtils.charCodeAt = charCodeAt;
  function fromCharCode(...codes) {
    return String.fromCharCode(...codes);
  }
  _StringUtils.fromCharCode = fromCharCode;
  function insert(value, index, insertValue) {
    if (isEmpty(value)) return insertValue;
    return value.slice(0, index) + insertValue + value.slice(index);
  }
  _StringUtils.insert = insert;
  function swapCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/[a-zA-Z]/g, (char) => {
      return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
    })) != null ? _a : "";
  }
  _StringUtils.swapCase = swapCase;
  function surround(value, wrapper) {
    return `${wrapper}${value}${wrapper}`;
  }
  _StringUtils.surround = surround;
  function quote(value, quoteChar = '"') {
    return `${quoteChar}${value}${quoteChar}`;
  }
  _StringUtils.quote = quote;
  function unquote(value) {
    if (isEmpty(value)) return "";
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'") || value.startsWith("`") && value.endsWith("`")) return value.slice(1, -1);
    return value;
  }
  _StringUtils.unquote = unquote;
  function wrap(value, prefix, suffix = prefix) {
    return `${prefix}${value}${suffix}`;
  }
  _StringUtils.wrap = wrap;
  function unwrap(value, prefix, suffix = prefix) {
    if (isEmpty(value)) return "";
    if (value.startsWith(prefix) && value.endsWith(suffix)) return value.slice(prefix.length, -suffix.length);
    return value;
  }
  _StringUtils.unwrap = unwrap;
  function template(templateStr, values) {
    var _a;
    return (_a = templateStr == null ? void 0 : templateStr.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      var _a2;
      return String((_a2 = values[key]) != null ? _a2 : "");
    })) != null ? _a : "";
  }
  _StringUtils.template = template;
  function interpolate(templateStr, values) {
    return template(templateStr, values);
  }
  _StringUtils.interpolate = interpolate;
  function dedent(value) {
    const lines = value.split("\n");
    const minIndent = Math.min(...lines.filter((line) => line.trim().length > 0).map((line) => {
      var _a, _b;
      return (_b = (_a = line.match(/^\s*/)) == null ? void 0 : _a[0].length) != null ? _b : 0;
    }));
    return lines.map((line) => line.slice(minIndent)).join("\n");
  }
  _StringUtils.dedent = dedent;
  function indent(value, spaces = 2) {
    const indentation = " ".repeat(spaces);
    return value.split("\n").map((line) => indentation + line).join("\n");
  }
  _StringUtils.indent = indent;
  function center(value, width, padChar = " ") {
    if (isEmpty(value) || value.length >= width) return value != null ? value : "";
    const padding = width - value.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return padChar.repeat(leftPad) + value + padChar.repeat(rightPad);
  }
  _StringUtils.center = center;
  function alignLeft(value, width, padChar = " ") {
    return padEnd(value, width, padChar);
  }
  _StringUtils.alignLeft = alignLeft;
  function alignRight(value, width, padChar = " ") {
    return padStart(value, width, padChar);
  }
  _StringUtils.alignRight = alignRight;
  function alignCenter(value, width, padChar = " ") {
    return center(value, width, padChar);
  }
  _StringUtils.alignCenter = alignCenter;
  function toBoolean(value) {
    return [
      "true",
      "1",
      "yes",
      "on",
      "y"
    ].includes(value == null ? void 0 : value.toLowerCase().trim());
  }
  _StringUtils.toBoolean = toBoolean;
  function toNumber(value, defaultValue = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }
  _StringUtils.toNumber = toNumber;
  function toArray(value, separator = ",") {
    return split(value, separator);
  }
  _StringUtils.toArray = toArray;
  function hashCode(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }
  _StringUtils.hashCode = hashCode;
  function isPalindrome(value) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === cleaned.split("").reverse().join("");
  }
  _StringUtils.isPalindrome = isPalindrome;
  function isAnagram(a, b) {
    const normalize2 = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
    return normalize2(a) === normalize2(b);
  }
  _StringUtils.isAnagram = isAnagram;
  function reverseWords(value) {
    var _a;
    return (_a = value == null ? void 0 : value.split(/\s+/).reverse().join(" ")) != null ? _a : "";
  }
  _StringUtils.reverseWords = reverseWords;
  function sortCharacters(value) {
    var _a;
    return (_a = value == null ? void 0 : value.split("").sort().join("")) != null ? _a : "";
  }
  _StringUtils.sortCharacters = sortCharacters;
  function uniqueCharacters(value) {
    return [...new Set(value)].join("");
  }
  _StringUtils.uniqueCharacters = uniqueCharacters;
  function removeDuplicates(value) {
    var _a;
    return (_a = value == null ? void 0 : value.split("").filter((char, index, arr) => arr.indexOf(char) === index).join("")) != null ? _a : "";
  }
  _StringUtils.removeDuplicates = removeDuplicates;
  function longestCommonSubstring(a, b) {
    if (isEmpty(a) || isEmpty(b)) return "";
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
    let maxLength = 0;
    let endIndex = 0;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) if (a[i - 1] === b[j - 1]) {
      matrix[i][j] = matrix[i - 1][j - 1] + 1;
      if (matrix[i][j] > maxLength) {
        maxLength = matrix[i][j];
        endIndex = i;
      }
    }
    return a.slice(endIndex - maxLength, endIndex);
  }
  _StringUtils.longestCommonSubstring = longestCommonSubstring;
  function longestCommonPrefix(strings) {
    var _a, _b, _c;
    if (strings.length === 0) return "";
    if (strings.length === 1) return (_a = strings[0]) != null ? _a : "";
    const sorted = [...strings].sort();
    const first = (_b = sorted[0]) != null ? _b : "";
    const last = (_c = sorted[sorted.length - 1]) != null ? _c : "";
    let i = 0;
    while (i < first.length && first[i] === last[i]) i++;
    return first.slice(0, i);
  }
  _StringUtils.longestCommonPrefix = longestCommonPrefix;
  function longestCommonSuffix(strings) {
    return longestCommonPrefix(strings.map((s) => {
      var _a;
      return (_a = s == null ? void 0 : s.split("").reverse().join("")) != null ? _a : "";
    })).split("").reverse().join("");
  }
  _StringUtils.longestCommonSuffix = longestCommonSuffix;
  function truncateMiddle(value, maxLength, separator = "...") {
    if (isEmpty(value) || value.length <= maxLength) return value != null ? value : "";
    const charsToShow = maxLength - separator.length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return value.slice(0, frontChars) + separator + value.slice(-backChars);
  }
  _StringUtils.truncateMiddle = truncateMiddle;
  function ellipsis(value, maxLength) {
    return truncate(value, maxLength, "...");
  }
  _StringUtils.ellipsis = ellipsis;
  function ellipsisMiddle(value, maxLength) {
    return truncateMiddle(value, maxLength, "...");
  }
  _StringUtils.ellipsisMiddle = ellipsisMiddle;
  function pad2(value, length, padChar = " ") {
    return center(value, length, padChar);
  }
  _StringUtils.pad = pad2;
  function padCenter(value, length, padChar = " ") {
    return center(value, length, padChar);
  }
  _StringUtils.padCenter = padCenter;
  function isAscii(value) {
    return /^[\x00-\x7F]*$/.test(value);
  }
  _StringUtils.isAscii = isAscii;
  function isLowerCase(value) {
    return value === value.toLowerCase();
  }
  _StringUtils.isLowerCase = isLowerCase;
  function isUpperCase(value) {
    return value === value.toUpperCase();
  }
  _StringUtils.isUpperCase = isUpperCase;
  function isCapitalized(value) {
    return value.charAt(0) === value.charAt(0).toUpperCase();
  }
  _StringUtils.isCapitalized = isCapitalized;
  function swapPrefix(value, oldPrefix, newPrefix) {
    if (value.startsWith(oldPrefix)) return newPrefix + value.slice(oldPrefix.length);
    return value;
  }
  _StringUtils.swapPrefix = swapPrefix;
  function swapSuffix(value, oldSuffix, newSuffix) {
    if (value.endsWith(oldSuffix)) return value.slice(0, -oldSuffix.length) + newSuffix;
    return value;
  }
  _StringUtils.swapSuffix = swapSuffix;
  function ensurePrefix(value, prefix) {
    return value.startsWith(prefix) ? value : prefix + value;
  }
  _StringUtils.ensurePrefix = ensurePrefix;
  function ensureSuffix(value, suffix) {
    return value.endsWith(suffix) ? value : value + suffix;
  }
  _StringUtils.ensureSuffix = ensureSuffix;
  function removePrefix(value, prefix) {
    return value.startsWith(prefix) ? value.slice(prefix.length) : value;
  }
  _StringUtils.removePrefix = removePrefix;
  function removeSuffix(value, suffix) {
    return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
  }
  _StringUtils.removeSuffix = removeSuffix;
  function take(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(0, n)) != null ? _a : "";
  }
  _StringUtils.take = take;
  function takeRight(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(-n)) != null ? _a : "";
  }
  _StringUtils.takeRight = takeRight;
  function takeWhile(value, predicate) {
    let result = "";
    for (const char of value != null ? value : "") {
      if (!predicate(char)) break;
      result += char;
    }
    return result;
  }
  _StringUtils.takeWhile = takeWhile;
  function takeRightWhile(value, predicate) {
    var _a, _b;
    let result = "";
    for (let i = ((_a = value == null ? void 0 : value.length) != null ? _a : 0) - 1; i >= 0; i--) {
      const char = (_b = value == null ? void 0 : value.charAt(i)) != null ? _b : "";
      if (!predicate(char)) break;
      result = char + result;
    }
    return result;
  }
  _StringUtils.takeRightWhile = takeRightWhile;
  function drop(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(n)) != null ? _a : "";
  }
  _StringUtils.drop = drop;
  function dropRight(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(0, -n)) != null ? _a : "";
  }
  _StringUtils.dropRight = dropRight;
  function dropWhile(value, predicate) {
    var _a;
    let i = 0;
    for (const char of value != null ? value : "") {
      if (!predicate(char)) break;
      i++;
    }
    return (_a = value == null ? void 0 : value.slice(i)) != null ? _a : "";
  }
  _StringUtils.dropWhile = dropWhile;
  function dropRightWhile(value, predicate) {
    var _a, _b, _c;
    let i = ((_a = value == null ? void 0 : value.length) != null ? _a : 0) - 1;
    while (i >= 0 && predicate((_b = value == null ? void 0 : value.charAt(i)) != null ? _b : "")) i--;
    return (_c = value == null ? void 0 : value.slice(0, i + 1)) != null ? _c : "";
  }
  _StringUtils.dropRightWhile = dropRightWhile;
  function countLines(value) {
    return lineCount(value);
  }
  _StringUtils.countLines = countLines;
  function getLine(value, lineNumber) {
    var _a;
    return (_a = splitLines(value)[lineNumber]) != null ? _a : "";
  }
  _StringUtils.getLine = getLine;
  function getLines(value) {
    return splitLines(value);
  }
  _StringUtils.getLines = getLines;
  function isSingleLine(value) {
    return !(value == null ? void 0 : value.includes("\n"));
  }
  _StringUtils.isSingleLine = isSingleLine;
  function isMultiLine(value) {
    var _a;
    return (_a = value == null ? void 0 : value.includes("\n")) != null ? _a : false;
  }
  _StringUtils.isMultiLine = isMultiLine;
  function normalizeLineEndings(value, lineEnding = "\n") {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\r\n|\r|\n/g, lineEnding)) != null ? _a : "";
  }
  _StringUtils.normalizeLineEndings = normalizeLineEndings;
  function toCamelCase(value) {
    return camelCase(value);
  }
  _StringUtils.toCamelCase = toCamelCase;
  function toKebabCase(value) {
    return kebabCase(value);
  }
  _StringUtils.toKebabCase = toKebabCase;
  function toSnakeCase(value) {
    return snakeCase(value);
  }
  _StringUtils.toSnakeCase = toSnakeCase;
  function toPascalCase(value) {
    return pascalCase(value);
  }
  _StringUtils.toPascalCase = toPascalCase;
  function toConstantCase(value) {
    return constantCase(value);
  }
  _StringUtils.toConstantCase = toConstantCase;
  function toSentenceCase(value) {
    if (isEmpty(value)) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  _StringUtils.toSentenceCase = toSentenceCase;
  function toTitleCase(value) {
    return capitalizeWords(value);
  }
  _StringUtils.toTitleCase = toTitleCase;
  function toCapitalCase(value) {
    return capitalizeWords(value);
  }
  _StringUtils.toCapitalCase = toCapitalCase;
  function toDotCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/([a-z])([A-Z])/g, "$1.$2").replace(/[-_\s]+/g, ".").toLowerCase()) != null ? _a : "";
  }
  _StringUtils.toDotCase = toDotCase;
  function toPathCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/([a-z])([A-Z])/g, "$1/$2").replace(/[-_\s]+/g, "/").toLowerCase()) != null ? _a : "";
  }
  _StringUtils.toPathCase = toPathCase;
  function stripTags(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/<[^>]*>/g, "")) != null ? _a : "";
  }
  _StringUtils.stripTags = stripTags;
  function stripNumbers(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\d+/g, "")) != null ? _a : "";
  }
  _StringUtils.stripNumbers = stripNumbers;
  function stripWhitespace(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\s+/g, "")) != null ? _a : "";
  }
  _StringUtils.stripWhitespace = stripWhitespace;
  function stripPunctuation(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/[^\w\s]/g, "")) != null ? _a : "";
  }
  _StringUtils.stripPunctuation = stripPunctuation;
  function normalizeWhitespace(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\s+/g, " ").trim()) != null ? _a : "";
  }
  _StringUtils.normalizeWhitespace = normalizeWhitespace;
  function includesAll(value, searches) {
    return searches.every((search) => {
      var _a;
      return (_a = value == null ? void 0 : value.includes(search)) != null ? _a : false;
    });
  }
  _StringUtils.includesAll = includesAll;
  function includesAny(value, searches) {
    return searches.some((search) => {
      var _a;
      return (_a = value == null ? void 0 : value.includes(search)) != null ? _a : false;
    });
  }
  _StringUtils.includesAny = includesAny;
})(StringUtils || (StringUtils = {}));

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/utils/encoding.js
var Encoding;
(function(_Encoding) {
  function base64Encode4(input) {
    var _a, _b, _c;
    let bytes;
    if (typeof input === "string") bytes = new TextEncoder().encode(input);
    else bytes = input;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = "";
    let i = 0;
    while (i < bytes.length) {
      const a = (_a = bytes[i++]) != null ? _a : 0;
      const b = i < bytes.length ? (_b = bytes[i++]) != null ? _b : 0 : 0;
      const c = i < bytes.length ? (_c = bytes[i++]) != null ? _c : 0 : 0;
      const bitmap = a << 16 | b << 8 | c;
      result += chars[bitmap >> 18 & 63];
      result += chars[bitmap >> 12 & 63];
      result += i > bytes.length + 1 ? "=" : chars[bitmap >> 6 & 63];
      result += i > bytes.length ? "=" : chars[bitmap & 63];
    }
    return result;
  }
  _Encoding.base64Encode = base64Encode4;
  function base64Decode4(input) {
    var _a, _b, _c, _d;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    input = input.replace(/[^A-Za-z0-9+/]/g, "");
    const len = input.length;
    let result = "";
    let i = 0;
    while (i < len) {
      const a = chars.indexOf((_a = input[i++]) != null ? _a : "");
      const b = chars.indexOf((_b = input[i++]) != null ? _b : "");
      const c = chars.indexOf((_c = input[i++]) != null ? _c : "");
      const d = chars.indexOf((_d = input[i++]) != null ? _d : "");
      const bitmap = a << 18 | b << 12 | c << 6 | d;
      result += String.fromCharCode(bitmap >> 16 & 255);
      if (c !== 64 && input[i - 2] !== "=") result += String.fromCharCode(bitmap >> 8 & 255);
      if (d !== 64 && input[i - 1] !== "=") result += String.fromCharCode(bitmap & 255);
    }
    return result;
  }
  _Encoding.base64Decode = base64Decode4;
  function base64UrlEncode4(input) {
    return base64Encode4(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  _Encoding.base64UrlEncode = base64UrlEncode4;
  function base64UrlDecode4(input) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad2 = input.length % 4;
    if (pad2) input += "=".repeat(4 - pad2);
    return base64Decode4(input);
  }
  _Encoding.base64UrlDecode = base64UrlDecode4;
  function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  _Encoding.base64ToBytes = base64ToBytes;
  function bytesToBase64(bytes) {
    var _a;
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode((_a = bytes[i]) != null ? _a : 0);
    return btoa(binary);
  }
  _Encoding.bytesToBase64 = bytesToBase64;
  function utf8Encode(input) {
    return new TextEncoder().encode(input);
  }
  _Encoding.utf8Encode = utf8Encode;
  function utf8Decode(input) {
    return new TextDecoder().decode(input);
  }
  _Encoding.utf8Decode = utf8Decode;
  function hexEncode4(input) {
    const bytes = typeof input === "string" ? utf8Encode(input) : input;
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  _Encoding.hexEncode = hexEncode4;
  function hexDecode4(input) {
    const bytes = new Uint8Array(input.length / 2);
    for (let i = 0; i < input.length; i += 2) bytes[i / 2] = parseInt(input.substr(i, 2), 16);
    return utf8Decode(bytes);
  }
  _Encoding.hexDecode = hexDecode4;
  function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    return bytes;
  }
  _Encoding.hexToBytes = hexToBytes;
  function bytesToHex(bytes) {
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  _Encoding.bytesToHex = bytesToHex;
  function urlEncode(input) {
    return encodeURIComponent(input);
  }
  _Encoding.urlEncode = urlEncode;
  function urlDecode(input) {
    return decodeURIComponent(input);
  }
  _Encoding.urlDecode = urlDecode;
  function urlEncodeComponent(input) {
    return encodeURIComponent(input);
  }
  _Encoding.urlEncodeComponent = urlEncodeComponent;
  function urlDecodeComponent(input) {
    return decodeURIComponent(input);
  }
  _Encoding.urlDecodeComponent = urlDecodeComponent;
  function htmlEncode(input) {
    const htmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    };
    return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
  }
  _Encoding.htmlEncode = htmlEncode;
  function htmlDecode(input) {
    const htmlEntities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#x27;": "'",
      "&#x2F;": "/",
      "&#x60;": "`",
      "&#x3D;": "=",
      "&nbsp;": " "
    };
    return input.replace(/&[^;]+;/g, (entity) => htmlEntities[entity] || entity);
  }
  _Encoding.htmlDecode = htmlDecode;
  function jsonEncode(value, replacer, space) {
    return JSON.stringify(value, replacer, space);
  }
  _Encoding.jsonEncode = jsonEncode;
  function jsonDecode(input) {
    return JSON.parse(input);
  }
  _Encoding.jsonDecode = jsonDecode;
  function jsonEncodePretty(value, indent = 2) {
    return JSON.stringify(value, null, indent);
  }
  _Encoding.jsonEncodePretty = jsonEncodePretty;
  function tryJsonDecode(input, defaultValue) {
    try {
      return JSON.parse(input);
    } catch {
      return defaultValue;
    }
  }
  _Encoding.tryJsonDecode = tryJsonDecode;
  function isJson(input) {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }
  _Encoding.isJson = isJson;
  function xmlEncode(input) {
    const xmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };
    return input.replace(/[&<>"']/g, (char) => xmlEntities[char] || char);
  }
  _Encoding.xmlEncode = xmlEncode;
  function xmlDecode(input) {
    const xmlEntities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&apos;": "'"
    };
    return input.replace(/&[^;]+;/g, (entity) => xmlEntities[entity] || entity);
  }
  _Encoding.xmlDecode = xmlDecode;
  function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  _Encoding.escapeRegex = escapeRegex;
  function escapeSql(input) {
    return input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      return {
        "\0": "\\0",
        "\b": "\\b",
        "	": "\\t",
        "": "\\z",
        "\n": "\\n",
        "\r": "\\r",
        '"': '\\"',
        "'": "\\'",
        "\\": "\\\\",
        "%": "\\%"
      }[char] || char;
    });
  }
  _Encoding.escapeSql = escapeSql;
  function escapeShell(input) {
    return input.replace(/[^A-Za-z0-9_\-.,:\/@\n]/g, (char) => {
      if (char === "\n") return "'\\n'";
      return `\\${char}`;
    });
  }
  _Encoding.escapeShell = escapeShell;
  function escapeCString(input) {
    return input.replace(/[\\"'\n\r\t\b\f\v\0]/g, (char) => {
      return {
        "\\": "\\\\",
        '"': '\\"',
        "'": "\\'",
        "\n": "\\n",
        "\r": "\\r",
        "	": "\\t",
        "\b": "\\b",
        "\f": "\\f",
        "\v": "\\v",
        "\0": "\\0"
      }[char] || char;
    });
  }
  _Encoding.escapeCString = escapeCString;
  function unescapeCString(input) {
    return input.replace(/\\([\\\"'nrtbfv0])/g, (_, char) => {
      return {
        "\\": "\\",
        '"': '"',
        "'": "'",
        "n": "\n",
        "r": "\r",
        "t": "	",
        "b": "\b",
        "f": "\f",
        "v": "\v",
        "0": "\0"
      }[char] || char;
    });
  }
  _Encoding.unescapeCString = unescapeCString;
  function camelToSnake(input) {
    return input.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
  _Encoding.camelToSnake = camelToSnake;
  function snakeToCamel(input) {
    return input.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  _Encoding.snakeToCamel = snakeToCamel;
  function camelToKebab(input) {
    return input.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
  _Encoding.camelToKebab = camelToKebab;
  function kebabToCamel(input) {
    return input.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  _Encoding.kebabToCamel = kebabToCamel;
  function camelToPascal(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  _Encoding.camelToPascal = camelToPascal;
  function pascalToCamel(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
  }
  _Encoding.pascalToCamel = pascalToCamel;
  function pascalToSnake(input) {
    return camelToSnake(input);
  }
  _Encoding.pascalToSnake = pascalToSnake;
  function snakeToPascal(input) {
    return camelToPascal(snakeToCamel(input));
  }
  _Encoding.snakeToPascal = snakeToPascal;
  function pascalToKebab(input) {
    return camelToKebab(input);
  }
  _Encoding.pascalToKebab = pascalToKebab;
  function kebabToPascal(input) {
    return camelToPascal(kebabToCamel(input));
  }
  _Encoding.kebabToPascal = kebabToPascal;
  function toSnakeCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
  }
  _Encoding.toSnakeCase = toSnakeCase;
  function toKebabCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
  }
  _Encoding.toKebabCase = toKebabCase;
  function toCamelCase(input) {
    return input.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "").replace(/^(.)/, (char) => char.toLowerCase());
  }
  _Encoding.toCamelCase = toCamelCase;
  function toPascalCase(input) {
    const camel = toCamelCase(input);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }
  _Encoding.toPascalCase = toPascalCase;
  function toConstantCase(input) {
    return toSnakeCase(input).toUpperCase();
  }
  _Encoding.toConstantCase = toConstantCase;
  function toSentenceCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
  _Encoding.toSentenceCase = toSentenceCase;
  function toTitleCase(input) {
    return input.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  _Encoding.toTitleCase = toTitleCase;
  function toCapitalCase(input) {
    return input.replace(/[-_\s]+(.)?/g, (_, char) => char ? ` ${char.toUpperCase()}` : "").trim();
  }
  _Encoding.toCapitalCase = toCapitalCase;
  function toDotCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1.$2").replace(/[-_\s]+/g, ".").toLowerCase();
  }
  _Encoding.toDotCase = toDotCase;
  function toPathCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1/$2").replace(/[-_\s]+/g, "/").toLowerCase();
  }
  _Encoding.toPathCase = toPathCase;
  function rot13(input) {
    return input.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97;
      return String.fromCharCode((char.charCodeAt(0) - start + 13) % 26 + start);
    });
  }
  _Encoding.rot13 = rot13;
  function caesarCipher(input, shift) {
    return input.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97;
      const shifted = ((char.charCodeAt(0) - start + shift) % 26 + 26) % 26;
      return String.fromCharCode(shifted + start);
    });
  }
  _Encoding.caesarCipher = caesarCipher;
  function caesarDecipher(input, shift) {
    return caesarCipher(input, -shift);
  }
  _Encoding.caesarDecipher = caesarDecipher;
  function xorEncode(input, key) {
    var _a, _b;
    const inputBytes = utf8Encode(input);
    const keyBytes = utf8Encode(key);
    const result = new Uint8Array(inputBytes.length);
    for (let i = 0; i < inputBytes.length; i++) result[i] = ((_a = inputBytes[i]) != null ? _a : 0) ^ ((_b = keyBytes[i % keyBytes.length]) != null ? _b : 0);
    return bytesToHex(result);
  }
  _Encoding.xorEncode = xorEncode;
  function xorDecode(input, key) {
    var _a, _b;
    const inputBytes = hexToBytes(input);
    const keyBytes = utf8Encode(key);
    const result = new Uint8Array(inputBytes.length);
    for (let i = 0; i < inputBytes.length; i++) result[i] = ((_a = inputBytes[i]) != null ? _a : 0) ^ ((_b = keyBytes[i % keyBytes.length]) != null ? _b : 0);
    return utf8Decode(result);
  }
  _Encoding.xorDecode = xorDecode;
  function charCodeEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0));
  }
  _Encoding.charCodeEncode = charCodeEncode;
  function charCodeDecode(codes) {
    return String.fromCharCode(...codes);
  }
  _Encoding.charCodeDecode = charCodeDecode;
  function binaryEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
  }
  _Encoding.binaryEncode = binaryEncode;
  function binaryDecode(input) {
    return input.split(/\s+/).map((byte) => String.fromCharCode(parseInt(byte, 2))).join("");
  }
  _Encoding.binaryDecode = binaryDecode;
  function octalEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0).toString(8).padStart(3, "0")).join(" ");
  }
  _Encoding.octalEncode = octalEncode;
  function octalDecode(input) {
    return input.split(/\s+/).map((byte) => String.fromCharCode(parseInt(byte, 8))).join("");
  }
  _Encoding.octalDecode = octalDecode;
  function decimalEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0).toString(10)).join(" ");
  }
  _Encoding.decimalEncode = decimalEncode;
  function decimalDecode(input) {
    return input.split(/\s+/).map((code) => String.fromCharCode(parseInt(code, 10))).join("");
  }
  _Encoding.decimalDecode = decimalDecode;
  function punycodeEncode(input) {
    const prefix = "xn--";
    if (input.startsWith(prefix)) return input;
    const asciiPart = input.replace(/[^\x00-\x7F]/g, "");
    const nonAsciiPart = input.replace(/[\x00-\x7F]/g, "");
    if (!nonAsciiPart) return input;
    return prefix + asciiPart + "-" + nonAsciiPart.split("").map((c) => c.charCodeAt(0).toString(36)).join("");
  }
  _Encoding.punycodeEncode = punycodeEncode;
  function slugify(input) {
    return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  _Encoding.slugify = slugify;
  function unslugify(input) {
    return input.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }
  _Encoding.unslugify = unslugify;
  function queryStringEncode(params) {
    return Object.entries(params).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => {
      if (Array.isArray(value)) return value.map((v) => `${urlEncode(key)}=${urlEncode(String(v))}`).join("&");
      return `${urlEncode(key)}=${urlEncode(String(value))}`;
    }).join("&");
  }
  _Encoding.queryStringEncode = queryStringEncode;
  function queryStringDecode(query) {
    const result = {};
    if (!query) return result;
    query = query.replace(/^[?#]/, "");
    for (const pair of query.split("&")) {
      const parts = pair.split("=");
      const key = parts[0];
      const value = parts[1];
      if (!key) continue;
      const decodedKey = urlDecode(key);
      const decodedValue = value ? urlDecode(value) : "";
      if (result[decodedKey]) {
        if (Array.isArray(result[decodedKey])) result[decodedKey].push(decodedValue);
        else result[decodedKey] = [result[decodedKey], decodedValue];
      } else result[decodedKey] = decodedValue;
    }
    return result;
  }
  _Encoding.queryStringDecode = queryStringDecode;
  function formDataEncode(data) {
    return Object.entries(data).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => `${urlEncode(key)}=${urlEncode(String(value))}`).join("&");
  }
  _Encoding.formDataEncode = formDataEncode;
  function mimeTypeToExtension(mimeType) {
    return {
      "application/json": "json",
      "application/xml": "xml",
      "application/pdf": "pdf",
      "application/zip": "zip",
      "application/gzip": "gz",
      "application/x-tar": "tar",
      "application/x-rar-compressed": "rar",
      "application/x-7z-compressed": "7z",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "text/plain": "txt",
      "text/html": "html",
      "text/css": "css",
      "text/javascript": "js",
      "text/csv": "csv",
      "text/xml": "xml",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/svg+xml": "svg",
      "image/webp": "webp",
      "image/bmp": "bmp",
      "image/tiff": "tiff",
      "image/x-icon": "ico",
      "audio/mpeg": "mp3",
      "audio/wav": "wav",
      "audio/ogg": "ogg",
      "audio/aac": "aac",
      "video/mp4": "mp4",
      "video/mpeg": "mpeg",
      "video/webm": "webm",
      "video/ogg": "ogv",
      "video/x-msvideo": "avi",
      "video/quicktime": "mov"
    }[mimeType.toLowerCase()] || "";
  }
  _Encoding.mimeTypeToExtension = mimeTypeToExtension;
  function extensionToMimeType(extension) {
    return {
      "json": "application/json",
      "xml": "application/xml",
      "pdf": "application/pdf",
      "zip": "application/zip",
      "gz": "application/gzip",
      "tar": "application/x-tar",
      "rar": "application/x-rar-compressed",
      "7z": "application/x-7z-compressed",
      "xls": "application/vnd.ms-excel",
      "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "ppt": "application/vnd.ms-powerpoint",
      "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "doc": "application/msword",
      "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "txt": "text/plain",
      "html": "text/html",
      "htm": "text/html",
      "css": "text/css",
      "js": "text/javascript",
      "csv": "text/csv",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif",
      "svg": "image/svg+xml",
      "webp": "image/webp",
      "bmp": "image/bmp",
      "tiff": "image/tiff",
      "tif": "image/tiff",
      "ico": "image/x-icon",
      "mp3": "audio/mpeg",
      "wav": "audio/wav",
      "ogg": "audio/ogg",
      "aac": "audio/aac",
      "mp4": "video/mp4",
      "mpeg": "video/mpeg",
      "mpg": "video/mpeg",
      "webm": "video/webm",
      "ogv": "video/ogg",
      "avi": "video/x-msvideo",
      "mov": "video/quicktime"
    }[extension.toLowerCase().replace(/^\./, "")] || "application/octet-stream";
  }
  _Encoding.extensionToMimeType = extensionToMimeType;
  function charsetEncode(input, _charset) {
    return new TextEncoder().encode(input);
  }
  _Encoding.charsetEncode = charsetEncode;
  function charsetDecode(input, charset) {
    return new TextDecoder(charset).decode(input);
  }
  _Encoding.charsetDecode = charsetDecode;
  function stripBom(input) {
    if (input.charCodeAt(0) === 65279) return input.slice(1);
    return input;
  }
  _Encoding.stripBom = stripBom;
  function addBom(input, bom = "utf-8") {
    return {
      "utf-8": "\uFEFF",
      "utf-16le": "\uFFFE",
      "utf-16be": "\uFEFF"
    }[bom] + input;
  }
  _Encoding.addBom = addBom;
  function normalizeEncoding(input, fromEncoding, toEncoding) {
    return charsetDecode(charsetEncode(input, fromEncoding), toEncoding);
  }
  _Encoding.normalizeEncoding = normalizeEncoding;
  function isValidBase64(input) {
    if (!input || input.length % 4 !== 0) return false;
    return /^[A-Za-z0-9+/]*={0,2}$/.test(input);
  }
  _Encoding.isValidBase64 = isValidBase64;
  function isValidHex(input) {
    return /^[0-9a-fA-F]*$/.test(input) && input.length % 2 === 0;
  }
  _Encoding.isValidHex = isValidHex;
  function isValidUrl(input) {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }
  _Encoding.isValidUrl = isValidUrl;
  function isValidEmail(input) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  }
  _Encoding.isValidEmail = isValidEmail;
  function detectEncoding(input) {
    if (input.charCodeAt(0) === 65279) return "utf-8-bom";
    if (input.charCodeAt(0) === 65534) return "utf-16le";
    if (input.charCodeAt(0) === 65279 && input.charCodeAt(1) === 0) return "utf-16be";
    if (/[\u4e00-\u9fa5]/.test(input)) return "utf-8";
    return "ascii";
  }
  _Encoding.detectEncoding = detectEncoding;
})(Encoding || (Encoding = {}));
Encoding.base64Encode;
Encoding.base64Decode;
Encoding.base64UrlEncode;
Encoding.base64UrlDecode;
Encoding.utf8Encode;
Encoding.utf8Decode;
Encoding.hexEncode;
Encoding.hexDecode;
Encoding.urlEncode;
Encoding.urlDecode;
Encoding.htmlEncode;
Encoding.htmlDecode;
Encoding.jsonEncode;
Encoding.jsonDecode;
Encoding.xmlEncode;
Encoding.xmlDecode;
Encoding.escapeRegex;
Encoding.escapeSql;
Encoding.escapeShell;
Encoding.queryStringEncode;
Encoding.queryStringDecode;
Encoding.slugify;
Encoding.unslugify;

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/utils/date.js
var MILLISECONDS_IN_SECOND = 1e3;
var MILLISECONDS_IN_MINUTE = 60 * MILLISECONDS_IN_SECOND;
var MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE;
var MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;
var MILLISECONDS_IN_WEEK = 7 * MILLISECONDS_IN_DAY;
var TIME_UNITS_IN_MS = {
  millisecond: 1,
  second: MILLISECONDS_IN_SECOND,
  minute: MILLISECONDS_IN_MINUTE,
  hour: MILLISECONDS_IN_HOUR,
  day: MILLISECONDS_IN_DAY,
  week: MILLISECONDS_IN_WEEK,
  month: 30 * MILLISECONDS_IN_DAY,
  quarter: 90 * MILLISECONDS_IN_DAY,
  year: 365 * MILLISECONDS_IN_DAY
};

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/http/stream-parser.js
function extractStreamLines(buffer, flush = false) {
  const lines = [];
  let lineStart = 0;
  let index = 0;
  while (index < buffer.length) {
    const character = buffer[index];
    if (character === "\n") {
      lines.push(buffer.slice(lineStart, index));
      index += 1;
      lineStart = index;
      continue;
    }
    if (character === "\r") {
      if (!flush && index === buffer.length - 1) break;
      lines.push(buffer.slice(lineStart, index));
      index += buffer[index + 1] === "\n" ? 2 : 1;
      lineStart = index;
      continue;
    }
    index += 1;
  }
  if (flush && lineStart < buffer.length) {
    lines.push(buffer.slice(lineStart));
    lineStart = buffer.length;
  }
  return {
    lines,
    remainder: buffer.slice(lineStart)
  };
}
var ServerSentEventDataParser = class {
  constructor() {
    __publicField(this, "dataLines", []);
    __publicField(this, "firstLine", true);
  }
  pushLine(rawLine) {
    const line = this.firstLine && rawLine.charCodeAt(0) === 65279 ? rawLine.slice(1) : rawLine;
    this.firstLine = false;
    if (line === "") return this.dispatch();
    if (line.startsWith(":")) return;
    const separatorIndex = line.indexOf(":");
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    let value = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "data") this.dataLines.push(value);
  }
  flush() {
    return this.dispatch();
  }
  dispatch() {
    if (this.dataLines.length === 0) return;
    const data = this.dataLines.join("\n");
    this.dataLines = [];
    return data === "" || data === "[DONE]" ? void 0 : data;
  }
};
function normalizeLegacyStreamLine(line) {
  const trimmedLine = line.trim();
  if (trimmedLine === "" || trimmedLine === "data: [DONE]") return;
  if (trimmedLine.startsWith("data: ")) return trimmedLine.slice(6);
  return trimmedLine;
}

// ../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/dist/http/base-client.js
var SDKWORK_API_PREFIXES = [
  "/app/v3/api",
  "/backend/v3/api",
  "/gateway/v3/api"
];
function dedupeSdkWorkApiPath(baseUrl, path) {
  for (const prefix of SDKWORK_API_PREFIXES) if (baseUrl.endsWith(prefix) && path.startsWith(prefix)) {
    const remainder = path.slice(prefix.length);
    return remainder.startsWith("/") ? remainder : `/${remainder}`;
  }
  return path;
}
function isApiResultEnvelope(value) {
  return value !== null && value !== void 0 && typeof value === "object" && !Array.isArray(value) && "code" in value && ("data" in value || "msg" in value || "message" in value);
}
var IDENTITY_PROJECTION_HEADER_NAMES = /* @__PURE__ */ new Set([
  "x-sdkwork-tenant-id",
  "x-sdkwork-app-id",
  "x-sdkwork-user-id",
  "x-sdkwork-organization-id",
  "x-sdkwork-actor-id",
  "x-sdkwork-actor-kind",
  "x-sdkwork-session-id",
  "x-sdkwork-environment",
  "x-sdkwork-deployment-profile",
  "x-sdkwork-deployment-mode",
  "x-sdkwork-runtime-target",
  "x-sdkwork-auth-level",
  "x-sdkwork-data-scope",
  "x-sdkwork-permission-scope",
  "x-sdkwork-device-id",
  "x-sdkwork-context-signature",
  "x-sdkwork-operation-id",
  "x-sdkwork-subject-tenant-id",
  "x-sdkwork-subject-organization-id",
  "x-sdkwork-subject-user-id",
  "x-sdkwork-subject-timestamp",
  "x-sdkwork-subject-signature",
  "x-tenant-id",
  "x-app-id",
  "x-organization-id",
  "x-platform",
  "x-user-id"
]);
function stripIdentityProjectionHeaders(headers) {
  for (const name of Object.keys(headers)) if (IDENTITY_PROJECTION_HEADER_NAMES.has(name.toLowerCase())) delete headers[name];
}
var BaseHttpClient = class {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "authConfig");
    __publicField(this, "logger");
    __publicField(this, "cache");
    __publicField(this, "interceptors");
    var _a, _b, _c, _d;
    this.config = {
      baseUrl: config.baseUrl,
      timeout: (_a = config.timeout) != null ? _a : 3e4,
      headers: (_b = config.headers) != null ? _b : {},
      retry: {
        maxRetries: 3,
        retryDelay: 1e3,
        retryBackoff: "exponential",
        maxRetryDelay: 3e4,
        ...config.retry
      },
      cache: {
        enabled: false,
        ttl: 3e5,
        maxSize: 100,
        ...config.cache
      },
      logger: {
        level: "info",
        prefix: "[SDK]",
        timestamp: true,
        colors: true,
        ...config.logger
      }
    };
    this.logger = createLogger(this.config.logger);
    this.cache = createCacheStore(this.config.cache);
    this.interceptors = (_c = config.interceptors) != null ? _c : {
      request: [],
      response: [],
      error: []
    };
    const authMode = this.determineAuthMode(config);
    const tokenManager = (_d = config.tokenManager) != null ? _d : new DefaultAuthTokenManager({
      ...config.accessToken !== void 0 ? { accessToken: config.accessToken } : {},
      ...config.authToken !== void 0 ? { authToken: config.authToken } : {}
    });
    this.authConfig = {
      authMode,
      ...config.apiKey !== void 0 ? { apiKey: config.apiKey } : {},
      tokenManager
    };
  }
  determineAuthMode(config) {
    if (config.apiKey) return "apikey";
    return "dual-token";
  }
  getAuthMode() {
    return this.authConfig.authMode;
  }
  setAuthMode(mode) {
    this.authConfig.authMode = mode;
  }
  getTokenManager() {
    return this.authConfig.tokenManager;
  }
  setTokenManager(manager) {
    this.authConfig.tokenManager = manager;
  }
  setApiKey(apiKey) {
    var _a;
    this.authConfig.apiKey = apiKey;
    this.authConfig.authMode = "apikey";
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.clearTokens();
  }
  setAuthToken(token) {
    var _a;
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.setAuthToken(token);
    if (this.authConfig.authMode === "apikey") {
      this.authConfig.authMode = "dual-token";
      delete this.authConfig.apiKey;
    }
  }
  setAccessToken(token) {
    var _a;
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.setAccessToken(token);
    if (this.authConfig.authMode === "apikey") {
      this.authConfig.authMode = "dual-token";
      delete this.authConfig.apiKey;
    }
  }
  clearAuthToken() {
    var _a;
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.clearTokens();
  }
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
    return () => {
      const index = this.interceptors.request.indexOf(interceptor);
      if (index > -1) this.interceptors.request.splice(index, 1);
    };
  }
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
    return () => {
      const index = this.interceptors.response.indexOf(interceptor);
      if (index > -1) this.interceptors.response.splice(index, 1);
    };
  }
  addErrorInterceptor(interceptor) {
    this.interceptors.error.push(interceptor);
    return () => {
      const index = this.interceptors.error.indexOf(interceptor);
      if (index > -1) this.interceptors.error.splice(index, 1);
    };
  }
  clearCache() {
    this.cache.clear();
  }
  getConfig() {
    var _a, _b;
    return {
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      authMode: this.authConfig.authMode,
      apiKey: this.authConfig.apiKey,
      accessToken: (_a = this.authConfig.tokenManager) == null ? void 0 : _a.getAccessToken(),
      authToken: (_b = this.authConfig.tokenManager) == null ? void 0 : _b.getAuthToken()
    };
  }
  isAuthenticated() {
    var _a, _b;
    return (_b = (_a = this.authConfig.tokenManager) == null ? void 0 : _a.isValid()) != null ? _b : false;
  }
  buildBaseUrl(path, params) {
    const baseUrl = this.config.baseUrl.replace(/\/$/, "");
    let url = `${baseUrl}${dedupeSdkWorkApiPath(baseUrl, path.startsWith("/") ? path : `/${path}`)}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== void 0 && item !== null) searchParams.append(key, String(item));
          });
          return;
        }
        if (value !== void 0 && value !== null) searchParams.append(key, String(value));
      });
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }
    return url;
  }
  buildHeaders(config, skipAuth = false) {
    const headers = {
      "Content-Type": MIME_TYPES.JSON,
      ...this.config.headers,
      ...config.headers
    };
    if (!skipAuth && !config.skipAuth) {
      const authHeaders = buildAuthHeaders(this.authConfig.authMode, this.authConfig.apiKey, this.authConfig.tokenManager);
      Object.assign(headers, authHeaders);
    }
    stripIdentityProjectionHeaders(headers);
    return headers;
  }
  serializeRequestBody(body, headers) {
    if (body === void 0 || body === null) return;
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      delete headers["Content-Type"];
      return body;
    }
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      return body.toString();
    }
    if (typeof Blob !== "undefined" && body instanceof Blob) {
      delete headers["Content-Type"];
      return body;
    }
    if (typeof ArrayBuffer !== "undefined") {
      if (body instanceof ArrayBuffer) {
        delete headers["Content-Type"];
        return body;
      }
      if (ArrayBuffer.isView(body)) {
        delete headers["Content-Type"];
        return body;
      }
    }
    if (typeof body === "string") {
      headers["Content-Type"] = headers["Content-Type"] || "text/plain;charset=UTF-8";
      return body;
    }
    return JSON.stringify(body);
  }
  async applyRequestInterceptors(config) {
    let processedConfig = config;
    for (const interceptor of this.interceptors.request) processedConfig = await interceptor(processedConfig);
    return processedConfig;
  }
  async applyResponseInterceptors(response, config) {
    let processedResponse = response;
    for (const interceptor of this.interceptors.response) processedResponse = await interceptor(processedResponse, config);
    return processedResponse;
  }
  async applyErrorInterceptors(error, config) {
    for (const interceptor of this.interceptors.error) await interceptor(error, config);
  }
  async handleErrorResponse(response, config) {
    var _a;
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let problem;
    try {
      const result = await response.json();
      errorMessage = String(result.detail || result.msg || result.message || result.title || errorMessage);
      if (((_a = response.headers.get("content-type")) == null ? void 0 : _a.includes("application/problem+json")) || "status" in result && "code" in result && "traceId" in result) problem = result;
    } catch {
    }
    const error = SdkError.fromHttpStatus(response.status, errorMessage, problem === void 0 ? void 0 : { problem });
    await this.applyErrorInterceptors(error, config);
    throw error;
  }
  async processResponse(response, config) {
    if (!response.ok) await this.handleErrorResponse(response, config);
    if (response.status === HTTP_STATUS.NO_CONTENT) return;
    const contentType = response.headers.get("content-type");
    if (contentType == null ? void 0 : contentType.includes(MIME_TYPES.JSON)) {
      const body = await response.text();
      if (!body.trim()) return;
      const result = JSON.parse(body);
      if (!isApiResultEnvelope(result)) return result;
      if (!SUCCESS_CODES.includes(result.code) && !SUCCESS_CODES.includes(String(result.code))) throw SdkError.fromApiResult(result, response.status);
      return result.data;
    }
    if (contentType == null ? void 0 : contentType.includes("text/")) return await response.text();
    return await response.json();
  }
  async executeFetch(url, options) {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, options.timeout);
    const abortHandler = () => controller.abort();
    if (options.signal) {
      if (options.signal.aborted) controller.abort();
      else options.signal.addEventListener("abort", abortHandler, { once: true });
    }
    try {
      this.logger.debug(`${options.method} ${url}`);
      return await fetch(url, {
        method: options.method,
        headers: options.headers,
        ...options.body !== void 0 ? { body: options.body } : {},
        signal: controller.signal
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          if (timedOut) throw new TimeoutError(`Request timeout after ${options.timeout}ms`, options.timeout);
          throw new CancelledError("Request was cancelled");
        }
        throw new NetworkError(error.message);
      }
      throw new NetworkError("Unknown network error");
    } finally {
      clearTimeout(timeoutId);
      if (options.signal) options.signal.removeEventListener("abort", abortHandler);
    }
  }
  async execute(config) {
    var _a;
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    const serializedBody = this.serializeRequestBody(processedConfig.body, headers);
    const response = await this.executeFetch(url, {
      method: processedConfig.method,
      headers,
      ...serializedBody !== void 0 ? { body: serializedBody } : {},
      timeout: (_a = processedConfig.timeout) != null ? _a : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    return this.processResponse(response, processedConfig);
  }
  async upload(path, options) {
    var _a, _b;
    const formData = new FormData();
    formData.append((_a = options.fieldName) != null ? _a : "file", options.file);
    if (options.additionalData) Object.entries(options.additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const config = {
      url: path,
      method: "POST",
      body: formData,
      skipAuth: false
    };
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    delete headers["Content-Type"];
    const response = await this.executeFetch(url, {
      method: "POST",
      headers,
      body: formData,
      timeout: (_b = processedConfig.timeout) != null ? _b : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    return this.processResponse(response, processedConfig);
  }
  async download(path, _options) {
    var _a;
    const config = {
      url: path,
      method: "GET",
      skipAuth: false
    };
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    const response = await this.executeFetch(url, {
      method: "GET",
      headers,
      timeout: (_a = processedConfig.timeout) != null ? _a : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    if (!response.ok) await this.handleErrorResponse(response, processedConfig);
    return response.blob();
  }
  async *stream(path, options) {
    var _a, _b, _c, _d;
    const config = {
      url: path,
      method: (_a = options == null ? void 0 : options.method) != null ? _a : "POST",
      ...(options == null ? void 0 : options.body) !== void 0 ? { body: options.body } : {},
      ...(options == null ? void 0 : options.headers) !== void 0 ? { headers: options.headers } : {},
      ...(options == null ? void 0 : options.params) !== void 0 ? { params: options.params } : {},
      ...(options == null ? void 0 : options.timeout) !== void 0 ? { timeout: options.timeout } : {},
      ...(options == null ? void 0 : options.signal) !== void 0 ? { signal: options.signal } : {},
      ...(options == null ? void 0 : options.skipAuth) !== void 0 ? { skipAuth: options.skipAuth } : {},
      ...(options == null ? void 0 : options.metadata) !== void 0 ? { metadata: options.metadata } : {}
    };
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    const serializedBody = this.serializeRequestBody(processedConfig.body, headers);
    const response = await this.executeFetch(url, {
      method: processedConfig.method,
      headers,
      ...serializedBody !== void 0 ? { body: serializedBody } : {},
      timeout: (_b = processedConfig.timeout) != null ? _b : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    if (!response.ok) await this.handleErrorResponse(response, processedConfig);
    const reader = (_c = response.body) == null ? void 0 : _c.getReader();
    if (!reader) throw new NetworkError("No response body");
    const decoder = new TextDecoder();
    let buffer = "";
    const eventParser = ((_d = response.headers.get("content-type")) == null ? void 0 : _d.toLowerCase().includes("text/event-stream")) === true ? new ServerSentEventDataParser() : void 0;
    const parseLine = eventParser ? (line) => eventParser.pushLine(line) : normalizeLegacyStreamLine;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const extracted2 = extractStreamLines(buffer);
        buffer = extracted2.remainder;
        for (const line of extracted2.lines) {
          const data = parseLine(line);
          if (data !== void 0) yield data;
        }
      }
      buffer += decoder.decode();
      const extracted = extractStreamLines(buffer, true);
      for (const line of extracted.lines) {
        const data = parseLine(line);
        if (data !== void 0) yield data;
      }
      const finalData = eventParser == null ? void 0 : eventParser.flush();
      if (finalData !== void 0) yield finalData;
    } finally {
      reader.releaseLock();
    }
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/core/types.js
var DEFAULT_RETRY_CONFIG2 = {
  maxRetries: 3,
  retryDelay: 1e3,
  retryBackoff: "exponential",
  maxRetryDelay: 3e4
};
var DEFAULT_CACHE_CONFIG2 = {
  enabled: false,
  ttl: 300 * 1e3,
  maxSize: 100
};
var SUCCESS_CODES2 = [
  0,
  200,
  2e3,
  "0",
  "200",
  "2000"
];
var HTTP_STATUS2 = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};
var MIME_TYPES2 = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
  OCTET_STREAM: "application/octet-stream",
  TEXT_PLAIN: "text/plain",
  TEXT_HTML: "text/html"
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/auth/token-manager.js
var DefaultAuthTokenManager2 = class {
  constructor(initialTokens, events) {
    __publicField(this, "tokens", {});
    __publicField(this, "events");
    if (initialTokens) {
      this.tokens = { ...initialTokens };
      if (initialTokens.expiresIn && !initialTokens.expiresAt) this.tokens.expiresAt = Date.now() + initialTokens.expiresIn * 1e3;
    }
    this.events = events;
  }
  getAccessToken() {
    return this.tokens.accessToken;
  }
  getAuthToken() {
    return this.tokens.authToken;
  }
  getRefreshToken() {
    return this.tokens.refreshToken;
  }
  getTokens() {
    return { ...this.tokens };
  }
  setTokens(tokens) {
    var _a, _b;
    this.tokens = { ...tokens };
    if (tokens.expiresIn && !tokens.expiresAt) this.tokens.expiresAt = Date.now() + tokens.expiresIn * 1e3;
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenSet) == null ? void 0 : _b.call(_a, this.tokens);
  }
  setAccessToken(token) {
    var _a, _b;
    this.tokens.accessToken = token;
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenSet) == null ? void 0 : _b.call(_a, this.tokens);
  }
  setAuthToken(token) {
    var _a, _b;
    this.tokens.authToken = token;
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenSet) == null ? void 0 : _b.call(_a, this.tokens);
  }
  setRefreshToken(token) {
    this.tokens.refreshToken = token;
  }
  clearTokens() {
    var _a, _b;
    this.tokens = {};
    (_b = (_a = this.events) == null ? void 0 : _a.onTokenCleared) == null ? void 0 : _b.call(_a);
  }
  clearAuthToken() {
    delete this.tokens.authToken;
  }
  clearAccessToken() {
    delete this.tokens.accessToken;
  }
  isExpired() {
    var _a, _b;
    if (!this.tokens.expiresAt) return false;
    const expired = Date.now() >= this.tokens.expiresAt;
    if (expired) (_b = (_a = this.events) == null ? void 0 : _a.onTokenExpired) == null ? void 0 : _b.call(_a);
    return expired;
  }
  isValid() {
    return this.hasToken() && !this.isExpired();
  }
  hasToken() {
    return !!(this.tokens.accessToken || this.tokens.authToken);
  }
  hasAuthToken() {
    return !!this.tokens.authToken;
  }
  hasAccessToken() {
    return !!this.tokens.accessToken;
  }
  willExpireIn(seconds) {
    if (!this.tokens.expiresAt) return false;
    return Date.now() + seconds * 1e3 >= this.tokens.expiresAt;
  }
};
function buildAuthHeaders2(authMode, apiKey, tokenManager) {
  const headers = {};
  if (authMode === "apikey") {
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  } else if (authMode === "dual-token") {
    if (tokenManager) {
      const accessToken = tokenManager.getAccessToken();
      const authToken = tokenManager.getAuthToken();
      if (accessToken) headers["Access-Token"] = accessToken;
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    }
  }
  return headers;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/utils/logger.js
var LOG_LEVELS2 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};
var ConsoleLogger2 = class {
  constructor(config = {}) {
    __publicField(this, "level");
    __publicField(this, "prefix");
    __publicField(this, "timestamp");
    __publicField(this, "colors");
    var _a, _b, _c, _d;
    this.level = (_a = config.level) != null ? _a : "info";
    this.prefix = (_b = config.prefix) != null ? _b : "[SDK]";
    this.timestamp = (_c = config.timestamp) != null ? _c : true;
    this.colors = (_d = config.colors) != null ? _d : true;
  }
  formatMessage(level, message) {
    const parts = [];
    if (this.timestamp) parts.push((/* @__PURE__ */ new Date()).toISOString());
    parts.push(this.prefix);
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);
    return parts.join(" ");
  }
  getColorCode(level) {
    if (!this.colors) return "";
    return {
      debug: "\x1B[36m",
      info: "\x1B[32m",
      warn: "\x1B[33m",
      error: "\x1B[31m",
      silent: ""
    }[level];
  }
  getResetCode() {
    return this.colors ? "\x1B[0m" : "";
  }
  log(level, message, ...args) {
    if (LOG_LEVELS2[level] < LOG_LEVELS2[this.level]) return;
    const formattedMessage = this.formatMessage(level, message);
    const output = `${this.getColorCode(level)}${formattedMessage}${this.getResetCode()}`;
    switch (level) {
      case "debug":
        console.debug(output, ...args);
        break;
      case "info":
        console.info(output, ...args);
        break;
      case "warn":
        console.warn(output, ...args);
        break;
      case "error":
        console.error(output, ...args);
        break;
    }
  }
  debug(message, ...args) {
    this.log("debug", message, ...args);
  }
  info(message, ...args) {
    this.log("info", message, ...args);
  }
  warn(message, ...args) {
    this.log("warn", message, ...args);
  }
  error(message, ...args) {
    this.log("error", message, ...args);
  }
  setLevel(level) {
    this.level = level;
  }
};
var noopLogger2 = {
  debug: () => {
  },
  info: () => {
  },
  warn: () => {
  },
  error: () => {
  },
  log: () => {
  },
  setLevel: () => {
  }
};
function createLogger2(config) {
  if ((config == null ? void 0 : config.level) === "silent") return noopLogger2;
  return new ConsoleLogger2(config);
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/utils/cache.js
var MemoryCacheStore2 = class {
  constructor(config = {}) {
    __publicField(this, "cache", /* @__PURE__ */ new Map());
    __publicField(this, "maxSize");
    __publicField(this, "defaultTtl");
    var _a, _b;
    this.maxSize = (_a = config.maxSize) != null ? _a : DEFAULT_CACHE_CONFIG2.maxSize;
    this.defaultTtl = (_b = config.ttl) != null ? _b : DEFAULT_CACHE_CONFIG2.ttl;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }
  set(key, value, ttl) {
    if (this.cache.size >= this.maxSize) this.evictOldest();
    const expiresAt = Date.now() + (ttl != null ? ttl : this.defaultTtl);
    this.cache.set(key, {
      value,
      expiresAt
    });
  }
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Infinity;
    for (const [key, entry] of this.cache) if (entry.expiresAt < oldestTime) {
      oldestTime = entry.expiresAt;
      oldestKey = key;
    }
    if (oldestKey) this.cache.delete(oldestKey);
  }
};
function createCacheStore2(config) {
  return new MemoryCacheStore2(config);
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/errors/index.js
var SdkError2 = class extends Error {
  constructor(message, code = "UNKNOWN", httpStatus, options) {
    var _a, _b;
    super(message, { cause: options == null ? void 0 : options.cause });
    __publicField(this, "code");
    __publicField(this, "httpStatus");
    __publicField(this, "details");
    __publicField(this, "timestamp");
    __publicField(this, "traceId");
    __publicField(this, "problem");
    __publicField(this, "metadata");
    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = options == null ? void 0 : options.details;
    this.timestamp = Date.now();
    this.traceId = (_b = options == null ? void 0 : options.traceId) != null ? _b : (_a = options == null ? void 0 : options.problem) == null ? void 0 : _a.traceId;
    this.problem = options == null ? void 0 : options.problem;
    this.metadata = options == null ? void 0 : options.metadata;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  static fromApiResult(result, httpStatus) {
    const code = String(result.code);
    const message = result.msg || result.message || "Unknown error";
    switch (code) {
      case "400":
      case "4000":
        return new ValidationError2(message);
      case "401":
      case "4010":
        return new AuthenticationError2(message);
      case "403":
      case "4030":
        return new ForbiddenError2(message);
      case "404":
      case "4040":
        return new NotFoundError2(message);
      case "409":
      case "4090":
        return new ConflictError2(message);
      case "429":
      case "4290":
        return new RateLimitError2(message);
      default:
        if (code.startsWith("5")) return new ServerError2(message, httpStatus != null ? httpStatus : HTTP_STATUS2.INTERNAL_SERVER_ERROR);
        return new BusinessError2(message, result.code, result.data);
    }
  }
  static fromHttpStatus(status, message, options) {
    const defaultMessage = message != null ? message : `HTTP Error ${status}`;
    switch (status) {
      case HTTP_STATUS2.BAD_REQUEST:
      case HTTP_STATUS2.UNPROCESSABLE_ENTITY:
        return new ValidationError2(defaultMessage, void 0, options);
      case HTTP_STATUS2.UNAUTHORIZED:
        return new AuthenticationError2(defaultMessage, options);
      case HTTP_STATUS2.FORBIDDEN:
        return new ForbiddenError2(defaultMessage, options);
      case HTTP_STATUS2.NOT_FOUND:
        return new NotFoundError2(defaultMessage, options);
      case HTTP_STATUS2.METHOD_NOT_ALLOWED:
        return new ValidationError2(defaultMessage, void 0, options);
      case HTTP_STATUS2.CONFLICT:
        return new ConflictError2(defaultMessage, options);
      case HTTP_STATUS2.TOO_MANY_REQUESTS:
        return new RateLimitError2(defaultMessage, void 0, options);
      case HTTP_STATUS2.INTERNAL_SERVER_ERROR:
        return new ServerError2(defaultMessage, status, options);
      case HTTP_STATUS2.BAD_GATEWAY:
        return new BadGatewayError2(defaultMessage, options);
      case HTTP_STATUS2.SERVICE_UNAVAILABLE:
        return new ServiceUnavailableError2(defaultMessage, options);
      case HTTP_STATUS2.GATEWAY_TIMEOUT:
        return new GatewayTimeoutError2(defaultMessage, options);
      default:
        if (status >= 500) return new ServerError2(defaultMessage, status, options);
        return new NetworkError2(defaultMessage, options);
    }
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      httpStatus: this.httpStatus,
      details: this.details,
      timestamp: this.timestamp,
      traceId: this.traceId,
      problem: this.problem,
      metadata: this.metadata
    };
  }
  toString() {
    return `${this.name}: ${this.message} (code: ${this.code})`;
  }
  isRetryable() {
    return isRetryableError2(this);
  }
  isAuthError() {
    return this.code === "UNAUTHORIZED" || this.code === "TOKEN_EXPIRED" || this.code === "TOKEN_INVALID";
  }
  isNetworkError() {
    return this.code === "NETWORK_ERROR" || this.code === "TIMEOUT";
  }
  isClientError() {
    return this.httpStatus !== void 0 && this.httpStatus >= 400 && this.httpStatus < 500;
  }
  isServerError() {
    return this.httpStatus !== void 0 && this.httpStatus >= 500;
  }
};
var NetworkError2 = class extends SdkError2 {
  constructor(message = "Network error", options) {
    super(message, "NETWORK_ERROR", void 0, options);
  }
};
var TimeoutError2 = class extends SdkError2 {
  constructor(message = "Request timeout", timeout, options) {
    super(message, "TIMEOUT", void 0, options);
    __publicField(this, "timeout");
    this.timeout = timeout;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      timeout: this.timeout
    };
  }
};
var CancelledError2 = class extends SdkError2 {
  constructor(message = "Request cancelled", options) {
    super(message, "CANCELLED", void 0, options);
  }
};
var AuthenticationError2 = class extends SdkError2 {
  constructor(message = "Authentication failed", options) {
    super(message, "UNAUTHORIZED", HTTP_STATUS2.UNAUTHORIZED, options);
  }
};
var ForbiddenError2 = class extends SdkError2 {
  constructor(message = "Access forbidden", options) {
    super(message, "FORBIDDEN", HTTP_STATUS2.FORBIDDEN, options);
  }
};
var NotFoundError2 = class extends SdkError2 {
  constructor(message = "Resource not found", options) {
    super(message, "NOT_FOUND", HTTP_STATUS2.NOT_FOUND, options);
  }
};
var ValidationError2 = class extends SdkError2 {
  constructor(message = "Validation error", details, options) {
    super(message, "VALIDATION_ERROR", HTTP_STATUS2.BAD_REQUEST, details === void 0 ? options : {
      ...options,
      details
    });
  }
};
var ConflictError2 = class extends SdkError2 {
  constructor(message = "Resource conflict", options) {
    super(message, "CONFLICT", HTTP_STATUS2.CONFLICT, options);
  }
};
var RateLimitError2 = class extends SdkError2 {
  constructor(message = "Rate limit exceeded", retryAfter, options) {
    super(message, "RATE_LIMIT", HTTP_STATUS2.TOO_MANY_REQUESTS, options);
    __publicField(this, "retryAfter");
    this.retryAfter = retryAfter;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter
    };
  }
};
var ServerError2 = class extends SdkError2 {
  constructor(message = "Server error", httpStatus = HTTP_STATUS2.INTERNAL_SERVER_ERROR, options) {
    super(message, "SERVER_ERROR", httpStatus, options);
  }
};
var BadGatewayError2 = class extends ServerError2 {
  constructor(message = "Bad gateway", options) {
    super(message, HTTP_STATUS2.BAD_GATEWAY, options);
    this.code = "BAD_GATEWAY";
  }
};
var ServiceUnavailableError2 = class extends ServerError2 {
  constructor(message = "Service unavailable", options) {
    super(message, HTTP_STATUS2.SERVICE_UNAVAILABLE, options);
    this.code = "SERVICE_UNAVAILABLE";
  }
};
var GatewayTimeoutError2 = class extends ServerError2 {
  constructor(message = "Gateway timeout", options) {
    super(message, HTTP_STATUS2.GATEWAY_TIMEOUT, options);
    this.code = "GATEWAY_TIMEOUT";
  }
};
var BusinessError2 = class extends SdkError2 {
  constructor(message, code, data, options) {
    super(message, "BUSINESS_ERROR", void 0, options);
    __publicField(this, "businessCode");
    __publicField(this, "data");
    this.businessCode = code;
    this.data = data;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      businessCode: this.businessCode,
      data: this.data
    };
  }
};
function isRetryableError2(error) {
  if (!(error instanceof SdkError2)) return false;
  return error instanceof NetworkError2 || error instanceof TimeoutError2 || error instanceof ServerError2 || error instanceof RateLimitError2 || error instanceof BadGatewayError2 || error instanceof ServiceUnavailableError2 || error instanceof GatewayTimeoutError2;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/utils/retry.js
function sleep2(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function calculateDelay2(attempt, baseDelay, backoff, maxDelay) {
  let delay;
  switch (backoff) {
    case "fixed":
      delay = baseDelay;
      break;
    case "linear":
      delay = baseDelay * attempt;
      break;
    case "exponential":
      delay = baseDelay * Math.pow(2, attempt - 1);
      break;
    default:
      delay = baseDelay;
  }
  return Math.min(delay, maxDelay);
}
function shouldRetry2(error, attempt, config) {
  if (attempt >= config.maxRetries) return false;
  if (config.retryCondition) return config.retryCondition(error, attempt);
  return isRetryableError2(error);
}
async function withRetry2(fn, config = {}) {
  const fullConfig = {
    ...DEFAULT_RETRY_CONFIG2,
    ...config
  };
  let lastError;
  let attempt = 0;
  while (attempt <= fullConfig.maxRetries) try {
    return await fn();
  } catch (error) {
    lastError = error;
    attempt++;
    if (!shouldRetry2(lastError, attempt, fullConfig)) throw lastError;
    await sleep2(calculateDelay2(attempt, fullConfig.retryDelay, fullConfig.retryBackoff, fullConfig.maxRetryDelay));
  }
  throw lastError;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/sdkwork-utils/packages/sdkwork-utils-typescript/src/runtime/random.js
function getCrypto2() {
  const crypto = globalThis.crypto;
  if (!(crypto == null ? void 0 : crypto.getRandomValues)) throw new Error("Web Crypto API is not available in this environment.");
  return crypto;
}
function randomBytes2(length) {
  const bytes = new Uint8Array(length);
  getCrypto2().getRandomValues(bytes);
  return bytes;
}
function randomUuid2() {
  var _a, _b;
  const crypto = getCrypto2();
  if (typeof crypto.randomUUID === "function") try {
    return crypto.randomUUID.call(crypto);
  } catch {
  }
  const bytes = randomBytes2(16);
  bytes[6] = ((_a = bytes[6]) != null ? _a : 0) & 15 | 64;
  bytes[8] = ((_b = bytes[8]) != null ? _b : 0) & 63 | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/sdkwork-utils/packages/sdkwork-utils-typescript/src/id.js
function uuid2() {
  return randomUuid2();
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/utils/string.js
var StringUtils2;
(function(StringUtils3) {
  function isEmpty(value) {
    return value === null || value === void 0 || value === "";
  }
  StringUtils3.isEmpty = isEmpty;
  function isNotEmpty(value) {
    return !isEmpty(value);
  }
  StringUtils3.isNotEmpty = isNotEmpty;
  function isBlank4(value) {
    if (isEmpty(value)) return true;
    if (typeof value !== "string") return false;
    return value.trim().length === 0;
  }
  StringUtils3.isBlank = isBlank4;
  function isNotBlank(value) {
    return !isBlank4(value);
  }
  StringUtils3.isNotBlank = isNotBlank;
  function trim4(value) {
    var _a;
    return (_a = value == null ? void 0 : value.trim()) != null ? _a : "";
  }
  StringUtils3.trim = trim4;
  function trimStart(value) {
    var _a;
    return (_a = value == null ? void 0 : value.trimStart()) != null ? _a : "";
  }
  StringUtils3.trimStart = trimStart;
  function trimEnd(value) {
    var _a;
    return (_a = value == null ? void 0 : value.trimEnd()) != null ? _a : "";
  }
  StringUtils3.trimEnd = trimEnd;
  function toLowerCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.toLowerCase()) != null ? _a : "";
  }
  StringUtils3.toLowerCase = toLowerCase;
  function toUpperCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.toUpperCase()) != null ? _a : "";
  }
  StringUtils3.toUpperCase = toUpperCase;
  function capitalize(value) {
    if (isEmpty(value)) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  StringUtils3.capitalize = capitalize;
  function capitalizeWords(value) {
    if (isEmpty(value)) return "";
    return value.split(/\s+/).map(capitalize).join(" ");
  }
  StringUtils3.capitalizeWords = capitalizeWords;
  function camelCase(value) {
    if (isEmpty(value)) return "";
    return value.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "").replace(/^(.)/, (char) => char.toLowerCase());
  }
  StringUtils3.camelCase = camelCase;
  function pascalCase(value) {
    if (isEmpty(value)) return "";
    const camel = camelCase(value);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }
  StringUtils3.pascalCase = pascalCase;
  function kebabCase(value) {
    if (isEmpty(value)) return "";
    return value.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
  }
  StringUtils3.kebabCase = kebabCase;
  function snakeCase(value) {
    if (isEmpty(value)) return "";
    return value.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s-]+/g, "_").toLowerCase();
  }
  StringUtils3.snakeCase = snakeCase;
  function constantCase(value) {
    return snakeCase(value).toUpperCase();
  }
  StringUtils3.constantCase = constantCase;
  function truncate(value, length, suffix = "...") {
    if (isEmpty(value) || value.length <= length) return value != null ? value : "";
    return value.slice(0, length - suffix.length) + suffix;
  }
  StringUtils3.truncate = truncate;
  function truncateWords(value, wordCount2, suffix = "...") {
    if (isEmpty(value)) return "";
    const words2 = value.split(/\s+/);
    if (words2.length <= wordCount2) return value;
    return words2.slice(0, wordCount2).join(" ") + suffix;
  }
  StringUtils3.truncateWords = truncateWords;
  function padStart(value, length, padChar = " ") {
    var _a;
    return (_a = value == null ? void 0 : value.padStart(length, padChar)) != null ? _a : "";
  }
  StringUtils3.padStart = padStart;
  function padEnd(value, length, padChar = " ") {
    var _a;
    return (_a = value == null ? void 0 : value.padEnd(length, padChar)) != null ? _a : "";
  }
  StringUtils3.padEnd = padEnd;
  function repeat(value, count) {
    if (isEmpty(value) || count <= 0) return "";
    return value.repeat(count);
  }
  StringUtils3.repeat = repeat;
  function reverse(value) {
    if (isEmpty(value)) return "";
    return value.split("").reverse().join("");
  }
  StringUtils3.reverse = reverse;
  function startsWith(value, prefix) {
    var _a;
    return (_a = value == null ? void 0 : value.startsWith(prefix)) != null ? _a : false;
  }
  StringUtils3.startsWith = startsWith;
  function endsWith(value, suffix) {
    var _a;
    return (_a = value == null ? void 0 : value.endsWith(suffix)) != null ? _a : false;
  }
  StringUtils3.endsWith = endsWith;
  function contains(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.includes(search)) != null ? _a : false;
  }
  StringUtils3.contains = contains;
  function containsIgnoreCase(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.toLowerCase().includes(search.toLowerCase())) != null ? _a : false;
  }
  StringUtils3.containsIgnoreCase = containsIgnoreCase;
  function indexOf(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.indexOf(search)) != null ? _a : -1;
  }
  StringUtils3.indexOf = indexOf;
  function lastIndexOf(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.lastIndexOf(search)) != null ? _a : -1;
  }
  StringUtils3.lastIndexOf = lastIndexOf;
  function substring(value, start, end) {
    if (isEmpty(value)) return "";
    return end !== void 0 ? value.slice(start, end) : value.slice(start);
  }
  StringUtils3.substring = substring;
  function slice(value, start, end) {
    return substring(value, start, end);
  }
  StringUtils3.slice = slice;
  function split(value, separator, limit) {
    if (isEmpty(value)) return [];
    return value.split(separator, limit);
  }
  StringUtils3.split = split;
  function join2(values, separator = "") {
    var _a;
    return (_a = values == null ? void 0 : values.join(separator)) != null ? _a : "";
  }
  StringUtils3.join = join2;
  function replace2(value, search, replacement) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(search, replacement)) != null ? _a : "";
  }
  StringUtils3.replace = replace2;
  function replaceAll(value, search, replacement) {
    var _a;
    return (_a = value == null ? void 0 : value.replaceAll(search, replacement)) != null ? _a : "";
  }
  StringUtils3.replaceAll = replaceAll;
  function remove(value, search) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(search, "")) != null ? _a : "";
  }
  StringUtils3.remove = remove;
  function removeAll(value, search) {
    var _a;
    const regex = typeof search === "string" ? new RegExp(search, "g") : new RegExp(search.source, `${search.flags}g`);
    return (_a = value == null ? void 0 : value.replace(regex, "")) != null ? _a : "";
  }
  StringUtils3.removeAll = removeAll;
  function countOccurrences(value, search) {
    if (isEmpty(value) || isEmpty(search)) return 0;
    return (value.match(new RegExp(escapeRegex(search), "g")) || []).length;
  }
  StringUtils3.countOccurrences = countOccurrences;
  function escapeHtml(value) {
    var _a;
    const htmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return (_a = value == null ? void 0 : value.replace(/[&<>"']/g, (char) => htmlEntities[char] || char)) != null ? _a : "";
  }
  StringUtils3.escapeHtml = escapeHtml;
  function unescapeHtml(value) {
    var _a;
    const htmlEntities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#x27;": "'",
      "&apos;": "'"
    };
    return (_a = value == null ? void 0 : value.replace(/&(?:amp|lt|gt|quot|#39|#x27|apos);/g, (entity) => htmlEntities[entity] || entity)) != null ? _a : "";
  }
  StringUtils3.unescapeHtml = unescapeHtml;
  function escapeRegex(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) != null ? _a : "";
  }
  StringUtils3.escapeRegex = escapeRegex;
  function isNumeric(value) {
    if (isEmpty(value)) return false;
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }
  StringUtils3.isNumeric = isNumeric;
  function isAlpha(value) {
    if (isEmpty(value)) return false;
    return /^[a-zA-Z]+$/.test(value);
  }
  StringUtils3.isAlpha = isAlpha;
  function isAlphanumeric(value) {
    if (isEmpty(value)) return false;
    return /^[a-zA-Z0-9]+$/.test(value);
  }
  StringUtils3.isAlphanumeric = isAlphanumeric;
  function isHex(value) {
    if (isEmpty(value)) return false;
    return /^[0-9a-fA-F]+$/.test(value);
  }
  StringUtils3.isHex = isHex;
  function isUuid(value) {
    if (isEmpty(value)) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
  StringUtils3.isUuid = isUuid;
  function isEmail(value) {
    if (isEmpty(value)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  StringUtils3.isEmail = isEmail;
  function isUrl(value) {
    if (isEmpty(value)) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
  StringUtils3.isUrl = isUrl;
  function isPhoneNumber(value) {
    if (isEmpty(value)) return false;
    return /^\+?[\d\s-()]{10,}$/.test(value);
  }
  StringUtils3.isPhoneNumber = isPhoneNumber;
  function mask(value, start, end, maskChar = "*") {
    if (isEmpty(value)) return "";
    const actualStart = Math.max(0, start);
    const actualEnd = Math.min(value.length, end);
    if (actualStart >= actualEnd) return value;
    const masked = maskChar.repeat(actualEnd - actualStart);
    return value.slice(0, actualStart) + masked + value.slice(actualEnd);
  }
  StringUtils3.mask = mask;
  function maskEmail(value) {
    if (!isEmail(value)) return value;
    const parts = value.split("@");
    const localPart = parts[0];
    const domain = parts[1];
    if (!localPart || !domain) return value;
    return `${mask(localPart, 2, localPart.length - 2)}@${domain}`;
  }
  StringUtils3.maskEmail = maskEmail;
  function maskPhone(value) {
    if (isEmpty(value)) return value;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 7) return value;
    return mask(digits, 3, digits.length - 4);
  }
  StringUtils3.maskPhone = maskPhone;
  function maskCreditCard(value) {
    if (isEmpty(value)) return value;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 8) return value;
    return mask(digits, 4, digits.length - 4);
  }
  StringUtils3.maskCreditCard = maskCreditCard;
  function formatNumber(value, options) {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "";
    return num.toLocaleString(void 0, options);
  }
  StringUtils3.formatNumber = formatNumber;
  function formatCurrency(value, currency = "USD", locale) {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "";
    return num.toLocaleString(locale, {
      style: "currency",
      currency
    });
  }
  StringUtils3.formatCurrency = formatCurrency;
  function formatPercentage(value, decimals = 0) {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "";
    return `${(num * 100).toFixed(decimals)}%`;
  }
  StringUtils3.formatPercentage = formatPercentage;
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = [
      "Bytes",
      "KB",
      "MB",
      "GB",
      "TB",
      "PB"
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }
  StringUtils3.formatBytes = formatBytes;
  function random(length = 16, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
    let result = "";
    for (let i = 0; i < length; i++) result += charset.charAt(Math.floor(Math.random() * charset.length));
    return result;
  }
  StringUtils3.random = random;
  function uuid$1() {
    return uuid2();
  }
  StringUtils3.uuid = uuid$1;
  function slugify(value) {
    var _a;
    return (_a = value == null ? void 0 : value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "")) != null ? _a : "";
  }
  StringUtils3.slugify = slugify;
  function unslugify(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())) != null ? _a : "";
  }
  StringUtils3.unslugify = unslugify;
  function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) if (matrix[0]) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) for (let j = 1; j <= a.length; j++) if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
    else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    return matrix[b.length][a.length];
  }
  StringUtils3.levenshteinDistance = levenshteinDistance;
  function similarity(a, b) {
    if (isEmpty(a) && isEmpty(b)) return 1;
    if (isEmpty(a) || isEmpty(b)) return 0;
    return 1 - levenshteinDistance(a, b) / Math.max(a.length, b.length);
  }
  StringUtils3.similarity = similarity;
  function fuzzyMatch(text, pattern, threshold = 0.6) {
    return similarity(text, pattern) >= threshold;
  }
  StringUtils3.fuzzyMatch = fuzzyMatch;
  function equals(a, b, ignoreCase = false) {
    if (ignoreCase) return (a == null ? void 0 : a.toLowerCase()) === (b == null ? void 0 : b.toLowerCase());
    return a === b;
  }
  StringUtils3.equals = equals;
  function equalsIgnoreCase(a, b) {
    return equals(a, b, true);
  }
  StringUtils3.equalsIgnoreCase = equalsIgnoreCase;
  function wordCount(value) {
    if (isEmpty(value)) return 0;
    return value.trim().split(/\s+/).filter(Boolean).length;
  }
  StringUtils3.wordCount = wordCount;
  function characterCount(value, includeSpaces = true) {
    if (isEmpty(value)) return 0;
    return includeSpaces ? value.length : value.replace(/\s/g, "").length;
  }
  StringUtils3.characterCount = characterCount;
  function lineCount(value) {
    if (isEmpty(value)) return 0;
    return value.split(/\r?\n/).length;
  }
  StringUtils3.lineCount = lineCount;
  function splitLines(value) {
    if (isEmpty(value)) return [];
    return value.split(/\r?\n/);
  }
  StringUtils3.splitLines = splitLines;
  function words(value) {
    if (isEmpty(value)) return [];
    return value.trim().split(/\s+/).filter(Boolean);
  }
  StringUtils3.words = words;
  function charAt(value, index) {
    var _a;
    return (_a = value == null ? void 0 : value.charAt(index)) != null ? _a : "";
  }
  StringUtils3.charAt = charAt;
  function charCodeAt(value, index) {
    var _a;
    return (_a = value == null ? void 0 : value.charCodeAt(index)) != null ? _a : NaN;
  }
  StringUtils3.charCodeAt = charCodeAt;
  function fromCharCode(...codes) {
    return String.fromCharCode(...codes);
  }
  StringUtils3.fromCharCode = fromCharCode;
  function insert(value, index, insertValue) {
    if (isEmpty(value)) return insertValue;
    return value.slice(0, index) + insertValue + value.slice(index);
  }
  StringUtils3.insert = insert;
  function swapCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/[a-zA-Z]/g, (char) => {
      return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
    })) != null ? _a : "";
  }
  StringUtils3.swapCase = swapCase;
  function surround(value, wrapper) {
    return `${wrapper}${value}${wrapper}`;
  }
  StringUtils3.surround = surround;
  function quote(value, quoteChar = '"') {
    return `${quoteChar}${value}${quoteChar}`;
  }
  StringUtils3.quote = quote;
  function unquote(value) {
    if (isEmpty(value)) return "";
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'") || value.startsWith("`") && value.endsWith("`")) return value.slice(1, -1);
    return value;
  }
  StringUtils3.unquote = unquote;
  function wrap(value, prefix, suffix = prefix) {
    return `${prefix}${value}${suffix}`;
  }
  StringUtils3.wrap = wrap;
  function unwrap(value, prefix, suffix = prefix) {
    if (isEmpty(value)) return "";
    if (value.startsWith(prefix) && value.endsWith(suffix)) return value.slice(prefix.length, -suffix.length);
    return value;
  }
  StringUtils3.unwrap = unwrap;
  function template(templateStr, values) {
    var _a;
    return (_a = templateStr == null ? void 0 : templateStr.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      var _a2;
      return String((_a2 = values[key]) != null ? _a2 : "");
    })) != null ? _a : "";
  }
  StringUtils3.template = template;
  function interpolate(templateStr, values) {
    return template(templateStr, values);
  }
  StringUtils3.interpolate = interpolate;
  function dedent(value) {
    const lines = value.split("\n");
    const minIndent = Math.min(...lines.filter((line) => line.trim().length > 0).map((line) => {
      var _a, _b;
      return (_b = (_a = line.match(/^\s*/)) == null ? void 0 : _a[0].length) != null ? _b : 0;
    }));
    return lines.map((line) => line.slice(minIndent)).join("\n");
  }
  StringUtils3.dedent = dedent;
  function indent(value, spaces = 2) {
    const indentation = " ".repeat(spaces);
    return value.split("\n").map((line) => indentation + line).join("\n");
  }
  StringUtils3.indent = indent;
  function center(value, width, padChar = " ") {
    if (isEmpty(value) || value.length >= width) return value != null ? value : "";
    const padding = width - value.length;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return padChar.repeat(leftPad) + value + padChar.repeat(rightPad);
  }
  StringUtils3.center = center;
  function alignLeft(value, width, padChar = " ") {
    return padEnd(value, width, padChar);
  }
  StringUtils3.alignLeft = alignLeft;
  function alignRight(value, width, padChar = " ") {
    return padStart(value, width, padChar);
  }
  StringUtils3.alignRight = alignRight;
  function alignCenter(value, width, padChar = " ") {
    return center(value, width, padChar);
  }
  StringUtils3.alignCenter = alignCenter;
  function toBoolean(value) {
    return [
      "true",
      "1",
      "yes",
      "on",
      "y"
    ].includes(value == null ? void 0 : value.toLowerCase().trim());
  }
  StringUtils3.toBoolean = toBoolean;
  function toNumber(value, defaultValue = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }
  StringUtils3.toNumber = toNumber;
  function toArray(value, separator = ",") {
    return split(value, separator);
  }
  StringUtils3.toArray = toArray;
  function hashCode(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }
  StringUtils3.hashCode = hashCode;
  function isPalindrome(value) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === cleaned.split("").reverse().join("");
  }
  StringUtils3.isPalindrome = isPalindrome;
  function isAnagram(a, b) {
    const normalize2 = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
    return normalize2(a) === normalize2(b);
  }
  StringUtils3.isAnagram = isAnagram;
  function reverseWords(value) {
    var _a;
    return (_a = value == null ? void 0 : value.split(/\s+/).reverse().join(" ")) != null ? _a : "";
  }
  StringUtils3.reverseWords = reverseWords;
  function sortCharacters(value) {
    var _a;
    return (_a = value == null ? void 0 : value.split("").sort().join("")) != null ? _a : "";
  }
  StringUtils3.sortCharacters = sortCharacters;
  function uniqueCharacters(value) {
    return [...new Set(value)].join("");
  }
  StringUtils3.uniqueCharacters = uniqueCharacters;
  function removeDuplicates(value) {
    var _a;
    return (_a = value == null ? void 0 : value.split("").filter((char, index, arr) => arr.indexOf(char) === index).join("")) != null ? _a : "";
  }
  StringUtils3.removeDuplicates = removeDuplicates;
  function longestCommonSubstring(a, b) {
    if (isEmpty(a) || isEmpty(b)) return "";
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
    let maxLength = 0;
    let endIndex = 0;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) if (a[i - 1] === b[j - 1]) {
      matrix[i][j] = matrix[i - 1][j - 1] + 1;
      if (matrix[i][j] > maxLength) {
        maxLength = matrix[i][j];
        endIndex = i;
      }
    }
    return a.slice(endIndex - maxLength, endIndex);
  }
  StringUtils3.longestCommonSubstring = longestCommonSubstring;
  function longestCommonPrefix(strings) {
    var _a, _b, _c;
    if (strings.length === 0) return "";
    if (strings.length === 1) return (_a = strings[0]) != null ? _a : "";
    const sorted = [...strings].sort();
    const first = (_b = sorted[0]) != null ? _b : "";
    const last = (_c = sorted[sorted.length - 1]) != null ? _c : "";
    let i = 0;
    while (i < first.length && first[i] === last[i]) i++;
    return first.slice(0, i);
  }
  StringUtils3.longestCommonPrefix = longestCommonPrefix;
  function longestCommonSuffix(strings) {
    return longestCommonPrefix(strings.map((s) => {
      var _a;
      return (_a = s == null ? void 0 : s.split("").reverse().join("")) != null ? _a : "";
    })).split("").reverse().join("");
  }
  StringUtils3.longestCommonSuffix = longestCommonSuffix;
  function truncateMiddle(value, maxLength, separator = "...") {
    if (isEmpty(value) || value.length <= maxLength) return value != null ? value : "";
    const charsToShow = maxLength - separator.length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return value.slice(0, frontChars) + separator + value.slice(-backChars);
  }
  StringUtils3.truncateMiddle = truncateMiddle;
  function ellipsis(value, maxLength) {
    return truncate(value, maxLength, "...");
  }
  StringUtils3.ellipsis = ellipsis;
  function ellipsisMiddle(value, maxLength) {
    return truncateMiddle(value, maxLength, "...");
  }
  StringUtils3.ellipsisMiddle = ellipsisMiddle;
  function pad2(value, length, padChar = " ") {
    return center(value, length, padChar);
  }
  StringUtils3.pad = pad2;
  function padCenter(value, length, padChar = " ") {
    return center(value, length, padChar);
  }
  StringUtils3.padCenter = padCenter;
  function isAscii(value) {
    return /^[\x00-\x7F]*$/.test(value);
  }
  StringUtils3.isAscii = isAscii;
  function isLowerCase(value) {
    return value === value.toLowerCase();
  }
  StringUtils3.isLowerCase = isLowerCase;
  function isUpperCase(value) {
    return value === value.toUpperCase();
  }
  StringUtils3.isUpperCase = isUpperCase;
  function isCapitalized(value) {
    return value.charAt(0) === value.charAt(0).toUpperCase();
  }
  StringUtils3.isCapitalized = isCapitalized;
  function swapPrefix(value, oldPrefix, newPrefix) {
    if (value.startsWith(oldPrefix)) return newPrefix + value.slice(oldPrefix.length);
    return value;
  }
  StringUtils3.swapPrefix = swapPrefix;
  function swapSuffix(value, oldSuffix, newSuffix) {
    if (value.endsWith(oldSuffix)) return value.slice(0, -oldSuffix.length) + newSuffix;
    return value;
  }
  StringUtils3.swapSuffix = swapSuffix;
  function ensurePrefix(value, prefix) {
    return value.startsWith(prefix) ? value : prefix + value;
  }
  StringUtils3.ensurePrefix = ensurePrefix;
  function ensureSuffix(value, suffix) {
    return value.endsWith(suffix) ? value : value + suffix;
  }
  StringUtils3.ensureSuffix = ensureSuffix;
  function removePrefix(value, prefix) {
    return value.startsWith(prefix) ? value.slice(prefix.length) : value;
  }
  StringUtils3.removePrefix = removePrefix;
  function removeSuffix(value, suffix) {
    return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
  }
  StringUtils3.removeSuffix = removeSuffix;
  function take(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(0, n)) != null ? _a : "";
  }
  StringUtils3.take = take;
  function takeRight(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(-n)) != null ? _a : "";
  }
  StringUtils3.takeRight = takeRight;
  function takeWhile(value, predicate) {
    let result = "";
    for (const char of value != null ? value : "") {
      if (!predicate(char)) break;
      result += char;
    }
    return result;
  }
  StringUtils3.takeWhile = takeWhile;
  function takeRightWhile(value, predicate) {
    var _a, _b;
    let result = "";
    for (let i = ((_a = value == null ? void 0 : value.length) != null ? _a : 0) - 1; i >= 0; i--) {
      const char = (_b = value == null ? void 0 : value.charAt(i)) != null ? _b : "";
      if (!predicate(char)) break;
      result = char + result;
    }
    return result;
  }
  StringUtils3.takeRightWhile = takeRightWhile;
  function drop(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(n)) != null ? _a : "";
  }
  StringUtils3.drop = drop;
  function dropRight(value, n) {
    var _a;
    return (_a = value == null ? void 0 : value.slice(0, -n)) != null ? _a : "";
  }
  StringUtils3.dropRight = dropRight;
  function dropWhile(value, predicate) {
    var _a;
    let i = 0;
    for (const char of value != null ? value : "") {
      if (!predicate(char)) break;
      i++;
    }
    return (_a = value == null ? void 0 : value.slice(i)) != null ? _a : "";
  }
  StringUtils3.dropWhile = dropWhile;
  function dropRightWhile(value, predicate) {
    var _a, _b, _c;
    let i = ((_a = value == null ? void 0 : value.length) != null ? _a : 0) - 1;
    while (i >= 0 && predicate((_b = value == null ? void 0 : value.charAt(i)) != null ? _b : "")) i--;
    return (_c = value == null ? void 0 : value.slice(0, i + 1)) != null ? _c : "";
  }
  StringUtils3.dropRightWhile = dropRightWhile;
  function countLines(value) {
    return lineCount(value);
  }
  StringUtils3.countLines = countLines;
  function getLine(value, lineNumber) {
    var _a;
    return (_a = splitLines(value)[lineNumber]) != null ? _a : "";
  }
  StringUtils3.getLine = getLine;
  function getLines(value) {
    return splitLines(value);
  }
  StringUtils3.getLines = getLines;
  function isSingleLine(value) {
    return !(value == null ? void 0 : value.includes("\n"));
  }
  StringUtils3.isSingleLine = isSingleLine;
  function isMultiLine(value) {
    var _a;
    return (_a = value == null ? void 0 : value.includes("\n")) != null ? _a : false;
  }
  StringUtils3.isMultiLine = isMultiLine;
  function normalizeLineEndings(value, lineEnding = "\n") {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\r\n|\r|\n/g, lineEnding)) != null ? _a : "";
  }
  StringUtils3.normalizeLineEndings = normalizeLineEndings;
  function toCamelCase(value) {
    return camelCase(value);
  }
  StringUtils3.toCamelCase = toCamelCase;
  function toKebabCase(value) {
    return kebabCase(value);
  }
  StringUtils3.toKebabCase = toKebabCase;
  function toSnakeCase(value) {
    return snakeCase(value);
  }
  StringUtils3.toSnakeCase = toSnakeCase;
  function toPascalCase(value) {
    return pascalCase(value);
  }
  StringUtils3.toPascalCase = toPascalCase;
  function toConstantCase(value) {
    return constantCase(value);
  }
  StringUtils3.toConstantCase = toConstantCase;
  function toSentenceCase(value) {
    if (isEmpty(value)) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  StringUtils3.toSentenceCase = toSentenceCase;
  function toTitleCase(value) {
    return capitalizeWords(value);
  }
  StringUtils3.toTitleCase = toTitleCase;
  function toCapitalCase(value) {
    return capitalizeWords(value);
  }
  StringUtils3.toCapitalCase = toCapitalCase;
  function toDotCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/([a-z])([A-Z])/g, "$1.$2").replace(/[-_\s]+/g, ".").toLowerCase()) != null ? _a : "";
  }
  StringUtils3.toDotCase = toDotCase;
  function toPathCase(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/([a-z])([A-Z])/g, "$1/$2").replace(/[-_\s]+/g, "/").toLowerCase()) != null ? _a : "";
  }
  StringUtils3.toPathCase = toPathCase;
  function stripTags(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/<[^>]*>/g, "")) != null ? _a : "";
  }
  StringUtils3.stripTags = stripTags;
  function stripNumbers(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\d+/g, "")) != null ? _a : "";
  }
  StringUtils3.stripNumbers = stripNumbers;
  function stripWhitespace(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\s+/g, "")) != null ? _a : "";
  }
  StringUtils3.stripWhitespace = stripWhitespace;
  function stripPunctuation(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/[^\w\s]/g, "")) != null ? _a : "";
  }
  StringUtils3.stripPunctuation = stripPunctuation;
  function normalizeWhitespace(value) {
    var _a;
    return (_a = value == null ? void 0 : value.replace(/\s+/g, " ").trim()) != null ? _a : "";
  }
  StringUtils3.normalizeWhitespace = normalizeWhitespace;
  function includesAll(value, searches) {
    return searches.every((search) => {
      var _a;
      return (_a = value == null ? void 0 : value.includes(search)) != null ? _a : false;
    });
  }
  StringUtils3.includesAll = includesAll;
  function includesAny(value, searches) {
    return searches.some((search) => {
      var _a;
      return (_a = value == null ? void 0 : value.includes(search)) != null ? _a : false;
    });
  }
  StringUtils3.includesAny = includesAny;
})(StringUtils2 || (StringUtils2 = {}));

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/utils/encoding.js
var Encoding2;
(function(Encoding3) {
  function base64Encode4(input) {
    var _a, _b, _c;
    let bytes;
    if (typeof input === "string") bytes = new TextEncoder().encode(input);
    else bytes = input;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = "";
    let i = 0;
    while (i < bytes.length) {
      const a = (_a = bytes[i++]) != null ? _a : 0;
      const b = i < bytes.length ? (_b = bytes[i++]) != null ? _b : 0 : 0;
      const c = i < bytes.length ? (_c = bytes[i++]) != null ? _c : 0 : 0;
      const bitmap = a << 16 | b << 8 | c;
      result += chars[bitmap >> 18 & 63];
      result += chars[bitmap >> 12 & 63];
      result += i > bytes.length + 1 ? "=" : chars[bitmap >> 6 & 63];
      result += i > bytes.length ? "=" : chars[bitmap & 63];
    }
    return result;
  }
  Encoding3.base64Encode = base64Encode4;
  function base64Decode4(input) {
    var _a, _b, _c, _d;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    input = input.replace(/[^A-Za-z0-9+/]/g, "");
    const len = input.length;
    let result = "";
    let i = 0;
    while (i < len) {
      const a = chars.indexOf((_a = input[i++]) != null ? _a : "");
      const b = chars.indexOf((_b = input[i++]) != null ? _b : "");
      const c = chars.indexOf((_c = input[i++]) != null ? _c : "");
      const d = chars.indexOf((_d = input[i++]) != null ? _d : "");
      const bitmap = a << 18 | b << 12 | c << 6 | d;
      result += String.fromCharCode(bitmap >> 16 & 255);
      if (c !== 64 && input[i - 2] !== "=") result += String.fromCharCode(bitmap >> 8 & 255);
      if (d !== 64 && input[i - 1] !== "=") result += String.fromCharCode(bitmap & 255);
    }
    return result;
  }
  Encoding3.base64Decode = base64Decode4;
  function base64UrlEncode4(input) {
    return base64Encode4(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  Encoding3.base64UrlEncode = base64UrlEncode4;
  function base64UrlDecode4(input) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad2 = input.length % 4;
    if (pad2) input += "=".repeat(4 - pad2);
    return base64Decode4(input);
  }
  Encoding3.base64UrlDecode = base64UrlDecode4;
  function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  Encoding3.base64ToBytes = base64ToBytes;
  function bytesToBase64(bytes) {
    var _a;
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode((_a = bytes[i]) != null ? _a : 0);
    return btoa(binary);
  }
  Encoding3.bytesToBase64 = bytesToBase64;
  function utf8Encode(input) {
    return new TextEncoder().encode(input);
  }
  Encoding3.utf8Encode = utf8Encode;
  function utf8Decode(input) {
    return new TextDecoder().decode(input);
  }
  Encoding3.utf8Decode = utf8Decode;
  function hexEncode4(input) {
    const bytes = typeof input === "string" ? utf8Encode(input) : input;
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Encoding3.hexEncode = hexEncode4;
  function hexDecode4(input) {
    const bytes = new Uint8Array(input.length / 2);
    for (let i = 0; i < input.length; i += 2) bytes[i / 2] = parseInt(input.substr(i, 2), 16);
    return utf8Decode(bytes);
  }
  Encoding3.hexDecode = hexDecode4;
  function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    return bytes;
  }
  Encoding3.hexToBytes = hexToBytes;
  function bytesToHex(bytes) {
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Encoding3.bytesToHex = bytesToHex;
  function urlEncode(input) {
    return encodeURIComponent(input);
  }
  Encoding3.urlEncode = urlEncode;
  function urlDecode(input) {
    return decodeURIComponent(input);
  }
  Encoding3.urlDecode = urlDecode;
  function urlEncodeComponent(input) {
    return encodeURIComponent(input);
  }
  Encoding3.urlEncodeComponent = urlEncodeComponent;
  function urlDecodeComponent(input) {
    return decodeURIComponent(input);
  }
  Encoding3.urlDecodeComponent = urlDecodeComponent;
  function htmlEncode(input) {
    const htmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    };
    return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
  }
  Encoding3.htmlEncode = htmlEncode;
  function htmlDecode(input) {
    const htmlEntities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#x27;": "'",
      "&#x2F;": "/",
      "&#x60;": "`",
      "&#x3D;": "=",
      "&nbsp;": " "
    };
    return input.replace(/&[^;]+;/g, (entity) => htmlEntities[entity] || entity);
  }
  Encoding3.htmlDecode = htmlDecode;
  function jsonEncode(value, replacer, space) {
    return JSON.stringify(value, replacer, space);
  }
  Encoding3.jsonEncode = jsonEncode;
  function jsonDecode(input) {
    return JSON.parse(input);
  }
  Encoding3.jsonDecode = jsonDecode;
  function jsonEncodePretty(value, indent = 2) {
    return JSON.stringify(value, null, indent);
  }
  Encoding3.jsonEncodePretty = jsonEncodePretty;
  function tryJsonDecode(input, defaultValue) {
    try {
      return JSON.parse(input);
    } catch {
      return defaultValue;
    }
  }
  Encoding3.tryJsonDecode = tryJsonDecode;
  function isJson(input) {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }
  Encoding3.isJson = isJson;
  function xmlEncode(input) {
    const xmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };
    return input.replace(/[&<>"']/g, (char) => xmlEntities[char] || char);
  }
  Encoding3.xmlEncode = xmlEncode;
  function xmlDecode(input) {
    const xmlEntities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&apos;": "'"
    };
    return input.replace(/&[^;]+;/g, (entity) => xmlEntities[entity] || entity);
  }
  Encoding3.xmlDecode = xmlDecode;
  function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  Encoding3.escapeRegex = escapeRegex;
  function escapeSql(input) {
    return input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      return {
        "\0": "\\0",
        "\b": "\\b",
        "	": "\\t",
        "": "\\z",
        "\n": "\\n",
        "\r": "\\r",
        '"': '\\"',
        "'": "\\'",
        "\\": "\\\\",
        "%": "\\%"
      }[char] || char;
    });
  }
  Encoding3.escapeSql = escapeSql;
  function escapeShell(input) {
    return input.replace(/[^A-Za-z0-9_\-.,:\/@\n]/g, (char) => {
      if (char === "\n") return "'\\n'";
      return `\\${char}`;
    });
  }
  Encoding3.escapeShell = escapeShell;
  function escapeCString(input) {
    return input.replace(/[\\"'\n\r\t\b\f\v\0]/g, (char) => {
      return {
        "\\": "\\\\",
        '"': '\\"',
        "'": "\\'",
        "\n": "\\n",
        "\r": "\\r",
        "	": "\\t",
        "\b": "\\b",
        "\f": "\\f",
        "\v": "\\v",
        "\0": "\\0"
      }[char] || char;
    });
  }
  Encoding3.escapeCString = escapeCString;
  function unescapeCString(input) {
    return input.replace(/\\([\\\"'nrtbfv0])/g, (_, char) => {
      return {
        "\\": "\\",
        '"': '"',
        "'": "'",
        "n": "\n",
        "r": "\r",
        "t": "	",
        "b": "\b",
        "f": "\f",
        "v": "\v",
        "0": "\0"
      }[char] || char;
    });
  }
  Encoding3.unescapeCString = unescapeCString;
  function camelToSnake(input) {
    return input.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
  Encoding3.camelToSnake = camelToSnake;
  function snakeToCamel(input) {
    return input.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  Encoding3.snakeToCamel = snakeToCamel;
  function camelToKebab(input) {
    return input.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
  Encoding3.camelToKebab = camelToKebab;
  function kebabToCamel(input) {
    return input.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
  Encoding3.kebabToCamel = kebabToCamel;
  function camelToPascal(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  Encoding3.camelToPascal = camelToPascal;
  function pascalToCamel(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
  }
  Encoding3.pascalToCamel = pascalToCamel;
  function pascalToSnake(input) {
    return camelToSnake(input);
  }
  Encoding3.pascalToSnake = pascalToSnake;
  function snakeToPascal(input) {
    return camelToPascal(snakeToCamel(input));
  }
  Encoding3.snakeToPascal = snakeToPascal;
  function pascalToKebab(input) {
    return camelToKebab(input);
  }
  Encoding3.pascalToKebab = pascalToKebab;
  function kebabToPascal(input) {
    return camelToPascal(kebabToCamel(input));
  }
  Encoding3.kebabToPascal = kebabToPascal;
  function toSnakeCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
  }
  Encoding3.toSnakeCase = toSnakeCase;
  function toKebabCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
  }
  Encoding3.toKebabCase = toKebabCase;
  function toCamelCase(input) {
    return input.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "").replace(/^(.)/, (char) => char.toLowerCase());
  }
  Encoding3.toCamelCase = toCamelCase;
  function toPascalCase(input) {
    const camel = toCamelCase(input);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }
  Encoding3.toPascalCase = toPascalCase;
  function toConstantCase(input) {
    return toSnakeCase(input).toUpperCase();
  }
  Encoding3.toConstantCase = toConstantCase;
  function toSentenceCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
  Encoding3.toSentenceCase = toSentenceCase;
  function toTitleCase(input) {
    return input.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  Encoding3.toTitleCase = toTitleCase;
  function toCapitalCase(input) {
    return input.replace(/[-_\s]+(.)?/g, (_, char) => char ? ` ${char.toUpperCase()}` : "").trim();
  }
  Encoding3.toCapitalCase = toCapitalCase;
  function toDotCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1.$2").replace(/[-_\s]+/g, ".").toLowerCase();
  }
  Encoding3.toDotCase = toDotCase;
  function toPathCase(input) {
    return input.replace(/([a-z])([A-Z])/g, "$1/$2").replace(/[-_\s]+/g, "/").toLowerCase();
  }
  Encoding3.toPathCase = toPathCase;
  function rot13(input) {
    return input.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97;
      return String.fromCharCode((char.charCodeAt(0) - start + 13) % 26 + start);
    });
  }
  Encoding3.rot13 = rot13;
  function caesarCipher(input, shift) {
    return input.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97;
      const shifted = ((char.charCodeAt(0) - start + shift) % 26 + 26) % 26;
      return String.fromCharCode(shifted + start);
    });
  }
  Encoding3.caesarCipher = caesarCipher;
  function caesarDecipher(input, shift) {
    return caesarCipher(input, -shift);
  }
  Encoding3.caesarDecipher = caesarDecipher;
  function xorEncode(input, key) {
    var _a, _b;
    const inputBytes = utf8Encode(input);
    const keyBytes = utf8Encode(key);
    const result = new Uint8Array(inputBytes.length);
    for (let i = 0; i < inputBytes.length; i++) result[i] = ((_a = inputBytes[i]) != null ? _a : 0) ^ ((_b = keyBytes[i % keyBytes.length]) != null ? _b : 0);
    return bytesToHex(result);
  }
  Encoding3.xorEncode = xorEncode;
  function xorDecode(input, key) {
    var _a, _b;
    const inputBytes = hexToBytes(input);
    const keyBytes = utf8Encode(key);
    const result = new Uint8Array(inputBytes.length);
    for (let i = 0; i < inputBytes.length; i++) result[i] = ((_a = inputBytes[i]) != null ? _a : 0) ^ ((_b = keyBytes[i % keyBytes.length]) != null ? _b : 0);
    return utf8Decode(result);
  }
  Encoding3.xorDecode = xorDecode;
  function charCodeEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0));
  }
  Encoding3.charCodeEncode = charCodeEncode;
  function charCodeDecode(codes) {
    return String.fromCharCode(...codes);
  }
  Encoding3.charCodeDecode = charCodeDecode;
  function binaryEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
  }
  Encoding3.binaryEncode = binaryEncode;
  function binaryDecode(input) {
    return input.split(/\s+/).map((byte) => String.fromCharCode(parseInt(byte, 2))).join("");
  }
  Encoding3.binaryDecode = binaryDecode;
  function octalEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0).toString(8).padStart(3, "0")).join(" ");
  }
  Encoding3.octalEncode = octalEncode;
  function octalDecode(input) {
    return input.split(/\s+/).map((byte) => String.fromCharCode(parseInt(byte, 8))).join("");
  }
  Encoding3.octalDecode = octalDecode;
  function decimalEncode(input) {
    return Array.from(input).map((char) => char.charCodeAt(0).toString(10)).join(" ");
  }
  Encoding3.decimalEncode = decimalEncode;
  function decimalDecode(input) {
    return input.split(/\s+/).map((code) => String.fromCharCode(parseInt(code, 10))).join("");
  }
  Encoding3.decimalDecode = decimalDecode;
  function punycodeEncode(input) {
    const prefix = "xn--";
    if (input.startsWith(prefix)) return input;
    const asciiPart = input.replace(/[^\x00-\x7F]/g, "");
    const nonAsciiPart = input.replace(/[\x00-\x7F]/g, "");
    if (!nonAsciiPart) return input;
    return prefix + asciiPart + "-" + nonAsciiPart.split("").map((c) => c.charCodeAt(0).toString(36)).join("");
  }
  Encoding3.punycodeEncode = punycodeEncode;
  function slugify(input) {
    return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  Encoding3.slugify = slugify;
  function unslugify(input) {
    return input.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }
  Encoding3.unslugify = unslugify;
  function queryStringEncode(params) {
    return Object.entries(params).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => {
      if (Array.isArray(value)) return value.map((v) => `${urlEncode(key)}=${urlEncode(String(v))}`).join("&");
      return `${urlEncode(key)}=${urlEncode(String(value))}`;
    }).join("&");
  }
  Encoding3.queryStringEncode = queryStringEncode;
  function queryStringDecode(query) {
    const result = {};
    if (!query) return result;
    query = query.replace(/^[?#]/, "");
    for (const pair of query.split("&")) {
      const parts = pair.split("=");
      const key = parts[0];
      const value = parts[1];
      if (!key) continue;
      const decodedKey = urlDecode(key);
      const decodedValue = value ? urlDecode(value) : "";
      if (result[decodedKey]) if (Array.isArray(result[decodedKey])) result[decodedKey].push(decodedValue);
      else result[decodedKey] = [result[decodedKey], decodedValue];
      else result[decodedKey] = decodedValue;
    }
    return result;
  }
  Encoding3.queryStringDecode = queryStringDecode;
  function formDataEncode(data) {
    return Object.entries(data).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => `${urlEncode(key)}=${urlEncode(String(value))}`).join("&");
  }
  Encoding3.formDataEncode = formDataEncode;
  function mimeTypeToExtension(mimeType) {
    return {
      "application/json": "json",
      "application/xml": "xml",
      "application/pdf": "pdf",
      "application/zip": "zip",
      "application/gzip": "gz",
      "application/x-tar": "tar",
      "application/x-rar-compressed": "rar",
      "application/x-7z-compressed": "7z",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "text/plain": "txt",
      "text/html": "html",
      "text/css": "css",
      "text/javascript": "js",
      "text/csv": "csv",
      "text/xml": "xml",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/svg+xml": "svg",
      "image/webp": "webp",
      "image/bmp": "bmp",
      "image/tiff": "tiff",
      "image/x-icon": "ico",
      "audio/mpeg": "mp3",
      "audio/wav": "wav",
      "audio/ogg": "ogg",
      "audio/aac": "aac",
      "video/mp4": "mp4",
      "video/mpeg": "mpeg",
      "video/webm": "webm",
      "video/ogg": "ogv",
      "video/x-msvideo": "avi",
      "video/quicktime": "mov"
    }[mimeType.toLowerCase()] || "";
  }
  Encoding3.mimeTypeToExtension = mimeTypeToExtension;
  function extensionToMimeType(extension) {
    return {
      "json": "application/json",
      "xml": "application/xml",
      "pdf": "application/pdf",
      "zip": "application/zip",
      "gz": "application/gzip",
      "tar": "application/x-tar",
      "rar": "application/x-rar-compressed",
      "7z": "application/x-7z-compressed",
      "xls": "application/vnd.ms-excel",
      "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "ppt": "application/vnd.ms-powerpoint",
      "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "doc": "application/msword",
      "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "txt": "text/plain",
      "html": "text/html",
      "htm": "text/html",
      "css": "text/css",
      "js": "text/javascript",
      "csv": "text/csv",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif",
      "svg": "image/svg+xml",
      "webp": "image/webp",
      "bmp": "image/bmp",
      "tiff": "image/tiff",
      "tif": "image/tiff",
      "ico": "image/x-icon",
      "mp3": "audio/mpeg",
      "wav": "audio/wav",
      "ogg": "audio/ogg",
      "aac": "audio/aac",
      "mp4": "video/mp4",
      "mpeg": "video/mpeg",
      "mpg": "video/mpeg",
      "webm": "video/webm",
      "ogv": "video/ogg",
      "avi": "video/x-msvideo",
      "mov": "video/quicktime"
    }[extension.toLowerCase().replace(/^\./, "")] || "application/octet-stream";
  }
  Encoding3.extensionToMimeType = extensionToMimeType;
  function charsetEncode(input, _charset) {
    return new TextEncoder().encode(input);
  }
  Encoding3.charsetEncode = charsetEncode;
  function charsetDecode(input, charset) {
    return new TextDecoder(charset).decode(input);
  }
  Encoding3.charsetDecode = charsetDecode;
  function stripBom(input) {
    if (input.charCodeAt(0) === 65279) return input.slice(1);
    return input;
  }
  Encoding3.stripBom = stripBom;
  function addBom(input, bom = "utf-8") {
    return {
      "utf-8": "\uFEFF",
      "utf-16le": "\uFFFE",
      "utf-16be": "\uFEFF"
    }[bom] + input;
  }
  Encoding3.addBom = addBom;
  function normalizeEncoding(input, fromEncoding, toEncoding) {
    return charsetDecode(charsetEncode(input, fromEncoding), toEncoding);
  }
  Encoding3.normalizeEncoding = normalizeEncoding;
  function isValidBase64(input) {
    if (!input || input.length % 4 !== 0) return false;
    return /^[A-Za-z0-9+/]*={0,2}$/.test(input);
  }
  Encoding3.isValidBase64 = isValidBase64;
  function isValidHex(input) {
    return /^[0-9a-fA-F]*$/.test(input) && input.length % 2 === 0;
  }
  Encoding3.isValidHex = isValidHex;
  function isValidUrl(input) {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }
  Encoding3.isValidUrl = isValidUrl;
  function isValidEmail(input) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  }
  Encoding3.isValidEmail = isValidEmail;
  function detectEncoding(input) {
    if (input.charCodeAt(0) === 65279) return "utf-8-bom";
    if (input.charCodeAt(0) === 65534) return "utf-16le";
    if (input.charCodeAt(0) === 65279 && input.charCodeAt(1) === 0) return "utf-16be";
    if (/[\u4e00-\u9fa5]/.test(input)) return "utf-8";
    return "ascii";
  }
  Encoding3.detectEncoding = detectEncoding;
})(Encoding2 || (Encoding2 = {}));
Encoding2.base64Encode;
Encoding2.base64Decode;
Encoding2.base64UrlEncode;
Encoding2.base64UrlDecode;
Encoding2.utf8Encode;
Encoding2.utf8Decode;
Encoding2.hexEncode;
Encoding2.hexDecode;
Encoding2.urlEncode;
Encoding2.urlDecode;
Encoding2.htmlEncode;
Encoding2.htmlDecode;
Encoding2.jsonEncode;
Encoding2.jsonDecode;
Encoding2.xmlEncode;
Encoding2.xmlDecode;
Encoding2.escapeRegex;
Encoding2.escapeSql;
Encoding2.escapeShell;
Encoding2.queryStringEncode;
Encoding2.queryStringDecode;
Encoding2.slugify;
Encoding2.unslugify;

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/utils/date.js
var MILLISECONDS_IN_SECOND2 = 1e3;
var MILLISECONDS_IN_MINUTE2 = 60 * MILLISECONDS_IN_SECOND2;
var MILLISECONDS_IN_HOUR2 = 60 * MILLISECONDS_IN_MINUTE2;
var MILLISECONDS_IN_DAY2 = 24 * MILLISECONDS_IN_HOUR2;
var MILLISECONDS_IN_WEEK2 = 7 * MILLISECONDS_IN_DAY2;
var TIME_UNITS_IN_MS2 = {
  millisecond: 1,
  second: MILLISECONDS_IN_SECOND2,
  minute: MILLISECONDS_IN_MINUTE2,
  hour: MILLISECONDS_IN_HOUR2,
  day: MILLISECONDS_IN_DAY2,
  week: MILLISECONDS_IN_WEEK2,
  month: 30 * MILLISECONDS_IN_DAY2,
  quarter: 90 * MILLISECONDS_IN_DAY2,
  year: 365 * MILLISECONDS_IN_DAY2
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/http/stream-parser.js
function extractStreamLines2(buffer, flush = false) {
  const lines = [];
  let lineStart = 0;
  let index = 0;
  while (index < buffer.length) {
    const character = buffer[index];
    if (character === "\n") {
      lines.push(buffer.slice(lineStart, index));
      index += 1;
      lineStart = index;
      continue;
    }
    if (character === "\r") {
      if (!flush && index === buffer.length - 1) break;
      lines.push(buffer.slice(lineStart, index));
      index += buffer[index + 1] === "\n" ? 2 : 1;
      lineStart = index;
      continue;
    }
    index += 1;
  }
  if (flush && lineStart < buffer.length) {
    lines.push(buffer.slice(lineStart));
    lineStart = buffer.length;
  }
  return {
    lines,
    remainder: buffer.slice(lineStart)
  };
}
var ServerSentEventDataParser2 = class {
  constructor() {
    __publicField(this, "dataLines", []);
    __publicField(this, "firstLine", true);
  }
  pushLine(rawLine) {
    const line = this.firstLine && rawLine.charCodeAt(0) === 65279 ? rawLine.slice(1) : rawLine;
    this.firstLine = false;
    if (line === "") return this.dispatch();
    if (line.startsWith(":")) return;
    const separatorIndex = line.indexOf(":");
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    let value = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "data") this.dataLines.push(value);
  }
  flush() {
    return this.dispatch();
  }
  dispatch() {
    if (this.dataLines.length === 0) return;
    const data = this.dataLines.join("\n");
    this.dataLines = [];
    return data === "" || data === "[DONE]" ? void 0 : data;
  }
};
function normalizeLegacyStreamLine2(line) {
  const trimmedLine = line.trim();
  if (trimmedLine === "" || trimmedLine === "data: [DONE]") return;
  if (trimmedLine.startsWith("data: ")) return trimmedLine.slice(6);
  return trimmedLine;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/sdk-common/dist/http/base-client.js
var SDKWORK_API_PREFIXES2 = [
  "/app/v3/api",
  "/backend/v3/api",
  "/gateway/v3/api"
];
function dedupeSdkWorkApiPath2(baseUrl, path) {
  for (const prefix of SDKWORK_API_PREFIXES2) if (baseUrl.endsWith(prefix) && path.startsWith(prefix)) {
    const remainder = path.slice(prefix.length);
    return remainder.startsWith("/") ? remainder : `/${remainder}`;
  }
  return path;
}
function isApiResultEnvelope2(value) {
  return value !== null && value !== void 0 && typeof value === "object" && !Array.isArray(value) && "code" in value && ("data" in value || "msg" in value || "message" in value);
}
var IDENTITY_PROJECTION_HEADER_NAMES2 = /* @__PURE__ */ new Set([
  "x-sdkwork-tenant-id",
  "x-sdkwork-organization-id",
  "x-sdkwork-user-id",
  "x-sdkwork-actor-id",
  "x-sdkwork-actor-kind",
  "x-sdkwork-session-id",
  "x-sdkwork-app-id",
  "x-sdkwork-environment",
  "x-sdkwork-deployment-profile",
  "x-sdkwork-deployment-mode",
  "x-sdkwork-runtime-target",
  "x-sdkwork-auth-level",
  "x-sdkwork-data-scope",
  "x-sdkwork-permission-scope",
  "x-sdkwork-device-id",
  "x-sdkwork-context-signature",
  "x-sdkwork-subject-tenant-id",
  "x-sdkwork-subject-organization-id",
  "x-sdkwork-subject-user-id",
  "x-sdkwork-subject-timestamp",
  "x-sdkwork-subject-signature",
  "x-tenant-id",
  "x-organization-id",
  "x-platform",
  "x-user-id"
]);
function stripIdentityProjectionHeaders2(headers) {
  for (const name of Object.keys(headers)) if (IDENTITY_PROJECTION_HEADER_NAMES2.has(name.toLowerCase())) delete headers[name];
}
var BaseHttpClient2 = class {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "authConfig");
    __publicField(this, "logger");
    __publicField(this, "cache");
    __publicField(this, "interceptors");
    var _a, _b, _c, _d;
    this.config = {
      baseUrl: config.baseUrl,
      timeout: (_a = config.timeout) != null ? _a : 3e4,
      headers: (_b = config.headers) != null ? _b : {},
      retry: {
        maxRetries: 3,
        retryDelay: 1e3,
        retryBackoff: "exponential",
        maxRetryDelay: 3e4,
        ...config.retry
      },
      cache: {
        enabled: false,
        ttl: 300 * 1e3,
        maxSize: 100,
        ...config.cache
      },
      logger: {
        level: "info",
        prefix: "[SDK]",
        timestamp: true,
        colors: true,
        ...config.logger
      }
    };
    this.logger = createLogger2(this.config.logger);
    this.cache = createCacheStore2(this.config.cache);
    this.interceptors = (_c = config.interceptors) != null ? _c : {
      request: [],
      response: [],
      error: []
    };
    const authMode = this.determineAuthMode(config);
    const tokenManager = (_d = config.tokenManager) != null ? _d : new DefaultAuthTokenManager2({
      ...config.accessToken !== void 0 ? { accessToken: config.accessToken } : {},
      ...config.authToken !== void 0 ? { authToken: config.authToken } : {}
    });
    this.authConfig = {
      authMode,
      ...config.apiKey !== void 0 ? { apiKey: config.apiKey } : {},
      tokenManager
    };
  }
  determineAuthMode(config) {
    if (config.apiKey) return "apikey";
    return "dual-token";
  }
  getAuthMode() {
    return this.authConfig.authMode;
  }
  setAuthMode(mode) {
    this.authConfig.authMode = mode;
  }
  getTokenManager() {
    return this.authConfig.tokenManager;
  }
  setTokenManager(manager) {
    this.authConfig.tokenManager = manager;
  }
  setApiKey(apiKey) {
    var _a;
    this.authConfig.apiKey = apiKey;
    this.authConfig.authMode = "apikey";
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.clearTokens();
  }
  setAuthToken(token) {
    var _a;
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.setAuthToken(token);
    if (this.authConfig.authMode === "apikey") {
      this.authConfig.authMode = "dual-token";
      delete this.authConfig.apiKey;
    }
  }
  setAccessToken(token) {
    var _a;
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.setAccessToken(token);
    if (this.authConfig.authMode === "apikey") {
      this.authConfig.authMode = "dual-token";
      delete this.authConfig.apiKey;
    }
  }
  clearAuthToken() {
    var _a;
    (_a = this.authConfig.tokenManager) == null ? void 0 : _a.clearTokens();
  }
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
    return () => {
      const index = this.interceptors.request.indexOf(interceptor);
      if (index > -1) this.interceptors.request.splice(index, 1);
    };
  }
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
    return () => {
      const index = this.interceptors.response.indexOf(interceptor);
      if (index > -1) this.interceptors.response.splice(index, 1);
    };
  }
  addErrorInterceptor(interceptor) {
    this.interceptors.error.push(interceptor);
    return () => {
      const index = this.interceptors.error.indexOf(interceptor);
      if (index > -1) this.interceptors.error.splice(index, 1);
    };
  }
  clearCache() {
    this.cache.clear();
  }
  getConfig() {
    var _a, _b;
    return {
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      authMode: this.authConfig.authMode,
      apiKey: this.authConfig.apiKey,
      accessToken: (_a = this.authConfig.tokenManager) == null ? void 0 : _a.getAccessToken(),
      authToken: (_b = this.authConfig.tokenManager) == null ? void 0 : _b.getAuthToken()
    };
  }
  isAuthenticated() {
    var _a, _b;
    return (_b = (_a = this.authConfig.tokenManager) == null ? void 0 : _a.isValid()) != null ? _b : false;
  }
  buildBaseUrl(path, params) {
    const baseUrl = this.config.baseUrl.replace(/\/$/, "");
    let url = `${baseUrl}${dedupeSdkWorkApiPath2(baseUrl, path.startsWith("/") ? path : `/${path}`)}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== void 0 && item !== null) searchParams.append(key, String(item));
          });
          return;
        }
        if (value !== void 0 && value !== null) searchParams.append(key, String(value));
      });
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }
    return url;
  }
  buildHeaders(config, skipAuth = false) {
    const headers = {
      "Content-Type": MIME_TYPES2.JSON,
      ...this.config.headers,
      ...config.headers
    };
    if (!skipAuth && !config.skipAuth) {
      const authHeaders = buildAuthHeaders2(this.authConfig.authMode, this.authConfig.apiKey, this.authConfig.tokenManager);
      Object.assign(headers, authHeaders);
    }
    stripIdentityProjectionHeaders2(headers);
    return headers;
  }
  serializeRequestBody(body, headers) {
    if (body === void 0 || body === null) return;
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      delete headers["Content-Type"];
      return body;
    }
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      return body.toString();
    }
    if (typeof Blob !== "undefined" && body instanceof Blob) {
      delete headers["Content-Type"];
      return body;
    }
    if (typeof ArrayBuffer !== "undefined") {
      if (body instanceof ArrayBuffer) {
        delete headers["Content-Type"];
        return body;
      }
      if (ArrayBuffer.isView(body)) {
        delete headers["Content-Type"];
        return body;
      }
    }
    if (typeof body === "string") {
      headers["Content-Type"] = headers["Content-Type"] || "text/plain;charset=UTF-8";
      return body;
    }
    return JSON.stringify(body);
  }
  async applyRequestInterceptors(config) {
    let processedConfig = config;
    for (const interceptor of this.interceptors.request) processedConfig = await interceptor(processedConfig);
    return processedConfig;
  }
  async applyResponseInterceptors(response, config) {
    let processedResponse = response;
    for (const interceptor of this.interceptors.response) processedResponse = await interceptor(processedResponse, config);
    return processedResponse;
  }
  async applyErrorInterceptors(error, config) {
    for (const interceptor of this.interceptors.error) await interceptor(error, config);
  }
  async handleErrorResponse(response, config) {
    var _a;
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let problem;
    try {
      const result = await response.json();
      errorMessage = String(result.detail || result.msg || result.message || result.title || errorMessage);
      if (((_a = response.headers.get("content-type")) == null ? void 0 : _a.includes("application/problem+json")) || "status" in result && "code" in result && "traceId" in result) problem = result;
    } catch {
    }
    const error = SdkError2.fromHttpStatus(response.status, errorMessage, problem === void 0 ? void 0 : { problem });
    await this.applyErrorInterceptors(error, config);
    throw error;
  }
  async processResponse(response, config) {
    if (!response.ok) await this.handleErrorResponse(response, config);
    if (response.status === HTTP_STATUS2.NO_CONTENT) return;
    const contentType = response.headers.get("content-type");
    if (contentType == null ? void 0 : contentType.includes(MIME_TYPES2.JSON)) {
      const body = await response.text();
      if (!body.trim()) return;
      const result = JSON.parse(body);
      if (!isApiResultEnvelope2(result)) return result;
      if (!SUCCESS_CODES2.includes(result.code) && !SUCCESS_CODES2.includes(String(result.code))) throw SdkError2.fromApiResult(result, response.status);
      return result.data;
    }
    if (contentType == null ? void 0 : contentType.includes("text/")) return await response.text();
    return await response.json();
  }
  async executeFetch(url, options) {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, options.timeout);
    const abortHandler = () => controller.abort();
    if (options.signal) if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener("abort", abortHandler, { once: true });
    try {
      this.logger.debug(`${options.method} ${url}`);
      return await fetch(url, {
        method: options.method,
        headers: options.headers,
        ...options.body !== void 0 ? { body: options.body } : {},
        signal: controller.signal
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          if (timedOut) throw new TimeoutError2(`Request timeout after ${options.timeout}ms`, options.timeout);
          throw new CancelledError2("Request was cancelled");
        }
        throw new NetworkError2(error.message);
      }
      throw new NetworkError2("Unknown network error");
    } finally {
      clearTimeout(timeoutId);
      if (options.signal) options.signal.removeEventListener("abort", abortHandler);
    }
  }
  async execute(config) {
    var _a;
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    const serializedBody = this.serializeRequestBody(processedConfig.body, headers);
    const response = await this.executeFetch(url, {
      method: processedConfig.method,
      headers,
      ...serializedBody !== void 0 ? { body: serializedBody } : {},
      timeout: (_a = processedConfig.timeout) != null ? _a : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    return this.processResponse(response, processedConfig);
  }
  async upload(path, options) {
    var _a, _b;
    const formData = new FormData();
    formData.append((_a = options.fieldName) != null ? _a : "file", options.file);
    if (options.additionalData) Object.entries(options.additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const config = {
      url: path,
      method: "POST",
      body: formData,
      skipAuth: false
    };
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    delete headers["Content-Type"];
    const response = await this.executeFetch(url, {
      method: "POST",
      headers,
      body: formData,
      timeout: (_b = processedConfig.timeout) != null ? _b : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    return this.processResponse(response, processedConfig);
  }
  async download(path, _options) {
    var _a;
    const config = {
      url: path,
      method: "GET",
      skipAuth: false
    };
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    const response = await this.executeFetch(url, {
      method: "GET",
      headers,
      timeout: (_a = processedConfig.timeout) != null ? _a : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    if (!response.ok) await this.handleErrorResponse(response, processedConfig);
    return response.blob();
  }
  async *stream(path, options) {
    var _a, _b, _c, _d;
    const config = {
      url: path,
      method: (_a = options == null ? void 0 : options.method) != null ? _a : "POST",
      ...(options == null ? void 0 : options.body) !== void 0 ? { body: options.body } : {},
      ...(options == null ? void 0 : options.headers) !== void 0 ? { headers: options.headers } : {},
      ...(options == null ? void 0 : options.params) !== void 0 ? { params: options.params } : {},
      ...(options == null ? void 0 : options.timeout) !== void 0 ? { timeout: options.timeout } : {},
      ...(options == null ? void 0 : options.signal) !== void 0 ? { signal: options.signal } : {},
      ...(options == null ? void 0 : options.skipAuth) !== void 0 ? { skipAuth: options.skipAuth } : {},
      ...(options == null ? void 0 : options.metadata) !== void 0 ? { metadata: options.metadata } : {}
    };
    const processedConfig = await this.applyRequestInterceptors(config);
    const url = this.buildBaseUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);
    const serializedBody = this.serializeRequestBody(processedConfig.body, headers);
    const response = await this.executeFetch(url, {
      method: processedConfig.method,
      headers,
      ...serializedBody !== void 0 ? { body: serializedBody } : {},
      timeout: (_b = processedConfig.timeout) != null ? _b : this.config.timeout,
      ...processedConfig.signal !== void 0 ? { signal: processedConfig.signal } : {}
    });
    if (!response.ok) await this.handleErrorResponse(response, processedConfig);
    const reader = (_c = response.body) == null ? void 0 : _c.getReader();
    if (!reader) throw new NetworkError2("No response body");
    const decoder = new TextDecoder();
    let buffer = "";
    const eventParser = ((_d = response.headers.get("content-type")) == null ? void 0 : _d.toLowerCase().includes("text/event-stream")) === true ? new ServerSentEventDataParser2() : void 0;
    const parseLine = eventParser ? (line) => eventParser.pushLine(line) : normalizeLegacyStreamLine2;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const extracted2 = extractStreamLines2(buffer);
        buffer = extracted2.remainder;
        for (const line of extracted2.lines) {
          const data = parseLine(line);
          if (data !== void 0) yield data;
        }
      }
      buffer += decoder.decode();
      const extracted = extractStreamLines2(buffer, true);
      for (const line of extracted.lines) {
        const data = parseLine(line);
        if (data !== void 0) yield data;
      }
      const finalData = eventParser == null ? void 0 : eventParser.flush();
      if (finalData !== void 0) yield finalData;
    } finally {
      reader.releaseLock();
    }
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/utils/dist/runtime/binary.js
var textEncoder = new TextEncoder();
function toUtf8(value) {
  return textEncoder.encode(value);
}
var HEX = "0123456789abcdef";
function hexEncode(bytes) {
  let result = "";
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = bytes[index];
    result += HEX[byte >> 4];
    result += HEX[byte & 15];
  }
  return result;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/utils/dist/runtime/sha256.js
var K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var BLOCK_SIZE = 64;
function rotr(value, shift) {
  return value >>> shift | value << 32 - shift;
}
function sha256Block(state, block, offset) {
  const words = new Uint32Array(64);
  for (let index = 0; index < 16; index += 1) {
    const start = offset + index * 4;
    words[index] = block[start] << 24 | block[start + 1] << 16 | block[start + 2] << 8 | block[start + 3];
  }
  for (let index = 16; index < 64; index += 1) {
    const s0 = rotr(words[index - 15], 7) ^ rotr(words[index - 15], 18) ^ words[index - 15] >>> 3;
    const s1 = rotr(words[index - 2], 17) ^ rotr(words[index - 2], 19) ^ words[index - 2] >>> 10;
    words[index] = words[index - 16] + s0 + words[index - 7] + s1 >>> 0;
  }
  let a = state[0];
  let b = state[1];
  let c = state[2];
  let d = state[3];
  let e = state[4];
  let f = state[5];
  let g = state[6];
  let h = state[7];
  for (let index = 0; index < 64; index += 1) {
    const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
    const ch = e & f ^ ~e & g;
    const temp1 = h + s1 + ch + K[index] + words[index] >>> 0;
    const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
    const maj = a & b ^ a & c ^ b & c;
    const temp2 = s0 + maj >>> 0;
    h = g;
    g = f;
    f = e;
    e = d + temp1 >>> 0;
    d = c;
    c = b;
    b = a;
    a = temp1 + temp2 >>> 0;
  }
  state[0] = state[0] + a >>> 0;
  state[1] = state[1] + b >>> 0;
  state[2] = state[2] + c >>> 0;
  state[3] = state[3] + d >>> 0;
  state[4] = state[4] + e >>> 0;
  state[5] = state[5] + f >>> 0;
  state[6] = state[6] + g >>> 0;
  state[7] = state[7] + h >>> 0;
}
function sha256Digest(value) {
  const bitLength = value.length * 8;
  const paddingLength = (BLOCK_SIZE - (value.length + 9) % BLOCK_SIZE) % BLOCK_SIZE + 9;
  const padded = new Uint8Array(value.length + paddingLength);
  padded.set(value);
  padded[value.length] = 128;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLength >>> 0, false);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 4294967296), false);
  const state = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  for (let offset = 0; offset < padded.length; offset += BLOCK_SIZE) {
    sha256Block(state, padded, offset);
  }
  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  for (let index = 0; index < state.length; index += 1) {
    digestView.setUint32(index * 4, state[index], false);
  }
  return digest;
}
var SHA256_INITIAL_STATE = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
function sha256Hex(value) {
  const bytes = typeof value === "string" ? toUtf8(value) : value;
  return hexEncode(sha256Digest(bytes));
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/node_modules/@sdkwork/utils/dist/crypto.js
function sha256Hash(value) {
  return sha256Hex(value);
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/generated/server-openapi/dist/index.js
var _HttpClient = class _HttpClient extends BaseHttpClient2 {
  constructor(config) {
    _HttpClient.assertInitialCredentialMode(config);
    super(config);
    const initialApiKey = _HttpClient.normalizeCredential(config.apiKey);
    if (initialApiKey) {
      this.setApiKey(initialApiKey);
    }
  }
  static assertInitialCredentialMode(config) {
    var _a, _b, _c, _d, _e, _f;
    const apiKey = _HttpClient.normalizeCredential(config == null ? void 0 : config.apiKey);
    if (!apiKey) {
      return;
    }
    const authToken = _HttpClient.normalizeCredential((_c = config == null ? void 0 : config.authToken) != null ? _c : (_b = (_a = config == null ? void 0 : config.tokenManager) == null ? void 0 : _a.getAuthToken) == null ? void 0 : _b.call(_a));
    const accessToken = _HttpClient.normalizeCredential((_f = config == null ? void 0 : config.accessToken) != null ? _f : (_e = (_d = config == null ? void 0 : config.tokenManager) == null ? void 0 : _d.getAccessToken) == null ? void 0 : _e.call(_d));
    if (authToken || accessToken) {
      throw new Error("api-key-or-dual-token client configuration must not mix X-API-Key with auth/access tokens");
    }
  }
  static normalizeCredential(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
  }
  getInternalAuthConfig() {
    const self = this;
    self.authConfig = self.authConfig || {};
    return self.authConfig;
  }
  getInternalHeaders() {
    const self = this;
    self.config = self.config || {};
    self.config.headers = self.config.headers || {};
    return self.config.headers;
  }
  buildRequestHeaders(headers, contentType) {
    const mergedHeaders = {
      ...headers != null ? headers : {}
    };
    if (contentType && contentType.toLowerCase() !== "multipart/form-data") {
      mergedHeaders["Content-Type"] = contentType;
    }
    return Object.keys(mergedHeaders).length > 0 ? mergedHeaders : void 0;
  }
  async applySdkworkRequestBodyFingerprint(headers, body) {
    if (!_HttpClient.SDKWORK_V3_REQUEST_FINGERPRINTS || body == null || !this.hasNonEmptyHeader(headers, "Idempotency-Key") || this.hasNonEmptyHeader(headers, "X-Content-SHA256") || this.hasNonEmptyHeader(headers, "X-Idempotency-Fingerprint")) {
      return headers;
    }
    const fingerprint = await this.createSdkworkRequestBodyFingerprint(body);
    if (!fingerprint) {
      return headers;
    }
    const normalizedFingerprintHeader = fingerprint.header.toLowerCase();
    const preparedHeaders = Object.fromEntries(Object.entries(headers != null ? headers : {}).filter(([headerName]) => headerName.toLowerCase() !== normalizedFingerprintHeader));
    return {
      ...preparedHeaders,
      [fingerprint.header]: fingerprint.value
    };
  }
  hasNonEmptyHeader(headers, name) {
    const normalizedName = name.toLowerCase();
    return Object.entries(headers != null ? headers : {}).some(([headerName, value]) => headerName.toLowerCase() === normalizedName && value.trim().length > 0);
  }
  async createSdkworkRequestBodyFingerprint(body) {
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      const canonicalForm = await this.serializeSdkworkFormData(body);
      return {
        header: "X-Idempotency-Fingerprint",
        value: await this.sha256Hex(new TextEncoder().encode(canonicalForm))
      };
    }
    const bytes = await this.serializeSdkworkRequestBodyBytes(body);
    if (!bytes) {
      return void 0;
    }
    return {
      header: "X-Content-SHA256",
      value: await this.sha256Hex(bytes)
    };
  }
  async serializeSdkworkRequestBodyBytes(body) {
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      return new TextEncoder().encode(body.toString());
    }
    if (typeof Blob !== "undefined" && body instanceof Blob) {
      return new Uint8Array(await body.arrayBuffer());
    }
    if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
      return new Uint8Array(body.slice(0));
    }
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(body)) {
      return new Uint8Array(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
    }
    if (typeof body === "string") {
      return new TextEncoder().encode(body);
    }
    const serialized = JSON.stringify(body);
    return serialized === void 0 ? void 0 : new TextEncoder().encode(serialized);
  }
  async serializeSdkworkFormData(body) {
    const parts = [];
    for (const [name, value] of body.entries()) {
      if (typeof value === "string") {
        parts.push({ kind: "field", name, value });
        continue;
      }
      const bytes = new Uint8Array(await value.arrayBuffer());
      parts.push({
        kind: "file",
        name,
        fileName: "name" in value ? String(value.name) : "",
        contentType: value.type,
        size: value.size,
        contentSha256: await this.sha256Hex(bytes)
      });
    }
    return JSON.stringify(parts);
  }
  async sha256Hex(bytes) {
    return sha256Hash(bytes);
  }
  buildHeaders(config, skipAuth = false) {
    const headers = super.buildHeaders(config, skipAuth);
    if (config == null ? void 0 : config.accessTokenOnly) {
      this.stripCredentialHeaders(headers, true);
      return headers;
    }
    if (!skipAuth && !(config == null ? void 0 : config.skipAuth)) {
      return headers;
    }
    this.stripCredentialHeaders(headers, false);
    return headers;
  }
  stripCredentialHeaders(headers, preserveAccessToken) {
    [
      ...preserveAccessToken ? [] : [_HttpClient.ACCESS_TOKEN_HEADER, "Access-Token"],
      "Authorization",
      ["X", "API", "Key"].join("-"),
      "X-Tenant-Id",
      "X-Organization-Id",
      "X-Platform",
      "X-User-Id",
      "X-Sdkwork-Tenant-Id",
      "X-Sdkwork-Organization-Id",
      "X-Sdkwork-User-Id"
    ].forEach((key) => {
      delete headers[key];
    });
  }
  buildRequestBody(body, contentType) {
    if (body == null) {
      return body;
    }
    const normalizedContentType = (contentType != null ? contentType : "").toLowerCase();
    if (normalizedContentType === "application/x-www-form-urlencoded") {
      return this.encodeFormBody(body);
    }
    if (normalizedContentType === "multipart/form-data") {
      return this.encodeMultipartBody(body);
    }
    return body;
  }
  encodeMultipartBody(body) {
    if (body instanceof FormData) {
      return body;
    }
    const formData = new FormData();
    if (body instanceof Map) {
      for (const [key, value] of body.entries()) {
        this.appendMultipartValue(formData, String(key), value);
      }
      return formData;
    }
    if (typeof body === "object") {
      const record = body;
      for (const [key, value] of Object.entries(record)) {
        if (this.isMultipartMetadataField(key)) {
          continue;
        }
        this.appendMultipartValue(formData, key, value, this.resolveMultipartFileName(record, key));
      }
      return formData;
    }
    this.appendMultipartValue(formData, "value", body);
    return formData;
  }
  appendMultipartValue(formData, key, value, fileName) {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => this.appendMultipartValue(formData, key, item, fileName));
      return;
    }
    if (value instanceof Blob) {
      if (fileName) {
        formData.append(key, value, fileName);
        return;
      }
      formData.append(key, value);
      return;
    }
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }
    formData.append(key, String(value));
  }
  resolveMultipartFileName(record, key) {
    const fieldSpecificName = record[`${key}FileName`];
    if (typeof fieldSpecificName === "string" && fieldSpecificName.trim()) {
      return fieldSpecificName.trim();
    }
    const genericName = record.fileName;
    if (key === "file" && typeof genericName === "string" && genericName.trim()) {
      return genericName.trim();
    }
    return void 0;
  }
  isMultipartMetadataField(key) {
    return key === "fileName" || key.endsWith("FileName");
  }
  encodeFormBody(body) {
    if (body instanceof URLSearchParams) {
      return body.toString();
    }
    if (typeof body === "string") {
      return body;
    }
    const params = new URLSearchParams();
    if (body instanceof Map) {
      for (const [key, value] of body.entries()) {
        this.appendFormValue(params, String(key), value);
      }
      return params.toString();
    }
    if (typeof body === "object") {
      for (const [key, value] of Object.entries(body)) {
        this.appendFormValue(params, key, value);
      }
      return params.toString();
    }
    params.append("value", String(body));
    return params.toString();
  }
  appendFormValue(params, key, value) {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => this.appendFormValue(params, key, item));
      return;
    }
    if (value instanceof Date) {
      params.append(key, value.toISOString());
      return;
    }
    if (typeof value === "object") {
      params.append(key, JSON.stringify(value));
      return;
    }
    params.append(key, String(value));
  }
  setApiKey(apiKey) {
    var _a, _b;
    const authConfig = this.getInternalAuthConfig();
    const headers = this.getInternalHeaders();
    const normalizedApiKey = _HttpClient.normalizeCredential(apiKey);
    if (!normalizedApiKey) {
      throw new Error("X-API-Key must not be empty");
    }
    authConfig.apiKey = normalizedApiKey;
    (_b = (_a = authConfig.tokenManager) == null ? void 0 : _a.clearTokens) == null ? void 0 : _b.call(_a);
    delete headers[_HttpClient.ACCESS_TOKEN_HEADER];
    delete headers["Access-Token"];
    if (_HttpClient.API_KEY_HEADER === "Authorization" && _HttpClient.API_KEY_USE_BEARER) {
      authConfig.authMode = "apikey";
      return;
    }
    authConfig.authMode = "dual-token";
    headers[_HttpClient.API_KEY_HEADER] = _HttpClient.API_KEY_USE_BEARER ? `Bearer ${normalizedApiKey}` : normalizedApiKey;
    if (_HttpClient.API_KEY_HEADER.toLowerCase() !== "authorization") {
      delete headers["Authorization"];
    }
  }
  setAuthToken(token) {
    const headers = this.getInternalHeaders();
    if (_HttpClient.API_KEY_HEADER.toLowerCase() !== "authorization") {
      delete headers[_HttpClient.API_KEY_HEADER];
    }
    const authConfig = this.getInternalAuthConfig();
    authConfig.apiKey = void 0;
    authConfig.authMode = "dual-token";
    super.setAuthToken(token);
  }
  setAccessToken(token) {
    const headers = this.getInternalHeaders();
    if (_HttpClient.API_KEY_HEADER.toLowerCase() !== "authorization") {
      delete headers[_HttpClient.API_KEY_HEADER];
    }
    const authConfig = this.getInternalAuthConfig();
    authConfig.apiKey = void 0;
    authConfig.authMode = "dual-token";
    headers[_HttpClient.ACCESS_TOKEN_HEADER] = token;
    super.setAccessToken(token);
  }
  setTokenManager(manager) {
    const headers = this.getInternalHeaders();
    if (_HttpClient.API_KEY_HEADER.toLowerCase() !== "authorization") {
      delete headers[_HttpClient.API_KEY_HEADER];
    }
    const authConfig = this.getInternalAuthConfig();
    authConfig.apiKey = void 0;
    authConfig.authMode = "dual-token";
    const baseProto = Object.getPrototypeOf(_HttpClient.prototype);
    if (typeof baseProto.setTokenManager === "function") {
      baseProto.setTokenManager.call(this, manager);
      return;
    }
    this.getInternalAuthConfig().tokenManager = manager;
  }
  applyAccessTokenOnlyHeaders(headers) {
    var _a;
    const authConfig = this.getInternalAuthConfig();
    const tokenManager = authConfig.tokenManager;
    const accessToken = (_a = tokenManager == null ? void 0 : tokenManager.getAccessToken) == null ? void 0 : _a.call(tokenManager);
    if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
      throw new Error("access-token-only request requires Access-Token before request dispatch");
    }
    const result = { ...headers != null ? headers : {} };
    this.stripCredentialHeaders(result, false);
    result[_HttpClient.ACCESS_TOKEN_HEADER] = accessToken.trim();
    return result;
  }
  applySdkworkAuthHeaders(headers) {
    var _a, _b;
    const authConfig = this.getInternalAuthConfig();
    const tokenManager = authConfig.tokenManager;
    const accessToken = _HttpClient.normalizeCredential((_a = tokenManager == null ? void 0 : tokenManager.getAccessToken) == null ? void 0 : _a.call(tokenManager));
    const authToken = _HttpClient.normalizeCredential((_b = tokenManager == null ? void 0 : tokenManager.getAuthToken) == null ? void 0 : _b.call(tokenManager));
    const apiKey = _HttpClient.normalizeCredential(authConfig.apiKey);
    if (apiKey) {
      if (authToken || accessToken) {
        throw new Error("api-key-or-dual-token request must not mix X-API-Key with auth/access tokens");
      }
      return headers;
    }
    if (!authToken || !accessToken) {
      throw new Error("api-key-or-dual-token request requires either X-API-Key or both Authorization and Access-Token before request dispatch");
    }
    if (_HttpClient.REQUIRES_SDKWORK_ACCESS_TOKEN && (typeof accessToken !== "string" || accessToken.trim().length === 0)) {
      throw new Error("non-open-api request requires Access-Token before request dispatch");
    }
    if (!accessToken && !authToken) {
      return headers;
    }
    const authHeaders = buildAuthHeaders2("dual-token", void 0, tokenManager);
    return Object.keys(authHeaders).length > 0 ? { ...headers != null ? headers : {}, ...authHeaders } : headers;
  }
  unwrapSdkworkV3Payload(payload, unwrapKind = "data") {
    if (!_HttpClient.SDKWORK_V3_UNWRAP || payload == null || typeof payload !== "object") {
      return payload;
    }
    const record = payload;
    if (record.code !== 0 || !("data" in record)) {
      return this.unwrapSdkworkV3Data(record, unwrapKind);
    }
    const data = record.data;
    if (!data || typeof data !== "object") {
      return data;
    }
    return this.unwrapSdkworkV3Data(data, unwrapKind);
  }
  unwrapSdkworkV3Data(data, unwrapKind) {
    if (unwrapKind === "void") {
      return void 0;
    }
    if (unwrapKind === "item" && "item" in data) {
      return data.item;
    }
    return data;
  }
  async request(path, options = {}) {
    const execute = this.execute;
    if (typeof execute !== "function") {
      throw new Error("BaseHttpClient execute method is not available");
    }
    const { body, headers, contentType, method = "GET", skipAuth, accessTokenOnly, sdkworkUnwrapKind = "data", ...rest } = options;
    const requestHeaders = accessTokenOnly ? this.applyAccessTokenOnlyHeaders(headers) : skipAuth ? headers : this.applySdkworkAuthHeaders(headers);
    const requestBody = this.buildRequestBody(body, contentType);
    const preparedHeaders = await this.applySdkworkRequestBodyFingerprint(this.buildRequestHeaders(requestHeaders, body == null ? void 0 : contentType), requestBody);
    const payload = await withRetry2(
      () => execute.call(this, {
        url: path,
        method,
        ...rest,
        ...skipAuth !== void 0 ? { skipAuth } : {},
        ...accessTokenOnly !== void 0 ? { accessTokenOnly } : {},
        ...requestBody !== void 0 ? { body: requestBody } : {},
        ...preparedHeaders !== void 0 ? { headers: preparedHeaders } : {}
      }),
      // Per-request retry overrides (e.g. disabling 5xx retries for
      // idempotent-terminal operations like turn execution) flow through
      // options.retry; the default keeps maxRetries: 3.
      { maxRetries: 3, ...options.retry }
    );
    return this.unwrapSdkworkV3Payload(payload, sdkworkUnwrapKind);
  }
  async *streamJson(path, options = {}) {
    const stream = BaseHttpClient2.prototype.stream;
    if (typeof stream !== "function") {
      throw new Error("BaseHttpClient stream method is not available");
    }
    const { body, headers, contentType, method = "GET", skipAuth, accessTokenOnly, ...rest } = options;
    const authHeaders = accessTokenOnly ? this.applyAccessTokenOnlyHeaders(headers) : skipAuth ? headers : this.applySdkworkAuthHeaders(headers);
    const requestBody = this.buildRequestBody(body, contentType);
    const requestHeaders = await this.applySdkworkRequestBodyFingerprint(this.buildRequestHeaders({ Accept: "text/event-stream", ...authHeaders != null ? authHeaders : {} }, body == null ? void 0 : contentType), requestBody);
    for await (const data of stream.call(this, path, {
      method,
      ...rest,
      ...skipAuth !== void 0 ? { skipAuth } : {},
      ...accessTokenOnly !== void 0 ? { accessTokenOnly } : {},
      ...requestBody !== void 0 ? { body: requestBody } : {},
      ...requestHeaders !== void 0 ? { headers: requestHeaders } : {}
    })) {
      if (data === "[DONE]") {
        return;
      }
      if (typeof data !== "string" || data.trim().length === 0) {
        continue;
      }
      yield JSON.parse(data);
    }
  }
  async get(path, params, headers) {
    return this.request(path, {
      method: "GET",
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {}
    });
  }
  async post(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "POST",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
  async put(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "PUT",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
  async delete(path, params, headers) {
    return this.request(path, {
      method: "DELETE",
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {}
    });
  }
  async patch(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "PATCH",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
};
__publicField(_HttpClient, "API_KEY_HEADER", "X-API-Key");
__publicField(_HttpClient, "ACCESS_TOKEN_HEADER", "Access-Token");
__publicField(_HttpClient, "API_KEY_USE_BEARER", false);
__publicField(_HttpClient, "SDKWORK_V3_UNWRAP", true);
__publicField(_HttpClient, "SDKWORK_V3_REQUEST_FINGERPRINTS", true);
__publicField(_HttpClient, "REQUIRES_SDKWORK_ACCESS_TOKEN", false);
var HttpClient = _HttpClient;
function createHttpClient(config) {
  return new HttpClient(config);
}
var IM_API_PREFIX = "/im/v3/api";
function imApiPath(path) {
  if (!path) {
    return IM_API_PREFIX;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPrefixRaw = IM_API_PREFIX.trim();
  const normalizedPrefix = normalizedPrefixRaw ? `/${normalizedPrefixRaw.replace(/^\/+|\/+$/g, "")}` : "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!normalizedPrefix || normalizedPrefix === "/") {
    return normalizedPath;
  }
  if (normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`)) {
    return normalizedPath;
  }
  return `${normalizedPrefix}${normalizedPath}`;
}
var PresenceMeApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve current principal presence */
  async retrieve(requestOptions) {
    return this.client.request(imApiPath(`/presence/me`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PresenceApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "me");
    this.client = client;
    this.me = new PresenceMeApi(client);
  }
  /** Publish current client route presence heartbeat */
  async heartbeat(body, requestOptions) {
    return this.client.request(imApiPath(`/presence/heartbeat`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
function createPresenceApi(client) {
  return new PresenceApi(client);
}
var RealtimeEventsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Acknowledge realtime events */
  async ack(body, requestOptions) {
    return this.client.request(imApiPath(`/realtime/events/ack`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** List pending realtime events */
  async list(params, requestOptions) {
    const query = buildQueryString$5([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$5(imApiPath(`/realtime/events`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var RealtimeSubscriptionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Sync realtime subscription targets */
  async sync(body, requestOptions) {
    return this.client.request(imApiPath(`/realtime/subscriptions/sync`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var RealtimeApi = class {
  constructor(client) {
    __publicField(this, "subscriptions");
    __publicField(this, "events");
    this.subscriptions = new RealtimeSubscriptionsApi(client);
    this.events = new RealtimeEventsApi(client);
  }
};
function createRealtimeApi(client) {
  return new RealtimeApi(client);
}
function appendQueryString$5(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function buildQueryString$5(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter$5(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter$5(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent$5(parameter.name)}=${encodeQueryValue$5(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter$5(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter$5(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter$5(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent$5(parameter.name)}=${encodeQueryValue$5(serializePrimitive$5(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter$5(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive$5(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent$5(name)}=${encodeQueryValue$5(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent$5(name)}=${encodeQueryValue$5(values.join(","), allowReserved)}`);
}
function appendObjectParameter$5(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent$5(key)}=${encodeQueryValue$5(serializePrimitive$5(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive$5(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent$5(name)}=${encodeQueryValue$5(serialized, allowReserved)}`);
}
function appendDeepObjectParameter$5(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent$5(name)}=${encodeQueryValue$5(serializePrimitive$5(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent$5(`${name}[${key}]`)}=${encodeQueryValue$5(serializePrimitive$5(entryValue), allowReserved)}`);
  }
}
function serializePrimitive$5(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent$5(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue$5(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}
var CallsSessionsCredentialsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Issue an RTC media participant credential for an IM call */
  async create(rtcSessionId, body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/credentials`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Refresh an expiring RTC media participant credential */
  async refresh(rtcSessionId, body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/credentials/refresh`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var CallsSessionsSignalsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List IM call signaling events */
  async list(rtcSessionId, params, requestOptions) {
    const query = buildQueryString$4([
      { name: "afterSignalSeq", value: params == null ? void 0 : params.afterSignalSeq, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$4(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/signals`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Post an IM call signaling event */
  async create(rtcSessionId, body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/signals`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var CallsSessionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "signals");
    __publicField(this, "credentials");
    this.client = client;
    this.signals = new CallsSessionsSignalsApi(client);
    this.credentials = new CallsSessionsCredentialsApi(client);
  }
  /** Create an IM call signaling session */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Retrieve IM call signaling session state */
  async retrieve(rtcSessionId, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Invite participants into an IM call signaling session */
  async invite(rtcSessionId, body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/invite`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Accept an IM call signaling session */
  async accept(rtcSessionId, body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/accept`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Reject an IM call signaling session */
  async reject(rtcSessionId, body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/reject`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** End an IM call signaling session */
  async end(rtcSessionId, body, requestOptions) {
    return this.client.request(imApiPath(`/calls/sessions/${serializePathParameter$4(rtcSessionId, { name: "rtcSessionId", style: "simple", explode: false })}/end`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var CallsApi = class {
  constructor(client) {
    __publicField(this, "sessions");
    this.sessions = new CallsSessionsApi(client);
  }
};
function createCallsApi(client) {
  return new CallsApi(client);
}
function appendQueryString$4(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter$4(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray$4(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject$4(spec.name, value, style, spec.explode);
  }
  return pathPrefix$4(spec.name, style) + encodePathValue$4(serializePathPrimitive$4(value));
}
function serializePathArray$4(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue$4(serializePathPrimitive$4(item)));
  if (serialized.length === 0) {
    return pathPrefix$4(name, style);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix$4(name, style) + serialized.join(explode ? "." : ",");
}
function serializePathObject$4(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix$4(name, style);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue$4(key)}=${encodePathValue$4(serializePathPrimitive$4(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue$4(key), encodePathValue$4(serializePathPrimitive$4(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue$4(key)}=${encodePathValue$4(serializePathPrimitive$4(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue$4(key), encodePathValue$4(serializePathPrimitive$4(entryValue))]).join(",");
  return pathPrefix$4(name, style) + serialized;
}
function pathPrefix$4(name, style, _objectValue) {
  if (style === "label")
    return ".";
  if (style === "matrix")
    return `;${name}`;
  return "";
}
function encodePathValue$4(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive$4(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildQueryString$4(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter$4(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter$4(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent$4(parameter.name)}=${encodeQueryValue$4(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter$4(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter$4(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter$4(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent$4(parameter.name)}=${encodeQueryValue$4(serializePrimitive$4(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter$4(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive$4(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent$4(name)}=${encodeQueryValue$4(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent$4(name)}=${encodeQueryValue$4(values.join(","), allowReserved)}`);
}
function appendObjectParameter$4(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent$4(key)}=${encodeQueryValue$4(serializePrimitive$4(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive$4(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent$4(name)}=${encodeQueryValue$4(serialized, allowReserved)}`);
}
function appendDeepObjectParameter$4(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent$4(name)}=${encodeQueryValue$4(serializePrimitive$4(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent$4(`${name}[${key}]`)}=${encodeQueryValue$4(serializePrimitive$4(entryValue), allowReserved)}`);
  }
}
function serializePrimitive$4(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent$4(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue$4(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}
var SocialContactsPreferencesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve contact preferences */
  async retrieve(targetUserId, requestOptions) {
    return this.client.request(imApiPath(`/social/contacts/${serializePathParameter$3(targetUserId, { name: "targetUserId", style: "simple", explode: false })}/preferences`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update contact preferences */
  async update(targetUserId, body, requestOptions) {
    return this.client.request(imApiPath(`/social/contacts/${serializePathParameter$3(targetUserId, { name: "targetUserId", style: "simple", explode: false })}/preferences`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var SocialContactsRecommendationsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Create a contact recommendation */
  async create(targetUserId, body, requestOptions) {
    return this.client.request(imApiPath(`/social/contacts/${serializePathParameter$3(targetUserId, { name: "targetUserId", style: "simple", explode: false })}/recommendations`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var SocialContactsTagsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List contact tags */
  async list(params, requestOptions) {
    const query = buildQueryString$3([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$3(imApiPath(`/social/contacts/tags`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create a contact tag */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/social/contacts/tags`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Update a contact tag */
  async update(tagId, body, requestOptions) {
    return this.client.request(imApiPath(`/social/contacts/tags/${serializePathParameter$3(tagId, { name: "tagId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete a contact tag */
  async delete(tagId, requestOptions) {
    return this.client.request(imApiPath(`/social/contacts/tags/${serializePathParameter$3(tagId, { name: "tagId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SocialContactsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "tags");
    __publicField(this, "recommendations");
    __publicField(this, "preferences");
    this.client = client;
    this.tags = new SocialContactsTagsApi(client);
    this.recommendations = new SocialContactsRecommendationsApi(client);
    this.preferences = new SocialContactsPreferencesApi(client);
  }
  /** List social contacts */
  async list(params, requestOptions) {
    const query = buildQueryString$3([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$3(imApiPath(`/social/contacts`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var SocialUserBlocksApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Block a social user */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/social/user_blocks`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Release a social user block */
  async delete(blockId, requestOptions) {
    return this.client.request(imApiPath(`/social/user_blocks/${serializePathParameter$3(blockId, { name: "blockId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SocialFriendshipsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Remove a friendship */
  async remove(friendshipId, requestOptions) {
    return this.client.request(imApiPath(`/social/friendships/${serializePathParameter$3(friendshipId, { name: "friendshipId", style: "simple", explode: false })}/remove`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
var SocialFriendRequestsPendingCountApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve pending incoming friend request count */
  async retrieve(requestOptions) {
    return this.client.request(imApiPath(`/social/friend_requests/pending/count`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var SocialFriendRequestsPendingApi = class {
  constructor(client) {
    __publicField(this, "count");
    this.count = new SocialFriendRequestsPendingCountApi(client);
  }
};
var SocialFriendRequestsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "pending");
    this.client = client;
    this.pending = new SocialFriendRequestsPendingApi(client);
  }
  /** List friend requests */
  async list(params, requestOptions) {
    const query = buildQueryString$3([
      { name: "direction", value: params == null ? void 0 : params.direction, style: "form", explode: true, allowReserved: false },
      { name: "status", value: params == null ? void 0 : params.status, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$3(imApiPath(`/social/friend_requests`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create a friend request */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/social/friend_requests`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Accept a friend request */
  async accept(friendRequestId, requestOptions) {
    return this.client.request(imApiPath(`/social/friend_requests/${serializePathParameter$3(friendRequestId, { name: "friendRequestId", style: "simple", explode: false })}/accept`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Decline a friend request */
  async decline(friendRequestId, requestOptions) {
    return this.client.request(imApiPath(`/social/friend_requests/${serializePathParameter$3(friendRequestId, { name: "friendRequestId", style: "simple", explode: false })}/decline`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Cancel a friend request */
  async cancel(friendRequestId, requestOptions) {
    return this.client.request(imApiPath(`/social/friend_requests/${serializePathParameter$3(friendRequestId, { name: "friendRequestId", style: "simple", explode: false })}/cancel`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
var SocialUsersApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Search social users */
  async list(params, requestOptions) {
    const query = buildQueryString$3([
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$3(imApiPath(`/social/users`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var SocialApi = class {
  constructor(client) {
    __publicField(this, "users");
    __publicField(this, "friendRequests");
    __publicField(this, "friendships");
    __publicField(this, "userBlocks");
    __publicField(this, "contacts");
    this.users = new SocialUsersApi(client);
    this.friendRequests = new SocialFriendRequestsApi(client);
    this.friendships = new SocialFriendshipsApi(client);
    this.userBlocks = new SocialUserBlocksApi(client);
    this.contacts = new SocialContactsApi(client);
  }
};
function createSocialApi(client) {
  return new SocialApi(client);
}
function appendQueryString$3(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter$3(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray$3(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject$3(spec.name, value, style, spec.explode);
  }
  return pathPrefix$3(spec.name, style) + encodePathValue$3(serializePathPrimitive$3(value));
}
function serializePathArray$3(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue$3(serializePathPrimitive$3(item)));
  if (serialized.length === 0) {
    return pathPrefix$3(name, style);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix$3(name, style) + serialized.join(explode ? "." : ",");
}
function serializePathObject$3(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix$3(name, style);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue$3(key)}=${encodePathValue$3(serializePathPrimitive$3(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue$3(key), encodePathValue$3(serializePathPrimitive$3(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue$3(key)}=${encodePathValue$3(serializePathPrimitive$3(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue$3(key), encodePathValue$3(serializePathPrimitive$3(entryValue))]).join(",");
  return pathPrefix$3(name, style) + serialized;
}
function pathPrefix$3(name, style, _objectValue) {
  if (style === "label")
    return ".";
  if (style === "matrix")
    return `;${name}`;
  return "";
}
function encodePathValue$3(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive$3(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildQueryString$3(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter$3(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter$3(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent$3(parameter.name)}=${encodeQueryValue$3(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter$3(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter$3(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter$3(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent$3(parameter.name)}=${encodeQueryValue$3(serializePrimitive$3(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter$3(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive$3(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent$3(name)}=${encodeQueryValue$3(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent$3(name)}=${encodeQueryValue$3(values.join(","), allowReserved)}`);
}
function appendObjectParameter$3(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent$3(key)}=${encodeQueryValue$3(serializePrimitive$3(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive$3(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent$3(name)}=${encodeQueryValue$3(serialized, allowReserved)}`);
}
function appendDeepObjectParameter$3(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent$3(name)}=${encodeQueryValue$3(serializePrimitive$3(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent$3(`${name}[${key}]`)}=${encodeQueryValue$3(serializePrimitive$3(entryValue), allowReserved)}`);
  }
}
function serializePrimitive$3(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent$3(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue$3(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}
var ChatRoomsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Create a live, chat, or game room bound to a group conversation */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/chat/rooms`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Retrieve room metadata and active member count */
  async retrieve(roomId, requestOptions) {
    return this.client.request(imApiPath(`/chat/rooms/${serializePathParameter$2(roomId, { name: "roomId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Enter a room as the authenticated principal */
  async enter(roomId, requestOptions) {
    return this.client.request(imApiPath(`/chat/rooms/${serializePathParameter$2(roomId, { name: "roomId", style: "simple", explode: false })}/enter`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Leave a room as the authenticated principal */
  async leave(roomId, requestOptions) {
    return this.client.request(imApiPath(`/chat/rooms/${serializePathParameter$2(roomId, { name: "roomId", style: "simple", explode: false })}/leave`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
var ChatMessagesReactionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Add a message reaction */
  async create(messageId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/reactions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Remove a message reaction */
  async remove(messageId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/reactions/remove`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatMessagesVisibilityApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Delete message visibility for the current principal */
  async delete(messageId, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/visibility`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var ChatMessagesFavoritesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List message favorites */
  async list(params, requestOptions) {
    const query = buildQueryString$2([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "favoriteType", value: params == null ? void 0 : params.favoriteType, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$2(imApiPath(`/chat/messages/favorites`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Favorite a message */
  async create(messageId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/favorites`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete a message favorite */
  async delete(favoriteId, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/favorites/${serializePathParameter$2(favoriteId, { name: "favoriteId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var ChatMessagesApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "favorites");
    __publicField(this, "visibility");
    __publicField(this, "reactions");
    this.client = client;
    this.favorites = new ChatMessagesFavoritesApi(client);
    this.visibility = new ChatMessagesVisibilityApi(client);
    this.reactions = new ChatMessagesReactionsApi(client);
  }
  /** Search conversation message history */
  async search(params, requestOptions) {
    const query = buildQueryString$2([
      { name: "q", value: params.q, style: "form", explode: true, allowReserved: false },
      { name: "conversationId", value: params.conversationId, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$2(imApiPath(`/chat/messages/search`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Edit a message */
  async edit(messageId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/edit`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Recall a message */
  async recall(messageId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/recall`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Pin a message */
  async pin(messageId, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/pin`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Unpin a message */
  async unpin(messageId, requestOptions) {
    return this.client.request(imApiPath(`/chat/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/unpin`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsPinsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List pinned messages */
  async list(conversationId, params, requestOptions) {
    const query = buildQueryString$2([
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$2(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/pins`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var ChatConversationsMessagesInteractionSummaryApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve message interaction summary */
  async retrieve(conversationId, messageId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/messages/${serializePathParameter$2(messageId, { name: "messageId", style: "simple", explode: false })}/interaction_summary`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsMessagesApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "interactionSummary");
    this.client = client;
    this.interactionSummary = new ChatConversationsMessagesInteractionSummaryApi(client);
  }
  /** List conversation message history */
  async list(conversationId, params, requestOptions) {
    const query = buildQueryString$2([
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$2(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/messages`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Post a conversation message */
  async create(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/messages`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsMemberDirectoryApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List member directory */
  async list(conversationId, params, requestOptions) {
    const query = buildQueryString$2([
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$2(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/member_directory`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var ChatConversationsReadCursorApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve read cursor */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/read_cursor`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update read cursor */
  async update(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/read_cursor`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsProfileApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve conversation profile */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/profile`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update conversation profile */
  async update(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/profile`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsPreferencesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve conversation preferences */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/preferences`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update conversation preferences */
  async update(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/preferences`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsAgentsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve assigned group agents */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/agents`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update assigned group agents */
  async update(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/agents`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PUT", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsMembersCurrentApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve the current conversation member */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members/current`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsMembersApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "current");
    this.client = client;
    this.current = new ChatConversationsMembersCurrentApi(client);
  }
  /** List conversation members */
  async list(conversationId, params, requestOptions) {
    const query = buildQueryString$2([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$2(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Add a conversation member */
  async add(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members/add`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Remove a conversation member */
  async remove(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members/remove`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Transfer conversation owner */
  async transferOwner(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members/transfer_owner`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Change conversation member role */
  async changeRole(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members/change_role`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Leave a conversation */
  async leave(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members/leave`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Accept a conversation invitation */
  async acceptInvitation(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/members/accept_invitation`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsDirectChatsBindingsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Create a direct chat conversation binding */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/direct_chats/bindings`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsDirectChatsApi = class {
  constructor(client) {
    __publicField(this, "bindings");
    this.bindings = new ChatConversationsDirectChatsBindingsApi(client);
  }
};
var ChatConversationsThreadsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Create a thread conversation */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/threads`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsSystemChannelsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Create a system channel */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/system_channels`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Publish a system channel message */
  async publish(conversationId, body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/system_channel/publish`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsAgentHandoffsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Create an agent handoff */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/agent_handoffs`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Retrieve agent handoff state */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/agent_handoff`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Accept agent handoff */
  async accept(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/agent_handoff/accept`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Resolve agent handoff */
  async resolve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/agent_handoff/resolve`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Close agent handoff */
  async close(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}/agent_handoff/close`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsAgentDialogsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Create an agent dialog */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/agent_dialogs`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "agentDialogs");
    __publicField(this, "agentHandoffs");
    __publicField(this, "systemChannels");
    __publicField(this, "threads");
    __publicField(this, "directChats");
    __publicField(this, "members");
    __publicField(this, "agents");
    __publicField(this, "preferences");
    __publicField(this, "profile");
    __publicField(this, "readCursor");
    __publicField(this, "memberDirectory");
    __publicField(this, "messages");
    __publicField(this, "pins");
    this.client = client;
    this.agentDialogs = new ChatConversationsAgentDialogsApi(client);
    this.agentHandoffs = new ChatConversationsAgentHandoffsApi(client);
    this.systemChannels = new ChatConversationsSystemChannelsApi(client);
    this.threads = new ChatConversationsThreadsApi(client);
    this.directChats = new ChatConversationsDirectChatsApi(client);
    this.members = new ChatConversationsMembersApi(client);
    this.agents = new ChatConversationsAgentsApi(client);
    this.preferences = new ChatConversationsPreferencesApi(client);
    this.profile = new ChatConversationsProfileApi(client);
    this.readCursor = new ChatConversationsReadCursorApi(client);
    this.memberDirectory = new ChatConversationsMemberDirectoryApi(client);
    this.messages = new ChatConversationsMessagesApi(client);
    this.pins = new ChatConversationsPinsApi(client);
  }
  /** Create a conversation */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Retrieve conversation summary */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(imApiPath(`/chat/conversations/${serializePathParameter$2(conversationId, { name: "conversationId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var ChatMeWelcomeApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Ensure the current user received the system-agent Welcome message */
  async ensure(requestOptions) {
    return this.client.request(imApiPath(`/chat/me/welcome/ensure`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
var ChatMeApi = class {
  constructor(client) {
    __publicField(this, "welcome");
    this.welcome = new ChatMeWelcomeApi(client);
  }
};
var ChatInboxApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List current inbox window */
  async list(params, requestOptions) {
    const query = buildQueryString$2([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "conversation_type", value: params == null ? void 0 : params.conversationType, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$2(imApiPath(`/chat/inbox`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var ChatApi = class {
  constructor(client) {
    __publicField(this, "inbox");
    __publicField(this, "me");
    __publicField(this, "conversations");
    __publicField(this, "messages");
    __publicField(this, "rooms");
    this.inbox = new ChatInboxApi(client);
    this.me = new ChatMeApi(client);
    this.conversations = new ChatConversationsApi(client);
    this.messages = new ChatMessagesApi(client);
    this.rooms = new ChatRoomsApi(client);
  }
};
function createChatApi(client) {
  return new ChatApi(client);
}
function appendQueryString$2(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter$2(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray$2(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject$2(spec.name, value, style, spec.explode);
  }
  return pathPrefix$2(spec.name, style) + encodePathValue$2(serializePathPrimitive$2(value));
}
function serializePathArray$2(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue$2(serializePathPrimitive$2(item)));
  if (serialized.length === 0) {
    return pathPrefix$2(name, style);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix$2(name, style) + serialized.join(explode ? "." : ",");
}
function serializePathObject$2(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix$2(name, style);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue$2(key)}=${encodePathValue$2(serializePathPrimitive$2(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue$2(key), encodePathValue$2(serializePathPrimitive$2(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue$2(key)}=${encodePathValue$2(serializePathPrimitive$2(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue$2(key), encodePathValue$2(serializePathPrimitive$2(entryValue))]).join(",");
  return pathPrefix$2(name, style) + serialized;
}
function pathPrefix$2(name, style, _objectValue) {
  if (style === "label")
    return ".";
  if (style === "matrix")
    return `;${name}`;
  return "";
}
function encodePathValue$2(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive$2(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildQueryString$2(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter$2(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter$2(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent$2(parameter.name)}=${encodeQueryValue$2(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter$2(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter$2(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter$2(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent$2(parameter.name)}=${encodeQueryValue$2(serializePrimitive$2(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter$2(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive$2(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent$2(name)}=${encodeQueryValue$2(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent$2(name)}=${encodeQueryValue$2(values.join(","), allowReserved)}`);
}
function appendObjectParameter$2(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent$2(key)}=${encodeQueryValue$2(serializePrimitive$2(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive$2(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent$2(name)}=${encodeQueryValue$2(serialized, allowReserved)}`);
}
function appendDeepObjectParameter$2(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent$2(name)}=${encodeQueryValue$2(serializePrimitive$2(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent$2(`${name}[${key}]`)}=${encodeQueryValue$2(serializePrimitive$2(entryValue), allowReserved)}`);
  }
}
function serializePrimitive$2(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent$2(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue$2(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}
var StreamsFramesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List stream frames */
  async list(streamId, params, requestOptions) {
    const query = buildQueryString$1([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString$1(imApiPath(`/streams/${serializePathParameter$1(streamId, { name: "streamId", style: "simple", explode: false })}/frames`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Append a stream frame */
  async create(streamId, body, requestOptions) {
    return this.client.request(imApiPath(`/streams/${serializePathParameter$1(streamId, { name: "streamId", style: "simple", explode: false })}/frames`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var StreamsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "frames");
    this.client = client;
    this.frames = new StreamsFramesApi(client);
  }
  /** Open a stream */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/streams`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Checkpoint a stream */
  async checkpoint(streamId, requestOptions) {
    return this.client.request(imApiPath(`/streams/${serializePathParameter$1(streamId, { name: "streamId", style: "simple", explode: false })}/checkpoint`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Complete a stream */
  async complete(streamId, requestOptions) {
    return this.client.request(imApiPath(`/streams/${serializePathParameter$1(streamId, { name: "streamId", style: "simple", explode: false })}/complete`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
  /** Abort a stream */
  async abort(streamId, requestOptions) {
    return this.client.request(imApiPath(`/streams/${serializePathParameter$1(streamId, { name: "streamId", style: "simple", explode: false })}/abort`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "item" });
  }
};
function createStreamsApi(client) {
  return new StreamsApi(client);
}
function appendQueryString$1(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter$1(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray$1(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject$1(spec.name, value, style, spec.explode);
  }
  return pathPrefix$1(spec.name, style) + encodePathValue$1(serializePathPrimitive$1(value));
}
function serializePathArray$1(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue$1(serializePathPrimitive$1(item)));
  if (serialized.length === 0) {
    return pathPrefix$1(name, style);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix$1(name, style) + serialized.join(explode ? "." : ",");
}
function serializePathObject$1(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix$1(name, style);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue$1(key)}=${encodePathValue$1(serializePathPrimitive$1(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue$1(key), encodePathValue$1(serializePathPrimitive$1(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue$1(key)}=${encodePathValue$1(serializePathPrimitive$1(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue$1(key), encodePathValue$1(serializePathPrimitive$1(entryValue))]).join(",");
  return pathPrefix$1(name, style) + serialized;
}
function pathPrefix$1(name, style, _objectValue) {
  if (style === "label")
    return ".";
  if (style === "matrix")
    return `;${name}`;
  return "";
}
function encodePathValue$1(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive$1(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildQueryString$1(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter$1(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter$1(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent$1(parameter.name)}=${encodeQueryValue$1(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter$1(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter$1(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter$1(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent$1(parameter.name)}=${encodeQueryValue$1(serializePrimitive$1(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter$1(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive$1(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent$1(name)}=${encodeQueryValue$1(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent$1(name)}=${encodeQueryValue$1(values.join(","), allowReserved)}`);
}
function appendObjectParameter$1(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent$1(key)}=${encodeQueryValue$1(serializePrimitive$1(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive$1(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent$1(name)}=${encodeQueryValue$1(serialized, allowReserved)}`);
}
function appendDeepObjectParameter$1(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent$1(name)}=${encodeQueryValue$1(serializePrimitive$1(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent$1(`${name}[${key}]`)}=${encodeQueryValue$1(serializePrimitive$1(entryValue), allowReserved)}`);
  }
}
function serializePrimitive$1(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent$1(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue$1(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}
var SpacesBansApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List spaces bans */
  async list(spaceId, params, requestOptions) {
    const query = buildQueryString([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/bans`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create spaces bans */
  async create(spaceId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/bans`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** retrieve spaces bans */
  async retrieve(spaceId, userId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/bans/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Delete spaces bans */
  async delete(spaceId, userId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/bans/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SpacesInvitesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List spaces invites */
  async list(spaceId, params, requestOptions) {
    const query = buildQueryString([
      { name: "status", value: params == null ? void 0 : params.status, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/invites`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create spaces invites */
  async create(spaceId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/invites`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** retrieve spaces invites */
  async retrieve(spaceId, inviteCode, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/invites/${serializePathParameter(inviteCode, { name: "inviteCode", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Delete spaces invites */
  async delete(spaceId, inviteCode, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/invites/${serializePathParameter(inviteCode, { name: "inviteCode", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
  /** Accept spaces invites */
  async accept(spaceId, inviteCode, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/invites/${serializePathParameter(inviteCode, { name: "inviteCode", style: "simple", explode: false })}/accept`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", sdkworkUnwrapKind: "command" });
  }
};
var SpacesChannelsAccessRulesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List spaces channels access Rules */
  async list(spaceId, channelId, params, requestOptions) {
    const query = buildQueryString([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels/${serializePathParameter(channelId, { name: "channelId", style: "simple", explode: false })}/access_rules`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create spaces channels access Rules */
  async create(spaceId, channelId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels/${serializePathParameter(channelId, { name: "channelId", style: "simple", explode: false })}/access_rules`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete spaces channels access Rules */
  async delete(spaceId, channelId, ruleId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels/${serializePathParameter(channelId, { name: "channelId", style: "simple", explode: false })}/access_rules/${serializePathParameter(ruleId, { name: "ruleId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SpacesChannelsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "accessRules");
    this.client = client;
    this.accessRules = new SpacesChannelsAccessRulesApi(client);
  }
  /** List spaces channels */
  async list(spaceId, params, requestOptions) {
    const query = buildQueryString([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create spaces channels */
  async create(spaceId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** retrieve spaces channels */
  async retrieve(spaceId, channelId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels/${serializePathParameter(channelId, { name: "channelId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update spaces channels */
  async update(spaceId, channelId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels/${serializePathParameter(channelId, { name: "channelId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete spaces channels */
  async delete(spaceId, channelId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/channels/${serializePathParameter(channelId, { name: "channelId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SpacesGroupsMembersApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List spaces groups members */
  async list(spaceId, groupId, params, requestOptions) {
    const query = buildQueryString([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}/members`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create spaces groups members */
  async create(spaceId, groupId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}/members`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** retrieve spaces groups members */
  async retrieve(spaceId, groupId, userId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}/members/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update spaces groups members */
  async update(spaceId, groupId, userId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}/members/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete spaces groups members */
  async delete(spaceId, groupId, userId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}/members/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SpacesGroupsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "members");
    this.client = client;
    this.members = new SpacesGroupsMembersApi(client);
  }
  /** List spaces groups */
  async list(spaceId, params, requestOptions) {
    const query = buildQueryString([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create spaces groups */
  async create(spaceId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** retrieve spaces groups */
  async retrieve(spaceId, groupId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update spaces groups */
  async update(spaceId, groupId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete spaces groups */
  async delete(spaceId, groupId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/groups/${serializePathParameter(groupId, { name: "groupId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SpacesMembersApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** List spaces members */
  async list(spaceId, params, requestOptions) {
    const query = buildQueryString([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/members`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Create spaces members */
  async create(spaceId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/members`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** retrieve spaces members */
  async retrieve(spaceId, userId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/members/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update spaces members */
  async update(spaceId, userId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/members/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete spaces members */
  async delete(spaceId, userId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}/members/${serializePathParameter(userId, { name: "userId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var SpacesApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "members");
    __publicField(this, "groups");
    __publicField(this, "channels");
    __publicField(this, "invites");
    __publicField(this, "bans");
    this.client = client;
    this.members = new SpacesMembersApi(client);
    this.groups = new SpacesGroupsApi(client);
    this.channels = new SpacesChannelsApi(client);
    this.invites = new SpacesInvitesApi(client);
    this.bans = new SpacesBansApi(client);
  }
  /** Create a space */
  async create(body, requestOptions) {
    return this.client.request(imApiPath(`/spaces`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** List spaces */
  async list(params, requestOptions) {
    const query = buildQueryString([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString(imApiPath(`/spaces`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Retrieve a space */
  async retrieve(spaceId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Update a space */
  async update(spaceId, body, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Delete a space */
  async delete(spaceId, requestOptions) {
    return this.client.request(imApiPath(`/spaces/${serializePathParameter(spaceId, { name: "spaceId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
function createSpacesApi(client) {
  return new SpacesApi(client);
}
function appendQueryString(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject(spec.name, value, style, spec.explode);
  }
  return pathPrefix(spec.name, style) + encodePathValue(serializePathPrimitive(value));
}
function serializePathArray(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix(name, style) + serialized.join(explode ? "." : ",");
}
function serializePathObject(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(",");
  return pathPrefix(name, style) + serialized;
}
function pathPrefix(name, style, _objectValue) {
  if (style === "label")
    return ".";
  if (style === "matrix")
    return `;${name}`;
  return "";
}
function encodePathValue(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildQueryString(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(","), allowReserved)}`);
}
function appendObjectParameter(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}
function appendDeepObjectParameter(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}
function serializePrimitive(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}
var SdkworkImClient = class {
  constructor(config) {
    __publicField(this, "httpClient");
    __publicField(this, "presence");
    __publicField(this, "realtime");
    __publicField(this, "calls");
    __publicField(this, "social");
    __publicField(this, "chat");
    __publicField(this, "streams");
    __publicField(this, "spaces");
    this.httpClient = createHttpClient(config);
    this.presence = createPresenceApi(this.httpClient);
    this.realtime = createRealtimeApi(this.httpClient);
    this.calls = createCallsApi(this.httpClient);
    this.social = createSocialApi(this.httpClient);
    this.chat = createChatApi(this.httpClient);
    this.streams = createStreamsApi(this.httpClient);
    this.spaces = createSpacesApi(this.httpClient);
  }
  setApiKey(apiKey) {
    this.httpClient.setApiKey(apiKey);
    return this;
  }
  setAuthToken(token) {
    this.httpClient.setAuthToken(token);
    return this;
  }
  setAccessToken(token) {
    this.httpClient.setAccessToken(token);
    return this;
  }
  setTokenManager(manager) {
    this.httpClient.setTokenManager(manager);
    return this;
  }
  get http() {
    return this.httpClient;
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/identifier-boundary.js
function requireStringIdentifier(value, fieldName) {
  if (typeof value !== "string") {
    throw new TypeError(`${fieldName} must be a string identifier`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new TypeError(`${fieldName} must be a non-empty string identifier`);
  }
  return trimmed;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/calls-module.js
function optionalString(value) {
  return value === void 0 ? null : value;
}
var MAX_INT64 = /* @__PURE__ */ BigInt("9223372036854775807");
function normalizeAfterSignalSeq(value) {
  if (value === void 0) {
    return void 0;
  }
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError("afterSignalSeq must be a non-negative safe integer");
    }
    return String(value);
  }
  const normalized = value.trim();
  if (!/^\d+$/u.test(normalized)) {
    throw new TypeError("afterSignalSeq must be a non-negative integer string");
  }
  let sequence;
  try {
    sequence = BigInt(normalized);
  } catch {
    throw new TypeError("afterSignalSeq must be a non-negative integer string");
  }
  if (sequence > MAX_INT64) {
    throw new RangeError("afterSignalSeq exceeds the signed int64 range");
  }
  return sequence.toString();
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function pickString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return void 0;
}
function parseUserScopeRtcSession(envelope, cachedSession) {
  var _a, _b, _c, _d, _e, _f, _g;
  const inner = isRecord(envelope.payload) ? envelope.payload : envelope;
  const rtcSessionId = pickString(inner.rtc_session_id, inner.rtcSessionId, cachedSession == null ? void 0 : cachedSession.rtcSessionId);
  const conversationId = pickString(inner.conversation_id, inner.conversationId, cachedSession == null ? void 0 : cachedSession.conversationId);
  const rtcMode = pickString(inner.rtc_mode, inner.rtcMode, cachedSession == null ? void 0 : cachedSession.rtcMode);
  const tenantId = (_a = pickString(inner.tenant_id, inner.tenantId, cachedSession == null ? void 0 : cachedSession.tenantId)) != null ? _a : "";
  const state = (_b = pickString(inner.state, cachedSession == null ? void 0 : cachedSession.state)) != null ? _b : "started";
  if (!rtcSessionId || !rtcMode) {
    return null;
  }
  return {
    tenantId,
    rtcSessionId,
    conversationId: conversationId != null ? conversationId : null,
    rtcMode,
    initiatorId: (_c = pickString(inner.initiator_id, inner.initiatorId, cachedSession == null ? void 0 : cachedSession.initiatorId)) != null ? _c : "",
    initiatorKind: (_d = pickString(inner.initiator_kind, inner.initiatorKind, cachedSession == null ? void 0 : cachedSession.initiatorKind)) != null ? _d : "user",
    state,
    signalingStreamId: (_e = pickString(inner.signaling_stream_id, inner.signalingStreamId, cachedSession == null ? void 0 : cachedSession.signalingStreamId)) != null ? _e : null,
    artifactMessageId: (_f = pickString(inner.artifact_message_id, inner.artifactMessageId, cachedSession == null ? void 0 : cachedSession.artifactMessageId)) != null ? _f : null,
    startedAt: (_g = pickString(inner.started_at, inner.startedAt, cachedSession == null ? void 0 : cachedSession.startedAt)) != null ? _g : "",
    ...pickString(inner.ended_at, inner.endedAt, cachedSession == null ? void 0 : cachedSession.endedAt) ? { endedAt: pickString(inner.ended_at, inner.endedAt, cachedSession == null ? void 0 : cachedSession.endedAt) } : {}
  };
}
function normalizeConversationIds(values) {
  return [...new Set((values != null ? values : []).map((value) => value.trim()).filter((value) => value.length > 0))].sort();
}
function parseJsonRecord(value) {
  if (isRecord(value)) {
    return value;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    return void 0;
  }
  try {
    const parsed = JSON.parse(value);
    return isRecord(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function signalPartsFromMessagePayload(payload) {
  const body = isRecord(payload.body) ? payload.body : void 0;
  const parts = Array.isArray(body == null ? void 0 : body.parts) ? body.parts : [];
  return parts.filter((part) => isRecord(part) && pickString(part.kind) === "signal");
}
function parseCallSignals(payload) {
  return signalPartsFromMessagePayload(payload).map((part) => {
    const signalType = pickString(part.signalType);
    const partPayload = parseJsonRecord(part.payload);
    const nestedSignalPayload = parseJsonRecord(partPayload == null ? void 0 : partPayload.signalPayload);
    const signalPayload = nestedSignalPayload ? { ...partPayload, ...nestedSignalPayload } : partPayload;
    if (!signalType || !signalPayload) {
      return void 0;
    }
    return {
      payload: signalPayload,
      signalType
    };
  }).filter((signal) => Boolean(signal));
}
function isOpenIncomingCallState(state) {
  return state === "started";
}
function isClosingCallSignal(signalType, state) {
  return signalType === "rtc.accept" || signalType === "rtc.reject" || signalType === "rtc.end" || state === "rejected" || state === "ended";
}
function shouldRemoveCachedCallSession(signalType, state) {
  return signalType === "rtc.reject" || signalType === "rtc.end" || state === "rejected" || state === "ended";
}
function normalizeCallSignalState(signalType, explicitState, cachedState) {
  if (explicitState) {
    return explicitState;
  }
  switch (signalType) {
    case "rtc.invite":
      return "started";
    case "rtc.accept":
      return "accepted";
    case "rtc.reject":
      return "rejected";
    case "rtc.end":
      return "ended";
    default:
      return cachedState != null ? cachedState : "started";
  }
}
function toRtcSession(signal, messagePayload, context, cachedSession) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const sender = isRecord(messagePayload.sender) ? messagePayload.sender : void 0;
  const rtcSessionId = pickString(signal.payload.rtcSessionId, cachedSession == null ? void 0 : cachedSession.rtcSessionId);
  const conversationId = pickString(signal.payload.conversationId, messagePayload.conversationId, context.scopeId, cachedSession == null ? void 0 : cachedSession.conversationId);
  const rtcMode = pickString(signal.payload.rtcMode, cachedSession == null ? void 0 : cachedSession.rtcMode);
  const state = normalizeCallSignalState(signal.signalType, pickString(signal.payload.state), cachedSession == null ? void 0 : cachedSession.state);
  if (!rtcSessionId || !conversationId || !rtcMode) {
    return null;
  }
  return {
    tenantId: (_a = pickString(signal.payload.tenantId, messagePayload.tenantId, cachedSession == null ? void 0 : cachedSession.tenantId)) != null ? _a : "",
    rtcSessionId,
    conversationId,
    initiatorId: (_b = pickString(signal.payload.initiatorId, cachedSession == null ? void 0 : cachedSession.initiatorId, sender == null ? void 0 : sender.id)) != null ? _b : "",
    initiatorKind: (_c = pickString(signal.payload.initiatorKind, cachedSession == null ? void 0 : cachedSession.initiatorKind, sender == null ? void 0 : sender.kind)) != null ? _c : "user",
    providerPluginId: (_d = pickString(signal.payload.providerPluginId, cachedSession == null ? void 0 : cachedSession.providerPluginId)) != null ? _d : null,
    providerSessionId: (_e = pickString(signal.payload.providerSessionId, cachedSession == null ? void 0 : cachedSession.providerSessionId)) != null ? _e : null,
    accessEndpoint: (_f = pickString(signal.payload.accessEndpoint, cachedSession == null ? void 0 : cachedSession.accessEndpoint)) != null ? _f : null,
    providerRegion: (_g = pickString(signal.payload.providerRegion, cachedSession == null ? void 0 : cachedSession.providerRegion)) != null ? _g : null,
    rtcMode,
    state,
    signalingStreamId: (_h = pickString(signal.payload.signalingStreamId, cachedSession == null ? void 0 : cachedSession.signalingStreamId)) != null ? _h : null,
    artifactMessageId: (_i = pickString(signal.payload.artifactMessageId, cachedSession == null ? void 0 : cachedSession.artifactMessageId)) != null ? _i : null,
    startedAt: (_j = pickString(signal.payload.startedAt, cachedSession == null ? void 0 : cachedSession.startedAt, messagePayload.occurredAt, context.receivedAt)) != null ? _j : (/* @__PURE__ */ new Date()).toISOString(),
    ...pickString(signal.payload.endedAt, cachedSession == null ? void 0 : cachedSession.endedAt) ? { endedAt: pickString(signal.payload.endedAt, cachedSession == null ? void 0 : cachedSession.endedAt) } : {}
  };
}
var ImCallsModule = class {
  constructor(transportClient, options = {}) {
    __publicField(this, "transportClient");
    __publicField(this, "sessions", {
      create: (body) => this.transportClient.calls.sessions.create(body),
      retrieve: (rtcSessionId) => this.retrieve(rtcSessionId),
      invite: (rtcSessionId, body) => this.transportClient.calls.sessions.invite(requireStringIdentifier(rtcSessionId, "rtcSessionId"), body),
      accept: (rtcSessionId, body = {}) => this.transportClient.calls.sessions.accept(requireStringIdentifier(rtcSessionId, "rtcSessionId"), body),
      reject: (rtcSessionId, body = {}) => this.transportClient.calls.sessions.reject(requireStringIdentifier(rtcSessionId, "rtcSessionId"), body),
      end: (rtcSessionId, body = {}) => this.transportClient.calls.sessions.end(requireStringIdentifier(rtcSessionId, "rtcSessionId"), body),
      signals: {
        create: (rtcSessionId, body) => this.transportClient.calls.sessions.signals.create(requireStringIdentifier(rtcSessionId, "rtcSessionId"), body)
      },
      credentials: {
        create: (rtcSessionId, body) => this.transportClient.calls.sessions.credentials.create(requireStringIdentifier(rtcSessionId, "rtcSessionId"), body)
      }
    });
    __publicField(this, "connect");
    __publicField(this, "incomingSessions", /* @__PURE__ */ new Map());
    __publicField(this, "outgoingSessionIds", /* @__PURE__ */ new Set());
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
    __publicField(this, "watchConnection");
    __publicField(this, "watchConversationIdsKey", "");
    __publicField(this, "watchUnsubscribers", []);
    this.transportClient = transportClient;
    this.connect = options.connect;
  }
  start(options) {
    this.outgoingSessionIds.add(options.rtcSessionId);
    return this.cacheSessionResult(this.transportClient.calls.sessions.create({
      conversationId: optionalString(options.conversationId),
      rtcMode: options.rtcMode,
      rtcSessionId: options.rtcSessionId
    })).then((response) => {
      if (response.rtcSessionId !== options.rtcSessionId) {
        this.outgoingSessionIds.delete(options.rtcSessionId);
        this.outgoingSessionIds.add(response.rtcSessionId);
      }
      return response;
    });
  }
  retrieve(rtcSessionId) {
    return this.cacheSessionResult(this.transportClient.calls.sessions.retrieve(requireStringIdentifier(rtcSessionId, "rtcSessionId")));
  }
  invite(rtcSessionId, options = {}) {
    return this.cacheSessionResult(this.transportClient.calls.sessions.invite(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      signalingStreamId: optionalString(options.signalingStreamId)
    }));
  }
  listSignals(rtcSessionId, options = {}) {
    return this.transportClient.calls.sessions.signals.list(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      afterSignalSeq: normalizeAfterSignalSeq(options.afterSignalSeq),
      pageSize: options.pageSize,
      cursor: options.cursor
    });
  }
  accept(rtcSessionId, options = {}) {
    return this.cacheSessionResult(this.transportClient.calls.sessions.accept(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      artifactMessageId: optionalString(options.artifactMessageId)
    }));
  }
  reject(rtcSessionId, options = {}) {
    return this.cacheSessionResult(this.transportClient.calls.sessions.reject(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      artifactMessageId: optionalString(options.artifactMessageId)
    }), true).then((response) => {
      this.outgoingSessionIds.delete(response.rtcSessionId);
      return response;
    });
  }
  end(rtcSessionId, options = {}) {
    return this.cacheSessionResult(this.transportClient.calls.sessions.end(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      artifactMessageId: optionalString(options.artifactMessageId)
    }), true).then((response) => {
      this.outgoingSessionIds.delete(response.rtcSessionId);
      return response;
    });
  }
  sendSignal(rtcSessionId, options) {
    return this.transportClient.calls.sessions.signals.create(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      payload: options.payload,
      schemaRef: optionalString(options.schemaRef),
      signalingStreamId: optionalString(options.signalingStreamId),
      signalType: options.signalType
    });
  }
  issueParticipantCredential(rtcSessionId, options) {
    return this.transportClient.calls.sessions.credentials.create(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      participantId: options.participantId
    });
  }
  refreshParticipantCredential(rtcSessionId, options) {
    return this.transportClient.calls.sessions.credentials.refresh(requireStringIdentifier(rtcSessionId, "rtcSessionId"), {
      participantId: options.participantId
    });
  }
  async watchIncoming(options = {}) {
    const watchOptions = Array.isArray(options) ? { conversationIds: options } : options;
    const conversationIds = normalizeConversationIds(watchOptions.conversationIds);
    if (watchOptions.connection) {
      this.bindIncomingConnection(watchOptions.connection, conversationIds, false, watchOptions.principalId);
    } else if (this.connect && (conversationIds.length > 0 || watchOptions.principalId)) {
      await this.ensureIncomingWatchConnection(conversationIds, watchOptions.deviceId, watchOptions.principalId);
    } else if (conversationIds.length > 0) {
      this.pruneIncomingSessions(conversationIds);
    }
    return this.firstIncomingSession(conversationIds);
  }
  subscribe(handler) {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }
  async ensureIncomingWatchConnection(conversationIds, deviceId, principalId) {
    var _a;
    const conversationIdsKey = [conversationIds.join("\n"), principalId != null ? principalId : ""].join("|");
    if (this.watchConnection && this.watchConversationIdsKey === conversationIdsKey) {
      return;
    }
    this.closeIncomingWatchConnection();
    const connection = await ((_a = this.connect) == null ? void 0 : _a.call(this, {
      ...deviceId ? { deviceId } : {},
      subscriptions: {
        conversations: conversationIds,
        ...principalId ? { scopes: [{ scopeType: "user", scopeId: principalId }] } : {}
      }
    }));
    if (!connection) {
      return;
    }
    this.bindIncomingConnection(connection, conversationIds, true, principalId);
  }
  bindIncomingConnection(connection, conversationIds, closeWithModule, principalId) {
    this.watchUnsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
    this.pruneIncomingSessions(conversationIds);
    this.watchConnection = connection;
    this.watchConversationIdsKey = [conversationIds.join("\n"), principalId != null ? principalId : ""].join("|");
    for (const conversationId of conversationIds) {
      this.watchUnsubscribers.push(connection.events.onConversation(conversationId, (_event, context) => {
        if (context.payload) {
          this.consumeRealtimePayload(context.payload, context);
        }
      }));
    }
    if (principalId) {
      this.watchUnsubscribers.push(connection.events.onScope("user", principalId, (_event, context) => {
        if (context.payload) {
          this.consumeUserScopeRtcEnvelope(context.payload);
        }
      }));
    }
    if (closeWithModule) {
      this.watchUnsubscribers.push(() => {
        connection.disconnect(1e3, "IM calls incoming watch closed");
      });
    }
  }
  closeIncomingWatchConnection() {
    this.watchUnsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
    this.watchConnection = void 0;
    this.watchConversationIdsKey = "";
  }
  consumeUserScopeRtcEnvelope(messagePayload) {
    const eventType = pickString(messagePayload.eventType);
    if (!(eventType == null ? void 0 : eventType.startsWith("rtc."))) {
      return;
    }
    if (eventType === "rtc.signal.posted") {
      return;
    }
    const inner = isRecord(messagePayload.payload) ? messagePayload.payload : messagePayload;
    if (eventType === "rtc.credentials.revoked") {
      const terminalState = pickString(inner.terminal_state);
      if (terminalState) {
        inner.state = terminalState;
      }
    }
    const rtcSessionId = pickString(inner.rtc_session_id, inner.rtcSessionId);
    const cachedSession = rtcSessionId ? this.incomingSessions.get(rtcSessionId) : void 0;
    const session = parseUserScopeRtcSession(messagePayload, cachedSession);
    if (!session) {
      return;
    }
    if (eventType === "rtc.session.ended" || eventType === "rtc.session.rejected" || eventType === "rtc.session.revoked" || eventType === "rtc.credentials.revoked") {
      this.emitIncoming(session);
      this.incomingSessions.delete(session.rtcSessionId);
      this.outgoingSessionIds.delete(session.rtcSessionId);
      return;
    }
    if (eventType === "rtc.session.invited" || eventType === "rtc.session.created" || eventType === "rtc.session.accepted") {
      this.incomingSessions.set(session.rtcSessionId, session);
      this.emitIncoming(session);
    }
  }
  consumeRealtimePayload(messagePayload, context) {
    for (const signal of parseCallSignals(messagePayload)) {
      const rtcSessionId = pickString(signal.payload.rtcSessionId);
      const cachedSession = rtcSessionId ? this.incomingSessions.get(rtcSessionId) : void 0;
      const session = toRtcSession(signal, messagePayload, context, cachedSession);
      if (!session) {
        continue;
      }
      if (isClosingCallSignal(signal.signalType, session.state)) {
        this.emitIncoming(session);
        if (shouldRemoveCachedCallSession(signal.signalType, session.state)) {
          this.incomingSessions.delete(session.rtcSessionId);
        } else {
          this.incomingSessions.set(session.rtcSessionId, session);
        }
        continue;
      }
      if (signal.signalType !== "rtc.invite" && !isOpenIncomingCallState(session.state)) {
        continue;
      }
      this.incomingSessions.set(session.rtcSessionId, session);
      this.emitIncoming(session);
    }
  }
  firstIncomingSession(conversationIds) {
    var _a;
    for (const session of this.incomingSessions.values()) {
      if (this.outgoingSessionIds.has(session.rtcSessionId)) {
        continue;
      }
      if (conversationIds.length > 0 && !conversationIds.includes((_a = session.conversationId) != null ? _a : "")) {
        continue;
      }
      if (isOpenIncomingCallState(session.state)) {
        return session;
      }
    }
    return null;
  }
  pruneIncomingSessions(conversationIds) {
    var _a;
    if (conversationIds.length === 0) {
      return;
    }
    for (const [rtcSessionId, session] of this.incomingSessions) {
      if (!conversationIds.includes((_a = session.conversationId) != null ? _a : "")) {
        this.incomingSessions.delete(rtcSessionId);
      }
    }
  }
  emitIncoming(session) {
    for (const listener of this.listeners) {
      listener(session);
    }
  }
  async cacheSessionResult(promise, removeAfterCache = false) {
    const session = await promise;
    if (removeAfterCache) {
      this.incomingSessions.delete(session.rtcSessionId);
    } else {
      this.incomingSessions.set(session.rtcSessionId, session);
    }
    return session;
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/conversations-module.js
function normalizePositiveInt64String(value, fieldName) {
  const numericValue = typeof value === "number" ? value : typeof value === "string" && /^[0-9]+$/u.test(value) ? Number(value) : Number.NaN;
  if (!Number.isSafeInteger(numericValue) || numericValue < 1) {
    throw new RangeError(`${fieldName} is outside the supported safe integer range.`);
  }
  return String(numericValue);
}
function normalizeAssignmentGeneration(value) {
  return normalizePositiveInt64String(value, "Conversation agent assignment generation");
}
function normalizePostMessageRequest(body) {
  if (!body.parts) {
    return body;
  }
  const parts = body.parts.map((part) => {
    if (part.kind !== "mention") {
      return part;
    }
    const assignmentGeneration = normalizePositiveInt64String(part.assignmentGeneration, "Agent mention assignment generation");
    return { ...part, assignmentGeneration };
  });
  return { ...body, parts };
}
function normalizeAgentAssignmentSet(value) {
  return {
    ...value,
    generation: normalizeAssignmentGeneration(value.generation)
  };
}
var ImConversationsModule = class {
  constructor(transportClient) {
    __publicField(this, "transportClient");
    this.transportClient = transportClient;
  }
  create(body) {
    return this.transportClient.chat.conversations.create(body);
  }
  getSummary(conversationId) {
    return this.transportClient.chat.conversations.retrieve(requireStringIdentifier(conversationId, "conversationId"));
  }
  list(params) {
    return this.transportClient.chat.inbox.list(params);
  }
  createAgentDialog(body) {
    return this.transportClient.chat.conversations.agentDialogs.create(body);
  }
  createAgentHandoff(body) {
    return this.transportClient.chat.conversations.agentHandoffs.create(body);
  }
  createSystemChannel(body) {
    return this.transportClient.chat.conversations.systemChannels.create(body);
  }
  createThreadConversation(body) {
    return this.transportClient.chat.conversations.threads.create(body);
  }
  bindDirectChat(body) {
    return this.transportClient.chat.conversations.directChats.bindings.create(body);
  }
  listMessages(conversationId, params) {
    return this.transportClient.chat.conversations.messages.list(requireStringIdentifier(conversationId, "conversationId"), params);
  }
  postMessage(conversationId, body) {
    let normalizedBody;
    try {
      normalizedBody = normalizePostMessageRequest(body);
    } catch (error) {
      return Promise.reject(error);
    }
    return this.transportClient.chat.conversations.messages.create(requireStringIdentifier(conversationId, "conversationId"), normalizedBody);
  }
  postText(conversationId, text, body = {}) {
    let normalizedBody;
    try {
      normalizedBody = normalizePostMessageRequest({ ...body, text });
    } catch (error) {
      return Promise.reject(error);
    }
    return this.transportClient.chat.conversations.messages.create(requireStringIdentifier(conversationId, "conversationId"), normalizedBody);
  }
  updateReadCursor(conversationId, body) {
    return this.transportClient.chat.conversations.readCursor.update(requireStringIdentifier(conversationId, "conversationId"), body);
  }
  getMessageInteractionSummary(conversationId, messageId) {
    return this.transportClient.chat.conversations.messages.interactionSummary.retrieve(requireStringIdentifier(conversationId, "conversationId"), requireStringIdentifier(messageId, "messageId"));
  }
  listPinnedMessages(conversationId) {
    return this.transportClient.chat.conversations.pins.list(requireStringIdentifier(conversationId, "conversationId"));
  }
  getPreferences(conversationId) {
    return this.transportClient.chat.conversations.preferences.retrieve(requireStringIdentifier(conversationId, "conversationId"));
  }
  updatePreferences(conversationId, body) {
    return this.transportClient.chat.conversations.preferences.update(requireStringIdentifier(conversationId, "conversationId"), body);
  }
  getProfile(conversationId) {
    return this.transportClient.chat.conversations.profile.retrieve(requireStringIdentifier(conversationId, "conversationId"));
  }
  updateProfile(conversationId, body) {
    return this.transportClient.chat.conversations.profile.update(requireStringIdentifier(conversationId, "conversationId"), body);
  }
  listMembers(conversationId, params) {
    return this.transportClient.chat.conversations.members.list(requireStringIdentifier(conversationId, "conversationId"), params);
  }
  getCurrentMember(conversationId) {
    return this.transportClient.chat.conversations.members.current.retrieve(requireStringIdentifier(conversationId, "conversationId"));
  }
  getAgentAssignments(conversationId) {
    return this.transportClient.chat.conversations.agents.retrieve(requireStringIdentifier(conversationId, "conversationId")).then(normalizeAgentAssignmentSet);
  }
  replaceAgentAssignments(conversationId, body) {
    const expectedGenerationValid = typeof body.expectedGeneration === "number" ? Number.isSafeInteger(body.expectedGeneration) && body.expectedGeneration >= 1 : typeof body.expectedGeneration === "string" && /^[0-9]+$/u.test(body.expectedGeneration);
    if (!expectedGenerationValid) {
      return Promise.reject(new Error("A positive safe integer expectedGeneration is required."));
    }
    const request = {
      ...body,
      expectedGeneration: String(body.expectedGeneration)
    };
    return this.transportClient.chat.conversations.agents.update(requireStringIdentifier(conversationId, "conversationId"), request).then(normalizeAgentAssignmentSet);
  }
  addMember(conversationId, body) {
    return this.transportClient.chat.conversations.members.add(requireStringIdentifier(conversationId, "conversationId"), body);
  }
  removeMember(conversationId, body) {
    return this.transportClient.chat.conversations.members.remove(requireStringIdentifier(conversationId, "conversationId"), body);
  }
  leave(conversationId) {
    return this.transportClient.chat.conversations.members.leave(requireStringIdentifier(conversationId, "conversationId"));
  }
  acceptInvitation(conversationId) {
    return this.transportClient.chat.conversations.members.acceptInvitation(requireStringIdentifier(conversationId, "conversationId"));
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/messages-module.js
var ImMessagesModule = class {
  constructor(transportClient) {
    __publicField(this, "transportClient");
    __publicField(this, "favorites", {
      list: (params) => this.listFavorites(params),
      create: (messageId, body) => this.favoriteMessage(messageId, body),
      delete: (favoriteId) => this.deleteFavorite(favoriteId)
    });
    this.transportClient = transportClient;
  }
  search(params) {
    const query = params.q.trim();
    if (!query) {
      return Promise.resolve({ items: [], pageInfo: { mode: "cursor", hasMore: false } });
    }
    return this.transportClient.chat.messages.search({
      ...params,
      q: query
    });
  }
  addReaction(messageId, reactionKeyOrBody) {
    const body = typeof reactionKeyOrBody === "string" ? { reactionKey: reactionKeyOrBody } : reactionKeyOrBody;
    return this.transportClient.chat.messages.reactions.create(requireStringIdentifier(messageId, "messageId"), body);
  }
  removeReaction(messageId, reactionKeyOrBody) {
    const body = typeof reactionKeyOrBody === "string" ? { reactionKey: reactionKeyOrBody } : reactionKeyOrBody;
    return this.transportClient.chat.messages.reactions.remove(requireStringIdentifier(messageId, "messageId"), body);
  }
  pinMessage(messageId) {
    return this.transportClient.chat.messages.pin(requireStringIdentifier(messageId, "messageId"));
  }
  unpinMessage(messageId) {
    return this.transportClient.chat.messages.unpin(requireStringIdentifier(messageId, "messageId"));
  }
  deleteForMe(messageId) {
    return this.transportClient.chat.messages.visibility.delete(requireStringIdentifier(messageId, "messageId"));
  }
  recall(messageId, body = {}) {
    return this.transportClient.chat.messages.recall(requireStringIdentifier(messageId, "messageId"), body);
  }
  edit(messageId, body) {
    return this.transportClient.chat.messages.edit(requireStringIdentifier(messageId, "messageId"), body);
  }
  listFavorites(params) {
    return this.transportClient.chat.messages.favorites.list(params);
  }
  favoriteMessage(messageId, body) {
    return this.transportClient.chat.messages.favorites.create(requireStringIdentifier(messageId, "messageId"), body);
  }
  deleteFavorite(favoriteId) {
    return this.transportClient.chat.messages.favorites.delete(requireStringIdentifier(favoriteId, "favoriteId"));
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/rooms-module.js
var ImRoomsModule = class {
  constructor(transportClient) {
    __publicField(this, "transportClient");
    this.transportClient = transportClient;
  }
  create(body) {
    return this.transportClient.chat.rooms.create(body);
  }
  get(roomId) {
    return this.transportClient.chat.rooms.retrieve(requireStringIdentifier(roomId, "roomId"));
  }
  enter(roomId) {
    return this.transportClient.chat.rooms.enter(requireStringIdentifier(roomId, "roomId"));
  }
  leave(roomId) {
    return this.transportClient.chat.rooms.leave(requireStringIdentifier(roomId, "roomId"));
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/realtime-api-paths.js
var IM_REALTIME_WS = "/im/v3/api/realtime/ws";

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/ccp-wire.js
var IM_CCP_WEBSOCKET_SUBPROTOCOL = "sdkwork-im.ccp.ws.v1";
var CCP_PROTOCOL = { family: "ccp", major: 1, minor: 0 };
var CCP_WS_BINDING = "Ws1";
var DEFAULT_CCP_BINDING = CCP_WS_BINDING;
function encodeCcpEnvelope(schema, kind, payload, binding = DEFAULT_CCP_BINDING) {
  const envelope = {
    protocol: { ...CCP_PROTOCOL },
    binding,
    kind,
    schema,
    scope: null,
    route: null,
    flags: [],
    payload: JSON.stringify(payload)
  };
  return JSON.stringify(envelope);
}
function encodeCcpControlFrame(schema, controlType, data, binding = DEFAULT_CCP_BINDING) {
  return encodeCcpEnvelope(schema, "control", { type: controlType, data }, binding);
}
function encodeCcpBusinessFrame(schema, kind, payload, binding = DEFAULT_CCP_BINDING) {
  return encodeCcpEnvelope(schema, kind, payload, binding);
}
function decodeCcpEnvelope(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!isRecord2(parsed) || typeof parsed.payload !== "string" || typeof parsed.schema !== "string") {
      return void 0;
    }
    return parsed;
  } catch {
    return void 0;
  }
}
function parseCcpEnvelopePayload(envelope) {
  try {
    const parsed = JSON.parse(envelope.payload);
    return isRecord2(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function unwrapInboundRealtimeFrame(raw) {
  const envelope = decodeCcpEnvelope(raw);
  if (!envelope) {
    return raw;
  }
  return envelope.payload;
}
function encodeCcpHelloFrame(binding = DEFAULT_CCP_BINDING) {
  return encodeCcpControlFrame("cc.control.hello.v1", "hello", {
    protocol: { ...CCP_PROTOCOL },
    binding,
    capabilities: { items: ["payload.json", "session.resume"] }
  }, binding);
}
function encodeCcpAuthBindFrame(context, binding = DEFAULT_CCP_BINDING) {
  var _a, _b;
  return encodeCcpControlFrame("cc.control.auth_bind.v1", "auth_bind", {
    principal_id: context.principalId,
    device_id: (_a = context.deviceId) != null ? _a : null,
    session_id: (_b = context.sessionId) != null ? _b : null,
    actor_kind: context.actorKind
  }, binding);
}
function encodeCcpHeartbeatFrame(sequence, binding = DEFAULT_CCP_BINDING) {
  return encodeCcpControlFrame("cc.control.heartbeat.v1", "heartbeat", { sequence }, binding);
}
function encodeCcpSessionResumeFrame(sessionId, lastAckedSeq = 0, binding = DEFAULT_CCP_BINDING) {
  return encodeCcpControlFrame("cc.control.session_resume.v1", "session_resume", {
    session_id: sessionId,
    last_acked_seq: lastAckedSeq
  }, binding);
}
function parseCcpControlPayload(raw) {
  const envelope = decodeCcpEnvelope(raw);
  if (!envelope) {
    return void 0;
  }
  return parseCcpEnvelopePayload(envelope);
}
function ccpControlPayloadData(payload) {
  if (!payload) {
    return void 0;
  }
  const data = payload.data;
  return isRecord2(data) ? data : payload;
}
function ccpCapabilityItems(payload) {
  const data = ccpControlPayloadData(payload);
  const capabilities = data == null ? void 0 : data.capabilities;
  if (!isRecord2(capabilities)) {
    return [];
  }
  const items = capabilities.items;
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter((item) => typeof item === "string");
}
function ccpHelloAckNegotiatesSessionResume(raw) {
  const payload = parseCcpControlPayload(raw);
  if (pickString2(payload == null ? void 0 : payload.type) !== "hello_ack") {
    return false;
  }
  return ccpCapabilityItems(payload).includes("session.resume");
}
function isCcpHelloAckEnvelope(raw) {
  const envelope = decodeCcpEnvelope(raw);
  return (envelope == null ? void 0 : envelope.schema) === "cc.control.hello_ack.v1";
}
function isCcpAuthOkEnvelope(raw) {
  const envelope = decodeCcpEnvelope(raw);
  return (envelope == null ? void 0 : envelope.schema) === "cc.control.auth_ok.v1";
}
function isCcpSessionResumedEnvelope(raw) {
  const envelope = decodeCcpEnvelope(raw);
  return (envelope == null ? void 0 : envelope.schema) === "cc.control.session_resumed.v1";
}
function decodeJwtPayload(token) {
  if (!token) {
    return void 0;
  }
  const segment = token.split(".")[1];
  if (!segment) {
    return void 0;
  }
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = `${base64}${"=".repeat((4 - base64.length % 4) % 4)}`;
    const json = decodeBase64Utf8(padded);
    const parsed = JSON.parse(json);
    return isRecord2(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function resolveCcpAuthBindContext(params) {
  var _a;
  const authOk = params.authOk;
  const jwtClaims = decodeJwtPayload(params.accessToken);
  const principalId = pickString2(authOk == null ? void 0 : authOk.principalId, jwtClaims == null ? void 0 : jwtClaims.user_id, jwtClaims == null ? void 0 : jwtClaims.userId);
  if (!principalId) {
    return void 0;
  }
  return {
    principalId,
    deviceId: pickString2(authOk == null ? void 0 : authOk.deviceId, params.deviceId, jwtClaims == null ? void 0 : jwtClaims.device_id, jwtClaims == null ? void 0 : jwtClaims.deviceId),
    sessionId: pickString2(authOk == null ? void 0 : authOk.sessionId, jwtClaims == null ? void 0 : jwtClaims.session_id, jwtClaims == null ? void 0 : jwtClaims.sessionId),
    actorKind: (_a = pickString2(authOk == null ? void 0 : authOk.actorKind, jwtClaims == null ? void 0 : jwtClaims.subject_type, params.actorKind)) != null ? _a : "user"
  };
}
function decodeBase64Utf8(value) {
  const runtimeBuffer = globalThis.Buffer;
  if (runtimeBuffer) {
    return runtimeBuffer.from(value, "base64").toString("utf8");
  }
  if (typeof globalThis.atob !== "function") {
    throw new Error("Base64 decoding is not available in this runtime.");
  }
  const binary = globalThis.atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function pickString2(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return void 0;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/realtime.js
var SOCKET_CONNECTING_STATE = 0;
var SOCKET_OPEN_STATE = 1;
var SOCKET_CLOSING_STATE = 2;
var SOCKET_CLOSED_STATE = 3;
var DEFAULT_WEBSOCKET_CONNECTION_TIMEOUT_MS = 15e3;
var DEFAULT_WEBSOCKET_AUTH_TIMEOUT_MS = 1e4;
var DEFAULT_WEBSOCKET_HEARTBEAT_INTERVAL_MS = 3e4;
var DEFAULT_WEBSOCKET_HEARTBEAT_TIMEOUT_MS = 75e3;
var MIN_WEBSOCKET_CONNECTION_TIMEOUT_MS = 1;
var MIN_WEBSOCKET_HEARTBEAT_INTERVAL_MS = 1;
var MIN_WEBSOCKET_HEARTBEAT_TIMEOUT_MS = 1;
function subscribe(set, value) {
  set.add(value);
  return () => {
    set.delete(value);
  };
}
function isRecord3(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function pickString3(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return void 0;
}
function pickStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item) => typeof item === "string").map((item) => item.trim()).filter((item) => item.length > 0);
}
function realtimeScopeKey(scopeType, scopeId) {
  return `${scopeType}:${scopeId}`;
}
function normalizeRealtimeScopeSubscriptions(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const deduped = /* @__PURE__ */ new Map();
  for (const item of value) {
    if (!isRecord3(item)) {
      continue;
    }
    const scopeType = pickString3(item.scopeType, item.scope);
    const scopeId = pickString3(item.scopeId, item.conversationId);
    if (!scopeType || !scopeId) {
      continue;
    }
    const normalized = {
      scopeId,
      scopeType,
      eventTypes: pickStringArray(item.eventTypes)
    };
    deduped.set(realtimeScopeKey(scopeType, scopeId), normalized);
  }
  return [...deduped.values()];
}
function mergeRealtimeScopeSubscriptions(conversations, scopes) {
  var _a;
  const merged = /* @__PURE__ */ new Map();
  for (const conversationId of conversations) {
    const item = {
      scopeType: "conversation",
      scopeId: conversationId,
      eventTypes: ["message.posted"]
    };
    merged.set(realtimeScopeKey(item.scopeType, item.scopeId), item);
  }
  for (const scope of scopes) {
    merged.set(realtimeScopeKey(scope.scopeType, scope.scopeId), {
      scopeType: scope.scopeType,
      scopeId: scope.scopeId,
      eventTypes: [...(_a = scope.eventTypes) != null ? _a : []]
    });
  }
  return [...merged.values()];
}
function pickNumber(...values) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return void 0;
}
function parseRecordPayload(value) {
  if (isRecord3(value)) {
    return value;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    return void 0;
  }
  try {
    const parsed = JSON.parse(value);
    return isRecord3(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function normalizeAttachments(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord3);
}
function normalizeMessage(record, contentFallback) {
  var _a;
  return {
    ...record,
    attachments: normalizeAttachments(record.attachments),
    content: (_a = parseRecordPayload(record.content)) != null ? _a : contentFallback,
    renderHints: parseRecordPayload(record.renderHints)
  };
}
function normalizeAuthorizationHeader(token) {
  return /^Bearer\s+/iu.test(token) ? token : `Bearer ${token}`;
}
function addHeader(headers, key, value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return;
  }
  headers[key] = value.trim();
}
function isClientCorrelationHeader(key) {
  return /^(?:x-request-id|x-trace-id|x-sdkwork-trace-id)$/iu.test(key.trim());
}
function addCallerHeader(headers, key, value) {
  if (isClientCorrelationHeader(key)) {
    return;
  }
  addHeader(headers, key, value);
}
function buildWebSocketHeaders({ accessToken, authToken, headerProvider, headers }) {
  var _a;
  const resolvedHeaders = {};
  if (authToken) {
    resolvedHeaders.Authorization = normalizeAuthorizationHeader(authToken);
  }
  addHeader(resolvedHeaders, "Access-Token", accessToken);
  for (const [key, value] of Object.entries(headers != null ? headers : {})) {
    addCallerHeader(resolvedHeaders, key, value);
  }
  for (const [key, value] of Object.entries((_a = headerProvider == null ? void 0 : headerProvider()) != null ? _a : {})) {
    addCallerHeader(resolvedHeaders, key, value);
  }
  return resolvedHeaders;
}
function hasUpgradeAuthHeaders(headers) {
  for (const [key, value] of Object.entries(headers)) {
    if (!value.trim()) {
      continue;
    }
    const normalized = key.toLowerCase();
    if (normalized === "authorization" || normalized === "access-token") {
      return true;
    }
  }
  return false;
}
function resolveWebSocketCredentials({ accessToken, auth, authToken, tokenManager }) {
  var _a, _b, _c, _d;
  const manager = isRecord3(tokenManager) ? tokenManager : void 0;
  const managerTokens = (_a = manager == null ? void 0 : manager.getTokens) == null ? void 0 : _a.call(manager);
  const websocketCredential = (auth == null ? void 0 : auth.mode) === "automatic" ? (_b = auth.credentialProvider) == null ? void 0 : _b.call(auth) : void 0;
  return {
    accessToken: pickString3((_c = manager == null ? void 0 : manager.getAccessToken) == null ? void 0 : _c.call(manager), managerTokens == null ? void 0 : managerTokens.accessToken, accessToken),
    authToken: pickString3((_d = manager == null ? void 0 : manager.getAuthToken) == null ? void 0 : _d.call(manager), managerTokens == null ? void 0 : managerTokens.authToken, authToken, websocketCredential)
  };
}
function appendRealtimeRoutePath(pathname) {
  const basePath = pathname.replace(/\/+$/u, "");
  if (basePath.endsWith(IM_REALTIME_WS)) {
    return basePath;
  }
  return `${basePath}${IM_REALTIME_WS}`;
}
function buildWebSocketUrl(websocketBaseUrl, options) {
  const url = new URL(websocketBaseUrl);
  url.pathname = appendRealtimeRoutePath(url.pathname);
  if (options.deviceId) {
    url.searchParams.set("deviceId", options.deviceId);
  }
  return url.toString();
}
function resolveWebSocketFactory(factory) {
  if (factory) {
    return factory;
  }
  const WebSocketConstructor = globalThis.WebSocket;
  if (typeof WebSocketConstructor !== "function") {
    throw new Error("IM websocket transport is unavailable; provide ImSdkClientOptions.webSocketFactory.");
  }
  return (url, options) => new WebSocketConstructor(url, options.protocols);
}
function unwrapWirePayload(parsed) {
  const payload = parseRecordPayload(parsed.payload);
  if (pickString3(parsed.schema) && payload && pickString3(payload.type)) {
    const envelopeTraceId = pickString3(parsed.trace_id);
    if (envelopeTraceId && !pickString3(payload.traceId)) {
      return { ...payload, traceId: envelopeTraceId };
    }
    return payload;
  }
  return parsed;
}
function extractMessageData(event) {
  if (typeof event === "string") {
    return event;
  }
  if (isRecord3(event) && typeof event.data === "string") {
    return event.data;
  }
  return void 0;
}
function resolveEventScopeType(event) {
  return pickString3(event.scopeType, event.scope);
}
function resolveConversationId(message, payload, event) {
  const scopeType = resolveEventScopeType(event);
  return pickString3(message.conversationId, payload == null ? void 0 : payload.conversationId, event.conversationId, scopeType === "conversation" ? event.scopeId : void 0);
}
function createNoopContextAck() {
  return Promise.resolve();
}
function parseDirectRealtimePayload(frame) {
  var _a, _b;
  const payload = parseRecordPayload(frame.payload);
  const messageRecord = payload != null ? payload : frame;
  const message = normalizeMessage(messageRecord, payload);
  const messageSender = isRecord3(message.sender) ? message.sender : void 0;
  const payloadSender = payload && isRecord3(payload.sender) ? payload.sender : void 0;
  const conversationId = resolveConversationId(message, payload, frame);
  const messageId = pickString3(message.messageId, payload == null ? void 0 : payload.messageId, frame.messageId, frame.eventId);
  const sequence = (_a = pickNumber(frame.realtimeSeq, frame.sequence, message.messageSeq, payload == null ? void 0 : payload.messageSeq, payload == null ? void 0 : payload.sequence, frame.messageSeq)) != null ? _a : 0;
  if (!conversationId) {
    return null;
  }
  return {
    context: {
      ack: createNoopContextAck,
      conversationId,
      eventId: pickString3(frame.eventId),
      eventType: pickString3(frame.eventType, frame.type),
      messageId,
      payload,
      rawEvent: frame,
      receivedAt: (_b = pickString3(frame.receivedAt, frame.occurredAt, message.occurredAt)) != null ? _b : (/* @__PURE__ */ new Date()).toISOString(),
      sender: messageSender != null ? messageSender : payloadSender,
      sequence
    },
    message
  };
}
function parseRealtimeEventEnvelope(event, frame = event) {
  var _a, _b;
  const scopeType = resolveEventScopeType(event);
  const scopeId = pickString3(event.scopeId, event.conversationId);
  if (!scopeId) {
    return null;
  }
  const payload = parseRecordPayload(event.payload);
  const sequence = (_a = pickNumber(event.realtimeSeq, event.sequence, payload == null ? void 0 : payload.realtimeSeq, payload == null ? void 0 : payload.messageSeq, event.messageSeq)) != null ? _a : 0;
  return {
    context: {
      ack: createNoopContextAck,
      eventId: pickString3(event.eventId),
      eventType: pickString3(event.eventType, event.type),
      payload,
      rawEvent: event,
      receivedAt: (_b = pickString3(frame.receivedAt, event.receivedAt, event.occurredAt)) != null ? _b : (/* @__PURE__ */ new Date()).toISOString(),
      scopeId,
      scopeType: scopeType != null ? scopeType : "conversation",
      sequence
    },
    event
  };
}
function parseRealtimeEventWindow(frame) {
  var _a, _b;
  const window2 = isRecord3(frame.window) ? frame.window : void 0;
  const items = Array.isArray(window2 == null ? void 0 : window2.items) ? window2.items.filter(isRecord3) : [];
  const messages = [];
  for (const item of items) {
    const eventType = pickString3(item.eventType, item.type);
    const scopeType = resolveEventScopeType(item);
    if (eventType && eventType !== "message.posted") {
      continue;
    }
    if (scopeType && scopeType !== "conversation") {
      continue;
    }
    const payload = parseRecordPayload(item.payload);
    const messageRecord = payload != null ? payload : item;
    const message = normalizeMessage(messageRecord, payload);
    const occurredAt = pickString3(message.occurredAt, payload == null ? void 0 : payload.occurredAt, item.occurredAt);
    if (occurredAt) {
      message.occurredAt = occurredAt;
    }
    const messageSender = isRecord3(message.sender) ? message.sender : void 0;
    const payloadSender = payload && isRecord3(payload.sender) ? payload.sender : void 0;
    const conversationId = resolveConversationId(message, payload, item);
    if (!conversationId) {
      continue;
    }
    const sequence = (_a = pickNumber(item.realtimeSeq, item.sequence, payload == null ? void 0 : payload.realtimeSeq, payload == null ? void 0 : payload.messageSeq, item.messageSeq, window2 == null ? void 0 : window2.nextAfterSeq)) != null ? _a : 0;
    const messageId = pickString3(message.messageId, payload == null ? void 0 : payload.messageId, item.messageId, item.eventId);
    messages.push({
      context: {
        ack: createNoopContextAck,
        conversationId,
        eventId: pickString3(item.eventId),
        eventType: eventType != null ? eventType : "message.posted",
        messageId,
        payload,
        rawEvent: item,
        receivedAt: (_b = pickString3(frame.receivedAt, item.receivedAt, item.occurredAt, occurredAt)) != null ? _b : (/* @__PURE__ */ new Date()).toISOString(),
        sender: messageSender != null ? messageSender : payloadSender,
        sequence
      },
      message
    });
  }
  return messages;
}
function parseRealtimeEvents(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!isRecord3(parsed)) {
      return [];
    }
    const frame = unwrapWirePayload(parsed);
    if (pickString3(frame.type) === "event.window") {
      const window2 = isRecord3(frame.window) ? frame.window : void 0;
      const items = Array.isArray(window2 == null ? void 0 : window2.items) ? window2.items.filter(isRecord3) : [];
      return items.map((item) => parseRealtimeEventEnvelope(item, frame)).filter((item) => Boolean(item));
    }
    const event = parseRealtimeEventEnvelope(frame);
    return event ? [event] : [];
  } catch {
    return [];
  }
}
function parseRealtimePayloads(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!isRecord3(parsed)) {
      return [];
    }
    const frame = unwrapWirePayload(parsed);
    if (pickString3(frame.type) === "event.window") {
      return parseRealtimeEventWindow(frame);
    }
    const directMessage = parseDirectRealtimePayload(frame);
    return directMessage ? [directMessage] : [];
  } catch {
    return [];
  }
}
function sendSubscriptionSync(socket, scopes, binding = CCP_WS_BINDING) {
  if (socket.readyState !== SOCKET_OPEN_STATE) {
    return;
  }
  socket.send(encodeCcpBusinessFrame("cc.realtime.subscriptions.sync.v1", "cmd", {
    type: "subscriptions.sync",
    items: scopes.map((scope) => {
      var _a;
      return {
        scopeType: scope.scopeType,
        scopeId: scope.scopeId,
        eventTypes: (_a = scope.eventTypes) != null ? _a : []
      };
    })
  }, binding));
}
var DEFAULT_EVENTS_NACK_REPLAY_LIMIT = 100;
function sendEventsAck(socket, ackedSeq, binding = CCP_WS_BINDING) {
  if (socket.readyState !== SOCKET_OPEN_STATE) {
    return;
  }
  socket.send(encodeCcpBusinessFrame("cc.realtime.events.ack.v1", "ack", {
    type: "events.ack",
    ackedSeq
  }, binding));
}
function sendEventsNack(socket, nackThroughSeq, limit, binding = CCP_WS_BINDING) {
  if (socket.readyState !== SOCKET_OPEN_STATE) {
    return;
  }
  socket.send(encodeCcpBusinessFrame("cc.realtime.events.nack.v1", "nack", {
    type: "events.nack",
    nackThroughSeq,
    limit
  }, binding));
}
function createRealtimeSeqTracker(socket, binding = CCP_WS_BINDING) {
  let lastContiguousRealtimeSeq = 0;
  const track = (sequence) => {
    if (!Number.isFinite(sequence) || sequence <= 0) {
      return;
    }
    if (lastContiguousRealtimeSeq === 0) {
      lastContiguousRealtimeSeq = sequence;
      return;
    }
    if (sequence === lastContiguousRealtimeSeq + 1) {
      lastContiguousRealtimeSeq = sequence;
      return;
    }
    if (sequence <= lastContiguousRealtimeSeq) {
      return;
    }
    sendEventsNack(socket, lastContiguousRealtimeSeq, DEFAULT_EVENTS_NACK_REPLAY_LIMIT, binding);
  };
  return {
    reset: () => {
      lastContiguousRealtimeSeq = 0;
    },
    track
  };
}
function sendAuthInit(socket, credentials, deviceId) {
  if (socket.readyState !== SOCKET_OPEN_STATE) {
    return;
  }
  socket.send(JSON.stringify({
    type: "auth.init",
    authToken: credentials.authToken,
    accessToken: credentials.accessToken,
    ...deviceId ? { deviceId } : {}
  }));
}
function parseRealtimeControlFrame(raw) {
  try {
    const parsed = JSON.parse(raw);
    return isRecord3(parsed) ? unwrapWirePayload(parsed) : void 0;
  } catch {
    return void 0;
  }
}
function isAuthOkFrame(raw) {
  const frame = parseRealtimeControlFrame(raw);
  return pickString3(frame == null ? void 0 : frame.type) === "auth.ok";
}
function extractAuthOkTraceId(raw) {
  const frame = parseRealtimeControlFrame(raw);
  if (pickString3(frame == null ? void 0 : frame.type) !== "auth.ok") {
    return void 0;
  }
  return pickString3(frame == null ? void 0 : frame.traceId);
}
function parseRealtimeControlError(raw) {
  var _a, _b;
  const frame = parseRealtimeControlFrame(raw);
  if (pickString3(frame == null ? void 0 : frame.type) !== "error") {
    return void 0;
  }
  const frameTraceId = pickString3(frame == null ? void 0 : frame.traceId);
  return {
    code: (_a = pickString3(frame == null ? void 0 : frame.code)) != null ? _a : "websocket_error",
    message: (_b = pickString3(frame == null ? void 0 : frame.message, frame == null ? void 0 : frame.detail)) != null ? _b : "websocket error",
    ...frameTraceId ? { traceId: frameTraceId } : {},
    type: "error"
  };
}
function isRealtimeHeartbeatControlFrame(raw) {
  const frame = parseRealtimeControlFrame(raw);
  return pickString3(frame == null ? void 0 : frame.type) === "heartbeat";
}
function isFatalRealtimeControlError(error) {
  if (error.code === "reconnect_required") {
    return true;
  }
  return /^websocket_(?:auth|upstream|connect)/u.test(error.code) || /(?:auth|session|token).*(?:failed|expired|invalid|required)/iu.test(error.code);
}
function websocketAuthTimeoutMs(auth) {
  if (typeof (auth == null ? void 0 : auth.timeoutMs) === "number" && Number.isFinite(auth.timeoutMs) && auth.timeoutMs > 0) {
    return auth.timeoutMs;
  }
  return DEFAULT_WEBSOCKET_AUTH_TIMEOUT_MS;
}
function websocketConnectionTimeoutMs(options) {
  return normalizePositiveDuration(options.connectionTimeoutMs, DEFAULT_WEBSOCKET_CONNECTION_TIMEOUT_MS, MIN_WEBSOCKET_CONNECTION_TIMEOUT_MS);
}
function normalizePositiveDuration(value, fallback, minValue) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minValue) {
    return fallback;
  }
  return value;
}
function resolveHeartbeatOptions(options) {
  var _a, _b;
  if (options.heartbeat === false) {
    return void 0;
  }
  return {
    intervalMs: normalizePositiveDuration((_a = options.heartbeat) == null ? void 0 : _a.intervalMs, DEFAULT_WEBSOCKET_HEARTBEAT_INTERVAL_MS, MIN_WEBSOCKET_HEARTBEAT_INTERVAL_MS),
    timeoutMs: normalizePositiveDuration((_b = options.heartbeat) == null ? void 0 : _b.timeoutMs, DEFAULT_WEBSOCKET_HEARTBEAT_TIMEOUT_MS, MIN_WEBSOCKET_HEARTBEAT_TIMEOUT_MS)
  };
}
function readCloseReason(event) {
  return isRecord3(event) ? pickString3(event.reason) : void 0;
}
var TransportBackedSocketLike = class {
  constructor(transport) {
    __publicField(this, "transport");
    __publicField(this, "openHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "closeHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "errorHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "messageHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "unsubscribers", []);
    __publicField(this, "disposed", false);
    __publicField(this, "openNotified", false);
    __publicField(this, "closeNotified", false);
    __publicField(this, "closeEvent");
    this.transport = transport;
    this.unsubscribers.push(transport.onOpen(() => {
      this.dispatchOpen();
    }), transport.onClose((event) => {
      this.dispatchClose({ code: event.code, reason: event.reason, wasClean: event.wasClean });
    }), transport.onError((event) => {
      if (this.disposed) {
        return;
      }
      for (const handler of this.errorHandlers) {
        handler(event.error);
      }
    }), transport.onMessage((frame) => {
      if (this.disposed || transport.state !== "open") {
        return;
      }
      for (const handler of this.messageHandlers) {
        handler({ data: frame.data });
      }
    }));
    if (transport.state === "closed") {
      queueMicrotask(() => {
        this.dispatchClose({ code: 1e3, reason: "transport_already_closed", wasClean: true });
      });
    }
  }
  dispatchOpen() {
    if (this.disposed || this.openNotified || this.transport.state !== "open") {
      return;
    }
    this.openNotified = true;
    for (const handler of [...this.openHandlers]) {
      handler();
    }
  }
  dispatchClose(event) {
    if (this.closeNotified) {
      return;
    }
    this.closeNotified = true;
    this.closeEvent = event;
    for (const handler of [...this.closeHandlers]) {
      handler(event);
    }
    this.dispose();
  }
  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    for (const unsubscribe of this.unsubscribers) {
      try {
        unsubscribe();
      } catch {
      }
    }
    this.unsubscribers.length = 0;
    this.openHandlers.clear();
    this.messageHandlers.clear();
    this.errorHandlers.clear();
  }
  get readyState() {
    switch (this.transport.state) {
      case "connecting":
        return SOCKET_CONNECTING_STATE;
      case "open":
        return SOCKET_OPEN_STATE;
      case "closing":
        return SOCKET_CLOSING_STATE;
      case "closed":
        return SOCKET_CLOSED_STATE;
    }
  }
  addEventListener(type, handler) {
    switch (type) {
      case "open": {
        this.openHandlers.add(handler);
        if (this.openNotified) {
          queueMicrotask(() => {
            if (this.openHandlers.has(handler) && !this.disposed) {
              handler();
            }
          });
        } else if (this.transport.state === "open" && !this.disposed) {
          queueMicrotask(() => this.dispatchOpen());
        }
        break;
      }
      case "close":
        this.closeHandlers.add(handler);
        if (this.closeNotified) {
          queueMicrotask(() => {
            if (this.closeHandlers.has(handler)) {
              handler(this.closeEvent);
            }
          });
        } else if (this.transport.state === "closed") {
          queueMicrotask(() => this.dispatchClose({
            code: 1e3,
            reason: "transport_already_closed",
            wasClean: true
          }));
        }
        break;
      case "error":
        this.errorHandlers.add(handler);
        break;
      case "message":
        this.messageHandlers.add(handler);
        break;
    }
  }
  close(code, reason) {
    this.transport.close(code, reason);
  }
  send(value) {
    this.transport.send({ data: value, isBinary: false });
  }
};
function createImLiveConnection({ accessToken, auth, authToken, headerProvider, headers, options, tokenManager, transport, websocketBaseUrl, webSocketFactory }) {
  var _a, _b;
  const listeners = {
    errors: /* @__PURE__ */ new Set(),
    events: /* @__PURE__ */ new Map(),
    messages: /* @__PURE__ */ new Map(),
    states: /* @__PURE__ */ new Set()
  };
  let subscriptionConversations = pickStringArray((_a = options.subscriptions) == null ? void 0 : _a.conversations);
  let subscriptionScopes = normalizeRealtimeScopeSubscriptions((_b = options.subscriptions) == null ? void 0 : _b.scopes);
  const credentials = resolveWebSocketCredentials({ accessToken, auth, authToken, tokenManager });
  const usingTransport = Boolean(transport);
  const ccpBinding = transport ? transport.capabilities.ccpBinding : CCP_WS_BINDING;
  let socket;
  let usesBrowserWebSocket;
  let resolvedHeaders;
  if (transport) {
    socket = new TransportBackedSocketLike(transport);
    usesBrowserWebSocket = false;
    resolvedHeaders = buildWebSocketHeaders({ ...credentials, headerProvider, headers });
  } else {
    const url = buildWebSocketUrl(websocketBaseUrl, {
      ...options,
      subscriptions: {
        conversations: subscriptionConversations,
        scopes: subscriptionScopes
      }
    });
    usesBrowserWebSocket = !webSocketFactory;
    resolvedHeaders = buildWebSocketHeaders({ ...credentials, headerProvider, headers });
    socket = resolveWebSocketFactory(webSocketFactory)(url, {
      headers: resolvedHeaders,
      protocols: [IM_CCP_WEBSOCKET_SUBPROTOCOL]
    });
  }
  const isNonWebSocketTransport = usingTransport && transport.kind !== "websocket";
  const frameAuthRequired = isNonWebSocketTransport ? false : (usesBrowserWebSocket || !hasUpgradeAuthHeaders(resolvedHeaders)) && (auth == null ? void 0 : auth.mode) !== "none";
  const frameAuthCredentials = credentials.accessToken && credentials.authToken ? { accessToken: credentials.accessToken, authToken: credentials.authToken } : void 0;
  let connectionPhase = frameAuthRequired ? "gateway_auth" : "ccp_hello_ack";
  let authTimeout;
  let connectionTimeout;
  let currentState = { status: "connecting" };
  let suppressNextClosedState = false;
  let subscriptionSnapshotDirty = true;
  const heartbeatOptions = resolveHeartbeatOptions(options);
  let heartbeatTimer;
  let heartbeatCounter = 0;
  let lastInboundAt = Date.now();
  let connectionTraceId;
  const realtimeSeqTracker = createRealtimeSeqTracker(socket, ccpBinding);
  const emitState = (state) => {
    currentState = state;
    for (const handler of listeners.states) {
      handler(state);
    }
  };
  const emitError = (error) => {
    for (const handler of listeners.errors) {
      handler(error);
    }
  };
  const clearAuthTimeout = () => {
    if (!authTimeout) {
      return;
    }
    clearTimeout(authTimeout);
    authTimeout = void 0;
  };
  const clearConnectionTimeout = () => {
    if (!connectionTimeout) {
      return;
    }
    clearTimeout(connectionTimeout);
    connectionTimeout = void 0;
  };
  const clearHeartbeatTimer = () => {
    if (!heartbeatTimer) {
      return;
    }
    clearInterval(heartbeatTimer);
    heartbeatTimer = void 0;
  };
  const closeSocket = (code, reason) => {
    if (socket.readyState === SOCKET_CLOSING_STATE || socket.readyState === SOCKET_CLOSED_STATE) {
      return;
    }
    socket.close(code, reason);
  };
  const failAuth = (error) => {
    connectionPhase = "gateway_auth";
    clearConnectionTimeout();
    clearAuthTimeout();
    clearHeartbeatTimer();
    emitState({ status: "error", reason: error.message });
    emitError(error);
    closeSocket(4401, error.code);
  };
  const failCcpHandshake = (code, message, traceId) => {
    connectionPhase = "gateway_auth";
    clearConnectionTimeout();
    clearAuthTimeout();
    clearHeartbeatTimer();
    const error = {
      code,
      message,
      ...(traceId != null ? traceId : connectionTraceId) ? { traceId: traceId != null ? traceId : connectionTraceId } : {},
      type: "error"
    };
    emitState({ status: "error", reason: message });
    emitError(error);
    closeSocket(4401, code);
  };
  let pendingCcpAuthBindContext;
  let resumeNegotiated = false;
  const beginSessionResumeIfNeeded = () => {
    const sessionId = pendingCcpAuthBindContext == null ? void 0 : pendingCcpAuthBindContext.sessionId;
    if (!resumeNegotiated || !sessionId) {
      pendingCcpAuthBindContext = void 0;
      emitOpenAndSyncSubscriptions();
      return;
    }
    connectionPhase = "ccp_session_resume";
    socket.send(encodeCcpSessionResumeFrame(sessionId, 0, ccpBinding));
    startAuthTimeout();
  };
  const beginCcpHandshake = (authOk) => {
    var _a2;
    const bindContext = resolveCcpAuthBindContext({
      accessToken: (_a2 = frameAuthCredentials == null ? void 0 : frameAuthCredentials.accessToken) != null ? _a2 : credentials.accessToken,
      authOk,
      deviceId: options.deviceId
    });
    if (!bindContext) {
      failCcpHandshake("websocket_ccp_auth_bind_unavailable", "websocket CCP auth_bind context is unavailable");
      return;
    }
    pendingCcpAuthBindContext = bindContext;
    connectionPhase = "ccp_hello_ack";
    socket.send(encodeCcpHelloFrame(ccpBinding));
    startAuthTimeout();
  };
  const failConnectionTimeout = () => {
    if (socket.readyState !== SOCKET_CONNECTING_STATE) {
      return;
    }
    suppressNextClosedState = true;
    const error = {
      code: "websocket_connect_timeout",
      message: "websocket connection was not established before timeout",
      type: "error"
    };
    emitState({ status: "error", reason: error.message });
    emitError(error);
    closeSocket(4408, error.code);
  };
  const failHeartbeat = () => {
    clearHeartbeatTimer();
    const error = {
      code: "websocket_heartbeat_timeout",
      message: "websocket heartbeat response was not received before timeout",
      ...connectionTraceId ? { traceId: connectionTraceId } : {},
      type: "error"
    };
    emitState({ status: "error", reason: error.message });
    emitError(error);
    closeSocket(4408, error.code);
  };
  const sendHeartbeat = () => {
    if (!heartbeatOptions || socket.readyState !== SOCKET_OPEN_STATE) {
      return;
    }
    if (heartbeatCounter > 0 && Date.now() - lastInboundAt > heartbeatOptions.timeoutMs) {
      failHeartbeat();
      return;
    }
    heartbeatCounter += 1;
    socket.send(encodeCcpHeartbeatFrame(heartbeatCounter, ccpBinding));
  };
  const startHeartbeat = () => {
    clearHeartbeatTimer();
    if (!heartbeatOptions) {
      return;
    }
    lastInboundAt = Date.now();
    heartbeatTimer = setInterval(sendHeartbeat, heartbeatOptions.intervalMs);
  };
  const startAuthTimeout = () => {
    clearAuthTimeout();
    authTimeout = setTimeout(() => {
      if (connectionPhase === "ready") {
        return;
      }
      if (connectionPhase === "gateway_auth") {
        failAuth({
          code: "websocket_auth_timeout",
          message: "websocket auth.ok was not received before timeout",
          type: "error"
        });
        return;
      }
      failCcpHandshake("websocket_ccp_handshake_timeout", "websocket CCP handshake was not completed before timeout");
    }, websocketAuthTimeoutMs(auth));
  };
  const emitOpenAndSyncSubscriptions = () => {
    clearConnectionTimeout();
    clearAuthTimeout();
    connectionPhase = "ready";
    realtimeSeqTracker.reset();
    emitState({ status: "open" });
    startHeartbeat();
    flushSubscriptionSync();
  };
  const flushSubscriptionSync = () => {
    if (!subscriptionSnapshotDirty || socket.readyState !== SOCKET_OPEN_STATE || connectionPhase !== "ready") {
      return;
    }
    subscriptionSnapshotDirty = false;
    sendSubscriptionSync(socket, mergeRealtimeScopeSubscriptions(subscriptionConversations, subscriptionScopes), ccpBinding);
  };
  const syncConversations = (conversationIds) => {
    subscriptionConversations = pickStringArray(conversationIds);
    subscriptionSnapshotDirty = true;
    if (connectionPhase === "ready") {
      flushSubscriptionSync();
    }
  };
  const syncScopes = (scopes) => {
    subscriptionScopes = normalizeRealtimeScopeSubscriptions(scopes);
    subscriptionSnapshotDirty = true;
    if (connectionPhase === "ready") {
      flushSubscriptionSync();
    }
  };
  connectionTimeout = setTimeout(failConnectionTimeout, websocketConnectionTimeoutMs(options));
  socket.addEventListener("open", () => {
    clearConnectionTimeout();
    if (frameAuthRequired) {
      if (!frameAuthCredentials) {
        failAuth({
          code: "websocket_auth_tokens_not_ready",
          message: "websocket auth tokens are not ready",
          type: "error"
        });
        return;
      }
      sendAuthInit(socket, frameAuthCredentials, options.deviceId);
      startAuthTimeout();
      return;
    }
    beginCcpHandshake();
  });
  socket.addEventListener("close", (event) => {
    clearConnectionTimeout();
    clearAuthTimeout();
    clearHeartbeatTimer();
    if (suppressNextClosedState) {
      suppressNextClosedState = false;
      return;
    }
    emitState({ status: "closed", reason: readCloseReason(event) });
  });
  socket.addEventListener("error", (event) => {
    clearConnectionTimeout();
    clearAuthTimeout();
    clearHeartbeatTimer();
    emitState({ status: "error" });
    emitError(event);
  });
  socket.addEventListener("message", (event) => {
    const raw = extractMessageData(event);
    if (!raw) {
      return;
    }
    lastInboundAt = Date.now();
    if (connectionPhase === "gateway_auth") {
      if (isAuthOkFrame(raw)) {
        const authOkFrame = parseRealtimeControlFrame(raw);
        const authOkTraceId = extractAuthOkTraceId(raw);
        if (authOkTraceId) {
          connectionTraceId = authOkTraceId;
        }
        beginCcpHandshake(authOkFrame);
        return;
      }
      const authError = parseRealtimeControlError(raw);
      if (authError) {
        failAuth(authError);
      }
      return;
    }
    if (connectionPhase === "ccp_hello_ack") {
      if (isCcpHelloAckEnvelope(raw)) {
        resumeNegotiated = ccpHelloAckNegotiatesSessionResume(raw);
        const bindContext = pendingCcpAuthBindContext;
        if (!bindContext) {
          failCcpHandshake("websocket_ccp_auth_bind_unavailable", "websocket CCP auth_bind context is unavailable");
          return;
        }
        connectionPhase = "ccp_auth_ok";
        socket.send(encodeCcpAuthBindFrame(bindContext, ccpBinding));
        return;
      }
      const authError = parseRealtimeControlError(raw);
      if (authError) {
        failCcpHandshake(authError.code, authError.message, authError.traceId);
      }
      return;
    }
    if (connectionPhase === "ccp_auth_ok") {
      if (isCcpAuthOkEnvelope(raw)) {
        beginSessionResumeIfNeeded();
        return;
      }
      const authError = parseRealtimeControlError(raw);
      if (authError) {
        failCcpHandshake(authError.code, authError.message, authError.traceId);
      }
      return;
    }
    if (connectionPhase === "ccp_session_resume") {
      if (isCcpSessionResumedEnvelope(raw)) {
        pendingCcpAuthBindContext = void 0;
        emitOpenAndSyncSubscriptions();
        return;
      }
      const authError = parseRealtimeControlError(raw);
      if (authError) {
        failCcpHandshake(authError.code, authError.message, authError.traceId);
      }
      return;
    }
    const inboundFrame = unwrapInboundRealtimeFrame(raw);
    if (isRealtimeHeartbeatControlFrame(inboundFrame)) {
      return;
    }
    const controlError = parseRealtimeControlError(inboundFrame);
    if (controlError) {
      if (isFatalRealtimeControlError(controlError)) {
        clearHeartbeatTimer();
        emitState({ status: "error", reason: controlError.message });
        emitError(controlError);
        closeSocket(4401, controlError.code);
        return;
      }
      emitError(controlError);
      return;
    }
    const decodedEvents = parseRealtimeEvents(inboundFrame);
    for (const decoded of decodedEvents) {
      realtimeSeqTracker.track(decoded.context.sequence);
      if (!decoded.context.scopeId || !decoded.context.scopeType) {
        continue;
      }
      decoded.context.ack = () => {
        if (socket.readyState === SOCKET_OPEN_STATE) {
          const ackedSeq = decoded.context.sequence;
          sendEventsAck(socket, ackedSeq, ccpBinding);
        }
        return Promise.resolve();
      };
      const handlers = listeners.events.get(realtimeScopeKey(decoded.context.scopeType, decoded.context.scopeId));
      if (!handlers) {
        continue;
      }
      for (const handler of handlers) {
        handler(decoded.event, decoded.context);
      }
    }
    const decodedMessages = parseRealtimePayloads(inboundFrame);
    for (const decoded of decodedMessages) {
      realtimeSeqTracker.track(decoded.context.sequence);
      if (!decoded.context.conversationId) {
        continue;
      }
      decoded.context.ack = () => {
        if (socket.readyState === SOCKET_OPEN_STATE) {
          const ackedSeq = decoded.context.sequence;
          sendEventsAck(socket, ackedSeq, ccpBinding);
        }
        return Promise.resolve();
      };
      const handlers = listeners.messages.get(decoded.context.conversationId);
      if (!handlers) {
        continue;
      }
      for (const handler of handlers) {
        handler(decoded.message, decoded.context);
      }
    }
  });
  return {
    disconnect(code = 1e3, reason = "client disconnect") {
      clearConnectionTimeout();
      clearAuthTimeout();
      clearHeartbeatTimer();
      closeSocket(code, reason);
    },
    events: {
      onConversation(conversationId, handler) {
        var _a2;
        const key = realtimeScopeKey("conversation", conversationId);
        const handlers = (_a2 = listeners.events.get(key)) != null ? _a2 : /* @__PURE__ */ new Set();
        listeners.events.set(key, handlers);
        const unsubscribe = subscribe(handlers, handler);
        return () => {
          unsubscribe();
          if (handlers.size === 0) {
            listeners.events.delete(key);
          }
        };
      },
      onScope(scopeType, scopeId, handler) {
        var _a2;
        const key = realtimeScopeKey(scopeType, scopeId);
        const handlers = (_a2 = listeners.events.get(key)) != null ? _a2 : /* @__PURE__ */ new Set();
        listeners.events.set(key, handlers);
        const unsubscribe = subscribe(handlers, handler);
        return () => {
          unsubscribe();
          if (handlers.size === 0) {
            listeners.events.delete(key);
          }
        };
      }
    },
    lifecycle: {
      onError(handler) {
        return subscribe(listeners.errors, handler);
      },
      onStateChange(handler) {
        const unsubscribe = subscribe(listeners.states, handler);
        handler(currentState);
        return unsubscribe;
      }
    },
    messages: {
      onConversation(conversationId, handler) {
        var _a2;
        const handlers = (_a2 = listeners.messages.get(conversationId)) != null ? _a2 : /* @__PURE__ */ new Set();
        listeners.messages.set(conversationId, handlers);
        const unsubscribe = subscribe(handlers, handler);
        return () => {
          unsubscribe();
          if (handlers.size === 0) {
            listeners.messages.delete(conversationId);
          }
        };
      }
    },
    subscriptions: {
      syncConversations,
      syncScopes
    }
  };
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/social-module.js
function composeSocialSurface(social) {
  const friendRequests = social.friendRequests;
  return {
    users: social.users,
    contacts: social.contacts,
    friendships: social.friendships,
    userBlocks: social.userBlocks,
    friendRequests: {
      list: (params) => friendRequests.list(params),
      create: (body) => friendRequests.create(body),
      accept: (requestId) => friendRequests.accept(requestId),
      decline: (requestId) => friendRequests.decline(requestId),
      cancel: (requestId) => friendRequests.cancel(requestId),
      pendingCount: () => friendRequests.pending.count.retrieve()
    }
  };
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/transport.js
var DEFAULT_TRANSPORT_SELECTION_POLICY = {
  preferred: ["websocket", "tcp", "udp"],
  autoFallback: true,
  probeTimeoutMs: 15e3
};
var TRANSPORT_CAPABILITIES = {
  websocket: {
    supportsFraming: true,
    supportsDatagram: false,
    reliable: true,
    orderedDelivery: true,
    supportsBackpressure: false,
    maxFrameBytes: 512 * 1024,
    supportsUpgradeAuth: true,
    ccpBinding: "Ws1"
  },
  tcp: {
    supportsFraming: true,
    supportsDatagram: false,
    reliable: true,
    orderedDelivery: true,
    supportsBackpressure: true,
    maxFrameBytes: 512 * 1024,
    supportsUpgradeAuth: false,
    ccpBinding: "Tcp1"
  },
  udp: {
    supportsFraming: false,
    supportsDatagram: true,
    reliable: false,
    orderedDelivery: false,
    supportsBackpressure: false,
    maxFrameBytes: 64 * 1024,
    supportsUpgradeAuth: false,
    ccpBinding: "Udp1"
  }
};
function parseTransportKindFromUrl(url) {
  if (/^wss?:\/\//i.test(url)) {
    return "websocket";
  }
  if (/^tcp:\/\//i.test(url)) {
    return "tcp";
  }
  if (/^udp:\/\//i.test(url)) {
    return "udp";
  }
  return void 0;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/transports/websocket-transport.js
var WS_CONNECTING = 0;
var WS_OPEN = 1;
var WS_CLOSING = 2;
var WS_CLOSED = 3;
function extractMessageData2(event) {
  if (typeof event === "string") {
    return event;
  }
  if (event && typeof event === "object") {
    const record = event;
    if (typeof record.data === "string") {
      return record.data;
    }
    if (record.data instanceof Uint8Array) {
      return record.data;
    }
    if (ArrayBuffer.isView(record.data)) {
      return new Uint8Array(record.data.buffer, record.data.byteOffset, record.data.byteLength);
    }
    if (record.data instanceof ArrayBuffer) {
      return new Uint8Array(record.data);
    }
  }
  return void 0;
}
function readCloseCode(event) {
  if (event && typeof event === "object") {
    const record = event;
    return typeof record.code === "number" ? record.code : 1e3;
  }
  return 1e3;
}
function readCloseReason2(event) {
  if (event && typeof event === "object") {
    const record = event;
    return typeof record.reason === "string" ? record.reason : "";
  }
  return "";
}
function readWasClean(event, code) {
  if (event && typeof event === "object") {
    const value = event.wasClean;
    if (typeof value === "boolean") {
      return value;
    }
  }
  return code >= 1e3 && code < 1004;
}
var ImWebSocketTransportConnection = class {
  constructor(socket) {
    __publicField(this, "kind", "websocket");
    __publicField(this, "capabilities", TRANSPORT_CAPABILITIES.websocket);
    __publicField(this, "socket");
    __publicField(this, "messageHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "openHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "closeHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "errorHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "stateValue", "connecting");
    __publicField(this, "openDispatched", false);
    __publicField(this, "closeEvent");
    this.socket = socket;
    const handleOpen = () => {
      if (this.stateValue !== "connecting") {
        return;
      }
      this.stateValue = "open";
      queueMicrotask(() => {
        if (this.stateValue !== "open") {
          return;
        }
        this.openDispatched = true;
        for (const handler of this.openHandlers) {
          handler();
        }
      });
    };
    const handleMessage = (event) => {
      if (this.stateValue !== "open") {
        return;
      }
      const data = extractMessageData2(event);
      if (data === void 0) {
        return;
      }
      const frame = {
        data,
        isBinary: typeof data !== "string"
      };
      for (const handler of this.messageHandlers) {
        handler(frame);
      }
    };
    const handleClose = (event) => {
      const closeCode = readCloseCode(event);
      this.finalizeClose({
        code: closeCode,
        reason: readCloseReason2(event),
        wasClean: readWasClean(event, closeCode)
      });
    };
    const handleError = (event) => {
      if (this.stateValue === "closed") {
        return;
      }
      const errorEvent = { error: event, code: "websocket_error" };
      for (const handler of this.errorHandlers) {
        handler(errorEvent);
      }
      if (this.socket.readyState !== WS_CLOSED) {
        try {
          this.socket.close(4e3, "websocket_error");
        } catch {
        }
      }
    };
    this.socket.addEventListener("open", handleOpen);
    this.socket.addEventListener("message", handleMessage);
    this.socket.addEventListener("close", handleClose);
    this.socket.addEventListener("error", handleError);
  }
  finalizeClose(event) {
    if (this.stateValue === "closed") {
      return;
    }
    this.stateValue = "closed";
    this.closeEvent = event;
    for (const handler of [...this.closeHandlers]) {
      handler(event);
    }
    this.messageHandlers.clear();
    this.openHandlers.clear();
    this.errorHandlers.clear();
  }
  get state() {
    if (this.stateValue === "closed" || this.stateValue === "closing") {
      return this.stateValue;
    }
    const readyState = this.socket.readyState;
    if (readyState === WS_CONNECTING) {
      return "connecting";
    }
    if (readyState === WS_OPEN) {
      return "open";
    }
    if (readyState === WS_CLOSING) {
      return "closing";
    }
    return "closed";
  }
  send(frame) {
    if (this.stateValue !== "open" || this.socket.readyState !== WS_OPEN) {
      return;
    }
    this.socket.send(frame.data);
  }
  close(code, reason) {
    if (this.stateValue === "closing" || this.stateValue === "closed") {
      return;
    }
    if (this.socket.readyState === WS_CLOSING || this.socket.readyState === WS_CLOSED) {
      if (this.socket.readyState === WS_CLOSED) {
        this.finalizeClose({
          code: code != null ? code : 1e3,
          reason: reason != null ? reason : "websocket_already_closed",
          wasClean: true
        });
      }
      return;
    }
    this.stateValue = "closing";
    try {
      this.socket.close(code != null ? code : 1e3, reason != null ? reason : "");
    } catch {
      this.finalizeClose({
        code: code != null ? code : 1e3,
        reason: reason != null ? reason : "websocket_close_failed",
        wasClean: false
      });
    }
  }
  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }
  onOpen(handler) {
    this.openHandlers.add(handler);
    if (this.stateValue === "open" && this.openDispatched) {
      queueMicrotask(() => {
        if (this.openHandlers.has(handler) && this.stateValue === "open") {
          handler();
        }
      });
    }
    return () => this.openHandlers.delete(handler);
  }
  onClose(handler) {
    this.closeHandlers.add(handler);
    if (this.stateValue === "closed") {
      queueMicrotask(() => {
        var _a;
        if (this.closeHandlers.has(handler)) {
          handler((_a = this.closeEvent) != null ? _a : { code: 1e3, reason: "websocket_already_closed", wasClean: true });
        }
      });
    }
    return () => this.closeHandlers.delete(handler);
  }
  onError(handler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }
};
var ImWebSocketTransportFactory = class {
  constructor(webSocketFactory) {
    __publicField(this, "kind", "websocket");
    __publicField(this, "capabilities", TRANSPORT_CAPABILITIES.websocket);
    __publicField(this, "webSocketFactory");
    this.webSocketFactory = webSocketFactory;
  }
  isAvailable() {
    if (this.webSocketFactory) {
      return true;
    }
    return typeof globalThis.WebSocket === "function";
  }
  async connect(endpoint, options) {
    var _a, _b, _c, _d;
    const url = endpoint.url;
    const headers = { ...(_a = options.headers) != null ? _a : {}, ...(_b = endpoint.headers) != null ? _b : {} };
    const protocols = (_d = (_c = endpoint.protocols) != null ? _c : options.protocols) != null ? _d : [];
    let socket;
    if (this.webSocketFactory) {
      socket = this.webSocketFactory(url, { headers, protocols });
    } else {
      const WebSocketConstructor = globalThis.WebSocket;
      if (typeof WebSocketConstructor !== "function") {
        throw new Error("WebSocket transport is unavailable; provide a webSocketFactory or run in a browser environment.");
      }
      socket = new WebSocketConstructor(url, protocols);
    }
    const connection = new ImWebSocketTransportConnection(socket);
    if (connection.state === "closed") {
      return Promise.reject(new Error("WebSocket connection closed immediately after creation"));
    }
    const timeoutMs = options.connectionTimeoutMs;
    const timer = setTimeout(() => {
      if (socket.readyState === WS_CONNECTING) {
        socket.close(4002, `websocket_connect_timeout_after_${timeoutMs}ms`);
      }
    }, timeoutMs);
    connection.onOpen(() => clearTimeout(timer));
    connection.onClose(() => clearTimeout(timer));
    connection.onError(() => clearTimeout(timer));
    return connection;
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/transports/tcp-transport.js
var TCP_FRAME_HEADER_BYTES = 4;
var TCP_MAX_FRAME_BYTES = 512 * 1024;
var TCP_CLOSE_GRACE_MS = 1e3;
function getRuntimeBuffer() {
  return globalThis.Buffer;
}
function isBufferLike(value) {
  return value !== null && typeof value === "object" && "buffer" in value && "byteOffset" in value && "byteLength" in value;
}
function parseTcpEndpoint(url) {
  const parsed = new URL(url);
  const host = parsed.hostname || "127.0.0.1";
  const port = Number.parseInt(parsed.port, 10);
  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid TCP port in URL: ${url}`);
  }
  return { host, port };
}
var TcpFrameEncoder = class {
  constructor(buffer) {
    __publicField(this, "buffer");
    this.buffer = buffer;
  }
  encodeFrame(payload) {
    const payloadBytes = typeof payload === "string" ? this.buffer.byteLength(payload, "utf8") : payload.byteLength;
    if (payloadBytes > TCP_MAX_FRAME_BYTES) {
      throw new Error(`TCP frame payload exceeds max ${TCP_MAX_FRAME_BYTES} bytes: got ${payloadBytes}`);
    }
    const header = this.buffer.alloc(TCP_FRAME_HEADER_BYTES);
    const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
    view.setUint32(0, payloadBytes, false);
    if (typeof payload === "string") {
      const encoder = new TextEncoder();
      const payloadBuffer = encoder.encode(payload);
      return this.buffer.concat([header, payloadBuffer], header.byteLength + payloadBuffer.byteLength);
    }
    return this.buffer.concat([header, payload], header.byteLength + payload.byteLength);
  }
};
var TcpFrameDecoder = class {
  constructor(buffer) {
    __publicField(this, "buffer");
    __publicField(this, "bufferQueue", []);
    __publicField(this, "bufferTotal", 0);
    __publicField(this, "state", "header");
    __publicField(this, "expectedPayloadLength", 0);
    this.buffer = buffer;
  }
  /** 推入新数据，返回解码出的完整帧列表。 */
  push(data) {
    this.bufferQueue.push(data);
    this.bufferTotal += data.byteLength;
    const frames = [];
    while (true) {
      if (this.state === "header") {
        if (this.bufferTotal < TCP_FRAME_HEADER_BYTES) {
          break;
        }
        const header = this.consume(TCP_FRAME_HEADER_BYTES);
        const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
        this.expectedPayloadLength = view.getUint32(0, false);
        if (this.expectedPayloadLength > TCP_MAX_FRAME_BYTES) {
          throw new Error(`TCP frame length ${this.expectedPayloadLength} exceeds max ${TCP_MAX_FRAME_BYTES}`);
        }
        this.state = "payload";
      }
      if (this.state === "payload") {
        if (this.bufferTotal < this.expectedPayloadLength) {
          break;
        }
        const payload = this.consume(this.expectedPayloadLength);
        frames.push(payload);
        this.state = "header";
        this.expectedPayloadLength = 0;
      }
    }
    return frames;
  }
  /** 清理缓冲区，释放内存。连接关闭时调用。 */
  reset() {
    this.bufferQueue.length = 0;
    this.bufferTotal = 0;
    this.state = "header";
    this.expectedPayloadLength = 0;
  }
  /** 从队列头部消费指定字节数。 */
  consume(length) {
    const result = this.buffer.alloc(length);
    let written = 0;
    while (written < length) {
      const chunk = this.bufferQueue[0];
      if (!chunk) {
        break;
      }
      const remaining = length - written;
      if (chunk.byteLength <= remaining) {
        result.set(chunk, written);
        written += chunk.byteLength;
        this.bufferQueue.shift();
        this.bufferTotal -= chunk.byteLength;
      } else {
        const slice = chunk.subarray(0, remaining);
        result.set(slice, written);
        written += remaining;
        this.bufferQueue[0] = chunk.subarray(remaining);
        this.bufferTotal -= remaining;
      }
    }
    return result;
  }
};
var ImTcpTransportConnection = class {
  constructor(socket, buffer) {
    __publicField(this, "kind", "tcp");
    __publicField(this, "capabilities", TRANSPORT_CAPABILITIES.tcp);
    __publicField(this, "socket");
    __publicField(this, "encoder");
    __publicField(this, "decoder");
    __publicField(this, "messageHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "openHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "closeHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "errorHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "stateValue", "connecting");
    __publicField(this, "openDispatched", false);
    __publicField(this, "closeEvent");
    __publicField(this, "requestedCloseEvent");
    __publicField(this, "closeFallbackTimer");
    this.socket = socket;
    this.encoder = new TcpFrameEncoder(buffer);
    this.decoder = new TcpFrameDecoder(buffer);
    socket.on("connect", () => {
      if (this.stateValue !== "connecting") {
        return;
      }
      this.stateValue = "open";
      queueMicrotask(() => {
        if (this.stateValue !== "open") {
          return;
        }
        this.openDispatched = true;
        for (const handler of this.openHandlers) {
          handler();
        }
      });
    });
    socket.on("data", (data) => {
      if (this.stateValue === "closing" || this.stateValue === "closed") {
        return;
      }
      const bytes = isBufferLike(data) ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : data;
      try {
        const frames = this.decoder.push(bytes);
        for (const frame of frames) {
          const text = new TextDecoder().decode(frame);
          for (const handler of this.messageHandlers) {
            handler({ data: text, isBinary: false });
          }
        }
      } catch (error) {
        const errorEvent = {
          error,
          code: "tcp_frame_decode_error"
        };
        for (const handler of this.errorHandlers) {
          handler(errorEvent);
        }
        this.socket.destroy(error instanceof Error ? error : new Error(String(error)));
      }
    });
    socket.on("close", (hadError) => {
      var _a;
      this.finalizeClose(hadError ? { code: 4e3, reason: "tcp_connection_error", wasClean: false } : (_a = this.requestedCloseEvent) != null ? _a : { code: 1e3, reason: "tcp_connection_closed", wasClean: true });
    });
    socket.on("error", (error) => {
      const errorEvent = { error, code: "tcp_socket_error" };
      for (const handler of this.errorHandlers) {
        handler(errorEvent);
      }
      if (this.stateValue !== "closed") {
        try {
          this.socket.destroy(error);
        } catch {
        }
      }
    });
  }
  finalizeClose(event) {
    if (this.stateValue === "closed") {
      return;
    }
    if (this.closeFallbackTimer) {
      clearTimeout(this.closeFallbackTimer);
      this.closeFallbackTimer = void 0;
    }
    this.stateValue = "closed";
    this.closeEvent = event;
    this.decoder.reset();
    for (const handler of [...this.closeHandlers]) {
      handler(event);
    }
    this.messageHandlers.clear();
    this.openHandlers.clear();
    this.errorHandlers.clear();
  }
  get state() {
    return this.stateValue;
  }
  send(frame) {
    if (this.stateValue !== "open" || this.socket.destroyed) {
      return;
    }
    try {
      const encoded = this.encoder.encodeFrame(frame.data);
      this.socket.write(encoded);
    } catch (error) {
      const errorEvent = { error, code: "tcp_write_error" };
      for (const handler of this.errorHandlers) {
        handler(errorEvent);
      }
    }
  }
  close(code, reason) {
    if (this.stateValue === "closing" || this.stateValue === "closed") {
      return;
    }
    this.stateValue = "closing";
    this.requestedCloseEvent = {
      code: code != null ? code : 1e3,
      reason: reason != null ? reason : "tcp_connection_closed",
      wasClean: true
    };
    try {
      this.socket.end();
    } catch (error) {
      try {
        this.socket.destroy(error instanceof Error ? error : new Error(String(error)));
      } catch {
        this.finalizeClose({
          code: code != null ? code : 1e3,
          reason: reason != null ? reason : "tcp_close_failed",
          wasClean: false
        });
      }
    }
    this.closeFallbackTimer = setTimeout(() => {
      var _a;
      if (this.stateValue !== "closing") {
        return;
      }
      try {
        this.socket.destroy();
      } catch {
        this.finalizeClose((_a = this.requestedCloseEvent) != null ? _a : {
          code: 1e3,
          reason: "tcp_connection_closed",
          wasClean: true
        });
      }
    }, TCP_CLOSE_GRACE_MS);
  }
  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }
  onOpen(handler) {
    this.openHandlers.add(handler);
    if (this.stateValue === "open" && this.openDispatched) {
      queueMicrotask(() => {
        if (this.openHandlers.has(handler) && this.stateValue === "open") {
          handler();
        }
      });
    }
    return () => this.openHandlers.delete(handler);
  }
  onClose(handler) {
    this.closeHandlers.add(handler);
    if (this.stateValue === "closed") {
      queueMicrotask(() => {
        var _a;
        if (this.closeHandlers.has(handler)) {
          handler((_a = this.closeEvent) != null ? _a : { code: 1e3, reason: "tcp_connection_closed", wasClean: true });
        }
      });
    }
    return () => this.closeHandlers.delete(handler);
  }
  onError(handler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }
};
var ImTcpTransportFactory = class {
  constructor() {
    __publicField(this, "kind", "tcp");
    __publicField(this, "capabilities", TRANSPORT_CAPABILITIES.tcp);
  }
  isAvailable() {
    var _a, _b;
    return typeof globalThis.process !== "undefined" && ((_b = (_a = globalThis.process) == null ? void 0 : _a.versions) == null ? void 0 : _b.node) !== void 0;
  }
  async connect(endpoint, options) {
    var _a;
    const buffer = getRuntimeBuffer();
    if (!buffer) {
      throw new Error("TCP transport requires Node.js Buffer; current environment is unsupported.");
    }
    const netModule = await Promise.resolve().then(() => __toESM(require_node_net(), 1));
    const net = (_a = netModule.default) != null ? _a : netModule;
    const { host, port } = parseTcpEndpoint(endpoint.url);
    const socket = net.createConnection({ host, port });
    try {
      socket.setKeepAlive(true, 3e4);
      socket.setNoDelay(true);
    } catch {
    }
    const connection = new ImTcpTransportConnection(socket, buffer);
    if (connection.state === "closed") {
      return Promise.reject(new Error("TCP connection closed immediately after creation"));
    }
    const timeoutMs = options.connectionTimeoutMs;
    const timer = setTimeout(() => {
      if (connection.state === "connecting") {
        socket.destroy(new Error(`TCP connect timeout after ${timeoutMs}ms`));
      }
    }, timeoutMs);
    connection.onOpen(() => clearTimeout(timer));
    connection.onClose(() => clearTimeout(timer));
    connection.onError(() => clearTimeout(timer));
    return connection;
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/transports/udp-transport.js
var UDP_MAX_DATAGRAM_BYTES = 64 * 1024;
function getRuntimeBuffer2() {
  return globalThis.Buffer;
}
function isBufferLike2(value) {
  return value !== null && typeof value === "object" && "buffer" in value && "byteOffset" in value && "byteLength" in value;
}
function parseUdpEndpoint(url) {
  const parsed = new URL(url);
  const host = parsed.hostname || "127.0.0.1";
  const port = Number.parseInt(parsed.port, 10);
  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid UDP port in URL: ${url}`);
  }
  return { host, port };
}
var ImUdpTransportConnection = class {
  constructor(socket, host, port) {
    __publicField(this, "kind", "udp");
    __publicField(this, "capabilities", TRANSPORT_CAPABILITIES.udp);
    __publicField(this, "socket");
    __publicField(this, "serverHost");
    __publicField(this, "serverPort");
    __publicField(this, "messageHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "openHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "closeHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "errorHandlers", /* @__PURE__ */ new Set());
    __publicField(this, "stateValue", "connecting");
    __publicField(this, "openDispatched", false);
    __publicField(this, "closeEvent");
    __publicField(this, "requestedCloseEvent");
    this.socket = socket;
    this.serverHost = host;
    this.serverPort = port;
    socket.on("message", (msg) => {
      if (this.stateValue !== "open") {
        return;
      }
      const bytes = isBufferLike2(msg) ? new Uint8Array(msg.buffer, msg.byteOffset, msg.byteLength) : msg;
      const text = new TextDecoder().decode(bytes);
      for (const handler of [...this.messageHandlers]) {
        handler({ data: text, isBinary: false });
      }
    });
    socket.on("close", () => {
      var _a;
      this.finalizeClose((_a = this.requestedCloseEvent) != null ? _a : { code: 1e3, reason: "udp_socket_closed", wasClean: true });
    });
    socket.on("error", (error) => {
      const errorEvent = { error, code: "udp_socket_error" };
      for (const handler of this.errorHandlers) {
        handler(errorEvent);
      }
      if (this.stateValue !== "closed") {
        try {
          this.socket.close();
        } catch {
        }
      }
    });
    this.open();
  }
  finalizeClose(event) {
    if (this.stateValue === "closed") {
      return;
    }
    this.stateValue = "closed";
    this.closeEvent = event;
    for (const handler of [...this.closeHandlers]) {
      handler(event);
    }
    this.messageHandlers.clear();
    this.openHandlers.clear();
    this.errorHandlers.clear();
  }
  open() {
    if (this.stateValue === "open") {
      return;
    }
    this.stateValue = "open";
    queueMicrotask(() => {
      if (this.stateValue !== "open") {
        return;
      }
      this.openDispatched = true;
      for (const handler of this.openHandlers) {
        handler();
      }
    });
  }
  get state() {
    return this.stateValue;
  }
  onOpen(handler) {
    this.openHandlers.add(handler);
    if (this.stateValue === "open" && this.openDispatched) {
      queueMicrotask(() => {
        if (this.openHandlers.has(handler) && this.stateValue === "open") {
          handler();
        }
      });
    }
    return () => this.openHandlers.delete(handler);
  }
  send(frame) {
    if (this.stateValue !== "open") {
      return;
    }
    const bytes = typeof frame.data === "string" ? new TextEncoder().encode(frame.data) : frame.data;
    if (bytes.byteLength > UDP_MAX_DATAGRAM_BYTES) {
      const errorEvent = {
        error: new Error(`UDP datagram exceeds max ${UDP_MAX_DATAGRAM_BYTES} bytes: got ${bytes.byteLength}`),
        code: "udp_datagram_too_large"
      };
      for (const handler of this.errorHandlers) {
        handler(errorEvent);
      }
      return;
    }
    this.socket.send(bytes, this.serverPort, this.serverHost, (error) => {
      if (error) {
        const errorEvent = { error, code: "udp_send_error" };
        for (const handler of this.errorHandlers) {
          handler(errorEvent);
        }
      }
    });
  }
  close(code, reason) {
    if (this.stateValue === "closing" || this.stateValue === "closed") {
      return;
    }
    this.stateValue = "closing";
    this.requestedCloseEvent = {
      code: code != null ? code : 1e3,
      reason: reason != null ? reason : "udp_socket_closed",
      wasClean: true
    };
    try {
      this.socket.close();
    } catch {
      this.finalizeClose({
        code: code != null ? code : 1e3,
        reason: reason != null ? reason : "udp_close_failed",
        wasClean: false
      });
    }
  }
  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }
  onClose(handler) {
    this.closeHandlers.add(handler);
    if (this.stateValue === "closed") {
      queueMicrotask(() => {
        var _a;
        if (this.closeHandlers.has(handler)) {
          handler((_a = this.closeEvent) != null ? _a : { code: 1e3, reason: "udp_socket_closed", wasClean: true });
        }
      });
    }
    return () => this.closeHandlers.delete(handler);
  }
  onError(handler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }
};
var ImUdpTransportFactory = class {
  constructor() {
    __publicField(this, "kind", "udp");
    __publicField(this, "capabilities", TRANSPORT_CAPABILITIES.udp);
  }
  isAvailable() {
    var _a, _b;
    return typeof globalThis.process !== "undefined" && ((_b = (_a = globalThis.process) == null ? void 0 : _a.versions) == null ? void 0 : _b.node) !== void 0;
  }
  async connect(endpoint, options) {
    var _a;
    const buffer = getRuntimeBuffer2();
    if (!buffer) {
      throw new Error("UDP transport requires Node.js Buffer; current environment is unsupported.");
    }
    const dgramModule = await Promise.resolve().then(() => __toESM(require_node_dgram(), 1));
    const dgram = (_a = dgramModule.default) != null ? _a : dgramModule;
    const { host, port } = parseUdpEndpoint(endpoint.url);
    const socket = dgram.createSocket("udp4");
    try {
      socket.unref();
    } catch {
    }
    await new Promise((resolve2, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        settled = true;
        socket.off("listening", onListening);
        socket.off("error", onError);
        try {
          socket.close();
        } catch {
        }
        reject(new Error(`UDP bind timeout after ${options.connectionTimeoutMs}ms`));
      }, options.connectionTimeoutMs);
      const onListening = () => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        socket.off("error", onError);
        resolve2();
      };
      const onError = (error) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        socket.off("listening", onListening);
        try {
          socket.close();
        } catch {
        }
        reject(error);
      };
      socket.on("listening", onListening);
      socket.on("error", onError);
      try {
        socket.bind(0, "0.0.0.0");
      } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    });
    return new ImUdpTransportConnection(socket, host, port);
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/transports/index.js
function createDefaultTransportFactories(webSocketFactory) {
  const factories = /* @__PURE__ */ new Map();
  factories.set("websocket", new ImWebSocketTransportFactory(webSocketFactory));
  factories.set("tcp", new ImTcpTransportFactory());
  factories.set("udp", new ImUdpTransportFactory());
  return factories;
}

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/transport-selector.js
function detectAvailableTransports(factories) {
  const available = [];
  for (const kind of ["websocket", "tcp", "udp"]) {
    const factory = factories.get(kind);
    if (factory == null ? void 0 : factory.isAvailable()) {
      available.push(kind);
    }
  }
  return available;
}
function selectTransportFactory(factories, policy = DEFAULT_TRANSPORT_SELECTION_POLICY, preferred) {
  if (preferred) {
    const factory = factories.get(preferred);
    if (factory == null ? void 0 : factory.isAvailable()) {
      return factory;
    }
    if (!policy.autoFallback) {
      throw new Error(`Preferred transport "${preferred}" is not available in the current environment.`);
    }
  }
  for (const kind of policy.preferred) {
    const factory = factories.get(kind);
    if (factory == null ? void 0 : factory.isAvailable()) {
      return factory;
    }
  }
  throw new Error("No transport is available in the current environment. Provide a custom ImTransportFactory or run in a supported runtime (browser/Node).");
}
function buildTransportEndpoint(baseUrl, kind, deviceId) {
  const urlKind = parseTransportKindFromUrl(baseUrl);
  if (urlKind === kind && kind !== "websocket") {
    return {
      kind,
      url: baseUrl,
      deviceId
    };
  }
  const url = convertBaseUrlForTransport(baseUrl, kind, deviceId);
  return {
    kind,
    url,
    deviceId,
    ...kind === "websocket" ? { protocols: [IM_CCP_WEBSOCKET_SUBPROTOCOL] } : {}
  };
}
function convertBaseUrlForTransport(baseUrl, kind, deviceId) {
  const trimmed = baseUrl.trim().replace(/\/+$/u, "");
  if (kind === "websocket") {
    let wsUrl;
    if (trimmed.startsWith("https://")) {
      wsUrl = `wss://${trimmed.slice("https://".length)}`;
    } else if (trimmed.startsWith("http://")) {
      wsUrl = `ws://${trimmed.slice("http://".length)}`;
    } else if (trimmed.startsWith("wss://") || trimmed.startsWith("ws://")) {
      wsUrl = trimmed;
    } else {
      wsUrl = `ws://${trimmed}`;
    }
    const parsed = new URL(wsUrl);
    const basePath = parsed.pathname.replace(/\/+$/u, "");
    parsed.pathname = basePath.endsWith(IM_REALTIME_WS) ? basePath : `${basePath}${IM_REALTIME_WS}`;
    if (deviceId) {
      parsed.searchParams.set("deviceId", deviceId);
    }
    return parsed.toString();
  }
  if (kind === "tcp") {
    const hostPort = extractHostPort(trimmed);
    return `tcp://${hostPort}`;
  }
  if (kind === "udp") {
    const hostPort = extractHostPort(trimmed);
    return `udp://${hostPort}`;
  }
  return trimmed;
}
function extractHostPort(url) {
  const match = url.match(/^[a-z]+:\/\/([^/]+)/i);
  if (match) {
    return match[1];
  }
  return url;
}
var ImTransportSelector = class {
  constructor(factories, policy = DEFAULT_TRANSPORT_SELECTION_POLICY) {
    __publicField(this, "factories");
    __publicField(this, "policy");
    this.factories = factories;
    this.policy = policy;
  }
  /** 检测当前环境可用的传输类型。 */
  detectAvailable() {
    return detectAvailableTransports(this.factories);
  }
  /** 获取指定类型的传输工厂。 */
  getFactory(kind) {
    return this.factories.get(kind);
  }
  /** 构建指定类型的传输端点。 */
  buildEndpoint(kind, baseUrl, deviceId) {
    return buildTransportEndpoint(baseUrl, kind, deviceId);
  }
  /**
   * 构建候选传输列表，用于连接失败降级。
   *
   * 排序规则：
   * 1. 如果指定了 preferredKind 且可用，放在首位
   * 2. 然后按 policy.preferred 顺序追加其他可用传输（排除已添加的）
   *
   * @param preferredKind 可选的手动覆盖传输类型
   * @returns 候选传输类型列表，按优先级排序
   */
  buildCandidateList(preferredKind) {
    const candidates = [];
    const seen = /* @__PURE__ */ new Set();
    const tryAdd = (kind) => {
      if (seen.has(kind)) {
        return;
      }
      const factory = this.factories.get(kind);
      if (factory == null ? void 0 : factory.isAvailable()) {
        candidates.push(kind);
        seen.add(kind);
      }
    };
    if (preferredKind) {
      tryAdd(preferredKind);
    }
    for (const kind of this.policy.preferred) {
      tryAdd(kind);
    }
    return candidates;
  }
  /**
   * 选择传输并构建端点（同步，仅用于已确定传输类型的场景）。
   *
   * @param baseUrl 基础 URL
   * @param preferredKind 可选的手动覆盖传输类型
   * @param deviceId 可选设备 ID
   */
  select(baseUrl, preferredKind, deviceId) {
    const factory = selectTransportFactory(this.factories, this.policy, preferredKind);
    const endpoint = buildTransportEndpoint(baseUrl, factory.kind, deviceId);
    return { factory, endpoint };
  }
};

// ../../sdks/sdkwork-im-sdk/sdkwork-im-sdk-typescript/dist/sdk.js
function normalizeTransportProbeTimeout(value) {
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_TRANSPORT_SELECTION_POLICY.probeTimeoutMs;
}
async function waitForTransportOpen(transport, timeoutMs) {
  if (transport.state === "open") {
    return;
  }
  if (transport.state === "closed" || transport.state === "closing") {
    throw new Error(`Transport "${transport.kind}" closed before it became ready.`);
  }
  await new Promise((resolve2, reject) => {
    let settled = false;
    let timer;
    let unsubscribeOpen;
    let unsubscribeClose;
    let unsubscribeError;
    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
      unsubscribeOpen == null ? void 0 : unsubscribeOpen();
      unsubscribeClose == null ? void 0 : unsubscribeClose();
      unsubscribeError == null ? void 0 : unsubscribeError();
      unsubscribeOpen = void 0;
      unsubscribeClose = void 0;
      unsubscribeError = void 0;
    };
    const finish = (error) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      if (error === void 0) {
        resolve2();
      } else {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };
    unsubscribeOpen = transport.onOpen(() => finish());
    unsubscribeClose = transport.onClose((event) => finish(new Error(`Transport "${transport.kind}" closed before open (${event.code}: ${event.reason}).`)));
    unsubscribeError = transport.onError((event) => finish(event.error));
    timer = setTimeout(() => finish(new Error(`Transport "${transport.kind}" probe timed out after ${timeoutMs}ms.`)), timeoutMs);
    if (transport.state === "open") {
      finish();
    } else if (transport.state === "closed" || transport.state === "closing") {
      finish(new Error(`Transport "${transport.kind}" closed before it became ready.`));
    }
  });
}
function resolveApiBaseUrl(options) {
  var _a;
  const fromOptions = (_a = options.apiBaseUrl) != null ? _a : options.baseUrl;
  if (fromOptions) {
    return fromOptions;
  }
  if (options.websocketBaseUrl) {
    return options.websocketBaseUrl.replace(/^ws/u, "http");
  }
  const fromEnv = resolveBaseUrl({
    envKey: "SDKWORK_IM_API_BASE_URL",
    preservePath: true
  }).url;
  if (fromEnv) {
    return fromEnv;
  }
  throw new Error('ImSdkClient requires an apiBaseUrl or baseUrl option, or SDKWORK_IM_API_BASE_URL env var. Set it explicitly: new ImSdkClient({ apiBaseUrl: "https://your-im-gateway.example.com" })');
}
function resolveWebsocketBaseUrl(options) {
  var _a;
  return (_a = options.websocketBaseUrl) != null ? _a : resolveApiBaseUrl(options).replace(/^http/u, "ws");
}
function toGeneratedConfig(options) {
  var _a, _b, _c, _d;
  assertCredentialMode(options);
  const apiKey = normalizeCredential(options.apiKey);
  return {
    baseUrl: resolveApiBaseUrl(options),
    accessToken: apiKey ? void 0 : options.accessToken,
    apiKey,
    authToken: apiKey ? void 0 : options.authToken,
    headers: {
      ...(_a = options.headers) != null ? _a : {},
      ...(_c = (_b = options.headerProvider) == null ? void 0 : _b.call(options)) != null ? _c : {}
    },
    platform: options.platform,
    timeout: options.timeout,
    tokenManager: apiKey ? void 0 : (_d = options.tokenManager) != null ? _d : options.tokenProvider
  };
}
function normalizeCredential(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function readProviderCredential(provider, getter) {
  if (!provider || typeof provider !== "object") {
    return void 0;
  }
  const resolve2 = provider[getter];
  return typeof resolve2 === "function" ? normalizeCredential(resolve2.call(provider)) : void 0;
}
function assertCredentialMode(options) {
  var _a, _b, _c;
  const apiKey = normalizeCredential(options.apiKey);
  if (!apiKey) {
    return;
  }
  const provider = (_a = options.tokenManager) != null ? _a : options.tokenProvider;
  const authToken = (_b = normalizeCredential(options.authToken)) != null ? _b : readProviderCredential(provider, "getAuthToken");
  const accessToken = (_c = normalizeCredential(options.accessToken)) != null ? _c : readProviderCredential(provider, "getAccessToken");
  if (authToken || accessToken) {
    throw new Error("ImSdkClient apiKey mode must not be combined with authToken, accessToken, tokenManager, or tokenProvider credentials.");
  }
}
var ImSdkClient = class {
  constructor(options = {}) {
    __publicField(this, "chat");
    __publicField(this, "calls");
    __publicField(this, "conversations");
    __publicField(this, "messages");
    __publicField(this, "rooms");
    __publicField(this, "social");
    __publicField(this, "options");
    __publicField(this, "transportClient");
    __publicField(this, "websocketBaseUrl");
    this.options = options;
    this.websocketBaseUrl = resolveWebsocketBaseUrl(options);
    const generatedClient = new SdkworkImClient(toGeneratedConfig(options));
    this.transportClient = generatedClient;
    this.chat = this.transportClient.chat;
    this.social = composeSocialSurface(generatedClient.social);
    this.messages = new ImMessagesModule(this.transportClient);
    this.conversations = new ImConversationsModule(this.transportClient);
    this.rooms = new ImRoomsModule(this.transportClient);
    this.calls = new ImCallsModule(this.transportClient, {
      connect: (connectOptions) => this.connect(connectOptions)
    });
  }
  get transport() {
    return this.transportClient;
  }
  setApiKey(apiKey) {
    var _a, _b;
    const normalizedApiKey = normalizeCredential(apiKey);
    if (!normalizedApiKey) {
      throw new Error("ImSdkClient apiKey must not be empty.");
    }
    this.options.apiKey = normalizedApiKey;
    this.options.authToken = void 0;
    this.options.accessToken = void 0;
    this.options.tokenManager = void 0;
    this.options.tokenProvider = void 0;
    (_b = (_a = this.transportClient).setApiKey) == null ? void 0 : _b.call(_a, normalizedApiKey);
    return this;
  }
  setAuthToken(token) {
    var _a, _b;
    this.options.apiKey = void 0;
    this.options.authToken = token;
    (_b = (_a = this.transportClient).setAuthToken) == null ? void 0 : _b.call(_a, token);
    return this;
  }
  setAccessToken(token) {
    var _a, _b;
    this.options.apiKey = void 0;
    this.options.accessToken = token;
    (_b = (_a = this.transportClient).setAccessToken) == null ? void 0 : _b.call(_a, token);
    return this;
  }
  setTokenManager(manager) {
    var _a, _b;
    this.options.apiKey = void 0;
    this.options.tokenManager = manager;
    this.options.tokenProvider = void 0;
    (_b = (_a = this.transportClient).setTokenManager) == null ? void 0 : _b.call(_a, manager);
    return this;
  }
  connect(options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const useMultiTransport = Boolean(this.options.transport || this.options.transportFactories || this.options.transportPolicy);
    if (!useMultiTransport) {
      return Promise.resolve(createImLiveConnection({
        accessToken: this.options.accessToken,
        auth: this.options.webSocketAuth,
        authToken: this.options.authToken,
        headerProvider: this.options.headerProvider,
        headers: this.options.headers,
        options,
        tokenManager: (_a = this.options.tokenManager) != null ? _a : this.options.tokenProvider,
        websocketBaseUrl: this.websocketBaseUrl,
        webSocketFactory: this.options.webSocketFactory
      }));
    }
    const factories = (_b = this.options.transportFactories) != null ? _b : createDefaultTransportFactories(this.options.webSocketFactory);
    const policy = (_c = this.options.transportPolicy) != null ? _c : DEFAULT_TRANSPORT_SELECTION_POLICY;
    const selector = new ImTransportSelector(factories, policy);
    const connectionTimeoutMs = (_d = options.connectionTimeoutMs) != null ? _d : 15e3;
    const headers = {
      ...(_e = this.options.headers) != null ? _e : {},
      ...(_h = (_g = (_f = this.options).headerProvider) == null ? void 0 : _g.call(_f)) != null ? _h : {}
    };
    const connectOptions = {
      connectionTimeoutMs,
      headers,
      protocols: [IM_CCP_WEBSOCKET_SUBPROTOCOL]
    };
    const candidates = selector.buildCandidateList(this.options.transport);
    if (this.options.transport && !policy.autoFallback) {
      const preferredFactory = factories.get(this.options.transport);
      if (!(preferredFactory == null ? void 0 : preferredFactory.isAvailable())) {
        return Promise.reject(new Error(`Preferred transport "${this.options.transport}" is not available in the current environment.`));
      }
    }
    return this.connectWithFallback(candidates, selector, options.deviceId, connectOptions, options, policy.autoFallback, normalizeTransportProbeTimeout(policy.probeTimeoutMs));
  }
  /**
   * 按候选顺序尝试连接，传输层连接失败时自动降级到下一个。
   *
   * 注意：此降级仅覆盖 factory.connect() 阶段（传输层建立）。
   * CCP 握手失败（如认证错误）不触发降级，因为可能是凭据问题而非传输不可用。
   */
  async connectWithFallback(candidates, selector, deviceId, connectOptions, options, autoFallback, probeTimeoutMs, lastError) {
    var _a;
    if (candidates.length === 0) {
      if (lastError !== void 0) {
        throw lastError;
      }
      throw new Error("No transport is available in the current environment.");
    }
    const [kind, ...rest] = candidates;
    const factory = selector.getFactory(kind);
    if (!factory) {
      return this.connectWithFallback(rest, selector, deviceId, connectOptions, options, autoFallback, probeTimeoutMs, lastError);
    }
    const endpoint = selector.buildEndpoint(kind, this.websocketBaseUrl, deviceId);
    let transport;
    try {
      transport = await factory.connect(endpoint, connectOptions);
      await waitForTransportOpen(transport, probeTimeoutMs);
    } catch (error) {
      try {
        transport == null ? void 0 : transport.close(4008, "transport_probe_failed");
      } catch {
      }
      if (!autoFallback) {
        throw error;
      }
      return this.connectWithFallback(rest, selector, deviceId, connectOptions, options, autoFallback, probeTimeoutMs, error);
    }
    try {
      return createImLiveConnection({
        accessToken: this.options.accessToken,
        auth: this.options.webSocketAuth,
        authToken: this.options.authToken,
        headerProvider: this.options.headerProvider,
        headers: this.options.headers,
        options,
        tokenManager: (_a = this.options.tokenManager) != null ? _a : this.options.tokenProvider,
        websocketBaseUrl: this.websocketBaseUrl,
        webSocketFactory: this.options.webSocketFactory,
        transport
      });
    } catch (error) {
      transport.close(4e3, "live_connection_init_failed");
      throw error;
    }
  }
  addReaction(messageId, reactionKeyOrBody) {
    return this.messages.addReaction(messageId, reactionKeyOrBody);
  }
  removeReaction(messageId, reactionKeyOrBody) {
    return this.messages.removeReaction(messageId, reactionKeyOrBody);
  }
  pinMessage(messageId) {
    return this.messages.pinMessage(messageId);
  }
  unpinMessage(messageId) {
    return this.messages.unpinMessage(messageId);
  }
  deleteMessageForMe(messageId) {
    return this.messages.deleteForMe(messageId);
  }
  recallMessage(messageId, body) {
    return this.messages.recall(messageId, body);
  }
  editMessage(messageId, body) {
    return this.messages.edit(messageId, body);
  }
  listMessageFavorites(params) {
    return this.messages.listFavorites(params);
  }
  favoriteMessage(messageId, body) {
    return this.messages.favoriteMessage(messageId, body);
  }
  deleteMessageFavorite(favoriteId) {
    return this.messages.deleteFavorite(favoriteId);
  }
};

// packages/sdkwork-im-mp-core/src/sdk/imSdkClient.ts
var imSdkClient = null;
var configuredBaseUrl = null;
function configureImMpApiBaseUrl(baseUrl) {
  const normalized = baseUrl.trim().replace(/\/+$/u, "");
  if (normalized.length === 0) {
    throw new Error("SDKWORK_IM_APPLICATION_PUBLIC_HTTP_URL is required");
  }
  configuredBaseUrl = normalized;
}
function resolveImMpApiBaseUrl() {
  if (!configuredBaseUrl) {
    throw new Error("IM API base URL must be configured before SDK bootstrap");
  }
  return configuredBaseUrl;
}
function createImSdkClientConfig(baseUrl, overrides = {}) {
  var _a, _b;
  configureImMpApiBaseUrl(baseUrl);
  const session = readImMpSession();
  const accessToken = (_a = overrides.accessToken) != null ? _a : resolveImMpAccessToken(session);
  const authToken = (_b = overrides.authToken) != null ? _b : resolveImMpAuthToken(session);
  const options = {
    apiBaseUrl: resolveImMpApiBaseUrl(),
    platform: "mini-program"
  };
  if (overrides.websocketBaseUrl) {
    options.websocketBaseUrl = overrides.websocketBaseUrl;
  }
  if (accessToken) {
    options.accessToken = accessToken;
  }
  if (authToken) {
    options.authToken = authToken;
  }
  if (overrides.tokenManager) {
    options.tokenManager = overrides.tokenManager;
  }
  if (overrides.webSocketFactory) {
    options.webSocketFactory = overrides.webSocketFactory;
  }
  return options;
}
function initImSdkClient(options) {
  imSdkClient = new ImSdkClient(options);
  return imSdkClient;
}

// ../../../sdkwork-utils/packages/sdkwork-utils-typescript/src/runtime/binary.ts
var textEncoder2 = new TextEncoder();
function toUtf82(value) {
  return textEncoder2.encode(value);
}
var HEX2 = "0123456789abcdef";
function hexEncode2(bytes) {
  let result = "";
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = bytes[index];
    if (byte === void 0) {
      continue;
    }
    result += HEX2[byte >> 4];
    result += HEX2[byte & 15];
  }
  return result;
}

// ../../../sdkwork-utils/packages/sdkwork-utils-typescript/src/runtime/sha256.ts
var K2 = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var BLOCK_SIZE2 = 64;
function rotr2(value, shift) {
  return value >>> shift | value << 32 - shift;
}
function readBlockU32(block, byteOffset) {
  return block[byteOffset] << 24 | block[byteOffset + 1] << 16 | block[byteOffset + 2] << 8 | block[byteOffset + 3];
}
function sha256Block2(state, block, offset) {
  const words = new Uint32Array(64);
  for (let index = 0; index < 16; index += 1) {
    words[index] = readBlockU32(block, offset + index * 4);
  }
  for (let index = 16; index < 64; index += 1) {
    const wordMinus15 = words[index - 15];
    const wordMinus2 = words[index - 2];
    const wordMinus16 = words[index - 16];
    const wordMinus7 = words[index - 7];
    const s0 = rotr2(wordMinus15, 7) ^ rotr2(wordMinus15, 18) ^ wordMinus15 >>> 3;
    const s1 = rotr2(wordMinus2, 17) ^ rotr2(wordMinus2, 19) ^ wordMinus2 >>> 10;
    words[index] = wordMinus16 + s0 + wordMinus7 + s1 >>> 0;
  }
  let a = state[0];
  let b = state[1];
  let c = state[2];
  let d = state[3];
  let e = state[4];
  let f = state[5];
  let g = state[6];
  let h = state[7];
  for (let index = 0; index < 64; index += 1) {
    const s1 = rotr2(e, 6) ^ rotr2(e, 11) ^ rotr2(e, 25);
    const ch = e & f ^ ~e & g;
    const temp1 = h + s1 + ch + K2[index] + words[index] >>> 0;
    const s0 = rotr2(a, 2) ^ rotr2(a, 13) ^ rotr2(a, 22);
    const maj = a & b ^ a & c ^ b & c;
    const temp2 = s0 + maj >>> 0;
    h = g;
    g = f;
    f = e;
    e = d + temp1 >>> 0;
    d = c;
    c = b;
    b = a;
    a = temp1 + temp2 >>> 0;
  }
  state[0] = state[0] + a >>> 0;
  state[1] = state[1] + b >>> 0;
  state[2] = state[2] + c >>> 0;
  state[3] = state[3] + d >>> 0;
  state[4] = state[4] + e >>> 0;
  state[5] = state[5] + f >>> 0;
  state[6] = state[6] + g >>> 0;
  state[7] = state[7] + h >>> 0;
}
function sha256Digest2(value) {
  const bitLength = value.length * 8;
  const paddingLength = (BLOCK_SIZE2 - (value.length + 9) % BLOCK_SIZE2) % BLOCK_SIZE2 + 9;
  const padded = new Uint8Array(value.length + paddingLength);
  padded.set(value);
  padded[value.length] = 128;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLength >>> 0, false);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 4294967296), false);
  const state = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  for (let offset = 0; offset < padded.length; offset += BLOCK_SIZE2) {
    sha256Block2(state, padded, offset);
  }
  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  for (let index = 0; index < state.length; index += 1) {
    digestView.setUint32(index * 4, state[index], false);
  }
  return digest;
}
var SHA256_INITIAL_STATE2 = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
function sha256Hex2(value) {
  const bytes = typeof value === "string" ? toUtf82(value) : value;
  return hexEncode2(sha256Digest2(bytes));
}

// ../../../sdkwork-utils/packages/sdkwork-utils-typescript/src/crypto.ts
function sha256Hash2(value) {
  return sha256Hex2(value);
}

// ../../../sdkwork-utils/packages/sdkwork-utils-typescript/src/money.ts
var LOCALE_RULES = {
  "en-us": {
    prefix: true,
    decimal: ".",
    grouping: ",",
    nameSpace: true,
    compact: [
      { exponent: 12, unit: "T" },
      { exponent: 9, unit: "B" },
      { exponent: 6, unit: "M" },
      { exponent: 3, unit: "K" }
    ]
  },
  "zh-cn": {
    prefix: true,
    decimal: ".",
    grouping: ",",
    nameSpace: false,
    compact: [
      { exponent: 12, unit: "\u5146" },
      { exponent: 8, unit: "\u4EBF" },
      { exponent: 4, unit: "\u4E07" }
    ]
  },
  "ja-jp": {
    prefix: true,
    decimal: ".",
    grouping: ",",
    nameSpace: false,
    compact: [
      { exponent: 12, unit: "\u5146" },
      { exponent: 8, unit: "\u5104" },
      { exponent: 4, unit: "\u4E07" }
    ]
  },
  "ko-kr": {
    prefix: true,
    decimal: ".",
    grouping: ",",
    nameSpace: false,
    compact: [
      { exponent: 12, unit: "\uC870" },
      { exponent: 8, unit: "\uC5B5" },
      { exponent: 4, unit: "\uB9CC" }
    ]
  },
  "de-de": {
    prefix: false,
    decimal: ",",
    grouping: ".",
    nameSpace: true,
    compact: [
      { exponent: 12, unit: "Bio." },
      { exponent: 9, unit: "Mrd." },
      { exponent: 6, unit: "Mio." },
      { exponent: 3, unit: "Tsd." }
    ]
  },
  "fr-fr": {
    prefix: false,
    decimal: ",",
    grouping: " ",
    nameSpace: true,
    compact: [
      { exponent: 12, unit: "B" },
      { exponent: 9, unit: "Md" },
      { exponent: 6, unit: "M" },
      { exponent: 3, unit: "k" }
    ]
  },
  "it-it": {
    prefix: false,
    decimal: ",",
    grouping: ".",
    nameSpace: true,
    compact: [
      { exponent: 12, unit: "Bio." },
      { exponent: 9, unit: "Mrd." },
      { exponent: 6, unit: "M" },
      { exponent: 3, unit: "k" }
    ]
  },
  "es-es": {
    prefix: false,
    decimal: ",",
    grouping: ".",
    nameSpace: true,
    compact: [
      { exponent: 12, unit: "T" },
      { exponent: 9, unit: "B" },
      { exponent: 6, unit: "M" },
      { exponent: 3, unit: "k" }
    ]
  },
  "ru-ru": {
    prefix: false,
    decimal: ",",
    grouping: " ",
    nameSpace: true,
    compact: [
      { exponent: 12, unit: "\u0442\u0440\u043B\u043D" },
      { exponent: 9, unit: "\u043C\u043B\u0440\u0434" },
      { exponent: 6, unit: "\u043C\u043B\u043D" },
      { exponent: 3, unit: "\u0442\u044B\u0441." }
    ]
  }
};
var CURRENCY_NAMES = {
  "en-us": {
    USD: "US dollars",
    EUR: "euros",
    GBP: "British pounds",
    CNY: "Chinese yuan",
    JPY: "Japanese yen",
    KRW: "South Korean won",
    HKD: "Hong Kong dollars",
    TWD: "New Taiwan dollars",
    CHF: "Swiss francs",
    CAD: "Canadian dollars",
    AUD: "Australian dollars",
    INR: "Indian rupees",
    BHD: "Bahraini dinars",
    KWD: "Kuwaiti dinars"
  },
  "zh-cn": {
    USD: "\u7F8E\u5143",
    EUR: "\u6B27\u5143",
    GBP: "\u82F1\u9563",
    CNY: "\u4EBA\u6C11\u5E01",
    JPY: "\u65E5\u5143",
    KRW: "\u97E9\u5143",
    HKD: "\u6E2F\u5E01",
    TWD: "\u65B0\u53F0\u5E01",
    CHF: "\u745E\u58EB\u6CD5\u90CE",
    CAD: "\u52A0\u62FF\u5927\u5143",
    AUD: "\u6FB3\u5927\u5229\u4E9A\u5143",
    INR: "\u5370\u5EA6\u5362\u6BD4",
    BHD: "\u5DF4\u6797\u7B2C\u7EB3\u5C14",
    KWD: "\u79D1\u5A01\u7279\u7B2C\u7EB3\u5C14"
  },
  "de-de": {
    USD: "US-Dollar",
    EUR: "Euro",
    GBP: "Britisches Pfund",
    CNY: "Chinesischer Yuan",
    JPY: "Japanischer Yen",
    KRW: "S\xFCdkoreanischer Won",
    HKD: "Hongkong-Dollar",
    TWD: "Neuer Taiwan-Dollar",
    CHF: "Schweizer Franken",
    CAD: "Kanadischer Dollar",
    AUD: "Australischer Dollar",
    INR: "Indische Rupie",
    BHD: "Bahrainischer Dinar",
    KWD: "Kuwaitischer Dinar"
  },
  "fr-fr": {
    USD: "dollar am\xE9ricain",
    EUR: "euro",
    GBP: "livre sterling",
    CNY: "yuan chinois",
    JPY: "yen japonais",
    KRW: "won sud-cor\xE9en",
    HKD: "dollar de Hong Kong",
    TWD: "nouveau dollar de Ta\xEFwan",
    CHF: "franc suisse",
    CAD: "dollar canadien",
    AUD: "dollar australien",
    INR: "roupie indienne",
    BHD: "dinar bahre\xEFni",
    KWD: "dinar kowe\xEFtien"
  },
  "it-it": {
    USD: "dollaro statunitense",
    EUR: "euro",
    GBP: "sterlina britannica",
    CNY: "yuan cinese",
    JPY: "yen giapponese",
    KRW: "won sudcoreano",
    HKD: "dollaro di Hong Kong",
    TWD: "nuovo dollaro taiwanese",
    CHF: "franco svizzero",
    CAD: "dollaro canadese",
    AUD: "dollaro australiano",
    INR: "rupia indiana",
    BHD: "dinaro bahreinita",
    KWD: "dinaro kuwaitiano"
  },
  "es-es": {
    USD: "d\xF3lar estadounidense",
    EUR: "euro",
    GBP: "libra esterlina",
    CNY: "yuan chino",
    JPY: "yen japon\xE9s",
    KRW: "won surcoreano",
    HKD: "d\xF3lar de Hong Kong",
    TWD: "nuevo d\xF3lar taiwan\xE9s",
    CHF: "franco suizo",
    CAD: "d\xF3lar canadiense",
    AUD: "d\xF3lar australiano",
    INR: "rupia india",
    BHD: "dinar bahrein\xED",
    KWD: "dinar kuwait\xED"
  },
  "ja-jp": {
    USD: "\u7C73\u30C9\u30EB",
    EUR: "\u30E6\u30FC\u30ED",
    GBP: "\u82F1\u30DD\u30F3\u30C9",
    CNY: "\u4E2D\u56FD\u4EBA\u6C11\u5143",
    JPY: "\u65E5\u672C\u5186",
    KRW: "\u97D3\u56FD\u30A6\u30A9\u30F3",
    HKD: "\u9999\u6E2F\u30C9\u30EB",
    TWD: "\u53F0\u6E7E\u30C9\u30EB",
    CHF: "\u30B9\u30A4\u30B9\u30D5\u30E9\u30F3",
    CAD: "\u30AB\u30CA\u30C0\u30C9\u30EB",
    AUD: "\u30AA\u30FC\u30B9\u30C8\u30E9\u30EA\u30A2\u30C9\u30EB",
    INR: "\u30A4\u30F3\u30C9\u30EB\u30D4\u30FC",
    BHD: "\u30D0\u30FC\u30EC\u30FC\u30F3\u30C7\u30A3\u30FC\u30CA\u30FC\u30EB",
    KWD: "\u30AF\u30A6\u30A7\u30FC\u30C8\u30C7\u30A3\u30CA\u30FC\u30EB"
  },
  "ko-kr": {
    USD: "\uBBF8\uAD6D \uB2EC\uB7EC",
    EUR: "\uC720\uB85C",
    GBP: "\uC601\uAD6D \uD30C\uC6B4\uB4DC",
    CNY: "\uC911\uAD6D \uC704\uC548",
    JPY: "\uC77C\uBCF8 \uC5D4",
    KRW: "\uB300\uD55C\uBBFC\uAD6D \uC6D0",
    HKD: "\uD64D\uCF69 \uB2EC\uB7EC",
    TWD: "\uC2E0 \uB300\uB9CC \uB2EC\uB7EC",
    CHF: "\uC2A4\uC704\uC2A4 \uD504\uB791",
    CAD: "\uCE90\uB098\uB2E4 \uB2EC\uB7EC",
    AUD: "\uD638\uC8FC \uB2EC\uB7EC",
    INR: "\uC778\uB3C4 \uB8E8\uD53C",
    BHD: "\uBC14\uB808\uC778 \uB514\uB098\uB974",
    KWD: "\uCFE0\uC6E8\uC774\uD2B8 \uB514\uB098\uB974"
  },
  "ru-ru": {
    USD: "\u0434\u043E\u043B\u043B\u0430\u0440 \u0421\u0428\u0410",
    EUR: "\u0435\u0432\u0440\u043E",
    GBP: "\u0431\u0440\u0438\u0442\u0430\u043D\u0441\u043A\u0438\u0439 \u0444\u0443\u043D\u0442",
    CNY: "\u043A\u0438\u0442\u0430\u0439\u0441\u043A\u0438\u0439 \u044E\u0430\u043D\u044C",
    JPY: "\u044F\u043F\u043E\u043D\u0441\u043A\u0430\u044F \u0438\u0435\u043D\u0430",
    KRW: "\u044E\u0436\u043D\u043E\u043A\u043E\u0440\u0435\u0439\u0441\u043A\u0430\u044F \u0432\u043E\u043D\u0430",
    HKD: "\u0433\u043E\u043D\u043A\u043E\u043D\u0433\u0441\u043A\u0438\u0439 \u0434\u043E\u043B\u043B\u0430\u0440",
    TWD: "\u043D\u043E\u0432\u044B\u0439 \u0442\u0430\u0439\u0432\u0430\u043D\u044C\u0441\u043A\u0438\u0439 \u0434\u043E\u043B\u043B\u0430\u0440",
    CHF: "\u0448\u0432\u0435\u0439\u0446\u0430\u0440\u0441\u043A\u0438\u0439 \u0444\u0440\u0430\u043D\u043A",
    CAD: "\u043A\u0430\u043D\u0430\u0434\u0441\u043A\u0438\u0439 \u0434\u043E\u043B\u043B\u0430\u0440",
    AUD: "\u0430\u0432\u0441\u0442\u0440\u0430\u043B\u0438\u0439\u0441\u043A\u0438\u0439 \u0434\u043E\u043B\u043B\u0430\u0440",
    INR: "\u0438\u043D\u0434\u0438\u0439\u0441\u043A\u0430\u044F \u0440\u0443\u043F\u0438\u044F",
    BHD: "\u0431\u0430\u0445\u0440\u0435\u0439\u043D\u0441\u043A\u0438\u0439 \u0434\u0438\u043D\u0430\u0440",
    KWD: "\u043A\u0443\u0432\u0435\u0439\u0442\u0441\u043A\u0438\u0439 \u0434\u0438\u043D\u0430\u0440"
  }
};
var DEFAULT_LOCALE_RULES = LOCALE_RULES["en-us"];
var DEFAULT_CURRENCY_NAMES = CURRENCY_NAMES["en-us"];

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/http/client.ts
var _HttpClient2 = class _HttpClient2 extends BaseHttpClient {
  constructor(config) {
    super(config);
  }
  static normalizeCredential(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
  }
  getInternalAuthConfig() {
    const self = this;
    self.authConfig = self.authConfig || {};
    return self.authConfig;
  }
  getInternalHeaders() {
    const self = this;
    self.config = self.config || {};
    self.config.headers = self.config.headers || {};
    return self.config.headers;
  }
  buildRequestHeaders(headers, contentType) {
    const mergedHeaders = {
      ...headers != null ? headers : {}
    };
    if (contentType && contentType.toLowerCase() !== "multipart/form-data") {
      mergedHeaders["Content-Type"] = contentType;
    }
    return Object.keys(mergedHeaders).length > 0 ? mergedHeaders : void 0;
  }
  async applySdkworkRequestBodyFingerprint(headers, body) {
    if (!_HttpClient2.SDKWORK_V3_REQUEST_FINGERPRINTS || body == null || !this.hasNonEmptyHeader(headers, "Idempotency-Key") || this.hasNonEmptyHeader(headers, "X-Content-SHA256") || this.hasNonEmptyHeader(headers, "X-Idempotency-Fingerprint")) {
      return headers;
    }
    const fingerprint = await this.createSdkworkRequestBodyFingerprint(body);
    if (!fingerprint) {
      return headers;
    }
    const normalizedFingerprintHeader = fingerprint.header.toLowerCase();
    const preparedHeaders = Object.fromEntries(
      Object.entries(headers != null ? headers : {}).filter(
        ([headerName]) => headerName.toLowerCase() !== normalizedFingerprintHeader
      )
    );
    return {
      ...preparedHeaders,
      [fingerprint.header]: fingerprint.value
    };
  }
  hasNonEmptyHeader(headers, name) {
    const normalizedName = name.toLowerCase();
    return Object.entries(headers != null ? headers : {}).some(
      ([headerName, value]) => headerName.toLowerCase() === normalizedName && value.trim().length > 0
    );
  }
  async createSdkworkRequestBodyFingerprint(body) {
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      const canonicalForm = await this.serializeSdkworkFormData(body);
      return {
        header: "X-Idempotency-Fingerprint",
        value: await this.sha256Hex(new TextEncoder().encode(canonicalForm))
      };
    }
    const bytes = await this.serializeSdkworkRequestBodyBytes(body);
    if (!bytes) {
      return void 0;
    }
    return {
      header: "X-Content-SHA256",
      value: await this.sha256Hex(bytes)
    };
  }
  async serializeSdkworkRequestBodyBytes(body) {
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      return new TextEncoder().encode(body.toString());
    }
    if (typeof Blob !== "undefined" && body instanceof Blob) {
      return new Uint8Array(await body.arrayBuffer());
    }
    if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
      return new Uint8Array(body.slice(0));
    }
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(body)) {
      return new Uint8Array(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
    }
    if (typeof body === "string") {
      return new TextEncoder().encode(body);
    }
    const serialized = JSON.stringify(body);
    return serialized === void 0 ? void 0 : new TextEncoder().encode(serialized);
  }
  async serializeSdkworkFormData(body) {
    const parts = [];
    for (const [name, value] of body.entries()) {
      if (typeof value === "string") {
        parts.push({ kind: "field", name, value });
        continue;
      }
      const bytes = new Uint8Array(await value.arrayBuffer());
      parts.push({
        kind: "file",
        name,
        fileName: "name" in value ? String(value.name) : "",
        contentType: value.type,
        size: value.size,
        contentSha256: await this.sha256Hex(bytes)
      });
    }
    return JSON.stringify(parts);
  }
  async sha256Hex(bytes) {
    return sha256Hash2(bytes);
  }
  buildHeaders(config, skipAuth = false) {
    const headers = super.buildHeaders(config, skipAuth);
    if (config == null ? void 0 : config.accessTokenOnly) {
      this.stripCredentialHeaders(headers, true);
      return headers;
    }
    if (!skipAuth && !(config == null ? void 0 : config.skipAuth)) {
      return headers;
    }
    this.stripCredentialHeaders(headers, false);
    return headers;
  }
  stripCredentialHeaders(headers, preserveAccessToken) {
    [
      ...preserveAccessToken ? [] : [_HttpClient2.ACCESS_TOKEN_HEADER, "Access-Token"],
      "Authorization",
      ["X", "API", "Key"].join("-"),
      "X-Tenant-Id",
      "X-Organization-Id",
      "X-Platform",
      "X-User-Id",
      "X-Sdkwork-Tenant-Id",
      "X-Sdkwork-Organization-Id",
      "X-Sdkwork-User-Id"
    ].forEach((key) => {
      delete headers[key];
    });
  }
  buildRequestBody(body, contentType) {
    if (body == null) {
      return body;
    }
    const normalizedContentType = (contentType != null ? contentType : "").toLowerCase();
    if (normalizedContentType === "application/x-www-form-urlencoded") {
      return this.encodeFormBody(body);
    }
    if (normalizedContentType === "multipart/form-data") {
      return this.encodeMultipartBody(body);
    }
    return body;
  }
  encodeMultipartBody(body) {
    if (body instanceof FormData) {
      return body;
    }
    const formData = new FormData();
    if (body instanceof Map) {
      for (const [key, value] of body.entries()) {
        this.appendMultipartValue(formData, String(key), value);
      }
      return formData;
    }
    if (typeof body === "object") {
      const record = body;
      for (const [key, value] of Object.entries(record)) {
        if (this.isMultipartMetadataField(key)) {
          continue;
        }
        this.appendMultipartValue(formData, key, value, this.resolveMultipartFileName(record, key));
      }
      return formData;
    }
    this.appendMultipartValue(formData, "value", body);
    return formData;
  }
  appendMultipartValue(formData, key, value, fileName) {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => this.appendMultipartValue(formData, key, item, fileName));
      return;
    }
    if (value instanceof Blob) {
      if (fileName) {
        formData.append(key, value, fileName);
        return;
      }
      formData.append(key, value);
      return;
    }
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }
    formData.append(key, String(value));
  }
  resolveMultipartFileName(record, key) {
    const fieldSpecificName = record[`${key}FileName`];
    if (typeof fieldSpecificName === "string" && fieldSpecificName.trim()) {
      return fieldSpecificName.trim();
    }
    const genericName = record.fileName;
    if (key === "file" && typeof genericName === "string" && genericName.trim()) {
      return genericName.trim();
    }
    return void 0;
  }
  isMultipartMetadataField(key) {
    return key === "fileName" || key.endsWith("FileName");
  }
  encodeFormBody(body) {
    if (body instanceof URLSearchParams) {
      return body.toString();
    }
    if (typeof body === "string") {
      return body;
    }
    const params = new URLSearchParams();
    if (body instanceof Map) {
      for (const [key, value] of body.entries()) {
        this.appendFormValue(params, String(key), value);
      }
      return params.toString();
    }
    if (typeof body === "object") {
      for (const [key, value] of Object.entries(body)) {
        this.appendFormValue(params, key, value);
      }
      return params.toString();
    }
    params.append("value", String(body));
    return params.toString();
  }
  appendFormValue(params, key, value) {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => this.appendFormValue(params, key, item));
      return;
    }
    if (value instanceof Date) {
      params.append(key, value.toISOString());
      return;
    }
    if (typeof value === "object") {
      params.append(key, JSON.stringify(value));
      return;
    }
    params.append(key, String(value));
  }
  setAuthToken(token) {
    super.setAuthToken(token);
  }
  setAccessToken(token) {
    const headers = this.getInternalHeaders();
    headers[_HttpClient2.ACCESS_TOKEN_HEADER] = token;
    super.setAccessToken(token);
  }
  setTokenManager(manager) {
    const baseProto = Object.getPrototypeOf(_HttpClient2.prototype);
    if (typeof baseProto.setTokenManager === "function") {
      baseProto.setTokenManager.call(this, manager);
      return;
    }
    this.getInternalAuthConfig().tokenManager = manager;
  }
  applyAccessTokenOnlyHeaders(headers) {
    var _a;
    const authConfig = this.getInternalAuthConfig();
    const tokenManager = authConfig.tokenManager;
    const accessToken = (_a = tokenManager == null ? void 0 : tokenManager.getAccessToken) == null ? void 0 : _a.call(tokenManager);
    if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
      throw new Error(
        "access-token-only request requires Access-Token before request dispatch"
      );
    }
    const result = { ...headers != null ? headers : {} };
    this.stripCredentialHeaders(result, false);
    result[_HttpClient2.ACCESS_TOKEN_HEADER] = accessToken.trim();
    return result;
  }
  applySdkworkAuthHeaders(headers) {
    var _a, _b;
    const authConfig = this.getInternalAuthConfig();
    const tokenManager = authConfig.tokenManager;
    const accessToken = _HttpClient2.normalizeCredential((_a = tokenManager == null ? void 0 : tokenManager.getAccessToken) == null ? void 0 : _a.call(tokenManager));
    const authToken = _HttpClient2.normalizeCredential((_b = tokenManager == null ? void 0 : tokenManager.getAuthToken) == null ? void 0 : _b.call(tokenManager));
    if (_HttpClient2.REQUIRES_SDKWORK_ACCESS_TOKEN && (typeof accessToken !== "string" || accessToken.trim().length === 0)) {
      throw new Error("non-open-api request requires Access-Token before request dispatch");
    }
    if (!accessToken && !authToken) {
      return headers;
    }
    const authHeaders = buildAuthHeaders("dual-token", void 0, tokenManager);
    return Object.keys(authHeaders).length > 0 ? { ...headers != null ? headers : {}, ...authHeaders } : headers;
  }
  unwrapSdkworkV3Payload(payload, unwrapKind = "data") {
    if (!_HttpClient2.SDKWORK_V3_UNWRAP || payload == null || typeof payload !== "object") {
      return payload;
    }
    const record = payload;
    if (record.code !== 0 || !("data" in record)) {
      return this.unwrapSdkworkV3Data(record, unwrapKind);
    }
    const data = record.data;
    if (!data || typeof data !== "object") {
      return data;
    }
    return this.unwrapSdkworkV3Data(data, unwrapKind);
  }
  unwrapSdkworkV3Data(data, unwrapKind) {
    if (unwrapKind === "void") {
      return void 0;
    }
    if (unwrapKind === "item" && "item" in data) {
      return data.item;
    }
    return data;
  }
  async request(path, options = {}) {
    const execute = this.execute;
    if (typeof execute !== "function") {
      throw new Error("BaseHttpClient execute method is not available");
    }
    const {
      body,
      headers,
      contentType,
      method = "GET",
      skipAuth,
      accessTokenOnly,
      sdkworkUnwrapKind = "data",
      ...rest
    } = options;
    const requestHeaders = accessTokenOnly ? this.applyAccessTokenOnlyHeaders(headers) : skipAuth ? headers : this.applySdkworkAuthHeaders(headers);
    const requestBody = this.buildRequestBody(body, contentType);
    const preparedHeaders = await this.applySdkworkRequestBodyFingerprint(
      this.buildRequestHeaders(requestHeaders, body == null ? void 0 : contentType),
      requestBody
    );
    const payload = await withRetry(
      () => execute.call(this, {
        url: path,
        method,
        ...rest,
        ...skipAuth !== void 0 ? { skipAuth } : {},
        ...accessTokenOnly !== void 0 ? { accessTokenOnly } : {},
        ...requestBody !== void 0 ? { body: requestBody } : {},
        ...preparedHeaders !== void 0 ? { headers: preparedHeaders } : {}
      }),
      // Per-request retry overrides (e.g. disabling 5xx retries for
      // idempotent-terminal operations like turn execution) flow through
      // options.retry; the default keeps maxRetries: 3.
      { maxRetries: 3, ...options.retry }
    );
    return this.unwrapSdkworkV3Payload(payload, sdkworkUnwrapKind);
  }
  async *streamJson(path, options = {}) {
    const stream = BaseHttpClient.prototype.stream;
    if (typeof stream !== "function") {
      throw new Error("BaseHttpClient stream method is not available");
    }
    const {
      body,
      headers,
      contentType,
      method = "GET",
      skipAuth,
      accessTokenOnly,
      ...rest
    } = options;
    const authHeaders = accessTokenOnly ? this.applyAccessTokenOnlyHeaders(headers) : skipAuth ? headers : this.applySdkworkAuthHeaders(headers);
    const requestBody = this.buildRequestBody(body, contentType);
    const requestHeaders = await this.applySdkworkRequestBodyFingerprint(
      this.buildRequestHeaders(
        { Accept: "text/event-stream", ...authHeaders != null ? authHeaders : {} },
        body == null ? void 0 : contentType
      ),
      requestBody
    );
    for await (const data of stream.call(this, path, {
      method,
      ...rest,
      ...skipAuth !== void 0 ? { skipAuth } : {},
      ...accessTokenOnly !== void 0 ? { accessTokenOnly } : {},
      ...requestBody !== void 0 ? { body: requestBody } : {},
      ...requestHeaders !== void 0 ? { headers: requestHeaders } : {}
    })) {
      if (data === "[DONE]") {
        return;
      }
      if (typeof data !== "string" || data.trim().length === 0) {
        continue;
      }
      yield JSON.parse(data);
    }
  }
  async get(path, params, headers) {
    return this.request(path, {
      method: "GET",
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {}
    });
  }
  async post(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "POST",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
  async put(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "PUT",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
  async delete(path, params, headers) {
    return this.request(path, {
      method: "DELETE",
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {}
    });
  }
  async patch(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "PATCH",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
};
__publicField(_HttpClient2, "ACCESS_TOKEN_HEADER", "Access-Token");
__publicField(_HttpClient2, "SDKWORK_V3_UNWRAP", true);
__publicField(_HttpClient2, "SDKWORK_V3_REQUEST_FINGERPRINTS", true);
__publicField(_HttpClient2, "REQUIRES_SDKWORK_ACCESS_TOKEN", true);
var HttpClient2 = _HttpClient2;
function createHttpClient2(config) {
  return new HttpClient2(config);
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/api/paths.ts
var APP_API_PREFIX = "/app/v3/api";
function appApiPath(path) {
  if (!path) {
    return APP_API_PREFIX;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPrefixRaw = (APP_API_PREFIX || "").trim();
  const normalizedPrefix = normalizedPrefixRaw ? `/${normalizedPrefixRaw.replace(/^\/+|\/+$/g, "")}` : "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!normalizedPrefix || normalizedPrefix === "/") {
    return normalizedPath;
  }
  if (normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`)) {
    return normalizedPath;
  }
  return `${normalizedPrefix}${normalizedPath}`;
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/api/automation.ts
var AutomationExecutionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Request an automation execution */
  async create(body, requestOptions) {
    return this.client.request(appApiPath(`/automation/executions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Get an automation execution */
  async retrieve(executionId, requestOptions) {
    return this.client.request(appApiPath(`/automation/executions/${serializePathParameter2(executionId, { name: "executionId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var AutomationAgentToolCallsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Request an agent tool call */
  async create(body, requestOptions) {
    return this.client.request(appApiPath(`/automation/agent_tool_calls`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Complete an agent tool call */
  async complete(executionId, toolCallId, body, requestOptions) {
    return this.client.request(appApiPath(`/automation/executions/${serializePathParameter2(executionId, { name: "executionId", style: "simple", explode: false })}/agent_tool_calls/${serializePathParameter2(toolCallId, { name: "toolCallId", style: "simple", explode: false })}/complete`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var AutomationAgentResponsesFramesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Append a frame to an agent response stream */
  async create(streamId, body, requestOptions) {
    return this.client.request(appApiPath(`/automation/agent_responses/${serializePathParameter2(streamId, { name: "streamId", style: "simple", explode: false })}/frames`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var AutomationAgentResponsesApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "frames");
    this.client = client;
    this.frames = new AutomationAgentResponsesFramesApi(client);
  }
  /** Start an agent response stream */
  async create(body, requestOptions) {
    return this.client.request(appApiPath(`/automation/agent_responses`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
  /** Complete an agent response stream */
  async complete(streamId, body, requestOptions) {
    return this.client.request(appApiPath(`/automation/agent_responses/${serializePathParameter2(streamId, { name: "streamId", style: "simple", explode: false })}/complete`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var AutomationApi = class {
  constructor(client) {
    __publicField(this, "agentResponses");
    __publicField(this, "agentToolCalls");
    __publicField(this, "executions");
    this.agentResponses = new AutomationAgentResponsesApi(client);
    this.agentToolCalls = new AutomationAgentToolCallsApi(client);
    this.executions = new AutomationExecutionsApi(client);
  }
};
function createAutomationApi(client) {
  return new AutomationApi(client);
}
function serializePathParameter2(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray2(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject2(spec.name, value, style, spec.explode);
  }
  return pathPrefix2(spec.name, style, false) + encodePathValue2(serializePathPrimitive2(value));
}
function serializePathArray2(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue2(serializePathPrimitive2(item)));
  if (serialized.length === 0) {
    return pathPrefix2(name, style, false);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix2(name, style, false) + serialized.join(explode ? "." : ",");
}
function serializePathObject2(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix2(name, style, true);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue2(key)}=${encodePathValue2(serializePathPrimitive2(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue2(key), encodePathValue2(serializePathPrimitive2(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue2(key)}=${encodePathValue2(serializePathPrimitive2(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue2(key), encodePathValue2(serializePathPrimitive2(entryValue))]).join(",");
  return pathPrefix2(name, style, true) + serialized;
}
function pathPrefix2(name, style, _objectValue) {
  if (style === "label") return ".";
  if (style === "matrix") return `;${name}`;
  return "";
}
function encodePathValue2(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive2(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/api/notifications.ts
var NotificationsRequestsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Request a notification task */
  async create(body, requestOptions) {
    return this.client.request(appApiPath(`/notifications/requests`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var NotificationsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "requests");
    this.client = client;
    this.requests = new NotificationsRequestsApi(client);
  }
  /** List notifications for the current principal */
  async list(params, requestOptions) {
    const query = buildQueryString2([
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString2(appApiPath(`/notifications`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Get a notification task */
  async retrieve(notificationId, requestOptions) {
    return this.client.request(appApiPath(`/notifications/${serializePathParameter3(notificationId, { name: "notificationId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
function createNotificationsApi(client) {
  return new NotificationsApi(client);
}
function appendQueryString2(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter3(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray3(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject3(spec.name, value, style, spec.explode);
  }
  return pathPrefix3(spec.name, style, false) + encodePathValue3(serializePathPrimitive3(value));
}
function serializePathArray3(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue3(serializePathPrimitive3(item)));
  if (serialized.length === 0) {
    return pathPrefix3(name, style, false);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix3(name, style, false) + serialized.join(explode ? "." : ",");
}
function serializePathObject3(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix3(name, style, true);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue3(key)}=${encodePathValue3(serializePathPrimitive3(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue3(key), encodePathValue3(serializePathPrimitive3(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue3(key)}=${encodePathValue3(serializePathPrimitive3(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue3(key), encodePathValue3(serializePathPrimitive3(entryValue))]).join(",");
  return pathPrefix3(name, style, true) + serialized;
}
function pathPrefix3(name, style, _objectValue) {
  if (style === "label") return ".";
  if (style === "matrix") return `;${name}`;
  return "";
}
function encodePathValue3(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive3(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildQueryString2(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter2(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter2(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent2(parameter.name)}=${encodeQueryValue2(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter2(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter2(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter2(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent2(parameter.name)}=${encodeQueryValue2(serializePrimitive2(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter2(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive2(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent2(name)}=${encodeQueryValue2(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent2(name)}=${encodeQueryValue2(values.join(","), allowReserved)}`);
}
function appendObjectParameter2(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent2(key)}=${encodeQueryValue2(serializePrimitive2(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive2(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent2(name)}=${encodeQueryValue2(serialized, allowReserved)}`);
}
function appendDeepObjectParameter2(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent2(name)}=${encodeQueryValue2(serializePrimitive2(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent2(`${name}[${key}]`)}=${encodeQueryValue2(serializePrimitive2(entryValue), allowReserved)}`);
  }
}
function serializePrimitive2(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent2(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue2(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/api/portal.ts
var PortalWorkspaceApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the current tenant workspace snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/workspace`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalRealtimeApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant realtime snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/realtime`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalMediaApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant media snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/media`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalHomeApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant portal home snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/home`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalGovernanceApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant governance snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/governance`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalDashboardApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant dashboard snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/dashboard`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalConversationSnapshotApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant conversations snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/conversations`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalAutomationApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant automation snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/automation`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalAccessApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Read the tenant portal access snapshot */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/portal/access`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var PortalApi = class {
  constructor(client) {
    __publicField(this, "access");
    __publicField(this, "automation");
    __publicField(this, "conversationSnapshot");
    __publicField(this, "dashboard");
    __publicField(this, "governance");
    __publicField(this, "home");
    __publicField(this, "media");
    __publicField(this, "realtime");
    __publicField(this, "workspace");
    this.access = new PortalAccessApi(client);
    this.automation = new PortalAutomationApi(client);
    this.conversationSnapshot = new PortalConversationSnapshotApi(client);
    this.dashboard = new PortalDashboardApi(client);
    this.governance = new PortalGovernanceApi(client);
    this.home = new PortalHomeApi(client);
    this.media = new PortalMediaApi(client);
    this.realtime = new PortalRealtimeApi(client);
    this.workspace = new PortalWorkspaceApi(client);
  }
};
function createPortalApi(client) {
  return new PortalApi(client);
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/api/provider.ts
var ProviderPrincipalProfileHealthApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve principal-profile provider health */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/principal/profiles/provider_health`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var ProviderMediaHealthApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve media provider health */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath(`/media/provider_health`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var ProviderApi = class {
  constructor(client) {
    __publicField(this, "mediaHealth");
    __publicField(this, "principalProfileHealth");
    this.mediaHealth = new ProviderMediaHealthApi(client);
    this.principalProfileHealth = new ProviderPrincipalProfileHealthApi(client);
  }
};
function createProviderApi(client) {
  return new ProviderApi(client);
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/api/chat.ts
var ChatConversationsKnowledgebaseApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Retrieve the group knowledgebase link */
  async retrieve(conversationId, requestOptions) {
    return this.client.request(appApiPath(`/chat/conversations/${serializePathParameter4(conversationId, { name: "conversationId", style: "simple", explode: false })}/knowledgebase`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Lazily create the group knowledgebase */
  async create(conversationId, body, params, requestOptions) {
    const requestHeaders = buildRequestHeaders(
      {
        "Idempotency-Key": { value: params.idempotencyKey, style: "simple", explode: false }
      },
      {}
    );
    return this.client.request(appApiPath(`/chat/conversations/${serializePathParameter4(conversationId, { name: "conversationId", style: "simple", explode: false })}/knowledgebase`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", ...requestHeaders !== void 0 ? { headers: requestHeaders } : {}, sdkworkUnwrapKind: "item" });
  }
  /** Issue a one-time group knowledgebase launch ticket */
  async launch(conversationId, body, params, requestOptions) {
    const requestHeaders = buildRequestHeaders(
      {
        "Idempotency-Key": { value: params.idempotencyKey, style: "simple", explode: false }
      },
      {}
    );
    return this.client.request(appApiPath(`/chat/conversations/${serializePathParameter4(conversationId, { name: "conversationId", style: "simple", explode: false })}/knowledgebase/launch`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", ...requestHeaders !== void 0 ? { headers: requestHeaders } : {}, sdkworkUnwrapKind: "item" });
  }
};
var ChatConversationsApi2 = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "knowledgebase");
    this.client = client;
    this.knowledgebase = new ChatConversationsKnowledgebaseApi(client);
  }
  /** Archive a group conversation and schedule its knowledgebase archive */
  async archive(conversationId, body, params, requestOptions) {
    const requestHeaders = buildRequestHeaders(
      {
        "Idempotency-Key": { value: params.idempotencyKey, style: "simple", explode: false }
      },
      {}
    );
    return this.client.request(appApiPath(`/chat/conversations/${serializePathParameter4(conversationId, { name: "conversationId", style: "simple", explode: false })}/archive`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", ...requestHeaders !== void 0 ? { headers: requestHeaders } : {}, sdkworkUnwrapKind: "command" });
  }
};
var ChatApi2 = class {
  constructor(client) {
    __publicField(this, "conversations");
    this.conversations = new ChatConversationsApi2(client);
  }
};
function createChatApi2(client) {
  return new ChatApi2(client);
}
function serializePathParameter4(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray4(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject4(spec.name, value, style, spec.explode);
  }
  return pathPrefix4(spec.name, style, false) + encodePathValue4(serializePathPrimitive4(value));
}
function serializePathArray4(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue4(serializePathPrimitive4(item)));
  if (serialized.length === 0) {
    return pathPrefix4(name, style, false);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix4(name, style, false) + serialized.join(explode ? "." : ",");
}
function serializePathObject4(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix4(name, style, true);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue4(key)}=${encodePathValue4(serializePathPrimitive4(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue4(key), encodePathValue4(serializePathPrimitive4(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue4(key)}=${encodePathValue4(serializePathPrimitive4(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue4(key), encodePathValue4(serializePathPrimitive4(entryValue))]).join(",");
  return pathPrefix4(name, style, true) + serialized;
}
function pathPrefix4(name, style, _objectValue) {
  if (style === "label") return ".";
  if (style === "matrix") return `;${name}`;
  return "";
}
function encodePathValue4(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive4(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildRequestHeaders(headers, cookies = {}) {
  const requestHeaders = {};
  for (const [name, parameter] of Object.entries(headers)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== void 0) {
      requestHeaders[name] = serialized;
    }
  }
  const cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader) {
    requestHeaders.Cookie = requestHeaders.Cookie ? `${requestHeaders.Cookie}; ${cookieHeader}` : cookieHeader;
  }
  return Object.keys(requestHeaders).length > 0 ? requestHeaders : void 0;
}
function buildCookieHeader(cookies) {
  const pairs = [];
  for (const [name, parameter] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== void 0) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join("; ") : void 0;
}
function serializeParameterValue(parameter) {
  const value = parameter == null ? void 0 : parameter.value;
  if (value === void 0 || value === null) {
    return void 0;
  }
  if (parameter == null ? void 0 : parameter.contentType) {
    return JSON.stringify(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeHeaderPrimitive(item)).join(",");
  }
  if (typeof value === "object" && value !== null) {
    return serializeHeaderObject(value, (parameter == null ? void 0 : parameter.explode) === true);
  }
  return serializeHeaderPrimitive(value);
}
function serializeHeaderObject(value, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (explode) {
    return entries.map(([key, entryValue]) => `${key}=${serializeHeaderPrimitive(entryValue)}`).join(",");
  }
  return entries.flatMap(([key, entryValue]) => [key, serializeHeaderPrimitive(entryValue)]).join(",");
}
function serializeHeaderPrimitive(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/generated/server-openapi/src/sdk.ts
var SdkworkImAppClient = class {
  constructor(config) {
    __publicField(this, "httpClient");
    __publicField(this, "automation");
    __publicField(this, "notifications");
    __publicField(this, "portal");
    __publicField(this, "provider");
    __publicField(this, "chat");
    this.httpClient = createHttpClient2(config);
    this.automation = createAutomationApi(this.httpClient);
    this.notifications = createNotificationsApi(this.httpClient);
    this.portal = createPortalApi(this.httpClient);
    this.provider = createProviderApi(this.httpClient);
    this.chat = createChatApi2(this.httpClient);
  }
  setAuthToken(token) {
    this.httpClient.setAuthToken(token);
    return this;
  }
  setAccessToken(token) {
    this.httpClient.setAccessToken(token);
    return this;
  }
  setTokenManager(manager) {
    this.httpClient.setTokenManager(manager);
    return this;
  }
  get http() {
    return this.httpClient;
  }
};
function createClient2(config) {
  return new SdkworkImAppClient(config);
}

// ../../sdks/sdkwork-im-app-sdk/sdkwork-im-app-sdk-typescript/src/index.ts
function createClient3(config) {
  return createClient2(config);
}

// packages/sdkwork-im-mp-core/src/sdk/imAppSdkClient.ts
var imAppSdkClient = null;
function createImAppSdkClientConfig(baseUrl, overrides = {}) {
  var _a, _b;
  const normalized = baseUrl.trim().replace(/\/+$/u, "");
  if (normalized.length === 0) {
    throw new Error("IM app-api base URL is required before SDK bootstrap");
  }
  const session = readImMpSession();
  const accessToken = (_a = overrides.accessToken) != null ? _a : resolveImMpAccessToken(session);
  const authToken = (_b = overrides.authToken) != null ? _b : resolveImMpAuthToken(session);
  const config = { baseUrl: normalized, platform: "mini-program" };
  if (accessToken) {
    config.accessToken = accessToken;
  }
  if (authToken) {
    config.authToken = authToken;
  }
  return config;
}
function initImAppSdkClient(config) {
  imAppSdkClient = createClient3(config);
  return imAppSdkClient;
}

// ../../../sdkwork-webserver/node_modules/.pnpm/@sdkwork+utils@0.11.0/node_modules/@sdkwork/utils/dist/runtime/binary.js
var textEncoder3 = new TextEncoder();
function toUtf83(value) {
  return textEncoder3.encode(value);
}
var HEX3 = "0123456789abcdef";
function hexEncode3(bytes) {
  let result = "";
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = bytes[index];
    result += HEX3[byte >> 4];
    result += HEX3[byte & 15];
  }
  return result;
}

// ../../../sdkwork-webserver/node_modules/.pnpm/@sdkwork+utils@0.11.0/node_modules/@sdkwork/utils/dist/runtime/sha256.js
var K3 = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var BLOCK_SIZE3 = 64;
function rotr3(value, shift) {
  return value >>> shift | value << 32 - shift;
}
function sha256Block3(state, block, offset) {
  const words = new Uint32Array(64);
  for (let index = 0; index < 16; index += 1) {
    const start = offset + index * 4;
    words[index] = block[start] << 24 | block[start + 1] << 16 | block[start + 2] << 8 | block[start + 3];
  }
  for (let index = 16; index < 64; index += 1) {
    const s0 = rotr3(words[index - 15], 7) ^ rotr3(words[index - 15], 18) ^ words[index - 15] >>> 3;
    const s1 = rotr3(words[index - 2], 17) ^ rotr3(words[index - 2], 19) ^ words[index - 2] >>> 10;
    words[index] = words[index - 16] + s0 + words[index - 7] + s1 >>> 0;
  }
  let a = state[0];
  let b = state[1];
  let c = state[2];
  let d = state[3];
  let e = state[4];
  let f = state[5];
  let g = state[6];
  let h = state[7];
  for (let index = 0; index < 64; index += 1) {
    const s1 = rotr3(e, 6) ^ rotr3(e, 11) ^ rotr3(e, 25);
    const ch = e & f ^ ~e & g;
    const temp1 = h + s1 + ch + K3[index] + words[index] >>> 0;
    const s0 = rotr3(a, 2) ^ rotr3(a, 13) ^ rotr3(a, 22);
    const maj = a & b ^ a & c ^ b & c;
    const temp2 = s0 + maj >>> 0;
    h = g;
    g = f;
    f = e;
    e = d + temp1 >>> 0;
    d = c;
    c = b;
    b = a;
    a = temp1 + temp2 >>> 0;
  }
  state[0] = state[0] + a >>> 0;
  state[1] = state[1] + b >>> 0;
  state[2] = state[2] + c >>> 0;
  state[3] = state[3] + d >>> 0;
  state[4] = state[4] + e >>> 0;
  state[5] = state[5] + f >>> 0;
  state[6] = state[6] + g >>> 0;
  state[7] = state[7] + h >>> 0;
}
function sha256Digest3(value) {
  const bitLength = value.length * 8;
  const paddingLength = (BLOCK_SIZE3 - (value.length + 9) % BLOCK_SIZE3) % BLOCK_SIZE3 + 9;
  const padded = new Uint8Array(value.length + paddingLength);
  padded.set(value);
  padded[value.length] = 128;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLength >>> 0, false);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 4294967296), false);
  const state = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  for (let offset = 0; offset < padded.length; offset += BLOCK_SIZE3) {
    sha256Block3(state, padded, offset);
  }
  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  for (let index = 0; index < state.length; index += 1) {
    digestView.setUint32(index * 4, state[index], false);
  }
  return digest;
}
var SHA256_INITIAL_STATE3 = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
function sha256Hex3(value) {
  const bytes = typeof value === "string" ? toUtf83(value) : value;
  return hexEncode3(sha256Digest3(bytes));
}

// ../../../sdkwork-webserver/node_modules/.pnpm/@sdkwork+utils@0.11.0/node_modules/@sdkwork/utils/dist/crypto.js
function sha256Hash3(value) {
  return sha256Hex3(value);
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/http/client.ts
var _HttpClient3 = class _HttpClient3 extends BaseHttpClient {
  constructor(config) {
    super(config);
  }
  static normalizeCredential(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
  }
  getInternalAuthConfig() {
    const self = this;
    self.authConfig = self.authConfig || {};
    return self.authConfig;
  }
  getInternalHeaders() {
    const self = this;
    self.config = self.config || {};
    self.config.headers = self.config.headers || {};
    return self.config.headers;
  }
  buildRequestHeaders(headers, contentType) {
    const mergedHeaders = {
      ...headers != null ? headers : {}
    };
    if (contentType && contentType.toLowerCase() !== "multipart/form-data") {
      mergedHeaders["Content-Type"] = contentType;
    }
    return Object.keys(mergedHeaders).length > 0 ? mergedHeaders : void 0;
  }
  async applySdkworkRequestBodyFingerprint(headers, body) {
    if (!_HttpClient3.SDKWORK_V3_REQUEST_FINGERPRINTS || body == null || !this.hasNonEmptyHeader(headers, "Idempotency-Key") || this.hasNonEmptyHeader(headers, "X-Content-SHA256") || this.hasNonEmptyHeader(headers, "X-Idempotency-Fingerprint")) {
      return headers;
    }
    const fingerprint = await this.createSdkworkRequestBodyFingerprint(body);
    if (!fingerprint) {
      return headers;
    }
    const normalizedFingerprintHeader = fingerprint.header.toLowerCase();
    const preparedHeaders = Object.fromEntries(
      Object.entries(headers != null ? headers : {}).filter(
        ([headerName]) => headerName.toLowerCase() !== normalizedFingerprintHeader
      )
    );
    return {
      ...preparedHeaders,
      [fingerprint.header]: fingerprint.value
    };
  }
  hasNonEmptyHeader(headers, name) {
    const normalizedName = name.toLowerCase();
    return Object.entries(headers != null ? headers : {}).some(
      ([headerName, value]) => headerName.toLowerCase() === normalizedName && value.trim().length > 0
    );
  }
  async createSdkworkRequestBodyFingerprint(body) {
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      const canonicalForm = await this.serializeSdkworkFormData(body);
      return {
        header: "X-Idempotency-Fingerprint",
        value: await this.sha256Hex(new TextEncoder().encode(canonicalForm))
      };
    }
    const bytes = await this.serializeSdkworkRequestBodyBytes(body);
    if (!bytes) {
      return void 0;
    }
    return {
      header: "X-Content-SHA256",
      value: await this.sha256Hex(bytes)
    };
  }
  async serializeSdkworkRequestBodyBytes(body) {
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      return new TextEncoder().encode(body.toString());
    }
    if (typeof Blob !== "undefined" && body instanceof Blob) {
      return new Uint8Array(await body.arrayBuffer());
    }
    if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
      return new Uint8Array(body.slice(0));
    }
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(body)) {
      return new Uint8Array(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
    }
    if (typeof body === "string") {
      return new TextEncoder().encode(body);
    }
    const serialized = JSON.stringify(body);
    return serialized === void 0 ? void 0 : new TextEncoder().encode(serialized);
  }
  async serializeSdkworkFormData(body) {
    const parts = [];
    for (const [name, value] of body.entries()) {
      if (typeof value === "string") {
        parts.push({ kind: "field", name, value });
        continue;
      }
      const bytes = new Uint8Array(await value.arrayBuffer());
      parts.push({
        kind: "file",
        name,
        fileName: "name" in value ? String(value.name) : "",
        contentType: value.type,
        size: value.size,
        contentSha256: await this.sha256Hex(bytes)
      });
    }
    return JSON.stringify(parts);
  }
  async sha256Hex(bytes) {
    return sha256Hash3(bytes);
  }
  buildHeaders(config, skipAuth = false) {
    const headers = super.buildHeaders(config, skipAuth);
    if (config == null ? void 0 : config.accessTokenOnly) {
      this.stripCredentialHeaders(headers, true);
      return headers;
    }
    if (!skipAuth && !(config == null ? void 0 : config.skipAuth)) {
      return headers;
    }
    this.stripCredentialHeaders(headers, false);
    return headers;
  }
  stripCredentialHeaders(headers, preserveAccessToken) {
    [
      ...preserveAccessToken ? [] : [_HttpClient3.ACCESS_TOKEN_HEADER, "Access-Token"],
      "Authorization",
      ["X", "API", "Key"].join("-"),
      "X-Tenant-Id",
      "X-App-Id",
      "X-Organization-Id",
      "X-Platform",
      "X-User-Id",
      "X-Sdkwork-Tenant-Id",
      "X-Sdkwork-App-Id",
      "X-Sdkwork-User-Id",
      "X-Sdkwork-Organization-Id",
      "X-Sdkwork-Actor-Id",
      "X-Sdkwork-Actor-Kind",
      "X-Sdkwork-Session-Id",
      "X-Sdkwork-Environment",
      "X-Sdkwork-Deployment-Profile",
      "X-Sdkwork-Deployment-Mode",
      "X-Sdkwork-Runtime-Target",
      "X-Sdkwork-Auth-Level",
      "X-Sdkwork-Data-Scope",
      "X-Sdkwork-Permission-Scope",
      "X-Sdkwork-Device-Id",
      "X-Sdkwork-Context-Signature",
      "X-Sdkwork-Operation-Id",
      "X-Sdkwork-Subject-Tenant-Id",
      "X-Sdkwork-Subject-Organization-Id",
      "X-Sdkwork-Subject-User-Id",
      "X-Sdkwork-Subject-Timestamp",
      "X-Sdkwork-Subject-Signature"
    ].forEach((key) => {
      delete headers[key];
    });
  }
  buildRequestBody(body, contentType) {
    if (body == null) {
      return body;
    }
    const normalizedContentType = (contentType != null ? contentType : "").toLowerCase();
    if (normalizedContentType === "application/x-www-form-urlencoded") {
      return this.encodeFormBody(body);
    }
    if (normalizedContentType === "multipart/form-data") {
      return this.encodeMultipartBody(body);
    }
    return body;
  }
  encodeMultipartBody(body) {
    if (body instanceof FormData) {
      return body;
    }
    const formData = new FormData();
    if (body instanceof Map) {
      for (const [key, value] of body.entries()) {
        this.appendMultipartValue(formData, String(key), value);
      }
      return formData;
    }
    if (typeof body === "object") {
      const record = body;
      for (const [key, value] of Object.entries(record)) {
        if (this.isMultipartMetadataField(key)) {
          continue;
        }
        this.appendMultipartValue(formData, key, value, this.resolveMultipartFileName(record, key));
      }
      return formData;
    }
    this.appendMultipartValue(formData, "value", body);
    return formData;
  }
  appendMultipartValue(formData, key, value, fileName) {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => this.appendMultipartValue(formData, key, item, fileName));
      return;
    }
    if (value instanceof Blob) {
      if (fileName) {
        formData.append(key, value, fileName);
        return;
      }
      formData.append(key, value);
      return;
    }
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }
    formData.append(key, String(value));
  }
  resolveMultipartFileName(record, key) {
    const fieldSpecificName = record[`${key}FileName`];
    if (typeof fieldSpecificName === "string" && fieldSpecificName.trim()) {
      return fieldSpecificName.trim();
    }
    const genericName = record.fileName;
    if (key === "file" && typeof genericName === "string" && genericName.trim()) {
      return genericName.trim();
    }
    return void 0;
  }
  isMultipartMetadataField(key) {
    return key === "fileName" || key.endsWith("FileName");
  }
  encodeFormBody(body) {
    if (body instanceof URLSearchParams) {
      return body.toString();
    }
    if (typeof body === "string") {
      return body;
    }
    const params = new URLSearchParams();
    if (body instanceof Map) {
      for (const [key, value] of body.entries()) {
        this.appendFormValue(params, String(key), value);
      }
      return params.toString();
    }
    if (typeof body === "object") {
      for (const [key, value] of Object.entries(body)) {
        this.appendFormValue(params, key, value);
      }
      return params.toString();
    }
    params.append("value", String(body));
    return params.toString();
  }
  appendFormValue(params, key, value) {
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => this.appendFormValue(params, key, item));
      return;
    }
    if (value instanceof Date) {
      params.append(key, value.toISOString());
      return;
    }
    if (typeof value === "object") {
      params.append(key, JSON.stringify(value));
      return;
    }
    params.append(key, String(value));
  }
  setAuthToken(token) {
    super.setAuthToken(token);
  }
  setAccessToken(token) {
    const headers = this.getInternalHeaders();
    headers[_HttpClient3.ACCESS_TOKEN_HEADER] = token;
    super.setAccessToken(token);
  }
  setTokenManager(manager) {
    const baseProto = Object.getPrototypeOf(_HttpClient3.prototype);
    if (typeof baseProto.setTokenManager === "function") {
      baseProto.setTokenManager.call(this, manager);
      return;
    }
    this.getInternalAuthConfig().tokenManager = manager;
  }
  applyAccessTokenOnlyHeaders(headers) {
    var _a;
    const authConfig = this.getInternalAuthConfig();
    const tokenManager = authConfig.tokenManager;
    const accessToken = (_a = tokenManager == null ? void 0 : tokenManager.getAccessToken) == null ? void 0 : _a.call(tokenManager);
    if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
      throw new Error(
        "access-token-only request requires Access-Token before request dispatch"
      );
    }
    const result = { ...headers != null ? headers : {} };
    this.stripCredentialHeaders(result, false);
    result[_HttpClient3.ACCESS_TOKEN_HEADER] = accessToken.trim();
    return result;
  }
  applySdkworkAuthHeaders(headers) {
    var _a, _b;
    const authConfig = this.getInternalAuthConfig();
    const tokenManager = authConfig.tokenManager;
    const accessToken = _HttpClient3.normalizeCredential((_a = tokenManager == null ? void 0 : tokenManager.getAccessToken) == null ? void 0 : _a.call(tokenManager));
    const authToken = _HttpClient3.normalizeCredential((_b = tokenManager == null ? void 0 : tokenManager.getAuthToken) == null ? void 0 : _b.call(tokenManager));
    if (_HttpClient3.REQUIRES_SDKWORK_ACCESS_TOKEN && (typeof accessToken !== "string" || accessToken.trim().length === 0)) {
      throw new Error("non-open-api request requires Access-Token before request dispatch");
    }
    if (!accessToken && !authToken) {
      return headers;
    }
    const authHeaders = buildAuthHeaders("dual-token", void 0, tokenManager);
    return Object.keys(authHeaders).length > 0 ? { ...headers != null ? headers : {}, ...authHeaders } : headers;
  }
  unwrapSdkworkV3Payload(payload, unwrapKind = "data") {
    if (!_HttpClient3.SDKWORK_V3_UNWRAP || payload == null || typeof payload !== "object") {
      return payload;
    }
    const record = payload;
    if (record.code !== 0 || !("data" in record)) {
      return this.unwrapSdkworkV3Data(record, unwrapKind);
    }
    const data = record.data;
    if (!data || typeof data !== "object") {
      return data;
    }
    return this.unwrapSdkworkV3Data(data, unwrapKind);
  }
  unwrapSdkworkV3Data(data, unwrapKind) {
    if (unwrapKind === "void") {
      return void 0;
    }
    if (unwrapKind === "item" && "item" in data) {
      return data.item;
    }
    return data;
  }
  async request(path, options = {}) {
    const execute = this.execute;
    if (typeof execute !== "function") {
      throw new Error("BaseHttpClient execute method is not available");
    }
    const {
      body,
      headers,
      contentType,
      method = "GET",
      skipAuth,
      accessTokenOnly,
      sdkworkUnwrapKind = "data",
      ...rest
    } = options;
    const requestHeaders = accessTokenOnly ? this.applyAccessTokenOnlyHeaders(headers) : skipAuth ? headers : this.applySdkworkAuthHeaders(headers);
    const requestBody = this.buildRequestBody(body, contentType);
    const preparedHeaders = await this.applySdkworkRequestBodyFingerprint(
      this.buildRequestHeaders(requestHeaders, body == null ? void 0 : contentType),
      requestBody
    );
    const payload = await withRetry(
      () => execute.call(this, {
        url: path,
        method,
        ...rest,
        ...skipAuth !== void 0 ? { skipAuth } : {},
        ...accessTokenOnly !== void 0 ? { accessTokenOnly } : {},
        ...requestBody !== void 0 ? { body: requestBody } : {},
        ...preparedHeaders !== void 0 ? { headers: preparedHeaders } : {}
      }),
      // Per-request retry overrides (e.g. disabling 5xx retries for
      // idempotent-terminal operations like turn execution) flow through
      // options.retry; the default keeps maxRetries: 3.
      { maxRetries: 3, ...options.retry }
    );
    return this.unwrapSdkworkV3Payload(payload, sdkworkUnwrapKind);
  }
  async *streamJson(path, options = {}) {
    const stream = BaseHttpClient.prototype.stream;
    if (typeof stream !== "function") {
      throw new Error("BaseHttpClient stream method is not available");
    }
    const {
      body,
      headers,
      contentType,
      method = "GET",
      skipAuth,
      accessTokenOnly,
      ...rest
    } = options;
    const authHeaders = accessTokenOnly ? this.applyAccessTokenOnlyHeaders(headers) : skipAuth ? headers : this.applySdkworkAuthHeaders(headers);
    const requestBody = this.buildRequestBody(body, contentType);
    const requestHeaders = await this.applySdkworkRequestBodyFingerprint(
      this.buildRequestHeaders(
        { Accept: "text/event-stream", ...authHeaders != null ? authHeaders : {} },
        body == null ? void 0 : contentType
      ),
      requestBody
    );
    for await (const data of stream.call(this, path, {
      method,
      ...rest,
      ...skipAuth !== void 0 ? { skipAuth } : {},
      ...accessTokenOnly !== void 0 ? { accessTokenOnly } : {},
      ...requestBody !== void 0 ? { body: requestBody } : {},
      ...requestHeaders !== void 0 ? { headers: requestHeaders } : {}
    })) {
      if (data === "[DONE]") {
        return;
      }
      if (typeof data !== "string" || data.trim().length === 0) {
        continue;
      }
      yield JSON.parse(data);
    }
  }
  async get(path, params, headers) {
    return this.request(path, {
      method: "GET",
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {}
    });
  }
  async post(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "POST",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
  async put(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "PUT",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
  async delete(path, params, headers) {
    return this.request(path, {
      method: "DELETE",
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {}
    });
  }
  async patch(path, body, params, headers, contentType) {
    return this.request(path, {
      method: "PATCH",
      ...body !== void 0 ? { body } : {},
      ...params !== void 0 ? { params } : {},
      ...headers !== void 0 ? { headers } : {},
      ...contentType !== void 0 ? { contentType } : {}
    });
  }
};
__publicField(_HttpClient3, "ACCESS_TOKEN_HEADER", "Access-Token");
__publicField(_HttpClient3, "SDKWORK_V3_UNWRAP", true);
__publicField(_HttpClient3, "SDKWORK_V3_REQUEST_FINGERPRINTS", true);
__publicField(_HttpClient3, "REQUIRES_SDKWORK_ACCESS_TOKEN", true);
var HttpClient4 = _HttpClient3;
function createHttpClient3(config) {
  return new HttpClient4(config);
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/api/paths.ts
var APP_API_PREFIX2 = "/app/v3/api";
function appApiPath2(path) {
  if (!path) {
    return APP_API_PREFIX2;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPrefixRaw = (APP_API_PREFIX2 || "").trim();
  const normalizedPrefix = normalizedPrefixRaw ? `/${normalizedPrefixRaw.replace(/^\/+|\/+$/g, "")}` : "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!normalizedPrefix || normalizedPrefix === "/") {
    return normalizedPath;
  }
  if (normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`)) {
    return normalizedPath;
  }
  return `${normalizedPrefix}${normalizedPath}`;
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/api/auth.ts
var AuthVerificationCodeRequestsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Verification Code Requests create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/verification_code_requests`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var AuthSessionsOrganizationSelectionApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Sessions organization Selection create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/sessions/organization_selection`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var AuthSessionsLoginContextSelectionApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Sessions login Context Selection create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/sessions/login_context_selection`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var AuthSessionsCurrentApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Sessions current delete. */
  async delete(requestOptions) {
    return this.client.request(appApiPath2(`/auth/sessions/current`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
  /** Sessions current retrieve. */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath2(`/auth/sessions/current`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Sessions current update. */
  async update(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/sessions/current`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", ...body !== void 0 ? { body, contentType: "application/json" } : {}, sdkworkUnwrapKind: "item" });
  }
};
var AuthSessionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "current");
    __publicField(this, "loginContextSelection");
    __publicField(this, "organizationSelection");
    this.client = client;
    this.current = new AuthSessionsCurrentApi(client);
    this.loginContextSelection = new AuthSessionsLoginContextSelectionApi(client);
    this.organizationSelection = new AuthSessionsOrganizationSelectionApi(client);
  }
  /** Sessions create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/sessions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
  /** Sessions refresh. */
  async refresh(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/sessions/refresh`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", skipAuth: true, sdkworkUnwrapKind: "command" });
  }
};
var AuthRegistrationsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Registrations create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/registrations`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var AuthPasswordResetsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Password Resets create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/password_resets`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var AuthPasswordResetRequestsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Password Reset Requests create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/auth/password_reset_requests`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var AuthApi = class {
  constructor(client) {
    __publicField(this, "passwordResetRequests");
    __publicField(this, "passwordResets");
    __publicField(this, "registrations");
    __publicField(this, "sessions");
    __publicField(this, "verificationCodeRequests");
    this.passwordResetRequests = new AuthPasswordResetRequestsApi(client);
    this.passwordResets = new AuthPasswordResetsApi(client);
    this.registrations = new AuthRegistrationsApi(client);
    this.sessions = new AuthSessionsApi(client);
    this.verificationCodeRequests = new AuthVerificationCodeRequestsApi(client);
  }
};
function createAuthApi(client) {
  return new AuthApi(client);
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/api/iam.ts
var IamUsersCurrentPhoneBindingsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Users current phone Bindings delete. */
  async delete(requestOptions) {
    return this.client.request(appApiPath2(`/iam/users/current/phone_bindings`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
  /** Users current phone Bindings create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/iam/users/current/phone_bindings`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var IamUsersCurrentPasswordApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Users current password update. */
  async update(body, requestOptions) {
    return this.client.request(appApiPath2(`/iam/users/current/password`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", ...body !== void 0 ? { body, contentType: "application/json" } : {}, sdkworkUnwrapKind: "item" });
  }
};
var IamUsersCurrentEmailBindingsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Users current email Bindings delete. */
  async delete(requestOptions) {
    return this.client.request(appApiPath2(`/iam/users/current/email_bindings`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
  /** Users current email Bindings create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/iam/users/current/email_bindings`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var IamUsersCurrentApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "emailBindings");
    __publicField(this, "password");
    __publicField(this, "phoneBindings");
    this.client = client;
    this.emailBindings = new IamUsersCurrentEmailBindingsApi(client);
    this.password = new IamUsersCurrentPasswordApi(client);
    this.phoneBindings = new IamUsersCurrentPhoneBindingsApi(client);
  }
  /** Users current retrieve. */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath2(`/iam/users/current`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
  /** Users current update. */
  async update(body, requestOptions) {
    return this.client.request(appApiPath2(`/iam/users/current`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "PATCH", ...body !== void 0 ? { body, contentType: "application/json" } : {}, sdkworkUnwrapKind: "item" });
  }
};
var IamUsersApi = class {
  constructor(client) {
    __publicField(this, "current");
    this.current = new IamUsersCurrentApi(client);
  }
};
var IamRoleBindingsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Role Bindings list. */
  async list(params, requestOptions) {
    const query = buildQueryString3([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false },
      { name: "roleId", value: params == null ? void 0 : params.roleId, style: "form", explode: true, allowReserved: false },
      { name: "principalKind", value: params == null ? void 0 : params.principalKind, style: "form", explode: true, allowReserved: false },
      { name: "principalId", value: params == null ? void 0 : params.principalId, style: "form", explode: true, allowReserved: false },
      { name: "scopeKind", value: params == null ? void 0 : params.scopeKind, style: "form", explode: true, allowReserved: false },
      { name: "scopeId", value: params == null ? void 0 : params.scopeId, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString3(appApiPath2(`/iam/role_bindings`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var IamPositionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Positions list. */
  async list(params, requestOptions) {
    const query = buildQueryString3([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString3(appApiPath2(`/iam/positions`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var IamPositionAssignmentsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Position Assignments list. */
  async list(params, requestOptions) {
    const query = buildQueryString3([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString3(appApiPath2(`/iam/position_assignments`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var IamOrganizationsTreeApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Organizations tree retrieve. */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath2(`/iam/organizations/tree`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var IamOrganizationsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "tree");
    this.client = client;
    this.tree = new IamOrganizationsTreeApi(client);
  }
  /** Organizations list. */
  async list(params, requestOptions) {
    const query = buildQueryString3([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString3(appApiPath2(`/iam/organizations`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var IamOrganizationMembershipsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Organization Memberships list. */
  async list(params, requestOptions) {
    const query = buildQueryString3([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString3(appApiPath2(`/iam/organization_memberships`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var IamDepartmentsTreeApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Departments tree retrieve. */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath2(`/iam/departments/tree`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var IamDepartmentsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "tree");
    this.client = client;
    this.tree = new IamDepartmentsTreeApi(client);
  }
  /** Departments list. */
  async list(params, requestOptions) {
    const query = buildQueryString3([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString3(appApiPath2(`/iam/departments`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var IamDepartmentAssignmentsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Department Assignments list. */
  async list(params, requestOptions) {
    const query = buildQueryString3([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString3(appApiPath2(`/iam/department_assignments`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
};
var IamApi = class {
  constructor(client) {
    __publicField(this, "departmentAssignments");
    __publicField(this, "departments");
    __publicField(this, "organizationMemberships");
    __publicField(this, "organizations");
    __publicField(this, "positionAssignments");
    __publicField(this, "positions");
    __publicField(this, "roleBindings");
    __publicField(this, "users");
    this.departmentAssignments = new IamDepartmentAssignmentsApi(client);
    this.departments = new IamDepartmentsApi(client);
    this.organizationMemberships = new IamOrganizationMembershipsApi(client);
    this.organizations = new IamOrganizationsApi(client);
    this.positionAssignments = new IamPositionAssignmentsApi(client);
    this.positions = new IamPositionsApi(client);
    this.roleBindings = new IamRoleBindingsApi(client);
    this.users = new IamUsersApi(client);
  }
};
function createIamApi(client) {
  return new IamApi(client);
}
function appendQueryString3(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function buildQueryString3(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter3(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter3(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent3(parameter.name)}=${encodeQueryValue3(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter3(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter3(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter3(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent3(parameter.name)}=${encodeQueryValue3(serializePrimitive3(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter3(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive3(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent3(name)}=${encodeQueryValue3(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent3(name)}=${encodeQueryValue3(values.join(","), allowReserved)}`);
}
function appendObjectParameter3(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent3(key)}=${encodeQueryValue3(serializePrimitive3(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive3(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent3(name)}=${encodeQueryValue3(serialized, allowReserved)}`);
}
function appendDeepObjectParameter3(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent3(name)}=${encodeQueryValue3(serializePrimitive3(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent3(`${name}[${key}]`)}=${encodeQueryValue3(serializePrimitive3(entryValue), allowReserved)}`);
  }
}
function serializePrimitive3(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent3(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue3(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/api/oauth.ts
var OauthWechatPaymentOauthApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Wechat Payment Oauth callback. */
  async callback(requestOptions) {
    return this.client.request(appApiPath2(`/oauth/wechat/payment/callback`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", skipAuth: true, sdkworkUnwrapKind: "item" });
  }
  /** Wechat Payment Oauth start. */
  async start(params, requestOptions) {
    const query = buildQueryString4([
      { name: "redirect", value: params.redirect, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString4(appApiPath2(`/oauth/wechat/payment/start`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "item" });
  }
};
var OauthSessionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Sessions create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/sessions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthScanLoginModesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Scan Login Modes list. */
  async list(params, requestOptions) {
    const query = buildQueryString4([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString4(appApiPath2(`/oauth/scan_login_modes`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", accessTokenOnly: true, sdkworkUnwrapKind: "page" });
  }
};
var OauthProvidersApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Providers list. */
  async list(params, requestOptions) {
    const query = buildQueryString4([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString4(appApiPath2(`/oauth/providers`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", accessTokenOnly: true, sdkworkUnwrapKind: "page" });
  }
};
var OauthMiniProgramSessionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Mini Program Sessions create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/mini_program_sessions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthGrantsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Grants list. */
  async list(params, requestOptions) {
    const query = buildQueryString4([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString4(appApiPath2(`/oauth/grants`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Grants delete. */
  async delete(grantId, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/grants/${serializePathParameter5(grantId, { name: "grantId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var OauthDeviceAuthorizationsSessionExchangesApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Device Authorizations session Exchanges create. */
  async create(deviceAuthorizationId, body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/device_authorizations/${serializePathParameter5(deviceAuthorizationId, { name: "deviceAuthorizationId", style: "simple", explode: false })}/session_exchanges`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", skipAuth: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthDeviceAuthorizationsSessionCompletionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Device Authorizations session Completions create. */
  async create(deviceAuthorizationId, body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/device_authorizations/${serializePathParameter5(deviceAuthorizationId, { name: "deviceAuthorizationId", style: "simple", explode: false })}/session_completions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthDeviceAuthorizationsScansApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Device Authorizations scans create. */
  async create(deviceAuthorizationId, body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/device_authorizations/${serializePathParameter5(deviceAuthorizationId, { name: "deviceAuthorizationId", style: "simple", explode: false })}/scans`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthDeviceAuthorizationsPasswordCompletionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Device Authorizations password Completions create. */
  async create(deviceAuthorizationId, body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/device_authorizations/${serializePathParameter5(deviceAuthorizationId, { name: "deviceAuthorizationId", style: "simple", explode: false })}/password_completions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthDeviceAuthorizationsApi = class {
  constructor(client) {
    __publicField(this, "client");
    __publicField(this, "passwordCompletions");
    __publicField(this, "scans");
    __publicField(this, "sessionCompletions");
    __publicField(this, "sessionExchanges");
    this.client = client;
    this.passwordCompletions = new OauthDeviceAuthorizationsPasswordCompletionsApi(client);
    this.scans = new OauthDeviceAuthorizationsScansApi(client);
    this.sessionCompletions = new OauthDeviceAuthorizationsSessionCompletionsApi(client);
    this.sessionExchanges = new OauthDeviceAuthorizationsSessionExchangesApi(client);
  }
  /** Device Authorizations create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/device_authorizations`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", skipAuth: true, sdkworkUnwrapKind: "item" });
  }
  /** Device Authorizations retrieve. */
  async retrieve(deviceAuthorizationId, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/device_authorizations/${serializePathParameter5(deviceAuthorizationId, { name: "deviceAuthorizationId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", skipAuth: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthCallbacksApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Callbacks retrieve. */
  async retrieve(providerCode, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/callbacks/${serializePathParameter5(providerCode, { name: "providerCode", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
  /** Callbacks create. */
  async create(providerCode, body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/callbacks/${serializePathParameter5(providerCode, { name: "providerCode", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthAuthorizationsCompletionsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Authorizations completions create. */
  async create(authorizationStateId, body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/authorizations/${serializePathParameter5(authorizationStateId, { name: "authorizationStateId", style: "simple", explode: false })}/completions`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", sdkworkUnwrapKind: "item" });
  }
};
var OauthAuthorizationsApi = class {
  constructor(client) {
    __publicField(this, "completions");
    this.completions = new OauthAuthorizationsCompletionsApi(client);
  }
};
var OauthAuthorizationUrlsApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Authorization Urls create. */
  async create(body, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/authorization_urls`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "POST", body, contentType: "application/json", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var OauthAccountLinksApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Account Links list. */
  async list(params, requestOptions) {
    const query = buildQueryString4([
      { name: "page", value: params == null ? void 0 : params.page, style: "form", explode: true, allowReserved: false },
      { name: "page_size", value: params == null ? void 0 : params.pageSize, style: "form", explode: true, allowReserved: false },
      { name: "cursor", value: params == null ? void 0 : params.cursor, style: "form", explode: true, allowReserved: false },
      { name: "sort", value: params == null ? void 0 : params.sort, style: "form", explode: true, allowReserved: false },
      { name: "q", value: params == null ? void 0 : params.q, style: "form", explode: true, allowReserved: false }
    ]);
    return this.client.request(appendQueryString4(appApiPath2(`/oauth/account_links`), query), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", sdkworkUnwrapKind: "page" });
  }
  /** Account Links delete. */
  async delete(accountLinkId, requestOptions) {
    return this.client.request(appApiPath2(`/oauth/account_links/${serializePathParameter5(accountLinkId, { name: "accountLinkId", style: "simple", explode: false })}`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "DELETE" });
  }
};
var OauthApi = class {
  constructor(client) {
    __publicField(this, "accountLinks");
    __publicField(this, "authorizationUrls");
    __publicField(this, "authorizations");
    __publicField(this, "callbacks");
    __publicField(this, "deviceAuthorizations");
    __publicField(this, "grants");
    __publicField(this, "miniProgramSessions");
    __publicField(this, "providers");
    __publicField(this, "scanLoginModes");
    __publicField(this, "sessions");
    __publicField(this, "wechatPaymentOauth");
    this.accountLinks = new OauthAccountLinksApi(client);
    this.authorizationUrls = new OauthAuthorizationUrlsApi(client);
    this.authorizations = new OauthAuthorizationsApi(client);
    this.callbacks = new OauthCallbacksApi(client);
    this.deviceAuthorizations = new OauthDeviceAuthorizationsApi(client);
    this.grants = new OauthGrantsApi(client);
    this.miniProgramSessions = new OauthMiniProgramSessionsApi(client);
    this.providers = new OauthProvidersApi(client);
    this.scanLoginModes = new OauthScanLoginModesApi(client);
    this.sessions = new OauthSessionsApi(client);
    this.wechatPaymentOauth = new OauthWechatPaymentOauthApi(client);
  }
};
function createOauthApi(client) {
  return new OauthApi(client);
}
function appendQueryString4(path, rawQueryString) {
  const query = rawQueryString.replace(/^\?+/, "");
  if (!query) {
    return path;
  }
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}
function serializePathParameter5(value, spec) {
  if (value === void 0 || value === null) {
    return "";
  }
  const style = spec.style || "simple";
  if (Array.isArray(value)) {
    return serializePathArray5(spec.name, value, style, spec.explode);
  }
  if (typeof value === "object") {
    return serializePathObject5(spec.name, value, style, spec.explode);
  }
  return pathPrefix5(spec.name, style, false) + encodePathValue5(serializePathPrimitive5(value));
}
function serializePathArray5(name, values, style, explode) {
  const serialized = values.filter((item) => item !== void 0 && item !== null).map((item) => encodePathValue5(serializePathPrimitive5(item)));
  if (serialized.length === 0) {
    return pathPrefix5(name, style, false);
  }
  if (style === "matrix") {
    return explode ? serialized.map((item) => `;${name}=${item}`).join("") : `;${name}=${serialized.join(",")}`;
  }
  return pathPrefix5(name, style, false) + serialized.join(explode ? "." : ",");
}
function serializePathObject5(name, value, style, explode) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix5(name, style, true);
  }
  if (style === "matrix") {
    return explode ? entries.map(([key, entryValue]) => `;${encodePathValue5(key)}=${encodePathValue5(serializePathPrimitive5(entryValue))}`).join("") : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue5(key), encodePathValue5(serializePathPrimitive5(entryValue))]).join(",")}`;
  }
  const serialized = explode ? entries.map(([key, entryValue]) => `${encodePathValue5(key)}=${encodePathValue5(serializePathPrimitive5(entryValue))}`).join(style === "label" ? "." : ",") : entries.flatMap(([key, entryValue]) => [encodePathValue5(key), encodePathValue5(serializePathPrimitive5(entryValue))]).join(",");
  return pathPrefix5(name, style, true) + serialized;
}
function pathPrefix5(name, style, _objectValue) {
  if (style === "label") return ".";
  if (style === "matrix") return `;${name}`;
  return "";
}
function encodePathValue5(value) {
  return encodeURIComponent(value);
}
function serializePathPrimitive5(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function buildQueryString4(parameters) {
  const pairs = [];
  for (const parameter of parameters) {
    appendSerializedParameter4(pairs, parameter);
  }
  return pairs.join("&");
}
function appendSerializedParameter4(pairs, parameter) {
  if (parameter.value === void 0 || parameter.value === null) {
    return;
  }
  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent4(parameter.name)}=${encodeQueryValue4(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }
  const style = parameter.style || "form";
  if (style === "deepObject") {
    appendDeepObjectParameter4(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }
  if (Array.isArray(parameter.value)) {
    appendArrayParameter4(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (typeof parameter.value === "object") {
    appendObjectParameter4(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.push(`${encodeQueryComponent4(parameter.name)}=${encodeQueryValue4(serializePrimitive4(parameter.value), parameter.allowReserved)}`);
}
function appendArrayParameter4(pairs, name, value, style, explode, allowReserved) {
  const values = value.filter((item) => item !== void 0 && item !== null).map((item) => serializePrimitive4(item));
  if (values.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent4(name)}=${encodeQueryValue4(item, allowReserved)}`);
    }
    return;
  }
  pairs.push(`${encodeQueryComponent4(name)}=${encodeQueryValue4(values.join(","), allowReserved)}`);
}
function appendObjectParameter4(pairs, name, value, style, explode, allowReserved) {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0 && entryValue !== null);
  if (entries.length === 0) {
    return;
  }
  if (style === "form" && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent4(key)}=${encodeQueryValue4(serializePrimitive4(entryValue), allowReserved)}`);
    }
    return;
  }
  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive4(entryValue)]).join(",");
  pairs.push(`${encodeQueryComponent4(name)}=${encodeQueryValue4(serialized, allowReserved)}`);
}
function appendDeepObjectParameter4(pairs, name, value, allowReserved) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent4(name)}=${encodeQueryValue4(serializePrimitive4(value), allowReserved)}`);
    return;
  }
  for (const [key, entryValue] of Object.entries(value)) {
    if (entryValue === void 0 || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent4(`${name}[${key}]`)}=${encodeQueryValue4(serializePrimitive4(entryValue), allowReserved)}`);
  }
}
function serializePrimitive4(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function encodeQueryComponent4(value) {
  return encodeURIComponent(value);
}
function encodeQueryValue4(value, allowReserved) {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ":").replace(/%2F/gi, "/").replace(/%3F/gi, "?").replace(/%23/gi, "#").replace(/%5B/gi, "[").replace(/%5D/gi, "]").replace(/%40/gi, "@").replace(/%21/gi, "!").replace(/%24/gi, "$").replace(/%26/gi, "&").replace(/%27/gi, "'").replace(/%28/gi, "(").replace(/%29/gi, ")").replace(/%2A/gi, "*").replace(/%2B/gi, "+").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%3D/gi, "=");
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/api/system.ts
var SystemIamVerificationPolicyApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Iam verification Policy retrieve. */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath2(`/system/iam/verification_policy`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var SystemIamRuntimeApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Iam runtime retrieve. */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath2(`/system/iam/runtime`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var SystemIamAccountBindingPolicyApi = class {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  /** Iam account Binding Policy retrieve. */
  async retrieve(requestOptions) {
    return this.client.request(appApiPath2(`/system/iam/account_binding_policy`), { ...(requestOptions == null ? void 0 : requestOptions.signal) !== void 0 ? { signal: requestOptions.signal } : {}, ...(requestOptions == null ? void 0 : requestOptions.timeout) !== void 0 ? { timeout: requestOptions.timeout } : {}, method: "GET", accessTokenOnly: true, sdkworkUnwrapKind: "item" });
  }
};
var SystemIamApi = class {
  constructor(client) {
    __publicField(this, "accountBindingPolicy");
    __publicField(this, "runtime");
    __publicField(this, "verificationPolicy");
    this.accountBindingPolicy = new SystemIamAccountBindingPolicyApi(client);
    this.runtime = new SystemIamRuntimeApi(client);
    this.verificationPolicy = new SystemIamVerificationPolicyApi(client);
  }
};
var SystemApi = class {
  constructor(client) {
    __publicField(this, "iam");
    this.iam = new SystemIamApi(client);
  }
};
function createSystemApi(client) {
  return new SystemApi(client);
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/generated/server-openapi/src/sdk.ts
var SdkworkAppClient = class {
  constructor(config) {
    __publicField(this, "httpClient");
    __publicField(this, "auth");
    __publicField(this, "iam");
    __publicField(this, "oauth");
    __publicField(this, "system");
    this.httpClient = createHttpClient3(config);
    this.auth = createAuthApi(this.httpClient);
    this.iam = createIamApi(this.httpClient);
    this.oauth = createOauthApi(this.httpClient);
    this.system = createSystemApi(this.httpClient);
  }
  setAuthToken(token) {
    this.httpClient.setAuthToken(token);
    return this;
  }
  setAccessToken(token) {
    this.httpClient.setAccessToken(token);
    return this;
  }
  setTokenManager(manager) {
    this.httpClient.setTokenManager(manager);
    return this;
  }
  get http() {
    return this.httpClient;
  }
};
function createClient4(config) {
  return new SdkworkAppClient(config);
}

// ../../../sdkwork-iam/sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/src/index.ts
function createClient5(config) {
  return createClient4(config);
}

// packages/sdkwork-im-mp-core/src/sdk/imIamSdkClient.ts
var IM_MP_WECHAT_PROVIDER_CODE = "wechat_mini_program";
var iamAppSdkClient = null;
var configuredSurfaceCode = null;
function extractImMpSessionPayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  const record = value;
  for (const key of ["item", "session"]) {
    const nested = record[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const candidate = nested;
      if (typeof candidate.accessToken === "string" || typeof candidate.authToken === "string") {
        return candidate;
      }
    }
  }
  const data = record.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const candidate = data;
    if (typeof candidate.accessToken === "string" || typeof candidate.authToken === "string") {
      return candidate;
    }
    if (candidate.item && typeof candidate.item === "object") {
      return candidate.item;
    }
  }
  return record;
}
function createIamAppSdkClientConfig(options) {
  var _a, _b;
  const normalized = options.baseUrl.trim().replace(/\/+$/u, "");
  if (normalized.length === 0) {
    throw new Error("IAM app-api base URL is required before SDK bootstrap");
  }
  const session = readImMpSession();
  const accessToken = (_a = options.accessToken) != null ? _a : resolveImMpAccessToken(session);
  const authToken = (_b = options.authToken) != null ? _b : resolveImMpAuthToken(session);
  const config = { baseUrl: normalized, platform: "mini-program" };
  if (accessToken) {
    config.accessToken = accessToken;
  }
  if (authToken) {
    config.authToken = authToken;
  }
  if (options.tokenManager) {
    config.tokenManager = options.tokenManager;
  }
  return config;
}
function initIamAppSdkClient(options) {
  var _a;
  iamAppSdkClient = createClient5(createIamAppSdkClientConfig(options));
  configuredSurfaceCode = ((_a = options.surfaceCode) == null ? void 0 : _a.trim()) || null;
  return iamAppSdkClient;
}
function getIamAppSdkClient() {
  if (!iamAppSdkClient) {
    throw new Error("IAM app SDK client must be initialized by bootstrap before use");
  }
  return iamAppSdkClient;
}
async function exchangeImMpWechatMiniProgramSession(request, applySession) {
  var _a;
  const jsCode = request.jsCode.trim();
  if (!jsCode) {
    throw new Error("wx.login() did not return a code; cannot exchange a session.");
  }
  const surfaceCode = ((_a = request.surfaceCode) == null ? void 0 : _a.trim()) || configuredSurfaceCode || void 0;
  const response = await getIamAppSdkClient().oauth.miniProgramSessions.create({
    jsCode,
    providerCode: IM_MP_WECHAT_PROVIDER_CODE,
    ...surfaceCode ? { surfaceCode } : {}
  });
  const session = commitImMpSession(extractImMpSessionPayload(response));
  applySession == null ? void 0 : applySession(session);
  return session;
}
async function validateImMpCurrentSession() {
  if (!isImMpSessionComplete(readImMpSession())) {
    clearImMpSession();
    return { valid: false, reason: "no-session" };
  }
  try {
    await getIamAppSdkClient().auth.sessions.current.retrieve();
    return { valid: true, reason: "valid" };
  } catch (error) {
    if (isImMpSessionRejectedError(error)) {
      clearImMpSession();
      return { valid: false, reason: "rejected" };
    }
    return { valid: true, reason: "transient" };
  }
}
async function logoutImMpSession() {
  try {
    await getIamAppSdkClient().auth.sessions.current.delete();
  } catch {
  } finally {
    clearImMpSession();
  }
}
function isImMpSessionRejectedError(error) {
  var _a, _b, _c, _d;
  if (!error || typeof error !== "object") {
    return false;
  }
  const candidate = error;
  const status = (_d = (_b = (_a = candidate.httpStatus) != null ? _a : candidate.status) != null ? _b : candidate.statusCode) != null ? _d : (_c = candidate.response) == null ? void 0 : _c.status;
  if (status === 401 || status === 403) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return /\b401\b/u.test(message) || /\b403\b/u.test(message) || /unauthorized/iu.test(message);
}

// src/bootstrap/sdkClients.ts
var composition = null;
function initImMpSdkClients(environment) {
  if (composition) {
    return composition;
  }
  const { socketFactory } = getImMpHostAdapters();
  const tokenManager = createTokenManager();
  const imSdkClient2 = initImSdkClient(
    createImSdkClientConfig(environment.imApiBaseUrl, {
      websocketBaseUrl: environment.imWebsocketBaseUrl,
      tokenManager,
      webSocketFactory: socketFactory
    })
  );
  const imAppSdkClient2 = initImAppSdkClient(
    createImAppSdkClientConfig(environment.imApiBaseUrl)
  );
  const iamAppSdkClient2 = initIamAppSdkClient({
    baseUrl: environment.iamApiBaseUrl,
    tokenManager,
    ...environment.iamMiniProgramSurfaceCode ? { surfaceCode: environment.iamMiniProgramSurfaceCode } : {}
  });
  composition = { tokenManager, imSdkClient: imSdkClient2, imAppSdkClient: imAppSdkClient2, iamAppSdkClient: iamAppSdkClient2 };
  return composition;
}
function applyImMpSession(session) {
  const current = composition;
  if (!current) {
    throw new Error("SDK clients must be initialized before a session can be applied");
  }
  current.tokenManager.setTokens({
    accessToken: session.accessToken,
    authToken: session.authToken,
    ...session.refreshToken ? { refreshToken: session.refreshToken } : {}
  });
  current.imSdkClient.setAccessToken(session.accessToken);
  current.imSdkClient.setAuthToken(session.authToken);
  current.imAppSdkClient.setAccessToken(session.accessToken);
  current.imAppSdkClient.setAuthToken(session.authToken);
  current.iamAppSdkClient.setAccessToken(session.accessToken);
  current.iamAppSdkClient.setAuthToken(session.authToken);
  current.iamAppSdkClient.setTokenManager(current.tokenManager);
}
function clearImMpSdkCredentials() {
  const current = composition;
  if (!current) {
    return;
  }
  current.tokenManager.clearTokens();
  current.imSdkClient.setAccessToken("");
  current.imSdkClient.setAuthToken("");
  current.imAppSdkClient.setAccessToken("");
  current.imAppSdkClient.setAuthToken("");
  current.iamAppSdkClient.setAccessToken("");
  current.iamAppSdkClient.setAuthToken("");
}

// src/bootstrap/session.ts
async function restoreImMpSession() {
  const session = readImMpSession();
  if (!isImMpSessionComplete(session)) {
    clearImMpSession();
    return { authenticated: false, reason: "no-session", session: null };
  }
  applyImMpSession(session);
  const validation = await validateImMpCurrentSession();
  if (!validation.valid) {
    if (validation.reason === "rejected") {
      clearImMpSession();
      clearImMpSdkCredentials();
      return { authenticated: false, reason: "rejected", session: null };
    }
    return { authenticated: false, reason: "no-session", session: null };
  }
  return {
    authenticated: true,
    reason: validation.reason === "transient" ? "transient" : "restored",
    session
  };
}
function commitImMpSessionForRuntime(session) {
  applyImMpSession(session);
}
function clearImMpSessionForRuntime() {
  clearImMpSession();
  clearImMpSdkCredentials();
}
function isImMpAuthenticated() {
  return isImMpSessionComplete(readImMpSession());
}
function readImMpCurrentSession() {
  return readImMpSession();
}

// src/bootstrap/iamRuntime.ts
var runtime = null;
function createImMpAuthRuntime(loginCodeProvider = createWeixinLoginCodeProviderFromGlobal()) {
  let loginInFlight = null;
  return {
    async login() {
      if (loginInFlight) {
        return loginInFlight;
      }
      loginInFlight = (async () => {
        try {
          const jsCode = await loginCodeProvider.requestLoginCode();
          return await exchangeImMpWechatMiniProgramSession(
            { jsCode },
            commitImMpSessionForRuntime
          );
        } finally {
          loginInFlight = null;
        }
      })();
      return loginInFlight;
    },
    async logout() {
      await logoutImMpSession();
      clearImMpSessionForRuntime();
    },
    restore: restoreImMpSession,
    isAuthenticated: isImMpAuthenticated
  };
}
function getImMpAuthRuntime() {
  if (!runtime) {
    runtime = createImMpAuthRuntime();
  }
  return runtime;
}

// src/bootstrap/routes.ts
function listImMpRouteContributions() {
  return [...imMpShellRouteContributions, ...imMpChatRouteContributions];
}
function validateImMpComposedRoutes(routes = listImMpRouteContributions()) {
  return validateImMpRouteContributions(routes);
}
function composeImMpRoutes(resolveTitle) {
  const routes = listImMpRouteContributions();
  const issues = validateImMpComposedRoutes(routes);
  if (issues.length > 0) {
    throw new Error(`IM mini program route composition is invalid: ${issues.join("; ")}`);
  }
  return {
    routes,
    appJson: projectImMpAppJson(routes),
    tabBar: projectImMpTabBar(routes, resolveTitle ? { resolveTitle } : {})
  };
}

// src/bootstrap/runtime.ts
var runtime2 = null;
async function bootstrapImMpRuntime(options) {
  var _a;
  if (runtime2) {
    return runtime2;
  }
  const hostAdapters = registerImMpHostAdapters();
  configureImMpRuntimeEnvSource(options.runtimeEnv, {
    ...hostAdapters.hostLanguage ? { hostLanguage: hostAdapters.hostLanguage } : {}
  });
  const environment = resolveImMpRuntimeEnvironment();
  const clients = initImMpSdkClients(environment);
  const auth = getImMpAuthRuntime();
  const locale = normalizeImMpLocale(
    (_a = environment.hostLanguage) != null ? _a : environment.defaultLocale
  );
  const composition2 = composeImMpRoutes((titleKey) => resolveImMpChatMessage(locale, titleKey));
  const tabBarDeclaration = resolveImMpTabBarDeclaration(composition2.tabBar);
  if (tabBarDeclaration.enabled) {
    applyImMpTabBar(composition2.tabBar, hostAdapters.navigation.setTabBarItem);
  }
  const inbox = createImMpChatInboxStore(
    createImMpChatInboxService(() => clients.imSdkClient)
  );
  const conversationService = createImMpChatConversationService(() => clients.imSdkClient);
  runtime2 = {
    environment,
    hostAdapters,
    clients,
    auth,
    routes: composition2.routes,
    tabBar: composition2.tabBar,
    tabBarDeclaration,
    locale,
    navigation: hostAdapters.navigation,
    t: (key, fallback) => resolveImMpChatMessage(locale, key, fallback),
    format: formatImMpChatMessage,
    inboxStore: () => inbox,
    createConversationStore: () => createImMpChatConversationStore(
      conversationService,
      (conversationId) => {
        var _a2;
        return (_a2 = inbox.getState().items.find((item) => item.conversationId === conversationId)) == null ? void 0 : _a2.displayName;
      }
    ),
    createGroup: (input) => conversationService.createGroup(input),
    evaluateRoute: (route) => evaluateImMpAuthGate(route.auth, isImMpAuthenticated()),
    routePagePath: (routeId) => resolveImMpRoutePagePath(composition2.routes, routeId)
  };
  return runtime2;
}
function getImMpRuntime() {
  if (!runtime2) {
    throw new Error(
      "IM mini program runtime must be bootstrapped by src/app.js before a page can use it"
    );
  }
  return runtime2;
}
function resolveImMpRoutePagePath(routes, routeId) {
  const route = routes.find((candidate) => candidate.id === routeId);
  if (!route) {
    throw new Error(`Unknown IM mini program route id: ${routeId}`);
  }
  return route.miniProgram.pagePath;
}
function isImMpRuntimeBootstrapped() {
  return runtime2 !== null;
}

// src/bootstrap/runtimeBundle.ts
function bootstrapImMpMiniProgram(options) {
  return bootstrapImMpRuntime(options);
}

/**
 * Route contributions for the IM mini program chat capability.
 *
 * Route ids follow `<surface>.<domain>.<capability>.<screen>` and are identical
 * to the H5 (`packages/sdkwork-im-h5-shell/src/routeCatalog.ts`) and PC route
 * ids, so one screen keeps one id across every client architecture.
 *
 * Route metadata must not declare HTTP API paths, SDK methods, raw URL
 * constants, or transport details.
 *
 * Placement follows `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 5:
 * - the inbox is a tab page, so it MUST live in the main package;
 * - the thread and group-creation screens are pushed on top of it and live in
 *   the `package-chat` subpackage, which is preloaded from the inbox so the
 *   first tap does not wait for a package download.
 */

import type { ImMpRouteContribution } from "@sdkwork/im-mp-shell";

export const IM_MP_CHAT_SUBPACKAGE = "package-chat" as const;

/**
 * Canonical route ids for the chat capability.
 *
 * Exported so pages navigate by id through the runtime's `routePagePath`
 * resolver instead of hard-coding a page path: moving a screen between the main
 * package and a subpackage then cannot leave a stale path behind.
 */
export const IM_MP_CHAT_ROUTE_IDS = {
  inbox: "app.communication.chat.inbox",
  conversation: "app.communication.chat.conversation",
  createGroup: "app.communication.chat.create-group",
} as const;

export const imMpChatRouteContributions: ImMpRouteContribution[] = [
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
    miniProgram: { rootPackage: true, pagePath: "pages/inbox/index" },
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
      preload: true,
    },
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
      pagePath: `${IM_MP_CHAT_SUBPACKAGE}/pages/create-group/index`,
    },
  },
];

/**
 * Query parameter names the chat pages read from `onLoad(options)`.
 *
 * Declared as constants so the inbox (which writes them) and the pages (which
 * read them) cannot drift.
 */
export const IM_MP_CHAT_QUERY_PARAMS = {
  conversationId: "conversationId",
  conversationTitle: "title",
} as const;

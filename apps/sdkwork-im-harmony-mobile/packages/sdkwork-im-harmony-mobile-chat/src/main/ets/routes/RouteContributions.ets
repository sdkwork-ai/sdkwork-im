/**
 * Route contributions for the IM HarmonyOS chat capability.
 *
 * Route ids follow `<surface>.<domain>.<capability>.<screen>` and are identical
 * to the H5 catalog (`packages/sdkwork-im-h5-shell/src/routeCatalog.ts`), the
 * mini program contributions, and the PC routes, so one screen keeps one id
 * across every client architecture.
 *
 * Route metadata must not declare HTTP API paths, SDK methods, raw URL
 * constants, or transport details.
 *
 * Presentation follows `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 7:
 * the inbox is a `tab`, and the thread and group-creation screens are pushed as
 * `page`.
 */
import { type ImHarmonyRouteRegistration } from '@sdkwork/sdkwork-im-harmony-mobile-shell';

/** Canonical route ids for the chat capability. */
export const IM_HARMONY_CHAT_ROUTE_IDS: Record<string, string> = {
  inbox: 'app.communication.chat.inbox',
  conversation: 'app.communication.chat.conversation',
  createGroup: 'app.communication.chat.create-group',
};

/** Physical Harmony page paths, one per route id. */
export const IM_HARMONY_CHAT_PAGE_PATHS: Record<string, string> = {
  inbox: 'pages/chat/ChatInbox',
  conversation: 'pages/chat/ChatConversation',
  createGroup: 'pages/chat/CreateGroup',
};

export interface ImHarmonyChatRouteContribution {
  readonly id: string;
  readonly surface: 'app';
  readonly moduleId: string;
  readonly domain: string;
  readonly capability: string;
  readonly screen: string;
  readonly pagePath: string;
  readonly titleKey: string;
  readonly auth: 'public' | 'required';
  readonly layoutGroup: 'main' | 'stack';
  readonly permissionHint?: string;
  readonly harmonyNative: 'page' | 'tab' | 'dialog' | 'sheet';
}

export const imHarmonyChatRouteContributions: ImHarmonyChatRouteContribution[] = [
  {
    id: IM_HARMONY_CHAT_ROUTE_IDS.inbox,
    surface: 'app',
    moduleId: 'chat',
    domain: 'communication',
    capability: 'chat',
    screen: 'inbox',
    pagePath: IM_HARMONY_CHAT_PAGE_PATHS.inbox,
    titleKey: 'common.tabs.chat',
    auth: 'required',
    layoutGroup: 'main',
    harmonyNative: 'tab',
  },
  {
    id: IM_HARMONY_CHAT_ROUTE_IDS.conversation,
    surface: 'app',
    moduleId: 'chat',
    domain: 'communication',
    capability: 'chat',
    screen: 'conversation',
    pagePath: IM_HARMONY_CHAT_PAGE_PATHS.conversation,
    titleKey: 'chat.conversation.title',
    auth: 'required',
    layoutGroup: 'stack',
    harmonyNative: 'page',
  },
  {
    id: IM_HARMONY_CHAT_ROUTE_IDS.createGroup,
    surface: 'app',
    moduleId: 'chat',
    domain: 'communication',
    capability: 'chat',
    screen: 'create-group',
    pagePath: IM_HARMONY_CHAT_PAGE_PATHS.createGroup,
    titleKey: 'chat.create_group.title',
    auth: 'required',
    layoutGroup: 'stack',
    harmonyNative: 'page',
  },
];

/**
 * Projects the contributions onto the shell's registration shape.
 *
 * `HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md` section 5 places `shell` above the
 * capability packages, so a capability consumes the shell's public exports — the
 * same direction `packages/sdkwork-im-mp-chat` already uses for
 * `ImMpRouteContribution`. The shell owns the navigator's registration shape and
 * a capability cannot re-declare it without forking the contract.
 *
 * This is a real projection rather than a field subset: `moduleId`, `domain`,
 * `capability`, and `screen` are dropped (the shell re-derives them from the
 * route id), and a missing page path becomes a validation error in the shell
 * rather than a silently absent screen.
 */
export function toImHarmonyRouteRegistrations(
  contributions: ImHarmonyChatRouteContribution[],
): ImHarmonyRouteRegistration[] {
  return contributions.map((contribution: ImHarmonyChatRouteContribution) => {
    const registration: ImHarmonyRouteRegistration = {
      id: contribution.id,
      pagePath: contribution.pagePath,
      titleKey: contribution.titleKey,
      auth: contribution.auth,
      layoutGroup: contribution.layoutGroup,
      harmonyNative: contribution.harmonyNative,
    };
    return registration;
  });
}

/**
 * Query parameter names the chat pages read from route params.
 *
 * Declared as constants so the inbox (which writes them) and the pages (which
 * read them) cannot drift.
 */
export const IM_HARMONY_CHAT_ROUTE_PARAMS: Record<string, string> = {
  conversationId: 'conversationId',
  conversationTitle: 'title',
};

import type { ImH5ModuleId } from "./contracts";

export const ALL_IM_H5_MODULES = [
  "chat",
  "contacts",
  "user",
  "agents",
  "knowledge",
  "drive",
  "orders",
  "shop",
  "calendar",
  "notary",
  "approval",
  "report",
  "attendance",
  "enterprise",
  "devices",
  "community",
  "voice",
  "course",
  "videogen",
  "imagegen",
  "musicgen",
  "writing",
  "meeting",
  "moments",
  "music",
  "channels",
  "recruitment",
  "membership",
] as const satisfies readonly ImH5ModuleId[];

/**
 * Default product composition: the audited H5 release surface only. It
 * renders real, SDK-backed content end to end:
 *
 * - `chat`: inbox + conversation (message send/receive, media upload,
 *   recall/edit, favorites, pinned messages, search, read receipts)
 * - `contacts`: address book, friend requests, organization directory, and
 *   the composed agents tab
 * - `notary`: Workspace Notary plus the notary workflow routes
 * - `orders`: order center, detail, cashier, and voucher redemption
 *
 * Fail-closed rule (PRD): every other module stays opt-in through
 * `VITE_SDKWORK_IM_H5_MODULES` and must not be registered by default. The
 * fabricated surfaces (user-package billing/games mock data, localStorage
 * mocks such as approval / attendance / calendar / report) are not part of
 * the default composition, and no module in the default set depends on a
 * non-default module at runtime: the orders module only consumes the wallet
 * portfolio *service* from the `@sdkwork/im-h5-user` package (bundled by the
 * shell itself), not the user module's routes or navigation.
 */
export const DEFAULT_IM_H5_MODULES = [
  "chat",
  "contacts",
  "notary",
  "orders",
] as const satisfies readonly ImH5ModuleId[];

export const COMPOSABLE_IM_H5_MODULES = new Set<ImH5ModuleId>([...DEFAULT_IM_H5_MODULES]);

export const CONTRACT_PENDING_IM_H5_MODULES = new Set<ImH5ModuleId>(
  ALL_IM_H5_MODULES.filter((moduleId) => !COMPOSABLE_IM_H5_MODULES.has(moduleId)),
);

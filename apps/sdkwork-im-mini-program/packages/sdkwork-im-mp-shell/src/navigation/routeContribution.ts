/**
 * Mini program route contribution contract.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 5.
 *
 * Capability packages contribute route metadata only. Route metadata must not
 * declare HTTP API paths, SDK method names, raw URL constants, or transport
 * details: those belong to services inside the capability package.
 *
 * Route ids follow `<surface>.<domain>.<capability>.<screen>` and stay aligned
 * with the PC, H5, Flutter, and HarmonyOS roots so one capability screen keeps
 * one id across every client architecture.
 */

import type { MiniProgramRoutePlacement } from "./routePlacement";

/** Auth mode a route declares; the shell owns the guard that enforces it. */
export type ImMpRouteAuth = "public" | "required";

export interface ImMpRouteContribution {
  readonly id: string;
  readonly surface: "app";
  /** IM module that owns the screen (`chat`, `contacts`, ...). */
  readonly moduleId: string;
  readonly domain: string;
  readonly capability: string;
  readonly screen: string;
  /** i18n title key resolved through the capability package locale registry. */
  readonly titleKey: string;
  readonly auth: ImMpRouteAuth;
  /** Server-owned permission hint mirrored from the OpenAPI/module catalog. */
  readonly permissionHint?: string;
  /** Layout group consumed by the shell tab bar projection. */
  readonly layoutGroup?: "main" | "stack";
  readonly miniProgram: MiniProgramRoutePlacement;
}

/**
 * Validates a contributed route set.
 *
 * Returns the offending route ids instead of throwing so the build manifest can
 * report every conflict at once. The projector treats a non-empty result as a
 * hard failure.
 */
export function validateImMpRouteContributions(
  routes: ImMpRouteContribution[],
): string[] {
  const issues: string[] = [];
  const seenIds = new Set<string>();
  const seenPagePaths = new Set<string>();
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

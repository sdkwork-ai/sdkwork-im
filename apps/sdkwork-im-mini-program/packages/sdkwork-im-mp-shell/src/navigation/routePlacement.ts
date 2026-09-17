/**
 * Mini program route placement metadata and projection.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 5. SDKWork
 * packages are source/dependency boundaries; platform `pages`/`subPackages`
 * are runtime loading and package-size boundaries. Build tooling projects route
 * contributions into those two platform lists, so the physical page files stay
 * projection targets rather than a second source of truth.
 */

import type { ImMpRouteContribution } from "./routeContribution";

export interface MiniProgramRoutePlacement {
  /** Page lives in the main package (required for tab bar pages). */
  readonly rootPackage?: boolean;
  /** Subpackage root directory, e.g. `package-chat`. */
  readonly subpackage?: string;
  /** Platform page path, e.g. `pages/inbox/index`. */
  readonly pagePath: string;
  /** Preload the subpackage on app launch. */
  readonly preload?: boolean;
}

export interface ImMpPageProjectionEntry {
  readonly routeId: string;
  readonly pagePath: string;
  readonly rootPackage: boolean;
  readonly subpackage?: string;
}

export interface ImMpSubPackageProjection {
  readonly root: string;
  readonly pages: string[];
  readonly preloadRule?: boolean;
}

export interface ImMpAppJsonProjection {
  /** `app.json#pages`. */
  readonly pages: string[];
  /** `app.json#subPackages`. */
  readonly subPackages: ImMpSubPackageProjection[];
}

/**
 * Projects route contributions into the platform page list and subpackage
 * descriptors. Root pages are emitted in contribution order so tab order stays
 * deterministic; subpackage pages are grouped by `root` and stripped of their
 * subpackage prefix, matching the platform's `subPackages[].pages` shape.
 */
export function projectImMpPages(
  routes: ImMpRouteContribution[],
): ImMpPageProjectionEntry[] {
  return routes.map((route) => ({
    routeId: route.id,
    pagePath: route.miniProgram.pagePath,
    rootPackage: route.miniProgram.rootPackage === true,
    ...(route.miniProgram.subpackage ? { subpackage: route.miniProgram.subpackage } : {}),
  }));
}

export function listImMpRootPages(routes: ImMpRouteContribution[]): string[] {
  return projectImMpPages(routes)
    .filter((entry) => entry.rootPackage)
    .map((entry) => entry.pagePath);
}

export function projectImMpSubPackages(
  routes: ImMpRouteContribution[],
): ImMpSubPackageProjection[] {
  const grouped = new Map<string, { pages: string[]; preload: boolean }>();
  for (const route of routes) {
    const subpackage = route.miniProgram.subpackage;
    if (!subpackage) {
      continue;
    }
    const bucket = grouped.get(subpackage) ?? { pages: [], preload: false };
    bucket.pages.push(stripSubpackagePrefix(route.miniProgram.pagePath, subpackage));
    bucket.preload = bucket.preload || route.miniProgram.preload === true;
    grouped.set(subpackage, bucket);
  }
  return [...grouped.entries()].map(([root, bucket]) => ({
    root,
    pages: bucket.pages,
    ...(bucket.preload ? { preloadRule: true } : {}),
  }));
}

export function projectImMpAppJson(
  routes: ImMpRouteContribution[],
): ImMpAppJsonProjection {
  return {
    pages: listImMpRootPages(routes),
    subPackages: projectImMpSubPackages(routes),
  };
}

function stripSubpackagePrefix(pagePath: string, subpackage: string): string {
  const prefix = `${subpackage}/`;
  return pagePath.startsWith(prefix) ? pagePath.slice(prefix.length) : pagePath;
}

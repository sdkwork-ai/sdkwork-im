/**
 * Domain-neutral screen state primitives for the IM mini program surface.
 *
 * Authority: `APP_MINI_PROGRAM_UI_SPEC.md`. Capability packages map these to
 * their own data; the primitives stay payload-free so they remain reusable
 * across capabilities.
 */
export type ImMpScreenStatus = "loading" | "ready" | "empty" | "error";

export interface ImMpScreenState {
  readonly status: ImMpScreenStatus;
  readonly errorMessage?: string;
}

export const initialImMpScreenState: ImMpScreenState = { status: "loading" };

export function resolveImMpScreenStatus(
  itemCount: number,
  loading: boolean,
  errorMessage?: string,
): ImMpScreenStatus {
  if (loading) {
    return "loading";
  }
  if (typeof errorMessage === "string" && errorMessage.length > 0) {
    return "error";
  }
  return itemCount === 0 ? "empty" : "ready";
}

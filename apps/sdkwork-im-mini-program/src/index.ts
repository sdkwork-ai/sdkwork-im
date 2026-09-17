/**
 * Type-level entry for the IM mini program application root.
 *
 * The runnable entry is `src/app.js` (WeChat loads JavaScript). This module
 * exists so the root package's `exports` map resolves to real intent for any
 * tooling that reads it, and so `tsc --noEmit` type-checks the bootstrap
 * surface the bundle is built from.
 */
export * from "./bootstrap/runtimeBundle";

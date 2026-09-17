/**
 * Cross-architecture composition entry.
 *
 * Authority: `APP_COMPOSITION_SPEC.md`. Feature packages resolve runtime
 * composition metadata through this core composition entrypoint only.
 *
 * The path value is the repository-wide convention shared by every SDKWork
 * client root (81 TypeScript occurrences workspace-wide). Keep it literal.
 */
export const sdkworkComponentSpecPath = "../../../specs/component.spec.json" as const;

/**
 * WeChat platform adapters for the IM mini program.
 *
 * This is the only package in the IM mini program family allowed to touch
 * `wx.*` globals (`MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 8). Every
 * adapter also exposes an injected-argument factory so tests and the Node
 * runners can exercise the mapping without a WeChat runtime.
 */
export * from "./weixin/storage";
export * from "./weixin/fetch";
export * from "./weixin/socket";
export * from "./weixin/navigation";
export * from "./weixin/login";

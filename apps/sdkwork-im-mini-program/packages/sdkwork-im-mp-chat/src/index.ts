/**
 * Public surface of the IM mini program chat capability.
 *
 * Re-exports the view types, services, stores, route contributions, and
 * locale registry the root runtime bundle and the platform pages consume.
 * The capability owns no SDK client: services take an injected resolver.
 */
export * from "./types/chatTypes";
export * from "./services/index";
export * from "./state/index";
export * from "./routes/routeContributions";
export * from "./i18n/index";

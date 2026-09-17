/**
 * Public surface of the IM mini program shell package.
 *
 * The shell owns route placement/validation, the tab bar projection, the auth
 * guard decision, and the session/login screen copy. It owns no SDK client and
 * no business state: capability packages contribute routes and services, the
 * root bootstrap owns clients and sessions.
 */
export * from "./navigation/routeContribution";
export * from "./navigation/routePlacement";
export * from "./navigation/shellRoutes";
export * from "./navigation/tabBarProjection";
export * from "./auth/authGate";
export * from "./i18n/index";

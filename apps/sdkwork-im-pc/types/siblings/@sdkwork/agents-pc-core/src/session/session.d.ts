import type { IamAppContext } from '@sdkwork/iam-contracts';
import type { AuthTokenManager, Interceptors } from '@sdkwork/sdk-common';
export interface SdkworkChatSessionUser {
    avatar?: string;
    chatId?: string;
    displayName?: string;
    email?: string;
    id?: string | number;
    name?: string;
    nickname?: string;
    phone?: string;
    userId?: string;
    username?: string;
}
export interface SdkworkChatSessionTokens {
    accessToken?: string;
    authToken?: string;
    refreshToken?: string;
}
export interface SdkworkChatAppContext extends Partial<IamAppContext> {
    actorId?: string;
    actorKind?: string;
    appId: string;
    deviceId?: string;
    tenantId: string;
    userId: string;
}
export interface SdkworkChatSession extends SdkworkChatSessionTokens {
    context?: SdkworkChatAppContext;
    expiresAt?: number;
    sessionId?: string;
    user?: SdkworkChatSessionUser;
}
export interface SdkworkChatSessionChangedDetail {
    session: SdkworkChatSession | null;
}
export type SdkworkChatRequestContext = Partial<SdkworkChatAppContext>;
export declare const SDKWORK_AGENTS_PC_SESSION_CHANGED_EVENT = "sdkwork-agents-pc:auth-session-changed";
export declare function hydrateAppSdkSessionFromSecureStorage(): Promise<void>;
export declare function normalizeSdkworkChatSessionUser(value: unknown): SdkworkChatSessionUser | undefined;
export declare function readAppSdkSessionTokens(): SdkworkChatSession | null;
export declare function persistAppSdkSessionTokens(session: SdkworkChatSession): SdkworkChatSession;
export declare function applyAppSdkSessionTokens(session: SdkworkChatSession): SdkworkChatSession;
export declare function clearAppSdkSessionTokens(): void;
export declare function resolveAppSdkAccessToken(session?: SdkworkChatSession | null): string | undefined;
export declare function resolveAppSdkAuthToken(session?: SdkworkChatSession | null): string | undefined;
export declare function resolveAppSdkRefreshToken(session?: SdkworkChatSession | null): string | undefined;
export declare function resolveAppSdkTenantId(session?: SdkworkChatSession | null): string | undefined;
export declare function resolveAppSdkOrganizationId(session?: SdkworkChatSession | null): string | undefined;
export declare function resolveAppSdkUserId(session?: SdkworkChatSession | null): string | undefined;
export declare function resolveAppSdkSessionId(session?: SdkworkChatSession | null): string | undefined;
export declare function createSdkworkChatRequestContext(session?: SdkworkChatSession | null): SdkworkChatRequestContext | undefined;
export declare function createSdkworkChatRequestContextInterceptors(_sessionOrReader?: SdkworkChatSession | null | (() => SdkworkChatSession | null)): Interceptors;
export declare function createSdkworkChatSessionTokenManager(sessionOrReader?: SdkworkChatSession | null | (() => SdkworkChatSession | null)): AuthTokenManager;
export declare function syncSdkworkChatGlobalTokenManager(session?: SdkworkChatSession | null): void;
export declare function getSdkworkChatGlobalTokenManager(): AuthTokenManager;
export declare function isAppSdkSessionExpired(session?: SdkworkChatSession | null): boolean;
export declare function isAppSdkSessionAuthenticated(session?: SdkworkChatSession | null): boolean;

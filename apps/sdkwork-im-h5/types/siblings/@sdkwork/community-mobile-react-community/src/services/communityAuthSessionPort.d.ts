export interface CommunityAuthSessionPort {
    getCurrentUser(): unknown;
}
export declare function configureCommunityAuthSessionPort(port: CommunityAuthSessionPort): void;
export declare function getCommunityCurrentUser(): unknown;

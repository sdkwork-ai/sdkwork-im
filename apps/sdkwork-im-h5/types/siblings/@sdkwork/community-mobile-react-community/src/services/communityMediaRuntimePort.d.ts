/**
 * Host-injectable media runtime port for the community UI.
 *
 * Post images are uploaded by the host through the platform drive uploader
 * (the standard IM H5 pattern: `uploader.uploadImage` → `drive://` URL), then
 * stored on the backend entry as media URLs. Hosts without a drive client
 * leave the port unconfigured; the UI hides the image picker instead of
 * fabricating local-only media.
 */
export interface CommunityMediaRuntimePort {
    /** Uploads images and returns their backend-addressable URLs. */
    uploadImages(files: File[]): Promise<string[]>;
}
export declare function configureCommunityMediaRuntimePort(port: CommunityMediaRuntimePort): void;
export declare function resetCommunityMediaRuntimePort(): void;
export declare function isCommunityMediaRuntimeConfigured(): boolean;
export declare function getCommunityMediaRuntime(): CommunityMediaRuntimePort;

/**
 * IM H5 company (企业中心) runtime port wiring.
 *
 * Binds the shared `@sdkwork/company-mobile-react-enterprise` package to the
 * IM host:
 *
 * - `configureCompanyRuntimePort` switches the package to the generated
 *   Company App SDK port constructed from the IM gateway base URL and the
 *   shared H5 token manager. Without this binding the enterprise center pages
 *   fail closed with `CompanyCapabilityUnavailableError`;
 * - `configureCompanyMediaRuntimePort` uploads enterprise join logos and
 *   banners through the shared drive upload-image service (the declared
 *   `IM_H5_COMPANY_MEDIA_UPLOAD` intent) and resolves stored `drive://` URIs
 *   into short-lived download-grant URLs for display — the same pattern the
 *   community media port uses. Without it the join form's pick affordances
 *   refuse with a hint instead of persisting local-only media.
 */

import {
  configureCompanyMediaRuntimePort,
  configureCompanyRuntimePort,
} from '@sdkwork/company-mobile-react-enterprise';
import { getSdkClients } from './sdkClients';
import { createDriveUploadImageService } from '@sdkwork/drive-upload-image-core';
import { getDriveAppSdkClientWithSession, IM_H5_COMPANY_MEDIA_UPLOAD } from '@sdkwork/im-h5-core/sdk';

let bootstrapped = false;

export function bootstrapImCompanyH5Port(): void {
  if (bootstrapped) {
    return;
  }
  bootstrapped = true;

  configureCompanyRuntimePort(getSdkClients().companyAppSdkPort);

  configureCompanyMediaRuntimePort({
    async uploadImages(files: File[]): Promise<string[]> {
      const client = getDriveAppSdkClientWithSession();
      const imageService = createDriveUploadImageService({
        uploader: client.uploader,
        declaration: IM_H5_COMPANY_MEDIA_UPLOAD,
      });
      const urls: string[] = [];
      for (const file of files) {
        const value = await imageService.upload({
          file,
          appResourceId: 'company-enterprise',
        });
        urls.push(value.uri);
      }
      return urls;
    },
    async resolveDisplayUrl(uri: string): Promise<string | null> {
      if (!uri.startsWith('drive://')) {
        return uri;
      }
      const matched = /^drive:\/\/spaces\/([^/]+)\/nodes\/([^/?#]+)/.exec(uri);
      const nodeId = matched?.[2];
      if (!nodeId) {
        return null;
      }
      const client = getDriveAppSdkClientWithSession();
      const grant = await client.drive.downloadGrants.create(nodeId, {
        requestedTtlSeconds: 900,
      });
      const downloadUrl =
        (grant as { downloadUrl?: unknown; data?: { downloadUrl?: unknown } }).downloadUrl ??
        (grant as { data?: { downloadUrl?: unknown } }).data?.downloadUrl;
      return typeof downloadUrl === 'string' && downloadUrl.startsWith('http')
        ? downloadUrl
        : null;
    },
  });
}

export function isImCompanyH5PortBootstrapped(): boolean {
  return bootstrapped;
}

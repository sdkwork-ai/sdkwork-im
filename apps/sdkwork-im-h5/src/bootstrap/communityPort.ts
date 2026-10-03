/**
 * IM H5 community (圈子) runtime port wiring.
 *
 * Binds the shared `@sdkwork/community-mobile-react-community` package to the
 * IM host:
 *
 * - importing `@sdkwork/im-h5-community` runs its side effect that binds the
 *   IM auth session port (current-user lookup for the payment sheet);
 * - `configureCommunityRuntimePort` switches the package to the generated
 *   Community App SDK port constructed from the IM gateway base URL and the
 *   shared H5 token manager;
 * - `configureCommunityOrderRuntime` routes circle membership order creation
 *   through the IM-composed order App SDK (`memberships.orders.create`) so
 *   the whole purchase flow settles on sdkwork-order. The official cashier
 *   (`configureOrderMobileRuntime`) is already composed by the host.
 */

import '@sdkwork/im-h5-community';
import {
  configureCommunityFeedsPort,
  configureCommunityMediaRuntimePort,
  configureCommunityOrderRuntime,
  configureCommunityRuntimePort,
  type CreateCircleMembershipOrderOptions,
  type CircleMembershipOrder,
} from '@sdkwork/community-mobile-react-community';
import { getSdkClients } from './sdkClients';
import { createDriveUploadImageService } from '@sdkwork/drive-upload-image-core';
import { getDriveAppSdkClientWithSession, IM_H5_COMMUNITY_POST_UPLOAD } from '@sdkwork/im-h5-core/sdk';
import { uuid } from '@sdkwork/utils/id';


function createIdempotencyKey(): string {
  return uuid();
}

let bootstrapped = false;

export function bootstrapImCommunityH5Port(): void {
  if (bootstrapped) {
    return;
  }
  bootstrapped = true;

  configureCommunityRuntimePort(getSdkClients().communityAppSdkPort);

  // Circle post/resource feeds read through the standard feeds stream system
  // (`community-{circleId}` / `community-{circleId}-resources` streams, open
  // surface) instead of the deprecated community feed.list surface.
  configureCommunityFeedsPort(getSdkClients().feedsOpenSdkClient);

  // Post images upload through the shared drive upload-image service (same
  // declaration as chat media); the backend stores the returned drive:// URLs
  // on the entry. Circle covers/avatars reuse the port and resolve stored
  // drive:// URIs into short-lived download-grant URLs for display.
  configureCommunityMediaRuntimePort({
    async uploadImages(files: File[]): Promise<string[]> {
      const client = getDriveAppSdkClientWithSession();
      const imageService = createDriveUploadImageService({
        uploader: client.uploader,
        declaration: IM_H5_COMMUNITY_POST_UPLOAD,
      });
      const urls: string[] = [];
      for (const file of files) {
        const value = await imageService.upload({
          file,
          appResourceId: 'community',
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

  configureCommunityOrderRuntime({
    async createMembershipOrder(
      options: CreateCircleMembershipOrderOptions,
    ): Promise<CircleMembershipOrder> {
      const result = await getSdkClients().orderAppSdkClient.memberships.orders.create(
        {
          action: 'purchase',
          packageId: options.packageId,
          paymentMethod: options.paymentMethod,
          paymentProduct: 'mobile_cashier_h5',
          source: options.source ?? 'community-circle',
        },
        { idempotencyKey: createIdempotencyKey() },
      );
      return {
        orderId: result.orderId,
        orderNo: result.orderNo,
        amount: result.amount,
        cashierUrl: result.cashierUrl,
      };
    },
  });
}

export function isImCommunityH5PortBootstrapped(): boolean {
  return bootstrapped;
}

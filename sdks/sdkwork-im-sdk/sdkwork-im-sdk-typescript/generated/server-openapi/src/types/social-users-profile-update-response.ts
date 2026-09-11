import type { SocialUserProfileView } from './social-user-profile-view';

export interface SocialUsersProfileUpdateResponse {
  code: 0;
  data: unknown & { item: SocialUserProfileView; };
  /** Server-owned request correlation id. */
  traceId: string;
}

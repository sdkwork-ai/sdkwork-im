import type { SocialUserSettingsView } from './social-user-settings-view';

export interface SocialUsersSettingsUpdateResponse {
  code: 0;
  data: unknown & { item: SocialUserSettingsView; };
  /** Server-owned request correlation id. */
  traceId: string;
}

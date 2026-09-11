export interface SocialUserProfileView {
  userId: string;
  imNickname?: string | null;
  imAvatarUrl?: string | null;
  imStatusMessage?: string | null;
  imOnlineStatus: string;
  lastActiveAt?: string | null;
}

import type { MessageFavoriteType } from './message-favorite-type';

export interface MessageFavoriteView {
  tenantId: string;
  principalKind: string;
  principalId: string;
  favoriteId: string;
  favoriteType: MessageFavoriteType;
  conversationId: string;
  messageId: string;
  messageSeq: string;
  title: string;
  contentPreview: string;
  sourceDisplayName: string;
  favoritedAt: string;
}

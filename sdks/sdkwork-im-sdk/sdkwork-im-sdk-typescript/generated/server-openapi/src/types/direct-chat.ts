export interface DirectChat {
  tenantId: string;
  directChatId: string;
  leftActorId: string;
  rightActorId: string;
  pairHash: string;
  status: 'active' | 'archived' | 'closed';
  conversationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

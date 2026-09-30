export interface PostMessageResult {
  messageId: string;
  messageSeq: string;
  eventId: string;
  requestKey?: string;
  deliveryStatus: 'applied' | 'replayed';
  proofVersion?: string;
}

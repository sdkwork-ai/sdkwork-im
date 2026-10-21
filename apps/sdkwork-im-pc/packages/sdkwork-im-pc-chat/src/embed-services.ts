/**
 * Service entry for hosts that own one IM surface but must observe IM data
 * outside React (unread badges, navigation, presence).
 *
 * The root entry also exports the standalone application shell; this entry
 * keeps a host that only needs the services free of component imports.
 */

export { chatService } from './services/ChatService';
export { contactService } from './services/ContactService';

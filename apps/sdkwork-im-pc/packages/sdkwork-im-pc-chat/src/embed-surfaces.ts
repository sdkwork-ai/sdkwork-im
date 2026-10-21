/**
 * Embedding surface entry for hosts that mount one part of the IM product UI.
 *
 * The root entry exports the standalone application shell and every service it
 * wires; a host that only needs the conversation list, one conversation, or the
 * contacts directory imports this entry so the shell, its capability modules,
 * and the call/modals chrome stay out of the host bundle.
 */

export { ChatList } from './components/ChatList';
export { ChatWindow } from './components/ChatWindow';
export { ToastContainer } from './components/Toast';
export { ContactsView } from './pages/ContactsView';
export { chatService } from './services/ChatService';
export { contactService } from './services/ContactService';
export { imPcSurfaceI18n } from './i18n/base';

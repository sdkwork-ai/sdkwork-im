/**
 * Chrome primitives for an embedded surface tree: the surface translation
 * instance and the toast container.
 *
 * Kept separate from `embed-surfaces` so a host that mounts one surface does
 * not compile the conversation components it does not use.
 */

export { ToastContainer } from './components/Toast';
export { imPcSurfaceI18n } from './i18n/base';

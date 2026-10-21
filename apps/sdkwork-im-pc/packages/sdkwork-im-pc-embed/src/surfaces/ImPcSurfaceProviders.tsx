import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { imPcSurfaceI18n, ToastContainer } from '../../../sdkwork-im-pc-chat/src/embed-chrome';

/** Props of the shared embedded-surface provider. */
export interface ImPcSurfaceProvidersProps {
  /** One or more embedded surfaces. */
  children: ReactNode;
}

/**
 * Provide the IM translation context and the notification host once around a
 * group of embedded surfaces.
 *
 * The host mounts this wrapper once per surface tree so the conversation list
 * and the conversation pane share one translator and one toast container.
 * @param props the surfaces to wrap.
 * @returns the themed, localized surface container.
 */
export function ImPcSurfaceProviders({ children }: ImPcSurfaceProvidersProps): ReactNode {
  return (
    <I18nextProvider i18n={imPcSurfaceI18n}>
      <div className="flex h-full min-h-0 w-full bg-[#181818] text-gray-200">
        {children}
        <ToastContainer />
      </div>
    </I18nextProvider>
  );
}

import { createInstance, type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  SDKWORK_IM_PC_LANGUAGE_CHANGED_EVENT,
  resolvePersistedLanguage,
} from '@sdkwork/im-pc-commons';
import enUSAgent from './en-US/communication/im-pc-chat/agent.json';
import enUSChat from './en-US/communication/im-pc-chat/chat.json';
import enUSContacts from './en-US/communication/im-pc-chat/contacts.json';
import enUSFavorites from './en-US/communication/im-pc-chat/favorites.json';
import enUSProfile from './en-US/communication/im-pc-chat/profile.json';
import enUSScanQr from './en-US/communication/im-pc-chat/scan-qr.json';
import enUSSettingsModal from './en-US/communication/im-pc-chat/settings-modal.json';
import enUSSidebar from './en-US/communication/im-pc-chat/sidebar.json';
import zhCNAgent from './zh-CN/communication/im-pc-chat/agent.json';
import zhCNChat from './zh-CN/communication/im-pc-chat/chat.json';
import zhCNContacts from './zh-CN/communication/im-pc-chat/contacts.json';
import zhCNFavorites from './zh-CN/communication/im-pc-chat/favorites.json';
import zhCNProfile from './zh-CN/communication/im-pc-chat/profile.json';
import zhCNScanQr from './zh-CN/communication/im-pc-chat/scan-qr.json';
import zhCNSettingsModal from './zh-CN/communication/im-pc-chat/settings-modal.json';
import zhCNSidebar from './zh-CN/communication/im-pc-chat/sidebar.json';

/**
 * Translation resources of the conversation and contacts surfaces.
 *
 * Commerce resources (token plan, membership checkout) are owned by the
 * standalone application's extra tabs and stay out of the embedding surfaces,
 * so a host that mounts only chat and contacts does not carry that closure.
 */
export const baseZhCN = {
  ...zhCNSidebar,
  ...zhCNAgent,
  ...zhCNProfile,
  ...zhCNContacts,
  ...zhCNFavorites,
  ...zhCNSettingsModal,
  ...zhCNChat,
  ...zhCNScanQr,
};

/** English counterpart of {@link baseZhCN}. */
export const baseEnUS = {
  ...enUSSidebar,
  ...enUSAgent,
  ...enUSProfile,
  ...enUSContacts,
  ...enUSFavorites,
  ...enUSSettingsModal,
  ...enUSChat,
  ...enUSScanQr,
};

const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US'] as const;
/** Languages the IM PC surfaces translate. */
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Narrow an arbitrary language tag to a supported one.
 * @param value the candidate language tag.
 * @returns the supported tag, defaulting to Simplified Chinese.
 */
export function normalizeLanguage(value: unknown): SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
    ? value as SupportedLanguage
    : 'zh-CN';
}

/**
 * Resolve the language the IM product UI should start in.
 * @returns the persisted supported language, defaulting to Simplified Chinese.
 */
export function resolveInitialLanguage(): SupportedLanguage {
  return resolvePersistedLanguage(SUPPORTED_LANGUAGES, 'zh-CN');
}

/** Translation resources for one supported language. */
export type ImPcTranslationResources = Record<SupportedLanguage, Record<string, unknown>>;

/**
 * Create an IM translation instance for a surface tree.
 *
 * Every instance follows the product's language-change event, so a host that
 * switches the language once updates the standalone application and every
 * embedded instance.
 * @param resources the translation resources to install.
 * @returns the initialized i18next instance.
 */
export function createImPcI18n(resources: ImPcTranslationResources): I18nInstance {
  const instance = createInstance();
  void instance
    .use(initReactI18next)
    .init({
      resources: {
        'zh-CN': { translation: resources['zh-CN'] },
        'en-US': { translation: resources['en-US'] },
      },
      lng: resolveInitialLanguage(),
      fallbackLng: 'zh-CN',
      interpolation: {
        escapeValue: false,
      },
    });

  if (typeof window !== 'undefined') {
    window.addEventListener(SDKWORK_IM_PC_LANGUAGE_CHANGED_EVENT, (event) => {
      const nextLanguage = normalizeLanguage((event as CustomEvent<{ lang?: string }>).detail?.lang);
      if (instance.language !== nextLanguage) {
        void instance.changeLanguage(nextLanguage);
      }
    });
  }

  return instance;
}

/** Translation instance shared by the embedded conversation and contacts surfaces. */
export const imPcSurfaceI18n = createImPcI18n({
  'zh-CN': baseZhCN,
  'en-US': baseEnUS,
});

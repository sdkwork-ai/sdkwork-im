import {
  sdkworkSubscriptionCheckoutResources,
} from '@sdkwork/membership-pc-subscription/catalog';
import { imTokenPlanI18nResources } from '@sdkwork/im-pc-token-plan/i18n';
import enUSTokenPlan from './en-US/communication/im-pc-chat/token-plan.json';
import zhCNTokenPlan from './zh-CN/communication/im-pc-chat/token-plan.json';
import {
  baseEnUS,
  baseZhCN,
  createImPcI18n,
  normalizeLanguage,
  resolveInitialLanguage,
} from './base';

const zhCN = {
  ...sdkworkSubscriptionCheckoutResources['zh-CN'],
  ...imTokenPlanI18nResources['zh-CN'],
  ...zhCNTokenPlan,
  ...baseZhCN,
};

const enUS = {
  ...sdkworkSubscriptionCheckoutResources['en-US'],
  ...imTokenPlanI18nResources['en-US'],
  ...enUSTokenPlan,
  ...baseEnUS,
};

const i18n = createImPcI18n({ 'zh-CN': zhCN, 'en-US': enUS });

export { normalizeLanguage, resolveInitialLanguage };
export default i18n;

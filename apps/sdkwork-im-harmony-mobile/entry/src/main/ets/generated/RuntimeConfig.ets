/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Source: config/app/runtime-env.<profile-id>.json
 * Generator: scripts/generate-harmony-runtime-config.mjs
 *
 * `ENVIRONMENT_SPEC.md` section 5.1.3 requires a native HarmonyOS root to package exactly
 * one selected non-secret runtime resource. A HAP cannot read the tracked JSON at runtime,
 * so the ten documents are projected into this module and the selection happens here.
 * Regenerate with: node scripts/generate-harmony-runtime-config.mjs
 */
import { type ImHarmonyRuntimeEnvDocument } from '../bootstrap/EnvironmentContract';

export const IM_HARMONY_DEFAULT_PROFILE_ID: string = "standalone.development";

/** Every tracked runtime document, ordered by profile id. */
export const IM_HARMONY_RUNTIME_ENV_DOCUMENTS: ImHarmonyRuntimeEnvDocument[] = [
  {
    environment: "demo",
    deploymentProfile: "cloud",
    profileId: "cloud.demo",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "https://api-demo.sdkwork.com;https://api-demo.birdcoder.com;https://api-demo.noaper.com;https://api-demo.dtupay.com;https://api-demo.sdkwork.cn;https://api-demo.birdcoder.cn;https://api-demo.noaper.cn;https://api-demo.dtupay.cn;https://api-demo.skubc.com;https://api-demo.skubc.cn;https://api-demo.zowalk.com;https://api-demo.zowalk.cn;https://api-demo.offer86.com;https://api-demo.offer86.cn;https://api-demo.86offer.com;https://api-demo.86offer.cn",
      platformApiGatewayHttpUrl: "https://api-demo.sdkwork.com;https://api-demo.birdcoder.com;https://api-demo.noaper.com;https://api-demo.dtupay.com;https://api-demo.sdkwork.cn;https://api-demo.birdcoder.cn;https://api-demo.noaper.cn;https://api-demo.dtupay.cn;https://api-demo.skubc.com;https://api-demo.skubc.cn;https://api-demo.zowalk.com;https://api-demo.zowalk.cn;https://api-demo.offer86.com;https://api-demo.offer86.cn;https://api-demo.86offer.com;https://api-demo.86offer.cn",
      applicationPublicHttpUrl: "https://im-demo.sdkwork.com",
      applicationPublicWebsocketUrl: "wss://api-demo.sdkwork.com",
    },
    appbase: {
      appApiBaseUrl: "https://api-demo.sdkwork.com;https://api-demo.birdcoder.com;https://api-demo.noaper.com;https://api-demo.dtupay.com;https://api-demo.sdkwork.cn;https://api-demo.birdcoder.cn;https://api-demo.noaper.cn;https://api-demo.dtupay.cn;https://api-demo.skubc.com;https://api-demo.skubc.cn;https://api-demo.zowalk.com;https://api-demo.zowalk.cn;https://api-demo.offer86.com;https://api-demo.offer86.cn;https://api-demo.86offer.com;https://api-demo.86offer.cn",
      loginUrl: "https://im-demo.sdkwork.com",
    },
  },
  {
    environment: "development",
    deploymentProfile: "cloud",
    profileId: "cloud.development",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "http://127.0.0.1:3900",
      platformApiGatewayHttpUrl: "http://127.0.0.1:3900",
      applicationPublicHttpUrl: "http://im-dev.sdkwork.com:3801",
      applicationPublicWebsocketUrl: "wss://api-dev.sdkwork.com",
    },
    appbase: {
      appApiBaseUrl: "http://127.0.0.1:3900",
      loginUrl: "http://im-dev.sdkwork.com:3801",
    },
  },
  {
    environment: "production",
    deploymentProfile: "cloud",
    profileId: "cloud.production",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "https://api.sdkwork.com;https://api.birdcoder.com;https://api.dtupay.com;https://api.noaper.com;https://api.sdkwork.cn;https://api.birdcoder.cn;https://api.dtupay.cn;https://api.noaper.cn;https://api.skubc.com;https://api.skubc.cn;https://api.zowalk.com;https://api.zowalk.cn;https://api.offer86.com;https://api.offer86.cn;https://api.86offer.com;https://api.86offer.cn",
      platformApiGatewayHttpUrl: "https://api.sdkwork.com;https://api.birdcoder.com;https://api.dtupay.com;https://api.noaper.com;https://api.sdkwork.cn;https://api.birdcoder.cn;https://api.dtupay.cn;https://api.noaper.cn;https://api.skubc.com;https://api.skubc.cn;https://api.zowalk.com;https://api.zowalk.cn;https://api.offer86.com;https://api.offer86.cn;https://api.86offer.com;https://api.86offer.cn",
      applicationPublicHttpUrl: "https://im.sdkwork.com",
      applicationPublicWebsocketUrl: "wss://api.sdkwork.com",
    },
    appbase: {
      appApiBaseUrl: "https://api.sdkwork.com;https://api.birdcoder.com;https://api.dtupay.com;https://api.noaper.com;https://api.sdkwork.cn;https://api.birdcoder.cn;https://api.dtupay.cn;https://api.noaper.cn;https://api.skubc.com;https://api.skubc.cn;https://api.zowalk.com;https://api.zowalk.cn;https://api.offer86.com;https://api.offer86.cn;https://api.86offer.com;https://api.86offer.cn",
      loginUrl: "https://im.sdkwork.com",
    },
  },
  {
    environment: "staging",
    deploymentProfile: "cloud",
    profileId: "cloud.staging",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "https://api-staging.sdkwork.com;https://api-staging.birdcoder.com;https://api-staging.dtupay.com;https://api-staging.noaper.com;https://api-staging.sdkwork.cn;https://api-staging.birdcoder.cn;https://api-staging.dtupay.cn;https://api-staging.noaper.cn;https://api-staging.skubc.com;https://api-staging.skubc.cn;https://api-staging.zowalk.com;https://api-staging.zowalk.cn;https://api-staging.offer86.com;https://api-staging.offer86.cn;https://api-staging.86offer.com;https://api-staging.86offer.cn",
      platformApiGatewayHttpUrl: "https://api-staging.sdkwork.com;https://api-staging.birdcoder.com;https://api-staging.dtupay.com;https://api-staging.noaper.com;https://api-staging.sdkwork.cn;https://api-staging.birdcoder.cn;https://api-staging.dtupay.cn;https://api-staging.noaper.cn;https://api-staging.skubc.com;https://api-staging.skubc.cn;https://api-staging.zowalk.com;https://api-staging.zowalk.cn;https://api-staging.offer86.com;https://api-staging.offer86.cn;https://api-staging.86offer.com;https://api-staging.86offer.cn",
      applicationPublicHttpUrl: "https://im-staging.sdkwork.com",
      applicationPublicWebsocketUrl: "wss://api-staging.sdkwork.com",
    },
    appbase: {
      appApiBaseUrl: "https://api-staging.sdkwork.com;https://api-staging.birdcoder.com;https://api-staging.dtupay.com;https://api-staging.noaper.com;https://api-staging.sdkwork.cn;https://api-staging.birdcoder.cn;https://api-staging.dtupay.cn;https://api-staging.noaper.cn;https://api-staging.skubc.com;https://api-staging.skubc.cn;https://api-staging.zowalk.com;https://api-staging.zowalk.cn;https://api-staging.offer86.com;https://api-staging.offer86.cn;https://api-staging.86offer.com;https://api-staging.86offer.cn",
      loginUrl: "https://im-staging.sdkwork.com",
    },
  },
  {
    environment: "test",
    deploymentProfile: "cloud",
    profileId: "cloud.test",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "https://api-test.sdkwork.com;https://api-test.birdcoder.com;https://api-test.dtupay.com;https://api-test.noaper.com;https://api-test.sdkwork.cn;https://api-test.birdcoder.cn;https://api-test.dtupay.cn;https://api-test.noaper.cn;https://api-test.skubc.com;https://api-test.skubc.cn;https://api-test.zowalk.com;https://api-test.zowalk.cn;https://api-test.offer86.com;https://api-test.offer86.cn;https://api-test.86offer.com;https://api-test.86offer.cn",
      platformApiGatewayHttpUrl: "https://api-test.sdkwork.com;https://api-test.birdcoder.com;https://api-test.dtupay.com;https://api-test.noaper.com;https://api-test.sdkwork.cn;https://api-test.birdcoder.cn;https://api-test.dtupay.cn;https://api-test.noaper.cn;https://api-test.skubc.com;https://api-test.skubc.cn;https://api-test.zowalk.com;https://api-test.zowalk.cn;https://api-test.offer86.com;https://api-test.offer86.cn;https://api-test.86offer.com;https://api-test.86offer.cn",
      applicationPublicHttpUrl: "https://im-test.sdkwork.com",
      applicationPublicWebsocketUrl: "wss://api-test.sdkwork.com",
    },
    appbase: {
      appApiBaseUrl: "https://api-test.sdkwork.com;https://api-test.birdcoder.com;https://api-test.dtupay.com;https://api-test.noaper.com;https://api-test.sdkwork.cn;https://api-test.birdcoder.cn;https://api-test.dtupay.cn;https://api-test.noaper.cn;https://api-test.skubc.com;https://api-test.skubc.cn;https://api-test.zowalk.com;https://api-test.zowalk.cn;https://api-test.offer86.com;https://api-test.offer86.cn;https://api-test.86offer.com;https://api-test.86offer.cn",
      loginUrl: "https://im-test.sdkwork.com",
    },
  },
  {
    environment: "demo",
    deploymentProfile: "standalone",
    profileId: "standalone.demo",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "http://im-demo.sdkwork.com:18073",
      platformApiGatewayHttpUrl: "http://im-demo.sdkwork.com:18073",
      applicationPublicHttpUrl: "http://im-demo.sdkwork.com:18073",
      applicationPublicWebsocketUrl: "ws://im-demo.sdkwork.com:18073",
    },
    appbase: {
      appApiBaseUrl: "http://im-demo.sdkwork.com:18073",
      loginUrl: "http://im-demo.sdkwork.com:18073",
    },
  },
  {
    environment: "development",
    deploymentProfile: "standalone",
    profileId: "standalone.development",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "http://127.0.0.1:18089",
      platformApiGatewayHttpUrl: "http://127.0.0.1:18089",
      applicationPublicHttpUrl: "http://127.0.0.1:18089",
      applicationPublicWebsocketUrl: "ws://127.0.0.1:18089",
    },
    appbase: {
      appApiBaseUrl: "http://127.0.0.1:18089",
      loginUrl: "http://127.0.0.1:18089",
    },
  },
  {
    environment: "production",
    deploymentProfile: "standalone",
    profileId: "standalone.production",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "http://127.0.0.1:18079",
      platformApiGatewayHttpUrl: "http://127.0.0.1:18079",
      applicationPublicHttpUrl: "http://127.0.0.1:18079",
      applicationPublicWebsocketUrl: "ws://127.0.0.1:18079",
    },
    appbase: {
      appApiBaseUrl: "http://127.0.0.1:18079",
      loginUrl: "http://127.0.0.1:18079",
    },
  },
  {
    environment: "staging",
    deploymentProfile: "standalone",
    profileId: "standalone.staging",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "http://127.0.0.1:18079",
      platformApiGatewayHttpUrl: "http://127.0.0.1:18079",
      applicationPublicHttpUrl: "http://127.0.0.1:18079",
      applicationPublicWebsocketUrl: "ws://127.0.0.1:18079",
    },
    appbase: {
      appApiBaseUrl: "http://127.0.0.1:18079",
      loginUrl: "http://127.0.0.1:18079",
    },
  },
  {
    environment: "test",
    deploymentProfile: "standalone",
    profileId: "standalone.test",
    runtimeTarget: "harmony-native",
    im: {
      apiBaseUrl: "http://127.0.0.1:18079",
      platformApiGatewayHttpUrl: "http://127.0.0.1:18079",
      applicationPublicHttpUrl: "http://127.0.0.1:18079",
      applicationPublicWebsocketUrl: "ws://127.0.0.1:18079",
    },
    appbase: {
      appApiBaseUrl: "http://127.0.0.1:18079",
      loginUrl: "http://127.0.0.1:18079",
    },
  },
];

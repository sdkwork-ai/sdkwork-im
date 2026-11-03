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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InNhYXMiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJjbG91ZCIsImVudmlyb25tZW50IjoiZGVtbyIsImV4cCI6NDEwMjQ0NDgwMCwiaWF0IjoxNzY3MjI1NjAwLCJpc3MiOiJzZGt3b3JrLWlhbS1wdWJsaWMiLCJsb2dpbl9zY29wZSI6IlRFTkFOVCIsIm9yZ2FuaXphdGlvbl9pZCI6IjAiLCJwZXJtaXNzaW9uX3Njb3BlIjpbImlhbTpzZWxmIl0sInJ1bnRpbWVfdGFyZ2V0IjoiaGFybW9ueS1uYXRpdmUiLCJzZXNzaW9uX2lkIjoiYm9vdHN0cmFwLXB1YmxpYy1zZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlLWNsb3VkLmRlbW8iLCJ0ZW5hbnRfaWQiOiIxMDAwMDEiLCJ0b2tlbl9jbGFzcyI6ImFwcGxpY2F0aW9uIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsInRva2VuX3ZlcnNpb24iOjEsInVzZXJfaWQiOiIwIn0.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InNhYXMiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJjbG91ZCIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJleHAiOjQxMDI0NDQ4MDAsImlhdCI6MTc2NzIyNTYwMCwiaXNzIjoic2Rrd29yay1pYW0tcHVibGljIiwibG9naW5fc2NvcGUiOiJURU5BTlQiLCJvcmdhbml6YXRpb25faWQiOiIwIiwicGVybWlzc2lvbl9zY29wZSI6WyJpYW06c2VsZiJdLCJydW50aW1lX3RhcmdldCI6Imhhcm1vbnktbmF0aXZlIiwic2Vzc2lvbl9pZCI6ImJvb3RzdHJhcC1wdWJsaWMtc2Rrd29yay1pbS1oYXJtb255LW1vYmlsZS1jbG91ZC5kZXZlbG9wbWVudCIsInRlbmFudF9pZCI6IjEwMDAwMSIsInRva2VuX2NsYXNzIjoiYXBwbGljYXRpb24iLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidG9rZW5fdmVyc2lvbiI6MSwidXNlcl9pZCI6IjAifQ.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InNhYXMiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJjbG91ZCIsImVudmlyb25tZW50IjoicHJvZHVjdGlvbiIsImV4cCI6NDEwMjQ0NDgwMCwiaWF0IjoxNzY3MjI1NjAwLCJpc3MiOiJzZGt3b3JrLWlhbS1wdWJsaWMiLCJsb2dpbl9zY29wZSI6IlRFTkFOVCIsIm9yZ2FuaXphdGlvbl9pZCI6IjAiLCJwZXJtaXNzaW9uX3Njb3BlIjpbImlhbTpzZWxmIl0sInJ1bnRpbWVfdGFyZ2V0IjoiaGFybW9ueS1uYXRpdmUiLCJzZXNzaW9uX2lkIjoiYm9vdHN0cmFwLXB1YmxpYy1zZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlLWNsb3VkLnByb2R1Y3Rpb24iLCJ0ZW5hbnRfaWQiOiIxMDAwMDEiLCJ0b2tlbl9jbGFzcyI6ImFwcGxpY2F0aW9uIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsInRva2VuX3ZlcnNpb24iOjEsInVzZXJfaWQiOiIwIn0.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InNhYXMiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJjbG91ZCIsImVudmlyb25tZW50Ijoic3RhZ2luZyIsImV4cCI6NDEwMjQ0NDgwMCwiaWF0IjoxNzY3MjI1NjAwLCJpc3MiOiJzZGt3b3JrLWlhbS1wdWJsaWMiLCJsb2dpbl9zY29wZSI6IlRFTkFOVCIsIm9yZ2FuaXphdGlvbl9pZCI6IjAiLCJwZXJtaXNzaW9uX3Njb3BlIjpbImlhbTpzZWxmIl0sInJ1bnRpbWVfdGFyZ2V0IjoiaGFybW9ueS1uYXRpdmUiLCJzZXNzaW9uX2lkIjoiYm9vdHN0cmFwLXB1YmxpYy1zZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlLWNsb3VkLnN0YWdpbmciLCJ0ZW5hbnRfaWQiOiIxMDAwMDEiLCJ0b2tlbl9jbGFzcyI6ImFwcGxpY2F0aW9uIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsInRva2VuX3ZlcnNpb24iOjEsInVzZXJfaWQiOiIwIn0.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InNhYXMiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJjbG91ZCIsImVudmlyb25tZW50IjoidGVzdCIsImV4cCI6NDEwMjQ0NDgwMCwiaWF0IjoxNzY3MjI1NjAwLCJpc3MiOiJzZGt3b3JrLWlhbS1wdWJsaWMiLCJsb2dpbl9zY29wZSI6IlRFTkFOVCIsIm9yZ2FuaXphdGlvbl9pZCI6IjAiLCJwZXJtaXNzaW9uX3Njb3BlIjpbImlhbTpzZWxmIl0sInJ1bnRpbWVfdGFyZ2V0IjoiaGFybW9ueS1uYXRpdmUiLCJzZXNzaW9uX2lkIjoiYm9vdHN0cmFwLXB1YmxpYy1zZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlLWNsb3VkLnRlc3QiLCJ0ZW5hbnRfaWQiOiIxMDAwMDEiLCJ0b2tlbl9jbGFzcyI6ImFwcGxpY2F0aW9uIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsInRva2VuX3ZlcnNpb24iOjEsInVzZXJfaWQiOiIwIn0.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InByaXZhdGUiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJzdGFuZGFsb25lIiwiZW52aXJvbm1lbnQiOiJkZW1vIiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE3NjcyMjU2MDAsImlzcyI6InNka3dvcmstaWFtLXB1YmxpYyIsImxvZ2luX3Njb3BlIjoiVEVOQU5UIiwib3JnYW5pemF0aW9uX2lkIjoiMCIsInBlcm1pc3Npb25fc2NvcGUiOlsiaWFtOnNlbGYiXSwicnVudGltZV90YXJnZXQiOiJoYXJtb255LW5hdGl2ZSIsInNlc3Npb25faWQiOiJib290c3RyYXAtcHVibGljLXNka3dvcmstaW0taGFybW9ueS1tb2JpbGUtc3RhbmRhbG9uZS5kZW1vIiwidGVuYW50X2lkIjoiMTAwMDAxIiwidG9rZW5fY2xhc3MiOiJhcHBsaWNhdGlvbiIsInRva2VuX3R5cGUiOiJhY2Nlc3MiLCJ0b2tlbl92ZXJzaW9uIjoxLCJ1c2VyX2lkIjoiMCJ9.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InByaXZhdGUiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJzdGFuZGFsb25lIiwiZW52aXJvbm1lbnQiOiJkZXZlbG9wbWVudCIsImV4cCI6NDEwMjQ0NDgwMCwiaWF0IjoxNzY3MjI1NjAwLCJpc3MiOiJzZGt3b3JrLWlhbS1wdWJsaWMiLCJsb2dpbl9zY29wZSI6IlRFTkFOVCIsIm9yZ2FuaXphdGlvbl9pZCI6IjAiLCJwZXJtaXNzaW9uX3Njb3BlIjpbImlhbTpzZWxmIl0sInJ1bnRpbWVfdGFyZ2V0IjoiaGFybW9ueS1uYXRpdmUiLCJzZXNzaW9uX2lkIjoiYm9vdHN0cmFwLXB1YmxpYy1zZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlLXN0YW5kYWxvbmUuZGV2ZWxvcG1lbnQiLCJ0ZW5hbnRfaWQiOiIxMDAwMDEiLCJ0b2tlbl9jbGFzcyI6ImFwcGxpY2F0aW9uIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsInRva2VuX3ZlcnNpb24iOjEsInVzZXJfaWQiOiIwIn0.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InByaXZhdGUiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJzdGFuZGFsb25lIiwiZW52aXJvbm1lbnQiOiJwcm9kdWN0aW9uIiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE3NjcyMjU2MDAsImlzcyI6InNka3dvcmstaWFtLXB1YmxpYyIsImxvZ2luX3Njb3BlIjoiVEVOQU5UIiwib3JnYW5pemF0aW9uX2lkIjoiMCIsInBlcm1pc3Npb25fc2NvcGUiOlsiaWFtOnNlbGYiXSwicnVudGltZV90YXJnZXQiOiJoYXJtb255LW5hdGl2ZSIsInNlc3Npb25faWQiOiJib290c3RyYXAtcHVibGljLXNka3dvcmstaW0taGFybW9ueS1tb2JpbGUtc3RhbmRhbG9uZS5wcm9kdWN0aW9uIiwidGVuYW50X2lkIjoiMTAwMDAxIiwidG9rZW5fY2xhc3MiOiJhcHBsaWNhdGlvbiIsInRva2VuX3R5cGUiOiJhY2Nlc3MiLCJ0b2tlbl92ZXJzaW9uIjoxLCJ1c2VyX2lkIjoiMCJ9.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InByaXZhdGUiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJzdGFuZGFsb25lIiwiZW52aXJvbm1lbnQiOiJzdGFnaW5nIiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE3NjcyMjU2MDAsImlzcyI6InNka3dvcmstaWFtLXB1YmxpYyIsImxvZ2luX3Njb3BlIjoiVEVOQU5UIiwib3JnYW5pemF0aW9uX2lkIjoiMCIsInBlcm1pc3Npb25fc2NvcGUiOlsiaWFtOnNlbGYiXSwicnVudGltZV90YXJnZXQiOiJoYXJtb255LW5hdGl2ZSIsInNlc3Npb25faWQiOiJib290c3RyYXAtcHVibGljLXNka3dvcmstaW0taGFybW9ueS1tb2JpbGUtc3RhbmRhbG9uZS5zdGFnaW5nIiwidGVuYW50X2lkIjoiMTAwMDAxIiwidG9rZW5fY2xhc3MiOiJhcHBsaWNhdGlvbiIsInRva2VuX3R5cGUiOiJhY2Nlc3MiLCJ0b2tlbl92ZXJzaW9uIjoxLCJ1c2VyX2lkIjoiMCJ9.public",
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
    accessToken: "eyJhbGciOiJub25lIiwia2lkIjoicHVibGljLWFwcC10b2tlbiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJzZGt3b3JrLWltLWhhcm1vbnktbW9iaWxlIiwiYXVkIjoic2Rrd29yay1pbS1oYXJtb255LW1vYmlsZSIsImRlcGxveW1lbnRfbW9kZSI6InByaXZhdGUiLCJkZXBsb3ltZW50X3Byb2ZpbGUiOiJzdGFuZGFsb25lIiwiZW52aXJvbm1lbnQiOiJ0ZXN0IiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE3NjcyMjU2MDAsImlzcyI6InNka3dvcmstaWFtLXB1YmxpYyIsImxvZ2luX3Njb3BlIjoiVEVOQU5UIiwib3JnYW5pemF0aW9uX2lkIjoiMCIsInBlcm1pc3Npb25fc2NvcGUiOlsiaWFtOnNlbGYiXSwicnVudGltZV90YXJnZXQiOiJoYXJtb255LW5hdGl2ZSIsInNlc3Npb25faWQiOiJib290c3RyYXAtcHVibGljLXNka3dvcmstaW0taGFybW9ueS1tb2JpbGUtc3RhbmRhbG9uZS50ZXN0IiwidGVuYW50X2lkIjoiMTAwMDAxIiwidG9rZW5fY2xhc3MiOiJhcHBsaWNhdGlvbiIsInRva2VuX3R5cGUiOiJhY2Nlc3MiLCJ0b2tlbl92ZXJzaW9uIjoxLCJ1c2VyX2lkIjoiMCJ9.public",
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

# sdkwork-im-mp-host

IM 微信小程序端的 **宿主适配层** 包（`frontend-host`）。

## 职责

本包是整个 IM 小程序族里**唯一**允许直接访问 `wx.*` 全局的地方
（`MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` §8）。

| 适配器 | 文件 | 平台 API | 消费方 |
|---|---|---|---|
| 会话存储 | `src/weixin/storage.ts` | `wx.getStorageSync` / `setStorageSync` / `removeStorageSync` | `@sdkwork/im-mp-core` 的 `ImMpSessionStorage` |
| `fetch` 垫片 | `src/weixin/fetch.ts` | `wx.request` | 生成的 IM / IAM SDK（标准 `fetch` 契约） |
| WebSocket | `src/weixin/socket.ts` | `wx.connectSocket` | IM SDK 的 `webSocketFactory` 接缝（CCP 实时） |
| 导航 / 标签栏 / 语言 | `src/weixin/navigation.ts` | `wx.navigateTo` 族、`setTabBarItem`、`getAppBaseInfo` | 根 `src/bootstrap` 与页面 |

## 为什么需要 `fetch` 垫片和 WebSocket 适配器

这两件事**不是可选的**：

1. 生成的 SDKWork SDK（`@sdkwork/im-sdk`、`@sdkwork/iam-app-sdk`）都建立在标准
   `fetch` 契约上，而微信小程序运行时**没有** `fetch`。
2. IM SDK 的 CCP 实时链路要求注入 `ImWebSocketFactory`；微信运行时的全局
   `WebSocket` 不满足该契约，不注入即抛
   `IM websocket transport is unavailable; provide ImSdkClientOptions.webSocketFactory.`。

所以：HTTP 读写（会话列表、消息、登录）靠 1；实时推送靠 2。缺 2 时 HTTP 面依旧可用，
`transportReady` 会如实反映当前模式，不假装实时可用。

## 注入式设计

每个适配器都同时提供两种入口：

```ts
createWeixinXxxAdapter(api)          // 显式注入，可单测、可在 Node 下跑
createWeixinXxxAdapterFromGlobal()   // 读 globalThis.wx，供根 bootstrap 使用
```

这样 `mp-host` 的映射逻辑可以被 `node --test` 真实覆盖，不需要模拟整个微信运行时。

## 平台前置条件（不是代码能解决的）

- `wx.connectSocket` 与 `wx.request` 的**合法域名**必须在微信公众平台后台登记：
  `request` 域名 + `socket` 域名。开发期可在开发者工具里勾选“不校验合法域名”。
- `config/mini-program/runtime-env.standalone.development.json` 里的
  `http://127.0.0.1:18089` **不能**在真机上直连，真机需改用已备案并登记域名后的
  cloud profile 地址。

## 验证

```bash
pnpm --filter @sdkwork/im-mini-program typecheck
pnpm --filter @sdkwork/im-mini-program test
```

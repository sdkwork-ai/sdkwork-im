# sdkwork-im-mp-shell

IM 微信小程序端的 **壳层** 包（`frontend-shell`）。

## 职责

| 能力 | 文件 | 说明 |
|---|---|---|
| 路由贡献契约 | `src/navigation/routeContribution.ts` | `ImMpRouteContribution` 类型 + 校验器 |
| 路由放置投影 | `src/navigation/routePlacement.ts` | 贡献 → `app.json#pages` / `#subPackages` |
| 壳自有路由 | `src/navigation/shellRoutes.ts` | 会话登录页（非业务能力页） |
| 标签栏投影 | `src/navigation/tabBarProjection.ts` | 贡献 → `wx.setTabBarItem` 入参 |
| 鉴权闸 | `src/auth/authGate.ts` | 放行 / 重定向判定，不执行登录 |

## 边界

- **不持有 SDK 客户端**：`sdkClients: []`。IM / IAM 客户端由 `@sdkwork/im-mp-core` 构造，根 `src/bootstrap` 调用。
- **不读 `wx.*` 全局**：平台 API 全部以注入形式接收（`MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` §8）。
- **不承载业务状态**：会话列表、消息列表状态属于 `@sdkwork/im-mp-chat`。

## 路由 id 契约

`<surface>.<domain>.<capability>.<screen>`，且与 PC / H5 / Flutter / HarmonyOS 根保持同一 id。
例如会话列表在四个端都是 `app.communication.chat.inbox`。

## 页面放置规则

- 标签栏页 **必须** 落在主包（`rootPackage: true`）——微信平台禁止分包页进 tabBar。
- 其余页面按分包声明：`subpackage: "package-chat"` + `pagePath: "package-chat/pages/<x>/index"`，
  投影时自动去掉分包前缀写入 `subPackages[].pages`。
- 一个 `pagePath` 只能被一个路由占用；冲突由 `validateImMpRouteContributions` 报告。

## 验证

```bash
pnpm --filter @sdkwork/im-mini-program typecheck
pnpm --filter @sdkwork/im-mini-program test
```

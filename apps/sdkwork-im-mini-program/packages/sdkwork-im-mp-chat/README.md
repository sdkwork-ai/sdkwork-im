# sdkwork-im-mp-chat

IM 微信小程序端的 **chat 能力包**（`frontend-feature`），对标 PC / H5 的 `sdkwork-im-pc-chat` /
`sdkwork-im-h5-chat`。

## 覆盖的屏幕

| 路由 id | 页面 | 分包 | 真实 SDK 调用 |
|---|---|---|---|
| `app.communication.chat.inbox` | `pages/inbox/index` | 主包（tab） | `conversations.list` |
| `app.communication.chat.conversation` | `package-chat/pages/conversation/index` | `package-chat` | `conversations.getSummary` + `listMessages` + `postText` |
| `app.communication.chat.create-group` | `package-chat/pages/create-group/index` | `package-chat` | `conversations.create` |

三个路由 id 与 H5 / PC 完全一致，因此同一屏在不同端共用一个 id。

## 分层

```
types/chatTypes.ts       视图类型 + SDK 端口 + 分页断言（无副作用，可单测）
services/                纯业务：cursor 分页、去重合并、发送校验
state/                   可观察 store，页面订阅后转发到 setData
routes/                  路由贡献（仅元数据，无 API 路径/传输细节）
i18n/<locale>/communication/chat/  authored 文案片段
```

## 明确不做的事（不发明后端不支持的行为）

- **不带媒体上传**。文本发送走 `conversations.postText`；图片/文件上传属于 H5 那条
  `chat-media-upload` 边界，本包未接线，因此**不提供**上传入口——给一个点了没反应的按钮
  比没有按钮更糟。
- **不做实时**。消息列表是 HTTP 读取；CCP 实时由根 `bootstrap` 通过 `webSocketFactory`
  接缝注入（见 `sdkwork-im-mp-host`）。未注入时页面照常可用，只是不自动刷新。
- **不做本地乐观回滚**。发送采用「服务端回显后追加」，不做临时气泡重排——那需要
  `clientMsgId` 幂等语义的完整落地，属后续。

## 分页契约

`PAGINATION_SPEC.md`：交互列表一律 cursor 分页。`assertImMpCursorPage` 对两种违约直接抛错：

- `pageInfo.mode !== "cursor"` —— offset 分页在高偏移量静默截断；
- `hasMore === true` 但没有 `nextCursor` —— 「加载更多」会永久转圈。

两者的共同点是**只有最终用户能看见**，所以按硬失败处理，不降级为警告。

## 文案键

与 PC / H5 共用键名，例如 `common.tabs.chat`、`chat.conversation.title`、
`chat.create_group.title`。缺翻译时回退到键名本身，让缺失可见而不是渲染空白。

## 验证

```bash
pnpm --filter @sdkwork/im-mini-program typecheck
pnpm --filter @sdkwork/im-mini-program test
```

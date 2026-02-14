---
summary: "TaxChat — 税务问答会话页面（通过 OpenClaw Gateway）"
read_when:
  - Using the tax-focused chat session
title: "TaxChat"
---

# TaxChat

`TaxChat` 是一个预配置的会话键（`taxchat`），用于在 Control UI 的聊天界面中进行税务相关问答。该页面本身由 Control UI 的 `Chat` 视图提供：打开 Control UI 并切换到 `taxchat` 会话键即可开始交互。

快速打开（在 Control UI 中）：

- 在 Control UI 打开后，选择 `Chat`，然后在会话下拉菜单中选择或输入 `taxchat`。
- 或者直接在 Control UI 的 URL 中附加查询字符串：`/chat?sessionKey=taxchat`（在已连接并授权的 Control UI 环境中）。

如何工作

- 页面通过 WebSocket 与本地或远端的 OpenClaw Gateway 建立连接（Control UI）。
- 你的问题会以 `taxchat` 会话的上下文发送到 Gateway，Gateway 将使用配置的模型/智能体来生成回答并将回复推回给该会话。

注意事项

- 确保 Control UI 已正确连接到 Gateway（UI 顶部状态显示 `Health: OK`）。
- 如果在远端环境使用，优先通过 Tailscale Serve 或 SSH 隧道访问 Control UI，避免将 Control UI 公开暴露。

示例：在本地 Gateway 上打开 taxchat

1. 启动 Gateway 并确保可达（示例本地地址）：

```
http://127.0.0.1:18789/
```

2. 打开 Control UI，导航到 `Chat`，在会话下拉中选择或输入 `taxchat`。

现在就可以在 `TaxChat` 会话中提问，回答会通过 OpenClaw Gateway 生成并返回。
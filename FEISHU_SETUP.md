# 飞书配置指南

## ⚠️ 安全提醒

**以下凭据为敏感信息，请妥善保管：**
- App ID: `cli_a933a4feadb81cc9`
- App Secret: `e7ScIG1itQdnQPPT4KFsZfsWxrKSXhAT`
- Verification Token: `4bcHA2FSS93WLDsKrOmKDgZ3RrV26oS0`

**请勿：**
1. 将这些凭据提交到 Git 仓库
2. 在公共渠道分享
3. 硬编码在源代码中

## 配置方式

### 方式一：环境变量（推荐用于开发）

在 `hub` 目录创建 `.env` 文件：

```bash
cd hub
# Windows PowerShell
$env:FEISHU_APP_ID="cli_a933a4feadb81cc9"
$env:FEISHU_APP_SECRET="e7ScIG1itQdnQPPT4KFsZfsWxrKSXhAT"
$env:FEISHU_VERIFICATION_TOKEN="4bcHA2FSS93WLDsKrOmKDgZ3RrV26oS0"
$env:FEISHU_ENABLED="true"
$env:FEISHU_NOTIFICATION="true"
```

或在 `~/.bashrc` / `~/.zshrc` 中添加：

```bash
export FEISHU_APP_ID="cli_a933a4feadb81cc9"
export FEISHU_APP_SECRET="e7ScIG1itQdnQPPT4KFsZfsWxrKSXhAT"
export FEISHU_VERIFICATION_TOKEN="4bcHA2FSS93WLDsKrOmKDgZ3RrV26oS0"
export FEISHU_BASE_URL="https://open.feishu.cn"  # 国内版
# export FEISHU_BASE_URL="https://open.larksuite.com"  # 国际版
export FEISHU_ENABLED="true"
export FEISHU_NOTIFICATION="true"
```

### 方式二：settings.json

文件会自动创建在 `~/.hapi/settings.json`：

```json
{
  "feishuAppId": "cli_a933a4feadb81cc9",
  "feishuAppSecret": "e7ScIG1itQdnQPPT4KFsZfsWxrKSXhAT",
  "feishuVerificationToken": "4bcHA2FSS93WLDsKrOmKDgZ3RrV26oS0",
  "feishuBaseUrl": "https://open.feishu.cn",
  "feishuEnabled": true,
  "feishuNotification": true
}
```

**注意：`~/.hapi/` 目录已在 `.gitignore` 中，不会提交到仓库。**

## 启动验证

配置完成后启动 HAPI Hub：

```bash
cd hub
bun run start
```

你应该看到以下日志：

```
[Hub] Feishu: enabled (environment)
[Hub] Feishu notifications: enabled (environment)
...
[FeishuBot] Starting...
[FeishuWs] Token obtained, expires in 7140 seconds
[FeishuWs] Connecting to WebSocket...
[FeishuBot] WebSocket connected
```

## 飞书端配置

在飞书开放平台完成以下配置：

### 1. 事件订阅配置

订阅方式：**长连接**

订阅事件：
- ✅ im.message.receive_v1 (接收消息)
- ✅ card.action.trigger (卡片操作)
- ✅ im.bot.added_v1 (机器人进群)
- ✅ im.bot.deleted_v1 (机器人退群)

### 2. 权限配置

需要申请以下权限：
- ✅ `im:chat:readonly` - 获取群组信息
- ✅ `im:message:send` - 发送消息
- ✅ `im:message:send_as_bot` - 以机器人身份发送消息
- ✅ `im:message:read` - 读取消息（可选）

### 3. 发布应用

完成配置后需要**发布应用**才能正常使用。

## 使用测试

1. 在飞书中搜索你的机器人
2. 发送 `/help` 查看帮助
3. 发送 `/bind <你的token>` 绑定账号
4. 启动 HAPI CLI 会话，测试通知功能

## 故障排查

### WebSocket 连接失败

检查：
```bash
curl -I https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal
```

如果无法连接，检查网络代理设置。

### 403 Forbidden

- 应用未发布
- 权限未开通
- 凭证错误

### 无法接收消息

- 检查事件订阅配置
- 确认订阅了 `im.message.receive_v1`
- 检查 WebSocket 连接状态

## 参考链接

- [飞书开放平台 - 我的应用](https://open.feishu.cn/app/)
- [事件订阅配置文档](https://open.feishu.cn/document/server-side/event-subscription/event-subscription-configure)

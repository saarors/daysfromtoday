# 🚀 Obsidian + R2 配置指南

## 📋 配置步骤

### 1. 环境变量配置

创建 `.env.local` 文件（在项目根目录）：

```bash
# R2 配置 - 请填入你的实际配置
R2_ACCESS_KEY_ID=[R2_ACCESS_KEY]
R2_SECRET_ACCESS_KEY=[R2_SECRET]
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=daysfromtoday-images
CDN_BASE_URL=https://cdn.daysfromtoday.ai

# Obsidian 配置（可选）
OBSIDIAN_VAULT_PATH=/Users/leonmini/Obsidian/DaysFromToday

# 其他配置
NEXT_PUBLIC_SITE_URL=https://www.daysfromtoday.ai
```

### 2. 获取 R2 配置信息

如果你还没有 R2 配置，请按以下步骤获取：

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 登录你的账户

2. **创建 R2 存储桶**
   - 进入 "R2 Object Storage"
   - 点击 "Create bucket"
   - 输入名称：`daysfromtoday-images`
   - 选择位置（建议选择离用户最近的区域）

3. **创建 API Token**
   - 进入 "My Profile" → "API Tokens"
   - 点击 "Create Token"
   - 选择 "Custom token"
   - 权限设置：
     - Zone: Zone:Read
     - Account: Cloudflare R2:Edit
   - 获取 Access Key ID 和 Secret Access Key

4. **获取 Endpoint**
   - 在 R2 页面，找到你的 Account ID
   - Endpoint 格式：`https://{account-id}.r2.cloudflarestorage.com`

### 3. 配置 CDN（可选）

如果你有自定义域名，可以配置 CDN：

1. **添加自定义域名**
   - 在 R2 存储桶设置中
   - 添加自定义域名：`cdn.daysfromtoday.ai`

2. **配置 DNS**
   - 在你的域名管理中添加 CNAME 记录
   - 指向 R2 提供的域名

## 🔧 下一步

配置完成后，运行以下命令测试：

```bash
# 测试 R2 连接
npm run images:upload "/path/to/test" blog

# 启动开发服务器
npm run dev
```

## ❓ 需要帮助？

如果遇到问题，请检查：
1. 环境变量是否正确设置
2. R2 权限是否正确配置
3. 网络连接是否正常


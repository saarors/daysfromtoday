# 📘 Supabase 配置指南

**Phase 2 Day 1-2**：数据库设置 + Google OAuth 配置

---

## 🎯 配置目标

1. ✅ 运行数据库迁移脚本
2. ✅ 配置 Google OAuth
3. ✅ 配置 Magic Link（邮箱登录）
4. ✅ 验证连接和权限

---

## 📋 第一步：运行数据库迁移

### 1.1 登录 Supabase Dashboard
```
https://supabase.com/dashboard/project/cdnyyakhsyzoummmfkuf
```

### 1.2 打开 SQL Editor
- 左侧菜单 → **SQL Editor**
- 点击 **New query**

### 1.3 复制并执行 SQL
```sql
-- 复制 supabase/migrations/001_initial_schema.sql 的全部内容
-- 粘贴到 SQL Editor
-- 点击 "Run" 按钮执行
```

### 1.4 验证表创建成功
- 左侧菜单 → **Table Editor**
- 应该看到以下表：
  - ✅ `users` (6 条)
  - ✅ `goal_cards` (10 条)
  - ✅ `card_likes` (3 条)
  - ✅ `card_comments` (4 条)
  - ✅ `custom_templates` (7 条)

---

## 🔐 第二步：配置 Google OAuth

### 2.1 创建 Google OAuth 应用

#### 访问 Google Cloud Console
```
https://console.cloud.google.com/
```

#### 创建新项目（如果还没有）
1. 点击顶部项目下拉菜单
2. 点击 **NEW PROJECT**
3. 项目名称：`DaysFromToday`
4. 点击 **CREATE**

#### 启用 OAuth 同意屏幕
1. 左侧菜单 → **APIs & Services** → **OAuth consent screen**
2. 选择 **External** → 点击 **CREATE**
3. 填写信息：
   - App name: `DaysFromToday`
   - User support email: `你的邮箱`
   - Developer contact: `你的邮箱`
4. 点击 **SAVE AND CONTINUE**
5. Scopes: 跳过，点击 **SAVE AND CONTINUE**
6. Test users: 跳过，点击 **SAVE AND CONTINUE**

#### 创建 OAuth 2.0 Client ID
1. 左侧菜单 → **APIs & Services** → **Credentials**
2. 点击 **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `DaysFromToday Web Client`
5. **Authorized JavaScript origins**:
   ```
   https://www.daysfromtoday.ai
   http://localhost:3000
   http://localhost:3001
   ```
6. **Authorized redirect URIs**:
   ```
   https://cdnyyakhsyzoummmfkuf.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   ```
7. 点击 **CREATE**
8. **保存以下信息**：
   - ✅ Client ID: `xxxxxxxx.apps.googleusercontent.com`
   - ✅ Client Secret: `GOCSPX-xxxxxxxx`

### 2.2 在 Supabase 中配置 Google OAuth

1. Supabase Dashboard → **Authentication** → **Providers**
2. 找到 **Google**，点击右侧 **Edit**
3. 启用 Google Provider
4. 填写信息：
   - **Client ID**: 粘贴上面保存的 Client ID
   - **Client Secret**: 粘贴上面保存的 Client Secret
5. 点击 **Save**

---

## 📧 第三步：配置 Magic Link（邮箱登录）

### 3.1 启用 Email Provider
1. Supabase Dashboard → **Authentication** → **Providers**
2. 找到 **Email**，确保已启用
3. 配置选项：
   - ✅ Enable Email provider
   - ✅ Confirm email (建议开启，防止垃圾注册)
   - ✅ Secure email change (安全的邮箱修改)

### 3.2 配置 Email Templates（可选）
1. **Authentication** → **Email Templates**
2. 可以自定义以下邮件模板：
   - Confirm signup（确认注册）
   - Magic Link（魔法链接登录）
   - Change Email Address（修改邮箱）
   - Reset Password（重置密码）

**建议模板示例**：
```html
<h2>Welcome to DaysFromToday! 🎯</h2>
<p>Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

---

## 🧪 第四步：验证配置

### 4.1 测试数据库连接
使用我们之前创建的测试脚本：
```bash
npm run test:supabase
```

**预期结果**：
```
✅ Supabase 连接成功！
```

### 4.2 测试 Google OAuth（手动）
1. 访问：`https://cdnyyakhsyzoummmfkuf.supabase.co/auth/v1/authorize?provider=google`
2. 应该重定向到 Google 登录页面
3. 如果看到错误，检查：
   - Client ID 和 Secret 是否正确
   - Redirect URI 是否配置正确

### 4.3 查看 Auth 配置
```bash
# 在 Supabase Dashboard
Authentication → Settings → Auth Providers
```

应该看到：
- ✅ Email: Enabled
- ✅ Google: Enabled
- ❌ GitHub: Disabled（我们不使用）

---

## 📊 数据库表结构说明

### `users` 表
存储用户扩展信息：
- `id`: 关联 auth.users
- `email`: 邮箱
- `display_name`: 显示名称
- `avatar_url`: 头像 URL
- `locale`: 语言偏好（en/zh）
- `total_cards`: 创建的卡片总数
- `total_shares`: 分享次数

### `goal_cards` 表
存储目标卡片：
- `id`: 卡片 ID
- `user_id`: 所属用户
- `template_id`: 使用的模板
- `goal_text`: 目标文字（200 字限制）
- `target_date`: 目标日期
- `is_public`: 是否公开
- `short_url`: 短链接
- `like_count`: 点赞数

### `card_likes` 表
存储点赞记录：
- `card_id`: 卡片 ID
- `user_id`: 点赞用户
- 唯一约束：同一用户只能点赞一次

### `card_comments` 表（未来扩展）
存储评论：
- `card_id`: 卡片 ID
- `user_id`: 评论用户
- `content`: 评论内容（500 字限制）

### `custom_templates` 表（未来扩展）
存储用户自定义模板：
- `user_id`: 所属用户
- `template_config`: 模板配置（JSONB）
- `is_public`: 是否公开

---

## 🔒 安全策略（RLS）

### 已启用的 RLS 策略

#### `users` 表
- ✅ 用户只能查看自己的数据
- ✅ 用户只能修改自己的数据

#### `goal_cards` 表
- ✅ 用户可以查看自己的卡片
- ✅ 用户可以查看公开的卡片
- ✅ 用户只能修改/删除自己的卡片

#### `card_likes` 表
- ✅ 所有人可以查看点赞
- ✅ 用户只能添加/删除自己的点赞

---

## 🎯 下一步

### 完成配置后
1. ✅ 数据库表创建成功
2. ✅ Google OAuth 配置完成
3. ✅ Magic Link 启用
4. ✅ RLS 策略生效

### 开始开发
1. 创建登录/注册 UI 组件
2. 实现 Google OAuth 登录流程
3. 实现 Magic Link 登录流程
4. 实现数据同步逻辑

---

## 🆘 常见问题

### Q: 执行 SQL 时报错 "permission denied"
**A**: 确保在 Supabase Dashboard 的 SQL Editor 中执行，而不是用普通客户端连接

### Q: Google OAuth 重定向失败
**A**: 检查 Google Cloud Console 中的 Redirect URI 是否包含 Supabase 的回调地址

### Q: RLS 策略不生效
**A**: 确保使用 Supabase 客户端连接，并且用户已登录（有 JWT token）

### Q: 如何查看数据库日志
**A**: Supabase Dashboard → **Database** → **Logs**

---

## 📝 配置检查清单

完成以下步骤后打勾：

- [ ] ✅ 在 SQL Editor 中运行迁移脚本
- [ ] ✅ 在 Table Editor 中确认 5 个表创建成功
- [ ] ✅ 在 Google Cloud Console 创建 OAuth 应用
- [ ] ✅ 在 Supabase 中配置 Google Provider
- [ ] ✅ 启用 Email Provider
- [ ] ✅ 运行 `npm run test:supabase` 验证连接
- [ ] ✅ 确认 RLS 策略已启用

---

**配置完成后，告诉我"Supabase 配置完成"，我们将继续创建认证 UI 组件！**


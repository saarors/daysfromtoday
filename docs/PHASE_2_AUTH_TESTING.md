# Phase 2 认证功能测试指南

## 📋 测试前准备

### 1. 确认环境变量配置
```bash
# 检查 .env.local 文件是否包含：
NEXT_PUBLIC_SUPABASE_URL=https://cdnyyakhsyzoummmfkuf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 2. 确认 Supabase Dashboard 配置
- ✅ Google OAuth Provider 已启用
- ✅ Redirect URLs 已配置：
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3001/auth/callback`
  - `https://www.daysfromtoday.ai/auth/callback`
- ✅ Email (Magic Link) Provider 已启用

### 3. 启动开发服务器
```bash
npm run dev
```

---

## 🧪 测试清单

### ✅ 测试 1：未登录状态
**访问**: `http://localhost:3001/en`

**预期结果**:
- [ ] 导航栏右侧显示 "Sign In" 按钮（或中文 "登录"）
- [ ] 点击按钮跳转到 `/en/auth` 页面

---

### ✅ 测试 2：登录页面显示
**访问**: `http://localhost:3001/en/auth`

**预期结果**:
- [ ] 页面标题显示 "Welcome Back"
- [ ] 显示 Google 登录按钮
- [ ] 显示 Magic Link 邮箱输入框
- [ ] 显示切换到注册的链接

**切换到注册**:
- [ ] 点击底部的 "Don't have an account? Sign Up"
- [ ] 页面标题变为 "Create Account"

---

### ✅ 测试 3：Google OAuth 登录流程
**操作步骤**:
1. 点击 "Continue with Google" 按钮
2. 在弹出的 Google 授权窗口中选择账户
3. 授权后等待重定向

**预期结果**:
- [ ] 重定向到 Google 授权页面
- [ ] 授权成功后重定向回 `/en` 首页
- [ ] 导航栏显示用户头像（Google 头像）
- [ ] 点击头像显示下拉菜单

**可能的错误**:
- 如果显示 "Invalid OAuth URL"，检查 Supabase Dashboard → Authentication → URL Configuration → Redirect URLs

---

### ✅ 测试 4：Magic Link 登录流程
**操作步骤**:
1. 访问 `/en/auth`
2. 输入邮箱地址（使用你能访问的真实邮箱）
3. 点击 "Send Magic Link"

**预期结果**:
- [ ] 显示成功消息："已发送登录链接到您的邮箱，请查收！"
- [ ] 收到来自 Supabase 的邮件（检查垃圾邮件文件夹）
- [ ] 邮件中包含登录链接

**点击邮件中的链接**:
- [ ] 重定向到首页
- [ ] 已登录状态
- [ ] 导航栏显示用户头像

**可能的错误**:
- 如果未收到邮件，检查 Supabase Dashboard → Authentication → Email Templates
- 确认 SMTP 配置正确（默认使用 Supabase 内置 SMTP）

---

### ✅ 测试 5：用户菜单功能
**操作步骤**（需先登录）:
1. 点击导航栏右侧的头像

**预期结果**:
- [ ] 显示下拉菜单
- [ ] 显示用户邮箱和名称
- [ ] 显示 "My Cards" 选项
- [ ] 显示 "Settings" 选项
- [ ] 显示 "Sign Out" 选项（红色）

**点击菜单外部**:
- [ ] 菜单自动关闭

---

### ✅ 测试 6：登出流程
**操作步骤**:
1. 点击用户头像
2. 点击 "Sign Out"

**预期结果**:
- [ ] 菜单关闭
- [ ] 重定向到首页
- [ ] 导航栏显示 "Sign In" 按钮
- [ ] 用户已登出

---

### ✅ 测试 7：会话持久化
**操作步骤**:
1. 登录成功后
2. 刷新页面（F5）

**预期结果**:
- [ ] 用户仍然保持登录状态
- [ ] 导航栏仍显示用户头像

**关闭浏览器重新打开**:
- [ ] 用户仍然保持登录状态（Session 保存在 Cookie 中）

---

### ✅ 测试 8：多语言切换
**操作步骤**:
1. 访问 `/en/auth`（英文）
2. 切换到中文

**预期结果**:
- [ ] URL 变为 `/zh/auth`
- [ ] 页面标题变为 "欢迎回来"
- [ ] 所有按钮和文本变为中文

---

### ✅ 测试 9：受保护的路由重定向
**操作步骤**（未登录状态）:
1. 直接访问 `/en/my-cards`（这个页面稍后会创建）

**预期行为**（当前还未实现）:
- 应该重定向到 `/en/auth?redirect=/en/my-cards`
- 登录后自动返回 `/en/my-cards`

**备注**: 这个功能会在下一步实现。

---

### ✅ 测试 10：数据库验证
**操作步骤**:
1. 登录成功后
2. 访问 Supabase Dashboard → Table Editor → users

**预期结果**:
- [ ] 看到新创建的用户记录
- [ ] `id` 字段与 Auth Users 中的 UUID 一致
- [ ] `email` 字段正确
- [ ] `username` 可能为空（首次登录）
- [ ] `avatar_url` 包含 Google 头像 URL（如果使用 Google 登录）
- [ ] `created_at` 和 `updated_at` 已填充

---

## 🐛 常见问题排查

### 问题 1: "Invalid OAuth URL"
**原因**: Redirect URL 未配置

**解决方案**:
1. 访问 Supabase Dashboard → Authentication → URL Configuration
2. 添加所有开发和生产环境的回调 URL：
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback`
   - `https://www.daysfromtoday.ai/auth/callback`

---

### 问题 2: Magic Link 未收到邮件
**原因**: SMTP 配置问题或邮件进入垃圾箱

**解决方案**:
1. 检查垃圾邮件文件夹
2. 检查 Supabase Dashboard → Project Settings → Email
3. 如果使用自定义 SMTP，确认配置正确
4. 测试使用 Gmail 账户（最可靠）

---

### 问题 3: 用户头像不显示
**原因**: Google 未返回头像 URL

**解决方案**:
1. 检查 Supabase Dashboard → Authentication → Users
2. 查看 `raw_user_meta_data` 字段是否包含 `avatar_url`
3. 如果没有，显示首字母缩写（已在代码中实现）

---

### 问题 4: 刷新后用户登出
**原因**: Session Cookie 未正确保存

**解决方案**:
1. 检查浏览器是否阻止第三方 Cookie
2. 检查 `lib/supabase/server.ts` 和 `middleware.ts` 是否正确配置
3. 查看浏览器 DevTools → Application → Cookies
4. 应该看到 `sb-<project-ref>-auth-token` Cookie

---

### 问题 5: Middleware 错误
**错误信息**: "Failed to update session"

**解决方案**:
1. 检查 `lib/supabase/middleware.ts` 是否正确创建
2. 确认 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 在 `.env.local` 中配置
3. 重启开发服务器

---

## ✅ 验收标准

### Phase 2 Day 3-4 完成条件:
- [x] Google OAuth 登录成功
- [x] Magic Link 登录成功
- [x] 用户菜单正常显示
- [x] 登出功能正常
- [x] 会话持久化正常
- [x] 多语言切换正常
- [x] 用户数据自动同步到 Supabase
- [x] UI 美观且符合设计规范

---

## 📸 测试截图（可选）

建议截图验证的内容：
1. 登录页面（英文/中文）
2. Google 授权页面
3. 登录成功后的导航栏（显示头像）
4. 用户下拉菜单
5. Supabase Dashboard 中的用户记录

---

## 🚀 下一步

测试通过后，我们将继续：
- **Phase 2 Day 5-7**: LocalStorage → Supabase 数据同步
- **Phase 2 Day 8-10**: 用户卡片管理页面

---

## 📝 测试记录

**测试日期**: _____________________
**测试人**: _____________________
**浏览器**: _____________________
**通过率**: _____ / 10

**备注**:
_____________________________________
_____________________________________
_____________________________________


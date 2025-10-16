# Phase 2 认证功能快速测试

## 🚀 一分钟快速测试

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 访问登录页面
```
http://localhost:3001/en/auth
```

### 3. 测试 Google 登录
1. 点击 "Continue with Google"
2. 选择 Google 账户
3. 授权后应该重定向回首页
4. 导航栏显示你的 Google 头像

### 4. 验证登录状态
- ✅ 导航栏显示用户头像
- ✅ 点击头像显示下拉菜单
- ✅ 菜单显示邮箱和名称
- ✅ 刷新页面仍然保持登录

### 5. 测试登出
1. 点击用户头像
2. 点击 "Sign Out"
3. 应该返回首页且显示 "Sign In" 按钮

---

## ✅ 成功标志

如果以上步骤全部通过，说明：
- ✅ Supabase 认证配置正确
- ✅ Google OAuth 工作正常
- ✅ 会话管理正常
- ✅ UI 组件正常工作

---

## 🐛 如果失败

### Google 登录失败
**检查**: Supabase Dashboard → Authentication → Providers → Google
- Client ID 和 Secret 是否正确
- Redirect URLs 是否包含 `http://localhost:3001/auth/callback`

### 刷新后登出
**检查**: 浏览器 DevTools → Application → Cookies
- 应该看到 `sb-cdnyyakhsyzoummmfkuf-auth-token` Cookie
- 如果没有，检查 `lib/supabase/server.ts` 配置

### 头像不显示
**正常**: 如果 Google 未返回头像，会显示首字母缩写

---

## 📝 详细测试

完整测试清单请查看: [PHASE_2_AUTH_TESTING.md](./PHASE_2_AUTH_TESTING.md)


# Phase 3 数据库迁移与设置指南

## 📋 前置条件

1. ✅ Supabase 项目已创建
2. ✅ 环境变量已配置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`（用于脚本）

---

## 🚀 Phase 3.1: 数据库迁移步骤

### **步骤 1: 执行数据库迁移 SQL**

#### 方式一：通过 Supabase Dashboard（推荐）

1. 打开 Supabase Dashboard: https://supabase.com/dashboard
2. 选择项目
3. 左侧菜单 → **SQL Editor**
4. 点击 **New Query**
5. 复制 `scripts/migrate-db-phase-3.sql` 的全部内容
6. 粘贴到编辑器
7. 点击 **Run** (或 Cmd+Enter)
8. 查看结果，确保无错误

#### 方式二：通过命令行（需要 psql）

```bash
# 设置数据库连接信息（从 Supabase Dashboard → Settings → Database 获取）
export PGHOST="your-project.supabase.co"
export PGPORT="5432"
export PGDATABASE="postgres"
export PGUSER="postgres"
export PGPASSWORD="your-password"

# 执行迁移
psql -f scripts/migrate-db-phase-3.sql
```

### **步骤 2: 验证迁移结果**

在 Supabase Dashboard → **Table Editor** 中检查：

- ✅ `goal_cards` 表已创建（新结构）
- ✅ `ai_prompt_templates` 表已创建
- ✅ `ai_api_logs` 表已创建
- ✅ `public.profiles` 表已创建

检查 RPC 函数（Supabase Dashboard → **Database** → **Functions**）：

- ✅ `increment_goal_cards_count`
- ✅ `decrement_goal_cards_count`
- ✅ `check_goal_cards_quota`
- ✅ `get_user_quota`

---

## 🌱 Phase 3.2: 初始化提示词库

### **步骤 1: 安装依赖**

```bash
# 确保安装了 tsx（TypeScript 执行器）
npm install -D tsx
```

### **步骤 2: 配置环境变量**

确保 `.env.local` 包含：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **步骤 3: 运行提示词初始化脚本**

```bash
npx tsx scripts/seed-prompts.ts
```

**预期输出：**

```
🚀 开始初始化提示词库...

🗑️  清空现有提示词...
📝 插入 6 条核心提示词...

✅ twinkle    × general    × start        × zh → 已插入
✅ twinkle    × general    × start        × en → 已插入
✅ labubu     × general    × start        × zh → 已插入
✅ labubu     × general    × start        × en → 已插入
✅ jobs       × general    × start        × zh → 已插入
✅ jobs       × general    × start        × en → 已插入

🔍 验证插入结果...
✅ 数据库中共有 6 条活跃提示词

📊 提示词库统计：
   Twinkle: 2 条
   Labubu:  2 条
   Jobs:    2 条
   中文:    3 条
   英文:    3 条

🎉 提示词库初始化完成！
下一步：开发 AI API 路由 (/api/ai/chat)
```

### **步骤 4: 验证提示词**

在 Supabase Dashboard → **Table Editor** → `ai_prompt_templates` 中检查：

- ✅ 应该有 6 条记录
- ✅ `is_active` 全部为 `true`
- ✅ 每个助手都有中文和英文两个版本

---

## 🧪 Phase 3.1: 测试认证策略

### **测试场景 1: 公开页面可匿名访问**

在**无痕模式**下访问以下页面，应该能正常显示：

- ✅ `http://localhost:3002/` (首页)
- ✅ `http://localhost:3002/zh` (中文首页)
- ✅ `http://localhost:3002/en` (英文首页)
- ✅ `http://localhost:3002/zh/days/30` (日期计算)
- ✅ `http://localhost:3002/zh/calculator` (日期计算器)
- ✅ `http://localhost:3002/zh/holidays` (节假日)
- ✅ `http://localhost:3002/zh/blog` (博客)

### **测试场景 2: 愿望清单需要登录**

在**无痕模式**下访问：

- ❌ `http://localhost:3002/zh/wishlist`

**预期行为**：
- 自动重定向到 `/zh/login?redirect=/zh/wishlist`
- URL 中包含 `redirect` 参数，用于登录后返回

### **测试场景 3: 登录后可访问愿望清单**

1. 注册/登录账号
2. 访问 `/zh/wishlist`
3. ✅ 应该能正常显示愿望清单页面

---

## 🔧 常见问题排查

### 问题 1: 数据库迁移失败

**错误**: `permission denied for table goal_cards`

**解决**:
- 检查 Supabase 角色权限
- 确保使用 `postgres` 用户执行迁移
- 在 Supabase Dashboard 中执行（自动使用超级用户）

### 问题 2: 提示词脚本找不到表

**错误**: `relation "ai_prompt_templates" does not exist`

**解决**:
- 先执行 `migrate-db-phase-3.sql`
- 确认表已创建
- 再运行 `seed-prompts.ts`

### 问题 3: 环境变量缺失

**错误**: `❌ 缺少环境变量：SUPABASE_SERVICE_ROLE_KEY`

**解决**:
1. 打开 Supabase Dashboard → **Settings** → **API**
2. 复制 `service_role` key（⚠️ 不要公开）
3. 添加到 `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 问题 4: 中间件重定向循环

**错误**: 浏览器提示"重定向次数过多"

**解决**:
- 检查 `middleware.ts` 中的 `PUBLIC_PATHS`
- 确保 `/login` 和 `/register` 在公开路径中
- 清除浏览器 cookies

---

## 📊 迁移完成检查清单

### 数据库层

- [ ] ✅ `goal_cards` 表已创建（新结构）
- [ ] ✅ `ai_prompt_templates` 表已创建
- [ ] ✅ `ai_api_logs` 表已创建
- [ ] ✅ `public.profiles` 表已创建
- [ ] ✅ RPC 函数已创建（4 个）
- [ ] ✅ RLS 策略已启用
- [ ] ✅ 6 条提示词已插入

### 代码层

- [ ] ✅ `middleware.ts` 已更新（认证策略）
- [ ] ✅ `lib/ai-prompt-matcher.ts` 已创建
- [ ] ✅ 提示词匹配逻辑已实现

### 测试层

- [ ] ✅ 公开页面可匿名访问
- [ ] ✅ 愿望清单需要登录
- [ ] ✅ 登录后可访问愿望清单
- [ ] ✅ 提示词库完整性验证通过

---

## 🎯 下一步

Phase 3.1 和 3.2 完成后，进入：

**Phase 3.3: DeepSeek API 接入**

- 创建 `/api/ai/chat` Route
- 实现流式响应（SSE）
- 集成提示词匹配系统
- 记录 API 调用日志

---

**文档版本**: V3.0-Phase3  
**更新时间**: 2025-10-31  
**状态**: 待执行 ⏳


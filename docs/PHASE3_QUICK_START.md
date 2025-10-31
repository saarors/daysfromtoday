# Phase 3 快速启动指南

> ⚡ 5 分钟完成数据库重建和提示词初始化

---

## 🎯 快速执行（3 步完成）

### **步骤 1: 清空并重建数据库**

#### 方式一：Supabase Dashboard（推荐）✅

1. 打开 https://supabase.com/dashboard
2. 选择你的项目
3. 左侧菜单 → **SQL Editor**
4. 点击 **New Query**
5. 复制 `scripts/migrate-db-phase-3.sql` 的全部内容
6. 粘贴到编辑器
7. 点击 **Run** (或 Cmd+Enter)
8. 等待执行完成（约 2-3 秒）
9. 查看输出，应该显示：

```
✅ Phase 3 数据库重建完成！

📊 已创建表：
   • goal_cards (用户目标卡片)
   • ai_prompt_templates (AI 提示词库)
   • ai_api_logs (API 调用日志)
   • profiles (用户配置和配额)

🔧 已创建 RPC 函数：
   • increment_goal_cards_count (增加配额)
   • decrement_goal_cards_count (减少配额)
   • check_goal_cards_quota (检查配额)
   • get_user_quota (获取配额信息)

🔒 已启用 Row Level Security (RLS)

📝 下一步：运行提示词初始化脚本
   npx tsx scripts/seed-prompts.ts
```

#### 方式二：命令行（需要 psql）

```bash
# 从 Supabase Dashboard → Settings → Database 获取连接信息
export PGHOST="your-project.supabase.co"
export PGPORT="5432"
export PGDATABASE="postgres"
export PGUSER="postgres"
export PGPASSWORD="your-password"

# 执行迁移
psql -f scripts/migrate-db-phase-3.sql
```

---

### **步骤 2: 初始化提示词库**

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

---

### **步骤 3: 运行验收测试**

```bash
npx tsx scripts/validate-phase3.ts
```

**预期输出：**

```
🧪 Phase 3 验收测试

============================================================
📊 测试 1: 数据库表检查
------------------------------------------------------------
✅ goal_cards              → 存在
✅ ai_prompt_templates     → 存在
✅ ai_api_logs             → 存在
✅ profiles                → 存在

📝 测试 2: 提示词库完整性
------------------------------------------------------------
✅ twinkle    × zh    → 存在
✅ twinkle    × en    → 存在
✅ labubu     × zh    → 存在
✅ labubu     × en    → 存在
✅ jobs       × zh    → 存在
✅ jobs       × en    → 存在

✅ 提示词库完整：共 6 条

🔍 测试 3: 提示词匹配逻辑
------------------------------------------------------------
✅ "我想学习 TypeScript..." → zh
✅ "I want to learn TypeScript..." → en
✅ "30天后我要完成项目..." → zh
✅ "Complete project in 30 days..." → en

🔧 测试 4: RPC 函数检查
------------------------------------------------------------
✅ increment_goal_cards_count → 可调用
✅ decrement_goal_cards_count → 可调用
✅ check_goal_cards_quota      → 可调用
✅ get_user_quota              → 可调用

📅 测试 5: 阶段计算逻辑（Phase 3 简化版）
------------------------------------------------------------
✅ 7 天 → start
✅ 30 天 → start
✅ 90 天 → start
✅ 365 天 → start

============================================================
📊 测试结果总结
============================================================
通过测试: XX / XX
通过率: 100.0%

🎉 所有测试通过！Phase 3.1 & 3.2 验收成功！

下一步：开发 Phase 3.3 - DeepSeek API 接入
```

---

## ✅ 验收清单

完成上述 3 步后，检查以下项目：

### 数据库层
- [ ] ✅ `goal_cards` 表已创建
- [ ] ✅ `ai_prompt_templates` 表已创建
- [ ] ✅ `ai_api_logs` 表已创建
- [ ] ✅ `public.profiles` 表已创建
- [ ] ✅ 4 个 RPC 函数可调用
- [ ] ✅ RLS 策略已启用

### 提示词库
- [ ] ✅ 6 条提示词已插入
- [ ] ✅ 语言检测准确（中文/英文）
- [ ] ✅ 提示词匹配逻辑正确

### 认证中间件
- [ ] ✅ 公开页面可匿名访问（首页、日期计算、博客、节假日）
- [ ] ✅ 愿望清单需要登录（自动跳转到 `/login`）

---

## 🚨 常见问题

### Q1: `SUPABASE_SERVICE_ROLE_KEY` 缺失

**错误**:
```
❌ 缺少环境变量：SUPABASE_SERVICE_ROLE_KEY
```

**解决**:
1. 打开 Supabase Dashboard → **Settings** → **API**
2. 复制 `service_role` key
3. 添加到 `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Q2: 提示词插入失败

**错误**:
```
❌ 插入失败: twinkle - zh
```

**解决**:
1. 确认数据库迁移已完成
2. 检查 `ai_prompt_templates` 表是否存在
3. 重新运行迁移脚本

### Q3: RPC 函数不存在

**错误**:
```
❌ increment_goal_cards_count → 不存在或不可调用
```

**解决**:
1. 在 Supabase Dashboard → **Database** → **Functions** 中检查函数列表
2. 如果不存在，重新运行迁移脚本
3. 确认使用 `postgres` 超级用户执行

---

## 🎯 Phase 3.1 & 3.2 完成标志

当你看到以下输出时，说明 Phase 3.1 和 3.2 已经成功完成：

✅ 数据库迁移脚本执行成功  
✅ 6 条提示词已插入数据库  
✅ 验收测试 100% 通过  
✅ 认证中间件工作正常  

---

## 🚀 下一步：Phase 3.3

**DeepSeek API 接入**

1. 创建 `/api/ai/chat` Route
2. 实现流式响应（SSE）
3. 集成提示词匹配系统
4. 记录 API 调用日志

开始开发前，确保 Phase 3.1 & 3.2 的所有测试都通过！

---

**文档版本**: V3.0-Phase3  
**更新时间**: 2025-10-31  
**预计完成时间**: 5 分钟 ⚡


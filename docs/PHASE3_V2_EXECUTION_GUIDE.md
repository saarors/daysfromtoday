# Phase 3 V2 执行指南

> **AI 助手自动匹配系统 - 完整实施方案**  
> **版本**: V3.0-Phase3-V2  
> **日期**: 2025-10-31

---

## 📋 总览

### **核心升级**

从**手动选择 AI 助手**升级到**智能自动匹配系统**：

```
V2.0: 用户手动选择 (Twinkle/Labubu/Jobs)
        ↓
V3.0: AI 根据目标自动匹配 (15种类型 × 15种人格)
```

### **理论支撑**

- 📚 理论文档：`docs/AI_PERSONA_MATCHING_SYSTEM.md`
- 🎯 15 种目标类型（健康型、工作型、学习型等）
- 🤖 15 种 AI 人格（教练型、陪伴型、分析型等）
- 🧮 智能匹配算法（关键词识别 + 难度计算）

---

## 🚀 执行步骤

### **步骤 1: 数据库完全重建（⚠️ 重要）**

#### **在 Supabase Dashboard 执行**

1. 打开 https://supabase.com/dashboard
2. 选择项目：`cdnyyakhsyzoummmfkuf`
3. 左侧菜单 → **SQL Editor** → **New Query**
4. 复制 `scripts/migrate-db-phase-3-v2.sql` 的全部内容
5. 粘贴并点击 **Run** (Cmd+Enter)

#### **预期输出**

```
========================================
✅ Phase 3 V2 数据库重建完成！
========================================

📊 已创建表：
   • goal_types (目标类型库)
   • ai_personas (AI 人格库)
   • goal_cards (用户目标卡片 - 增强版)
   • ai_prompt_templates (提示词模板 - 重构版)
   • ai_api_logs (API 调用日志)
   • profiles (用户配置和配额)

🔧 已创建 RPC 函数：
   • increment_goal_cards_count
   • decrement_goal_cards_count
   • check_goal_cards_quota
   • get_user_quota

🔒 已启用 Row Level Security (RLS)
```

---

### **步骤 2: 初始化目标类型数据**

```bash
cd /Users/leonmini/quantum-era/daysfromtoday
npx tsx scripts/seed-goal-types.ts
```

#### **预期输出**

```
🚀 开始初始化目标类型数据...

🗑️  清空现有目标类型...
📝 插入 15 种核心目标类型...

✅ life               | 生活型      → companion
✅ health             | 健康型      → coach
✅ work               | 工作型      → analyst
✅ finance            | 财务型      → advisor
✅ consumption        | 消费型      → reflector
✅ task               | 任务型      → taskmaster
✅ learning           | 学习型      → mentor
✅ relationship       | 人际型      → empath
✅ meaning            | 精神型      → philosopher
✅ habit              | 习惯型      → habit_builder
✅ planning           | 长期规划型   → strategist
✅ recovery           | 康复型      → therapist
✅ challenge          | 挑战型      → challenger
✅ exploration        | 探索型      → explorer
✅ self_discipline    | 自我管理型   → guardian

🔍 验证插入结果...
✅ 数据库中共有 15 种目标类型

🎉 目标类型初始化完成！
```

---

### **步骤 3: 初始化 AI 人格数据**

```bash
npx tsx scripts/seed-ai-personas.ts
```

#### **预期输出**

```
🚀 开始初始化 AI 人格数据...

🗑️  清空现有 AI 人格...
📝 插入 15 种核心 AI 人格...

✅ coach           🎓 教练型         → health, habit
✅ companion       💬 陪伴型         → life, relationship
✅ analyst         🧠 分析型         → work, finance, planning
✅ mentor          🌱 成长型         → learning, planning, meaning
✅ advisor         🧮 顾问型         → finance, planning
✅ taskmaster      📋 执行型         → task, self_discipline, work
✅ therapist       🫶 疗愈型         → recovery, relationship, health
✅ challenger      🔥 突破型         → challenge, exploration, work
✅ explorer        🧩 探索型         → exploration, learning, challenge
✅ habit_builder   🔁 行为教练型      → habit, health, self_discipline
... (更多人格)

✅ 数据库中共有 15 种 AI 人格

🎉 AI 人格初始化完成！
```

---

### **步骤 4: 验证数据完整性**

在 Supabase Dashboard → **Table Editor** 中检查：

#### **goal_types 表**
- ✅ 应该有 15 条记录
- ✅ 每条记录都有 `keywords_zh`, `keywords_en`
- ✅ 每条记录都有 `default_persona_code`

#### **ai_personas 表**
- ✅ 应该有 15 条记录
- ✅ 每条记录都有 `avatar_emoji`, `tone_templates`
- ✅ 每条记录都有 `suitable_goal_types`

#### **goal_cards 表**
- ✅ 新增了字段：`goal_type_code`, `ai_persona_code`, `detected_difficulty`
- ✅ 外键约束已建立

---

## 🧪 功能测试

### **测试 1: 目标类型识别**

```typescript
// 在浏览器控制台或测试文件中
const goalText = "我要30天减10斤";

// 应该识别为 'health' 类型
// 关键词: "减"
```

### **测试 2: AI 人格匹配**

```typescript
// 目标类型: health
// → 默认人格: coach (教练型)
// → 语气: calm_motivational
// → 方法论: ['WOOP', 'Implementation Intention']
```

### **测试 3: 难度计算**

```typescript
// "30天减10斤"
// → 包含数字: +1
// → 短期(<30天): 0
// → 量化目标: +1
// → 难度: medium
```

---

## 📐 数据库架构总结

### **核心表关系**

```
goal_types (目标类型库)
    ↓ (default_persona_code)
ai_personas (AI 人格库)
    ↓ (persona_code, goal_type_code)
ai_prompt_templates (提示词模板)
    ↓ (goal_type_code, ai_persona_code)
goal_cards (用户卡片)
```

### **匹配流程**

```
用户输入: "我要30天减10斤"
    ↓
关键词匹配: "减" → goal_type = 'health'
    ↓
查询 goal_types 表: default_persona_code = 'coach'
    ↓
查询 ai_personas 表: 获取 coach 的配置
    ↓
难度计算: medium
    ↓
查询 ai_prompt_templates: 
  persona='coach', goal_type='health', difficulty='medium'
    ↓
返回匹配结果
```

---

## 🎯 下一步开发计划

### **Phase 3.3: 实现匹配逻辑**

创建以下库文件：

1. **`lib/goal-type-detector.ts`** - 目标类型识别
2. **`lib/difficulty-calculator.ts`** - 难度计算
3. **`lib/persona-matcher.ts`** - AI 人格匹配
4. **`lib/prompt-fetcher-v2.ts`** - 提示词获取（增强版）

### **Phase 3.4: DeepSeek API 接入**

创建 API 路由：

1. **`app/api/ai/match/route.ts`** - 匹配 API
2. **`app/api/ai/chat/route.ts`** - 对话 API（流式响应）

### **Phase 3.5: 前端集成**

更新组件：

1. **`app/[locale]/wishlist/page.tsx`** - 自动调用匹配 API
2. **`components/v3/Wishlist/AIChatDialog.tsx`** - 显示匹配的 AI 人格
3. **`components/v3/Wishlist/WishCard.tsx`** - 显示目标类型和 AI 人格

---

## 📊 关键指标

### **系统能力对比**

| 维度 | V2.0 | V3.0 (Phase 3 V2) |
|-----|------|-------------------|
| **目标类型** | 无分类 | 15 种分类 |
| **AI 人格** | 3 种固定（手动选） | 15 种（自动匹配） |
| **匹配逻辑** | 手动 | 关键词 + 难度算法 |
| **扩展性** | 低 | 高（配置驱动） |
| **用户体验** | 需要选择 | 自动推荐 |

### **预期效果**

- ✅ 匹配准确率 ≥ 90%
- ✅ 用户满意度 ≥ 4.5/5.0
- ✅ 目标完成率提升 ≥ 30%

---

## ⚠️ 注意事项

### **1. 数据完全清空**

- ⚠️ 此次迁移会删除所有历史卡片数据
- ⚠️ Phase 2 的测试数据将丢失
- ✅ 符合产品迭代需求

### **2. 外键约束**

- ✅ `goal_cards.goal_type_code` → `goal_types.code`
- ✅ `goal_cards.ai_persona_code` → `ai_personas.code`
- ✅ `ai_prompt_templates.persona_code` → `ai_personas.code`
- ✅ `ai_prompt_templates.goal_type_code` → `goal_types.code`

### **3. 后续扩展**

Phase 3 V2 为未来预留了扩展空间：

- 🔮 V3.5: 规则引擎（`ai_matching_rules` 表）
- 🔮 V3.5: 情绪检测（`user_emotion_logs` 表）
- 🔮 V4.0: 机器学习推荐（`persona_effectiveness` 表）

---

## 🎓 学习资源

- 📚 **理论指导**: `docs/AI_PERSONA_MATCHING_SYSTEM.md`
- 📊 **数据库设计**: `scripts/migrate-db-phase-3-v2.sql`
- 🧪 **测试数据**: `scripts/seed-goal-types.ts`, `scripts/seed-ai-personas.ts`

---

## ✅ 执行检查清单

- [ ] ✅ 数据库迁移脚本执行成功
- [ ] ✅ `goal_types` 表有 15 条记录
- [ ] ✅ `ai_personas` 表有 15 条记录
- [ ] ✅ 外键约束已建立
- [ ] ✅ RLS 策略已启用
- [ ] ✅ RPC 函数可调用
- [ ] ⏳ 匹配逻辑库已实现
- [ ] ⏳ API 路由已创建
- [ ] ⏳ 前端已集成

---

**文档版本**: V3.0-Phase3-V2  
**最后更新**: 2025-10-31  
**状态**: 等待执行 ⏳


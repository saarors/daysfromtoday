# Phase 3 V2 精确执行指南

> 本文档是基于用户最新研究成果的**精确修正版本**  
> 时间：2025-10-31  
> 目标：100% 对齐「15 目标类型 × 14 AI 人格」架构

---

## 📊 核心架构总览

### 一、目标类型（15 种）

| # | 类型 | 代码 | 主人格 | 次人格 |
|---|------|------|--------|--------|
| 1 | 🏖 生活型 | `life` | Companion | Reflector |
| 2 | 🧘 健康型 | `health` | Coach | Therapist |
| 3 | 💼 工作型 | `work` | Analyst | Strategist |
| 4 | 💰 财务型 | `finance` | Advisor | Analyst |
| 5 | 🛍 消费型 | `consumption` | Reflector | Companion |
| 6 | 🧑‍🎓 任务型 | `task` | **Coach** → Taskmaster 变体 | Analyst |
| 7 | 📚 学习型 | `learning` | Mentor | Coach |
| 8 | 🧩 人际型 | `relationship` | Companion | Therapist |
| 9 | ⛪️ 精神型 | `meaning` | **Mentor** → Philosopher 扩展 | Reflector |
| 10 | 🧱 习惯型 | `habit` | **Coach** → Habit Builder 扩展 | Guardian |
| 11 | 🧭 长期规划型 | `planning` | Strategist | Advisor |
| 12 | ⚕️ 康复型 | `recovery` | Therapist | Companion |
| 13 | 🧨 挑战型 | `challenge` | Challenger | Coach |
| 14 | 🔬 探索型 | `exploration` | **Mentor** → Explorer 扩展 | Reflector |
| 15 | 🧍 自我管理型 | `self_discipline` | Guardian | Reflector |

### 二、AI 人格（14 种）

#### **10 种核心人格 (Core)**

| # | 代码 | 名称 | Emoji | 适用目标 |
|---|------|------|-------|---------|
| 1 | `companion` | 陪伴型 | 💬 | life, relationship |
| 2 | `coach` | 教练型 | 🎓 | health, habit, task |
| 3 | `analyst` | 分析型 | 🧠 | work, finance, planning, task |
| 4 | `mentor` | 成长型 | 🌱 | learning, planning, meaning, exploration |
| 5 | `advisor` | 顾问型 | 🧮 | finance, planning |
| 6 | `reflector` | 反思型 | 🪞 | consumption, meaning, self_discipline, exploration |
| 7 | `therapist` | 疗愈型 | 🫶 | recovery, relationship, health |
| 8 | `challenger` | 突破型 | 🔥 | challenge, exploration, work |
| 9 | `strategist` | 规划型 | 🧑‍💼 | planning, work, finance |
| 10 | `guardian` | 纪律型 | ⏳ | self_discipline, task, habit |

#### **3 种扩展人格 (Extended)**

| # | 代码 | 名称 | Emoji | 父人格 | 适用目标 |
|---|------|------|-------|--------|---------|
| 11 | `philosopher` | 哲学型 | 🕊 | **Mentor** | meaning, planning |
| 12 | `explorer` | 探索型 | 🧩 | **Mentor** | exploration, learning, challenge |
| 13 | `habit_builder` | 习惯养成型 | 🔁 | **Coach** | habit, health, self_discipline |

#### **1 种变体人格 (Variant)**

| # | 代码 | 名称 | Emoji | 父人格 | 适用目标 |
|---|------|------|-------|--------|---------|
| 14 | `taskmaster` | 执行型 | 📋 | **Coach** | task, self_discipline, work |

---

## 🔧 关键修正点

### 修正 1：数据库表结构

#### **ai_personas 表新增字段**

```sql
-- 新增人格类型和继承关系
persona_type VARCHAR(20) DEFAULT 'core' 
  CHECK (persona_type IN ('core', 'extended', 'variant')),
parent_persona_code VARCHAR(50),

-- 外键约束
CONSTRAINT fk_parent_persona 
  FOREIGN KEY (parent_persona_code) 
  REFERENCES ai_personas(code) ON DELETE SET NULL;

-- 新增索引
CREATE INDEX idx_personas_type ON ai_personas(persona_type);
CREATE INDEX idx_personas_parent ON ai_personas(parent_persona_code);
```

#### **goal_types 表字段调整**

```typescript
// characteristics 字段新增人格映射标识
characteristics: {
  // ... 其他特征
  '人格扩展': 'philosopher',  // 指向扩展人格
  '人格变体': 'taskmaster'    // 指向变体人格
}
```

### 修正 2：目标类型映射

#### **任务型 (task)**

```diff
- default_persona_code: 'taskmaster'  // ❌ Taskmaster 不是独立人格
+ default_persona_code: 'coach'        // ✅ Taskmaster 是 Coach 的变体
+ characteristics: { '人格变体': 'taskmaster' }
```

#### **精神型 (meaning)**

```diff
- default_persona_code: 'philosopher'  // ❌ Philosopher 不是独立人格
+ default_persona_code: 'mentor'       // ✅ Philosopher 是 Mentor 的扩展
+ characteristics: { '人格扩展': 'philosopher' }
```

#### **习惯型 (habit)**

```diff
- default_persona_code: 'habit_builder'  // ❌ Habit Builder 不是独立人格
+ default_persona_code: 'coach'          // ✅ Habit Builder 是 Coach 的扩展
+ characteristics: { '人格扩展': 'habit_builder' }
```

#### **探索型 (exploration)**

```diff
- default_persona_code: 'explorer'  // ❌ Explorer 不是独立人格
+ default_persona_code: 'mentor'    // ✅ Explorer 是 Mentor 的扩展
+ characteristics: { '人格扩展': 'explorer' }
```

---

## 📁 修正文件清单

### 数据库层

| 文件 | 状态 | 说明 |
|-----|------|------|
| `scripts/migrate-db-phase-3-v2.sql` | ✅ 已修正 | 增加 `persona_type`, `parent_persona_code` 字段 |

### 数据初始化层

| 文件 | 状态 | 说明 |
|-----|------|------|
| `scripts/seed-goal-types.ts` | ✅ 已修正 | 调整 task/meaning/habit/exploration 的人格映射 |
| `scripts/seed-ai-personas.ts` | ❌ 弃用 | 旧版本，不再使用 |
| `scripts/seed-ai-personas-v2.ts` | ✅ 新创建 | 精确实现 10+3+1 架构 |

### 文档层

| 文件 | 状态 | 说明 |
|-----|------|------|
| `docs/AI_PERSONA_MATCHING_SYSTEM.md` | ✅ 已更新 | 更新目标类型表，标注人格继承关系 |
| `docs/PHASE3_V2_EXECUTION_GUIDE.md` | ✅ 已更新 | 反映最新执行步骤 |
| `docs/PHASE3_V2_PRECISE_EXECUTION.md` | ✅ 本文档 | 精确修正总结 |

---

## 🚀 执行步骤

### 步骤 1：数据库迁移

```bash
# 在 Supabase SQL Editor 中执行
cat scripts/migrate-db-phase-3-v2.sql
```

**预期结果：**
- ✅ 创建 `goal_types` 表
- ✅ 创建 `ai_personas` 表（包含 `persona_type`, `parent_persona_code`）
- ✅ 创建 `goal_cards` 表（增强版）
- ✅ 创建 `ai_prompt_templates` 表
- ✅ 创建 `ai_api_logs` 表
- ✅ 创建 RPC 函数

### 步骤 2：初始化目标类型

```bash
npx tsx scripts/seed-goal-types.ts
```

**预期结果：**
```
✅ [1/15] life        → companion
✅ [2/15] health      → coach
✅ [3/15] work        → analyst
✅ [4/15] finance     → advisor
✅ [5/15] consumption → reflector
✅ [6/15] task        → coach (变体: taskmaster)
✅ [7/15] learning    → mentor
✅ [8/15] relationship → companion
✅ [9/15] meaning     → mentor (扩展: philosopher)
✅ [10/15] habit      → coach (扩展: habit_builder)
✅ [11/15] planning   → strategist
✅ [12/15] recovery   → therapist
✅ [13/15] challenge  → challenger
✅ [14/15] exploration → mentor (扩展: explorer)
✅ [15/15] self_discipline → guardian

🎉 目标类型初始化完成！
```

### 步骤 3：初始化 AI 人格（V2 版本）

```bash
npx tsx scripts/seed-ai-personas-v2.ts
```

**预期结果：**
```
📝 步骤 1: 插入 10 种核心人格...

✅ [核心] companion      💬 陪伴型       → life, relationship
✅ [核心] coach          🎓 教练型       → health, habit, task
✅ [核心] analyst        🧠 分析型       → work, finance, planning, task
✅ [核心] mentor         🌱 成长型       → learning, planning, meaning, exploration
✅ [核心] advisor        🧮 顾问型       → finance, planning
✅ [核心] reflector      🪞 反思型       → consumption, meaning, self_discipline, exploration
✅ [核心] therapist      🫶 疗愈型       → recovery, relationship, health
✅ [核心] challenger     🔥 突破型       → challenge, exploration, work
✅ [核心] strategist     🧑‍💼 规划型       → planning, work, finance
✅ [核心] guardian       ⏳ 纪律型       → self_discipline, task, habit

📝 步骤 2: 插入 3 种扩展人格...

✅ [扩展] philosopher    🕊 哲学型       ← mentor
✅ [扩展] explorer       🧩 探索型       ← mentor
✅ [扩展] habit_builder  🔁 习惯养成型   ← coach

📝 步骤 3: 插入 1 种变体人格...

✅ [变体] taskmaster     📋 执行型       ← coach

🔍 验证插入结果...
✅ 核心人格: 10 种
✅ 扩展人格: 3 种
✅ 变体人格: 1 种
✅ 总计: 14 种 AI 人格

🎉 AI 人格初始化完成！
```

### 步骤 4：验证数据完整性

```bash
npx tsx scripts/validate-phase3-v2.ts
```

**验证项：**
- [ ] 15 种目标类型全部存在
- [ ] 14 种 AI 人格全部存在（10核心+3扩展+1变体）
- [ ] 4 种扩展/变体人格的 `parent_persona_code` 正确指向核心人格
- [ ] 所有目标类型的 `default_persona_code` 指向核心人格（不直接指向扩展/变体）

---

## 🧠 架构设计原则

### 原则 1：人格继承逻辑

```
核心人格 (Core)
   ↓
扩展人格 (Extended) - 增强特定能力维度
   ↓
变体人格 (Variant) - 针对特定场景优化
```

**示例：Coach 家族**

```
Coach (核心)
├── Habit Builder (扩展) - 增强习惯养成能力
└── Taskmaster (变体) - 针对任务执行场景
```

**示例：Mentor 家族**

```
Mentor (核心)
├── Philosopher (扩展) - 增强深度思考能力
└── Explorer (扩展) - 增强探索试错能力
```

### 原则 2：目标类型映射规则

1. **主人格**：必须是核心人格（10 种之一）
2. **次人格**：可以是任何人格（用于动态切换）
3. **人格变体标识**：在 `characteristics` 中用 `'人格扩展'` 或 `'人格变体'` 字段标注

### 原则 3：数据库外键约束

```sql
-- 自引用外键（允许人格继承）
CONSTRAINT fk_parent_persona 
  FOREIGN KEY (parent_persona_code) 
  REFERENCES ai_personas(code) ON DELETE SET NULL
```

---

## 📊 完整映射矩阵

### 目标 → 核心人格 → 扩展/变体

```
life          → companion (核心)
health        → coach (核心)
work          → analyst (核心)
finance       → advisor (核心)
consumption   → reflector (核心)
task          → coach (核心) → taskmaster (变体)
learning      → mentor (核心)
relationship  → companion (核心)
meaning       → mentor (核心) → philosopher (扩展)
habit         → coach (核心) → habit_builder (扩展)
planning      → strategist (核心)
recovery      → therapist (核心)
challenge     → challenger (核心)
exploration   → mentor (核心) → explorer (扩展)
self_discipline → guardian (核心)
```

---

## ✅ 验收标准

### 数据库层

- [ ] `ai_personas` 表包含 14 条记录
- [ ] 10 条 `persona_type = 'core'`
- [ ] 3 条 `persona_type = 'extended'`
- [ ] 1 条 `persona_type = 'variant'`
- [ ] 4 条扩展/变体人格的 `parent_persona_code` 非空且正确

### 数据完整性

- [ ] 所有核心人格的 `parent_persona_code` 为 `NULL`
- [ ] `philosopher.parent_persona_code = 'mentor'`
- [ ] `explorer.parent_persona_code = 'mentor'`
- [ ] `habit_builder.parent_persona_code = 'coach'`
- [ ] `taskmaster.parent_persona_code = 'coach'`

### 目标类型映射

- [ ] `task` 的 `default_persona_code = 'coach'`
- [ ] `meaning` 的 `default_persona_code = 'mentor'`
- [ ] `habit` 的 `default_persona_code = 'coach'`
- [ ] `exploration` 的 `default_persona_code = 'mentor'`

---

## 🎯 下一步计划

1. **Phase 3.3**：实现目标类型识别逻辑（NLP 关键词匹配）
2. **Phase 3.4**：实现 AI 人格匹配逻辑（考虑扩展/变体）
3. **Phase 3.5**：创建 DeepSeek API 路由
4. **Phase 3.6**：前端集成智能匹配系统

---

## 📚 参考文档

- **理论指导**：`docs/AI_PERSONA_MATCHING_SYSTEM.md`
- **原始执行计划**：`docs/PHASE3_V2_EXECUTION_GUIDE.md`
- **数据库架构**：`scripts/migrate-db-phase-3-v2.sql`
- **初始化脚本**：`scripts/seed-ai-personas-v2.ts`

---

**最后更新：** 2025-10-31  
**版本：** Phase 3 V2 Precise  
**状态：** ✅ 修正完成，等待执行


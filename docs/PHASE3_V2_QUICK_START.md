# Phase 3 V2 快速执行指南

> ✅ **精确修正版**：10 核心 + 3 扩展 + 1 变体 = 14 种 AI 人格  
> 📅 **最后更新**：2025-10-31

---

## 🚀 三步启动

### 步骤 1：数据库迁移

```bash
# 在 Supabase SQL Editor 执行
scripts/migrate-db-phase-3-v2.sql
```

**新增特性：**
- `ai_personas.persona_type`：区分 core/extended/variant
- `ai_personas.parent_persona_code`：人格继承关系

---

### 步骤 2：初始化目标类型（15 种）

```bash
npx tsx scripts/seed-goal-types.ts
```

**关键修正：**
- `task` → `coach`（不再直接指向 taskmaster）
- `meaning` → `mentor`（不再直接指向 philosopher）
- `habit` → `coach`（不再直接指向 habit_builder）
- `exploration` → `mentor`（不再直接指向 explorer）

---

### 步骤 3：初始化 AI 人格（14 种）⚠️ 使用 V2 版本

```bash
npx tsx scripts/seed-ai-personas-v2.ts
```

**输出示例：**
```
✅ [核心] companion      💬 陪伴型
✅ [核心] coach          🎓 教练型
...（共 10 种）

✅ [扩展] philosopher    🕊 哲学型       ← mentor
✅ [扩展] explorer       🧩 探索型       ← mentor
✅ [扩展] habit_builder  🔁 习惯养成型   ← coach

✅ [变体] taskmaster     📋 执行型       ← coach

🎉 总计: 14 种 AI 人格
```

---

### 步骤 4：验证（V2 版本）

```bash
npx tsx scripts/validate-phase3-v2.ts
```

**验证项：**
- ✅ 15 种目标类型
- ✅ 14 种 AI 人格（10+3+1）
- ✅ 4 个扩展/变体人格的继承关系正确
- ✅ 关键目标类型的人格映射正确

---

## 📊 核心架构速览

### AI 人格层级

```
10 种核心人格 (Core)
  ├── Companion, Coach, Analyst, Mentor, Advisor
  ├── Reflector, Therapist, Challenger, Strategist, Guardian
  
3 种扩展人格 (Extended)
  ├── Philosopher ← Mentor
  ├── Explorer ← Mentor
  └── Habit Builder ← Coach
  
1 种变体人格 (Variant)
  └── Taskmaster ← Coach
```

### 目标 → 人格映射（关键）

| 目标类型 | 核心人格 | 扩展/变体 |
|---------|---------|----------|
| task | **coach** | → taskmaster (变体) |
| meaning | **mentor** | → philosopher (扩展) |
| habit | **coach** | → habit_builder (扩展) |
| exploration | **mentor** | → explorer (扩展) |

---

## 📁 文件清单

| 文件 | 用途 | 版本 |
|-----|------|------|
| `migrate-db-phase-3-v2.sql` | 数据库迁移 | ✅ V2 |
| `seed-goal-types.ts` | 目标类型初始化 | ✅ 已修正 |
| `seed-ai-personas-v2.ts` | AI 人格初始化 | ✅ V2（新） |
| `validate-phase3-v2.ts` | 数据验证 | ✅ V2（新） |

❌ **弃用文件**：`seed-ai-personas.ts`（旧版本，不使用）

---

## ✅ 验收标准

运行验证脚本后，应看到：

```
🔍 Phase 3 V2 数据验证开始...

✅ 目标类型数量正确: 15 种
✅ AI 人格数量和类型分布正确
✅ 所有人格继承关系正确
✅ 所有核心人格的 parent_persona_code 为 NULL
✅ 所有关键目标类型的人格映射正确

🎉 所有验证通过！Phase 3 V2 架构正确。
```

---

## 🆘 常见问题

### Q1：为什么 task 不直接指向 taskmaster？

**A**：Taskmaster 是 Coach 的**变体人格**，不是独立核心人格。目标类型的 `default_persona_code` 必须指向核心人格。系统会在匹配时自动识别是否需要使用变体。

### Q2：Philosopher/Explorer/Habit Builder 是什么关系？

**A**：它们是**扩展人格**，继承自核心人格（Mentor 或 Coach），增强了特定能力维度。

### Q3：如何知道某个目标应该用扩展/变体人格？

**A**：在 `goal_types` 表的 `characteristics` 字段中，有 `'人格扩展'` 或 `'人格变体'` 标识。匹配逻辑会自动处理。

---

## 📚 详细文档

- **修正说明**：`docs/PHASE3_V2_PRECISE_EXECUTION.md`
- **理论依据**：`docs/AI_PERSONA_MATCHING_SYSTEM.md`

---

**准备好了吗？开始执行步骤 1！** 🚀


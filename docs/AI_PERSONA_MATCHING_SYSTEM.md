# DaysFromToday AI 助手自动选择系统设计文档

> **版本**: V3.0  
> **日期**: 2025-10-31  
> **状态**: 理论指导与技术实现方案

---

## 📋 目录

1. [设计哲学](#设计哲学)
2. [理论基础](#理论基础)
3. [目标类型分类体系](#目标类型分类体系)
4. [AI 人格设计体系](#ai-人格设计体系)
5. [匹配决策逻辑](#匹配决策逻辑)
6. [数据库架构设计](#数据库架构设计)
7. [技术实现方案](#技术实现方案)
8. [未来演进路线](#未来演进路线)

---

## 🎯 设计哲学

### **核心理念**

> **AI 人格不是用户选择的"皮肤"，而是系统根据目标特征自动匹配的"认知代理（Cognitive Agent）"。**

### **三大原则**

#### **1. 任务匹配原则（Task-Fit Principle）**

AI 的人格、语气、知识能力应该与目标的**类型、难度、时间跨度、情绪基调**精确匹配。

**反例**：学习目标却被高能量 AI 催促式陪伴 → 焦虑  
**正例**：学习目标匹配成长型 AI，启发式引导 → 内在动机

#### **2. 情绪调节原则（Emotional Counterbalance）**

AI 的使命不是"放大用户情绪"，而是"调频"——帮助用户维持最适合实现目标的心理状态。

| 用户情绪 | AI 理想风格 | 目标 |
|---------|------------|------|
| 焦虑、紧张 | Calm Analytical（冷静分析型） | 稳定情绪，恢复理性 |
| 拖延、倦怠 | Energetic Coach（激励教练型） | 激活行动，制造启动能量 |
| 兴奋、躁动 | Mentor（成长导师型） | 稳定节奏，预防透支 |
| 平淡、冷漠 | Companion（温暖陪伴型） | 唤起意义感与期待感 |

#### **3. 渐进式复杂度原则（Progressive Complexity）**

系统从简单开始，逐步演进：

- **V3.0**（MVP）：关键词匹配 + 静态规则
- **V3.5**（进阶）：多维度匹配 + 规则引擎
- **V4.0**（智能）：机器学习推荐 + 自适应优化

---

## 📚 理论基础

### **全球主流目标科学理论整合**

| 理论体系 | 核心思想 | 应用场景 |
|---------|---------|---------|
| **SMART 原则** | 目标必须是 Specific、Measurable、Achievable、Relevant、Time-bound | 所有类型目标的初始设定 |
| **WOOP 模型**（Gabriele Oettingen） | Wish → Outcome → Obstacle → Plan，提升执行力 | 应对目标困难、情绪波动时的 AI 干预逻辑 |
| **执行意图理论**（Peter Gollwitzer） | 把目标转化成"如果-那么"形式（If-Then Plan） | AI 帮用户生成执行计划 |
| **目标设定理论**（Locke & Latham） | 目标的"难度"与"清晰度"共同决定动机与表现 | AI 推荐目标难度与分阶段设定 |
| **Kaizen 持续改进哲学** | 持续的小步改进 + 每日复盘（PDCA） | AI 每日回顾功能、微进步追踪 |
| **自我决定理论**（Deci & Ryan） | 内在动机来源于：自主性、胜任感、连接感 | AI 陪伴模型设计的心理基础 |
| **期望-价值理论**（Vroom） | 行动动机 = 期望值 × 结果价值 | AI 预测"放弃概率"与"激励提醒强度" |

### **目标达成的五个通用阶段**

| 阶段 | 用户心理状态 | AI 辅助逻辑 |
|-----|------------|------------|
| **1️⃣ 意图形成**（Intention Formation） | 兴奋、模糊、理想化 | 帮助 SMART 化目标，转化为可量化目标 |
| **2️⃣ 计划制定**（Planning） | 有动机但缺路径 | AI 生成 If-Then 执行计划；建议资源、时间分配 |
| **3️⃣ 执行行动**（Execution） | 波动、干扰多 | AI 每日推送微行动、进度追踪、激励语 |
| **4️⃣ 障碍应对**（Obstacle Management） | 焦虑、放弃倾向 | 触发 WOOP 干预 + 提醒初衷 + 微成功反馈 |
| **5️⃣ 反思复盘**（Reflection） | 理性、成长 | AI 自动生成复盘报告 + 提供改进建议 |

---

## 🗂️ 目标类型分类体系

### **15 种核心目标类型**

| # | 目标类型 | 代码 | 细分目标举例 | 预期特点 | 推荐 AI 人格 |
|---|---------|-----|------------|---------|-------------|
| 1 | 🏖 **生活型** | `life` | 生日、纪念日、聚会、旅行、节日 | 高期待感、情绪导向、短周期 | 💬 Companion（陪伴型） |
| 2 | 🧘 **健康型** | `health` | 减脂、跑步、康复、治疗、作息 | 明确目标、高波动性、需长期坚持 | 🎓 Coach（教练型） |
| 3 | 💼 **工作型** | `work` | 项目、汇报、会议、市场活动、创业 | 多任务、高压力、结构复杂 | 🧠 Analyst（分析型） |
| 4 | 💰 **财务型** | `finance` | 收入、支出、投资、还款、储蓄 | 数据导向、周期长、重理性 | 🧮 Advisor（理财顾问型） |
| 5 | 🛍 **消费型** | `consumption` | 买礼物、购物、买车、买房 | 强欲望、冲动决策、短期满足 | 🪞 Reflector（价值校准型） |
| 6 | 🧑‍🎓 **任务型** | `task` | 作业、考试、论文、答辩、升学 | 明确目标、外部约束强 | 🎓 Coach（教练型）→ 📋 Taskmaster 变体 |
| 7 | 📚 **学习型** | `learning` | 读书、写作、技能、语言学习 | 长周期、内在动机主导 | 🌱 Mentor（成长型） |
| 8 | 🧩 **人际型** | `relationship` | 家人关系、沟通、团队协作 | 情绪主导、反馈敏感 | 💬 Companion（陪伴型） |
| 9 | ⛪️ **精神型** | `meaning` | 人生目标、信念、使命、方向 | 高抽象、低可量化 | 🌱 Mentor → 🕊 Philosopher 扩展 |
| 10 | 🧱 **习惯型** | `habit` | 早睡、写日记、每日锻炼 | 高重复性、低即时奖励 | 🎓 Coach → 🔁 Habit Builder 扩展 |
| 11 | 🧭 **长期规划型** | `planning` | 未来 3 年职业/财务/家庭计划 | 不确定性高、需分阶段管理 | 🧑‍💼 Strategist（规划型） |
| 12 | ⚕️ **康复型** | `recovery` | 手术后康复、情绪恢复、失眠调整 | 身心双重波动、需共情陪伴 | 🫶 Therapist（疗愈型） |
| 13 | 🧨 **挑战型** | `challenge` | 创业转型、出版、马拉松、重大考试 | 高风险高回报、跨舒适区 | 🔥 Challenger（突破型） |
| 14 | 🔬 **探索型** | `exploration` | 学新领域、尝试副业、艺术创作 | 模糊目标、需持续试错 | 🌱 Mentor → 🧩 Explorer 扩展 |
| 15 | 🧍 **自我管理型** | `self_discipline` | 控制拖延、时间管理、专注力 | 内耗高、波动大 | ⏳ Guardian（纪律型） |

### **关键词库示例**

```json
{
  "health": {
    "zh": ["减肥", "健身", "跑步", "锻炼", "康复", "治疗", "减脂", "增肌", "运动", "手术"],
    "en": ["fitness", "workout", "lose weight", "exercise", "recovery", "gym", "diet", "health"]
  },
  "work": {
    "zh": ["项目", "汇报", "会议", "创业", "路演", "上线", "市场", "出差", "销售"],
    "en": ["project", "meeting", "startup", "launch", "presentation", "business", "sales"]
  },
  "learning": {
    "zh": ["学习", "读书", "写作", "考试", "论文", "答辩", "毕业", "升学"],
    "en": ["learning", "study", "reading", "exam", "thesis", "writing", "education"]
  }
}
```

---

## 🤖 AI 人格设计体系

### **8 种核心 AI 人格**

| 人格代码 | 中文名 | 英文名 | Emoji | 核心特征 | 语气风格 | 知识领域 | 适用目标类型 |
|---------|-------|-------|-------|---------|---------|---------|------------|
| `coach` | 教练型 | Coach | 🎓 | 坚定、理性、鼓励型 | Calm Motivational | 健身、心理学、行为科学 | health, habit |
| `companion` | 陪伴型 | Companion | 💬 | 温暖、共情、轻松型 | Warm & Casual | 情感支持、日常管理 | life, relationship |
| `analyst` | 分析型 | Analyst | 🧠 | 清晰、逻辑、简洁型 | Clear & Concise | 项目管理、时间管理 | work, finance |
| `mentor` | 成长型 | Mentor | 🌱 | 启发式、反思型 | Warm & Inspiring | 学习方法、认知科学 | learning, planning |
| `advisor` | 顾问型 | Advisor | 🧮 | 冷静、稳重、策略导向 | Calm & Strategic | 投资分析、预算规划 | finance, planning |
| `taskmaster` | 执行型 | Taskmaster | 📋 | 严谨、结构化、节奏清晰 | Direct & Structured | 时间管理、任务分解 | task, self_discipline |
| `therapist` | 疗愈型 | Therapist | 🫶 | 温柔、倾听、慢节奏 | Gentle & Supportive | CBT、正念、心理支持 | recovery, relationship |
| `challenger` | 突破型 | Challenger | 🔥 | 励志、战略、节奏控制 | Energetic & Strategic | Flow 理论、挑战心理学 | challenge, exploration |

### **人格特征详细配置**

#### **Coach（教练型）**

```yaml
code: coach
name_zh: 教练型
name_en: Coach
avatar_emoji: 🎓
color_theme: blue

core_traits:
  - 坚定但不强硬
  - 理性但有温度
  - 结构化但灵活

tone_templates:
  start: "很好！我们一起制定一个清晰的计划。"
  in_progress: "你已经完成了 {progress}%，继续保持这个节奏。"
  obstacle: "遇到困难很正常，我们来拆解一下问题。"
  near_end: "你距离目标只差最后一步了，坚持住！"

knowledge_domains:
  - 健身科学
  - 行为心理学
  - WOOP 模型
  - Implementation Intention

suitable_for:
  goal_types: [health, habit]
  difficulty_levels: [medium, hard, extreme]
  emotional_states: [anxious, determined]

intervention_logic:
  if_progress_stalled_for_3_days:
    action: trigger_WOOP_reappraisal
  if_emotion_detected_frustrated:
    action: switch_to_therapist
```

#### **Companion（陪伴型）**

```yaml
code: companion
name_zh: 陪伴型
name_en: Companion
avatar_emoji: 💬
color_theme: warm

core_traits:
  - 温暖而非软弱
  - 共情而非同情
  - 轻松而不散漫

tone_templates:
  start: "听起来是个让人期待的日子！我们一起准备吧。"
  in_progress: "你现在的心情怎么样？有什么想分享的吗？"
  near_end: "马上就要到啦！想想到时候的感觉～"

knowledge_domains:
  - 情感支持
  - 日历管理
  - Anticipatory Joy（预期快乐）
  - 记忆强化

suitable_for:
  goal_types: [life, relationship]
  difficulty_levels: [easy, medium]
  emotional_states: [excited, calm, nostalgic]
```

---

## 🧮 匹配决策逻辑

### **V3.0 匹配流程（关键词 + 静态规则）**

```
┌─────────────────┐
│ 用户输入目标文本  │
│ "我要30天减10斤" │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Step 1: 目标类型识别 │
│ → 关键词匹配         │
│ → "减" → health     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Step 2: 难度计算     │
│ → 量化目标: "10斤"   │
│ → 时间跨度: 30天     │
│ → 难度: medium      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Step 3: 查表匹配     │
│ → goal_types 表      │
│ → default_persona    │
│ → coach             │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Step 4: 返回结果     │
│ ✅ persona: coach   │
│ ✅ tone: calm       │
│ ✅ frameworks: WOOP │
└─────────────────────┘
```

### **匹配算法伪代码**

```typescript
function matchAIPersona(goalText: string, days: number) {
  // 1. 目标类型识别（关键词匹配）
  const goalType = detectGoalType(goalText);
  
  // 2. 难度计算
  const difficulty = calculateDifficulty(goalText, days);
  
  // 3. 查询目标类型配置
  const config = db.query(`
    SELECT default_persona_code, default_tone, default_frameworks
    FROM goal_types
    WHERE code = ?
  `, [goalType]);
  
  // 4. 返回匹配结果
  return {
    goalType: goalType,
    difficulty: difficulty,
    personaCode: config.default_persona_code,
    tone: config.default_tone,
    frameworks: config.default_frameworks
  };
}

function detectGoalType(text: string): string {
  const keywords = loadKeywordsFromDB();
  
  for (const [type, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (text.includes(word)) {
        return type; // 返回第一个匹配的类型
      }
    }
  }
  
  return 'general'; // 默认
}

function calculateDifficulty(text: string, days: number): string {
  let score = 0;
  
  // 规则 1: 量化目标 +1
  if (/\d+/.test(text)) score += 1;
  
  // 规则 2: 短期目标（<30天）+1
  if (days < 30) score += 1;
  
  // 规则 3: 包含"每天"、"坚持" +1
  if (text.includes('每天') || text.includes('坚持')) score += 1;
  
  // 规则 4: 长期目标（>180天）-1
  if (days > 180) score -= 1;
  
  // 映射分数到难度级别
  if (score <= 0) return 'easy';
  if (score <= 2) return 'medium';
  return 'hard';
}
```

---

## 🗄️ 数据库架构设计

### **核心表结构（V3.0）**

#### **1. `goal_types` - 目标类型库**

```sql
CREATE TABLE goal_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 分类信息
  code VARCHAR(50) NOT NULL UNIQUE,
  name_zh VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  
  -- 识别规则
  keywords_zh TEXT[] NOT NULL,
  keywords_en TEXT[] NOT NULL,
  
  -- 匹配规则
  default_persona_code VARCHAR(50) NOT NULL,
  default_tone VARCHAR(50),
  default_frameworks TEXT[],
  
  -- 特征描述（用于 AI 理解）
  characteristics JSONB,
  
  -- 元数据
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goal_types_code ON goal_types(code);
CREATE INDEX idx_goal_types_persona ON goal_types(default_persona_code);
```

#### **2. `ai_personas` - AI 人格库**

```sql
CREATE TABLE ai_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 基础信息
  code VARCHAR(50) NOT NULL UNIQUE,
  name_zh VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  
  -- 视觉呈现
  avatar_emoji VARCHAR(10),
  color_theme VARCHAR(20),
  
  -- 核心特征
  core_trait_zh VARCHAR(200),
  core_trait_en VARCHAR(200),
  tone_description TEXT,
  
  -- 语气模板（不同阶段）
  tone_templates JSONB,
  
  -- 能力配置
  knowledge_domains TEXT[],
  suitable_goal_types TEXT[],
  suitable_difficulty_levels TEXT[],
  
  -- 干预逻辑
  intervention_rules JSONB,
  
  -- 元数据
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_personas_code ON ai_personas(code);
CREATE INDEX idx_personas_goal_types ON ai_personas USING GIN(suitable_goal_types);
```

#### **3. `goal_cards` - 用户目标卡片（增强版）**

```sql
CREATE TABLE goal_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- 目标内容
  goal_text TEXT NOT NULL,
  target_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  card_type VARCHAR(20) DEFAULT 'future',
  
  -- AI 匹配结果
  goal_type_code VARCHAR(50) REFERENCES goal_types(code),
  detected_difficulty VARCHAR(20),
  ai_persona_code VARCHAR(50) REFERENCES ai_personas(code),
  ai_tone VARCHAR(50),
  
  -- AI 生成内容
  ai_analysis TEXT,
  ai_summary TEXT,
  ai_model_used VARCHAR(50) DEFAULT 'deepseek',
  input_language VARCHAR(10) NOT NULL,
  
  -- 匹配元数据
  matching_metadata JSONB,
  /*
  {
    "detected_keywords": ["减肥", "10斤"],
    "confidence_score": 0.95,
    "fallback_used": false,
    "matched_at": "2025-10-31T10:30:00Z"
  }
  */
  
  -- 人格切换历史
  persona_switch_history JSONB,
  /*
  [
    {
      "from": "coach",
      "to": "therapist",
      "reason": "user_frustrated",
      "timestamp": "2025-11-05T14:20:00Z"
    }
  ]
  */
  
  -- 进度管理
  progress_percentage INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  
  -- 元数据
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goal_cards_type ON goal_cards(goal_type_code);
CREATE INDEX idx_goal_cards_persona ON goal_cards(ai_persona_code);
CREATE INDEX idx_goal_cards_user ON goal_cards(user_id, created_at DESC);
CREATE INDEX idx_goal_cards_difficulty ON goal_cards(detected_difficulty);
```

#### **4. `ai_prompt_templates` - 提示词模板（重构版）**

```sql
CREATE TABLE ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 多维度匹配键
  persona_code VARCHAR(50) NOT NULL REFERENCES ai_personas(code),
  goal_type_code VARCHAR(50) NOT NULL REFERENCES goal_types(code),
  difficulty_level VARCHAR(20) NOT NULL,
  stage VARCHAR(30) NOT NULL,
  output_language VARCHAR(10) NOT NULL,
  
  -- 提示词内容
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  
  -- 方法论引用
  frameworks_applied TEXT[],
  
  -- 元数据
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (persona_code, goal_type_code, difficulty_level, stage, output_language, version)
);

CREATE INDEX idx_prompt_match ON ai_prompt_templates(
  persona_code, goal_type_code, difficulty_level, stage, output_language
) WHERE is_active = true;
```

---

## ⚙️ 技术实现方案

### **核心函数实现**

#### **1. 目标类型识别**

```typescript
// lib/goal-type-detector.ts

export async function detectGoalType(goalText: string): Promise<string> {
  const supabase = createClient();
  
  // 查询所有活跃的目标类型
  const { data: goalTypes } = await supabase
    .from('goal_types')
    .select('code, keywords_zh, keywords_en')
    .eq('is_active', true);
  
  if (!goalTypes) return 'general';
  
  const text = goalText.toLowerCase();
  
  // 关键词匹配（支持中英文）
  for (const type of goalTypes) {
    const allKeywords = [...type.keywords_zh, ...type.keywords_en];
    
    for (const keyword of allKeywords) {
      if (text.includes(keyword.toLowerCase())) {
        return type.code;
      }
    }
  }
  
  return 'general'; // 默认兜底
}
```

#### **2. 难度计算**

```typescript
// lib/difficulty-calculator.ts

export function calculateDifficulty(
  goalText: string,
  days: number
): 'easy' | 'medium' | 'hard' | 'extreme' {
  let score = 0;
  
  // 规则 1: 包含量化指标（数字）
  const hasNumbers = /\d+/.test(goalText);
  if (hasNumbers) score += 1;
  
  // 规则 2: 短期目标（压力大）
  if (days < 30) score += 1;
  if (days < 7) score += 1;
  
  // 规则 3: 长期目标（难以坚持）
  if (days > 180) score += 1;
  if (days > 365) score += 1;
  
  // 规则 4: 包含高频词（"每天"、"坚持"）
  const highFreqWords = ['每天', '坚持', 'daily', 'every day', 'persist'];
  if (highFreqWords.some(word => goalText.includes(word))) {
    score += 1;
  }
  
  // 规则 5: 包含挑战性词汇
  const challengeWords = ['突破', '改变', '戒', 'breakthrough', 'quit', 'transform'];
  if (challengeWords.some(word => goalText.includes(word))) {
    score += 2;
  }
  
  // 映射分数
  if (score <= 1) return 'easy';
  if (score <= 3) return 'medium';
  if (score <= 5) return 'hard';
  return 'extreme';
}
```

#### **3. AI 人格匹配**

```typescript
// lib/persona-matcher.ts

export async function matchPersona(params: {
  goalText: string;
  days: number;
}): Promise<{
  goalType: string;
  difficulty: string;
  personaCode: string;
  tone: string;
  frameworks: string[];
}> {
  const supabase = createClient();
  
  // Step 1: 识别目标类型
  const goalType = await detectGoalType(params.goalText);
  
  // Step 2: 计算难度
  const difficulty = calculateDifficulty(params.goalText, params.days);
  
  // Step 3: 查询匹配配置
  const { data: config } = await supabase
    .from('goal_types')
    .select(`
      default_persona_code,
      default_tone,
      default_frameworks
    `)
    .eq('code', goalType)
    .single();
  
  if (!config) {
    throw new Error(`Goal type not found: ${goalType}`);
  }
  
  return {
    goalType,
    difficulty,
    personaCode: config.default_persona_code,
    tone: config.default_tone,
    frameworks: config.default_frameworks || []
  };
}
```

#### **4. 提示词获取（增强版）**

```typescript
// lib/prompt-fetcher.ts

export async function fetchPrompt(params: {
  personaCode: string;
  goalType: string;
  difficulty: string;
  stage: string;
  language: string;
  goalText: string;
  days: number;
  targetDate: string;
}): Promise<{
  systemPrompt: string;
  userPrompt: string;
  frameworks: string[];
}> {
  const supabase = createClient();
  
  // 查询匹配的提示词
  const { data: prompt } = await supabase
    .from('ai_prompt_templates')
    .select('*')
    .eq('persona_code', params.personaCode)
    .eq('goal_type_code', params.goalType)
    .eq('difficulty_level', params.difficulty)
    .eq('stage', params.stage)
    .eq('output_language', params.language)
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .limit(1)
    .single();
  
  if (!prompt) {
    throw new Error('No matching prompt found');
  }
  
  // 替换模板变量
  const userPrompt = prompt.user_prompt_template
    .replace(/{goalText}/g, params.goalText)
    .replace(/{days}/g, params.days.toString())
    .replace(/{targetDate}/g, params.targetDate);
  
  return {
    systemPrompt: prompt.system_prompt,
    userPrompt,
    frameworks: prompt.frameworks_applied || []
  };
}
```

---

## 🚀 未来演进路线

### **V3.5（Q2 2026）- 规则引擎**

**新增能力**：
- ✨ 情绪检测（基于语气词、标点符号）
- ✨ 动态人格切换（基于进度、情绪变化）
- ✨ 规则引擎（支持复杂条件匹配）

**新增表**：
```sql
-- 匹配规则表
CREATE TABLE ai_matching_rules (
  rule_name VARCHAR(100),
  conditions JSONB, -- {"goal_type": "health", "emotion": "frustrated"}
  actions JSONB,    -- {"switch_persona_to": "therapist"}
  priority INTEGER
);

-- 情绪日志表
CREATE TABLE user_emotion_logs (
  user_id UUID,
  card_id UUID,
  detected_emotion VARCHAR(50),
  detection_method VARCHAR(50)
);
```

### **V4.0（Q4 2026）- AI 驱动**

**新增能力**：
- 🤖 机器学习推荐（基于历史数据）
- 🤖 A/B 测试系统（不同人格效果对比）
- 🤖 自适应优化（根据用户反馈自动调整）

**新增表**：
```sql
-- 用户偏好表
CREATE TABLE user_preferences (
  user_id UUID,
  preferred_persona_code VARCHAR(50),
  learning_style VARCHAR(50),
  historical_success_rate DECIMAL
);

-- 效果追踪表
CREATE TABLE persona_effectiveness (
  persona_code VARCHAR(50),
  goal_type_code VARCHAR(50),
  completion_rate DECIMAL,
  avg_satisfaction_score DECIMAL
);
```

---

## 📊 总结：系统能力矩阵

| 能力维度 | V3.0（当前） | V3.5（规则引擎） | V4.0（AI 驱动） |
|---------|------------|----------------|----------------|
| **目标识别** | 关键词匹配 | 关键词 + 语义分析 | NLP 语义理解 |
| **难度计算** | 规则打分 | 规则 + 历史数据 | ML 模型预测 |
| **人格匹配** | 静态表查询 | 规则引擎 | ML 推荐 |
| **情绪识别** | 无 | 关键词检测 | 情感分析模型 |
| **人格切换** | 无 | 基于规则自动切换 | 预测最佳切换时机 |
| **效果优化** | 人工调整 | A/B 测试 | 自适应优化 |

---

## 🎯 核心成功指标

1. **匹配准确率**：AI 人格与目标类型的匹配正确率 ≥ 90%
2. **用户满意度**：AI 建议的有用性评分 ≥ 4.5/5.0
3. **目标完成率**：使用 AI 助手的用户目标完成率提升 ≥ 30%
4. **切换合理性**：人格切换后用户留存率 ≥ 85%

---

**文档版本**: V3.0  
**最后更新**: 2025-10-31  
**维护者**: DaysFromToday AI Team  
**状态**: 活跃开发中 🚀


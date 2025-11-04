# DaysFromToday AI 智能化实现总结

**文档日期**: 2025-11-04  
**当前版本**: V3.0.1  
**总结范围**: AI智能化功能的实现情况、逻辑流程与待优化点

---

## 📋 一、用户体验流程 (前台)

当用户输入**目标日期**和**预期目标**后,系统提供以下智能化体验:

| 序号 | 功能点 | 实现状态 | 说明 |
|------|--------|---------|------|
| 1 | 判断用户目标,匹配AI助手 | ✅ **已实现** | 基于关键词和目标类型 |
| 2 | 告知AI助手名字和类型及匹配理由 | ✅ **已实现** | 通过 AI 生成介绍文案 |
| 3 | 展示「任务列表」,告知思路 | 🟡 **部分实现** | 前端有动画任务列表,但内容固定 |
| 4 | AI思考链 (推理过程) | ✅ **已实现** | 使用 `<think>` 标签展示 |
| 5 | AI建议 (具体方案) | ✅ **已实现** | 结构化建议输出 |

---

## 🔧 二、后台逻辑实现 (a-h 详细分析)

### **a. 目标类型判断** ✅ **已实现**

**实现文件**: `lib/ai-matching/goal-type-detector.ts`

**核心逻辑**:
```typescript
export async function detectGoalType(goalText: string): Promise<GoalTypeDetectionResult> {
  // 1. 检测语言 (中文/英文)
  const language = detectLanguage(goalText);
  
  // 2. 从数据库获取所有活跃的目标类型 (带缓存,5分钟TTL)
  const { data: goalTypes } = await supabase
    .from('goal_types')
    .select('code, name_zh, name_en, keywords_zh, keywords_en, default_persona_code')
    .eq('is_active', true);
  
  // 3. 关键词匹配打分
  for (const type of goalTypes) {
    const keywords = language === 'zh' ? type.keywords_zh : type.keywords_en;
    const { matched, score } = matchKeywords(goalText, keywords);
    if (matched.length > 0) results.push({ type, matched, score });
  }
  
  // 4. 返回得分最高的类型
  results.sort((a, b) => b.score - a.score);
  return bestMatch;
}
```

**特点**:
- ✅ 支持**中英文**自动识别
- ✅ 基于**关键词匹配**算法
- ✅ 从**数据库**动态加载配置 (`goal_types` 表)
- ✅ **5分钟缓存**优化性能
- ✅ **降级方案**:数据库失败时使用内置关键词库

**数据源**: `goal_types` 表
- `code`: 目标类型代码 (如 `health`, `learning`, `work`)
- `keywords_zh/en`: 关键词数组
- `default_persona_code`: 默认推荐的AI助手

---

### **b. 助手类型匹配判断** ✅ **已实现**

**实现文件**: `lib/ai-matching/persona-matcher.ts`

**核心逻辑**:
```typescript
export async function matchAIPersona(
  goalTypeCode: string,
  difficultyLevel: DifficultyLevel,
  language: 'zh' | 'en'
): Promise<PersonaMatchResult> {
  // 1. 从 goal_types 表获取默认推荐人格
  const { data: goalType } = await supabase
    .from('goal_types')
    .select('default_persona_code, characteristics')
    .eq('code', goalTypeCode)
    .single();
  
  // 2. 获取推荐的人格详情
  const { data: personas } = await supabase
    .from('ai_personas')
    .select('*')
    .eq('is_active', true);
  
  // 3. 检查是否有扩展或变体人格更合适
  const extendedOrVariant = findExtendedOrVariantPersona(
    defaultPersona,
    personas,
    goalType.characteristics,
    difficultyLevel
  );
  
  // 4. 计算置信度
  const confidence = calculateConfidence(finalPersona, goalTypeCode, difficultyLevel);
  
  return {
    personaCode, personaName, personaCharacterName,
    emoji, confidence, reasoning
  };
}
```

**匹配规则**:
1. **基础匹配**: 基于目标类型 (`goal_types.default_persona_code`)
2. **扩展匹配**: 根据难度和特征选择扩展/变体人格
3. **人格继承**: 支持 `core` → `extended` → `variant` 继承链

**数据源**: `ai_personas` 表
- `code`: 人格代码 (如 `companion`, `coach`, `mentor`)
- `name_zh/en`: 人格类型名称 (如 "陪伴型", "教练型")
- `persona_name_zh/en`: 具体人物名字 (如 "小星", "艾力")
- `suitable_goal_types`: 适合的目标类型数组
- `suitable_difficulty_levels`: 适合的难度等级数组

---

### **c. AI助手的头像和昵称** ✅ **已实现**

**实现文件**: `lib/ai-assistants.ts`

**核心数据结构**:
```typescript
export const AI_ASSISTANTS: Record<string, AIAssistant> = {
  companion: {
    id: 'companion',
    name: 'Twinkle',           // 昵称
    type: '陪伴型',            // 类型
    emoji: '🌟',               // 头像(emoji)
    avatar: '/ai/companion.png', // 头像图片路径
    color: '#F59E0B',          // 主题色
    personality: { /* ... */ },
    promptPrefix: `你是 Twinkle...`,
    description: { en: '...', zh: '...' }
  },
  coach: {
    id: 'coach',
    name: '艾力',
    type: '教练型',
    emoji: '🏋️',
    // ...
  },
  // ... 其他10种核心助手
};
```

**当前配置**: **13 种 AI 助手**
- 10 种核心助手 (companion, coach, mentor, analyst, advisor, reflector, therapist, challenger, strategist, guardian)
- 3 种旧助手 (twinkle, labubu, jobs - 兼容性保留)

**特点**:
- ✅ 每个助手有**独特的名字、emoji、颜色、性格**
- ✅ 支持**中英文双语**
- ✅ 配置化管理,易于扩展

---

### **d. AI助手的智能推荐 (介绍文案)** ✅ **已实现**

**实现文件**: `app/api/ai/intro/route.ts`

**核心逻辑**:
```typescript
export async function POST(request: NextRequest) {
  const { goalText, personaName, personaType, language } = await request.json();
  
  // 调用 DeepSeek API 生成个性化介绍
  const apiResponse = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: getSystemPrompt(language) },
        { role: 'user', content: getUserPrompt(goalText, personaName, personaType, language) }
      ],
      temperature: 0.8 // 稍高温度,增加创意性
    })
  });
  
  return { intro: aiGeneratedText };
}
```

**系统提示词** (简化版):
```
你是一个专业的文案生成助手。生成一句简短、温暖、个性化的介绍文案。

要求:
1. 文案长度: 25-40 字
2. 风格: 温暖、鼓励、自然
3. 内容:
   - 简要评价用户的目标
   - 说明为什么匹配这位 AI 助手
   - 提及 AI 助手的名字和类型
4. 语气: 像朋友一样亲切

示例:
"你的目标很棒!我为你匹配了一位【教练型】的助手,他的名字叫艾力。"
```

**特点**:
- ✅ 使用 **DeepSeek Chat** 模型生成
- ✅ **个性化**:基于用户目标和助手特点
- ✅ **降级方案**:API失败时返回默认文案
- ✅ 支持中英文

---

### **e. 针对目标的任务列表** 🟡 **部分实现** (前端展示,内容未动态生成)

**前端实现**: `components/ThinkingTaskList.tsx`

**当前状态**:
- ✅ 前端有**动画任务列表**组件
- ✅ 展示 AI "正在思考" 的过程
- ❌ **任务内容是固定的**,不是根据具体目标动态生成

**当前固定任务列表**:
```typescript
const tasks = [
  { id: 1, text: '正在分析你的目标类型和难度...', status: 'pending' },
  { id: 2, text: '正在规划可行的实施路径...', status: 'pending' },
  { id: 3, text: '正在准备个性化建议...', status: 'pending' },
];
```

**改进方向** ⚠️:
1. 应该根据**目标类型和难度**动态生成任务列表
2. 任务列表应该反映真实的AI推理过程
3. 可以在 `<think>` 标签中提取关键步骤作为任务

**示例改进**:
```typescript
// 针对"14天减肥5kg"的动态任务列表
[
  { text: '评估减重目标的合理性 (每周约0.7kg)...', status: 'completed' },
  { text: '分析饮食和运动方案...', status: 'completed' },
  { text: '制定分阶段行动计划...', status: 'in_progress' },
]
```

---

### **f. 针对不同目标类型的动态Prompt** 🟡 **部分实现** (支持但未充分利用)

**实现文件**: `app/api/ai/chat/stream/route.ts`

**当前逻辑**:
```typescript
async function getPersonaPromptTemplate(
  personaCode: string,
  goalTypeCode: string,
  difficultyLevel: string,
  language: 'zh' | 'en'
) {
  // 1. 尝试从数据库获取定制化 Prompt
  const { data: template } = await supabase
    .from('ai_prompt_templates')
    .select('system_prompt, user_prompt_template')
    .eq('persona_code', personaCode)
    .eq('goal_type_code', goalTypeCode)
    .eq('difficulty_level', difficultyLevel)
    .eq('stage', 'start')
    .eq('output_language', language)
    .eq('is_active', true)
    .single();
  
  if (template) {
    return template; // ✅ 使用数据库定制Prompt
  }
  
  // 2. 降级方案:使用硬编码的默认Prompt
  return {
    system_prompt: getDefaultSystemPrompt(personaCode, language),
    user_prompt_template: getDefaultUserPrompt(language)
  };
}
```

**数据库表**: `ai_prompt_templates`
- `persona_code`: AI助手代码
- `goal_type_code`: 目标类型代码
- `difficulty_level`: 难度等级
- `stage`: 阶段 (start, midpoint, final)
- `system_prompt`: 系统提示词 (方法论、角色设定)
- `user_prompt_template`: 用户提示词模板

**当前状态**:
- ✅ **架构支持**:代码逻辑完整,可以从数据库加载不同的Prompt
- ⚠️ **数据不完整**:数据库中可能没有覆盖所有组合 (13助手 × 15目标类型 × 4难度 × 3阶段 × 2语言 = 4,680 条)
- ❌ **降级使用**:实际运行时大多使用 `getDefaultSystemPrompt` (硬编码)

**默认System Prompt** (硬编码,所有目标通用):
```typescript
function getDefaultSystemPrompt(personaCode: string, language: 'zh' | 'en'): string {
  return `你是专业的目标规划助手（${personaCode}），使用 DeepSeek Reasoner 模型。

🎯 你的核心能力:
1. 深入理解用户目标背后的动机
2. 提供真诚、个性化的建议
3. 展示你的推理过程
4. 根据目标类型调整语气

📝 回复格式:
<think>[思考过程,100-200字]</think>
## 💬 我的理解
## 🎯 我的建议
## ⚡ 实战技巧
## 💪 给你的鼓励
...`;
}
```

**改进方向** ⚠️:
1. **方法论库**:针对不同目标类型设计专业方法论
   - 健康类 → SMART目标 + BMI计算
   - 学习类 → 费曼学习法 + 间隔重复
   - 工作类 → GTD + 番茄工作法
   - 财务类 → 预算法则 + 复利计算

2. **动态Prompt生成**:
   ```typescript
   function getDynamicSystemPrompt(goalType, difficulty) {
     const methodology = METHODOLOGY_LIBRARY[goalType];
     return `你是${personaName}，专长于${goalType}目标规划。
     
     你掌握以下方法论:
     ${methodology.description}
     
     针对${difficulty}难度目标，你需要:
     ${methodology.strategies[difficulty]}
     ...`;
   }
   ```

3. **Prompt版本管理**:优化数据库表结构,支持A/B测试

---

### **g. AI的思考链 (Reasoning)** ✅ **已实现**

**实现方式**: 使用 **DeepSeek Reasoner** 模型 + `<think>` 标签

**核心逻辑**:
```typescript
// API 调用
const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
  body: JSON.stringify({
    model: 'deepseek-reasoner', // 推理模型
    messages: [
      {
        role: 'system',
        content: `你必须在回复开头使用 <think></think> 标签展示推理过程...`
      },
      { role: 'user', content: userGoal }
    ]
  })
});

// 流式输出解析
for await (const chunk of response.body) {
  if (chunk.includes('<think>')) {
    // 进入思考模式,内容发送到 thinking 通道
  } else if (chunk.includes('</think>')) {
    // 退出思考模式,后续内容是主要回复
  }
}
```

**前端展示**: `app/[locale]/wishlist/page.tsx`
```typescript
// 折叠的思考链面板
{streaming.thinking && (
  <details open className="bg-blue-50 p-4 rounded-lg mb-4">
    <summary className="font-semibold cursor-pointer">
      💭 AI正在思考
    </summary>
    <div className="mt-2 text-gray-700 whitespace-pre-wrap">
      {streaming.thinking}
    </div>
  </details>
)}
```

**思考链内容示例**:
```
用户想在14天内减肥5kg，目标日期是2025-11-18。
这个目标时间较短，平均每周需要减重约1.8kg。
根据健康标准，每周减重0.5-1kg较为安全，因此这个目标略显激进。
主要挑战:时间紧迫、需要严格控制饮食和高强度运动、容易反弹。
建议:适度降低预期,制定可持续的方案...
```

**特点**:
- ✅ 使用 **DeepSeek Reasoner** 推理模型
- ✅ **流式输出**:思考过程实时展示
- ✅ **可折叠**: `<details>` 标签,默认展开
- ✅ **双通道缓冲**: `thinking` 和 `content` 分离管理

---

### **h. AI的建议** ✅ **已实现**

**实现方式**: 结构化 Markdown 输出

**固定结构** (由 System Prompt 定义):
```markdown
## 💬 我的理解
[AI对用户目标的理解,2-3句话]

## 🎯 我的建议
[具体可行的建议,自然段落形式]
可能包含表格:
| 阶段 | 时间 | 任务 |
|------|------|------|
| 第一阶段 | 1-10天 | ... |

## ⚡ 实战技巧
[3-5个可操作的技巧]

## 💪 给你的鼓励
[1-2句真诚的鼓励]
```

**Markdown 实时渲染**: 使用 `ReactMarkdown` + `remark-gfm`
```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {streaming.content}
</ReactMarkdown>
```

**特点**:
- ✅ **结构化输出**:固定的章节结构
- ✅ **Markdown支持**:表格、列表、强调等
- ✅ **实时渲染**:流式输出边生成边显示
- ✅ **样式优化**:自定义CSS美化表格和代码块

---

## 📊 三、实现状态汇总表

| 功能模块 | 实现状态 | 数据来源 | 可配置性 | 智能化程度 |
|---------|---------|---------|---------|-----------|
| **a. 目标类型判断** | ✅ 完整实现 | 数据库 `goal_types` | ⭐️⭐️⭐️⭐️⭐️ 高 | ⭐️⭐️⭐️⭐️ 中高 |
| **b. 助手类型匹配** | ✅ 完整实现 | 数据库 `ai_personas` | ⭐️⭐️⭐️⭐️⭐️ 高 | ⭐️⭐️⭐️⭐️ 中高 |
| **c. 助手头像昵称** | ✅ 完整实现 | 硬编码配置 | ⭐️⭐️⭐️ 中 | ⭐️ 低 (静态) |
| **d. 智能推荐文案** | ✅ 完整实现 | DeepSeek API 生成 | ⭐️⭐️⭐️⭐️ 高 | ⭐️⭐️⭐️⭐️⭐️ 高 |
| **e. 动态任务列表** | 🟡 前端展示,内容固定 | 硬编码 | ⭐️ 低 | ⭐️ 低 (待优化) |
| **f. 动态Prompt库** | 🟡 支持但未充分利用 | 数据库 `ai_prompt_templates` (不完整) | ⭐️⭐️⭐️⭐️ 高 | ⭐️⭐️ 低 (降级使用硬编码) |
| **g. AI思考链** | ✅ 完整实现 | DeepSeek Reasoner 模型 | ⭐️⭐️⭐️⭐️ 高 | ⭐️⭐️⭐️⭐️⭐️ 高 |
| **h. AI建议输出** | ✅ 完整实现 | DeepSeek Reasoner 模型 | ⭐️⭐️⭐️⭐️ 高 | ⭐️⭐️⭐️⭐️⭐️ 高 |

---

## 🔄 四、完整的 AI 处理流程

```
┌─────────────────────────────────────────────┐
│ 用户输入: 目标文本 + 目标日期               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 1: 目标类型检测 (a)                         │
│ ├─ 检测语言 (中文/英文)                          │
│ ├─ 关键词匹配 (goal_types 表)                    │
│ └─ 返回: goalTypeCode, confidence, keywords      │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 2: 难度评估 (未在 a-h 中,但存在)             │
│ ├─ 基于时间跨度计算                               │
│ └─ 返回: difficultyLevel (easy/medium/hard/extreme) │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 3: AI 助手匹配 (b)                          │
│ ├─ 基于 goalTypeCode + difficultyLevel          │
│ ├─ 查询 ai_personas 表                           │
│ ├─ 检查扩展/变体人格                             │
│ └─ 返回: personaCode, name, emoji, reasoning    │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 4: 生成介绍文案 (d)                         │
│ ├─ 调用 /api/ai/intro                            │
│ ├─ 使用 DeepSeek Chat 模型                       │
│ └─ 返回: "你的目标很棒!我为你匹配了..."         │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 5: 前端展示任务列表 (e - 固定内容)          │
│ ├─ 显示动画任务列表 (ThinkingTaskList 组件)     │
│ └─ 任务: 分析目标 → 规划路径 → 准备建议          │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 6: 获取 AI Prompt (f)                       │
│ ├─ 尝试从 ai_prompt_templates 表查询             │
│ ├─ 失败则使用 getDefaultSystemPrompt (硬编码)    │
│ └─ 返回: systemPrompt, userPromptTemplate       │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 7: 调用 DeepSeek Reasoner 生成建议 (g + h)  │
│ ├─ 调用 /api/ai/chat/stream                      │
│ ├─ 使用 deepseek-reasoner 模型                   │
│ ├─ 流式输出:                                      │
│ │  ├─ <think> 标签内容 → thinking 通道 (g)       │
│ │  └─ 主要回复内容 → content 通道 (h)            │
│ └─ 前端实时渲染 Markdown                         │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│ Step 8: 保存到数据库                              │
│ ├─ 保存到 goal_cards 表                          │
│ └─ 关联: personaCode, goalTypeCode, aiAnalysis  │
└───────────────────────────────────────────────────┘
```

---

## ⚠️ 五、待优化的关键点

### 5.1 高优先级 🔴

#### **1. 动态任务列表生成 (e)**

**当前问题**:
- 任务列表内容是硬编码的,所有目标看到的都是相同内容
- 没有反映 AI 真实的推理过程

**优化方案**:
```typescript
// Option A: 从 <think> 标签中提取关键步骤
function extractTasksFromThinking(thinkingContent: string): Task[] {
  // 使用 NLP 或简单的规则提取思考中的关键动作词
  // "我需要分析..." → "正在分析目标可行性..."
  // "接下来规划..." → "正在规划实施路径..."
}

// Option B: 预定义任务模板库
const TASK_TEMPLATES = {
  health: [
    '评估健康目标的合理性和安全性...',
    '计算BMI和推荐的减重速度...',
    '制定饮食和运动方案...'
  ],
  learning: [
    '分析学习内容的难度和时间需求...',
    '设计学习路径和里程碑...',
    '准备学习资源和技巧...'
  ],
  // ...
};

function getDynamicTasks(goalType: string, difficulty: string): Task[] {
  return TASK_TEMPLATES[goalType] || TASK_TEMPLATES.default;
}
```

#### **2. 完善动态 Prompt 库 (f)**

**当前问题**:
- 数据库表 `ai_prompt_templates` 覆盖率低
- 大部分情况使用通用的硬编码 Prompt
- 没有针对不同目标类型的专业方法论

**优化方案**:
```typescript
// 1. 建立方法论库
const METHODOLOGY_LIBRARY = {
  health: {
    name: 'SMART健康目标法',
    description: '基于BMI、TDEE计算的科学减重方案',
    strategies: {
      easy: '每周0.5kg，重点饮食调整',
      medium: '每周0.7kg，饮食+有氧运动',
      hard: '每周1kg，严格控制+高强度训练',
    }
  },
  learning: {
    name: '费曼学习法 + 间隔重复',
    description: '通过教授他人和定期复习巩固知识',
    strategies: {
      easy: '每天30分钟，轻松阅读',
      medium: '每天1小时，笔记+实践',
      hard: '每天2-3小时，深度学习+项目',
    }
  },
  // ...
};

// 2. 动态生成 System Prompt
function getEnhancedSystemPrompt(personaCode, goalType, difficulty) {
  const methodology = METHODOLOGY_LIBRARY[goalType];
  return `你是${getAssistant(personaCode).name}，专长于${goalType}目标规划。

你掌握以下方法论:
${methodology.name}: ${methodology.description}

针对${difficulty}难度，策略是:
${methodology.strategies[difficulty]}

请根据这个方法论生成建议...`;
}

// 3. 批量填充数据库
async function seedPromptTemplates() {
  for (const persona of AI_ASSISTANTS) {
    for (const goalType of GOAL_TYPES) {
      for (const difficulty of DIFFICULTIES) {
        const prompt = getEnhancedSystemPrompt(persona, goalType, difficulty);
        await supabase.from('ai_prompt_templates').insert({
          persona_code: persona,
          goal_type_code: goalType,
          difficulty_level: difficulty,
          system_prompt: prompt,
          // ...
        });
      }
    }
  }
}
```

---

### 5.2 中优先级 🟡

#### **3. AI 助手配置数据库化 (c)**

**当前问题**:
- AI 助手信息硬编码在 `lib/ai-assistants.ts`
- 修改需要重新部署代码

**优化方案**:
- 将 `AI_ASSISTANTS` 配置移入 `ai_personas` 表
- 支持在后台动态管理助手信息

#### **4. A/B 测试 Prompt 效果**

**优化方案**:
- 在 `ai_prompt_templates` 表添加 `version` 字段
- 记录每个 Prompt 的使用效果 (用户反馈、完成率)
- 根据数据优化 Prompt

---

### 5.3 低优先级 🟢

#### **5. 多轮对话支持**

**当前状态**: 单轮生成,没有持续对话

**优化方案**:
- 保存对话历史
- 支持追问和澄清
- 动态调整建议

#### **6. 用户偏好学习**

**优化方案**:
- 记录用户选择的助手类型
- 学习用户的目标风格
- 自动调整匹配规则

---

## 📈 六、数据统计

### 当前配置规模
- **AI 助手数**: 13 个 (10核心 + 3旧)
- **目标类型**: 15 种 (health, learning, work, finance, etc.)
- **难度等级**: 4 种 (easy, medium, hard, extreme)
- **语言支持**: 2 种 (zh, en)
- **阶段**: 3 种 (start, midpoint, final)

### 理论 Prompt 模板数
```
13 助手 × 15 目标类型 × 4 难度 × 2 语言 × 3 阶段 = 4,680 条
```

### 实际 Prompt 覆盖率
```
数据库中的模板数: 待统计
覆盖率: < 5% (估算)
降级使用硬编码: > 95%
```

---

## 💡 七、核心经验总结

### 7.1 成功的设计

✅ **1. 关键词匹配算法 (a)**
- 简单有效,准确率高
- 支持多语言
- 降级方案完善

✅ **2. DeepSeek Reasoner + `<think>` 标签 (g)**
- 推理过程透明化
- 用户信任度高
- 技术方案成熟

✅ **3. 流式输出 + Markdown 渲染 (h)**
- 用户体验极佳
- 实时反馈
- 内容结构清晰

### 7.2 待改进的设计

⚠️ **1. 任务列表固定内容 (e)**
- 没有体现真实的 AI 推理
- 所有目标看到的都一样
- 应该动态生成

⚠️ **2. Prompt 库覆盖率低 (f)**
- 大量依赖硬编码
- 没有专业方法论
- 无法针对性优化

### 7.3 核心原则

> **"AI 智能化的核心是「理解 + 推理 + 生成」"**

> **"配置化 > 硬编码,数据库 > 文件"**

> **"降级方案是必需的,但不应该成为主要路径"**

---

## 📚 八、相关文档索引

### 技术实现
- `lib/ai-matching/goal-type-detector.ts` - 目标类型检测
- `lib/ai-matching/persona-matcher.ts` - AI 助手匹配
- `lib/ai-assistants.ts` - AI 助手配置
- `app/api/ai/intro/route.ts` - 介绍文案生成
- `app/api/ai/chat/stream/route.ts` - AI 建议生成 (流式)
- `components/ThinkingTaskList.tsx` - 任务列表组件

### 数据库设计
- `goal_types` 表 - 目标类型配置
- `ai_personas` 表 - AI 助手配置
- `ai_prompt_templates` 表 - Prompt 模板库
- `goal_cards` 表 - 用户目标卡片

### 经验文档
- `docs/experience/AI_STREAMING_BEST_PRACTICES.md` - AI 流式输出最佳实践
- `docs/technical/features/ai-assistants/` - AI 助手系统文档

---

**文档状态**: ✅ 完成  
**最后更新**: 2025-11-04  
**下次更新**: 实现动态任务列表后



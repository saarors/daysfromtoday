# AI 助手系统功能模块

**版本**: V3.0  
**状态**: Stable  
**最后更新**: 2024-11-04

---

## 📖 模块概述

AI助手系统提供13种不同人格的AI助手,并能根据用户目标自动匹配最合适的助手。

### 核心特性

- ✅ 13种AI人格 (10种核心 + 3种经典)
- ✅ 智能匹配算法 (目标类型+难度评估)
- ✅ 个性化交互体验
- ✅ 向后兼容

---

## 👥 助手列表

### 核心助手 (10种)

| 助手 | 类型 | 适用场景 |
|------|------|---------|
| 🌟 Twinkle | 陪伴型 | 日常目标、情感支持 |
| 🏋️ 艾力 | 教练型 | 学习、健身、技能提升 |
| 👔 林墨 | 导师型 | 职业发展、复杂决策 |
| 🧠 罗琪 | 分析型 | 数据分析、逻辑推理 |
| 🧮 宋安 | 顾问型 | 财务规划、风险管理 |
| 🪞 苏瑾 | 反思者 | 自我认知、深度思考 |
| 🫶 温语 | 疗愈型 | 情感困扰、心理调适 |
| 🔥 焰锋 | 挑战者 | 突破舒适区、激进目标 |
| ♟️ 沈策 | 战略家 | 长期规划、战略决策 |
| 🛡️ 卫宁 | 守护者 | 稳定维护、风险防范 |

### 经典助手 (3种 - 向后兼容)

| 助手 | 类型 | 说明 |
|------|------|------|
| Twinkle | 经典 | 原版温暖助手 |
| Labubu | 经典 | 活泼可爱助手 |
| Jobs | 经典 | 极简主义助手 |

---

## 🔧 核心文件

### 1. 配置: `lib/ai-assistants.ts`
```typescript
export const AI_ASSISTANTS: Record<string, AIAssistant> = {
  companion: {
    id: 'companion',
    name: 'Twinkle',
    emoji: '🌟',
    color: '#F59E0B',
    promptPrefix: '你是Twinkle,一个温暖的AI助手...',
    // ...
  },
  // ... 其他12个助手
};

export function getAssistant(id: string): AIAssistant {
  return AI_ASSISTANTS[id] || AI_ASSISTANTS['companion'];
}
```

### 2. 类型: `types/ai-assistant.ts`
```typescript
export type AIAssistantType = 
  | 'companion' | 'coach' | 'mentor' | 'analyst' | 'advisor'
  | 'reflector' | 'therapist' | 'challenger' | 'strategist' | 'guardian'
  | 'twinkle' | 'labubu' | 'jobs';

export interface AIAssistant {
  id: AIAssistantType;
  name: string;
  emoji: string;
  color: string;
  promptPrefix: string;
  // ...
}
```

### 3. 匹配算法: `lib/ai/match-goal-to-ai.ts`
```typescript
export async function matchGoalToAI(
  goalText: string,
  daysCount: number
): Promise<CompleteAIMatchResult> {
  // 1. 识别目标类型
  const goalType = identifyGoalType(goalText);
  
  // 2. 评估难度
  const difficulty = assessDifficulty(goalText, daysCount);
  
  // 3. 匹配人格
  const persona = matchPersona(goalType, difficulty);
  
  return { goalType, difficulty, persona };
}
```

---

## 🚀 使用示例

```typescript
import { getAssistant } from '@/lib/ai-assistants';
import { matchGoalToAI } from '@/lib/ai/match-goal-to-ai';

// 1. 智能匹配
const result = await matchGoalToAI('3个月内学会React', 90);
console.log(result.persona.code); // 'coach'

// 2. 获取助手配置
const assistant = getAssistant('coach');
console.log(assistant.name);  // '艾力'
console.log(assistant.emoji); // '🏋️'

// 3. 使用助手Prompt
const systemPrompt = assistant.promptPrefix + '\n\n用户目标: 3个月内学会React';
```

---

## 📚 相关文档

- [AI人格匹配系统](./AI_PERSONA_MATCHING_SYSTEM.md)
- [经验教训](../../../experience/LESSONS_LEARNED.md)

---

**维护者**: AI Coding Team














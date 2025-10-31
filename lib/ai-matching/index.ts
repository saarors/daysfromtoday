/**
 * AI 智能匹配服务（统一入口）
 * 
 * 功能：整合目标类型识别、难度评估、人格匹配
 * 提供一站式的 AI 匹配服务
 * 
 * 使用方式：
 * ```ts
 * const result = await matchGoalToAI({
 *   goalText: '我要三个月减10斤',
 *   daysCount: 90
 * });
 * ```
 */

export { detectGoalType, detectLanguage } from './goal-type-detector';
export type { GoalTypeDetectionResult } from './goal-type-detector';

export { calculateDifficulty } from './difficulty-calculator';
export type { DifficultyLevel, DifficultyAssessment } from './difficulty-calculator';

export { matchAIPersona } from './persona-matcher';
export type { PersonaMatchResult } from './persona-matcher';

import { detectGoalType, detectLanguage } from './goal-type-detector';
import { calculateDifficulty } from './difficulty-calculator';
import { matchAIPersona } from './persona-matcher';
import type { DifficultyLevel } from './difficulty-calculator';

/**
 * 完整的 AI 匹配结果
 */
export interface CompleteAIMatchResult {
  // 目标类型
  goalType: {
    code: string;
    name: string;
    confidence: number;
    matchedKeywords: string[];
  };
  
  // 难度评估
  difficulty: {
    level: DifficultyLevel;
    score: number;
    factors: {
      timeSpan: number;
      complexity: number;
      ambiguity: number;
      challenge: number;
    };
  };
  
  // AI 人格
  persona: {
    code: string;
    name: string;
    type: 'core' | 'extended' | 'variant';
    emoji: string;
    confidence: number;
    reasoning: string;
  };
  
  // 元数据
  metadata: {
    language: 'zh' | 'en';
    timestamp: string;
    fallbackUsed: boolean;
  };
}

/**
 * 主函数：完整的 AI 匹配流程
 * 
 * @param input - 输入参数
 * @returns 完整的匹配结果
 */
export async function matchGoalToAI(input: {
  goalText: string;
  daysCount: number;
  userPreferredPersona?: string;
}): Promise<CompleteAIMatchResult> {
  const { goalText, daysCount, userPreferredPersona } = input;

  // 1. 检测语言
  const language = detectLanguage(goalText);

  // 2. 识别目标类型
  const goalTypeResult = await detectGoalType(goalText);

  // 3. 计算难度
  const difficultyResult = calculateDifficulty(goalText, daysCount);

  // 4. 匹配 AI 人格
  const personaResult = await matchAIPersona(
    goalTypeResult.goalTypeCode,
    difficultyResult.level,
    language,
    userPreferredPersona
  );

  // 5. 组装完整结果
  return {
    goalType: {
      code: goalTypeResult.goalTypeCode,
      name: goalTypeResult.goalTypeName,
      confidence: goalTypeResult.confidence,
      matchedKeywords: goalTypeResult.matchedKeywords
    },
    difficulty: {
      level: difficultyResult.level,
      score: difficultyResult.score,
      factors: difficultyResult.factors
    },
    persona: {
      code: personaResult.personaCode,
      name: personaResult.personaName,
      type: personaResult.personaType,
      emoji: personaResult.emoji,
      confidence: personaResult.confidence,
      reasoning: personaResult.reasoning
    },
    metadata: {
      language,
      timestamp: new Date().toISOString(),
      fallbackUsed: personaResult.fallbackUsed
    }
  };
}

/**
 * 批量匹配（用于测试或批量处理）
 */
export async function matchGoalToAIBatch(
  inputs: Array<{
    goalText: string;
    daysCount: number;
    userPreferredPersona?: string;
  }>
): Promise<CompleteAIMatchResult[]> {
  return Promise.all(inputs.map(input => matchGoalToAI(input)));
}


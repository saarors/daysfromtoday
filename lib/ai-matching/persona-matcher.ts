/**
 * AI 人格匹配器
 * 
 * 功能：根据目标类型、难度、用户偏好等选择最佳 AI 人格
 * 支持人格继承和扩展（extended/variant）
 * 
 * 理论依据：docs/AI_PERSONA_MATCHING_SYSTEM.md
 */

import { createClient } from '@/lib/supabase/client';
import type { DifficultyLevel } from './difficulty-calculator';

export interface PersonaMatchResult {
  personaCode: string;
  personaName: string;
  personaCharacterName: string; // 新增：具体人物名字（如：艾力、Michael）
  personaType: 'core' | 'extended' | 'variant';
  emoji: string;
  confidence: number;
  reasoning: string;
  fallbackUsed: boolean;
}

interface AIPersona {
  code: string;
  name_zh: string;
  name_en: string;
  persona_name_zh: string;
  persona_name_en: string;
  persona_type: 'core' | 'extended' | 'variant';
  parent_persona_code: string | null;
  avatar_emoji: string;
  suitable_goal_types: string[];
  suitable_difficulty_levels: string[];
}

/**
 * 主函数：匹配 AI 人格
 * 
 * @param goalTypeCode - 目标类型代码
 * @param difficultyLevel - 难度等级
 * @param language - 输出语言
 * @param userPreferredPersona - 用户偏好的人格（可选，覆盖自动匹配）
 * @returns 匹配结果
 */
export async function matchAIPersona(
  goalTypeCode: string,
  difficultyLevel: DifficultyLevel,
  language: 'zh' | 'en' = 'zh',
  userPreferredPersona?: string
): Promise<PersonaMatchResult> {
  const supabase = createClient();

  // 1. 如果用户有偏好人格，直接使用
  if (userPreferredPersona) {
    const { data: preferredPersona } = await supabase
      .from('ai_personas')
      .select('*')
      .eq('code', userPreferredPersona)
      .eq('is_active', true)
      .single();

    if (preferredPersona) {
      return {
        personaCode: preferredPersona.code,
        personaName: language === 'zh' ? preferredPersona.name_zh : preferredPersona.name_en,
        personaCharacterName: language === 'zh' ? preferredPersona.persona_name_zh : preferredPersona.persona_name_en,
        personaType: preferredPersona.persona_type,
        emoji: preferredPersona.avatar_emoji,
        confidence: 1.0,
        reasoning: '使用用户偏好人格',
        fallbackUsed: false
      };
    }
  }

  // 2. 从 goal_types 表获取默认推荐人格
  const { data: goalType } = await supabase
    .from('goal_types')
    .select('default_persona_code, characteristics')
    .eq('code', goalTypeCode)
    .single();

  if (!goalType) {
    return getFallbackPersona(language);
  }

  const defaultPersonaCode = goalType.default_persona_code;

  // 3. 获取推荐的人格详情
  const { data: personas } = await supabase
    .from('ai_personas')
    .select('*')
    .eq('is_active', true);

  if (!personas || personas.length === 0) {
    return getFallbackPersona(language);
  }

  // 4. 找到默认人格
  const defaultPersona = personas.find(p => p.code === defaultPersonaCode);

  if (!defaultPersona) {
    return getFallbackPersona(language);
  }

  // 5. 检查是否有扩展或变体人格更合适
  const extendedOrVariant = findExtendedOrVariantPersona(
    defaultPersona,
    personas,
    goalType.characteristics,
    difficultyLevel
  );

  const finalPersona = extendedOrVariant || defaultPersona;

  // 6. 计算置信度
  const confidence = calculateConfidence(
    finalPersona,
    goalTypeCode,
    difficultyLevel
  );

  return {
    personaCode: finalPersona.code,
    personaName: language === 'zh' ? finalPersona.name_zh : finalPersona.name_en,
    personaCharacterName: language === 'zh' ? finalPersona.persona_name_zh : finalPersona.persona_name_en,
    personaType: finalPersona.persona_type,
    emoji: finalPersona.avatar_emoji,
    confidence,
    reasoning: generateReasoning(finalPersona, goalType.characteristics, language),
    fallbackUsed: false
  };
}

/**
 * 查找扩展或变体人格
 * 
 * 例如：
 * - task 类型 → coach (核心) → 可能使用 taskmaster (变体)
 * - habit 类型 → coach (核心) → 可能使用 habit_builder (扩展)
 */
function findExtendedOrVariantPersona(
  corePersona: AIPersona,
  allPersonas: AIPersona[],
  goalCharacteristics: any,
  difficultyLevel: DifficultyLevel
): AIPersona | null {
  // 查找所有继承自当前核心人格的扩展/变体
  const children = allPersonas.filter(
    p => p.parent_persona_code === corePersona.code
  );

  if (children.length === 0) return null;

  // 根据目标特征选择最合适的扩展/变体
  // 例如：如果是"习惯型"且有 habit_builder，优先使用
  if (goalCharacteristics?.['人格扩展']) {
    const targetCode = goalCharacteristics['人格扩展'];
    const found = children.find(c => c.code === targetCode);
    if (found) return found;
  }

  if (goalCharacteristics?.['人格变体']) {
    const targetCode = goalCharacteristics['人格变体'];
    const found = children.find(c => c.code === targetCode);
    if (found) return found;
  }

  // 如果难度很高，优先使用变体人格（通常更专注）
  if (difficultyLevel === 'hard' || difficultyLevel === 'extreme') {
    const variant = children.find(c => c.persona_type === 'variant');
    if (variant) return variant;
  }

  return null;
}

/**
 * 计算匹配置信度
 */
function calculateConfidence(
  persona: AIPersona,
  goalTypeCode: string,
  difficultyLevel: DifficultyLevel
): number {
  let confidence = 0.5; // 基础分

  // 目标类型匹配
  if (persona.suitable_goal_types.includes(goalTypeCode)) {
    confidence += 0.3;
  }

  // 难度级别匹配
  if (persona.suitable_difficulty_levels.includes(difficultyLevel)) {
    confidence += 0.2;
  }

  return Math.min(confidence, 1.0);
}

/**
 * 生成推荐理由
 */
function generateReasoning(
  persona: AIPersona,
  characteristics: any,
  language: 'zh' | 'en'
): string {
  if (language === 'zh') {
    if (persona.persona_type === 'extended') {
      return `基于目标特征，使用 ${persona.name_zh}（继承自 ${persona.parent_persona_code}）`;
    }
    if (persona.persona_type === 'variant') {
      return `检测到高难度任务，使用 ${persona.name_zh}（专注执行）`;
    }
    return `根据目标类型自动匹配 ${persona.name_zh}`;
  } else {
    if (persona.persona_type === 'extended') {
      return `Based on goal characteristics, using ${persona.name_en} (extended from ${persona.parent_persona_code})`;
    }
    if (persona.persona_type === 'variant') {
      return `High difficulty detected, using ${persona.name_en} (focused execution)`;
    }
    return `Auto-matched ${persona.name_en} based on goal type`;
  }
}

/**
 * 降级方案：返回默认人格
 */
function getFallbackPersona(language: 'zh' | 'en'): PersonaMatchResult {
  return {
    personaCode: 'companion',
    personaName: language === 'zh' ? '陪伴型' : 'Companion',
    personaCharacterName: language === 'zh' ? '小星' : 'Stella',
    personaType: 'core',
    emoji: '💬',
    confidence: 0.3,
    reasoning: language === 'zh' ? '使用默认陪伴型人格' : 'Using default companion persona',
    fallbackUsed: true
  };
}

/**
 * 批量匹配人格
 */
export async function matchAIPersonaBatch(
  matches: Array<{
    goalTypeCode: string;
    difficultyLevel: DifficultyLevel;
    language?: 'zh' | 'en';
  }>
): Promise<PersonaMatchResult[]> {
  return Promise.all(
    matches.map(m =>
      matchAIPersona(m.goalTypeCode, m.difficultyLevel, m.language)
    )
  );
}


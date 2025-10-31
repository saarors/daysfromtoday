/**
 * 目标类型识别器
 * 
 * 功能：基于关键词匹配识别用户输入的目标类型
 * 理论依据：docs/AI_PERSONA_MATCHING_SYSTEM.md
 */

import { createClient } from '@/lib/supabase/client';

export interface GoalTypeDetectionResult {
  goalTypeCode: string;
  goalTypeName: string;
  confidence: number;
  matchedKeywords: string[];
  defaultPersonaCode: string;
}

interface GoalType {
  code: string;
  name_zh: string;
  name_en: string;
  keywords_zh: string[];
  keywords_en: string[];
  default_persona_code: string;
  characteristics: any;
}

/**
 * 检测目标文本的语言
 */
export function detectLanguage(text: string): 'zh' | 'en' {
  // 简单的中文检测：如果包含中文字符，判定为中文
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text) ? 'zh' : 'en';
}

/**
 * 关键词匹配评分
 * 返回：匹配的关键词数组和置信度分数
 */
function matchKeywords(
  text: string,
  keywords: string[]
): { matched: string[]; score: number } {
  const lowerText = text.toLowerCase();
  const matched: string[] = [];

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerText.includes(lowerKeyword)) {
      matched.push(keyword);
    }
  }

  // 置信度 = 匹配关键词数 / 总关键词数（简单版）
  const confidence = keywords.length > 0 ? matched.length / keywords.length : 0;

  return { matched, score: confidence };
}

/**
 * 主函数：识别目标类型
 * 
 * @param goalText - 用户输入的目标文本
 * @returns 检测结果，如果无法识别则返回 'general' 类型
 */
export async function detectGoalType(
  goalText: string
): Promise<GoalTypeDetectionResult> {
  const supabase = createClient();

  // 1. 检测语言
  const language = detectLanguage(goalText);

  // 2. 从数据库获取所有活跃的目标类型
  const { data: goalTypes, error } = await supabase
    .from('goal_types')
    .select('code, name_zh, name_en, keywords_zh, keywords_en, default_persona_code, characteristics')
    .eq('is_active', true);

  if (error || !goalTypes || goalTypes.length === 0) {
    console.error('❌ 无法获取目标类型数据:', error);
    // 返回默认的 'general' 类型
    return {
      goalTypeCode: 'life',
      goalTypeName: '生活型',
      confidence: 0,
      matchedKeywords: [],
      defaultPersonaCode: 'companion'
    };
  }

  // 3. 对每个目标类型进行关键词匹配
  const results: Array<{
    type: GoalType;
    matched: string[];
    score: number;
  }> = [];

  for (const type of goalTypes) {
    const keywords = language === 'zh' ? type.keywords_zh : type.keywords_en;
    const { matched, score } = matchKeywords(goalText, keywords);

    if (matched.length > 0) {
      results.push({ type, matched, score });
    }
  }

  // 4. 如果没有匹配，返回默认类型
  if (results.length === 0) {
    return {
      goalTypeCode: 'life',
      goalTypeName: language === 'zh' ? '生活型' : 'Life Events',
      confidence: 0,
      matchedKeywords: [],
      defaultPersonaCode: 'companion'
    };
  }

  // 5. 选择得分最高的类型
  results.sort((a, b) => b.score - a.score);
  const bestMatch = results[0];

  return {
    goalTypeCode: bestMatch.type.code,
    goalTypeName: language === 'zh' ? bestMatch.type.name_zh : bestMatch.type.name_en,
    confidence: bestMatch.score,
    matchedKeywords: bestMatch.matched,
    defaultPersonaCode: bestMatch.type.default_persona_code
  };
}

/**
 * 批量检测多个目标
 */
export async function detectGoalTypeBatch(
  goalTexts: string[]
): Promise<GoalTypeDetectionResult[]> {
  return Promise.all(goalTexts.map(text => detectGoalType(text)));
}


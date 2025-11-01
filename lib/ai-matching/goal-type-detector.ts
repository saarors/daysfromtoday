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
// 🔥 临时方案：使用内存缓存避免 Supabase 查询超时
let cachedGoalTypes: any[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

export async function detectGoalType(
  goalText: string
): Promise<GoalTypeDetectionResult> {
  console.log('🔍 [detectGoalType] 开始检测目标类型...');

  // 1. 检测语言
  const language = detectLanguage(goalText);
  console.log('🌐 [detectGoalType] 检测到语言:', language);

  // 2. 检查缓存
  let goalTypes: any[] | null = null;
  const now = Date.now();
  
  if (cachedGoalTypes && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
    console.log('📦 [detectGoalType] 使用缓存数据');
    goalTypes = cachedGoalTypes;
  } else {
    // 3. 从数据库获取所有活跃的目标类型（带超时）
    console.log('📊 [detectGoalType] 查询 goal_types 表...');
    const supabase = createClient();
    
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Supabase query timeout')), 3000)
      );
      
      const queryPromise = supabase
        .from('goal_types')
        .select('code, name_zh, name_en, keywords_zh, keywords_en, default_persona_code, characteristics')
        .eq('is_active', true);
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (error || !data || data.length === 0) {
        console.error('❌ [detectGoalType] 无法获取目标类型数据:', error);
        goalTypes = null;
      } else {
        goalTypes = data;
        cachedGoalTypes = data;
        cacheTimestamp = now;
        console.log(`✅ [detectGoalType] 获取到 ${goalTypes.length} 个目标类型`);
      }
    } catch (err) {
      console.error('❌ [detectGoalType] 查询超时或失败:', err);
      goalTypes = null;
    }
  }
  
  // 4. 如果数据库查询失败，使用内置的简化匹配
  if (!goalTypes) {
    console.log('⚠️ [detectGoalType] 使用内置简化匹配逻辑');
    return detectGoalTypeOffline(goalText, language);
  }
  
  console.log(`✅ [detectGoalType] 获取到 ${goalTypes.length} 个目标类型`);

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
  
  console.log(`✅ [detectGoalType] 匹配完成: ${bestMatch.type.code} (置信度: ${(bestMatch.score * 100).toFixed(0)}%)`);

  return {
    goalTypeCode: bestMatch.type.code,
    goalTypeName: language === 'zh' ? bestMatch.type.name_zh : bestMatch.type.name_en,
    confidence: bestMatch.score,
    matchedKeywords: bestMatch.matched,
    defaultPersonaCode: bestMatch.type.default_persona_code
  };
}

/**
 * 离线降级方案：使用内置关键词匹配
 */
function detectGoalTypeOffline(
  goalText: string,
  language: 'zh' | 'en'
): GoalTypeDetectionResult {
  const text = goalText.toLowerCase();
  
  // 简化的关键词匹配库
  const keywords = {
    health: ['减肥', '健身', '锻炼', '运动', '跑步', '健康', '体重', 'workout', 'fitness', 'exercise', 'weight', 'health'],
    habit: ['习惯', '坚持', '每天', '早起', 'habit', 'daily', 'routine', 'every day'],
    learning: ['学习', '阅读', '读书', '知识', '课程', 'learn', 'study', 'read', 'book', 'course'],
    work: ['工作', '项目', '任务', '完成', '汇报', 'work', 'project', 'task', 'job', 'complete'],
    finance: ['存钱', '投资', '理财', '赚钱', '收入', 'save', 'money', 'invest', 'income', 'finance'],
  };
  
  for (const [type, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return {
        goalTypeCode: type,
        goalTypeName: language === 'zh' ? getTypeName(type, 'zh') : getTypeName(type, 'en'),
        confidence: 0.7,
        matchedKeywords: words.filter(word => text.includes(word)),
        defaultPersonaCode: getDefaultPersona(type)
      };
    }
  }
  
  // 默认返回 life 类型
  return {
    goalTypeCode: 'life',
    goalTypeName: language === 'zh' ? '生活型' : 'Life Events',
    confidence: 0.3,
    matchedKeywords: [],
    defaultPersonaCode: 'companion'
  };
}

function getTypeName(code: string, lang: 'zh' | 'en'): string {
  const names: Record<string, {zh: string; en: string}> = {
    health: {zh: '健康型', en: 'Health & Fitness'},
    habit: {zh: '习惯型', en: 'Habits & Routines'},
    learning: {zh: '学习型', en: 'Learning & Growth'},
    work: {zh: '工作型', en: 'Work & Productivity'},
    finance: {zh: '财务型', en: 'Finance & Wealth'},
    life: {zh: '生活型', en: 'Life Events'},
  };
  return names[code]?.[lang] || names['life'][lang];
}

function getDefaultPersona(code: string): string {
  const personas: Record<string, string> = {
    health: 'coach',
    habit: 'coach',
    learning: 'mentor',
    work: 'analyst',
    finance: 'advisor',
    life: 'companion',
  };
  return personas[code] || 'companion';
}

/**
 * 批量检测多个目标
 */
export async function detectGoalTypeBatch(
  goalTexts: string[]
): Promise<GoalTypeDetectionResult[]> {
  return Promise.all(goalTexts.map(text => detectGoalType(text)));
}


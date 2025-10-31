/**
 * 目标难度评估器
 * 
 * 功能：基于时间跨度、目标复杂度、关键词等因素评估目标难度
 * 理论依据：docs/AI_PERSONA_MATCHING_SYSTEM.md
 */

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'extreme';

export interface DifficultyAssessment {
  level: DifficultyLevel;
  score: number; // 0-100
  factors: {
    timeSpan: number; // 时间跨度影响 (0-25)
    complexity: number; // 文本复杂度 (0-25)
    ambiguity: number; // 目标模糊度 (0-25)
    challenge: number; // 挑战关键词 (0-25)
  };
}

/**
 * 计算时间跨度影响
 * - 短期（≤30天）：低难度
 * - 中期（31-180天）：中等难度
 * - 长期（181-365天）：高难度
 * - 极长期（>365天）：极高难度
 */
function calculateTimeSpanImpact(daysCount: number): number {
  if (daysCount <= 30) return 5; // 短期：容易
  if (daysCount <= 180) return 12; // 中期：中等
  if (daysCount <= 365) return 18; // 长期：困难
  return 25; // 极长期：极难
}

/**
 * 计算文本复杂度
 * 基于字数、句子数、标点符号等
 */
function calculateComplexity(goalText: string): number {
  const length = goalText.length;
  const sentenceCount = (goalText.match(/[。！？.!?]/g) || []).length || 1;
  const wordCount = goalText.split(/\s+/).length;

  // 简单评分：字数越多、句子越多 = 越复杂
  let score = 0;

  if (length <= 20) score += 3; // 简短
  else if (length <= 50) score += 8;
  else if (length <= 100) score += 15;
  else score += 20;

  if (sentenceCount > 2) score += 5; // 多个句子增加复杂度

  return Math.min(score, 25);
}

/**
 * 计算目标模糊度
 * 检测是否有明确的可量化指标
 */
function calculateAmbiguity(goalText: string): number {
  const lowerText = goalText.toLowerCase();

  // 明确性关键词（降低模糊度）
  const clarityKeywords = [
    // 数字
    /\d+/,
    // 中文量词
    /斤|公斤|千克|个|次|天|小时|分钟|页|本|章/,
    // 英文单位
    /kg|km|hours?|minutes?|pages?|chapters?|times?/,
    // 明确动词
    /完成|达到|实现|学会|掌握|finish|complete|achieve|learn|master/
  ];

  const hasClearMetrics = clarityKeywords.some(pattern => pattern.test(lowerText));

  // 模糊关键词（增加模糊度）
  const vagueKeywords = ['可能', '大概', '尽量', '试试', 'maybe', 'try', 'perhaps', 'might'];
  const hasVagueWords = vagueKeywords.some(word => lowerText.includes(word));

  let score = 12; // 基础分

  if (hasClearMetrics) score -= 7; // 有明确指标，降低模糊度
  if (hasVagueWords) score += 8; // 有模糊词，增加模糊度

  return Math.max(0, Math.min(score, 25));
}

/**
 * 检测挑战关键词
 * 如：突破、挑战、改变、戒掉等
 */
function calculateChallengeLevel(goalText: string): number {
  const lowerText = goalText.toLowerCase();

  const challengeKeywords = [
    // 高挑战中文
    '突破', '挑战', '改变', '戒掉', '戒除', '放弃', '克服', '战胜',
    // 高挑战英文
    'breakthrough', 'challenge', 'overcome', 'quit', 'break', 'transform',
    // 困难相关
    '困难', '艰难', 'difficult', 'hard', 'tough'
  ];

  const matchCount = challengeKeywords.filter(word => lowerText.includes(word)).length;

  // 每匹配一个挑战关键词 +5 分，最多 25 分
  return Math.min(matchCount * 5, 25);
}

/**
 * 主函数：计算目标难度
 * 
 * @param goalText - 目标文本
 * @param daysCount - 距离目标的天数
 * @returns 难度评估结果
 */
export function calculateDifficulty(
  goalText: string,
  daysCount: number
): DifficultyAssessment {
  const factors = {
    timeSpan: calculateTimeSpanImpact(Math.abs(daysCount)),
    complexity: calculateComplexity(goalText),
    ambiguity: calculateAmbiguity(goalText),
    challenge: calculateChallengeLevel(goalText)
  };

  // 总分 = 各因素之和 (0-100)
  const totalScore = Object.values(factors).reduce((sum, val) => sum + val, 0);

  // 根据总分判定难度等级
  let level: DifficultyLevel;
  if (totalScore <= 30) level = 'easy';
  else if (totalScore <= 55) level = 'medium';
  else if (totalScore <= 75) level = 'hard';
  else level = 'extreme';

  return {
    level,
    score: totalScore,
    factors
  };
}

/**
 * 批量计算难度
 */
export function calculateDifficultyBatch(
  goals: Array<{ goalText: string; daysCount: number }>
): DifficultyAssessment[] {
  return goals.map(g => calculateDifficulty(g.goalText, g.daysCount));
}


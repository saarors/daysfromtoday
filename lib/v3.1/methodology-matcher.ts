/**
 * V3.1 AI Intelligence Upgrade - Methodology Matcher
 * 
 * 用途: 根据目标类型和难度自动匹配最佳方法论
 * 核心功能:
 *  - 从数据库查询适用的方法论
 *  - 支持 PostgreSQL 数组类型查询（applicable_goal_types）
 *  - 按优先级和匹配度排序
 *  - 提供降级策略
 * 
 * 创建日期: 2025-11-04
 */

import { createClient } from '@/lib/supabase/server';
import type {
  Methodology,
  MethodologyMatchCriteria,
  MethodologyMatchResult,
} from '@/types/v3.1/prompt-system';
import { DIFFICULTY_MAP } from '@/types/v3.1/prompt-system';

/**
 * 方法论匹配器类
 */
export class MethodologyMatcher {
  /**
   * 匹配最佳方法论
   * 
   * @param criteria - 匹配条件
   * @returns 匹配结果（包含方法论和匹配分数）
   */
  static async match(
    criteria: MethodologyMatchCriteria
  ): Promise<MethodologyMatchResult> {
    try {
      // 第1步: 从数据库查询适用的方法论
      const methodologies = await this.queryMethodologies(criteria);

      if (methodologies.length === 0) {
        console.warn('[MethodologyMatcher] 未找到匹配的方法论，返回 null', criteria);
        return {
          methodology: null,
          matchScore: 0,
          fallbackReason: '未找到匹配的方法论',
        };
      }

      // 第2步: 计算匹配分数并排序
      const scoredMethodologies = methodologies.map((methodology) => ({
        methodology,
        score: this.calculateMatchScore(methodology, criteria),
      }));

      // 按分数降序排序
      scoredMethodologies.sort((a, b) => b.score - a.score);

      // 第3步: 返回最佳匹配
      const best = scoredMethodologies[0];

      console.log('[MethodologyMatcher] 匹配成功', {
        code: best.methodology.code,
        name: best.methodology.name_zh,
        score: best.score,
        criteria,
      });

      return {
        methodology: best.methodology,
        matchScore: best.score,
      };
    } catch (error) {
      console.error('[MethodologyMatcher] 匹配失败', error);
      return {
        methodology: null,
        matchScore: 0,
        fallbackReason: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  /**
   * 从数据库查询适用的方法论
   * 
   * @param criteria - 查询条件
   * @returns 方法论数组
   */
  private static async queryMethodologies(
    criteria: MethodologyMatchCriteria
  ): Promise<Methodology[]> {
    const supabase = createClient();

    // 构建查询
    let query = supabase
      .from('methodology_library')
      .select('*')
      .eq('is_active', true) // 只查询启用的方法论
      .contains('applicable_goal_types', [criteria.goal_type]) // PostgreSQL 数组包含查询
      .order('priority', { ascending: false }); // 按优先级降序

    // 如果提供了难度，添加难度范围过滤
    if (criteria.difficulty && criteria.difficulty !== 'any') {
      const difficultyLevel = DIFFICULTY_MAP[criteria.difficulty] || 2; // 默认 medium
      query = query
        .lte('min_difficulty_level', difficultyLevel) // 最低难度 <= 用户难度
        .gte('max_difficulty_level', difficultyLevel); // 最高难度 >= 用户难度
    }

    const { data, error } = await query;

    if (error) {
      console.error('[MethodologyMatcher] 数据库查询失败', error);
      throw new Error(`数据库查询失败: ${error.message}`);
    }

    return (data || []) as Methodology[];
  }

  /**
   * 计算方法论与条件的匹配分数
   * 
   * 评分规则:
   *  - 基础分: 50 分（只要在查询结果中）
   *  - 优先级分: priority * 5（最高 50 分，假设 priority 最高为 10）
   *  - 难度匹配分: 完全匹配 +20 分，部分匹配 +10 分
   *  - 使用次数加成: Math.min(usage_count / 10, 10) 分（最高 10 分）
   *  - 成功率加成: (success_rate / 10) 分（最高 10 分）
   * 
   * @param methodology - 方法论
   * @param criteria - 匹配条件
   * @returns 匹配分数 (0-140)
   */
  private static calculateMatchScore(
    methodology: Methodology,
    criteria: MethodologyMatchCriteria
  ): number {
    let score = 50; // 基础分

    // 优先级分数（0-50）
    score += methodology.priority * 5;

    // 难度匹配分数（0-20）
    if (criteria.difficulty && criteria.difficulty !== 'any') {
      const difficultyLevel = DIFFICULTY_MAP[criteria.difficulty] || 2;
      const isExactMatch =
        methodology.min_difficulty_level === difficultyLevel &&
        methodology.max_difficulty_level === difficultyLevel;
      const isInRange =
        methodology.min_difficulty_level <= difficultyLevel &&
        methodology.max_difficulty_level >= difficultyLevel;

      if (isExactMatch) {
        score += 20; // 完全匹配
      } else if (isInRange) {
        score += 10; // 在范围内
      }
    }

    // 使用次数加成（0-10）
    score += Math.min(methodology.usage_count / 10, 10);

    // 成功率加成（0-10）
    if (methodology.success_rate) {
      score += methodology.success_rate / 10;
    }

    return Math.round(score);
  }

  /**
   * 批量匹配多个目标类型
   * 
   * @param goalTypes - 目标类型数组
   * @param difficulty - 难度（可选）
   * @returns 每个目标类型的最佳方法论映射
   */
  static async batchMatch(
    goalTypes: string[],
    difficulty?: string
  ): Promise<Record<string, MethodologyMatchResult>> {
    const results: Record<string, MethodologyMatchResult> = {};

    await Promise.all(
      goalTypes.map(async (goalType) => {
        const result = await this.match({
          goal_type: goalType,
          difficulty: difficulty as any,
        });
        results[goalType] = result;
      })
    );

    return results;
  }

  /**
   * 根据方法论代码直接获取方法论
   * 
   * @param code - 方法论代码
   * @returns 方法论对象
   */
  static async getByCode(code: string): Promise<Methodology | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('methodology_library')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('[MethodologyMatcher] 根据代码查询失败', { code, error });
      return null;
    }

    return data as Methodology;
  }

  /**
   * 获取所有启用的方法论（用于缓存或管理界面）
   * 
   * @returns 方法论数组
   */
  static async getAllActive(): Promise<Methodology[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('methodology_library')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) {
      console.error('[MethodologyMatcher] 获取所有方法论失败', error);
      return [];
    }

    return (data || []) as Methodology[];
  }
}

/**
 * 导出便捷函数（用于非类环境）
 */
export const matchMethodology = MethodologyMatcher.match.bind(MethodologyMatcher);
export const getMethodologyByCode = MethodologyMatcher.getByCode.bind(MethodologyMatcher);
export const getAllActiveMethodologies = MethodologyMatcher.getAllActive.bind(MethodologyMatcher);







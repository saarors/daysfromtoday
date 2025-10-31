/**
 * AI 提示词匹配系统
 * 
 * 功能：
 * 1. 检测输入语言（中文/英文）
 * 2. 计算目标阶段（Phase 3 简化版：始终返回 start）
 * 3. 从数据库查询匹配的提示词
 * 4. 替换模板变量（goalText, days, targetDate）
 */

import { createClient } from '@/lib/supabase/client';

export type AIAssistantType = 'twinkle' | 'labubu' | 'jobs';
export type GoalStage = 'start' | 'in_progress' | 'near_end';
export type OutputLanguage = 'zh' | 'en';

export interface PromptMatchParams {
  assistantType: AIAssistantType;
  goalText: string;
  days: number;
  targetDate: string;
}

export interface MatchedPrompt {
  systemPrompt: string;
  userPrompt: string;
  language: OutputLanguage;
  stage: GoalStage;
}

/**
 * 检测输入语言
 * 
 * 逻辑：如果包含 3 个以上中文字符，判定为中文；否则为英文
 */
export function detectLanguage(text: string): OutputLanguage {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return chineseChars && chineseChars.length > 3 ? 'zh' : 'en';
}

/**
 * 计算目标阶段
 * 
 * Phase 3 简化版：全部返回 start
 * Phase 4 可扩展为：
 * - start: days > 30
 * - in_progress: 10 <= days <= 30
 * - near_end: days < 10
 */
export function calculateStage(days: number): GoalStage {
  // Phase 3: 全部返回 start
  return 'start';
  
  // Phase 4 扩展示例：
  // if (days > 30) return 'start';
  // if (days >= 10) return 'in_progress';
  // return 'near_end';
}

/**
 * 替换模板变量
 * 
 * 支持的变量：
 * - {goalText}: 用户输入的目标文本
 * - {days}: 天数
 * - {targetDate}: 目标日期
 */
function replaceTemplateVariables(
  template: string,
  variables: {
    goalText: string;
    days: number;
    targetDate: string;
  }
): string {
  return template
    .replace(/{goalText}/g, variables.goalText)
    .replace(/{days}/g, variables.days.toString())
    .replace(/{targetDate}/g, variables.targetDate);
}

/**
 * 获取匹配的提示词
 * 
 * 流程：
 * 1. 检测输入语言
 * 2. 计算目标阶段
 * 3. 从数据库查询匹配的提示词
 * 4. 替换模板变量
 * 
 * @throws {Error} 如果找不到匹配的提示词
 */
export async function getMatchedPrompt(
  params: PromptMatchParams
): Promise<MatchedPrompt> {
  const { assistantType, goalText, days, targetDate } = params;
  
  // 1. 检测语言
  const language = detectLanguage(goalText);
  
  // 2. 计算阶段
  const stage = calculateStage(days);
  
  // 3. 查询提示词
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ai_prompt_templates')
    .select('*')
    .eq('assistant_type', assistantType)
    .eq('goal_type', 'general') // Phase 3: 只用 general
    .eq('stage', stage)
    .eq('output_language', language)
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) {
    console.error('❌ 提示词查询失败:', error);
    throw new Error(`Prompt not found for ${assistantType} - ${language} - ${stage}`);
  }
  
  // 4. 替换变量
  const userPrompt = replaceTemplateVariables(
    data.user_prompt_template,
    { goalText, days, targetDate }
  );
  
  return {
    systemPrompt: data.system_prompt,
    userPrompt,
    language,
    stage,
  };
}

/**
 * 批量获取所有助手的提示词（用于预加载）
 */
export async function getAllActivePrompts() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ai_prompt_templates')
    .select('*')
    .eq('is_active', true)
    .order('assistant_type')
    .order('output_language');
  
  if (error) {
    console.error('❌ 批量查询提示词失败:', error);
    return [];
  }
  
  return data || [];
}

/**
 * 验证提示词库完整性
 * 
 * Phase 3 应该有 6 条提示词：
 * - Twinkle × general × start × zh/en (2条)
 * - Labubu × general × start × zh/en (2条)
 * - Jobs × general × start × zh/en (2条)
 */
export async function validatePromptLibrary(): Promise<{
  isValid: boolean;
  missing: string[];
  total: number;
}> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ai_prompt_templates')
    .select('assistant_type, goal_type, stage, output_language')
    .eq('is_active', true);
  
  if (error || !data) {
    return {
      isValid: false,
      missing: ['Database query failed'],
      total: 0,
    };
  }
  
  const required = [
    'twinkle-general-start-zh',
    'twinkle-general-start-en',
    'labubu-general-start-zh',
    'labubu-general-start-en',
    'jobs-general-start-zh',
    'jobs-general-start-en',
  ];
  
  const existing = data.map(
    p => `${p.assistant_type}-${p.goal_type}-${p.stage}-${p.output_language}`
  );
  
  const missing = required.filter(r => !existing.includes(r));
  
  return {
    isValid: missing.length === 0,
    missing,
    total: data.length,
  };
}


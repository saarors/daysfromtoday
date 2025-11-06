/**
 * V3.1 Prompt 系统类型定义
 * 
 * 包含：
 * - 方法论库类型
 * - Prompt 模板类型
 * - 任务分解模板类型
 * - 匹配条件和结果类型
 */

// ==================== 基础枚举 ====================

/**
 * 目标类型代码
 */
export type GoalTypeCode = 
  | 'health-fitness'
  | 'learning-skill'
  | 'career-work'
  | 'relationship-social'
  | 'finance-wealth'
  | 'creativity-hobby'
  | 'mental-spiritual'
  | 'general';

/**
 * 难度级别
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Prompt 阶段
 */
export type PromptStage = 
  | 'introduction'       // 介绍阶段
  | 'task-decomposition' // 任务分解阶段
  | 'progress-tracking'  // 进度跟踪阶段
  | 'reflection';        // 反思总结阶段

/**
 * 语言代码
 */
export type LanguageCode = 'zh' | 'en';

// ==================== 方法论库 ====================

/**
 * 方法论记录（从 methodology_library 表）
 */
export interface MethodologyRecord {
  id: string;
  name: string;
  name_en: string;
  category: string;
  description: string;
  core_principles: string[];
  applicable_goal_types: GoalTypeCode[];
  difficulty_range: DifficultyLevel[];
  key_steps: string[];
  success_metrics: string[];
  common_pitfalls: string[];
  resources: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * 方法论匹配结果
 */
export interface MethodologyMatchResult {
  methodology: MethodologyRecord;
  score: number;
  matchReasons: string[];
}

// ==================== Prompt 模板 ====================

/**
 * Prompt 模板记录（从 ai_prompt_library 表）
 */
export interface PromptTemplateRecord {
  id: string;
  template_name: string;
  goal_type: GoalTypeCode;
  difficulty: DifficultyLevel;
  stage: PromptStage;
  language: LanguageCode;
  system_prompt: string;
  user_prompt_template: string;
  methodology_id?: string;
  temperature: number;
  max_tokens: number;
  variables: string[];
  usage_count: number;
  avg_rating?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Prompt 查询条件
 */
export interface PromptQueryCriteria {
  goal_type: GoalTypeCode;
  difficulty: DifficultyLevel;
  stage: PromptStage;
  language: LanguageCode;
  methodology_id?: string;
}

/**
 * 组装后的 Prompt
 */
export interface ComposedPrompt {
  system_prompt: string;
  user_prompt: string;
  temperature: number;
  max_tokens: number;
  metadata: {
    template_id?: string;
    methodology_id?: string;
    methodology_name?: string;
    fallback_level: 0 | 1 | 2; // 0: database, 1: generic template, 2: hardcoded
    source: 'database' | 'generic' | 'hardcoded';
  };
}

// ==================== 任务分解模板 ====================

/**
 * 任务分解模板记录（从 task_decomposition_templates 表）
 */
export interface TaskDecompositionTemplate {
  id: string;
  template_name: string;
  goal_type: GoalTypeCode;
  difficulty: DifficultyLevel;
  methodology_id?: string;
  decomposition_structure: {
    phases: Array<{
      name: string;
      description: string;
      duration_ratio: number;
      key_milestones: string[];
    }>;
  };
  prompt_template: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ==================== Prompt 使用日志 ====================

/**
 * Prompt 使用日志记录（从 prompt_usage_logs 表）
 */
export interface PromptUsageLog {
  id: string;
  template_id: string;
  user_id: string;
  goal_text: string;
  goal_type: GoalTypeCode;
  difficulty: DifficultyLevel;
  methodology_id?: string;
  response_quality_score?: number;
  user_feedback?: string;
  created_at: string;
}

// ==================== 错误类型 ====================

/**
 * 方法论匹配错误
 */
export class MethodologyMatchError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'MethodologyMatchError';
  }
}

/**
 * Prompt 组装错误
 */
export class PromptCompositionError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'PromptCompositionError';
  }
}

/**
 * 数据库查询错误
 */
export class DatabaseQueryError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseQueryError';
  }
}

/**
 * 模板变量错误
 */
export class TemplateVariableError extends Error {
  constructor(message: string, public readonly missingVariables: string[]) {
    super(message);
    this.name = 'TemplateVariableError';
    this.missingVariables = missingVariables;
  }
  missingVariables: string[];
}

// ==================== 常量 ====================

/**
 * 难度级别映射（用于评分）
 */
export const DIFFICULTY_MAP: Record<DifficultyLevel, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

/**
 * 目标类型权重（用于匹配评分）
 */
export const GOAL_TYPE_WEIGHT = 50;

/**
 * 难度匹配权重
 */
export const DIFFICULTY_WEIGHT = 30;

/**
 * 类别匹配权重
 */
export const CATEGORY_WEIGHT = 20;

/**
 * 最大匹配结果数
 */
export const MAX_MATCH_RESULTS = 3;

/**
 * 默认温度值
 */
export const DEFAULT_TEMPERATURE = 0.7;

/**
 * 默认最大 token 数
 */
export const DEFAULT_MAX_TOKENS = 2000;



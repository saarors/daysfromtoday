/**
 * V3.1 AI Intelligence Upgrade - Module Exports
 * 
 * 统一导出所有 V3.1 核心模块
 * 创建日期: 2025-11-04
 */

// 方法论匹配器
export {
  MethodologyMatcher,
  matchMethodology,
  getMethodologyByCode,
  getAllActiveMethodologies,
} from './methodology-matcher';

// Prompt 组装器
export {
  PromptComposer,
  composePrompt,
  validatePromptTemplate,
} from './prompt-composer';

// 类型定义
export type {
  Methodology,
  MethodologyMatchCriteria,
  MethodologyMatchResult,
  PromptTemplate,
  PromptQueryCriteria,
  ComposedPrompt,
  PromptVariables,
  TaskDecompositionRequest,
  TaskDecompositionResponse,
  GoalType,
} from '@/types/v3.1/prompt-system';

export {
  DIFFICULTY_MAP,
  REVERSE_DIFFICULTY_MAP,
  GOAL_TYPES,
  DifficultyLevel,
} from '@/types/v3.1/prompt-system';







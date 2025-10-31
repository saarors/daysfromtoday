/**
 * AI 助手类型定义
 * V3.0 - AI 陪伴式目标实现平台
 */

export type AIAssistantType = 'twinkle' | 'labubu' | 'jobs';

export interface AIAssistant {
  id: AIAssistantType;
  name: string;
  emoji: string;
  avatar: string;
  color: string;
  personality: {
    tone: string;
    style: string;
    keywords: string[];
  };
  promptPrefix: string;
  description: {
    en: string;
    zh: string;
  };
}

export interface AIAnalysisResult {
  summary: string;
  milestones: string[];
  weeklyPlan: string[];
  warnings: string[];
  encouragement: string;
  fullAnalysis: string;
}

export interface UserGoalInput {
  targetDate: string;
  naturalDays: number;
  workingDays: number;
  goalText: string;
  assistant: AIAssistantType;
}


/**
 * AI 助手类型定义
 * V3.5 - AI 陪伴式目标实现平台 - 完整人格系统
 */

export type AIAssistantType = 
  // 10 种核心人格
  | 'companion'    // 陪伴型
  | 'coach'        // 教练型
  | 'mentor'       // 导师型
  | 'analyst'      // 分析型
  | 'advisor'      // 顾问型
  | 'reflector'    // 反思者
  | 'therapist'    // 疗愈型
  | 'challenger'   // 挑战者
  | 'strategist'   // 战略家
  | 'guardian'     // 守护者
  // 旧版兼容
  | 'twinkle' 
  | 'labubu' 
  | 'jobs';

export interface AIAssistant {
  id: string;
  name: string;
  type: string; // 助手类型,如"陪伴型"、"教练型"
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
  tips: string[];
  encouragement: string;
}

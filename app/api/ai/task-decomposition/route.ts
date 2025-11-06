/**
 * V3.1 新增: AI 任务分解 API
 * 
 * 功能: 根据用户目标和类型，生成 3-5 个具体的、可执行的任务步骤
 * 端点: POST /api/ai/task-decomposition
 * 
 * 核心价值:
 *  - 使用数据库驱动的 Prompt 和方法论
 *  - 根据目标类型（fitness, learning, habit 等）匹配专业方法论
 *  - 生成个性化的任务列表，而非通用模板
 * 
 * 创建日期: 2025-11-05
 */

// ✅ 强制使用 Edge Runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import { composePrompt } from '@/lib/v3.1/prompt-composer';
import type { PromptQueryCriteria, PromptVariables } from '@/types/v3.1/prompt-system';

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

// 请求体类型
interface TaskDecompositionRequest {
  goalText: string;
  goalType: string;        // 'fitness', 'learning', 'habit', 'general', etc.
  difficulty: string;      // 'easy', 'medium', 'hard', 'expert'
  days: number;
  language: 'zh' | 'en';
}

// 响应类型
interface TaskDecompositionResponse {
  success: boolean;
  data?: {
    tasks: string[];
    methodology?: {
      code: string;
      name: string;
      description: string;
    };
    estimatedTime: number;  // 预计总耗时（秒）
    cacheKey: string;
  };
  error?: {
    code: string;
    message: string;
  };
  fallback?: {
    tasks: string[];
  };
}

/**
 * 解析 AI 返回的任务列表
 */
function parseTaskList(aiResponse: string): string[] {
  const lines = aiResponse
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const tasks: string[] = [];

  for (const line of lines) {
    // 匹配格式: "1. 任务描述" 或 "- 任务描述" 或 "任务1: 描述" 或 "纯文本行"
    const match = line.match(/^(?:\d+[\.、:：]|\-|\*)\s*(.+)$/);
    
    if (match && match[1]) {
      // 格式 1: 有编号或符号
      let task = match[1].trim();
      task = task.replace(/^["'`]|["'`]$/g, '');
      // 移除末尾的句号
      task = task.replace(/[。\.]+$/, '');
      if (task.length >= 10 && task.length <= 150) {
        tasks.push(task);
      }
    } else if (line.length >= 10 && line.length <= 150) {
      // 格式 2: 纯文本行（没有编号）
      let task = line.trim();
      task = task.replace(/^["'`]|["'`]$/g, '');
      // 移除末尾的句号
      task = task.replace(/[。\.]+$/, '');
      // 过滤掉明显不是任务的行（如标题、说明等）
      if (!task.match(/^(?:注意|说明|提示|备注|任务列表|以下是)/)) {
        tasks.push(task);
      }
    }
  }

  return tasks.slice(0, 5); // 最多取5个
}

/**
 * 验证任务列表质量
 */
function validateTasks(tasks: string[]): boolean {
  if (tasks.length < 3 || tasks.length > 5) return false;
  if (tasks.some(t => t.length < 10 || t.length > 150)) return false;
  
  // 检查是否有重复
  const uniqueTasks = new Set(tasks);
  if (uniqueTasks.size !== tasks.length) return false;
  
  return true;
}

/**
 * 获取降级任务列表（基于目标类型）
 */
function getFallbackTasks(goalType: string, language: 'zh' | 'en'): string[] {
  if (language === 'zh') {
    const fallbackMap: Record<string, string[]> = {
      fitness: [
        '评估当前体能基线和健康状况',
        '制定渐进式训练计划和时间表',
        '准备必要的装备和环境',
        '设置每日提醒和进度追踪机制'
      ],
      learning: [
        '明确学习目标和评估标准',
        '收集学习资料和制定学习计划',
        '安排每日学习时间段',
        '设置阶段性测试和复习机制'
      ],
      habit: [
        '设计最小习惯版本（2分钟法则）',
        '设置环境提示和触发器',
        '建立打卡和奖励机制',
        '准备应对干扰的策略'
      ],
      general: [
        '明确目标的具体定义和标准',
        '分析所需资源和时间投入',
        '制定分阶段实施计划',
        '设置监控和调整机制'
      ]
    };
    
    return fallbackMap[goalType] || fallbackMap.general;
  }
  
  // 英文降级任务
  const fallbackMap: Record<string, string[]> = {
    fitness: [
      'Assess current fitness baseline',
      'Design progressive training plan',
      'Prepare necessary equipment',
      'Set up daily reminders and tracking'
    ],
    general: [
      'Define specific goals and criteria',
      'Analyze required resources',
      'Create phased implementation plan',
      'Set up monitoring mechanism'
    ]
  };
  
  return fallbackMap[goalType] || fallbackMap.general;
}

/**
 * POST 处理函数
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body: TaskDecompositionRequest = await request.json();
    const {
      goalText,
      goalType = 'general',
      difficulty = 'medium',
      days,
      language = 'zh',
    } = body;

    // 2. 验证必要参数
    if (!goalText || !days) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_PARAMS',
          message: '缺少必要参数: goalText 或 days'
        }
      } as TaskDecompositionResponse, { status: 400 });
    }

    // 3. 检查 API Key
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'API_NOT_CONFIGURED',
          message: 'AI 服务未配置'
        },
        fallback: {
          tasks: getFallbackTasks(goalType, language)
        }
      } as TaskDecompositionResponse, { status: 500 });
    }

    // 4. 使用 PromptComposer 获取完整 Prompt
    const criteria: PromptQueryCriteria = {
      goal_type: goalType,
      difficulty,
      language,
      stage: 'task-decomposition', // 🔥 关键：任务分解阶段
    };

    const variables: PromptVariables = {
      goalText,
      days,
    };

    const composedPrompt = await composePrompt(criteria, variables);

    // 5. 调用 DeepSeek API（非流式）
    const apiResponse = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 使用 chat 模型（快速生成）
        messages: [
          {
            role: 'system',
            content: composedPrompt.system_prompt,
          },
          {
            role: 'user',
            content: composedPrompt.user_prompt,
          },
        ],
        max_tokens: 500,  // 任务列表不需要太长
        temperature: composedPrompt.temperature,
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return NextResponse.json({
        success: false,
        error: {
          code: 'AI_API_ERROR',
          message: 'AI 服务调用失败'
        },
        fallback: {
          tasks: getFallbackTasks(goalType, language)
        }
      } as TaskDecompositionResponse, { status: 500 });
    }

    const data = await apiResponse.json();
    const aiContent = data.choices[0]?.message?.content || '';

    // 6. 解析任务列表
    const tasks = parseTaskList(aiContent);

    // 7. 验证任务质量
    if (!validateTasks(tasks)) {
      // 降级到模板任务
      return NextResponse.json({
        success: true,
        data: {
          tasks: getFallbackTasks(goalType, language),
          methodology: composedPrompt.metadata.methodology ? {
            code: composedPrompt.metadata.methodology_id || '',
            name: composedPrompt.metadata.methodology?.name || '',
            description: composedPrompt.metadata.methodology?.description || ''
          } : undefined,
          estimatedTime: 300,
          cacheKey: `task_${goalType}_${difficulty}_${language}_fallback`
        }
      } as TaskDecompositionResponse);
    }

    // 8. 返回成功结果
    return NextResponse.json({
      success: true,
      data: {
        tasks,
        methodology: composedPrompt.metadata.methodology ? {
          code: composedPrompt.metadata.methodology_id || '',
          name: composedPrompt.metadata.methodology?.name || '',
          description: composedPrompt.metadata.methodology?.description || ''
        } : undefined,
        estimatedTime: tasks.length * 60, // 预估每个任务1分钟
        cacheKey: `task_${goalType}_${difficulty}_${language}_v1`
      }
    } as TaskDecompositionResponse);

  } catch (error) {
    console.error('[TaskDecomposition] 错误:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '服务器内部错误'
      },
      fallback: {
        tasks: getFallbackTasks('general', 'zh')
      }
    } as TaskDecompositionResponse, { status: 500 });
  }
}


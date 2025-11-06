/**
 * DeepSeek AI Chat Streaming API 路由 - V3.1 升级版
 * 
 * 功能：流式输出 AI 回复，支持逐字显示
 * 端点：POST /api/ai/chat/stream
 * 
 * V3.1 新特性:
 *  - 使用 PromptComposer 动态组装 Prompt
 *  - 自动匹配并注入方法论内容
 *  - 三层降级策略保证 100% 可用性
 *  - 保持向后兼容
 * 
 * 使用 Server-Sent Events (SSE) 返回流式数据
 */

// ✅ 强制使用 Edge Runtime（防止 Node.js 缓冲）
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { composePrompt } from '@/lib/v3.1/prompt-composer';
import type { PromptQueryCriteria, PromptVariables } from '@/types/v3.1/prompt-system';

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

// 请求体类型
interface ChatRequest {
  goalText: string;
  daysCount: number;
  targetDate: string;
  personaCode: string;
  goalTypeCode?: string;
  difficultyLevel?: string;
  language: 'zh' | 'en';
  // V3.1 新增：是否使用新的 Prompt 系统（默认 true）
  useV3Prompts?: boolean;
}

/**
 * V3.1: 使用 PromptComposer 获取完整 Prompt
 */
async function getPromptV3(
  goalTypeCode: string,
  difficultyLevel: string,
  language: 'zh' | 'en',
  variables: {
    goalText: string;
    days: number;
    targetDate: string;
  }
) {
  try {
    const criteria: PromptQueryCriteria = {
      goal_type: goalTypeCode || 'general',
      difficulty: difficultyLevel || 'medium',
      language: language || 'zh',
      stage: 'task-decomposition', // 当前阶段是任务分解
    };

    const composedPrompt = await composePrompt(criteria, variables);

    console.log('[API v3.1] Prompt 组装成功', {
      source: composedPrompt.metadata.source,
      fallback_level: composedPrompt.metadata.fallback_level,
      has_methodology: !!composedPrompt.metadata.methodology_id,
    });

    return composedPrompt;
  } catch (error) {
    console.error('[API v3.1] Prompt 组装失败，使用硬编码降级', error);
    // 降级到硬编码 Prompt
    return {
      system_prompt: getDefaultSystemPrompt(language),
      user_prompt: getDefaultUserPrompt(language, variables),
      temperature: 0.7,
      max_tokens: 2000,
      metadata: {
        fallback_level: 2 as const,
        source: 'hardcoded' as const,
      },
    };
  }
}

/**
 * 旧版: 从 ai_prompt_templates 表获取 Prompt（向后兼容）
 */
async function getPersonaPromptTemplate(
  personaCode: string,
  goalTypeCode: string,
  difficultyLevel: string,
  language: 'zh' | 'en'
) {
  const supabase = createClient();

  const { data: template } = await supabase
    .from('ai_prompt_templates')
    .select('system_prompt, user_prompt_template')
    .eq('persona_code', personaCode)
    .eq('goal_type_code', goalTypeCode || 'life')
    .eq('difficulty_level', difficultyLevel || 'medium')
    .eq('stage', 'start')
    .eq('output_language', language)
    .eq('is_active', true)
    .single();

  if (template) {
    return template;
  }

  // 降级方案
  return {
    system_prompt: getDefaultSystemPrompt(language),
    user_prompt_template: getDefaultUserPrompt(language, {
      goalText: '{goalText}',
      days: 0,
      targetDate: '{targetDate}',
    }),
  };
}

function getDefaultSystemPrompt(language: 'zh' | 'en'): string {
  if (language === 'zh') {
    return `你是专业的目标规划助手，使用 DeepSeek Reasoner 模型。

🎯 你的核心能力:
1. 深入理解用户目标背后的动机
2. 提供真诚、个性化的建议
3. 展示你的推理过程
4. 根据目标类型调整语气

📝 回复格式:

<think>
[在这里展示你的思考过程，100-200字]
分析用户目标的可行性、挑战点、时间规划等。
</think>

## 💬 我的理解

用第一人称表达你对用户目标的理解，2-3句话。

## 🎯 我的建议

用自然段落提供具体可行的建议。可以使用表格展示阶段性计划。

表格格式要求:
- 必须包含完整的表头行、分隔行和数据行
- 示例:
  | 阶段 | 时间 | 任务 |
  |------|------|------|
  | 第一阶段 | 1-10天 | 具体任务 |

## ⚡ 实战技巧

给出3-5个可操作的技巧。

## 💪 给你的鼓励

写一句鼓励的话。`;
  }

  return `You are a professional goal planning assistant using the DeepSeek Reasoner model.

🎯 Your core capabilities:
1. Deeply understand the motivation behind user goals
2. Provide sincere, personalized advice
3. Show your reasoning process
4. Adjust tone based on goal type

📝 Response format:

<think>
[Show your thinking process here, 100-200 words]
Analyze the feasibility, challenges, and time planning of the user's goal.
</think>

## 💬 My Understanding

Express your understanding of the user's goal in first person, 2-3 sentences.

## 🎯 My Advice

Provide specific and actionable advice in natural paragraphs. You can use tables to show phased plans.

## ⚡ Practical Tips

Give 3-5 actionable tips.

## 💪 Encouragement

Write an encouraging sentence.`;
}

function getDefaultUserPrompt(
  language: 'zh' | 'en',
  variables: {
    goalText: string;
    days: number;
    targetDate: string;
  }
): string {
  if (language === 'zh') {
    return `用户的目标：${variables.goalText}

时间跨度：${variables.days} 天
目标日期：${variables.targetDate}

请按照格式要求生成完整的分析和建议。`;
  }

  return `User's goal: ${variables.goalText}

Time span: ${variables.days} days
Target date: ${variables.targetDate}

Please generate a complete analysis and advice following the format requirements.`;
}

function fillPromptTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

/**
 * POST 处理函数 - 流式输出
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body: ChatRequest = await request.json();
    const {
      goalText,
      daysCount,
      targetDate,
      personaCode,
      goalTypeCode = 'general',
      difficultyLevel = 'medium',
      language = 'zh',
      useV3Prompts = true, // 默认使用 V3.1 Prompt 系统
    } = body;

    // 2. 验证必要参数
    if (!goalText || !targetDate || !personaCode) {
      return new Response(
        JSON.stringify({ error: '缺少必要参数' }),
        { status: 400 }
      );
    }

    // 3. 检查 API Key
    if (!DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI 服务未配置' }),
        { status: 500 }
      );
    }

    let systemPrompt: string;
    let userPrompt: string;
    let temperature = 0.7;
    let maxTokens = 2000;

    // 4. 获取 Prompt（V3.1 或旧版）
    if (useV3Prompts) {
      console.log('[API v3.1] 使用新的 Prompt 系统');
      const composedPrompt = await getPromptV3(
        goalTypeCode,
        difficultyLevel,
        language,
        {
          goalText,
          days: daysCount,
          targetDate,
        }
      );

      systemPrompt = composedPrompt.system_prompt;
      userPrompt = composedPrompt.user_prompt;
      temperature = composedPrompt.temperature;
      maxTokens = composedPrompt.max_tokens;
    } else {
      console.log('[API v3.1] 使用旧版 Prompt 系统（兼容模式）');
      const promptTemplate = await getPersonaPromptTemplate(
        personaCode,
        goalTypeCode,
        difficultyLevel,
        language
      );

      systemPrompt = promptTemplate.system_prompt;
      userPrompt = fillPromptTemplate(promptTemplate.user_prompt_template, {
        goalText,
        targetDate,
        daysCount,
      });
    }

    // 5. 调用 DeepSeek API（流式）
    const apiResponse = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner', // DeepSeek Reasoner 模型 (深度推理模式)
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: maxTokens,
        temperature,
        stream: true, // 启用流式输出
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('[API v3.1] DeepSeek API 错误:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI 服务调用失败' }),
        { status: 500 }
      );
    }

    // 6. 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = apiResponse.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter((line) => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content;
                  const reasoning = parsed.choices[0]?.delta?.reasoning_content;

                  // 优先处理推理内容
                  if (reasoning) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ reasoning })}\n\n`
                      )
                    );
                  }

                  // 处理主要内容（与前端兼容的格式）
                  if (content) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ delta: content })}\n\n`
                      )
                    );
                  }
                } catch (parseError) {
                  console.error('[API v3.1] 解析 SSE 数据失败:', parseError);
                }
              }
            }
          }

          // 发送完成信号（与前端兼容的格式）
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (streamError) {
          console.error('[API v3.1] 流式传输错误:', streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[API v3.1] 错误:', error);
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }),
      { status: 500 }
    );
  }
}


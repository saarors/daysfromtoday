/**
 * DeepSeek AI Chat Streaming API 路由
 * 
 * 功能：流式输出 AI 回复，支持逐字显示
 * 端点：POST /api/ai/chat/stream
 * 
 * 使用 Server-Sent Events (SSE) 返回流式数据
 */

// ✅ 强制使用 Edge Runtime（防止 Node.js 缓冲）
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
}

/**
 * 从数据库获取 AI 人格的提示词模板
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
    system_prompt: getDefaultSystemPrompt(personaCode, language),
    user_prompt_template: getDefaultUserPrompt(language)
  };
}

function getDefaultSystemPrompt(personaCode: string, language: 'zh' | 'en'): string {
  if (language === 'zh') {
    return `你是专业的目标规划助手（${personaCode}），使用 DeepSeek Reasoner 模型。

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

用1-2句真诚的话鼓励用户。

❗ 重要约束:
- **禁止在<think>标签内嵌套<think>标签**
- **每个响应只有一对<think></think>标签，且必须在开头**
- **每个标题只出现一次**`;
  } else {
    return `You are a professional and empathetic goal planning assistant (${personaCode}).

🎯 Your Core Abilities:
1. Deeply understand motivations behind user goals
2. Provide sincere, personalized advice
3. Show your reasoning process
4. Adjust tone based on goal type

📝 Response Format:

<think>
[Show your thinking process, 100-200 words]
</think>

## 💬 My Understanding

[Express understanding in first person, 2-3 sentences]

## 🎯 My Suggestions

[Natural paragraphs with specific actions]

## ⚡ Practical Tips

[3-5 actionable tips]

## 💪 My Encouragement

[1-2 sincere sentences]

❗ Important Constraints:
- **Never nest <think> tags inside <think> tags**
- **Only one pair of <think></think> tags per response, at the beginning**`;
  }
}

function getDefaultUserPrompt(language: 'zh' | 'en'): string {
  if (language === 'zh') {
    return `请帮我分析以下目标：

目标内容：{goalText}
目标日期：{targetDate}
距离今天：{daysCount} 天

请提供详细的分析和建议。`;
  } else {
    return `Please analyze the following goal:

Goal: {goalText}
Target Date: {targetDate}
Days from today: {daysCount} days

Please provide detailed analysis and recommendations.`;
  }
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
      goalTypeCode = 'life',
      difficultyLevel = 'medium',
      language = 'zh'
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

    // 4. 获取提示词模板
    const promptTemplate = await getPersonaPromptTemplate(
      personaCode,
      goalTypeCode,
      difficultyLevel,
      language
    );

    // 5. 填充用户提示词
    const userPrompt = fillPromptTemplate(promptTemplate.user_prompt_template, {
      goalText,
      targetDate,
      daysCount
    });

    // 6. 调用 DeepSeek API（流式）
    const apiResponse = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner', // DeepSeek Reasoner 模型 (深度推理模式)
        messages: [
          {
            role: 'system',
            content: promptTemplate.system_prompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: true // 启用流式输出
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('DeepSeek API 错误:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI 服务调用失败' }),
        { status: 500 }
      );
    }

    // 7. 创建 ReadableStream 转发 SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = apiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          let buffer = '';

          // 实时流式转发 - 直接传递AI的原始输出
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices[0]?.delta?.content || '';
                  
                  if (delta) {
                    // 直接转发原始内容,让前端自己解析<think>标签
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
                  }
                } catch (e) {
                  console.error('解析 SSE 数据失败:', e);
                }
              }
            }
          }

          // 发送完成信号
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('流式处理错误:', error);
          controller.error(error);
        }
      }
    });

    // 返回流式响应（关键响应头）
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',  // ✅ 禁止转换
        'Connection': 'keep-alive',
        'Content-Encoding': 'identity',  // ✅ 禁止压缩（关键！）
        'X-Accel-Buffering': 'no',  // ✅ Nginx 禁止缓冲
      }
    });

  } catch (error) {
    console.error('Streaming API 错误:', error);
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }),
      { status: 500 }
    );
  }
}


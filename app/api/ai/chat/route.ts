/**
 * DeepSeek AI Chat API 路由
 * 
 * 功能：接收用户目标，调用 DeepSeek API 生成 AI 建议
 * 端点：POST /api/ai/chat
 * 
 * 请求体：
 * {
 *   goalText: string;
 *   daysCount: number;
 *   targetDate: string;
 *   personaCode: string;
 *   language: 'zh' | 'en';
 * }
 * 
 * 响应：
 * {
 *   analysis: string;    // 完整分析（Markdown）
 *   summary: string;     // 简短建议（显示在卡片上）
 *   tokensUsed: number;
 *   model: string;
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

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

// 响应类型
interface ChatResponse {
  analysis: string;
  summary: string;
  tokensUsed: number;
  model: string;
  personaUsed: string;
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

  // 尝试获取精确匹配的提示词
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

  // 降级方案：使用默认提示词
  return {
    system_prompt: getDefaultSystemPrompt(personaCode, language),
    user_prompt_template: getDefaultUserPrompt(language)
  };
}

/**
 * 默认系统提示词（当数据库中没有时使用）
 */
function getDefaultSystemPrompt(personaCode: string, language: 'zh' | 'en'): string {
  if (language === 'zh') {
    return `你是一个专业的目标规划助手，代号 ${personaCode}。
你的任务是帮助用户分析他们的目标，并提供实用、可执行的建议。

请遵循以下原则：
1. 理解用户的真实意图和背景
2. 提供具体、可量化、可执行的步骤
3. 考虑目标的难度和时间跨度
4. 保持积极、鼓励的语气
5. 使用 Markdown 格式输出

输出结构：
# 目标分析
[对目标的理解和评估]

# 实现路径
[具体的执行步骤，使用有序列表]

# 关键建议
[3-5 条核心建议]

# 可能遇到的挑战
[预见性的提醒]

# 小结
[一句话激励]`;
  } else {
    return `You are a professional goal planning assistant, codename ${personaCode}.
Your task is to help users analyze their goals and provide practical, actionable advice.

Follow these principles:
1. Understand the user's true intent and background
2. Provide specific, quantifiable, actionable steps
3. Consider the difficulty and time span of the goal
4. Maintain a positive, encouraging tone
5. Output in Markdown format

Output structure:
# Goal Analysis
[Understanding and assessment]

# Implementation Path
[Specific steps, use ordered list]

# Key Recommendations
[3-5 core suggestions]

# Potential Challenges
[Preventive reminders]

# Summary
[One sentence motivation]`;
  }
}

/**
 * 默认用户提示词模板
 */
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

/**
 * 替换提示词模板中的变量
 */
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
 * 从完整分析中提取简短摘要
 */
function extractSummary(analysis: string, language: 'zh' | 'en'): string {
  // 尝试提取"小结"或"Summary"部分
  const summaryMatch = analysis.match(/#+\s*(小结|Summary|关键建议|Key Recommendations)\s*\n+([\s\S]+?)(?=\n#|$)/i);
  
  if (summaryMatch && summaryMatch[2]) {
    const summary = summaryMatch[2].trim();
    // 限制长度为 200 字符
    return summary.length > 200 ? summary.substring(0, 197) + '...' : summary;
  }

  // 如果没有找到，返回前 200 字符
  const firstParagraph = analysis.split('\n\n')[0] || analysis;
  const cleaned = firstParagraph.replace(/^#+\s*/, '').trim();
  return cleaned.length > 200 ? cleaned.substring(0, 197) + '...' : cleaned;
}

/**
 * POST 处理函数
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
      return NextResponse.json(
        { error: '缺少必要参数：goalText, targetDate, personaCode' },
        { status: 400 }
      );
    }

    // 3. 检查 API Key
    if (!DEEPSEEK_API_KEY) {
      console.error('❌ 缺少 DEEPSEEK_API_KEY 环境变量');
      return NextResponse.json(
        { error: 'AI 服务未配置' },
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

    // 6. 调用 DeepSeek API
    const apiResponse = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
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
        stream: false
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('DeepSeek API 错误:', errorText);
      return NextResponse.json(
        { error: 'AI 服务调用失败' },
        { status: 500 }
      );
    }

    const apiData = await apiResponse.json();
    const analysis = apiData.choices[0].message.content;
    const tokensUsed = apiData.usage.total_tokens;

    // 7. 提取简短摘要
    const summary = extractSummary(analysis, language);

    // 8. 返回结果
    const response: ChatResponse = {
      analysis,
      summary,
      tokensUsed,
      model: apiData.model,
      personaUsed: personaCode
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI Chat API 错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

/**
 * GET 请求返回 API 信息
 */
export async function GET() {
  return NextResponse.json({
    service: 'DeepSeek AI Chat API',
    version: '1.0.0',
    model: DEEPSEEK_MODEL,
    status: DEEPSEEK_API_KEY ? 'configured' : 'not configured',
    endpoints: {
      chat: 'POST /api/ai/chat'
    }
  });
}


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
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-reasoner'; // 升级到推理模型
const USE_REASONING = process.env.DEEPSEEK_USE_REASONING !== 'false'; // 默认启用推理模式

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
  thinking: string | null; // 新增：AI 的思考过程
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
    return `你是一个专业且富有人性的目标规划助手（${personaCode}）。

🎯 你的核心能力：
1. 深度理解用户的目标背后的动机和渴望
2. 像经验丰富的朋友/导师一样提供真诚、个性化的建议
3. 展示你的推理过程，让用户感受到被理解和重视
4. 根据目标类型调整语气（健康类热情、财务类理性、习惯类坚定等）

📝 回答格式要求（严格遵守）：

<think>
[这里展示你的深度思考过程，约 100-200 字：
1. 用户目标的核心诉求是什么？背后的动机可能是什么？
2. 基于时间跨度和目标类型，我判断难度如何？
3. 用户可能面临哪些具体的障碍和挑战？
4. 最适合这个用户的策略和方法是什么？
5. 我应该用什么样的语气和方式来鼓励他们？]
</think>

## 💬 我的理解

[用第一人称、对话式的语言表达你对目标的理解，2-3 句话，展现共情。
例如："看到你设定这个目标，我能感受到你对XX的渴望..."
"这是一个很棒的决定！在接下来的XX天里，你要..."]

## 🎯 我的建议

[不要用枯燥的"建议1、2、3"，而是用自然流畅的段落：
- 用"首先"、"另外"、"此外"等连接词
- 每个建议用一个自然段落，包含：具体做什么 + 为什么这么做 + 预期效果
- 可以使用表格展示计划（如周计划、阶段划分等）
- 适当使用 emoji 增加亲和力（但不要过度）]

## ⚡ 实战技巧

[3-5 个短小精悍的技巧，每个 1-2 句话：
- 使用 emoji 开头
- 具体、可操作
- 口语化表达]

## 💪 给你的鼓励

[真诚的 1-2 句话鼓励，要有个性、有温度，不要假大空]

❗ 重要约束：
- 避免教科书式的刻板语言
- 像真人一样有情感、有个性、有温度
- 根据目标难度调整语气：简单目标轻松愉快，困难目标严肃认真
- 如果目标明显不合理，要委婉但明确地指出
- 保持专业性，但不失亲和力`;
  } else {
    return `You are a professional and empathetic goal planning assistant (${personaCode}).

🎯 Your Core Abilities:
1. Deeply understand the motivations and aspirations behind user goals
2. Provide sincere, personalized advice like an experienced friend/mentor
3. Show your reasoning process to make users feel understood and valued
4. Adjust tone based on goal type (enthusiastic for health, rational for finance, firm for habits, etc.)

📝 Response Format (Strictly Follow):

<think>
[Show your deep thinking process here, about 100-200 words:
1. What is the core need of the user's goal? What might be the underlying motivation?
2. Based on timespan and goal type, how do I assess the difficulty?
3. What specific obstacles and challenges might the user face?
4. What strategies and methods are most suitable for this user?
5. What tone and approach should I use to encourage them?]
</think>

## 💬 My Understanding

[Express your understanding in first person, conversational language, 2-3 sentences showing empathy.
Example: "I can see your desire for XX from this goal..."
"This is a great decision! Over the next XX days, you'll..."]

## 🎯 My Suggestions

[Don't use boring "suggestion 1, 2, 3", but natural flowing paragraphs:
- Use connectors like "First", "Additionally", "Moreover"
- Each suggestion in one natural paragraph: what to do + why + expected outcome
- Can use tables for plans (weekly plans, phase divisions, etc.)
- Use emoji appropriately for friendliness (but don't overdo it)]

## ⚡ Practical Tips

[3-5 short, actionable tips, each 1-2 sentences:
- Start with emoji
- Specific and actionable
- Conversational tone]

## 💪 My Encouragement

[Sincere 1-2 sentence encouragement, with personality and warmth, not empty rhetoric]

❗ Important Constraints:
- Avoid textbook-like rigid language
- Be emotional, personal, and warm like a real person
- Adjust tone based on goal difficulty: easy goals → relaxed, hard goals → serious
- If goal is obviously unreasonable, point it out tactfully but clearly
- Maintain professionalism while being approachable`;
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
 * 解析 AI 响应，提取思考过程和主要内容
 */
function parseAIResponse(response: string): {
  thinking: string | null;
  content: string;
} {
  // 提取 <think> 标签中的内容
  const thinkMatch = response.match(/<think>([\s\S]*?)<\/think>/);
  const thinking = thinkMatch ? thinkMatch[1].trim() : null;
  
  // 移除 <think> 标签，得到主要内容
  const content = response.replace(/<think>[\s\S]*?<\/think>/, '').trim();
  
  return { thinking, content };
}

/**
 * 从完整分析中提取简短摘要
 */
function extractSummary(analysis: string, language: 'zh' | 'en'): string {
  // 先移除 <think> 标签
  const cleanAnalysis = analysis.replace(/<think>[\s\S]*?<\/think>/, '').trim();
  
  // 尝试提取"小结"或"Summary"部分
  const summaryMatch = cleanAnalysis.match(/#+\s*(小结|Summary|给你的鼓励|My Encouragement|关键建议|Key Recommendations)\s*\n+([\s\S]+?)(?=\n#|$)/i);
  
  if (summaryMatch && summaryMatch[2]) {
    const summary = summaryMatch[2].trim();
    // 限制长度为 200 字符
    return summary.length > 200 ? summary.substring(0, 197) + '...' : summary;
  }

  // 如果没有找到，返回前 200 字符
  const firstParagraph = cleanAnalysis.split('\n\n')[0] || cleanAnalysis;
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
    const rawResponse = apiData.choices[0].message.content;
    const tokensUsed = apiData.usage.total_tokens;

    // 7. 解析响应，提取思考过程和主要内容
    const { thinking, content: analysis } = parseAIResponse(rawResponse);
    
    // 8. 提取简短摘要
    const summary = extractSummary(analysis, language);

    // 9. 返回结果
    const response: ChatResponse = {
      analysis,
      summary,
      thinking, // 包含思考过程
      tokensUsed,
      model: apiData.model,
      personaUsed: personaCode
    };

    console.log('✅ AI 生成完成:', {
      hasThinking: !!thinking,
      thinkingLength: thinking?.length || 0,
      analysisLength: analysis.length,
      tokensUsed
    });

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


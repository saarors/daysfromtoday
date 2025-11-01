/**
 * AI 助手介绍文案生成 API
 * 
 * 功能：根据用户目标和匹配的 AI 助手，生成个性化介绍文案
 * 端点：POST /api/ai/intro
 * 
 * 请求体：
 * {
 *   goalText: string;
 *   personaCode: string;
 *   personaName: string;
 *   personaType: string;
 *   language: 'zh' | 'en';
 * }
 * 
 * 响应：
 * {
 *   intro: string;  // 生成的介绍文案
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = 'deepseek-chat'; // 使用普通 chat 模型，不需要推理

interface IntroRequest {
  goalText: string;
  personaCode: string;
  personaName: string;
  personaType: string;
  language: 'zh' | 'en';
}

interface IntroResponse {
  intro: string;
}

/**
 * 生成系统提示词
 */
function getSystemPrompt(language: 'zh' | 'en'): string {
  if (language === 'zh') {
    return `你是一个专业的文案生成助手。你的任务是为 AI 助手生成一句简短、温暖、个性化的介绍文案。

要求：
1. 文案长度：25-40 字
2. 风格：温暖、鼓励、自然
3. 内容：
   - 简要评价用户的目标（不超过 10 字）
   - 说明为什么匹配这位 AI 助手
   - 提及 AI 助手的名字和类型
4. 格式：一句话，不需要 emoji
5. 语气：像朋友一样亲切

示例：
- "你的目标很棒！我为你匹配了一位【教练型】的助手，他的名字叫艾力。"
- "这是个有挑战的目标！我为你安排了【突破型】助手破军来帮你。"
- "健康生活的好计划！【疗愈型】助手心宁会陪伴你实现目标。"`;
  } else {
    return `You are a professional copywriter. Your task is to generate a short, warm, personalized introduction for an AI assistant.

Requirements:
1. Length: 15-25 words
2. Style: Warm, encouraging, natural
3. Content:
   - Brief comment on user's goal (max 5 words)
   - Explain why this AI assistant is matched
   - Mention the AI assistant's name and type
4. Format: One sentence, no emojis
5. Tone: Friendly like a friend

Examples:
- "Great goal! I've matched you with Alex, a Coach-type assistant."
- "Challenging target! Victor, a Challenger assistant, will help you push through."
- "Healthy plan! Luna, your Therapist assistant, will support your journey."`;
  }
}

/**
 * 生成用户提示词
 */
function getUserPrompt(
  goalText: string,
  personaName: string,
  personaType: string,
  language: 'zh' | 'en'
): string {
  if (language === 'zh') {
    return `用户目标：${goalText}
匹配的 AI 助手：${personaName}（${personaType}）

请生成一句温暖的介绍文案。`;
  } else {
    return `User's goal: ${goalText}
Matched AI assistant: ${personaName} (${personaType})

Please generate a warm introduction.`;
  }
}

/**
 * POST 处理函数
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body: IntroRequest = await request.json();
    const {
      goalText,
      personaName,
      personaType,
      language = 'zh'
    } = body;

    // 2. 验证必要参数
    if (!goalText || !personaName || !personaType) {
      return NextResponse.json(
        { error: '缺少必要参数：goalText, personaName, personaType' },
        { status: 400 }
      );
    }

    // 3. 检查 API Key
    if (!DEEPSEEK_API_KEY) {
      console.error('❌ 缺少 DEEPSEEK_API_KEY 环境变量');
      // 返回默认文案
      const fallbackIntro = language === 'zh'
        ? `我为你匹配了一位【${personaType}】的助手，他的名字叫${personaName}。`
        : `I've matched you with ${personaName}, a ${personaType} assistant.`;
      
      return NextResponse.json({ intro: fallbackIntro });
    }

    // 4. 调用 DeepSeek API
    const apiResponse = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
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
            content: getSystemPrompt(language)
          },
          {
            role: 'user',
            content: getUserPrompt(goalText, personaName, personaType, language)
          }
        ],
        max_tokens: 150,
        temperature: 0.8, // 稍高温度，增加创意性
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('DeepSeek API 错误:', errorText);
      
      // 返回默认文案
      const fallbackIntro = language === 'zh'
        ? `我为你匹配了一位【${personaType}】的助手，他的名字叫${personaName}。`
        : `I've matched you with ${personaName}, a ${personaType} assistant.`;
      
      return NextResponse.json({ intro: fallbackIntro });
    }

    const apiData = await apiResponse.json();
    const intro = apiData.choices[0].message.content.trim();

    console.log('✅ AI 介绍文案生成完成:', intro);

    // 5. 返回结果
    const response: IntroResponse = {
      intro
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI Intro API 错误:', error);
    
    // 返回默认文案
    return NextResponse.json({
      intro: '我为你匹配了一位专业的 AI 助手来帮助你实现目标。'
    });
  }
}

/**
 * GET 请求返回 API 信息
 */
export async function GET() {
  return NextResponse.json({
    name: 'AI Intro Generation API',
    version: '1.0.0',
    description: 'Generate personalized introduction text for AI assistants',
    endpoint: '/api/ai/intro',
    method: 'POST'
  });
}


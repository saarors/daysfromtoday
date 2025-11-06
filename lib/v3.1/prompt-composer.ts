/**
 * V3.1 AI Intelligence Upgrade - Prompt Composer
 * 
 * 用途: 动态组装完整的 AI Prompt（system + user）
 * 核心功能:
 *  - 从数据库查询 Prompt 模板
 *  - 自动匹配并注入方法论内容到 system_prompt
 *  - 替换变量 {goalText}, {days}, {targetDate}
 *  - 三层降级策略保证 100% 可用性
 * 
 * 创建日期: 2025-11-04
 */

import { createClient } from '@/lib/supabase/server';
import { MethodologyMatcher } from './methodology-matcher';
import type {
  PromptTemplate,
  PromptQueryCriteria,
  ComposedPrompt,
  PromptVariables,
} from '@/types/v3.1/prompt-system';

/**
 * Prompt 组装器类
 */
export class PromptComposer {
  /**
   * 组装完整的 Prompt
   * 
   * @param criteria - 查询条件（goal_type, difficulty, language, stage）
   * @param variables - 变量替换参数（goalText, days, targetDate）
   * @returns 组装后的完整 Prompt
   */
  static async compose(
    criteria: PromptQueryCriteria,
    variables: PromptVariables
  ): Promise<ComposedPrompt> {
    try {
      // 第1步: 尝试从数据库获取 Prompt 模板（带超时保护）
      const template = await Promise.race([
        this.queryPromptTemplate(criteria),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)) // 3秒超时
      ]);

      if (template) {
        // 数据库查询成功
        return await this.composeFromDatabase(template, variables, criteria);
      }

      // 第2步: 数据库降级 - 尝试查询通用模板（带超时保护）
      const fallbackTemplate = await Promise.race([
        this.queryFallbackTemplate(criteria),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)) // 2秒超时
      ]);

      if (fallbackTemplate) {
        return await this.composeFromDatabase(fallbackTemplate, variables, criteria);
      }

      // 第3步: 硬编码降级 - 使用硬编码的通用模板
      return this.composeFromHardcoded(variables, criteria);

    } catch (error) {
      // 任何错误都降级到硬编码模板
      return this.composeFromHardcoded(variables, criteria);
    }
  }

  /**
   * 从数据库查询 Prompt 模板
   */
  private static async queryPromptTemplate(
    criteria: PromptQueryCriteria
  ): Promise<PromptTemplate | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('ai_prompt_library')
      .select('*')
      .eq('goal_type', criteria.goal_type)
      .eq('difficulty', criteria.difficulty)
      .eq('language', criteria.language)
      .eq('stage', criteria.stage)
      .eq('is_active', true)
      .order('version', { ascending: false }) // 优先使用最新版本
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data as PromptTemplate | null;
  }

  /**
   * 查询降级模板（general + any）
   */
  private static async queryFallbackTemplate(
    criteria: PromptQueryCriteria
  ): Promise<PromptTemplate | null> {
    const supabase = createClient();

    // 尝试查询 general + any 的通用模板
    const { data, error } = await supabase
      .from('ai_prompt_library')
      .select('*')
      .eq('goal_type', 'general')
      .eq('difficulty', 'any')
      .eq('language', criteria.language)
      .eq('stage', criteria.stage)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data as PromptTemplate | null;
  }

  /**
   * 从数据库模板组装 Prompt
   */
  private static async composeFromDatabase(
    template: PromptTemplate,
    variables: PromptVariables,
    criteria: PromptQueryCriteria
  ): Promise<ComposedPrompt> {
    let systemPrompt = template.system_prompt;
    let userPrompt = template.user_prompt || '';

    // 如果模板关联了方法论，注入方法论内容
    if (template.methodology_id) {
      const methodology = await MethodologyMatcher.getByCode(
        template.methodology_id
      );

      if (methodology) {
        const methodologyContent = criteria.language === 'zh'
          ? methodology.prompt_injection_zh
          : methodology.prompt_injection_en;

        // 在 system_prompt 末尾注入方法论内容
        systemPrompt += '\n\n' + methodologyContent;
      }
    } else {
      // 如果模板没有关联方法论，尝试自动匹配
      const matchResult = await MethodologyMatcher.match({
        goal_type: criteria.goal_type,
        difficulty: criteria.difficulty as any,
        language: criteria.language as any,
      });

      if (matchResult.methodology) {
        const methodology = matchResult.methodology;
        const methodologyContent = criteria.language === 'zh'
          ? methodology.prompt_injection_zh
          : methodology.prompt_injection_en;

        systemPrompt += '\n\n' + methodologyContent;
      }
    }

    // 替换变量
    userPrompt = this.replaceVariables(userPrompt, variables);

    return {
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      temperature: template.temperature,
      max_tokens: template.max_tokens,
      metadata: {
        prompt_id: template.id,
        methodology_id: template.methodology_id,
        fallback_level: 0,
        source: 'database',
      },
    };
  }

  /**
   * 任务分解降级 Prompt（硬编码）
   */
  private static composeTaskDecompositionFallback(
    variables: PromptVariables,
    criteria: PromptQueryCriteria
  ): ComposedPrompt {
    const systemPrompt = criteria.language === 'zh'
      ? `你是专业的目标规划助手，能够把目标和预期分解成可被实现的任务。请将用户的目标分解为 2-5 个具体的、可执行的任务步骤。

⚠️ 重要约束：
- **每条任务不超过40个字**（含标点符号）
- 使用简洁、清晰，有人性化的表达（说人话）
- 可以有一定的修饰词和从句
- 直接说明要做什么，不需要过度解释

📝 输出格式：
1. 第一个任务（不超过40字）
2. 第二个任务（不超过40字）
3. 第三个任务（不超过40字）
4. 第四个任务（不超过40字）
5. 第五个任务（不超过40字）

💡 容易实现的目标，任务条目少一些；难度大的目标，任务条目多一些。

⚠️ 输出任务列表，可以添加简单的解释或说明。`
      : `You are a professional goal planning assistant who can break down goals into achievable tasks. Break down the user's goal into 2-5 specific, actionable task steps.

⚠️ Important Constraints:
- **Each task must not exceed 40 characters** (including punctuation)
- Use concise, clear, human-friendly expressions
- Some modifiers and clauses are allowed
- State directly what needs to be done

📝 Output Format:
1. First task (max 40 chars)
2. Second task (max 40 chars)
3. Third task (max 40 chars)
4. Fourth task (max 40 chars)
5. Fifth task (max 40 chars)

💡 Simple goals: fewer tasks; complex goals: more tasks.

⚠️ Output the task list with brief explanations if needed.`;

    const userPrompt = criteria.language === 'zh'
      ? `用户的目标：${variables.goalText}
时间跨度：${variables.days} 天
目标日期：${variables.targetDate || '未指定'}

请生成 2-5 个任务步骤，每条不超过40字。`
      : `User's goal: ${variables.goalText}
Time span: ${variables.days} days
Target date: ${variables.targetDate || 'Not specified'}

Generate 2-5 task steps, each not exceeding 40 characters.`;

    return {
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      temperature: 0.7,
      max_tokens: 500,
      metadata: {
        prompt_id: 'hardcoded-task-decomposition',
        source: 'hardcoded-fallback',
      },
    };
  }

  /**
   * 使用硬编码的通用模板（最后降级）
   */
  private static composeFromHardcoded(
    variables: PromptVariables,
    criteria: PromptQueryCriteria
  ): ComposedPrompt {
    // 🔥 针对任务分解阶段的特殊 Prompt
    if (criteria.stage === 'task-decomposition') {
      return this.composeTaskDecompositionFallback(variables, criteria);
    }

    const systemPrompt = criteria.language === 'zh'
      ? `你是专业的目标规划助手，使用 DeepSeek Reasoner 模型。

🎯 你的核心能力:
1. 深入理解用户目标背后的动机
2. 提供真诚、个性化的建议
3. 展示你的推理过程
4. 根据目标类型调整语气

📝 回复格式要求:

<think>
[在此展示你的思考过程，100-200字]
</think>

## 💬 我的理解

[用第一人称表达理解，2-3句话]

## 🎯 我的建议

[自然段落，给出具体建议]

## ⚡ 实战技巧

给出3-5个可操作的技巧。

## 💪 给你的鼓励

用1-2句真诚的话鼓励用户。

❗ 重要约束:
- **禁止在<think>标签内嵌套<think>标签**
- **每个响应只有一对<think></think>标签，且必须在开头**
- **每个标题只出现一次**`
      : `You are a professional and empathetic goal planning assistant using DeepSeek Reasoner.

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

    const userPrompt = this.replaceVariables(
      criteria.language === 'zh'
        ? `请帮我分析以下目标：

目标内容：{goalText}
目标日期：{targetDate}
距离今天：{days} 天

请提供详细的分析和建议。`
        : `Please analyze the following goal:

Goal: {goalText}
Target Date: {targetDate}
Days from today: {days} days

Please provide detailed analysis and recommendations.`,
      variables
    );

    return {
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      temperature: 0.7,
      max_tokens: 2000,
      metadata: {
        fallback_level: 2,
        source: 'hardcoded',
      },
    };
  }

  /**
   * 替换 Prompt 中的变量占位符
   * 
   * 支持的变量格式: {goalText}, {days}, {targetDate}
   */
  private static replaceVariables(
    text: string,
    variables: PromptVariables
  ): string {
    let result = text;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return result;
  }

  /**
   * 批量组装多个 Prompt（用于预热或缓存）
   */
  static async batchCompose(
    criteriaList: PromptQueryCriteria[],
    variables: PromptVariables
  ): Promise<ComposedPrompt[]> {
    return Promise.all(
      criteriaList.map((criteria) => this.compose(criteria, variables))
    );
  }

  /**
   * 验证 Prompt 模板的有效性
   */
  static validateTemplate(template: PromptTemplate): boolean {
    if (!template.system_prompt || template.system_prompt.trim() === '') {
      console.error('[PromptComposer] system_prompt 不能为空');
      return false;
    }

    if (template.temperature < 0 || template.temperature > 1) {
      console.error('[PromptComposer] temperature 必须在 0-1 之间');
      return false;
    }

    if (template.max_tokens <= 0) {
      console.error('[PromptComposer] max_tokens 必须大于 0');
      return false;
    }

    return true;
  }
}

/**
 * 导出便捷函数
 */
export const composePrompt = PromptComposer.compose.bind(PromptComposer);
export const validatePromptTemplate = PromptComposer.validateTemplate.bind(PromptComposer);







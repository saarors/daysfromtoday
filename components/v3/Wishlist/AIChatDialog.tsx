'use client';

/**
 * AI 对话界面组件
 * Phase 2: 使用 Mock 数据
 * Phase 3: 接入真实 AI API
 */

import { useState, useEffect } from 'react';
import { getAssistant } from '@/lib/ai-assistants';
import type { AIAssistantType } from '@/types/ai-assistant';

interface AIChatDialogProps {
  goalText: string;
  targetDate: string;
  days: number;
  workingDays?: number;
  assistant: AIAssistantType;
  onComplete: (aiAnalysis: string, aiSummary: string) => void;
  locale: string;
}

export function AIChatDialog({
  goalText,
  targetDate,
  days,
  workingDays = 0,
  assistant,
  onComplete,
  locale,
}: AIChatDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [aiResponse, setAiResponse] = useState('');

  const currentAssistant = getAssistant(assistant);

  const text = {
    en: {
      userGoal: 'Your Goal',
      targetDate: 'Target Date',
      daysRemaining: 'Days Remaining',
      workingDays: 'Working Days',
      analyzing: 'is analyzing...',
      suggestion: '\'s Suggestion',
      complete: 'Complete',
    },
    zh: {
      userGoal: '你的目标',
      targetDate: '目标日期',
      daysRemaining: '距今',
      workingDays: '工作日',
      analyzing: '正在分析...',
      suggestion: '的建议',
      complete: '完成',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  // Mock AI 响应（Phase 2）
  useEffect(() => {
    const generateMockResponse = () => {
      // 根据不同助手生成不同风格的 Mock 响应
      let mockResponse = '';
      
      if (assistant === 'twinkle') {
        mockResponse = locale === 'zh' 
          ? `太棒了！${days} 天的时间完全足够！✨\n\n我看到你的决心了，这让我很感动。让我们一起把这个目标分解成小步骤，每一步都是向梦想靠近。\n\n📋 **阶段分解：**\n第 1-2 个月：打好基础，建立习惯\n第 3-4 个月：逐步提升，保持节奏\n最后阶段：冲刺准备，调整状态\n\n💡 **每周建议：**\n- 制定可执行的小目标\n- 每天记录进度\n- 保持积极心态\n\n相信你一定可以的！加油！💪`
          : `Amazing! ${days} days is totally enough! ✨\n\nI can see your determination, and it moves me. Let's break this goal into small steps, each one bringing you closer to your dream.\n\n📋 **Milestone Breakdown:**\nMonth 1-2: Build foundation and habits\nMonth 3-4: Gradual improvement, maintain rhythm\nFinal stage: Sprint preparation, adjust mindset\n\n💡 **Weekly Suggestions:**\n- Set achievable mini-goals\n- Track progress daily\n- Stay positive\n\nYou can definitely do this! 💪`;
      } else if (assistant === 'labubu') {
        mockResponse = locale === 'zh'
          ? `哈哈，${days} 天？这就像给你一个超级长的跑道，你可以慢慢加速！😄\n\n我有个大胆的想法：把实现目标想象成打怪升级，每完成一个小任务就升一级。\n\n🎮 **升级路线图：**\n新手村（前30天）：熟悉规则，积累经验\n进阶区（中期）：提升技能，挑战BOSS\n终极关卡（最后冲刺）：满级挑战，完美通关\n\n🎯 **有趣建议：**\n- 设置"成就徽章"奖励自己\n- 找个"队友"一起打怪\n- 别忘了"存档"（记录进度）\n\n游戏开始，准备好了吗？🚀`
          : `Haha, ${days} days? It's like giving you a super long runway to gradually accelerate! 😄\n\nI have a bold idea: Imagine achieving your goal as leveling up in a game, gaining a level for each small task completed.\n\n🎮 **Level-up Roadmap:**\nBeginner Zone (First 30 days): Learn the rules, gain experience\nIntermediate Zone (Mid-term): Upgrade skills, challenge bosses\nFinal Boss (Last sprint): Max level challenge, perfect completion\n\n🎯 **Fun Suggestions:**\n- Set "achievement badges" to reward yourself\n- Find a "teammate" to play together\n- Don't forget to "save" (track progress)\n\nGame on, ready? 🚀`;
      } else {
        mockResponse = locale === 'zh'
          ? `${days} 天，时间充足。重点是系统化执行。\n\n我给你一个清晰的路线图：\n\n**阶段 1（前 30%）：** 建立基础框架\n- 明确核心指标\n- 制定详细计划\n- 建立反馈机制\n\n**阶段 2（中间 40%）：** 持续优化迭代\n- 每周复盘调整\n- 关注关键数据\n- 保持执行节奏\n\n**阶段 3（最后 30%）：** 冲刺收尾\n- 检查完成度\n- 查漏补缺\n- 准备交付\n\n⚠️ **关键提醒：**\n1. 专注执行，避免完美主义\n2. 定期评估，及时调整\n3. 保持节奏，避免拖延\n\n现在开始执行。`
          : `${days} days, sufficient time. Focus on systematic execution.\n\nHere's a clear roadmap:\n\n**Phase 1 (First 30%):** Build foundation\n- Define core metrics\n- Create detailed plan\n- Establish feedback loop\n\n**Phase 2 (Middle 40%):** Continuous optimization\n- Weekly review and adjustment\n- Monitor key data\n- Maintain execution rhythm\n\n**Phase 3 (Final 30%):** Sprint to finish\n- Check completion status\n- Fill gaps\n- Prepare delivery\n\n⚠️ **Key Reminders:**\n1. Focus on execution, avoid perfectionism\n2. Regular evaluation, timely adjustment\n3. Keep rhythm, avoid procrastination\n\nStart executing now.`;
      }
      
      return mockResponse;
    };

    // 模拟 AI 思考时间（1.5-2.5秒）
    const thinkingTime = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      const response = generateMockResponse();
      setAiResponse(response);
      setIsAnalyzing(false);
    }, thinkingTime);
  }, [assistant, days, locale]);

  const handleComplete = () => {
    // 生成 AI 建议摘要（前200字）
    const summary = aiResponse.split('\n\n')[0].substring(0, 200) + '...';
    onComplete(aiResponse, summary);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 用户输入信息块 */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              👤
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">{t.userGoal}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <div><span className="font-medium">{t.targetDate}:</span> {targetDate}</div>
                <div>
                  <span className="font-medium">{t.daysRemaining}:</span> {days} {locale === 'zh' ? '天' : 'days'}
                  {workingDays > 0 && ` (${workingDays} ${t.workingDays})`}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">{goalText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI 响应块 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div 
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${currentAssistant.color}20` }}
            >
              {currentAssistant.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-4">
                {currentAssistant.name}{t.suggestion}
              </h3>
              
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{currentAssistant.name} {t.analyzing}</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 完成按钮 */}
        {!isAnalyzing && (
          <div className="text-center pt-4">
            <button
              onClick={handleComplete}
              className="
                px-10 py-3 text-lg font-semibold rounded-lg
                bg-blue-600 text-white
                hover:bg-blue-700 hover:shadow-lg
                transition-all duration-200
                active:scale-95
              "
            >
              ✅ {t.complete}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


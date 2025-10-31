'use client';

/**
 * Hero Section 组件
 * V3.0 - 首页核心区域，整合所有输入功能
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateGoalInput } from './DateGoalInput';
import { AIAssistantSelector } from './AIAssistantSelector';
import { DEFAULT_ASSISTANT } from '@/lib/ai-assistants';
import type { AIAssistantType } from '@/types/ai-assistant';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const router = useRouter();

  // 日期相关状态
  const [days, setDays] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  
  // 目标文本
  const [goalText, setGoalText] = useState('');
  
  // AI 助手选择
  const [selectedAssistant, setSelectedAssistant] = useState<AIAssistantType>(DEFAULT_ASSISTANT as AIAssistantType);
  
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  const text = {
    en: {
      title: 'Days From Today',
      subtitle: 'Let AI accompany you to achieve your future goals',
      description: 'Simple and powerful date calculator with fun AI to help you succeed',
      submitButton: 'Start',
      submittingButton: 'Preparing...',
      errorDays: 'Please select a date or enter days',
      errorGoal: 'Please describe your goal',
    },
    zh: {
      title: 'Days From Today',
      subtitle: '让 AI 陪伴你实现未来的目标',
      description: '简单和强大的日期计算工具，有趣的 AI 陪伴你实现目标',
      submitButton: '开始',
      submittingButton: '准备中...',
      errorDays: '请选择日期或输入天数',
      errorGoal: '请描述你的目标',
    },
  };

  const t = text[locale as keyof typeof text];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    if (days <= 0 || !targetDate) {
      alert(t.errorDays);
      return;
    }

    if (!goalText.trim()) {
      alert(t.errorGoal);
      return;
    }

    setIsSubmitting(true);

    try {
      // Phase 1: 只导航到愿望清单页面（带参数）
      // Phase 2 会真正调用 AI API
      const params = new URLSearchParams({
        days: days.toString(),
        targetDate,
        goalText,
        assistant: selectedAssistant,
      });

      router.push(`/${locale}/wishlist?${params.toString()}`);
    } catch (error) {
      console.error('提交失败:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative px-4 pt-32 pb-16">
      <div className="w-full max-w-4xl mx-auto">
        {/* 主标题区域 - 增加上边距，避免被导航栏遮挡 */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            {t.subtitle}
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 日期+目标输入（紧凑版） */}
          <DateGoalInput
            days={days}
            setDays={setDays}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            goalText={goalText}
            setGoalText={setGoalText}
            selectedAssistant={selectedAssistant}
            setSelectedAssistant={setSelectedAssistant}
            locale={locale}
          />

          {/* 提交按钮 */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || days <= 0 || !goalText.trim()}
              className="
                px-10 py-3 text-lg font-semibold rounded-lg
                bg-blue-600 text-white
                hover:bg-blue-700 hover:shadow-lg
                disabled:bg-gray-400 disabled:cursor-not-allowed
                transition-all duration-200
                active:scale-95
              "
            >
              {isSubmitting ? t.submittingButton : t.submitButton}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}


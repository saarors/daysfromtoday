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
      submitButton: '🚀 Start Achieving',
      submittingButton: 'Preparing...',
      errorDays: 'Please select a date or enter days',
      errorGoal: 'Please describe your goal',
    },
    zh: {
      title: 'Days From Today',
      subtitle: '让 AI 陪伴你实现未来的目标',
      description: '简单和强大的日期计算工具，有趣的 AI 陪伴你实现目标',
      submitButton: '🚀 开始实现目标',
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
    <section className="relative min-h-[90vh] flex items-center justify-center py-16 px-4">
      {/* 背景装饰（简洁版，无渐变） */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10" />

      <div className="w-full max-w-5xl">
        {/* 主标题区域 */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            {t.subtitle}
          </p>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 日期+目标输入 */}
          <DateGoalInput
            days={days}
            setDays={setDays}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            goalText={goalText}
            setGoalText={setGoalText}
            locale={locale}
          />

          {/* AI 助手选择 */}
          <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <AIAssistantSelector
              selected={selectedAssistant}
              onSelect={setSelectedAssistant}
              locale={locale}
            />
          </div>

          {/* 提交按钮 */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || days <= 0 || !goalText.trim()}
              className="
                px-12 py-4 text-lg font-semibold rounded-xl
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


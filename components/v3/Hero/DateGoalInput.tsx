'use client';

/**
 * 日期+目标大输入框组件（V3优化版 + Phase 3.5）
 * - 更紧凑的布局
 * - Phase 3.5: 移除 AI 助手手动选择（改为自动智能匹配）
 */

import { useState, useEffect } from 'react';
import { QuickDateSelector } from './QuickDateSelector';
import type { AIAssistantType } from '@/types/ai-assistant';

interface DateGoalInputProps {
  days: number;
  setDays: (days: number) => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  goalText: string;
  setGoalText: (text: string) => void;
  selectedAssistant: AIAssistantType;
  setSelectedAssistant: (assistant: AIAssistantType) => void;
  locale?: string;
}

const MAX_GOAL_LENGTH = 5000;
const MAX_DAYS = 10000;

export function DateGoalInput({
  days,
  setDays,
  targetDate,
  setTargetDate,
  goalText,
  setGoalText,
  selectedAssistant,
  setSelectedAssistant,
  locale = 'en',
}: DateGoalInputProps) {
  const [inputMode, setInputMode] = useState<'days' | 'date'>('days');
  const [daysError, setDaysError] = useState('');
  const [dateError, setDateError] = useState('');

  const text = {
    en: {
      subtitle: 'Choose a future date',
      customDays: 'Custom days',
      specificDate: 'Specific date',
      daysPlaceholder: 'Enter days',
      goalPlaceholder: 'On this day, what will you do / who will you become?',
      aiAssistant: 'AI Assistant',
      errorZero: 'Days cannot be 0',
      errorNegative: 'Time machine is still under development 😉',
      errorOverflow: 'Do you want to travel to 300 years in the future? 😄',
      errorPastDate: 'Let\'s focus on the future and create something beautiful! ✨',
      errorDecimal: 'Please enter a whole number',
    },
    zh: {
      subtitle: '选择一个未来的日期',
      customDays: '自定义天数',
      specificDate: '具体日期',
      daysPlaceholder: '输入天数',
      goalPlaceholder: '在这一天，你将会做什么 / 成为谁？',
      aiAssistant: 'AI 助手',
      errorZero: '天数不能为0',
      errorNegative: '时光机还在研发中哦~ 😉',
      errorOverflow: '你想穿越到未来300年吗？😄',
      errorPastDate: '让我们专注未来，一起创造美好！✨',
      errorDecimal: '请输入整数',
    },
  };

  const t = text[locale as keyof typeof text];

  const handleQuickSelect = (selectedDays: number, selectedDate: string) => {
    setDays(selectedDays);
    setTargetDate(selectedDate);
    setInputMode('days');
    setDaysError('');
    setDateError('');
  };

  const handleDaysChange = (value: string) => {
    const num = parseInt(value, 10);

    if (value === '' || value === '0') {
      setDaysError(t.errorZero);
      setDays(0);
      return;
    }

    if (isNaN(num)) {
      setDaysError('');
      setDays(0);
      return;
    }

    if (num < 0) {
      setDaysError(t.errorNegative);
      setDays(0);
      return;
    }

    if (value.includes('.')) {
      setDaysError(t.errorDecimal);
      return;
    }

    if (num > MAX_DAYS) {
      setDaysError(t.errorOverflow);
      setDays(MAX_DAYS);
      return;
    }

    setDaysError('');
    setDays(num);

    const target = new Date();
    target.setDate(target.getDate() + num);
    setTargetDate(target.toISOString().split('T')[0]);
  };

  const handleDateChange = (value: string) => {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError(t.errorPastDate);
      return;
    }

    setDateError('');
    setTargetDate(value);

    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDays(diffDays);
  };

  const handleGoalTextChange = (value: string) => {
    if (value.length <= MAX_GOAL_LENGTH) {
      setGoalText(value);
    }
  };

  const remainingChars = MAX_GOAL_LENGTH - goalText.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="w-full space-y-4 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      {/* 快速选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.subtitle}
        </label>
        <QuickDateSelector onSelect={handleQuickSelect} locale={locale} />
      </div>

      {/* 日期输入：自定义天数、具体日期、日期选择器 - 同一行 */}
      <div className="flex items-start gap-3">
        {/* 自定义天数 */}
        <div className="flex-1">
          <input
            type="number"
            value={days || ''}
            onChange={(e) => handleDaysChange(e.target.value)}
            placeholder={t.daysPlaceholder}
            min="1"
            max={MAX_DAYS}
            className="
              w-full px-3 py-2 text-base border-2 border-gray-300 rounded-lg
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              transition-colors
            "
          />
        </div>

        {/* 或 */}
        <div className="flex items-center h-10 text-gray-400 font-medium">
          {locale === 'zh' ? '或' : 'or'}
        </div>

        {/* 具体日期 */}
        <div className="flex-1">
          <input
            type="date"
            value={targetDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="
              w-full px-3 py-2 text-base border-2 border-gray-300 rounded-lg
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              transition-colors
            "
          />
        </div>
      </div>

      {/* 错误提示 */}
      {(daysError || dateError) && (
        <p className="text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          {daysError || dateError}
        </p>
      )}

      {/* 目标输入大文本框（Phase 3.5: AI 助手已改为自动匹配，移除手动选择） */}
      <div className="relative">
        <textarea
          value={goalText}
          onChange={(e) => handleGoalTextChange(e.target.value)}
          placeholder={t.goalPlaceholder}
          rows={6}
          className={`
            w-full px-4 py-3 text-base border-2 rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-200
            transition-colors
            ${isOverLimit 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'}
          `}
        />

        {/* 右下角：字数统计 */}
        <div className={`
          absolute bottom-3 right-3 text-sm
          ${isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-500'}
        `}>
          {goalText.length} / {MAX_GOAL_LENGTH}
        </div>
      </div>
    </div>
  );
}

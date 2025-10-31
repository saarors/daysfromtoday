'use client';

/**
 * 日期+目标大输入框组件
 * V3.0 - 核心输入组件，支持5000字目标描述
 */

import { useState, useEffect } from 'react';
import { QuickDateSelector } from './QuickDateSelector';

interface DateGoalInputProps {
  days: number;
  setDays: (days: number) => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  goalText: string;
  setGoalText: (text: string) => void;
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
  locale = 'en',
}: DateGoalInputProps) {
  const [inputMode, setInputMode] = useState<'days' | 'date'>('days');
  const [daysError, setDaysError] = useState('');
  const [dateError, setDateError] = useState('');

  const text = {
    en: {
      title: 'Meet your future self here',
      subtitle: 'Please enter a future date from today',
      customDays: 'Custom days',
      specificDate: 'Specific date',
      daysPlaceholder: 'Enter days',
      goalPlaceholder: 'On this day, what will you do / who will you become?',
      characterCount: 'characters',
      errorZero: 'Days cannot be 0',
      errorNegative: 'Time machine is still under development 😉',
      errorOverflow: 'Do you want to travel to 300 years in the future? 😄',
      errorPastDate: 'Let\'s focus on the future and create something beautiful! ✨',
      errorDecimal: 'Please enter a whole number',
    },
    zh: {
      title: '在这里遇见未来的你',
      subtitle: '请输入从今天起的未来日期',
      customDays: '自定义天数',
      specificDate: '具体日期',
      daysPlaceholder: '输入天数',
      goalPlaceholder: '在这一天，你将会做什么 / 成为谁？',
      characterCount: '字符',
      errorZero: '天数不能为0',
      errorNegative: '时光机还在研发中哦~ 😉',
      errorOverflow: '你想穿越到未来300年吗？😄',
      errorPastDate: '让我们专注未来，一起创造美好！✨',
      errorDecimal: '请输入整数',
    },
  };

  const t = text[locale as keyof typeof text];

  // 快速选择回调
  const handleQuickSelect = (selectedDays: number, selectedDate: string) => {
    setDays(selectedDays);
    setTargetDate(selectedDate);
    setInputMode('days');
    setDaysError('');
    setDateError('');
  };

  // 自定义天数输入
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

    // 自动计算目标日期
    const target = new Date();
    target.setDate(target.getDate() + num);
    setTargetDate(target.toISOString().split('T')[0]);
  };

  // 具体日期输入
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

    // 自动计算天数
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDays(diffDays);
  };

  // 目标文本输入
  const handleGoalTextChange = (value: string) => {
    if (value.length <= MAX_GOAL_LENGTH) {
      setGoalText(value);
    }
  };

  const remainingChars = MAX_GOAL_LENGTH - goalText.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* 标题区域 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          🎯 {t.title}
        </h2>
        <p className="text-gray-600 text-sm">
          {t.subtitle}
        </p>
      </div>

      {/* 快速选择 */}
      <QuickDateSelector onSelect={handleQuickSelect} locale={locale} />

      {/* 自定义输入方式切换 */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setInputMode('days')}
          className={`
            flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${inputMode === 'days' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'}
          `}
        >
          {t.customDays}
        </button>
        <button
          type="button"
          onClick={() => setInputMode('date')}
          className={`
            flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${inputMode === 'date' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'}
          `}
        >
          {t.specificDate}
        </button>
      </div>

      {/* 输入框 */}
      <div className="space-y-4">
        {inputMode === 'days' ? (
          <div>
            <input
              type="number"
              value={days || ''}
              onChange={(e) => handleDaysChange(e.target.value)}
              placeholder={t.daysPlaceholder}
              min="1"
              max={MAX_DAYS}
              className="
                w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition-colors
              "
            />
            {daysError && (
              <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
                <span>⚠️</span>
                {daysError}
              </p>
            )}
          </div>
        ) : (
          <div>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="
                w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition-colors
              "
            />
            {dateError && (
              <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
                <span>⚠️</span>
                {dateError}
              </p>
            )}
          </div>
        )}

        {/* 目标输入大文本框 */}
        <div className="relative">
          <textarea
            value={goalText}
            onChange={(e) => handleGoalTextChange(e.target.value)}
            placeholder={t.goalPlaceholder}
            rows={8}
            className={`
              w-full px-4 py-3 text-base border-2 rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-200
              transition-colors
              ${isOverLimit 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'}
            `}
          />
          <div className={`
            absolute bottom-3 right-3 text-sm
            ${isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-500'}
          `}>
            {goalText.length} / {MAX_GOAL_LENGTH} {t.characterCount}
          </div>
        </div>
      </div>
    </div>
  );
}


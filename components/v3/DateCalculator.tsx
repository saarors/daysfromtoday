/**
 * 日期计算器组件（Phase 2.6）
 * 根据计算模式显示不同的输入界面
 */

'use client';

import type { CalculationMode, DaysType, DateCalculationResult } from '@/types/card-template';
import { useState } from 'react';

interface DateCalculatorProps {
  calculationMode: CalculationMode;
  daysType: DaysType;
  onDaysTypeChange: (value: DaysType) => void;
  targetDate: string;
  onTargetDateChange: (value: string) => void;
  days: number;
  onDaysChange: (value: number) => void;
  calculationResult: DateCalculationResult | null;
  isCalculating: boolean;
  locale?: string;
}

export function DateCalculator({
  calculationMode,
  daysType,
  onDaysTypeChange,
  targetDate,
  onTargetDateChange,
  days,
  onDaysChange,
  calculationResult,
  isCalculating,
  locale = 'en',
}: DateCalculatorProps) {
  const text = {
    en: {
      targetDate: 'Target Date',
      days: 'Days',
      naturalDays: 'Natural Days',
      workingDays: 'Working Days (excluding weekends & holidays)',
      calculatedDate: 'Calculated Date',
      calculatedDays: 'Calculated Days',
      natural: 'Natural',
      working: 'Working',
      calculating: 'Calculating...',
    },
    zh: {
      targetDate: '目标日期',
      days: '天数',
      naturalDays: '自然日',
      workingDays: '工作日（排除周末和节假日）',
      calculatedDate: '计算日期',
      calculatedDays: '计算天数',
      natural: '自然日',
      working: '工作日',
      calculating: '计算中...',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="space-y-4">
      {/* 天数类型选择 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onDaysTypeChange('natural')}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${
              daysType === 'natural'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {t.natural}
        </button>
        <button
          type="button"
          onClick={() => onDaysTypeChange('working')}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${
              daysType === 'working'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {t.working}
        </button>
      </div>

      {/* 输入区域 */}
      {calculationMode === 'date-first' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.targetDate}
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => onTargetDateChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.days}
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => onDaysChange(parseInt(e.target.value) || 0)}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}

      {/* 计算结果 */}
      {isCalculating && (
        <div className="p-4 bg-blue-50 rounded-lg text-center text-blue-600">
          {t.calculating}
        </div>
      )}

      {calculationResult && !isCalculating && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
          {calculationMode === 'date-first' ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.naturalDays}:</span>
                <span className="font-semibold">{calculationResult.naturalDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.workingDays}:</span>
                <span className="font-semibold">{calculationResult.workingDays}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.calculatedDate}:</span>
                <span className="font-semibold">
                  {new Date(calculationResult.targetDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {daysType === 'natural' ? t.workingDays : t.naturalDays}:
                </span>
                <span className="font-semibold">
                  {daysType === 'natural' 
                    ? calculationResult.workingDays 
                    : calculationResult.naturalDays}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


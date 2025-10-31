/**
 * 计算模式切换组件（Phase 2.6）
 * 切换"日期优先"或"天数优先"
 */

'use client';

import type { CalculationMode } from '@/types/card-template';

interface CalculationModeToggleProps {
  value: CalculationMode;
  onChange: (value: CalculationMode) => void;
  locale?: string;
}

export function CalculationModeToggle({ value, onChange, locale = 'en' }: CalculationModeToggleProps) {
  const text = {
    en: {
      dateFirst: '📅 Date First',
      daysFirst: '🔢 Days First',
      dateFirstDesc: 'Set date, calculate days',
      daysFirstDesc: 'Set days, calculate date',
    },
    zh: {
      dateFirst: '📅 日期优先',
      daysFirst: '🔢 天数优先',
      dateFirstDesc: '设定日期，计算天数',
      daysFirstDesc: '设定天数，计算日期',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('date-first')}
        className={`
          flex-1 px-4 py-3 rounded-lg text-left transition-all
          ${
            value === 'date-first'
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-white border-2 border-gray-200 hover:border-gray-300'
          }
        `}
      >
        <div className="font-medium text-sm">{t.dateFirst}</div>
        <div className="text-xs text-gray-500 mt-1">{t.dateFirstDesc}</div>
      </button>
      <button
        type="button"
        onClick={() => onChange('days-first')}
        className={`
          flex-1 px-4 py-3 rounded-lg text-left transition-all
          ${
            value === 'days-first'
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-white border-2 border-gray-200 hover:border-gray-300'
          }
        `}
      >
        <div className="font-medium text-sm">{t.daysFirst}</div>
        <div className="text-xs text-gray-500 mt-1">{t.daysFirstDesc}</div>
      </button>
    </div>
  );
}


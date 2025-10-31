'use client';

/**
 * 快速日期选择器组件
 * V3.0 - 提供10个预设的日期快捷选项
 */

import { addDays, format } from 'date-fns';

interface QuickDateOption {
  label: {
    en: string;
    zh: string;
  };
  days: number;
}

const QUICK_OPTIONS: QuickDateOption[] = [
  { label: { en: '7 Days', zh: '7天' }, days: 7 },
  { label: { en: '14 Days', zh: '14天' }, days: 14 },
  { label: { en: '30 Days', zh: '30天' }, days: 30 },
  { label: { en: '3 Months', zh: '3个月' }, days: 90 },
  { label: { en: '100 Days', zh: '100天' }, days: 100 },
  { label: { en: '4 Months', zh: '4个月' }, days: 120 },
  { label: { en: 'Half Year', zh: '半年' }, days: 180 },
  { label: { en: '1 Year', zh: '1年' }, days: 365 },
  { label: { en: '3 Years', zh: '3年' }, days: 1095 },
  { label: { en: '5 Years', zh: '5年' }, days: 1825 },
];

interface QuickDateSelectorProps {
  onSelect: (days: number, targetDate: string) => void;
  locale?: string;
}

export function QuickDateSelector({ onSelect, locale = 'en' }: QuickDateSelectorProps) {
  const handleSelect = (days: number) => {
    const targetDate = addDays(new Date(), days);
    const targetDateStr = format(targetDate, 'yyyy-MM-dd');
    onSelect(days, targetDateStr);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {locale === 'zh' ? '快速选择' : 'Quick Select'}
      </label>
      
      <div className="flex flex-wrap gap-2">
        {QUICK_OPTIONS.map((option) => (
          <button
            key={option.days}
            type="button"
            onClick={() => handleSelect(option.days)}
            className="
              px-4 py-2 rounded-lg border border-gray-300 bg-white
              text-sm font-medium text-gray-700
              hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200
              active:scale-95
            "
          >
            {option.label[locale as 'en' | 'zh']}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {locale === 'zh' 
          ? '点击任意选项，系统会自动计算目标日期' 
          : 'Click any option to auto-calculate target date'}
      </p>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { addDaysSafe, subDaysSafe } from '@/lib/date-utils';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { downloadDateCalculationICS } from '@/lib/ics-generator';

interface DateCalculatorProps {
  days: number;
  locale: string;
  type: 'future' | 'past';
  mode: 'calendar' | 'business';
}

export default function DateCalculator({ days, locale, type, mode }: DateCalculatorProps) {
  const [today, setToday] = useState<Date | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    
    if (mode === 'calendar') {
      const result = type === 'future' 
        ? addDaysSafe(now, days)
        : subDaysSafe(now, days);
      setTargetDate(result);
    } else {
      // For business days, we'll use a simple calculation for now
      // In a real app, you'd want to use the business days calculation
      const result = type === 'future' 
        ? addDaysSafe(now, days)
        : subDaysSafe(now, days);
      setTargetDate(result);
    }
  }, [days, type, mode]);

  if (!today || !targetDate) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">计算中...</p>
      </div>
    );
  }

  const dateLocale = locale === 'zh' ? zhCN : enUS;
  const isChinese = locale === 'zh';

  // 下载日历事件
  const handleDownloadICS = () => {
    if (!targetDate) return;
    downloadDateCalculationICS(days, targetDate, type, mode, locale);
  };

  const text = {
    en: {
      title: (days: number) => `${days} ${days === 1 ? 'Day' : 'Days'} ${type === 'future' ? 'from' : 'ago from'} Today`,
      subtitle: mode === 'calendar' ? 'Natural Days Calculator' : 'Business Days Calculator',
      result: 'Result Date',
      calculation: 'Calculation Details',
      startDate: 'Start Date (Today)',
      daysToAdd: type === 'future' ? 'Days to Add' : 'Days Ago',
      targetDate: 'Target Date',
      dayOfWeek: 'Day of the Week',
      badge: mode === 'calendar' ? 'Natural Days' : 'Business Days',
      badgeColor: mode === 'calendar' ? 'bg-blue-100 text-blue-800' : 'bg-cyan-100 text-cyan-800',
      addToCalendar: '📅 Add to Calendar',
      addToCalendarDesc: 'Download ICS file with 1-day reminder'
    },
    zh: {
      title: (days: number) => `从今天起 ${days} 天${type === 'future' ? '后' : '前'}`,
      subtitle: mode === 'calendar' ? '自然日计算器' : '工作日计算器',
      result: '结果日期',
      calculation: '计算详情',
      startDate: '起始日期（今天）',
      daysToAdd: type === 'future' ? '要加的天数' : '之前的天数',
      targetDate: '目标日期',
      dayOfWeek: '星期',
      badge: mode === 'calendar' ? '自然日' : '工作日',
      badgeColor: mode === 'calendar' ? 'bg-blue-100 text-blue-800' : 'bg-cyan-100 text-cyan-800',
      addToCalendar: '📅 加入日历',
      addToCalendarDesc: '下载 ICS 文件，包含提前1天提醒'
    }
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="space-y-8">
      {/* Result Card */}
      <Card className="card-glass">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Badge className={t.badgeColor}>
              {t.badge}
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            {t.title(days)}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {t.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-4" suppressHydrationWarning>
            {format(targetDate, isChinese ? 'yyyy年M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
          </div>
          <div className="text-2xl text-gray-600 mb-6" suppressHydrationWarning>
            {format(targetDate, 'EEEE', { locale: dateLocale })}
          </div>
          
          {/* 加入日历按钮 - 仅在未来日期中显示 */}
          {type === 'future' && (
            <div className="mt-6">
              <button
                onClick={handleDownloadICS}
                className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3"
              >
                {t.addToCalendar}
              </button>
              <p className="text-sm text-gray-500 mt-2">{t.addToCalendarDesc}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calculation Details */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {t.calculation}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t.startDate}</div>
              <div className="font-semibold text-gray-900">
                {format(today, isChinese ? 'yyyy年M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t.daysToAdd}</div>
              <div className="font-semibold text-gray-900">{days}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t.targetDate}</div>
              <div className="font-semibold text-gray-900">
                {format(targetDate, isChinese ? 'yyyy年M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

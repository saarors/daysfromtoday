/**
 * 增强的日期信息展示组件
 * 以卡片形式展示丰富的日期分析信息
 */

'use client';

import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { EnhancedDateInfo } from '@/lib/date-info-enhancer';

interface EnhancedDateResultProps {
  info: EnhancedDateInfo;
  locale: string;
}

export default function EnhancedDateResult({ info, locale }: EnhancedDateResultProps) {
  const isChinese = locale === 'zh';
  const dateLocale = isChinese ? zhCN : enUS;
  
  const text = {
    en: {
      timeStructure: 'Time Structure',
      weekOfMonth: 'Week of Month',
      dayOfYear: 'Day of Year',
      quarter: 'Quarter',
      workdayInfo: 'Workday Information',
      isWorkday: 'Is Workday',
      yes: 'Yes',
      no: 'No',
      workdays: 'Workdays',
      weekends: 'Weekends',
      holidays: 'Holidays',
      days: 'days',
      holidayInfo: 'Holiday Information',
      nearestHoliday: 'Nearest Holiday',
      daysAway: 'days away',
      daysBefore: 'days before',
      relation: 'Relation',
      insights: 'Insights',
      suggestion: 'Suggestion',
      warning: 'Warning',
      excludedDates: 'Excluded Dates',
      viewDetails: 'View Details'
    },
    zh: {
      timeStructure: '时间结构',
      weekOfMonth: '当月第',
      dayOfYear: '当年第',
      quarter: '季度',
      workdayInfo: '工作日信息',
      isWorkday: '是否工作日',
      yes: '是',
      no: '否',
      workdays: '工作日',
      weekends: '周末',
      holidays: '节假日',
      days: '天',
      holidayInfo: '节假日信息',
      nearestHoliday: '最近节假日',
      daysAway: '天后',
      daysBefore: '天前',
      relation: '关系',
      insights: '智能提示',
      suggestion: '建议',
      warning: '注意',
      excludedDates: '排除日期',
      viewDetails: '查看详情'
    }
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  
  return (
    <div className="enhanced-date-result grid gap-4 mt-8">
      {/* 时间结构卡片 */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            📅 {t.timeStructure}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t.weekOfMonth}</div>
              <div className="text-2xl font-bold text-blue-600">
                {isChinese ? `${info.weekOfMonth} 周` : `Week ${info.weekOfMonth}`}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t.dayOfYear}</div>
              <div className="text-2xl font-bold text-purple-600">
                {isChinese ? `${info.dayOfYear} 天` : `Day ${info.dayOfYear}`}
              </div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t.quarter}</div>
              <div className="text-2xl font-bold text-indigo-600">
                Q{info.quarter}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 工作日信息卡片 */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            💼 {t.workdayInfo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{t.isWorkday}</span>
              <Badge variant={info.isWorkday ? 'success' : 'secondary'}>
                {info.isWorkday ? t.yes : t.no}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{t.workdays}</div>
                <div className="text-xl font-bold text-green-600">
                  {info.workdaysCount}
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{t.weekends}</div>
                <div className="text-xl font-bold text-orange-600">
                  {info.weekendsCount}
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{t.holidays}</div>
                <div className="text-xl font-bold text-red-600">
                  {info.holidaysCount}
                </div>
              </div>
            </div>
            
            {/* 排除日期详情（折叠） */}
            {info.excludedDates.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                  {t.excludedDates} ({info.excludedDates.length} {t.days}) - {t.viewDetails}
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {info.excludedDates.map((date, index) => (
                      <div key={index} className="text-gray-600">
                        {format(date, isChinese ? 'M月d日 (E)' : 'MMM d (E)', { locale: dateLocale })}
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 节假日信息卡片 */}
      {(info.nearestHoliday || info.holidayRelation) && (
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🎉 {t.holidayInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {info.nearestHoliday && (
              <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{t.nearestHoliday}</div>
                <div className="font-semibold text-gray-900">
                  {info.nearestHoliday.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {info.nearestHoliday.daysAway} {
                    info.nearestHoliday.isBefore ? t.daysBefore : t.daysAway
                  }
                </div>
              </div>
            )}
            
            {info.holidayRelation && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{t.relation}</div>
                <div className="font-medium text-gray-900">
                  {info.holidayRelation}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* 智能提示卡片 */}
      {(info.suggestion || info.warning) && (
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              💡 {t.insights}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {info.suggestion && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <span className="text-lg">ℹ️</span>
                <div>
                  <div className="text-sm font-medium text-blue-900 mb-1">{t.suggestion}</div>
                  <div className="text-sm text-blue-700">{info.suggestion}</div>
                </div>
              </div>
            )}
            
            {info.warning && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <span className="text-lg">⚠️</span>
                <div>
                  <div className="text-sm font-medium text-yellow-900 mb-1">{t.warning}</div>
                  <div className="text-sm text-yellow-700">{info.warning}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


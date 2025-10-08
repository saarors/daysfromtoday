'use client';

import { useState, useEffect } from 'react';
import { getHolidays, type Holiday } from '@/lib/holidays';
import { translateHolidayName } from '@/lib/holiday-translations';
import { getCountryInfo, COUNTRY_TIERS } from '@/lib/country-config';
import type { CountryCode } from '@/types/user-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface HolidaysListProps {
  locale: string;
}

interface CountryHolidays {
  country: CountryCode;
  countryName: string;
  holidays: (Holiday & { translatedName: string })[];
  loading: boolean;
  error: boolean;
}

export default function HolidaysList({ locale }: HolidaysListProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [countryHolidays, setCountryHolidays] = useState<CountryHolidays[]>([]);
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2' | 'all'>('tier1');
  
  const isChinese = locale === 'zh';
  const dateLocale = isChinese ? zhCN : enUS;

  useEffect(() => {
    async function loadHolidays() {
      // 根据选择的层级筛选国家
      let countries: CountryCode[];
      if (selectedTier === 'tier1') {
        countries = COUNTRY_TIERS.tier1;
      } else if (selectedTier === 'tier2') {
        countries = COUNTRY_TIERS.tier2;
      } else {
        countries = [...COUNTRY_TIERS.tier1, ...COUNTRY_TIERS.tier2];
      }

      // 初始化状态
      const initialState: CountryHolidays[] = countries.map(country => {
        const countryInfo = getCountryInfo(country);
        return {
          country,
          countryName: countryInfo?.name[locale as 'en' | 'zh'] || country,
          holidays: [],
          loading: true,
          error: false,
        };
      });
      setCountryHolidays(initialState);

      // 加载每个国家的节假日
      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        try {
          const result = await getHolidays(country, year);
          const translatedHolidays = result.data.map(holiday => ({
            ...holiday,
            translatedName: translateHolidayName(holiday.name, locale)
          }));

          setCountryHolidays(prev => 
            prev.map(item => 
              item.country === country
                ? { ...item, holidays: translatedHolidays, loading: false }
                : item
            )
          );
        } catch (error) {
          console.error(`Failed to load holidays for ${country}:`, error);
          setCountryHolidays(prev => 
            prev.map(item => 
              item.country === country
                ? { ...item, loading: false, error: true }
                : item
            )
          );
        }
      }
    }

    loadHolidays();
  }, [year, selectedTier, locale]);

  const text = {
    en: {
      selectYear: 'Select Year',
      selectTier: 'Filter Countries',
      tier1: 'Tier 1 (5 Countries)',
      tier2: 'Tier 2 (10 Countries)',
      all: 'All Countries (15)',
      loading: 'Loading holidays...',
      noHolidays: 'No public holidays found for this country.',
      error: 'Failed to load holidays.',
      holidaysCount: (count: number) => `${count} public ${count === 1 ? 'holiday' : 'holidays'}`,
    },
    zh: {
      selectYear: '选择年份',
      selectTier: '筛选国家',
      tier1: '第一梯队（5国）',
      tier2: '第二梯队（10国）',
      all: '全部国家（15国）',
      loading: '加载中...',
      noHolidays: '该国家暂无节假日数据',
      error: '加载失败',
      holidaysCount: (count: number) => `${count} 个公共假期`,
    }
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="space-y-8">
      {/* 控制面板 */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        {/* 年份选择 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">{t.selectYear}:</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2024, 2025, 2026, 2027, 2028].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* 层级筛选 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">{t.selectTier}:</label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as 'tier1' | 'tier2' | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tier1">{t.tier1}</option>
            <option value="tier2">{t.tier2}</option>
            <option value="all">{t.all}</option>
          </select>
        </div>
      </div>

      {/* 节假日列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countryHolidays.map(({ country, countryName, holidays, loading, error }) => (
          <Card key={country} className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{country === 'US' ? '🇺🇸' : country === 'CN' ? '🇨🇳' : country === 'GB' ? '🇬🇧' : country === 'JP' ? '🇯🇵' : country === 'DE' ? '🇩🇪' : '🌍'}</span>
                  <span>{countryName}</span>
                </span>
                {!loading && !error && (
                  <Badge variant="default">{t.holidaysCount(holidays.length)}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">{t.loading}</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>{t.error}</p>
                </div>
              )}

              {!loading && !error && holidays.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>{t.noHolidays}</p>
                </div>
              )}

              {!loading && !error && holidays.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {holidays.map((holiday, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {holiday.translatedName}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {format(new Date(holiday.date), isChinese ? 'M月d日 (EEEE)' : 'MMM d (EEEE)', { locale: dateLocale })}
                      </div>
                      {holiday.global && (
                        <Badge variant="success" size="sm" className="mt-1">
                          {isChinese ? '全国性' : 'National'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


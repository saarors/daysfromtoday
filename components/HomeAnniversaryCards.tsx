'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AnniversaryCalculator, AnniversaryCountdown, formatAnniversaryType } from '@/lib/anniversary';
import { calculateDateStatisticsSync } from '@/lib/date-statistics';

interface HomeAnniversaryCardsProps {
  locale: string;
}

export default function HomeAnniversaryCards({ locale }: HomeAnniversaryCardsProps) {
  const [upcomingAnniversaries, setUpcomingAnniversaries] = useState<AnniversaryCountdown[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 获取所有即将到来的纪念日（未过期的），按时间排序，最多显示3个
    const allCountdowns = AnniversaryCalculator.getAllCountdowns();
    const upcoming = allCountdowns.filter(countdown => !countdown.isPast).slice(0, 3);
    console.log('Loaded anniversaries:', upcoming); // Debug log
    setUpcomingAnniversaries(upcoming);
  }, []);

  const text = {
    en: {
      title: 'My Anniversaries',
      noAnniversaries: 'No anniversaries yet',
      addFirst: 'Add your first anniversary to start tracking important dates',
      manageAll: 'Manage Anniversaries',
      daysLeft: 'days left',
      today: 'Today!',
      recurring: 'Annual'
    },
    zh: {
      title: '我的纪念日',
      noAnniversaries: '还没有纪念日',
      addFirst: '添加您的第一个纪念日，开始跟踪重要日期',
      manageAll: '管理纪念日',
      daysLeft: '天后',
      today: '今天！',
      recurring: '每年重复'
    }
  };

  const t = text[locale as keyof typeof text] || text.en;

  // 防止 hydration mismatch
  if (!mounted) {
    return (
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {t.title}
          </h2>
          <div className="animate-pulse bg-gray-200 h-48 rounded-xl"></div>
        </div>
      </section>
    );
  }

  // 如果没有纪念日，显示引导卡片
  if (upcomingAnniversaries.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {t.title}
          </h2>
          
          <Link href={`/${locale}/anniversaries`} className="block">
            <Card className="card-glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
              <div className="md:flex">
                {/* 引导图片 */}
                <div className="md:w-2/5 bg-gradient-to-br from-purple-500 to-pink-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <div className="text-2xl font-bold">Personal</div>
                    <div className="text-sm opacity-90 mt-2">Countdowns</div>
                  </div>
                </div>
                
                {/* 引导内容 */}
                <div className="md:w-3/5 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary">New Feature</Badge>
                    <span className="text-sm text-gray-500">Personal Management</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 hover:text-purple-600 transition-colors">
                    {t.noAnniversaries}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {t.addFirst}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>🎂 Birthdays</span>
                      <span>💕 Anniversaries</span>
                      <span>🎉 Holidays</span>
                    </div>
                    <span className="text-purple-600 font-medium hover:text-purple-700">
                      {t.manageAll} →
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    );
  }

  // 显示即将到来的纪念日
  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t.title}
          </h2>
          <Link 
            href={`/${locale}/anniversaries`}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            {t.manageAll} →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingAnniversaries.map((countdown) => {
            const isToday = countdown.isToday;
            const daysLeft = countdown.daysUntil;
            
            // 纪念日图标映射
            const typeIcons = {
              birthday: '🎂',
              anniversary: '💕',
              holiday: '🎉',
              custom: '📌'
            };
            
            // 计算日期统计信息（仅当未到期时）
            let stats = null;
            if (!isToday && !countdown.isPast) {
              const today = new Date();
              const targetDate = new Date(countdown.nextOccurrence);
              stats = calculateDateStatisticsSync(today, targetDate);
            }
            
            return (
              <Link key={countdown.anniversary.id} href={`/${locale}/anniversaries`}>
                <Card className="card-glass hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="p-6">
                    {/* 图标和标题 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{typeIcons[countdown.anniversary.type as keyof typeof typeIcons]}</span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                            {countdown.anniversary.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(countdown.nextOccurrence).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 倒计时 */}
                    <div className="mb-4">
                      {isToday ? (
                        <div className="text-3xl font-bold text-gradient-calendly">
                          {t.today}
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-gradient-calendly">
                            {daysLeft}
                          </span>
                          <span className="text-lg text-gray-600">
                            {t.daysLeft}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 日期统计信息 */}
                    {stats && (
                      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-xs text-gray-600">💼 {locale === 'zh' ? '工作日' : 'Work'}</div>
                          <div className="text-sm font-bold text-blue-600">{stats.businessDays}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-xs text-gray-600">🏖️ {locale === 'zh' ? '周末' : 'Weekend'}</div>
                          <div className="text-sm font-bold text-purple-600">{stats.weekends}</div>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-2">
                          <div className="text-xs text-gray-600">📅 {locale === 'zh' ? '自然日' : 'Days'}</div>
                          <div className="text-sm font-bold text-pink-600">{stats.totalDays}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* 标签 */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {countdown.anniversary.isRecurring && (
                        <Badge variant="default" size="sm">
                          🔁 {t.recurring}
                        </Badge>
                      )}
                      <Badge 
                        variant={isToday ? 'primary' : 'secondary'} 
                        size="sm"
                      >
                        {formatAnniversaryType(countdown.anniversary.type, locale)}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
          
          {/* 添加纪念日的引导卡片 */}
          <Link href={`/${locale}/anniversaries`}>
            <Card className="card-glass hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-white">+</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {locale === 'zh' ? '添加纪念日' : 'Add Anniversary'}
                </h3>
                <p className="text-sm text-gray-600">
                  {locale === 'zh' ? '点击开始添加您的重要日期' : 'Click to add your important dates'}
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}


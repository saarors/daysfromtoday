/**
 * DaysFromToday 首页 Client Component
 * 
 * 功能：
 * - 2个主卡片：未来日期 + 过去日期
 * - 每个卡片内区分自然日和工作日
 * - 自定义输入功能
 * - 博客卡片展示
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface HomePageClientProps {
  locale: string;
}

export default function HomePageClient({ locale }: HomePageClientProps) {
  // 自定义输入状态
  const [futureDays, setFutureDays] = useState('');
  const [pastDays, setPastDays] = useState('');
  const router = useRouter();
  
  // 多语言内容
  const text = {
    en: {
      slogan: 'Days From Today',
      subtitle: 'Calculate dates in the future or past with precision',
      description: 'Simple, fast, and powerful date calculation tool. Supports natural days, business days, weekends, and holidays.',
      
      future: {
        title: 'Future Dates',
        subtitle: 'Calculate dates from today onwards',
        calendar: 'Calendar Days',
        business: 'Business Days',
        calendarDesc: 'Includes all days',
        businessDesc: 'Excludes weekends and holidays'
      },
      
      past: {
        title: 'Past Dates',
        subtitle: 'Calculate dates before today',
        calendar: 'Calendar Days',
        business: 'Business Days',
        calendarDesc: 'Includes all days',
        businessDesc: 'Excludes weekends and holidays'
      },
      
      custom: {
        placeholder: 'Enter days...',
        button: 'Calculate'
      },
      
      blog: {
        title: 'Latest from Blog',
        firstPost: {
          title: 'How to Calculate Days From Today: A Complete Guide',
          date: 'October 7, 2025',
          excerpt: 'Learn everything about calculating future and past dates, including natural days, business days, holidays, and timezone considerations.',
          readMore: 'Read More',
          readTime: '8 min read'
        }
      }
    },
    zh: {
      slogan: 'Days From Today',
      subtitle: '精确计算未来或过去的日期',
      description: '简单、快速、强大的日期计算工具。支持自然日、工作日、周末和节假日。',
      
      future: {
        title: '未来日期',
        subtitle: '计算从今天起的未来日期',
        calendar: '自然日',
        business: '工作日',
        calendarDesc: '包含所有日期',
        businessDesc: '排除周末和节假日'
      },
      
      past: {
        title: '过去日期',
        subtitle: '计算今天之前的日期',
        calendar: '自然日',
        business: '工作日',
        calendarDesc: '包含所有日期',
        businessDesc: '排除周末和节假日'
      },
      
      custom: {
        placeholder: '输入天数...',
        button: '计算'
      },
      
      blog: {
        title: '最新博客',
        firstPost: {
          title: '如何计算从今天起的日期：完整指南',
          date: '2025年10月7日',
          excerpt: '了解关于计算未来和过去日期的所有知识，包括自然日、工作日、节假日和时区注意事项。',
          readMore: '阅读更多',
          readTime: '8 分钟阅读'
        }
      }
    }
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  
  // 快捷天数配置
  const calendarDays = [7, 14, 30, 90, 100, 120, 180, 365];
  const businessDays = [5, 10, 14, 28, 30, 50, 100];
  
  // 处理自定义输入
  const handleCustomCalculate = (days: string, type: 'future' | 'past', mode: 'calendar' | 'business') => {
    const num = parseInt(days);
    if (isNaN(num) || num <= 0) return;
    
    const basePath = mode === 'calendar' ? 'days' : 'business-days';
    const agoPart = type === 'past' ? '/ago' : '';
    router.push(`/${locale}/${basePath}${agoPart}/${num}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.slogan}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            {t.subtitle}
          </p>
          <p className="text-gray-500 mb-8">
            {t.description}
          </p>
        </div>

        {/* 主计算入口 - 2个主卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-12">
          
          {/* 未来日期卡片 */}
          <Card variant="elevated" className="hover:shadow-2xl transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary" className="text-lg px-4 py-1">🔮 {t.future.title}</Badge>
              </div>
              <CardTitle className="text-2xl text-blue-600 mb-2">
                {t.future.subtitle}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* 自然日 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-lg">{t.future.calendar}</span>
                  <Badge variant="default" size="sm">{t.future.calendarDesc}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {calendarDays.map(days => (
                    <Link
                      key={days}
                      href={`/${locale}/days/${days}`}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      {days} {locale === 'zh' ? '天' : 'days'}
                    </Link>
                  ))}
                </div>
                {/* 自定义输入 */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder={t.custom.placeholder}
                    value={futureDays}
                    onChange={(e) => setFutureDays(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCustomCalculate(futureDays, 'future', 'calendar');
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={() => handleCustomCalculate(futureDays, 'future', 'calendar')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {t.custom.button}
                  </button>
                </div>
              </div>
              
              {/* 工作日 */}
              <div className="border-l-4 border-cyan-500 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-lg">{t.future.business}</span>
                  <Badge variant="success" size="sm">{t.future.businessDesc}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {businessDays.map(days => (
                    <Link
                      key={days}
                      href={`/${locale}/business-days/${days}`}
                      className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg text-sm hover:bg-cyan-200 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      {days} {locale === 'zh' ? '天' : 'days'}
                    </Link>
                  ))}
                </div>
                {/* 自定义输入 */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder={t.custom.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const days = (e.target as HTMLInputElement).value;
                        handleCustomCalculate(days, 'future', 'business');
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleCustomCalculate(input.value, 'future', 'business');
                    }}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
                  >
                    {t.custom.button}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 过去日期卡片 */}
          <Card variant="elevated" className="hover:shadow-2xl transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-lg px-4 py-1">⏮️ {t.past.title}</Badge>
              </div>
              <CardTitle className="text-2xl text-purple-600 mb-2">
                {t.past.subtitle}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* 自然日 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-lg">{t.past.calendar}</span>
                  <Badge variant="default" size="sm">{t.past.calendarDesc}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {calendarDays.map(days => (
                    <Link
                      key={days}
                      href={`/${locale}/days/ago/${days}`}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      {days} {locale === 'zh' ? '天' : 'days'}
                    </Link>
                  ))}
                </div>
                {/* 自定义输入 */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder={t.custom.placeholder}
                    value={pastDays}
                    onChange={(e) => setPastDays(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCustomCalculate(pastDays, 'past', 'calendar');
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button
                    onClick={() => handleCustomCalculate(pastDays, 'past', 'calendar')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    {t.custom.button}
                  </button>
                </div>
              </div>
              
              {/* 工作日 */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-lg">{t.past.business}</span>
                  <Badge variant="success" size="sm">{t.past.businessDesc}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {businessDays.map(days => (
                    <Link
                      key={days}
                      href={`/${locale}/business-days/ago/${days}`}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      {days} {locale === 'zh' ? '天' : 'days'}
                    </Link>
                  ))}
                </div>
                {/* 自定义输入 */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder={t.custom.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const days = (e.target as HTMLInputElement).value;
                        handleCustomCalculate(days, 'past', 'business');
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleCustomCalculate(input.value, 'past', 'business');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    {t.custom.button}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {t.blog.title}
          </h2>
          
          <Link href={`/${locale}/faq`} className="block">
            <Card className="hover:shadow-xl transition-all cursor-pointer overflow-hidden">
              <div className="md:flex">
                {/* 博客配图 */}
                <div className="md:w-2/5 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <div className="text-2xl font-bold">DaysFromToday</div>
                    <div className="text-sm opacity-90 mt-2">Complete Guide</div>
                  </div>
                </div>
                
                {/* 博客内容 */}
                <div className="md:w-3/5 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary">Featured</Badge>
                    <span className="text-sm text-gray-500">{t.blog.firstPost.date}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                    {t.blog.firstPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {t.blog.firstPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📖 {t.blog.firstPost.readTime}</span>
                    </div>
                    <span className="text-blue-600 font-medium hover:text-blue-700">
                      {t.blog.firstPost.readMore} →
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Language Switcher */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-4">
          <Link
            href="/en"
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              locale === 'en'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            English
          </Link>
          <Link
            href="/zh"
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              locale === 'zh'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            中文
          </Link>
        </div>
      </section>
      
      {/* Organization 结构化数据（JSON-LD）*/}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'DaysFromToday',
            'alternateName': 'Days From Today',
            'url': 'https://www.daysfromtoday.ai',
            'description': 'Calculate dates from today with ease. Support for business days, weekends, and holidays.',
            'applicationCategory': 'UtilityApplication',
            'operatingSystem': 'All',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'featureList': [
              'Calculate future and past dates',
              'Business days calculation',
              'Holiday awareness',
              'Multi-language support',
              'ICS calendar export'
            ]
          })
        }}
      />
    </div>
  );
}


/**
 * DaysFromToday 首页 Client Component
 * 
 * 功能：
 * - Phase 2.6: 卡片墙展示
 * - 2个主卡片：未来日期 + 过去日期
 * - 每个卡片内区分自然日和工作日
 * - 自定义输入功能
 * - 博客卡片展示
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import TopNav from '@/components/TopNav';
import HomeAnniversaryCards from '@/components/HomeAnniversaryCards';
import { CardGallery } from '@/components/v3/CardGallery';
import { EmptyState } from '@/components/v3/EmptyState';
import { CreateCardFAB } from '@/components/v3/CreateCardFAB';
import { HeroSection } from '@/components/v3/Hero/HeroSection';
import { useGoalCards } from '@/store/goal-cards';

interface HomePageClientProps {
  locale: string;
}

export default function HomePageClient({ locale }: HomePageClientProps) {
  // 自定义输入状态
  const [futureDays, setFutureDays] = useState('');
  const [pastDays, setPastDays] = useState('');
  const router = useRouter();
  
  // Phase 2.6: 卡片墙状态
  const [mounted, setMounted] = useState(false);
  const { getAllCardsSortedByDate } = useGoalCards();
  const [cards, setCards] = useState<ReturnType<typeof getAllCardsSortedByDate>>([]);
  
  useEffect(() => {
    setMounted(true);
    setCards(getAllCardsSortedByDate());
  }, [getAllCardsSortedByDate]);
  
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
        title: 'Featured Story',
        firstPost: {
          title: 'Why I Created DaysFromToday',
          date: 'October 10, 2025',
          excerpt: 'In September this year, my 13-year-old son began his first full boarding school life. This changed how he views time. Time — for each of us, it\'s almost the only fair, scarce, and completely controllable resource worth mastering.',
          readMore: 'Read Story',
          readTime: '6 min read'
        }
      },

      anniversaries: {
        title: 'My Anniversaries',
        subtitle: 'Manage your personal countdowns',
        description: 'Track birthdays, anniversaries, holidays and more with recurring reminders.',
        button: 'Manage Anniversaries',
        icon: '📅'
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
        title: '精选故事',
        firstPost: {
          title: '我为什么创建了 DaysFromToday',
          date: '2025年10月10日',
          excerpt: '今年9月，我13岁的儿子开始了他人生中的第一次全寄宿生活。这改变了他看待时间的方式。时间 —— 对于我们每个人来说，几乎是唯一公平、稀缺且值得完全掌控的资源。',
          readMore: '阅读故事',
          readTime: '6 分钟阅读'
        }
      },

      anniversaries: {
        title: '我的纪念日',
        subtitle: '管理您的个人倒计时',
        description: '跟踪生日、纪念日、节日等，支持每年重复提醒。',
        button: '管理纪念日',
        icon: '📅'
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 顶部导航栏 */}
      <TopNav locale={locale} />
      
      {/* V3.0 Hero Section - 主入口 */}
      <HeroSection locale={locale} />
      
      {/* Phase 2.6: 卡片墙 - V3 隐藏，移至愿望清单页面 */}
      {false && mounted && cards.length > 0 && (
        <section className="container mx-auto px-4 py-16 relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {locale === 'zh' ? '我的愿望清单' : 'My Wishlist'}
          </h2>
          <CardGallery cards={cards} locale={locale} />
        </section>
      )}
      
      {/* Phase 2.6: 创建卡片 FAB - V3 隐藏 */}
      {false && mounted && cards.length > 0 && <CreateCardFAB locale={locale} />}

      {/* V2.6 功能区域 - 暂时隐藏，保留代码以备后用 */}
      {false && (
      <section className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
            {locale === 'zh' ? '快速日期计算' : 'Quick Date Calculator'}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            {locale === 'zh' ? '(保留的旧功能，供 SEO 和高级用户使用)' : '(Legacy feature for SEO and power users)'}
          </p>
        </div>

        {/* 主计算入口 - 2个主卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-12">
          
          {/* 未来日期卡片 */}
          <Card variant="elevated" className="card-glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
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
                    className="btn-primary text-sm font-medium"
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
                    className="btn-primary text-sm font-medium"
                  >
                    {t.custom.button}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 过去日期卡片 */}
          <Card variant="elevated" className="card-glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
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
                    className="btn-primary text-sm font-medium"
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
                    className="btn-primary text-sm font-medium"
                  >
                    {t.custom.button}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      )}

      {/* Anniversaries Section - V3 隐藏 */}
      {false && <HomeAnniversaryCards locale={locale} />}

      {/* Blog Section - 改名为 Stories */}
      <section className="container mx-auto px-4 py-16 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {locale === 'zh' ? '故事' : 'Stories'}
          </h2>
          
          <Link href={`/${locale}/blog/why-i-created-daysfromtoday`} className="block">
            <Card className="card-glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
              {/* Featured 标识 */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-4 py-1.5 text-sm shadow-lg">
                  ⭐ Featured Story
                </Badge>
              </div>
              
              <div className="md:flex">
                {/* 博客配图 - 优化视觉效果 */}
                <div className="md:w-2/5 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-10 flex items-center justify-center relative overflow-hidden">
                  {/* 装饰性背景 */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="text-white text-center relative z-10">
                    <div className="text-7xl mb-4 animate-pulse">🕰️</div>
                    <div className="text-2xl font-bold mb-2">Why I Built</div>
                    <div className="text-3xl font-extrabold mb-3">DaysFromToday</div>
                    <div className="text-sm opacity-90 font-medium">Leon&apos;s Story</div>
                  </div>
                </div>
                
                {/* 博客内容 - 增加信息量 */}
                <div className="md:w-3/5 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      Founder Story
                    </Badge>
                    <span className="text-sm text-gray-500">{t.blog.firstPost.date}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 hover:text-blue-600 transition-colors leading-tight">
                    {t.blog.firstPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {t.blog.firstPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📖 {t.blog.firstPost.readTime}</span>
                      <span>✍️ Leon</span>
                    </div>
                    <span className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2">
                      {t.blog.firstPost.readMore} 
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
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


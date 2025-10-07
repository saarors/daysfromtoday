import { addBusinessDays } from '@/lib/bizdays';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PageProps {
  params: Promise<{
    locale: string;
    n: string;
  }>;
}

// 预生成热门页面
export async function generateStaticParams() {
  const popularDays = [
    1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90
  ];
  
  return popularDays.map(n => ({ n: n.toString() }));
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, n } = await params;
  const days = Number(n);
  
  const title = `${days} Business Days from Today - Date Calculator`;
  const description = `Calculate ${days} business days from today, excluding weekends and holidays. Get the exact date for project planning and deadline management.`;
  
  return {
    title,
    description,
    keywords: ['business days calculator', 'working days', 'weekday calculator', 'project deadline'],
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/business-days/${n}`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/business-days/${n}`,
        'zh': `https://www.daysfromtoday.ai/zh/business-days/${n}`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/business-days/${n}`,
      type: 'website',
      siteName: 'DaysFromToday',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function BusinessDaysPage({ params }: PageProps) {
  const { locale, n } = await params;
  const days = Number(n);
  
  // 计算工作日（默认 US）
  const today = new Date();
  const country = 'US'; // TODO: 从用户偏好获取
  const result = await addBusinessDays(today, days, country);
  
  const weekends = result.excludedDates.filter(d => d.reason === 'weekend');
  const holidays = result.excludedDates.filter(d => d.reason === 'holiday');
  
  // 多语言内容
  const text = {
    en: {
      title: (d: number) => `${d} Business ${d === 1 ? 'Day' : 'Days'} from Today`,
      subtitle: 'Excluding weekends and holidays',
      targetDate: 'Target Date',
      businessDays: 'Business Days',
      businessDay: 'business day',
      businessDaysPlural: 'business days',
      from: 'from',
      startDate: 'Start Date',
      calendarDays: 'Calendar Days',
      excluded: 'Excluded',
      weekends: 'Weekends',
      holidaysLabel: 'Holidays',
      excludesText: (w: number, h: number) => 
        `This calculation excludes ${w} weekend days${h > 0 ? ` and ${h} ${h === 1 ? 'holiday' : 'holidays'}` : ''}.`
    },
    zh: {
      title: (d: number) => `从今天起 ${d} 个工作日后`,
      subtitle: '排除周末和节假日',
      targetDate: '目标日期',
      businessDays: '工作日',
      businessDay: '个工作日',
      businessDaysPlural: '个工作日',
      from: '从',
      startDate: '起始日期',
      calendarDays: '自然日',
      excluded: '排除天数',
      weekends: '周末',
      holidaysLabel: '节假日',
      excludesText: (w: number, h: number) => 
        `此计算排除了 ${w} 个周末${h > 0 ? `和 ${h} 个节假日` : ''}。`
    }
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  const dateLocale = locale === 'zh' ? zhCN : enUS;
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {t.title(days)}
        </h1>
        <p className="text-xl text-gray-600">
          {t.subtitle}
        </p>
      </div>
      
      {/* Answer Card */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.targetDate}</CardTitle>
            <Badge variant="success">{t.businessDays}</Badge>
          </div>
          <CardDescription>
            {days} {days === 1 ? t.businessDay : t.businessDaysPlural} {t.from} {format(today, locale === 'zh' ? 'yyyy年M月d日' : 'MMMM d, yyyy', { locale: dateLocale })}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-cyan-600 mb-4">
              {format(result.targetDate, locale === 'zh' ? 'yyyy年M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
            </div>
            <div className="text-2xl text-gray-600">
              {format(result.targetDate, 'EEEE', { locale: dateLocale })}
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t.startDate}</div>
              <div className="font-semibold text-gray-900">
                {format(today, locale === 'zh' ? 'M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t.businessDays}</div>
              <div className="font-semibold text-gray-900">
                {days}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t.calendarDays}</div>
              <div className="font-semibold text-gray-900">
                {result.totalCalendarDays}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t.excluded}</div>
              <div className="font-semibold text-gray-900">
                {result.excludedDates.length}
              </div>
            </div>
          </div>
          
          {/* Excluded Dates Summary */}
          {result.excludedDates.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" size="sm">
                  {weekends.length} {t.weekends}
                </Badge>
                {holidays.length > 0 && (
                  <Badge variant="warning" size="sm">
                    {holidays.length} {t.holidaysLabel}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {t.excludesText(weekends.length, holidays.length)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': `What date is ${days} business days from today?`,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': `${days} business days from today is ${format(result.targetDate, 'EEEE, MMMM d, yyyy')} (excluding weekends and holidays).`
                }
              },
              {
                '@type': 'Question',
                'name': 'What are business days?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Business days are weekdays (Monday through Friday) excluding public holidays. They are commonly used for project deadlines, shipping estimates, and financial transactions.'
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}


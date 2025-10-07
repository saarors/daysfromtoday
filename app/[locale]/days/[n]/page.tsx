import { addDaysSafe } from '@/lib/date-utils';
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
    45, 60, 90, 100, 180, 365
  ];
  
  return popularDays.map(n => ({ n: n.toString() }));
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, n } = await params;
  const days = Number(n);
  
  // 使用固定的基准日期避免 hydration mismatch
  const baseDate = new Date('2024-01-01T00:00:00Z');
  const targetDate = addDaysSafe(baseDate, days);
  
  const title = `${days} Days from Today - Date Calculator`;
  const description = `Calculate ${days} days from today. Get accurate date calculations with our free online tool.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/days/${n}`,
        'zh': `https://www.daysfromtoday.ai/zh/days/${n}`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
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

export default async function DaysFromTodayPage({ params }: PageProps) {
  const { locale, n } = await params;
  const days = Number(n);
  
  // 计算目标日期
  const today = new Date();
  const targetDate = addDaysSafe(today, days);
  
  // 多语言内容
  const text = {
    en: {
      title: (days: number) => `${days} ${days === 1 ? 'Day' : 'Days'} from Today`,
      subtitle: 'Calculate dates in the future with precision',
      result: 'Result Date',
      calculation: 'Calculation Details',
      startDate: 'Start Date (Today)',
      daysToAdd: 'Days to Add',
      targetDate: 'Target Date',
      dayOfWeek: 'Day of the Week'
    },
    zh: {
      title: (days: number) => `从今天起 ${days} 天后`,
      subtitle: '精确计算未来日期',
      result: '结果日期',
      calculation: '计算详情',
      startDate: '起始日期（今天）',
      daysToAdd: '要加的天数',
      targetDate: '目标日期',
      dayOfWeek: '星期'
    }
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  const dateLocale = locale === 'zh' ? zhCN : enUS;
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
            <Badge variant="primary">{locale === 'zh' ? '未来' : 'Future'}</Badge>
          </div>
          <CardDescription>
            {days} {locale === 'zh' ? '天后' : (days === 1 ? 'day' : 'days')} {locale === 'zh' ? '从' : 'from'} {format(today, locale === 'zh' ? 'yyyy年M月d日' : 'MMMM d, yyyy', { locale: dateLocale })}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-blue-600 mb-4" suppressHydrationWarning>
              {format(targetDate, locale === 'zh' ? 'yyyy年M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
            </div>
            <div className="text-2xl text-gray-600" suppressHydrationWarning>
              {format(targetDate, locale === 'zh' ? 'EEEE' : 'EEEE', { locale: dateLocale })}
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t.startDate}</div>
              <div className="font-semibold text-gray-900">
                {format(today, locale === 'zh' ? 'M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t.daysToAdd}</div>
              <div className="font-semibold text-gray-900">
                {days} {locale === 'zh' ? '天' : (days === 1 ? 'day' : 'days')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">{t.result}</div>
              <div className="font-semibold text-gray-900">
                {format(targetDate, locale === 'zh' ? 'M月d日' : 'MMM d, yyyy', { locale: dateLocale })}
              </div>
            </div>
          </div>
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
                'name': `What date is ${days} days from today?`,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': `${days} days from today is ${format(targetDate, 'EEEE, MMMM d, yyyy')}.`
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}

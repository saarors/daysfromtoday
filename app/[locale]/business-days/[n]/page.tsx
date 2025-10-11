import type { Metadata } from 'next';
import TopNav from '@/components/TopNav';
import DateCalculator from '@/components/DateCalculator';

interface PageProps {
  params: {
    locale: string;
    n: string;
  };
}

// 预生成热门页面
export async function generateStaticParams() {
  const popularDays = [
    1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90, 100, 180, 365
  ];
  
  return popularDays.map(n => ({ 
    locale: 'en',
    n: n.toString() 
  })).concat(
    popularDays.map(n => ({ 
      locale: 'zh',
      n: n.toString() 
    }))
  );
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, n } = params;
  const days = Number(n);
  
  const title = locale === 'zh'
    ? `${days} 个工作日后是哪天 | 工作日计算器`
    : `${days} Business Days from Today | Workday Calculator`;
  const description = locale === 'zh'
    ? `计算从今天起 ${days} 个工作日后是哪一天，自动排除周末和节假日。适用于项目计划、截止日期管理和交付日期计算。`
    : `Calculate what date it will be ${days} business days from today, excluding weekends and holidays. Perfect for project planning, deadline management, and delivery date calculations.`;
  
  return {
    title,
    description,
    keywords: locale === 'zh'
      ? ['工作日计算器', '工作日', '项目截止日期', '交付日期']
      : ['business days calculator', 'workday calculator', 'working days', 'project deadline'],
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
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BusinessDaysFromTodayPage({ params }: PageProps) {
  const { locale, n } = params;
  const days = Number(n);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Top Navigation */}
      <TopNav locale={locale} />
      
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-32 max-w-4xl">
        <DateCalculator 
          days={days} 
          locale={locale} 
          type="future" 
          mode="business" 
        />
        
        {/* Navigation */}
        <div className="text-center space-x-4 mt-8">
          <a 
            href={`/${locale}`}
            className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            {locale === 'zh' ? '返回首页' : 'Back to Homepage'}
          </a>
          <a 
            href={`/${locale}`}
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {locale === 'zh' ? '计算其他日期' : 'Calculate Another Date'}
          </a>
        </div>
      </div>
    </div>
  );
}
import type { Metadata } from 'next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DateCalculator from '@/components/DateCalculator';

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
  const { locale, n } = await params;
  const days = Number(n);
  
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

export default async function DaysFromTodayPage({ params }: PageProps) {
  const { locale, n } = await params;
  const days = Number(n);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Language Switcher */}
      <LanguageSwitcher currentLocale={locale} />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <DateCalculator 
          days={days} 
          locale={locale} 
          type="future" 
          mode="calendar" 
        />
        
        {/* Navigation */}
        <div className="text-center space-x-4 mt-8">
          <a 
            href={`/${locale}`}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
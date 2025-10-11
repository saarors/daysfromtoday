import type { Metadata } from 'next';
import TopNav from '@/components/TopNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import HolidaysList from '@/components/HolidaysList';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  const title = locale === 'zh' 
    ? '距离节假日还有几天 | 全球节假日倒计时日历' 
    : 'Days Until Holiday Calculator | Holiday Countdown Calendar';
  
  const description = locale === 'zh'
    ? '查看全球各国的节假日列表和倒计时。包括美国、中国、英国、日本、德国等15个国家的公共假期，自动计算距离下一个节假日还有几天。'
    : 'View public holidays and countdowns for countries worldwide. Includes US, China, UK, Japan, Germany and 15 other countries. Automatically calculate days until the next holiday.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/holidays`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/holidays`,
        'zh': `https://www.daysfromtoday.ai/zh/holidays`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/holidays`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default async function HolidaysPage({ params }: PageProps) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TopNav locale={locale} />
      
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-32 max-w-7xl">
        <Breadcrumb locale={locale} />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-calendly">
            {locale === 'zh' ? '全球节假日列表' : 'Global Holidays'}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === 'zh' 
              ? '查看各国公共节假日，帮助您更好地规划日期计算'
              : 'View public holidays by country to better plan your date calculations'
            }
          </p>
        </div>

        <HolidaysList locale={locale} />
      </div>
    </div>
  );
}


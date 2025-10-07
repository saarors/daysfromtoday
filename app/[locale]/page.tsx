/**
 * DaysFromToday 首页 (Server Component)
 */
import type { Metadata } from 'next';
import HomePageClient from './home-client';

interface PageParams {
  locale: string;
}

// SEO Metadata
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'zh' 
    ? 'Days From Today - 精确的日期计算工具'
    : 'Days From Today - Accurate Date Calculator';
    
  const description = locale === 'zh'
    ? '简单、快速、强大的日期计算工具。支持自然日、工作日、周末和节假日计算。'
    : 'Simple, fast, and powerful date calculation tool. Support for natural days, business days, weekends, and holidays.';
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}`,
      languages: {
        'en': 'https://www.daysfromtoday.ai/en',
        'zh': 'https://www.daysfromtoday.ai/zh',
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}`,
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

export default async function HomePage({ params }: { params: Promise<PageParams> }) {
  const { locale } = await params;
  
  return <HomePageClient locale={locale} />;
}

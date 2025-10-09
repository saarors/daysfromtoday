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
    ? 'Days From Today 计算器 | 日期计算器和倒计时工具'
    : 'Days From Today Calculator | Date Calculator & Countdown Timer';
    
  const description = locale === 'zh'
    ? '免费在线日期计算器和倒计时工具。计算未来或过去的日期，支持自然日、工作日、节假日计算和纪念日倒计时。'
    : 'Free online date calculator and countdown timer. Calculate future or past dates with support for calendar days, business days, holidays, and anniversary countdowns.';
  
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

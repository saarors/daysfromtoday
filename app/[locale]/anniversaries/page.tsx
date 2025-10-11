import type { Metadata } from 'next';
import AnniversaryManager from '@/components/AnniversaryManager';
import TopNav from '@/components/TopNav';

interface PageProps {
  params: {
    locale: string;
  };
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  const title = locale === 'zh' 
    ? '纪念日倒计时 | 生日、节日、婚礼倒计时管理器' 
    : 'Anniversary Countdown | Birthday, Wedding & Holiday Countdown Timer';
  
  const description = locale === 'zh'
    ? '免费的纪念日倒计时工具。管理生日、婚礼纪念日、退休倒计时、考试倒计时和重要节日。支持自动提醒和每年重复倒计时。'
    : 'Free anniversary countdown tool. Manage birthdays, wedding anniversaries, retirement countdowns, exam countdowns and important holidays. Supports automatic reminders and recurring annual countdowns.';
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/anniversaries`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/anniversaries`,
        'zh': `https://www.daysfromtoday.ai/zh/anniversaries`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/anniversaries`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function AnniversariesPage({ params }: PageProps) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航栏 */}
      <TopNav locale={locale} />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <AnniversaryManager locale={locale} />
      </div>
    </div>
  );
}

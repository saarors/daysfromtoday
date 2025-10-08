import type { Metadata } from 'next';
import AnniversaryManager from '@/components/AnniversaryManager';
import TopNav from '@/components/TopNav';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'zh' 
    ? '我的纪念日 - 倒计时管理工具' 
    : 'My Anniversaries - Countdown Management Tool';
  
  const description = locale === 'zh'
    ? '管理您的个人纪念日，设置倒计时提醒，包括生日、纪念日、节日等。支持每年重复提醒。'
    : 'Manage your personal anniversaries with countdown reminders. Track birthdays, anniversaries, holidays and more with recurring annual notifications.';
  
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
  const { locale } = await params;

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

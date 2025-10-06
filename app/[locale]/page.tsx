/**
 * 多语言首页组件
 * 
 * 设计风格：Calendly-inspired
 * - 大标题 + 清晰副标题
 * - 鲜艳蓝色 CTA 按钮
 * - 渐变装饰元素
 * - 卡片化功能展示
 * - 充足留白
 * 
 * 功能：
 * 1. Hero Section（英雄区）
 * 2. 快速计算入口
 * 3. 功能特性展示
 * 4. 语言切换
 * 
 * SEO 优化：
 * - 完整的 metadata（title, description, OG, Twitter Card）
 * - 语义化 HTML5 标签
 * - 结构化数据（WebSite Schema）
 * - Canonical URLs
 * - Hreflang 标签
 * 
 * 符合项目规范：
 * - Next.js 15 + TypeScript
 * - next-intl 多语言
 * - Calendly 设计系统
 * - 响应式设计
 */
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type PageParams = {
  locale: string;
};

/**
 * 生成首页 metadata（SEO 优化）
 */
export async function generateMetadata({
  params
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  
  const title = locale === 'zh' 
    ? 'DaysFromToday - 日期计算器 | 轻松计算任意日期'
    : 'DaysFromToday - Date Calculator | Calculate Any Date Easily';
  
  const description = locale === 'zh'
    ? '简单、快速、强大的日期计算工具。计算未来或过去的日期，支持工作日、自然日、节假日。一键添加到日历，多语言支持。'
    : 'Simple, fast, and powerful date calculator. Calculate future or past dates with support for business days, weekends, and holidays. One-click calendar integration and multi-language support.';

  return {
    title,
    description,
    keywords: locale === 'zh'
      ? ['日期计算器', '天数计算', '日期倒计时', '工作日计算', '日历工具', 'DaysFromToday']
      : ['date calculator', 'days calculator', 'date counter', 'business days', 'calendar tool', 'DaysFromToday'],
    authors: [{ name: 'Leon', url: `${baseUrl}/${locale}/faq` }],
    creator: 'DaysFromToday',
    publisher: 'DaysFromToday',
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}`,
      siteName: 'DaysFromToday',
      locale: locale,
      images: [{
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'DaysFromToday - Date Calculator'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`]
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'zh': `${baseUrl}/zh`,
        'x-default': `${baseUrl}/en`
      }
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
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    }
  };
}

export default async function HomePage({ 
  params
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            DaysFromToday
          </Link>
          
          {/* 导航链接 */}
          <div className="flex items-center gap-8">
            <Link 
              href={`/${locale}/faq`} 
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('faq')}
            </Link>
            
            {/* 语言切换 */}
            <div className="flex gap-2">
              <Link 
                href="/en" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  locale === 'en' 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                EN
              </Link>
              <Link 
                href="/zh" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  locale === 'zh' 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                中文
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* 渐变装饰背景 */}
        <div className="decoration-blob decoration-blob-purple" 
             style={{ width: '400px', height: '400px', top: '-100px', right: '-100px' }} 
        />
        <div className="decoration-blob decoration-blob-blue" 
             style={{ width: '300px', height: '300px', bottom: '-50px', left: '-50px' }} 
        />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧文字 */}
            <div className="relative z-10">
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('heroTitle')}
              </h1>
              
              <p 
                className="text-xl sm:text-2xl mb-8 leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('heroSubtitle')}
              </p>
              
              {/* CTA 按钮组 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/${locale}/days/7`}
                  className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg"
                >
                  {t('getStarted')}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link 
                  href={`/${locale}/faq`}
                  className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-lg"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>
            
            {/* 右侧演示卡片 */}
            <div className="relative z-10">
              <div className="card-glass p-8 max-w-md mx-auto">
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {t('tryIt')}
                </h3>
                
                {/* 快速计算示例 */}
                <div className="space-y-3">
                  {[7, 14, 30, 90].map((days) => (
                    <Link
                      key={days}
                      href={`/${locale}/days/${days}`}
                      className="block p-4 rounded-lg border-2 border-transparent hover:border-[var(--color-primary)] transition-all bg-[var(--color-bg-secondary)] hover:bg-white hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          className="font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {days} {locale === 'en' ? 'days from today' : '天后'}
                        </span>
                        <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特性区 */}
      <section className="py-20 px-6 bg-[var(--color-bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {locale === 'en' ? 'Why DaysFromToday?' : '为什么选择 DaysFromToday？'}
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {locale === 'en' 
                ? 'Simple, fast, and powerful date calculation tool' 
                : '简单、快速、强大的日期计算工具'
              }
            </p>
          </div>
          
          {/* 特性卡片网格 */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* 特性 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid))' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {locale === 'en' ? 'Lightning Fast' : '闪电般快速'}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {locale === 'en' 
                  ? 'Calculate any date instantly, no waiting required' 
                  : '瞬间计算任意日期，无需等待'
                }
              </p>
            </div>
            
            {/* 特性 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, var(--color-gradient-mid), var(--color-gradient-end))' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {locale === 'en' ? 'Multi-Language' : '多语言支持'}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {locale === 'en' 
                  ? 'Support for English and Chinese, more coming soon' 
                  : '支持中英文，更多语言即将推出'
                }
              </p>
            </div>
            
            {/* 特性 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--color-primary)' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {locale === 'en' ? 'Business Days' : '工作日计算'}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {locale === 'en' 
                  ? 'Calculate business days excluding weekends and holidays' 
                  : '计算工作日，自动排除周末和节假日'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            © 2025 DaysFromToday. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/faq`}
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('faq')}
            </Link>
            <a
              href="https://github.com/leeleon/daysfromtoday"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* WebSite 结构化数据（JSON-LD）*/}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'DaysFromToday',
            'alternateName': locale === 'zh' ? '日期计算器' : 'Date Calculator',
            'url': `${baseUrl}/${locale}`,
            'description': locale === 'zh'
              ? '简单、快速、强大的日期计算工具'
              : 'Simple, fast, and powerful date calculator',
            'inLanguage': locale,
            'potentialAction': {
              '@type': 'SearchAction',
              'target': {
                '@type': 'EntryPoint',
                'urlTemplate': `${baseUrl}/${locale}/days/{days}`
              },
              'query-input': 'required name=days'
            }
          })
        }}
      />
    </div>
  );
}


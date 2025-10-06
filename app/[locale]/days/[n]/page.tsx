/**
 * 日期计算页面
 * 
 * 路由：/[locale]/days/[n]
 * 示例：/en/days/14, /zh/days/30
 * 
 * 功能：
 * 1. 计算并显示 N 天后的日期
 * 2. 显示星期、相对时间等信息
 * 3. 提供 ICS 下载功能
 * 4. SEO 优化（动态 metadata）
 * 5. 相关日期推荐
 * 
 * 符合项目规范：
 * - Next.js 15 async params API
 * - TypeScript 严格模式
 * - 完整的 SEO metadata
 * - 多语言支持
 * - 响应式设计
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  calculateDaysFromToday, 
  validateDays, 
  getRelatedDays,
  type SupportedLocale 
} from '@/lib/date-calculator';

// 页面参数类型
type PageParams = {
  locale: string;
  n: string;
};

/**
 * 生成动态 metadata（SEO 优化）
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<PageParams> 
}): Promise<Metadata> {
  const { locale, n } = await params;
  const days = validateDays(n);
  
  if (days === null) {
    return {
      title: 'Invalid Date',
      description: 'The requested date calculation is invalid.'
    };
  }
  
  const result = calculateDaysFromToday(days, locale as SupportedLocale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daysfromtoday.ai';
  
  return {
    title: result.title,
    description: result.description,
    openGraph: {
      title: result.title,
      description: result.description,
      type: 'website',
      locale: locale,
      siteName: 'DaysFromToday',
      url: `${baseUrl}/${locale}/days/${days}`
    },
    twitter: {
      card: 'summary_large_image',
      title: result.title,
      description: result.description
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/days/${days}`,
      languages: {
        'en': `${baseUrl}/en/days/${days}`,
        'zh': `${baseUrl}/zh/days/${days}`,
        'x-default': `${baseUrl}/en/days/${days}`
      }
    }
  };
}

/**
 * 日期计算页面组件
 */
export default async function DaysCalculatorPage({ 
  params 
}: { 
  params: Promise<PageParams> 
}) {
  const { locale, n } = await params;
  const t = await getTranslations();
  
  // 验证天数参数
  const days = validateDays(n);
  
  if (days === null) {
    notFound();
  }
  
  // 计算日期
  const result = calculateDaysFromToday(days, locale as SupportedLocale);
  
  // 获取相关日期推荐
  const relatedDays = getRelatedDays(days);
  
  // ICS 下载 URL
  const downloadUrl = `/api/ics?days=${days}&locale=${locale}`;
  
  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            DaysFromToday
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              href={`/${locale}/faq`} 
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('faq')}
            </Link>
            
            <div className="flex gap-2">
              <Link 
                href={`/en/days/${days}`}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  locale === 'en' 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                EN
              </Link>
              <Link 
                href={`/zh/days/${days}`}
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

      {/* 主内容区 */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 返回链接 */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('calculateAnother')}
          </Link>

          {/* 大号数字显示区（Calendly 风格） */}
          <div className="text-center mb-16">
            <div className="number-display mb-4">
              {Math.abs(days)}
            </div>
            <div 
              className="text-3xl font-semibold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {locale === 'en' ? 'DAYS' : '天'}
            </div>
            <div 
              className="text-xl"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {result.relativeTime}
            </div>
          </div>

          {/* 主要结果卡片（三栏布局） */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 目标日期卡片 */}
            <div className="card-glass p-8 text-center">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--color-primary)' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div 
                className="text-sm mb-2 font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('targetDate')}
              </div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {result.formattedDate}
              </div>
            </div>

            {/* 星期几卡片 */}
            <div className="card-glass p-8 text-center">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, var(--color-gradient-mid), var(--color-gradient-end))' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div 
                className="text-sm mb-2 font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('dayOfWeek')}
              </div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {result.dayOfWeek}
              </div>
            </div>

            {/* 下载卡片 */}
            <div className="card-glass p-8 text-center">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid))' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div 
                className="text-sm mb-4 font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('addToCalendar')}
              </div>
              <a
                href={downloadUrl}
                download
                className="btn-primary inline-block w-full py-3"
              >
                {t('downloadCalendar')}
              </a>
            </div>
          </div>

          {/* 相关计算推荐 */}
          {relatedDays.length > 0 && (
            <div>
              <h2 
                className="text-2xl font-bold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('relatedCalculations')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {relatedDays.map((relatedDay) => (
                  <Link
                    key={relatedDay}
                    href={`/${locale}/days/${relatedDay}`}
                    className="p-4 bg-white rounded-lg border-2 transition-all hover:border-[var(--color-primary)] hover:shadow-md"
                    style={{ borderColor: 'var(--color-border-light)' }}
                  >
                    <div 
                      className="font-bold text-xl mb-1"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {relatedDay}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {locale === 'zh' ? '天' : 'days'}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-[var(--color-bg-secondary)]">
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
    </div>
  );
}

/**
 * 生成静态参数（用于预渲染常用页面）
 * 
 * 注意：这里只预渲染部分页面，其他页面使用 ISR
 */
export async function generateStaticParams() {
  const locales = ['en', 'zh'];
  const commonDays = [1, 7, 14, 30, 60, 90, 180, 365]; // 常用天数
  
  const params = [];
  
  for (const locale of locales) {
    for (const n of commonDays) {
      params.push({
        locale,
        n: n.toString()
      });
    }
  }
  
  return params;
}

/**
 * 动态路由配置
 */
export const dynamicParams = true; // 允许动态生成其他参数的页面
export const revalidate = 86400; // ISR: 24 小时重新验证


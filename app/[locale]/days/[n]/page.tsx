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
  
  return {
    title: result.title,
    description: result.description,
    openGraph: {
      title: result.title,
      description: result.description,
      type: 'website',
      locale: locale,
      siteName: 'DaysFromToday'
    },
    twitter: {
      card: 'summary_large_image',
      title: result.title,
      description: result.description
    },
    alternates: {
      canonical: `/${locale}/days/${days}`,
      languages: {
        'en': `/en/days/${days}`,
        'zh': `/zh/days/${days}`
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {result.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {result.description}
          </p>
        </header>

        {/* 主要结果卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 目标日期 */}
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('targetDate')}
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {result.formattedDate}
              </div>
            </div>

            {/* 星期几 */}
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('dayOfWeek')}
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {result.dayOfWeek}
              </div>
            </div>

            {/* 距离天数 */}
            <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('daysAway')}
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {result.relativeTime}
              </div>
            </div>
          </div>

          {/* 下载按钮 */}
          <div className="mt-8 text-center">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              {t('downloadCalendar')}
            </a>
          </div>
        </div>

        {/* 相关计算推荐 */}
        {relatedDays.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('relatedCalculations')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {relatedDays.map((relatedDay) => (
                <Link
                  key={relatedDay}
                  href={`/${locale}/days/${relatedDay}`}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
                >
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    {relatedDay}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {locale === 'zh' ? '天' : 'days'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 返回首页链接 */}
        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← {t('calculateAnother')}
          </Link>
        </div>
      </div>
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


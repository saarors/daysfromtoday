/**
 * 多语言首页组件
 * 
 * 功能：
 * 1. 显示欢迎文案（根据当前语言）
 * 2. 显示当前语言信息
 * 3. 提供语言切换按钮
 * 4. 展示项目简介
 * 
 * 符合项目规范：
 * - 使用 next-intl 的 useTranslations hook
 * - TypeScript 类型安全
 * - Tailwind CSS 样式
 * - 响应式设计
 */
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function HomePage({ 
  params
}: { 
  params: Promise<{ locale: string }> 
}) {
  // Next.js 15: params 需要先 await
  const { locale } = await params;
  
  // 服务器组件使用 getTranslations
  const t = await getTranslations();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-2xl">
        {/* 欢迎标题 */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center sm:text-left">
          {t('hello')}
        </h1>
        
        {/* 项目描述 */}
        <p className="text-lg sm:text-xl text-center sm:text-left text-gray-600 dark:text-gray-400">
          {t('description')}
        </p>

        {/* 当前语言信息 */}
        <div className="flex flex-col gap-4 w-full">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Current locale: <strong className="font-mono">{locale}</strong>
          </p>
          
          {/* 语言切换按钮 */}
          <div className="flex gap-4">
            <Link 
              href="/en" 
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                locale === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              English
            </Link>
            <Link 
              href="/zh" 
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                locale === 'zh' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              中文
            </Link>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg w-full">
          <h2 className="font-semibold mb-2">
            {locale === 'en' ? '🚀 What\'s Next?' : '🚀 下一步做什么？'}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {locale === 'en' 
              ? 'The multi-language routing is now working! Next steps: create date calculation pages.' 
              : '多语言路由已经配置完成！下一步：创建日期计算页面。'
            }
          </p>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/leeleon/daysfromtoday"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600 dark:text-gray-400">
          DaysFromToday © 2025
        </span>
      </footer>
    </div>
  );
}


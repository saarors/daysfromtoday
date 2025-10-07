/**
 * 多语言根布局组件
 * 
 * 功能：
 * 1. 设置 HTML lang 属性（SEO 重要）
 * 2. 注入 next-intl Provider 提供翻译功能
 * 3. 配置全局字体（Geist Sans 和 Geist Mono）
 * 4. 引入全局样式（Tailwind CSS）
 * 5. Organization Schema（品牌结构化数据）
 * 6. Google Analytics（性能监控）
 * 
 * SEO 优化：
 * - 语义化 HTML5 标签
 * - Organization Schema（JSON-LD）
 * - Viewport 优化
 * - 字体预加载
 * 
 * 符合项目规范：
 * - TypeScript 严格模式
 * - SEO 友好（正确的 lang 属性）
 * - 性能优化（字体优化、CSS 优化）
 * - 可访问性（WCAG 标准）
 */
import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import GATracker from '@/app/ga-tracker';
import GADebug from '@/app/ga-debug';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // 优化字体加载
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

/**
 * 全局 metadata（适用于所有页面的默认值）
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai'),
  title: {
    default: "DaysFromToday - Date Calculator",
    template: "%s | DaysFromToday"
  },
  description: "Calculate dates from today with ease. Support for business days, weekends, and holidays.",
  applicationName: "DaysFromToday",
  authors: [{ name: 'Leon' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Next.js 15: params 需要先 await
  const { locale } = await params;
  
  // 获取当前语言的翻译文件
  const messages = await getMessages();
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';

  // Google Analytics ID（使用官方 @next/third-parties 组件）
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-9D2SZK734G';
  
  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        {/* Google Search Console 验证 */}
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta 
            name="google-site-verification" 
            content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} 
          />
        )}
        
        {/* Theme Color */}
        <meta name="theme-color" content="#0069FF" />
        <meta name="color-scheme" content="light" />

        {/* Organization 结构化数据（JSON-LD）*/}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'DaysFromToday',
              'alternateName': 'Days From Today',
              'url': baseUrl,
              'logo': `${baseUrl}/logo.png`,
              'sameAs': [
                'https://github.com/leeleon/daysfromtoday'
              ],
              'description': 'Calculate dates from today with ease',
              'founder': {
                '@type': 'Person',
                'name': 'Leon',
                'url': `${baseUrl}/${locale}/faq`
              },
              'contactPoint': {
                '@type': 'ContactPoint',
                'contactType': 'Customer Support',
                'email': 'feedback@daysfromtoday.com',
                'availableLanguage': ['en', 'zh']
              }
            })
          }}
        />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 强制调试标记（确认布局已渲染）*/}
        <div style={{ display: 'none' }} data-layout-version="2025-01-07-v2" data-ga-id={gaId || 'undefined'}>Layout Active</div>

        <NextIntlClientProvider messages={messages}>
          <main id="main-content" role="main">
            {children}
          </main>
        </NextIntlClientProvider>

        {/* Google Analytics（官方 @next/third-parties 组件）*/}
        {gaId && <GoogleAnalytics gaId={gaId} />}

        {/* GA 路由追踪（追踪 SPA 导航）*/}
        {gaId && <GATracker />}

        {/* 调试组件（部署验证后可删除）*/}
        <GADebug />
      </body>
    </html>
  );
}


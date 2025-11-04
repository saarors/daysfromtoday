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
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';


/**
 * 增强的 Metadata 生成
 * 
 * 功能：
 * 1. 统一的 canonical URL
 * 2. 完整的 hreflang 标签
 * 3. 正确的 metadataBase
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.daysfromtoday.ai';
  
  return {
    metadataBase: new URL(baseUrl),
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
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        zh: '/zh',
        'x-default': '/en',
      },
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
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}


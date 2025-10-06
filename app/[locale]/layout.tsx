/**
 * 多语言根布局组件
 * 
 * 功能：
 * 1. 设置 HTML lang 属性（SEO 重要）
 * 2. 注入 next-intl Provider 提供翻译功能
 * 3. 配置全局字体（Geist Sans 和 Geist Mono）
 * 4. 引入全局样式（Tailwind CSS）
 * 
 * 符合项目规范：
 * - TypeScript 严格模式
 * - SEO 友好（正确的 lang 属性）
 * - 性能优化（字体优化、CSS 优化）
 */
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DaysFromToday - Date Calculator",
  description: "Calculate dates from today with ease. Support for business days, weekdays, and holidays.",
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

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


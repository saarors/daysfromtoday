/**
 * i18n 配置文件
 * 
 * 功能：
 * 1. 定义支持的语言列表（en, zh）
 * 2. 设置默认语言为英文
 * 3. 配置翻译文件加载逻辑
 * 
 * 符合项目规范：
 * - TypeScript 严格模式
 * - 类型安全的语言定义
 * - SEO 友好的语言代码
 */
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 支持的语言列表
export const locales = ['en', 'zh'] as const;

// 默认语言
export const defaultLocale = 'en' as const;

// 语言类型定义
export type Locale = typeof locales[number];

// next-intl 配置
export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的语言
  const locale = await requestLocale;
  
  // 验证语言是否支持
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});


/**
 * Next.js Middleware - 语言检测与路由重写
 * 
 * 功能：
 * 1. 自动检测用户首选语言（基于 Accept-Language header）
 * 2. 根路径 / 自动重定向到 /en 或用户首选语言
 * 3. 处理多语言路由匹配
 * 4. 确保所有页面都有语言前缀（SEO 友好）
 * 
 * 符合项目规范：
 * - SEO 优化：始终显示语言前缀
 * - 性能优化：Edge Runtime 执行
 * - 用户体验：自动语言检测
 */
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale,
  
  // 始终显示语言前缀（/en, /zh），有利于 SEO
  localePrefix: 'always'
});

export const config = {
  // 匹配所有路径，但排除：
  // - /api/* (API 路由)
  // - /_next/* (Next.js 内部文件)
  // - /_vercel/* (Vercel 内部文件)
  // - 所有静态文件（包含点号的文件名，如 .png, .svg, .ico）
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};


/**
 * Next.js Middleware - 增强版本
 * 
 * 功能：
 * 1. Supabase 认证会话管理
 * 2. 防止 *.vercel.app 域名被索引
 * 3. 语言检测与路由
 * 
 * 符合项目规范：
 * - SEO 优化：始终显示语言前缀
 * - 性能优化：Edge Runtime 执行
 * - 用户体验：自动语言检测
 * - 安全优化：防止 Vercel 域名被索引
 */
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // 1. 更新 Supabase 会话
  const supabaseResponse = await updateSession(request);
  
  // 2. 防止 Vercel 默认域名被索引
  if (host.endsWith('.vercel.app')) {
    supabaseResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return supabaseResponse;
  }

  // 3. 应用国际化路由
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，但排除：
  // - /api/* (API 路由)
  // - /_next/* (Next.js 内部文件)
  // - /_vercel/* (Vercel 内部文件)
  // - /auth/callback (认证回调，不需要语言前缀)
  // - /sitemap*.xml (Sitemap 文件)
  // - 所有静态文件（包含点号的文件名，如 .png, .svg, .ico）
  matcher: ['/((?!api|_next|_vercel|auth/callback|sitemap.*\\.xml|.*\\..*).*)']
};


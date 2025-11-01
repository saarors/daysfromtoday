/**
 * 简化版中间件 - Phase 3.5 临时版本
 * 移除 next-intl 依赖，手动处理语言路由
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const locales = ['en', 'zh'];
const defaultLocale = 'en';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. 更新 Supabase 会话
  const supabaseResponse = await updateSession(request);
  
  // 2. 跳过静态文件和 API 路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth/callback') ||
    pathname.includes('.') ||
    pathname === '/test'  // 临时测试页面
  ) {
    return supabaseResponse;
  }
  
  // 3. 检查路径是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // 4. 如果没有语言前缀，重定向到默认语言
  if (!pathnameHasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }
  
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};


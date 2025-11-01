/**
 * Next.js 中间件
 * 
 * 功能：
 * 1. 国际化路由（next-intl）
 * 2. Supabase 会话管理
 * 3. 受保护路由检查（需登录）
 */

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// 国际化配置
const locales = ['en', 'zh'];
const defaultLocale = 'en';

// 需要登录才能访问的路径（Phase 3.5 暂时注释掉，先确保路由正常）
// const PROTECTED_PATHS = ['/wishlist'];

// 创建 next-intl 中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // 所有路径都带语言前缀
});

export default async function middleware(request: NextRequest) {
  // 1. 处理国际化路由
  const response = intlMiddleware(request);
  
  // 2. 更新 Supabase 会话（保持用户登录状态）
  const supabaseResponse = await updateSession(request);
  
  // 3. 合并响应头（保留 Supabase 的 cookie 更新）
  if (supabaseResponse.headers.get('set-cookie')) {
    response.headers.set('set-cookie', supabaseResponse.headers.get('set-cookie')!);
  }
  
  // 4. 受保护路由检查（Phase 3.5 暂时禁用）
  // const { pathname } = request.nextUrl;
  // const isProtectedPath = PROTECTED_PATHS.some(path => 
  //   pathname.includes(path)
  // );
  
  // if (isProtectedPath) {
  //   const user = supabaseResponse.headers.get('x-user-id');
  //   if (!user) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = `/${url.pathname.split('/')[1]}/login`;
  //     return NextResponse.redirect(url);
  //   }
  // }
  
  return response;
}

export const config = {
  // 匹配所有路径，除了以下静态资源
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

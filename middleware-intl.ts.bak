/**
 * Next.js Middleware - Phase 3 版本
 * 
 * 功能：
 * 1. Supabase 认证会话管理
 * 2. 防止 *.vercel.app 域名被索引
 * 3. 语言检测与路由
 * 4. 路径访问控制（公开 vs 受保护）
 * 
 * 符合项目规范：
 * - SEO 优化：始终显示语言前缀
 * - 性能优化：Edge Runtime 执行
 * - 用户体验：自动语言检测
 * - 安全优化：防止 Vercel 域名被索引
 * - 访问控制：愿望清单必须登录，其他可匿名
 */
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

// 公开路径（无需登录即可访问）
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/days',           // 日期计算页面
  '/calculator',     // 日期计算器
  '/blog',           // 博客
  '/holidays',       // 节假日
  '/team',           // 团队博客
  '/',               // 首页（故事发现）
];

// 受保护路径（必须登录才能访问）
// Phase 3.5: 暂时允许匿名访问愿望清单（用于测试）
const PROTECTED_PATHS = [
  // '/wishlist',       // 愿望清单（暂时关闭保护）
];

/**
 * 检查路径是否需要保护
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(path => pathname.includes(path));
}

/**
 * 检查路径是否为公开路径
 */
function isPublicPath(pathname: string): boolean {
  // 首页（/ 或 /zh 或 /en）
  if (pathname === '/' || pathname.match(/^\/(zh|en)\/?$/)) {
    return true;
  }
  
  return PUBLIC_PATHS.some(path => pathname.includes(path));
}

export default async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // 1. 更新 Supabase 会话
  const supabaseResponse = await updateSession(request);
  
  // 2. 防止 Vercel 默认域名被索引
  if (host.endsWith('.vercel.app')) {
    supabaseResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // 3. 检查是否为公开路径 - 直接放行
  if (isPublicPath(pathname)) {
    // 应用国际化后返回
    const intlResponse = intlMiddleware(request);
    
    // 合并 Supabase 的 cookies
    const cookieHeaders = supabaseResponse.headers.getSetCookie();
    cookieHeaders.forEach(cookie => {
      intlResponse.headers.append('Set-Cookie', cookie);
    });
    
    return intlResponse;
  }

  // 4. 检查是否为受保护路径
  if (isProtectedPath(pathname)) {
    // 创建 Supabase 客户端检查会话
    let response = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // 未登录，重定向到登录页
    if (!session) {
      const locale = pathname.split('/')[1] || defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname); // 保存原始路径
      
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. 应用国际化路由
  const intlResponse = intlMiddleware(request);
  
  // 合并 Supabase 的 cookies
  const cookieHeaders = supabaseResponse.headers.getSetCookie();
  cookieHeaders.forEach(cookie => {
    intlResponse.headers.append('Set-Cookie', cookie);
  });
  
  return intlResponse;
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


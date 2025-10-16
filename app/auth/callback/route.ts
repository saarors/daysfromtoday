/**
 * 认证回调路由
 * 处理 Google OAuth 和 Magic Link 的回调
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/en';
  
  if (code) {
    const supabase = createClient();
    
    // 交换 code 获取 session
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // 重定向到目标页面
  return NextResponse.redirect(new URL(redirect, requestUrl.origin));
}

